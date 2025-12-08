/* eslint-env jest */
import {
  experienceStaticSchema,
  educationStaticSchema,
  skillSchema,
  personalInfoStaticSchema,
  cvStaticDataSchema,
  type ExperienceStatic,
  type EducationStatic,
  type Skill,
  type PersonalInfoStatic,
  type CvStaticData,
} from '@/lib/schemas/cv';

describe('CV Static Data Schemas', () => {
  describe('experienceStaticSchema', () => {
    const validExperience = {
      start: '2023-01',
      end: null,
      current: true,
      stack: ['Tech1', 'Tech2'],
    };

    it('accepts valid experience with current=true and end=null', () => {
      const result = experienceStaticSchema.safeParse(validExperience);
      expect(result.success).toBe(true);
    });

    it('accepts experience with end date and current=false', () => {
      const past = { ...validExperience, end: '2024-01', current: false };
      const result = experienceStaticSchema.safeParse(past);
      expect(result.success).toBe(true);
    });

    it('accepts empty stack array', () => {
      const result = experienceStaticSchema.safeParse({ ...validExperience, stack: [] });
      expect(result.success).toBe(true);
    });

    it('accepts experience with compact flag', () => {
      const compact = { ...validExperience, compact: true };
      const result = experienceStaticSchema.safeParse(compact);
      expect(result.success).toBe(true);
    });

    it('rejects missing start', () => {
      const { start, ...invalid } = validExperience;
      expect(experienceStaticSchema.safeParse(invalid).success).toBe(false);
    });

    it('rejects stack as string instead of array', () => {
      const invalid = { ...validExperience, stack: 'not-array' };
      expect(experienceStaticSchema.safeParse(invalid).success).toBe(false);
    });

    it('rejects missing current', () => {
      const { current, ...invalid } = validExperience;
      expect(experienceStaticSchema.safeParse(invalid).success).toBe(false);
    });
  });

  describe('educationStaticSchema', () => {
    const validEducation = {
      start: '2020',
      end: '2022',
    };

    it('accepts valid education', () => {
      const result = educationStaticSchema.safeParse(validEducation);
      expect(result.success).toBe(true);
    });

    it('rejects missing start', () => {
      const { start, ...invalid } = validEducation;
      expect(educationStaticSchema.safeParse(invalid).success).toBe(false);
    });

    it('rejects missing end', () => {
      const { end, ...invalid } = validEducation;
      expect(educationStaticSchema.safeParse(invalid).success).toBe(false);
    });
  });

  describe('skillSchema', () => {
    it('accepts valid skill with category', () => {
      const result = skillSchema.safeParse({ name: 'Skill', category: 'frontend' });
      expect(result.success).toBe(true);
    });

    it('accepts all valid categories', () => {
      const categories = ['frontend', 'backend', 'devops', 'tools', 'soft'] as const;
      categories.forEach((category) => {
        expect(skillSchema.safeParse({ name: 'X', category }).success).toBe(true);
      });
    });

    it('rejects invalid category', () => {
      const result = skillSchema.safeParse({ name: 'X', category: 'invalid' });
      expect(result.success).toBe(false);
    });

    it('rejects missing name', () => {
      const result = skillSchema.safeParse({ category: 'frontend' });
      expect(result.success).toBe(false);
    });
  });

  describe('personalInfoStaticSchema', () => {
    const validPersonal = {
      birthYear: 1990,
      experienceYears: 5,
      location: 'City',
      email: 'email@test.com',
      linkedin: 'https://linkedin.com/in/x',
      github: 'https://github.com/x',
      website: 'https://example.com',
    };

    it('accepts valid personal info', () => {
      const result = personalInfoStaticSchema.safeParse(validPersonal);
      expect(result.success).toBe(true);
    });

    it('accepts personal info with optional phone', () => {
      const withPhone = { ...validPersonal, phone: '+33 6 00 00 00 00' };
      const result = personalInfoStaticSchema.safeParse(withPhone);
      expect(result.success).toBe(true);
    });

    it('accepts personal info with optional photo', () => {
      const withPhoto = { ...validPersonal, photo: '/images/photo.jpg' };
      const result = personalInfoStaticSchema.safeParse(withPhoto);
      expect(result.success).toBe(true);
    });

    it('rejects missing email', () => {
      const { email, ...invalid } = validPersonal;
      expect(personalInfoStaticSchema.safeParse(invalid).success).toBe(false);
    });

    it('rejects missing experienceYears', () => {
      const { experienceYears, ...invalid } = validPersonal;
      expect(personalInfoStaticSchema.safeParse(invalid).success).toBe(false);
    });

    it('rejects birthYear as string', () => {
      const invalid = { ...validPersonal, birthYear: '1990' };
      expect(personalInfoStaticSchema.safeParse(invalid).success).toBe(false);
    });

    it('rejects negative experienceYears', () => {
      const invalid = { ...validPersonal, experienceYears: -1 };
      expect(personalInfoStaticSchema.safeParse(invalid).success).toBe(false);
    });

    it('rejects invalid email', () => {
      const invalid = { ...validPersonal, email: 'not-an-email' };
      expect(personalInfoStaticSchema.safeParse(invalid).success).toBe(false);
    });

    it('rejects invalid URL for linkedin', () => {
      const invalid = { ...validPersonal, linkedin: 'not-a-url' };
      expect(personalInfoStaticSchema.safeParse(invalid).success).toBe(false);
    });
  });

  describe('cvStaticDataSchema', () => {
    const minimalValidCv = {
      personal: {
        birthYear: 1990,
        experienceYears: 5,
        location: 'City',
        email: 'x@x.com',
        linkedin: 'https://linkedin.com/in/x',
        github: 'https://github.com/x',
        website: 'https://x.com',
      },
      skills: [{ name: 'S', category: 'frontend' as const }],
      experiences: [
        {
          start: '2023',
          end: null,
          current: true,
          stack: [],
        },
      ],
      education: [{ start: '2020', end: '2022' }],
    };

    it('accepts minimal valid CV structure', () => {
      const result = cvStaticDataSchema.safeParse(minimalValidCv);
      expect(result.success).toBe(true);
    });

    it('rejects missing personal', () => {
      const { personal, ...invalid } = minimalValidCv;
      expect(cvStaticDataSchema.safeParse(invalid).success).toBe(false);
    });

    it('rejects missing experiences', () => {
      const { experiences, ...invalid } = minimalValidCv;
      expect(cvStaticDataSchema.safeParse(invalid).success).toBe(false);
    });

    it('rejects empty experiences array', () => {
      const invalid = { ...minimalValidCv, experiences: [] };
      expect(cvStaticDataSchema.safeParse(invalid).success).toBe(false);
    });

    it('rejects missing skills', () => {
      const { skills, ...invalid } = minimalValidCv;
      expect(cvStaticDataSchema.safeParse(invalid).success).toBe(false);
    });

    it('rejects empty skills array', () => {
      const invalid = { ...minimalValidCv, skills: [] };
      expect(cvStaticDataSchema.safeParse(invalid).success).toBe(false);
    });

    it('rejects missing education', () => {
      const { education, ...invalid } = minimalValidCv;
      expect(cvStaticDataSchema.safeParse(invalid).success).toBe(false);
    });

    it('rejects empty education array', () => {
      const invalid = { ...minimalValidCv, education: [] };
      expect(cvStaticDataSchema.safeParse(invalid).success).toBe(false);
    });
  });

  describe('type inference', () => {
    it('ExperienceStatic type is correctly inferred', () => {
      const exp: ExperienceStatic = {
        start: '2023',
        end: null,
        current: true,
        stack: [],
      };
      expect(experienceStaticSchema.safeParse(exp).success).toBe(true);
    });

    it('EducationStatic type is correctly inferred', () => {
      const edu: EducationStatic = {
        start: '2020',
        end: '2022',
      };
      expect(educationStaticSchema.safeParse(edu).success).toBe(true);
    });

    it('Skill type is correctly inferred', () => {
      const skill: Skill = { name: 'S', category: 'backend' };
      expect(skillSchema.safeParse(skill).success).toBe(true);
    });

    it('PersonalInfoStatic type is correctly inferred', () => {
      const personal: PersonalInfoStatic = {
        birthYear: 1990,
        experienceYears: 5,
        location: 'City',
        email: 'x@x.com',
        linkedin: 'https://linkedin.com/in/x',
        github: 'https://github.com/x',
        website: 'https://x.com',
      };
      expect(personalInfoStaticSchema.safeParse(personal).success).toBe(true);
    });

    it('CvStaticData type is correctly inferred', () => {
      const cv: CvStaticData = {
        personal: {
          birthYear: 1990,
          experienceYears: 5,
          location: 'City',
          email: 'x@x.com',
          linkedin: 'https://linkedin.com/in/x',
          github: 'https://github.com/x',
          website: 'https://x.com',
        },
        skills: [{ name: 'S', category: 'frontend' }],
        experiences: [{ start: '2023', end: null, current: true, stack: [] }],
        education: [{ start: '2020', end: '2022' }],
      };
      expect(cvStaticDataSchema.safeParse(cv).success).toBe(true);
    });
  });
});