const express = require('express')
const router = express.Router()

function ensureAdmin(req, res, next) {
  if (req.session && req.session.isAdmin) return next()
  return res.redirect('/admin/login')
}

router.get('/login', (req, res) => {
  res.render('admin/login', { error: null })
})

router.post('/login', (req, res) => {
  const { user, pass } = req.body
  const ADMIN_USER = process.env.ADMIN_USER || 'admin'
  const ADMIN_PASS = process.env.ADMIN_PASS || 'changeme'
  if (user === ADMIN_USER && pass === ADMIN_PASS) {
    req.session.isAdmin = true
    return res.redirect('/admin')
  }
  return res.render('admin/login', { error: 'Invalid credentials' })
})

router.get('/logout', (req, res) => {
  req.session.destroy(() => res.redirect('/'))
})

router.get('/', ensureAdmin, (req, res) => {
  const site = req.db.data.site
  const pages = req.db.data.pages
  res.render('admin/dashboard', { site, pages })
})

router.post('/save-site', ensureAdmin, async (req, res) => {
  const { title, description, whatsapp, location, mail_to } = req.body
  req.db.data.site = req.db.data.site || {}
  Object.assign(req.db.data.site, { title, description, whatsapp, location, mail_to })
  await req.db.write()
  res.redirect('/admin')
})

router.post('/save-page/:page', ensureAdmin, async (req, res) => {
  const page = req.params.page
  const { content, seo_title, seo_description } = req.body
  req.db.data.pages = req.db.data.pages || {}
  req.db.data.pages[page] = req.db.data.pages[page] || {}
  req.db.data.pages[page].content = content
  req.db.data.site.seo = req.db.data.site.seo || {}
  req.db.data.site.seo[page] = { title: seo_title, description: seo_description }
  await req.db.write()
  res.redirect('/admin')
})

module.exports = router
