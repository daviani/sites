import fs from 'node:fs';
import path from 'node:path';
import yaml from 'yaml';

/**
 * CV Data Types from Keystatic
 */
export interface CvPersonal {
  nameFr: string;
  nameEn: string;
  titleFr: string;
  titleEn: string;
  birthYear: number;
  experienceStart?: string; // Date ISO format (YYYY-MM-DD)
  location: string;
  email: string;
  phone?: string;
  linkedin?: string;
  github?: string;
  website?: string;
  photo?: string;
}

export interface CvExperience {
  start: string;
  end?: string;
  current: boolean;
  compact: boolean;
  companyFr: string;
  companyEn: string;
  roleFr: string;
  roleEn: string;
  locationFr: string;
  locationEn: string;
  summaryFr?: string;
  summaryEn?: string;
  highlightsFr: string[];
  highlightsEn: string[];
  stack: string[];
}

export interface CvEducation {
  start: string;
  end: string;
  institutionFr: string;
  institutionEn: string;
  degreeFr: string;
  degreeEn: string;
}

export interface CvSkill {
  name: string;
  category: 'frontend' | 'backend' | 'devops' | 'tools' | 'soft';
}

export interface CvLanguage {
  languageFr: string;
  languageEn: string;
  levelFr: string;
  levelEn: string;
}

export interface CvExpertise {
  titleFr: string;
  titleEn: string;
  descriptionFr: string;
  descriptionEn: string;
}

export interface CvContribution {
  date: string;
  typeFr: string;
  typeEn: string;
  descriptionFr: string;
  descriptionEn: string;
}

export interface CvData {
  personal: CvPersonal;
  summaryFr: string;
  summaryEn: string;
  experiences: CvExperience[];
  education: CvEducation[];
  skills: CvSkill[];
  languages: CvLanguage[];
  expertise: CvExpertise[];
  contributions: CvContribution[];
}

/**
 * Localized CV data for a specific language
 */
export interface LocalizedCvData {
  personal: {
    name: string;
    title: string;
    birthYear: number;
    age: number;
    experienceYears: number;
    location: string;
    email: string;
    phone?: string;
    linkedin?: string;
    github?: string;
    website?: string;
    photo?: string;
  };
  summary: string;
  experiences: {
    start: string;
    end?: string;
    current: boolean;
    compact: boolean;
    company: string;
    role: string;
    location: string;
    summary?: string;
    highlights: string[];
    stack: string[];
  }[];
  education: {
    start: string;
    end: string;
    institution: string;
    degree: string;
  }[];
  skills: CvSkill[];
  languages: {
    language: string;
    level: string;
  }[];
  expertise: {
    title: string;
    description: string;
  }[];
  contributions: {
    date: string;
    type: string;
    description: string;
  }[];
}

const isProd = process.env.NODE_ENV === 'production';

/**
 * CV file path based on environment:
 * - Development: content/cv/local (test data)
 * - Production: content/cv (real data from GitHub)
 */
const CV_FILE_PATH = path.join(process.cwd(), isProd ? 'content/cv/index.yaml' : 'content/cv/local/index.yaml');

/**
 * Get raw CV data from Keystatic YAML
 */
export function getCvData(): CvData | null {
  if (!fs.existsSync(CV_FILE_PATH)) {
    console.warn(`CV file not found at ${CV_FILE_PATH}`);
    return null;
  }

  try {
    const content = fs.readFileSync(CV_FILE_PATH, 'utf-8');
    return yaml.parse(content) as CvData;
  } catch (error) {
    console.error('Error parsing CV YAML:', error);
    return null;
  }
}

/**
 * Get localized CV data for a specific language
 */
export function getLocalizedCvData(locale: 'fr' | 'en' = 'fr'): LocalizedCvData | null {
  const data = getCvData();
  if (!data) return null;

  const isFr = locale === 'fr';
  const now = new Date();
  const currentYear = now.getFullYear();
  const age = currentYear - data.personal.birthYear;

  // Calculate experience years from start date
  let experienceYears = 0;
  if (data.personal.experienceStart) {
    const startDate = new Date(data.personal.experienceStart);
    experienceYears = Math.floor((now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24 * 365.25));
  }

  return {
    personal: {
      name: isFr ? data.personal.nameFr : data.personal.nameEn,
      title: isFr ? data.personal.titleFr : data.personal.titleEn,
      birthYear: data.personal.birthYear,
      age,
      experienceYears,
      location: data.personal.location,
      email: data.personal.email,
      phone: data.personal.phone,
      linkedin: data.personal.linkedin,
      github: data.personal.github,
      website: data.personal.website,
      photo: data.personal.photo,
    },
    summary: isFr ? data.summaryFr : data.summaryEn,
    experiences: data.experiences.map((exp) => ({
      start: exp.start,
      end: exp.end,
      current: exp.current,
      compact: exp.compact,
      company: isFr ? exp.companyFr : exp.companyEn,
      role: isFr ? exp.roleFr : exp.roleEn,
      location: isFr ? exp.locationFr : exp.locationEn,
      summary: isFr ? exp.summaryFr : exp.summaryEn,
      highlights: isFr ? exp.highlightsFr : exp.highlightsEn,
      stack: exp.stack,
    })),
    education: data.education.map((edu) => ({
      start: edu.start,
      end: edu.end,
      institution: isFr ? edu.institutionFr : edu.institutionEn,
      degree: isFr ? edu.degreeFr : edu.degreeEn,
    })),
    skills: data.skills,
    languages: data.languages.map((lang) => ({
      language: isFr ? lang.languageFr : lang.languageEn,
      level: isFr ? lang.levelFr : lang.levelEn,
    })),
    expertise: data.expertise.map((exp) => ({
      title: isFr ? exp.titleFr : exp.titleEn,
      description: isFr ? exp.descriptionFr : exp.descriptionEn,
    })),
    contributions: data.contributions.map((contrib) => ({
      date: contrib.date,
      type: isFr ? contrib.typeFr : contrib.typeEn,
      description: isFr ? contrib.descriptionFr : contrib.descriptionEn,
    })),
  };
}

/**
 * Get all skills as flat array
 */
export function getAllCvSkills(): string[] {
  const data = getCvData();
  if (!data) return [];
  return data.skills.map((s) => s.name);
}

/**
 * Get skills grouped by category
 */
export function getCvSkillsByCategory(): Record<string, string[]> {
  const data = getCvData();
  if (!data) return {};

  const grouped: Record<string, string[]> = {
    frontend: [],
    backend: [],
    devops: [],
    tools: [],
    soft: [],
  };

  for (const skill of data.skills) {
    grouped[skill.category].push(skill.name);
  }

  return grouped;
}