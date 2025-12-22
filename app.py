from flask import Flask, render_template, request, jsonify, redirect, url_for, session
import sqlite3
from werkzeug.security import generate_password_hash, check_password_hash
from functools import wraps

DB_PATH = 'database.db'

app = Flask(__name__)
app.secret_key = 'change-this-secret'

def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def admin_required(f):
    @wraps(f)
    def wrapped(*args, **kwargs):
        if not session.get('admin'):
            return jsonify({'error':'unauthorized'}), 401
        return f(*args, **kwargs)
    return wrapped

@app.route('/')
def index():
    return render_template('index.html')


@app.route('/offers')
def offers_page():
    return render_template('offers.html')


@app.route('/ayakkabi')
def ayakkabi_page():
    return render_template('shoes.html')


@app.route('/canta')
def canta_page():
    return render_template('bags.html')

@app.route('/login', methods=['GET','POST'])
def login():
    if request.method == 'GET':
        return render_template('login.html')
    username = request.form.get('username')
    password = request.form.get('password')
    conn = get_db()
    cur = conn.execute('SELECT * FROM admin_users WHERE username=?', (username,))
    row = cur.fetchone()
    conn.close()
    if row and check_password_hash(row['password_hash'], password):
        session['admin'] = True
        session['username'] = username
        return redirect(url_for('admin'))
    return render_template('login.html', error='Invalid credentials')

@app.route('/logout')
def logout():
    session.clear()
    return redirect(url_for('index'))

@app.route('/admin')
def admin():
    if not session.get('admin'):
        return redirect(url_for('login'))
    return render_template('admin.html')

@app.route('/api/products', methods=['GET','POST'])
def api_products():
    conn = get_db()
    if request.method == 'GET':
        cur = conn.execute('SELECT p.*, c.name as category_name FROM products p LEFT JOIN categories c ON p.category_id=c.id')
        rows = [dict(r) for r in cur.fetchall()]
        conn.close()
        return jsonify(rows)
    # POST -> add product (admin only)
    if not session.get('admin'):
        conn.close()
        return jsonify({'error':'unauthorized'}), 401
    data = request.get_json() or {}
    name = data.get('name')
    category_id = data.get('category_id')
    price = data.get('price', 0)
    description = data.get('description','')
    image = data.get('image','')
    is_offer = 1 if data.get('is_offer') else 0
    cur = conn.execute('INSERT INTO products (name,category_id,price,description,image,is_offer) VALUES (?,?,?,?,?,?)',
                       (name, category_id, price, description, image, is_offer))
    conn.commit()
    pid = cur.lastrowid
    conn.close()
    return jsonify({'id': pid})

@app.route('/api/products/<int:pid>', methods=['DELETE'])
@admin_required
def api_delete_product(pid):
    conn = get_db()
    conn.execute('DELETE FROM products WHERE id=?', (pid,))
    conn.commit()
    conn.close()
    return jsonify({'deleted': pid})

@app.route('/api/categories')
def api_categories():
    conn = get_db()
    cur = conn.execute('SELECT * FROM categories')
    rows = [dict(r) for r in cur.fetchall()]
    conn.close()
    return jsonify(rows)

if __name__ == '__main__':
    app.run(debug=True)
# --- API ENDPOINTS (Admin Paneli İçin JSON Veri) ---
@app.route('/api/shoes')
def api_shoes():
    conn = get_db_connection()
    items = conn.execute('SELECT * FROM shoes').fetchall()
    conn.close()
    return jsonify([dict(ix) for ix in items])

@app.route('/api/bags')
def api_bags():
    conn = get_db_connection()
    items = conn.execute('SELECT * FROM bags').fetchall()
    conn.close()
    return jsonify([dict(ix) for ix in items])

@app.route('/api/offers')
def api_offers():
    conn = get_db_connection()
    items = conn.execute('SELECT * FROM offers').fetchall()
    conn.close()
    return jsonify([dict(ix) for ix in items])