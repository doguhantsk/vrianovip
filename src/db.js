const fs = require('fs')
const path = require('path')

const file = path.join(__dirname, '..', 'data', 'db.json')
const dir = path.dirname(file)
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })

const defaultData = {
  site: {
    title: 'Showroom',
    description: 'Showroom site',
    whatsapp: '',
    location: '',
    mail_to: '',
    seo: {
      home: { title: 'Showroom', description: 'Welcome to our showroom' },
      about: { title: 'About Us', description: 'About' }
    }
  },
  pages: {
    home: { content: '<h2>Welcome</h2><p>Showroom home content</p>' },
    about: { content: '<p>About us</p>' }
  }
}

const db = {
  data: null,
  read: async function () {
    if (this.data) return this.data
    try {
      const raw = fs.readFileSync(file, 'utf8')
      this.data = raw ? JSON.parse(raw) : JSON.parse(JSON.stringify(defaultData))
    } catch (e) {
      this.data = JSON.parse(JSON.stringify(defaultData))
      await this.write()
    }
    return this.data
  },
  write: async function () {
    fs.writeFileSync(file, JSON.stringify(this.data, null, 2), 'utf8')
  }
}

async function init() {
  await db.read()
}

module.exports = { db, init }
