import sqlite3
from werkzeug.security import generate_password_hash

DB_PATH = 'database.db'

def init_db():
    conn = sqlite3.connect(DB_PATH)
    cur = conn.cursor()
    cur.execute('''CREATE TABLE IF NOT EXISTS admin_users (
        id INTEGER PRIMARY KEY,
        username TEXT UNIQUE,
        password_hash TEXT
    )''')
    cur.execute('''CREATE TABLE IF NOT EXISTS categories (
        id INTEGER PRIMARY KEY,
        name TEXT
    )''')
    cur.execute('''CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY,
        name TEXT,
        category_id INTEGER,
        price REAL,
        description TEXT,
        image TEXT,
        is_offer INTEGER DEFAULT 0
    )''')
    # default admin (change password after first run)
    try:
        cur.execute('INSERT INTO admin_users (username,password_hash) VALUES (?,?)',
                    ('admin', generate_password_hash('adminpass')))
    except Exception:
        pass
    # categories
    cur.execute('INSERT OR IGNORE INTO categories (id,name) VALUES (1, ?)', ('Ayakkabı',))
    cur.execute('INSERT OR IGNORE INTO categories (id,name) VALUES (2, ?)', ('Çanta',))
    # sample products
    cur.execute('INSERT OR IGNORE INTO products (id,name,category_id,price,description,is_offer) VALUES (1,?,?,?,?,?)',
                ( 'Siyah Sneaker', 1, 299.99, 'Rahat günlük sneaker', 0))
    cur.execute('INSERT OR IGNORE INTO products (id,name,category_id,price,description,is_offer) VALUES (2,?,?,?,?,?)',
                ( 'Deriden Çanta', 2, 499.0, 'Şık deri omuz çantası', 1))
    conn.commit()
    conn.close()
    print('Initialized database at', DB_PATH)

if __name__ == '__main__':
    init_db()
