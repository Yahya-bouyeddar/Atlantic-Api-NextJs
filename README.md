# ATLANTIC PDF - Next.js (Front + API)

Projet unique Next.js : frontend et API (génération PDF, Excel, attestations) déployables ensemble sur **Vercel**.

## Prérequis

- Node.js 18+
- pnpm (ou npm)

## Installation

```bash
cd C:\Users\DELL\Documents\ProjetPdfGerenerator
pnpm install
```

## Développement local

```bash
pnpm dev
```

Ouvrir [http://localhost:3000](http://localhost:3000).

- **Front** : formulaire, upload Excel, aperçu, génération PDF.
- **API** : mêmes chemins qu’avant, sous `/api/bon/` (template, preview-excel, generate-from-excel, generate, preview, docs, preview-html).

## Build & production

```bash
pnpm build
pnpm start
```

## Déploiement sur Vercel

1. Importer le projet depuis Git ou le dossier local.
2. Build command : `pnpm build` (ou `npm run build`).
3. Output directory : `.next` (défaut Next.js).
4. Les API routes et le front tournent sur le même domaine ; pas de CORS ni d’URL backend à configurer.

## Structure

- `src/app/` : pages (page.js), layout, styles.
- `src/app/api/bon/` : routes API (template, generate, preview-excel, generate-from-excel, preview, docs, preview-html).
- `src/components/` : composants React (ex. Select).
- `src/lib/` : apiFetch, utils.
- `lib/` : logique backend (pdf.service, excel.service, template.service, validation, errorHandler).
- `public/` : logo, template Excel, polices (à copier depuis l’ancien backend si besoin).

## Notes

- En local, la génération PDF utilise Puppeteer (Chromium).
- Sur Vercel, elle utilise `@sparticuz/chromium` (serverless). Timeout possible sur l’offre gratuite ; augmenter si besoin dans les options du projet Vercel.
