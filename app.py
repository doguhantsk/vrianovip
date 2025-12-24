from flask import Flask, render_template, request, jsonify, redirect, url_for, session, flash
import sqlite3
from werkzeug.security import generate_password_hash, check_password_hash
from functools import wraps

DB_PATH = 'database.db'

app = Flask(__name__)
app.secret_key = 'bu-cok-gizli-bir-anahtar-degistir'

def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

# --- Yetkilendirme Dekoratörü ---
def admin_required(f):
    @wraps(f)
    def wrapped(*args, **kwargs):
        if not session.get('admin'):
            # API isteği ise JSON dön, sayfa isteği ise login'e at
            if request.path.startswith('/api') or request.path.startswith('/add') or request.path.startswith('/delete'):
                return jsonify({'error': 'unauthorized'}), 401
            return redirect(url_for('login'))
        return f(*args, **kwargs)
    return wrapped

# --- Ana Sayfa ve Koleksiyon Rotaları ---

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/ayakkabi')
def ayakkabi_page():
    conn = get_db()
    # Kategori ID'si 1 olanları çek (Ayakkabı)
    shoes = conn.execute('SELECT * FROM products WHERE category_id = 1').fetchall()
    conn.close()
    return render_template('shoes.html', shoes=[dict(row) for row in shoes])

@app.route('/canta')
def canta_page():
    conn = get_db()
    # Kategori ID'si 2 olanları çek (Çanta)
    bags = conn.execute('SELECT * FROM products WHERE category_id = 2').fetchall()
    conn.close()
    return render_template('bags.html', bags=[dict(row) for row in bags])

@app.route('/offers')
def offers_page():
    conn = get_db()
    # Fırsat olarak işaretlenmiş ürünleri çek (is_offer = 1)
    rows = conn.execute('SELECT * FROM products WHERE is_offer = 1').fetchall()
    conn.close()
    
    # Template 'title' bekliyor ama DB'de 'name' var. Bunu uyumlu hale getirelim.
    offers = []
    for row in rows:
        item = dict(row)
        item['title'] = item['name'] # Template uyumluluğu için
        offers.append(item)
        
    return render_template('offers.html', offers=offers)

# --- Login / Logout İşlemleri ---

@app.route('/login', methods=['GET','POST'])
def login():
    if request.method == 'GET':
        if session.get('admin'):
            return redirect(url_for('admin'))
        return render_template('login.html')
        
    username = request.form.get('username')
    password = request.form.get('password')
    
    conn = get_db()
    user = conn.execute('SELECT * FROM admin_users WHERE username=?', (username,)).fetchone()
    conn.close()
    
    if user and check_password_hash(user['password_hash'], password):
        session['admin'] = True
        return redirect(url_for('admin'))
    
    flash('Geçersiz kullanıcı adı veya şifre')
    return render_template('login.html')

@app.route('/logout')
def logout():
    session.clear()
    return redirect(url_for('index'))

@app.route('/admin')
@admin_required
def admin():
    return render_template('admin.html')

# --- API ENDPOINTS (admin.js ile uyumlu) ---

# 1. Veri Listeleme API'ları
@app.route('/api/shoes')
def api_shoes():
    conn = get_db()
    items = conn.execute('SELECT * FROM products WHERE category_id = 1').fetchall()
    conn.close()
    return jsonify([dict(ix) for ix in items])

@app.route('/api/bags')
def api_bags():
    conn = get_db()
    items = conn.execute('SELECT * FROM products WHERE category_id = 2').fetchall()
    conn.close()
    return jsonify([dict(ix) for ix in items])

@app.route('/api/offers')
def api_offers():
    conn = get_db()
    items = conn.execute('SELECT * FROM products WHERE is_offer = 1').fetchall()
    conn.close()
    # admin.js de offers için 'title' kullanabilir, name'i title olarak da gönderelim
    result = []
    for item in items:
        d = dict(item)
        d['title'] = d['name']
        result.append(d)
    return jsonify(result)

# 2. Ekleme İşlemleri (POST)
def add_product_to_db(category_id, is_offer=0):
    name = request.form.get('name') or request.form.get('title') # admin.js offers için title gönderiyor
    price = request.form.get('price')
    image = request.form.get('image')
    description = request.form.get('description')
    
    conn = get_db()
    conn.execute(
        'INSERT INTO products (name, category_id, price, description, image, is_offer) VALUES (?, ?, ?, ?, ?, ?)',
        (name, category_id, price, description, image, is_offer)
    )
    conn.commit()
    conn.close()
    return jsonify({'status': 'success'})

@app.route('/add_shoe', methods=['POST'])
@admin_required
def add_shoe():
    return add_product_to_db(1)

@app.route('/add_bag', methods=['POST'])
@admin_required
def add_bag():
    return add_product_to_db(2)

@app.route('/add_offer', methods=['POST'])
@admin_required
def add_offer():
    # Fırsatlar özel bir kategori de olabilir veya herhangi bir kategori.
    # Şimdilik kategori 0 veya null diyelim ama is_offer=1 olsun.
    return add_product_to_db(0, is_offer=1)

# 3. Silme İşlemleri (POST - admin.js FormData gönderiyor)
def delete_product_from_db():
    product_id = request.form.get('id')
    conn = get_db()
    conn.execute('DELETE FROM products WHERE id = ?', (product_id,))
    conn.commit()
    conn.close()
    return jsonify({'status': 'deleted'})

@app.route('/delete_shoe', methods=['POST'])
@admin_required
def delete_shoe():
    return delete_product_from_db()

@app.route('/delete_bag', methods=['POST'])
@admin_required
def delete_bag():
    return delete_product_from_db()

@app.route('/delete_offer', methods=['POST'])
@admin_required
def delete_offer():
    return delete_product_from_db()

if __name__ == '__main__':
    app.run(debug=True)