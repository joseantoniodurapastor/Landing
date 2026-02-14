# Atlas Estratégico — IA Feroz

Landing page de captura de lead para el ebook **"Atlas Estratégico de Modelos Operativos para Agencias Boutique"**.

## Stack
- HTML / CSS / JavaScript (estático, sin frameworks)
- Vercel (deployment)

## Setup Local
```bash
npx -y serve .
```

## Deployment
Push a `main` → Vercel deploya automáticamente a producción.

**Dominio:** https://ebook.iaferoz.com

## SEO
- Sitemap: `/sitemap.xml`
- Robots: `/robots.txt`
- Structured Data: JSON-LD (WebPage, Offer, Organization)
- Open Graph + Twitter Cards

## Webhook
El formulario hace POST a un webhook n8n. Reemplazar `WEBHOOK_URL` en `script.js`.

---
IA Feroz © 2026
