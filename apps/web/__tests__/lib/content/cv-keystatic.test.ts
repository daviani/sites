import { describe, it, expect, vi, beforeEach } from 'vitest';

const mockExistsSync = vi.fn();
const mockReadFileSync = vi.fn();

vi.mock('node:fs', () => ({
  default: {
    existsSync: (...args: unknown[]) => mockExistsSync(...args),
    readFileSync: (...args: unknown[]) => mockReadFileSync(...args),
  },
}));

const mockYamlParse = vi.fn();
vi.mock('yaml', () => ({
  default: {
    parse: (...args: unknown[]) => mockYamlParse(...args),
  },
}));

import {
  getCvData,
  getLocalizedCvData,
  getAllCvSkills,
  getCvSkillsByCategory,
} from '@/lib/content/cv-keystatic';
import type { CvData } from '@/lib/content/cv-keystatic';

function buildCvData(overrides: Partial<CvData> = {}): CvData {
  return {
    personal: {
      nameFr: 'Jean Dupont',
      nameEn: 'John Doe',
      titleFr: 'Développeur',
      titleEn: 'Developer',
      birthDate: '1990-06-15',
      experienceStart: '2015-01-01',
      location: 'Paris, France',
      email: 'jean@example.com',
      phone: '+33600000000',
      linkedin: 'linkedin.com/in/jean',
      github: 'github.com/jean',
      website: 'jean.dev',
      photo: '/photo.jpg',
    },
    summaryFr: 'Résumé en français',
    summaryEn: 'English summary',
    subtitleFr: 'Qualité · Automatisation · Transmission',
    subtitleEn: 'Quality · Automation · Knowledge sharing',
    experiences: [
      {
        start: '2020-01',
        current: true,
        compact: false,
        companyFr: 'Entreprise',
        companyEn: 'Company',
        roleFr: 'Développeur Senior',
        roleEn: 'Senior Developer',
        locationFr: 'Paris',
        locationEn: 'Paris',
        summaryFr: 'Résumé expérience',
        summaryEn: 'Experience summary',
        highlightsFr: ['Point 1 FR'],
        highlightsEn: ['Point 1 EN'],
        stack: ['React', 'TypeScript'],
      },
    ],
    education: [
      {
        start: '2010',
        end: '2013',
        institutionFr: 'Université de Paris',
        institutionEn: 'University of Paris',
        degreeFr: 'Master Informatique',
        degreeEn: 'MSc Computer Science',
        descriptionFr: 'Reconversion professionnelle',
        descriptionEn: 'Career change',
      },
    ],
    skills: [
      { name: 'React', category: 'frontend' },
      { name: 'Node.js', category: 'backend' },
      { name: 'PostgreSQL', category: 'databases' },
    ],
    languages: [
      { languageFr: 'Français', languageEn: 'French', levelFr: 'Natif', levelEn: 'Native' },
      { languageFr: 'Anglais', languageEn: 'English', levelFr: 'Courant', levelEn: 'Fluent' },
    ],
    expertise: [
      {
        titleFr: 'Frontend',
        titleEn: 'Frontend',
        descriptionFr: 'Expertise frontend',
        descriptionEn: 'Frontend expertise',
      },
    ],
    contributions: [
      {
        date: '2024-01',
        typeFr: 'Open Source',
        typeEn: 'Open Source',
        descriptionFr: 'Contribution OSS',
        descriptionEn: 'OSS Contribution',
      },
    ],
    projects: [
      {
        titleFr: 'Mon Projet',
        titleEn: 'My Project',
        start: '2023',
        end: '2024',
        descriptionFr: 'Description FR',
        descriptionEn: 'Description EN',
        highlightsFr: ['Highlight FR'],
        highlightsEn: ['Highlight EN'],
        stack: ['Next.js'],
        url: 'https://project.dev',
      },
    ],
    ...overrides,
  };
}

