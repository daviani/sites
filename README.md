# daviani.dev

> Portfolio multi-tenant avec Next.js 16, Turborepo et architecture sécurisée

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Turborepo](https://img.shields.io/badge/Turborepo-2.1-EF4444?logo=turborepo)](https://turbo.build/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)

---

## 🎯 Vue d'ensemble

Portfolio professionnel démontrant une expertise Full-Stack et DevOps. Architecture monorepo multi-tenant avec Next.js 16, sécurité renforcée et performance optimale.

### Domaines

| Domaine | Description |
|---------|-------------|
| `daviani.dev` | Homepage et projets |
| `blog.daviani.dev` | Articles techniques |
| `contact.daviani.dev` | Formulaire de contact |
| `rdv.daviani.dev` | Prise de rendez-vous |
| `cv.daviani.dev` | CV interactif |
| `legal.daviani.dev` | Mentions légales |

---

## 🏗️ Stack

**Frontend**
- Next.js 16 (App Router, React 19)
- TypeScript 5 (strict)
- Tailwind CSS 4

**Backend & Infra**
- Vercel (Edge + Serverless)
- Cloudflare (DNS, WAF, CDN)
- iCloud Custom Domain (email)
- Vercel KV (cache/rate limiting)

**Tooling**
- Turborepo + pnpm workspaces
- ESLint, Prettier
- Vitest, Playwright
- GitHub Actions

---

## 📁 Structure

```
daviani-dev/
├── .doc/                   # Documentation technique
├── apps/
│   └── web/                # Next.js App Router
│       ├── app/
│       │   ├── (marketing)/
│       │   ├── (blog)/
│       │   ├── (contact)/
│       │   ├── (rdv)/
│       │   ├── (cv)/
│       │   └── (legal)/
│       └── middleware.ts   # Routing multi-domaines
├── packages/
│   ├── ui/                 # Composants partagés
│   ├── config/             # Config ESLint, TS
│   ├── emails/             # Templates email
│   └── content/            # Schémas CV, projets
├── turbo.json
├── pnpm-workspace.yaml
└── CONTRIBUTING.md
```

---

## 🚀 Démarrage

### Prérequis

- Node.js ≥ 20.0.0
- pnpm ≥ 8.0.0

### Installation

```bash
git clone https://github.com/username/daviani-dev.git
cd daviani-dev
pnpm install
```

### Développement

```bash
pnpm dev
# Ouvrir http://localhost:3000
```

### Build

```bash
pnpm build
pnpm start
```

---

## 🧪 Commandes

| Commande | Description |
|----------|-------------|
| `pnpm dev` | Serveur de développement |
| `pnpm build` | Build production |
| `pnpm lint` | Linting |
| `pnpm test` | Tests unitaires |
| `pnpm test:e2e` | Tests E2E |
| `pnpm clean` | Nettoyage |

---

## 🔒 Sécurité

- Headers CSP strict
- HSTS, X-Frame-Options
- Rate limiting (Vercel KV)
- ReCaptcha v3 + Honeypot
- Cloudflare WAF

---

## 📊 Performance

**Objectifs Lighthouse : ≥ 95** (Perf, A11y, Best Practices, SEO)

- SSG pour pages statiques
- Code splitting automatique
- Cloudflare CDN + cache
- Compression Brotli

---

## 📝 License

MIT - Voir [LICENSE](./LICENSE)

---

**Auteur** : Daviani Fillatre
**Contact** : hello@daviani.dev
**Status** : 🚧 En développement
