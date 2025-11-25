# Project Guidelines

## i18n - Internationalization

**RULE: No hardcoded text in code**

All user-facing text MUST be stored in the i18n translation files:
- `packages/ui/src/locales/fr.json` (French)
- `packages/ui/src/locales/en.json` (English)

### Usage

```tsx
import { useTranslation } from '@daviani/ui';

function MyComponent() {
  const { t } = useTranslation();

  return <h1>{t('pages.myPage.title')}</h1>;
}
```

### Adding new translations

1. Add the key in both `fr.json` and `en.json`
2. Use the `t()` function to display the text
3. Never write text directly in JSX like `<h1>My Title</h1>`

### Structure

```json
{
  "common": { },      // Shared translations (buttons, labels, etc.)
  "darkMode": { },    // Theme-related translations
  "home": { },        // Homepage translations
  "nav": { },         // Navigation items
  "pages": { }        // Page-specific translations
}
```
