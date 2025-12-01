# Claude Code - Règles de développement

## Workflow de développement

### Règles strictes à respecter

1. **Une feature à la fois**
   - Implémenter une seule fonctionnalité complètement avant de passer à la suivante
   - Ne jamais mélanger plusieurs features dans un même cycle de développement

2. **Workflow de validation**
   - ❌ **INTERDICTION** de proposer un commit avant que l'utilisateur ait testé
   - Développer la feature complètement
   - Attendre que l'utilisateur teste et valide
   - Ensuite créer les tests liés à la feature
   - Proposer le commit uniquement après validation

3. **Format des commits**
   - ❌ **INTERDICTION ABSOLUE** de se citer dans les commits
   - ❌ Pas de "🤖 Generated with Claude Code"
   - ❌ Pas de "Co-Authored-By: Claude <noreply@anthropic.com>"
   - ✅ Messages de commit clairs et concis au format conventional commits
   - ✅ Inclure la feature ET ses tests dans le même commit

### Format de commit attendu

```
type(scope): description concise

- Détail de l'implémentation
- Détail des tests ajoutés
- Autres changements nécessaires
```

**Types acceptés :** feat, fix, docs, style, refactor, test, chore

### Exemple de bon commit

```
feat(ui): add dark mode toggle component

- Create DarkModeToggle component with theme persistence
- Implement useTheme hook with localStorage sync
- Add theme provider wrapper in root layout
- Add tests for theme switching and persistence
- Add tests for component rendering in both themes
```

## Commandes

```bash
pnpm dev          # Lancer le dev server
pnpm build        # Build production
pnpm test         # Lancer les tests
pnpm lint         # Vérifier le linting
pnpm typecheck    # Vérifier les types TypeScript
```

## i18n - Internationalisation

- **Fichiers** : `packages/ui/src/locales/{fr,en}.json`
- **Hook** : `useTranslation()` de `@daviani/ui`
- ❌ Jamais de texte hardcodé dans le JSX
- ✅ Toujours utiliser `t('key.path')` pour les textes visibles

### Structure des traductions

```json
{
  "common": { },      // Boutons, labels partagés
  "darkMode": { },    // Thème
  "home": { },        // Page d'accueil
  "nav": { },         // Navigation
  "pages": { }        // Pages spécifiques
}
```

## Conventions de code

- **Composants** : PascalCase (`DarkModeToggle.tsx`)
- **Hooks** : camelCase avec préfixe `use` (`useTheme.ts`)
- **Utilitaires** : camelCase (`formatDate.ts`)
- **Tests** : `__tests__/*.test.tsx` dans le même package
- **Types** : `types/` ou colocalisés avec le composant

## Librairies préférées

| Usage | Librairie |
|-------|-----------|
| Animations | `framer-motion` |
| Formulaires | `react-hook-form` + `zod` |
| Tests | `vitest` + `@testing-library/react` |
| Icons | Composants SVG custom ou `lucide-react` |
| Date | `date-fns` |

## Contexte du projet

**Projet :** daviani.dev - Portfolio multi-tenant
**Stack :** Turborepo + Next.js 16 + React 19 + TypeScript + Tailwind CSS 4
**État actuel :** Semaine 1 - Foundations (en cours)

## Design et inspiration

### Référence principale : nordtheme.com
- S'inspirer du design du site https://www.nordtheme.com pour les composants UI
- Utiliser la palette de couleurs Nord (nord0-nord15)
- Focus sur la simplicité et l'élégance minimaliste
- Toggle dark/light mode inspiré du design nordtheme.com

## UX/UI - Règles de design

### Principes fondamentaux
- **Minimalisme** : Moins c'est plus. Éviter le clutter visuel
- **Cohérence** : Mêmes patterns partout (espacements, couleurs, interactions)
- **Hiérarchie claire** : L'œil doit savoir où regarder en premier

### Accessibilité (a11y)
- ✅ Contraste minimum WCAG AA (4.5:1 pour le texte)
- ✅ Focus visible sur tous les éléments interactifs
- ✅ Labels sur tous les inputs (pas de placeholder seul)
- ✅ Textes alternatifs sur les images
- ✅ Navigation au clavier fonctionnelle
- ✅ `prefers-reduced-motion` respecté pour les animations

### Responsive
- Mobile-first : partir du mobile, enrichir pour desktop
- Breakpoints : `sm:640px`, `md:768px`, `lg:1024px`, `xl:1280px`
- Touch targets minimum : 44x44px sur mobile
- Pas de scroll horizontal

### Animations (framer-motion)
- **Subtiles** : durée 150-300ms max
- **Purposeful** : chaque animation a un but (feedback, transition, attention)
- **Respecter** `prefers-reduced-motion`
- Éviter les animations sur les éléments critiques (CTA, formulaires)

```tsx
// Exemple de transition standard
const transition = { duration: 0.2, ease: "easeOut" }
```

### Espacements
- Utiliser l'échelle Tailwind : `4, 8, 12, 16, 24, 32, 48, 64`
- Espacement cohérent entre sections : `py-16` ou `py-24`
- Marges internes des cards : `p-6` ou `p-8`

### Typographie
- Hiérarchie claire : h1 > h2 > h3 > body
- Line-height confortable : `leading-relaxed` pour le body
- Max-width pour la lisibilité : `max-w-prose` (~65 caractères)

### Composants interactifs
- États visibles : `hover`, `focus`, `active`, `disabled`
- Feedback immédiat sur les actions (loading states)
- Messages d'erreur clairs et positionnés près du champ concerné
- Boutons : padding généreux, texte lisible, icône optionnelle

## Objectifs Semaine 1 - Foundations

Voir le plan détaillé dans `.doc/plan-master-daviani-dev-v4.md`

### Référence structure attendue

```
daviani-dev/
├── apps/
│   └── web/                   # Next.js App Router
│       ├── app/
│       │   ├── (marketing)/   # daviani.dev
│       │   ├── (blog)/        # blog.daviani.dev
│       │   ├── (contact)/     # contact.daviani.dev
│       │   ├── (rdv)/         # rdv.daviani.dev
│       │   ├── (cv)/          # cv.daviani.dev
│       │   └── (legal)/       # legal.daviani.dev
│       └── middleware.ts      # Routing multi-domaines
├── packages/
│   ├── ui/                    # Design system partagé
│   ├── config/                # Config ESLint, TS
│   ├── emails/                # Templates email
│   └── content/               # Schémas CV, projets
```
