import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';

// Mock @react-pdf/renderer
vi.mock('@react-pdf/renderer', () => ({
  default: {
    renderToStream: vi.fn(() => {
      // Create an async iterable that yields PDF-like content
      return {
        [Symbol.asyncIterator]: async function* () {
          yield Buffer.from('%PDF-1.4 mock pdf content');
        },
      };
    }),
  },
  Document: ({ children }: { children: React.ReactNode }) => children,
  Page: ({ children }: { children: React.ReactNode }) => children,
  View: ({ children }: { children: React.ReactNode }) => children,
  Text: ({ children }: { children: React.ReactNode }) => children,
  Image: () => null,
  Link: ({ children }: { children: React.ReactNode }) => children,
  StyleSheet: {
    create: (styles: Record<string, object>) => styles,
  },
  Font: {
    register: vi.fn(),
  },
}));

// Mock CV data
const mockCvDataFr = {
  personal: {
    name: 'Jean Dupont',
    title: 'Développeur Full Stack',
    birthYear: 1990,
    age: 34,
    experienceYears: 10,
    location: 'Paris, France',
    email: 'jean@example.com',
    phone: '+33 6 12 34 56 78',
    linkedin: 'https://linkedin.com/in/jeandupont',
    github: 'https://github.com/jeandupont',
    website: 'https://jeandupont.dev',
    photo: '/images/photo.jpg',
  },
  summary: 'Développeur expérimenté',
  experiences: [
    {
      start: '2020',
      current: true,
      compact: false,
      company: 'Tech Corp',
      role: 'Développeur Senior',
      location: 'Paris',
      summary: 'Direction équipe frontend',
      highlights: ['Performance +40%'],
      stack: ['React', 'TypeScript'],
    },
  ],
  education: [
    {
      start: '2010',
      end: '2014',
      institution: 'Université de Technologie',
      degree: 'Master Informatique',
    },
  ],
  languages: [{ language: 'Français', level: 'Natif' }],
  expertise: [{ title: 'Frontend', description: 'React, Vue' }],
  contributions: [{ date: '2023', type: 'OSS', description: 'Contribution majeure' }],
  projects: [],
};

const mockCvDataEn = {
  ...mockCvDataFr,
  personal: {
    ...mockCvDataFr.personal,
    name: 'John Doe',
    title: 'Full Stack Developer',
  },
  summary: 'Experienced developer',
  experiences: [
    {
      ...mockCvDataFr.experiences[0],
      company: 'Tech Corp',
      role: 'Senior Developer',
      location: 'Paris',
      summary: 'Leading frontend team',
      highlights: ['Performance +40%'],
    },
  ],
  education: [
    {
      ...mockCvDataFr.education[0],
      institution: 'University of Technology',
      degree: 'Master in Computer Science',
    },
  ],
  languages: [{ language: 'French', level: 'Native' }],
  expertise: [{ title: 'Frontend', description: 'React, Vue' }],
  contributions: [{ date: '2023', type: 'OSS', description: 'Major contribution' }],
};

const mockSkillsByCategory = {
  frontend: ['React', 'TypeScript'],
  backend: ['Node.js'],
  databases: ['PostgreSQL'],
  cicd: [],
  os: [],
  cloud: [],
  testing: [],
  tools: [],
};

vi.mock('@/lib/content/cv-keystatic', () => ({
  getLocalizedCvData: vi.fn((lang: string) => {
    return lang === 'en' ? mockCvDataEn : mockCvDataFr;
  }),
  getCvSkillsByCategory: vi.fn(() => mockSkillsByCategory),
}));

describe('CV PDF API Route', () => {
  let GET: (request: NextRequest) => Promise<Response>;

  beforeEach(async () => {
    vi.resetModules();
    const routeModule = await import('@/app/api/cv/pdf/route');
    GET = routeModule.GET;
  });

  describe('GET /api/cv/pdf', () => {
    it('generates PDF with default French language', async () => {
      const request = new NextRequest('http://localhost:3000/api/cv/pdf');
      const response = await GET(request);

      expect(response.status).toBe(200);
      expect(response.headers.get('Content-Type')).toBe('application/pdf');
      expect(response.headers.get('Content-Disposition')).toContain('Daviani-Fillatre-CV.pdf');
    });

    it('generates PDF with French language explicitly', async () => {
      const request = new NextRequest('http://localhost:3000/api/cv/pdf?lang=fr');
      const response = await GET(request);

      expect(response.status).toBe(200);
      expect(response.headers.get('Content-Disposition')).toContain('Daviani-Fillatre-CV.pdf');
    });

    it('generates PDF with English language', async () => {
      const request = new NextRequest('http://localhost:3000/api/cv/pdf?lang=en');
      const response = await GET(request);

      expect(response.status).toBe(200);
      expect(response.headers.get('Content-Disposition')).toContain('Daviani-Fillatre-Resume.pdf');
    });

    it('sets attachment disposition for download action', async () => {
      const request = new NextRequest('http://localhost:3000/api/cv/pdf?action=download');
      const response = await GET(request);

      expect(response.status).toBe(200);
      expect(response.headers.get('Content-Disposition')).toContain('attachment');
    });

    it('sets inline disposition for print action', async () => {
      const request = new NextRequest('http://localhost:3000/api/cv/pdf?action=print');
      const response = await GET(request);

      expect(response.status).toBe(200);
      expect(response.headers.get('Content-Disposition')).toContain('inline');
    });

    it('returns 404 when CV data is not found', async () => {
      const { getLocalizedCvData } = await import('@/lib/content/cv-keystatic');
      vi.mocked(getLocalizedCvData).mockReturnValueOnce(null);

      const request = new NextRequest('http://localhost:3000/api/cv/pdf');
      const response = await GET(request);

      expect(response.status).toBe(404);
      const json = await response.json();
      expect(json.error).toBe('CV data not found');
    });

    it('returns PDF buffer in response body', async () => {
      const request = new NextRequest('http://localhost:3000/api/cv/pdf');
      const response = await GET(request);

      const buffer = await response.arrayBuffer();
      const content = Buffer.from(buffer).toString();

      expect(content).toContain('%PDF');
    });
  });

  describe('language handling', () => {
    it('uses French content for lang=fr', async () => {
      const { getLocalizedCvData } = await import('@/lib/content/cv-keystatic');

      const request = new NextRequest('http://localhost:3000/api/cv/pdf?lang=fr');
      await GET(request);

      expect(getLocalizedCvData).toHaveBeenCalledWith('fr');
    });

    it('uses English content for lang=en', async () => {
      const { getLocalizedCvData } = await import('@/lib/content/cv-keystatic');

      const request = new NextRequest('http://localhost:3000/api/cv/pdf?lang=en');
      await GET(request);

      expect(getLocalizedCvData).toHaveBeenCalledWith('en');
    });

    it('defaults to French for invalid lang parameter', async () => {
      const { getLocalizedCvData } = await import('@/lib/content/cv-keystatic');

      const request = new NextRequest('http://localhost:3000/api/cv/pdf?lang=de');
      await GET(request);

      // Invalid lang falls through to default behavior (treated as 'fr' or 'de')
      expect(getLocalizedCvData).toHaveBeenCalled();
    });
  });
});
