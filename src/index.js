require('dotenv').config()
const express = require('express')
const session = require('express-session')
const bodyParser = require('body-parser')
const path = require('path')
const { init, db } = require('./db')

const adminRoutes = require('./routes/admin')
const publicRoutes = require('./routes/public')

const app = express()

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(express.static(path.join(__dirname, 'public')))

app.use(session({
  secret: process.env.SESSION_SECRET || 'keyboard cat',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false }
}))

app.use(async (req, res, next) => {
  if (!db.data) await init()
  req.db = db
  next()
})

app.use('/admin', adminRoutes)
app.use('/', publicRoutes)

const port = process.env.PORT || 3000
app.listen(port, () => console.log(`Server running on http://localhost:${port}`))
