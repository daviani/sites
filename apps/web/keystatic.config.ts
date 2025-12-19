import { config, collection, fields, LocalConfig, GitHubConfig } from '@keystatic/core';

const isDev = process.env.NODE_ENV === 'development';

/**
 * Storage configuration based on environment:
 * - Development: local storage (no auth needed, easy for contributors)
 * - Production: GitHub storage with OAuth (only repo owner can edit)
 */
const storage: LocalConfig['storage'] | GitHubConfig['storage'] = isDev
  ? { kind: 'local' }
  : {
      kind: 'github',
      repo: 'daviani/sites',
    };

/**
 * Content paths based on environment:
 * - Development: content/posts/local/* (local articles for testing)
 * - Production: apps/web/content/posts/* (real articles - path relative to repo root for GitHub storage)
 */
const postsPath = isDev ? 'content/posts/local/*' : 'apps/web/content/posts/*';

export default config({
  storage,
  collections: {
    posts: collection({
      label: 'Articles',
      slugField: 'slug',
      path: postsPath,
      format: { contentField: 'content' },
      schema: {
        // Identification
        slug: fields.slug({ name: { label: 'Slug (URL)' } }),
        publishedAt: fields.date({ label: 'Date de publication' }),
        featured: fields.checkbox({
          label: 'Article mis en avant',
          defaultValue: false,
        }),

        // Titre et extrait FR
        titleFr: fields.text({
          label: 'Titre (FR)',
          validation: { isRequired: true },
        }),
        excerptFr: fields.text({
          label: 'Extrait (FR)',
          multiline: true,
        }),

        // Titre et extrait EN
        titleEn: fields.text({
          label: 'Title (EN)',
          validation: { isRequired: true },
        }),
        excerptEn: fields.text({
          label: 'Excerpt (EN)',
          multiline: true,
        }),

        // Tags
        tags: fields.array(fields.text({ label: 'Tag' }), {
          label: 'Tags',
          itemLabel: (props) => props.value || 'Nouveau tag',
        }),

        // Contenu principal (FR par défaut)
        content: fields.markdoc({
          label: 'Contenu (FR)',
          options: {
            heading: [2, 3, 4],
          },
        }),

        // Contenu EN (optionnel, dans un sous-dossier)
        contentEn: fields.markdoc({
          label: 'Content (EN)',
          options: {
            heading: [2, 3, 4],
          },
        }),
      },
    }),
  },
});