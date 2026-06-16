import { config, collection, fields, GitHubConfig } from '@keystatic/core';

/** Storage: GitHub with OAuth (requires KEYSTATIC_GITHUB_CLIENT_ID/SECRET + KEYSTATIC_SECRET) */
const storage: GitHubConfig['storage'] = {
  kind: 'github',
  repo: 'daviani/sites',
};

/**
 * Content paths (relative to repo root for GitHub storage)
 */
const postsPath = 'apps/web/content/posts/*';
const photosPath = 'apps/web/content/photos/*';
const projectsPath = 'apps/web/content/projects/*';
const contributionsPath = 'apps/web/content/contributions/*';

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
        updatedAt: fields.date({
          label: 'Dernière modification',
          description: 'Optionnel — alimente le lastmod du sitemap (SEO). Vide = date de publication.',
        }),
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
        keyTakeawaysFr: fields.array(fields.text({ label: 'Point clé (FR)', multiline: true }), {
          label: 'Ce qu’il faut retenir (FR)',
          description: '3 à 5 puces résumant l’article (généré par IA puis relu).',
          itemLabel: (p) => p.value || 'Point clé',
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
        keyTakeawaysEn: fields.array(fields.text({ label: 'Key point (EN)', multiline: true }), {
          label: 'Key takeaways (EN)',
          itemLabel: (p) => p.value || 'Key point',
        }),

        // Tags
        tags: fields.array(fields.text({ label: 'Tag' }), {
          label: 'Tags',
          itemLabel: (props) => props.value || 'Nouveau tag',
        }),

        // Projet lié (liaison bidirectionnelle article ↔ projet)
        project: fields.relationship({
          label: 'Projet lié',
          description: 'Optionnel — relie cet article à un projet',
          collection: 'projects',
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
          directory: 'apps/web/content/photos',
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
    projects: collection({
      label: 'Projets',
      slugField: 'slug',
      path: projectsPath,
      format: { contentField: 'bodyFr' },
      schema: {
        slug: fields.slug({ name: { label: 'Slug (URL)' } }),
        name: fields.text({ label: 'Nom du projet', validation: { isRequired: true } }),
        featured: fields.checkbox({ label: 'Mis en avant', defaultValue: false }),
        order: fields.integer({ label: "Ordre d'affichage", defaultValue: 0 }),
        updatedAt: fields.date({
          label: 'Dernière modification',
          description: 'Optionnel — alimente le lastmod du sitemap (SEO).',
        }),
        status: fields.select({
          label: 'Statut',
          options: [
            { label: 'Live', value: 'live' },
            { label: 'Privé', value: 'private' },
            { label: 'Lab', value: 'lab' },
            { label: 'Coming soon', value: 'coming-soon' },
          ],
          defaultValue: 'live',
        }),
        taglineFr: fields.text({ label: 'Accroche (FR)', validation: { isRequired: true } }),
        taglineEn: fields.text({ label: 'Tagline (EN)' }),
        summaryFr: fields.text({ label: 'Résumé (FR)', multiline: true }),
        summaryEn: fields.text({ label: 'Summary (EN)', multiline: true }),
        role: fields.text({ label: 'Rôle' }),
        stack: fields.array(fields.text({ label: 'Techno' }), {
          label: 'Stack',
          itemLabel: (props) => props.value || 'Nouvelle techno',
        }),
        links: fields.array(
          fields.object({
            label: fields.text({ label: 'Libellé' }),
            url: fields.url({ label: 'URL' }),
          }),
          {
            label: 'Liens (repo, démo, npm…)',
            itemLabel: (props) => props.fields.label.value || 'Lien',
          }
        ),
        cover: fields.image({
          label: 'Visuel de couverture',
          directory: 'apps/web/content/projects',
          publicPath: '/projects/',
        }),
        screenshots: fields.array(
          fields.image({
            label: 'Capture',
            directory: 'apps/web/content/projects',
            publicPath: '/projects/',
          }),
          { label: "Captures d'écran", itemLabel: () => 'Capture' }
        ),
        bodyFr: fields.markdoc({
          label: 'Contenu page détail (FR)',
          description: 'Optionnel — si vide, la carte renvoie vers le lien externe',
          options: { heading: [2, 3, 4] },
        }),
      },
    }),
    contributions: collection({
      label: 'Contributions',
      slugField: 'slug',
      path: contributionsPath,
      format: { data: 'yaml' },
      schema: {
        slug: fields.slug({ name: { label: 'Slug' } }),
        type: fields.select({
          label: 'Type',
          options: [
            { label: 'Talk / Conférence', value: 'talk' },
            { label: 'Mentorat', value: 'mentorat' },
            { label: 'Article', value: 'article' },
            { label: 'Open source', value: 'oss' },
          ],
          defaultValue: 'talk',
        }),
        titleFr: fields.text({ label: 'Titre (FR)', validation: { isRequired: true } }),
        titleEn: fields.text({ label: 'Title (EN)' }),
        descriptionFr: fields.text({ label: 'Description (FR)', multiline: true }),
        descriptionEn: fields.text({ label: 'Description (EN)', multiline: true }),
        date: fields.text({ label: 'Date / période', description: 'ex. « ApéroWeb · mars 2025 »' }),
        link: fields.url({ label: 'Lien (optionnel)' }),
        order: fields.integer({ label: 'Ordre', defaultValue: 0 }),
        updatedAt: fields.date({
          label: 'Dernière modification',
          description: 'Optionnel — alimente le lastmod du sitemap (SEO).',
        }),
      },
    }),
  },
});
