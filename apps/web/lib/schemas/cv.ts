import { z } from 'zod';

/**
 * CV Static Data Schemas
 * These schemas validate non-translatable data only
 * Translatable content is in packages/ui/src/locales/{fr,en}.json under pages.cv.data
 */

// Personal info schema (static data only)
export const personalInfoStaticSchema = z.object({
  birthYear: z.number().int().min(1900).max(2100),
  experienceYears: z.number().int().min(0),
  location: z.string().min(1),
  email: z.string().email(),
  phone: z.string().optional(),
  linkedin: z.string().url(),
  github: z.string().url(),
  website: z.string().url(),
  photo: z.string().optional(),
});

export type PersonalInfoStatic = z.infer<typeof personalInfoStaticSchema>;

// Experience static schema (dates and stack only)
export const experienceStaticSchema = z.object({
  start: z.string().min(1),
  end: z.string().nullable(),
  current: z.boolean(),
  compact: z.boolean().optional(),
  stack: z.array(z.string()),
});

export type ExperienceStatic = z.infer<typeof experienceStaticSchema>;

// Education static schema (dates only)
export const educationStaticSchema = z.object({
  start: z.string().min(1),
  end: z.string().min(1),
});

export type EducationStatic = z.infer<typeof educationStaticSchema>;

// Skill schema with categories
export const skillSchema = z.object({
  name: z.string().min(1),
  category: z.enum(['frontend', 'backend', 'devops', 'tools', 'soft']),
});

export type Skill = z.infer<typeof skillSchema>;

// Complete CV static data schema
export const cvStaticDataSchema = z.object({
  personal: personalInfoStaticSchema,
  experiences: z.array(experienceStaticSchema).min(1),
  education: z.array(educationStaticSchema).min(1),
  skills: z.array(skillSchema).min(1),
});

export type CvStaticData = z.infer<typeof cvStaticDataSchema>;

// ============================================
// Translation data interfaces (for type safety)
// These match the structure in locale files
// ============================================

export interface TranslatedPersonalInfo {
  name: string;
  title: string;
}

export interface TranslatedExpertise {
  title: string;
  description: string;
}

export interface TranslatedExperience {
  company: string;
  role: string;
  location: string;
  highlights?: string[];
  summary?: string;
}

export interface TranslatedEducation {
  institution: string;
  degree: string;
}

export interface TranslatedLanguage {
  language: string;
  level: string;
}

export interface TranslatedContribution {
  type: string;
  date: string;
  description: string;
}

export interface TranslatedCvData {
  personal: TranslatedPersonalInfo;
  summary: string;
  expertise: TranslatedExpertise[];
  experiences: TranslatedExperience[];
  education: TranslatedEducation[];
  languages: TranslatedLanguage[];
  contributions: TranslatedContribution[];
}