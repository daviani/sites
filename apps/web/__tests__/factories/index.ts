import type { LocalizedCvData, CvData } from '@/lib/content/cv-keystatic';

/**
 * Factory for contact form data
 */
export function createContactFormData(overrides: Partial<{
  name: string;
  email: string;
  message: string;
  favorite_color: string;
}> = {}) {
  return {
    name: 'John Doe',
    email: 'john@example.com',
    message: 'Test message content',
    favorite_color: '', // honeypot field - should always be empty
    ...overrides,
  };
}

/**
 * Factory for localized CV data (already transformed for a specific locale)
 */
export function createLocalizedCvData(overrides: Partial<LocalizedCvData> = {}): LocalizedCvData {
  return {
    personal: {
      name: 'John Doe',
      title: 'Full Stack Developer',
      birthYear: 1990,
      age: 34,
      experienceYears: 10,
      location: 'Paris, France',
      email: 'john@example.com',
      phone: '+33 6 12 34 56 78',
      linkedin: 'https://linkedin.com/in/johndoe',
      github: 'https://github.com/johndoe',
      website: 'https://johndoe.dev',
      photo: '/images/photo.jpg',
      ...overrides.personal,
    },
    summary: 'Experienced developer with expertise in modern web technologies.',
    experiences: overrides.experiences ?? [
      {
        start: '2020',
        end: undefined,
        current: true,
        compact: false,
        company: 'Tech Corp',
        role: 'Senior Developer',
        location: 'Paris',
        summary: 'Leading frontend development team.',
        highlights: ['Improved performance by 40%', 'Mentored junior developers'],
        stack: ['React', 'TypeScript', 'Node.js'],
      },
      {
        start: '2018',
        end: '2020',
        current: false,
        compact: true,
        company: 'Startup Inc',
        role: 'Developer',
        location: 'Lyon',
        summary: 'Full stack development.',
        highlights: ['Built main product from scratch'],
        stack: ['Vue.js', 'Python', 'PostgreSQL'],
      },
    ],
    education: overrides.education ?? [
      {
        start: '2010',
        end: '2014',
        institution: 'University of Technology',
        degree: 'Master in Computer Science',
      },
    ],
    skills: overrides.skills ?? [
      { name: 'React', category: 'frontend' },
      { name: 'TypeScript', category: 'frontend' },
      { name: 'Node.js', category: 'backend' },
      { name: 'PostgreSQL', category: 'databases' },
    ],
    languages: overrides.languages ?? [
      { language: 'French', level: 'Native' },
      { language: 'English', level: 'Fluent' },
    ],
    expertise: overrides.expertise ?? [
      { title: 'Frontend Development', description: 'React, Vue, TypeScript' },
      { title: 'Backend Development', description: 'Node.js, Python' },
    ],
    contributions: overrides.contributions ?? [
      { date: '2023', type: 'Open Source', description: 'Contributed to major OSS project' },
    ],
    projects: overrides.projects ?? [
      {
        title: 'Personal Portfolio',
        start: '2023',
        end: '2024',
        description: 'Modern portfolio with Next.js',
        highlights: ['SSR', 'SEO optimized'],
        stack: ['Next.js', 'Tailwind'],
        url: 'https://example.com',
      },
    ],
    ...overrides,
  };
}

/**
 * Factory for raw CV data (bilingual, before localization)
 */
