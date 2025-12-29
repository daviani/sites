import { config, collection, fields, LocalConfig, GitHubConfig } from '@keystatic/core';

const isProd = process.env.NODE_ENV === 'production';

/**
 * Storage configuration based on environment:
 * - Development: local storage (no auth needed, easy for contributors)
 * - Production: GitHub storage with OAuth (only repo owner can edit)
 */
const storage: LocalConfig['storage'] | GitHubConfig['storage'] = isProd
  ? {
      kind: 'github',
      repo: 'daviani/sites',
    }
  : { kind: 'local' };

/**
 * Content paths based on environment:
 * - Development/Test: content/posts/local/* (local articles for testing)
 * - Production: apps/web/content/posts/* (real articles - path relative to repo root for GitHub storage)
 */
const postsPath = isProd ? 'apps/web/content/posts/*' : 'content/posts/local/*';
const photosPath = isProd ? 'apps/web/content/photos/*' : 'content/photos/local/*';

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
    photos: collection({
      label: 'Photos',
      slugField: 'title',
      path: photosPath,
      format: { data: 'yaml' },
      schema: {
        // Titre de la photo (utilisé aussi comme nom de fichier)
        title: fields.slug({
          name: { label: 'Titre de la photo' },
          slug: { label: 'Identifiant (auto)', description: 'Généré automatiquement à partir du titre' },
        }),

        // Image uploadée via Keystatic (HEIC, JPEG, etc.)
        image: fields.image({
          label: 'Photo',
          directory: isProd ? 'apps/web/content/photos' : 'content/photos/local',
          publicPath: '/photos/',
        }),

        // Texte alternatif
        altFr: fields.text({
          label: 'Texte alternatif (FR)',
          description: 'Description de la photo pour l\'accessibilité',
        }),
        altEn: fields.text({
          label: 'Alt text (EN)',
          description: 'Photo description for accessibility',
        }),

        // Tags (texte libre)
        tags: fields.array(fields.text({ label: 'Tag' }), {
          label: 'Tags',
          itemLabel: (props) => props.value || 'Nouveau tag',
        }),
      },
    }),
  },
});