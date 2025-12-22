const express = require('express')
const router = express.Router()
const nodemailer = require('nodemailer')

router.get('/', (req, res) => {
  const site = req.db.data.site
  const home = req.db.data.pages.home || { content: '' }
  const seo = site.seo && site.seo.home ? site.seo.home : { title: site.title, description: site.description }
  res.render('public/home', { site, page: home, seo })
})

router.get('/about', (req, res) => {
  const site = req.db.data.site
  const about = req.db.data.pages.about || { content: '' }
  const seo = site.seo && site.seo.about ? site.seo.about : { title: 'About', description: site.description }
  res.render('public/about', { site, page: about, seo })
})

router.get('/contact', (req, res) => {
  const site = req.db.data.site
  const seo = { title: 'Contact', description: site.description }
  res.render('public/contact', { site, seo, error: null, success: null })
})

router.post('/contact', async (req, res) => {
  const { name, email, message } = req.body
  const site = req.db.data.site
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: (process.env.SMTP_SECURE === 'true'),
    auth: process.env.SMTP_USER ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS } : undefined
  })

  const mailOptions = {
    from: process.env.MAIL_FROM || 'no-reply@example.com',
    to: process.env.MAIL_TO || site.mail_to || process.env.MAIL_TO,
    subject: `Contact form: ${name}`,
    text: `From: ${name} <${email}>\n\n${message}`
  }

  try {
    if (!process.env.SMTP_HOST) throw new Error('SMTP not configured')
    await transporter.sendMail(mailOptions)
    res.render('public/contact', { site, seo: { title: 'Contact' }, success: 'Message sent', error: null })
  } catch (err) {
    res.render('public/contact', { site, seo: { title: 'Contact' }, success: null, error: 'Mail sending not configured or failed' })
  }
})

module.exports = router