export function createCvData(overrides: Partial<CvData> = {}): CvData {
  return {
    personal: {
      nameFr: 'Jean Dupont',
      nameEn: 'John Doe',
      titleFr: 'Développeur Full Stack',
      titleEn: 'Full Stack Developer',
      birthDate: '1990-01-15',
      experienceStart: '2014-09-01',
      location: 'Paris, France',
      email: 'john@example.com',
      phone: '+33 6 12 34 56 78',
      linkedin: 'https://linkedin.com/in/johndoe',
      github: 'https://github.com/johndoe',
      website: 'https://johndoe.dev',
      photo: '/images/photo.jpg',
      ...overrides.personal,
    },
    summaryFr: 'Développeur expérimenté avec expertise en technologies web modernes.',
    summaryEn: 'Experienced developer with expertise in modern web technologies.',
    experiences: overrides.experiences ?? [
      {
        start: '2020',
        end: undefined,
        current: true,
        compact: false,
        companyFr: 'Tech Corp',
        companyEn: 'Tech Corp',
        roleFr: 'Développeur Senior',
        roleEn: 'Senior Developer',
        locationFr: 'Paris',
        locationEn: 'Paris',
        summaryFr: 'Direction de l\'équipe frontend.',
        summaryEn: 'Leading frontend development team.',
        highlightsFr: ['Amélioration des performances de 40%'],
        highlightsEn: ['Improved performance by 40%'],
        stack: ['React', 'TypeScript', 'Node.js'],
      },
    ],
    education: overrides.education ?? [
      {
        start: '2010',
        end: '2014',
        institutionFr: 'Université de Technologie',
        institutionEn: 'University of Technology',
        degreeFr: 'Master en Informatique',
        degreeEn: 'Master in Computer Science',
      },
    ],
    skills: overrides.skills ?? [
      { name: 'React', category: 'frontend' },
      { name: 'TypeScript', category: 'frontend' },
      { name: 'Node.js', category: 'backend' },
    ],
    languages: overrides.languages ?? [
      { languageFr: 'Français', languageEn: 'French', levelFr: 'Natif', levelEn: 'Native' },
      { languageFr: 'Anglais', languageEn: 'English', levelFr: 'Courant', levelEn: 'Fluent' },
    ],
    expertise: overrides.expertise ?? [
      {
        titleFr: 'Développement Frontend',
        titleEn: 'Frontend Development',
        descriptionFr: 'React, Vue, TypeScript',
        descriptionEn: 'React, Vue, TypeScript',
      },
    ],
    contributions: overrides.contributions ?? [
      {
        date: '2023',
        typeFr: 'Open Source',
        typeEn: 'Open Source',
        descriptionFr: 'Contribution à un projet OSS majeur',
        descriptionEn: 'Contributed to major OSS project',
      },
    ],
    projects: overrides.projects ?? [
      {
        titleFr: 'Portfolio Personnel',
        titleEn: 'Personal Portfolio',
        start: '2023',
        end: '2024',
        descriptionFr: 'Portfolio moderne avec Next.js',
        descriptionEn: 'Modern portfolio with Next.js',
        highlightsFr: ['SSR', 'SEO optimisé'],
        highlightsEn: ['SSR', 'SEO optimized'],
        stack: ['Next.js', 'Tailwind'],
        url: 'https://example.com',
      },
    ],
    ...overrides,
  };
}

/**
 * Factory for article meta data
 */
export function createArticleMeta(overrides: Partial<{
  slug: string;
  titleFr: string;
  titleEn: string;
  excerptFr: string;
  excerptEn: string;
  publishedAt: string;
  updatedAt: string;
  tags: string[];
  draft: boolean;
}> = {}) {
  return {
    slug: 'test-article',
    titleFr: 'Article de test',
    titleEn: 'Test Article',
    excerptFr: 'Un extrait de test',
    excerptEn: 'A test excerpt',
    publishedAt: '2024-01-15',
    updatedAt: '2024-01-15',
    tags: ['test', 'article'],
    draft: false,
    ...overrides,
  };
}

/**
 * Factory for skills by category
 */
export function createSkillsByCategory(overrides: Partial<Record<string, string[]>> = {}): Record<string, string[]> {
  return {
    frontend: ['React', 'TypeScript', 'Vue.js'],
    backend: ['Node.js', 'Python', 'Go'],
    databases: ['PostgreSQL', 'MongoDB', 'Redis'],
    cicd: ['GitHub Actions', 'Docker'],
    os: ['Linux', 'macOS'],
    cloud: ['AWS', 'Vercel'],
    testing: ['Vitest', 'Playwright'],
    tools: ['VS Code', 'Git'],
    ...overrides,
  };
}
