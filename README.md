Showroom Backend

Minimal Express backend for a showroom site with an admin panel (admin-only), SEO-friendly server-side rendering, contact mail integration, location and WhatsApp support.

Quick start

1. Copy `.env.example` to `.env` and fill values.
2. Install dependencies:

```bash
npm install
```

3. Run in dev:

```bash
npm run dev
```

Admin
- Admin login is at `/admin/login`. No registration. Set `ADMIN_USER` and `ADMIN_PASS` in `.env`.

Mail
- Set SMTP_* vars in `.env`. The contact form will send mail to `MAIL_TO`.