describe('content/cv-keystatic', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getCvData', () => {
    it('returns null when CV file does not exist', () => {
      mockExistsSync.mockReturnValue(false);
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      const data = getCvData();
      expect(data).toBeNull();

      consoleSpy.mockRestore();
    });

    it('returns parsed YAML data when file exists', () => {
      const cvData = buildCvData();
      mockExistsSync.mockReturnValue(true);
      mockReadFileSync.mockReturnValue('yaml-content');
      mockYamlParse.mockReturnValue(cvData);

      const data = getCvData();
      expect(data).toEqual(cvData);
    });

    it('returns null on YAML parse error', () => {
      mockExistsSync.mockReturnValue(true);
      mockReadFileSync.mockReturnValue('invalid yaml');
      mockYamlParse.mockImplementation(() => {
        throw new Error('Parse error');
      });
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      const data = getCvData();
      expect(data).toBeNull();

      consoleSpy.mockRestore();
    });
  });

  describe('getLocalizedCvData', () => {
    it('returns null when no CV data', () => {
      mockExistsSync.mockReturnValue(false);
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      const data = getLocalizedCvData('fr');
      expect(data).toBeNull();

      consoleSpy.mockRestore();
    });

    it('returns French localized data by default', () => {
      mockExistsSync.mockReturnValue(true);
      mockReadFileSync.mockReturnValue('yaml');
      mockYamlParse.mockReturnValue(buildCvData());

      const data = getLocalizedCvData();
      expect(data).not.toBeNull();
      expect(data!.personal.name).toBe('Jean Dupont');
      expect(data!.personal.title).toBe('Développeur');
      expect(data!.summary).toBe('Résumé en français');
    });

    it('returns English localized data', () => {
      mockExistsSync.mockReturnValue(true);
      mockReadFileSync.mockReturnValue('yaml');
      mockYamlParse.mockReturnValue(buildCvData());

      const data = getLocalizedCvData('en');
      expect(data).not.toBeNull();
      expect(data!.personal.name).toBe('John Doe');
      expect(data!.personal.title).toBe('Developer');
      expect(data!.summary).toBe('English summary');
    });

    it('localizes subtitle', () => {
      mockExistsSync.mockReturnValue(true);
      mockReadFileSync.mockReturnValue('yaml');
      mockYamlParse.mockReturnValue(buildCvData());

      const fr = getLocalizedCvData('fr')!;
      expect(fr.subtitle).toBe('Qualité · Automatisation · Transmission');

      const en = getLocalizedCvData('en')!;
      expect(en.subtitle).toBe('Quality · Automation · Knowledge sharing');
    });

    it('handles missing subtitle gracefully', () => {
      mockExistsSync.mockReturnValue(true);
      mockReadFileSync.mockReturnValue('yaml');
      mockYamlParse.mockReturnValue(buildCvData({ subtitleFr: undefined, subtitleEn: undefined }));

      const data = getLocalizedCvData('fr')!;
      expect(data.subtitle).toBeUndefined();
    });

    it('localizes experiences', () => {
      mockExistsSync.mockReturnValue(true);
      mockReadFileSync.mockReturnValue('yaml');
      mockYamlParse.mockReturnValue(buildCvData());

      const fr = getLocalizedCvData('fr')!;
      expect(fr.experiences[0].company).toBe('Entreprise');
      expect(fr.experiences[0].role).toBe('Développeur Senior');
      expect(fr.experiences[0].highlights).toEqual(['Point 1 FR']);

      const en = getLocalizedCvData('en')!;
      expect(en.experiences[0].company).toBe('Company');
      expect(en.experiences[0].role).toBe('Senior Developer');
      expect(en.experiences[0].highlights).toEqual(['Point 1 EN']);
    });

    it('localizes education', () => {
      mockExistsSync.mockReturnValue(true);
      mockReadFileSync.mockReturnValue('yaml');
      mockYamlParse.mockReturnValue(buildCvData());

      const fr = getLocalizedCvData('fr')!;
      expect(fr.education[0].institution).toBe('Université de Paris');
      expect(fr.education[0].degree).toBe('Master Informatique');
      expect(fr.education[0].description).toBe('Reconversion professionnelle');

      const en = getLocalizedCvData('en')!;
      expect(en.education[0].institution).toBe('University of Paris');
      expect(en.education[0].degree).toBe('MSc Computer Science');
      expect(en.education[0].description).toBe('Career change');
    });

    it('localizes languages', () => {
      mockExistsSync.mockReturnValue(true);
      mockReadFileSync.mockReturnValue('yaml');
      mockYamlParse.mockReturnValue(buildCvData());

      const fr = getLocalizedCvData('fr')!;
      expect(fr.languages[0].language).toBe('Français');
      expect(fr.languages[0].level).toBe('Natif');

      const en = getLocalizedCvData('en')!;
      expect(en.languages[0].language).toBe('French');
      expect(en.languages[0].level).toBe('Native');
    });

    it('localizes expertise', () => {
      mockExistsSync.mockReturnValue(true);
      mockReadFileSync.mockReturnValue('yaml');
      mockYamlParse.mockReturnValue(buildCvData());

      const fr = getLocalizedCvData('fr')!;
      expect(fr.expertise[0].title).toBe('Frontend');
      expect(fr.expertise[0].description).toBe('Expertise frontend');
    });

    it('localizes contributions', () => {
      mockExistsSync.mockReturnValue(true);
      mockReadFileSync.mockReturnValue('yaml');
      mockYamlParse.mockReturnValue(buildCvData());

      const fr = getLocalizedCvData('fr')!;
      expect(fr.contributions[0].type).toBe('Open Source');
      expect(fr.contributions[0].description).toBe('Contribution OSS');
    });

    it('localizes projects', () => {
      mockExistsSync.mockReturnValue(true);
      mockReadFileSync.mockReturnValue('yaml');
      mockYamlParse.mockReturnValue(buildCvData());

      const fr = getLocalizedCvData('fr')!;
      expect(fr.projects[0].title).toBe('Mon Projet');
      expect(fr.projects[0].description).toBe('Description FR');
      expect(fr.projects[0].url).toBe('https://project.dev');
    });

    it('handles missing projects gracefully', () => {
      mockExistsSync.mockReturnValue(true);
      mockReadFileSync.mockReturnValue('yaml');
      mockYamlParse.mockReturnValue(buildCvData({ projects: undefined }));

      const data = getLocalizedCvData('fr')!;
      expect(data.projects).toEqual([]);
    });

    it('calculates age from birth date', () => {
      mockExistsSync.mockReturnValue(true);
      mockReadFileSync.mockReturnValue('yaml');
      mockYamlParse.mockReturnValue(buildCvData());

      const data = getLocalizedCvData('fr')!;
      expect(data.personal.age).toBeGreaterThan(0);
      expect(data.personal.birthYear).toBe(1990);
    });

    it('calculates experience years from start date', () => {
      mockExistsSync.mockReturnValue(true);
      mockReadFileSync.mockReturnValue('yaml');
      mockYamlParse.mockReturnValue(buildCvData());

      const data = getLocalizedCvData('fr')!;
      expect(data.personal.experienceYears).toBeGreaterThan(0);
    });

    it('passes through personal info fields', () => {
      mockExistsSync.mockReturnValue(true);
      mockReadFileSync.mockReturnValue('yaml');
      mockYamlParse.mockReturnValue(buildCvData());

      const data = getLocalizedCvData('fr')!;
      expect(data.personal.location).toBe('Paris, France');
      expect(data.personal.email).toBe('jean@example.com');
      expect(data.personal.phone).toBe('+33600000000');
      expect(data.personal.linkedin).toBe('linkedin.com/in/jean');
      expect(data.personal.github).toBe('github.com/jean');
      expect(data.personal.website).toBe('jean.dev');
      expect(data.personal.photo).toBe('/photo.jpg');
    });
  });

  describe('getAllCvSkills', () => {
    it('returns empty array when no CV data', () => {
      mockExistsSync.mockReturnValue(false);
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      const skills = getAllCvSkills();
      expect(skills).toEqual([]);

      consoleSpy.mockRestore();
    });

    it('returns flat array of skill names', () => {
      mockExistsSync.mockReturnValue(true);
      mockReadFileSync.mockReturnValue('yaml');
      mockYamlParse.mockReturnValue(buildCvData());

      const skills = getAllCvSkills();
      expect(skills).toEqual(['React', 'Node.js', 'PostgreSQL']);
    });
  });

  describe('getCvSkillsByCategory', () => {
    it('returns empty object when no CV data', () => {
      mockExistsSync.mockReturnValue(false);
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      const grouped = getCvSkillsByCategory();
      expect(grouped).toEqual({});

      consoleSpy.mockRestore();
    });

    it('groups skills by category', () => {
      mockExistsSync.mockReturnValue(true);
      mockReadFileSync.mockReturnValue('yaml');
      mockYamlParse.mockReturnValue(buildCvData());

      const grouped = getCvSkillsByCategory();
      expect(grouped.frontend).toEqual(['React']);
      expect(grouped.backend).toEqual(['Node.js']);
      expect(grouped.databases).toEqual(['PostgreSQL']);
    });

    it('initializes all categories', () => {
      mockExistsSync.mockReturnValue(true);
      mockReadFileSync.mockReturnValue('yaml');
      mockYamlParse.mockReturnValue(buildCvData({ skills: [] }));

      const grouped = getCvSkillsByCategory();
      expect(Object.keys(grouped)).toEqual(
        expect.arrayContaining(['frontend', 'backend', 'databases', 'cicd', 'os', 'cloud', 'testing', 'tools'])
      );
    });
  });
});