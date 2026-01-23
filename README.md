# daviani.dev

> Portfolio multi-domaines avec Next.js 16, Turborepo et architecture sécurisée

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Turborepo](https://img.shields.io/badge/Turborepo-2.6-EF4444?logo=turborepo)](https://turbo.build/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)

---

## Vue d'ensemble

Portfolio professionnel démontrant une expertise Full-Stack et DevOps. Architecture monorepo multi-domaines avec Next.js 16, sécurité renforcée et performance optimale.

### Domaines

| Domaine | Description |
|---------|-------------|
| `daviani.dev` | Homepage |
| `about.daviani.dev` | À propos |
| `blog.daviani.dev` | Articles techniques |
| `contact.daviani.dev` | Formulaire de contact |
| `rdv.daviani.dev` | Prise de rendez-vous |
| `cv.daviani.dev` | CV interactif |
| `photos.daviani.dev` | Galerie photo (accès discret) |
| `legal.daviani.dev` | Mentions légales RGPD |
| `accessibility.daviani.dev` | Déclaration d'accessibilité |
| `sitemap.daviani.dev` | Plan du site |
| `help.daviani.dev` | Aide à la navigation |

---

## Stack

**Frontend**
- Next.js 16 (App Router, React 19)
- TypeScript 5 (strict)
- Tailwind CSS 4
- Framer Motion

**Backend & Infra**
- Vercel (Edge + Serverless)
- Cloudflare (DNS, WAF, CDN)
- iCloud Custom Domain (email)
- Vercel KV (rate limiting)

**Tooling**
- Turborepo + pnpm workspaces
- ESLint 9, Prettier
- Vitest + Testing Library (unit tests)
- Playwright + axe-core (E2E + accessibility)
- GitHub Actions (5 parallel jobs)

---

## Structure

```
daviani-dev/
├── .doc/                   # Documentation technique
├── apps/
│   └── web/                # Next.js App Router
│       ├── app/
│       │   ├── about/
│       │   ├── blog/
│       │   ├── contact/
│       │   ├── rdv/
│       │   ├── cv/
│       │   ├── photos/
│       │   ├── legal/
│       │   ├── accessibility/
│       │   ├── sitemap/
│       │   └── help/
│       ├── components/
│       ├── lib/
│       └── middleware.ts   # Routing multi-domaines
├── packages/
│   ├── ui/                 # Design system (Nord Theme)
│   └── config/             # Config ESLint, TS
├── turbo.json
└── pnpm-workspace.yaml
```

---

## Démarrage

### Prérequis

- Node.js >= 20.0.0
- pnpm >= 10.0.0

### Installation

```bash
git clone https://github.com/daviani/sites.git
cd sites
pnpm install
```

### Développement

```bash
pnpm dev
# http://localhost:3000
```

### Build

```bash
pnpm build
pnpm start
```

---

## Commandes

| Commande | Description |
|----------|-------------|
| `pnpm dev` | Serveur de développement |
| `pnpm build` | Build production |
| `pnpm lint` | Linting |
| `pnpm typecheck` | Vérification TypeScript |

### Tests

| Commande | Description |
|----------|-------------|
| `pnpm test` | Tests unitaires (Vitest) |
| `pnpm test:watch` | Mode watch |
| `pnpm test:coverage` | Avec rapport de couverture |
| `pnpm test:ui` | Interface graphique Vitest |
| `pnpm test:e2e` | Tests E2E (Playwright) |
| `pnpm test:e2e:ui` | Interface graphique Playwright |
| `pnpm test:e2e:headed` | Playwright avec navigateurs visibles |
| `pnpm test:a11y` | Tests accessibilité WCAG AA |
| `pnpm test:all` | Unit + E2E + A11y |

---

## Accessibilité

- Skip-link pour navigation clavier
- Conformité RGAA 4.1 / WCAG 2.1 AA
- Support i18n (FR/EN)
- Mode sombre (Nord Theme)
- Déclaration d'accessibilité
- Page d'aide à la navigation

---

## Sécurité

- Headers CSP strict
- HSTS, X-Frame-Options
- Rate limiting (Vercel KV)
- ReCaptcha v3 + Honeypot
- Cloudflare WAF
- Conformité RGPD

---

## Performance

**Objectifs Lighthouse : >= 95** (Perf, A11y, Best Practices, SEO)

- SSG pour pages statiques
- Code splitting automatique
- Cloudflare CDN + cache
- Compression Brotli

---

## License

MIT - Voir [LICENSE](./LICENSE)

---

**Auteur** : Daviani Fillatre
**Contact** : hello@daviani.dev
**Status** : En développement