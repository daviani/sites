# daviani.dev

> Portfolio professionnel avec Next.js 16, Turborepo et le design system @tulikettu/ui

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Turborepo](https://img.shields.io/badge/Turborepo-2.1-EF4444?logo=turborepo)](https://turbo.build/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)

---

## Vue d'ensemble

Portfolio professionnel démontrant une expertise Full-Stack et DevOps. Architecture monorepo avec Next.js 16, design system découplé (`@tulikettu/ui`), i18n FR/EN, dark mode sans FOUC, sécurité renforcée et performance optimale.

### Routes

| Route | Description |
|-------|-------------|
| `/` | Homepage |
| `/about` | À propos |
| `/blog` | Articles techniques (Markdoc, illustrations SVG bi-thème) |
| `/projets` | Projets et réalisations |
| `/contributions` | Contributions open-source |
| `/contact` | Formulaire de contact sécurisé |
| `/cv` | CV interactif + export PDF |
| `/photos` | Galerie photo |
| `/legal` | Mentions légales RGPD |
| `/accessibility` | Déclaration d'accessibilité RGAA |
| `/plan-du-site` | Plan du site |
| `/help` | Aide à la navigation |

---

## Stack

**Frontend**
- Next.js 16 (App Router, React 19)
- TypeScript 5 (strict)
- Tailwind CSS 4 (design tokens, glass-card utility)
- Framer Motion

**Design System — `@tulikettu/ui`**
- Composants génériques : Header, Footer, SubHeader, Card, Button, IconButton, Breadcrumb, ScrollToTop, etc.
- Palette Tulikettu (froide boréale) : modes **Päivä** (clair) / **Kaamos** (sombre), tokens `--tuli-*` (`constants/tuli-colors.ts`)
- Dark mode (class-based, script bloquant anti-FOUC)
- i18n découplé : le design system expose un `TranslationProvider` injectable, les traductions app restent dans `apps/web/locales/`
- Easter eggs : Konami Code, Matrix Rain, Confetti

**Backend & Infra**
- Vercel (Edge + Serverless)
- Cloudflare (DNS, WAF, CDN)
- iCloud Custom Domain (email)
- Vercel KV (rate limiting)
- Resend (transactional emails)

**Tooling**
- Turborepo + pnpm workspaces
- ESLint 9, Prettier
- Vitest + Testing Library
- Playwright + axe-core (E2E + accessibility)
- GitHub Actions CI (Unit Tests, Lint/Type/Build, E2E, Accessibility, Smoke, Deploy)

---

## Structure

```
sites/
├── apps/
│   └── web/                    # Next.js App Router
│       ├── app/
│       │   └── (site)/         # about, blog, projets, contributions, contact,
│       │                       # cv, photos, legal, accessibility,
│       │                       # plan-du-site, help
│       ├── components/         # Composants métier (OwlLogo, ContactForm, ConsentGate...)
│       ├── content/            # Articles blog (Markdoc), projets, contributions
│       ├── hooks/              # Hooks app (useLanguage, useConsoleMessage...)
│       ├── locales/            # Traductions FR/EN (app-specific)
│       └── lib/                # markdoc.tsx, images, i18n server...
├── packages/
│   ├── ui/                     # @tulikettu/ui — Design system découplé
│   │   ├── src/
│   │   │   ├── components/     # Composants génériques
│   │   │   ├── hooks/          # useTheme, useTranslation, useMatrixRain...
│   │   │   └── constants/      # Tokens Tulikettu (tuli-colors.ts) + Nord (base)
│   │   └── __tests__/
│   └── config/                 # @tulikettu/config — ESLint, TypeScript
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
- Support i18n (FR/EN) avec cookies
- Mode sombre (Kaamos, sans flash)
- Déclaration d'accessibilité
- Page d'aide à la navigation
- Tests axe-core automatisés en CI

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
- Dark mode sans FOUC (script bloquant)

---

## License

MIT - Voir [LICENSE](./LICENSE)

---

**Auteur** : Daviani Fillatre
**Contact** : hello@daviani.dev
