/**
 * CV Static Data - Non-translatable data only
 * Translatable content is in packages/ui/src/locales/{fr,en}.json under pages.cv.data
 */

export interface CvStaticData {
  personal: {
    birthYear: number;
    experienceYears: number;
    location: string;
    email: string;
    phone?: string;
    linkedin: string;
    github: string;
    website: string;
    photo?: string;
  };
  experiences: {
    start: string;
    end: string | null;
    current: boolean;
    compact?: boolean;
    stack: string[];
  }[];
  education: {
    start: string;
    end: string;
  }[];
  skills: {
    name: string;
    category: 'frontend' | 'backend' | 'devops' | 'tools' | 'soft';
  }[];
}

const cvStaticData: CvStaticData = {
  personal: {
    birthYear: 1990,
    experienceYears: 5,
    location: 'Villeurbanne',
    email: 'd.fillatre.pro@gmail.com',
    phone: '06 52 21 34 88',
    linkedin: 'https://linkedin.com/in/daviani-fillatre',
    github: 'https://github.com/daviani',
    website: 'https://fillatredav.fr',
    photo: undefined,
  },
  experiences: [
    {
      start: '10/2023',
      end: null,
      current: true,
      stack: ['Angular', 'Next.js', '.NET Core', 'PostgreSQL', 'GitLab CI/CD', 'Docker', 'Windows Server', 'IIS'],
    },
    {
      start: '12/2022',
      end: '08/2023',
      current: false,
      stack: ['JavaScript', 'Chrome Extension API', 'Node.js', 'intégration CRM'],
    },
    {
      start: '02/2022',
      end: '08/2022',
      current: false,
      compact: true,
      stack: ['React.js', 'React Native', 'Nest.js', 'MariaDB', 'GitLab CI/CD', 'Jest', 'Cypress', 'Docker'],
    },
    {
      start: '07/2021',
      end: '12/2021',
      current: false,
      compact: true,
      stack: ['Next.js', 'Tailwind CSS', 'DatoCMS', 'Vercel'],
    },
    {
      start: '04/2021',
      end: '06/2021',
      current: false,
      compact: true,
      stack: [],
    },
    {
      start: '09/2020',
      end: '04/2021',
      current: false,
      compact: true,
      stack: [],
    },
    {
      start: '09/2020',
      end: '12/2020',
      current: false,
      compact: true,
      stack: [],
    },
  ],
  education: [
    {
      start: '2019',
      end: '2019',
    },
    {
      start: '2017',
      end: '2018',
    },
  ],
  skills: [
    { name: '.NET Core', category: 'backend' },
    { name: 'ASP.NET', category: 'backend' },
    { name: 'Angular', category: 'frontend' },
    { name: 'React', category: 'frontend' },
    { name: 'Next.js', category: 'frontend' },
    { name: 'Node.js', category: 'backend' },
    { name: 'TypeScript', category: 'frontend' },
    { name: 'PostgreSQL', category: 'backend' },
    { name: 'GitLab CI/CD', category: 'devops' },
    { name: 'Docker', category: 'devops' },
    { name: 'Jenkins', category: 'devops' },
    { name: 'Windows Server', category: 'devops' },
    { name: 'IIS', category: 'devops' },
    { name: 'Linux', category: 'devops' },
    { name: 'Apache', category: 'devops' },
  ],
};

/**
 * Get CV static data with computed age
 */
export function getCvStaticData(): CvStaticData & { age: number } {
  const currentYear = new Date().getFullYear();
  const age = currentYear - cvStaticData.personal.birthYear;

  return {
    ...cvStaticData,
    age,
  };
}

/**
 * Get all skills as flat array (for unified display)
 */
export function getAllSkills(): string[] {
  return cvStaticData.skills.map((s) => s.name);
}

/**
 * Get skills grouped by category
 */
export function getSkillsByCategory() {
  const grouped: Record<string, string[]> = {
    frontend: [],
    backend: [],
    devops: [],
    tools: [],
    soft: [],
  };

  for (const skill of cvStaticData.skills) {
    grouped[skill.category].push(skill.name);
  }

  return grouped;
}