import { config, collection, singleton, fields, LocalConfig, GitHubConfig } from '@keystatic/core';

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
// Keystatic local mode uses git to find files
// Paths are relative to the app directory (apps/web/) where Next.js runs
const postsPath = isProd ? 'apps/web/content/posts/*' : 'content/posts/local/*';
const photosPath = isProd ? 'apps/web/content/photos/*' : 'content/photos/local/*';
const cvPath = isProd ? 'apps/web/content/cv/' : 'content/cv/local/';

export default config({
  storage,
  singletons: {
    cv: singleton({
      label: 'CV / Resume',
      path: cvPath,
      format: { data: 'yaml' },
      schema: {
        // ==========================================
        // Informations personnelles
        // ==========================================
        personal: fields.object(
          {
            nameFr: fields.text({ label: 'Nom (FR)', validation: { isRequired: true } }),
            nameEn: fields.text({ label: 'Name (EN)', validation: { isRequired: true } }),
            titleFr: fields.text({ label: 'Titre professionnel (FR)', validation: { isRequired: true } }),
            titleEn: fields.text({ label: 'Professional title (EN)', validation: { isRequired: true } }),
            birthDate: fields.date({ label: 'Date de naissance', validation: { isRequired: true } }),
            experienceStart: fields.date({ label: 'Début de carrière', description: 'Date de début pour calculer les années d\'expérience' }),
            location: fields.text({ label: 'Localisation' }),
            email: fields.text({ label: 'Email', validation: { isRequired: true } }),
            phone: fields.text({ label: 'Téléphone' }),
            linkedin: fields.url({ label: 'LinkedIn' }),
            github: fields.url({ label: 'GitHub' }),
            website: fields.url({ label: 'Site web' }),
            photo: fields.image({
              label: 'Photo',
              directory: isProd ? 'apps/web/content/cv' : 'content/cv/local',
              publicPath: '/cv/',
            }),
          },
          { label: 'Informations personnelles' }
        ),

        // ==========================================
        // Résumé professionnel
        // ==========================================
        summaryFr: fields.text({
          label: 'Résumé (FR)',
          multiline: true,
        }),
        summaryEn: fields.text({
          label: 'Summary (EN)',
          multiline: true,
        }),

        // ==========================================
        // Expériences professionnelles
        // ==========================================
        experiences: fields.array(
          fields.object({
            start: fields.text({ label: 'Début (MM/YYYY)', validation: { isRequired: true } }),
            end: fields.text({ label: 'Fin (MM/YYYY ou vide si en cours)' }),
            current: fields.checkbox({ label: 'Poste actuel', defaultValue: false }),
            compact: fields.checkbox({ label: 'Affichage compact', defaultValue: false }),
            companyFr: fields.text({ label: 'Entreprise (FR)', validation: { isRequired: true } }),
            companyEn: fields.text({ label: 'Company (EN)', validation: { isRequired: true } }),
            roleFr: fields.text({ label: 'Rôle (FR)', validation: { isRequired: true } }),
            roleEn: fields.text({ label: 'Role (EN)', validation: { isRequired: true } }),
            locationFr: fields.text({ label: 'Lieu (FR)' }),
            locationEn: fields.text({ label: 'Location (EN)' }),
            summaryFr: fields.text({ label: 'Résumé court (FR)', multiline: true }),
            summaryEn: fields.text({ label: 'Short summary (EN)', multiline: true }),
            highlightsFr: fields.array(fields.text({ label: 'Point clé (FR)' }), {
              label: 'Points clés (FR)',
              itemLabel: (props) => props.value || 'Nouveau point',
            }),
            highlightsEn: fields.array(fields.text({ label: 'Highlight (EN)' }), {
              label: 'Highlights (EN)',
              itemLabel: (props) => props.value || 'New highlight',
            }),
            stack: fields.array(fields.text({ label: 'Technologie' }), {
              label: 'Stack technique',
              itemLabel: (props) => props.value || 'Nouvelle technologie',
            }),
          }),
          {
            label: 'Expériences professionnelles',
            itemLabel: (props) => props.fields.companyFr.value || 'Nouvelle expérience',
          }
        ),

        // ==========================================
        // Formation
        // ==========================================
        education: fields.array(
          fields.object({
            start: fields.text({ label: 'Année début', validation: { isRequired: true } }),
            end: fields.text({ label: 'Année fin', validation: { isRequired: true } }),
            institutionFr: fields.text({ label: 'Établissement (FR)', validation: { isRequired: true } }),
            institutionEn: fields.text({ label: 'Institution (EN)', validation: { isRequired: true } }),
            degreeFr: fields.text({ label: 'Diplôme (FR)', validation: { isRequired: true } }),
            degreeEn: fields.text({ label: 'Degree (EN)', validation: { isRequired: true } }),
          }),
          {
            label: 'Formation',
            itemLabel: (props) => props.fields.institutionFr.value || 'Nouvelle formation',
          }
        ),

        // ==========================================
        // Compétences
        // ==========================================
        skills: fields.array(
          fields.object({
            name: fields.text({ label: 'Nom de la compétence', validation: { isRequired: true } }),
            category: fields.select({
              label: 'Catégorie',
              options: [
                { label: 'Frontend', value: 'frontend' },
                { label: 'Backend', value: 'backend' },
                { label: 'DevOps', value: 'devops' },
                { label: 'Outils', value: 'tools' },
                { label: 'Soft skills', value: 'soft' },
              ],
              defaultValue: 'frontend',
            }),
          }),
          {
            label: 'Compétences',
            itemLabel: (props) => props.fields.name.value || 'Nouvelle compétence',
          }
        ),

        // ==========================================
        // Langues
        // ==========================================
        languages: fields.array(
          fields.object({
            languageFr: fields.text({ label: 'Langue (FR)', validation: { isRequired: true } }),
            languageEn: fields.text({ label: 'Language (EN)', validation: { isRequired: true } }),
            levelFr: fields.text({ label: 'Niveau (FR)', validation: { isRequired: true } }),
            levelEn: fields.text({ label: 'Level (EN)', validation: { isRequired: true } }),
          }),
          {
            label: 'Langues',
            itemLabel: (props) => props.fields.languageFr.value || 'Nouvelle langue',
          }
        ),

        // ==========================================
        // Domaines d'expertise
        // ==========================================
        expertise: fields.array(
          fields.object({
            titleFr: fields.text({ label: 'Titre (FR)', validation: { isRequired: true } }),
            titleEn: fields.text({ label: 'Title (EN)', validation: { isRequired: true } }),
            descriptionFr: fields.text({ label: 'Description (FR)', multiline: true }),
            descriptionEn: fields.text({ label: 'Description (EN)', multiline: true }),
          }),
          {
            label: 'Domaines d\'expertise',
            itemLabel: (props) => props.fields.titleFr.value || 'Nouveau domaine',
          }
        ),

        // ==========================================
        // Contributions / Engagements
        // ==========================================
        contributions: fields.array(
          fields.object({
            date: fields.text({ label: 'Date' }),
            typeFr: fields.text({ label: 'Type (FR)', validation: { isRequired: true } }),
            typeEn: fields.text({ label: 'Type (EN)', validation: { isRequired: true } }),
            descriptionFr: fields.text({ label: 'Description (FR)', multiline: true }),
            descriptionEn: fields.text({ label: 'Description (EN)', multiline: true }),
          }),
          {
            label: 'Contributions',
            itemLabel: (props) => props.fields.typeFr.value || 'Nouvelle contribution',
          }
        ),

        // ==========================================
        // Projets personnels
        // ==========================================
        projects: fields.array(
          fields.object({
            titleFr: fields.text({ label: 'Titre (FR)', validation: { isRequired: true } }),
            titleEn: fields.text({ label: 'Title (EN)', validation: { isRequired: true } }),
            start: fields.text({ label: 'Début' }),
            end: fields.text({ label: 'Fin (ou "En cours")' }),
            descriptionFr: fields.text({ label: 'Description (FR)', multiline: true }),
            descriptionEn: fields.text({ label: 'Description (EN)', multiline: true }),
            highlightsFr: fields.array(fields.text({ label: 'Point clé (FR)' }), {
              label: 'Points clés (FR)',
              itemLabel: (props) => props.value || 'Nouveau point',
            }),
            highlightsEn: fields.array(fields.text({ label: 'Highlight (EN)' }), {
              label: 'Highlights (EN)',
              itemLabel: (props) => props.value || 'New highlight',
            }),
            stack: fields.array(fields.text({ label: 'Technologie' }), {
              label: 'Stack technique',
              itemLabel: (props) => props.value || 'Nouvelle technologie',
            }),
            url: fields.url({ label: 'URL du projet' }),
          }),
          {
            label: 'Projets personnels',
            itemLabel: (props) => props.fields.titleFr.value || 'Nouveau projet',
          }
        ),
      },
    }),
  },
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