import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { CvPageContent } from '@/components/cv/CvPageContent';
import type { LocalizedCvData } from '@/lib/content/cv-keystatic';

vi.mock('@/hooks/use-translation', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        'pages.cv.title': 'Curriculum Vitae',
        'pages.cv.subtitle': 'Développeur Full Stack',
        'pages.cv.labels.download': 'Télécharger',
      };
      return translations[key] || key;
    },
    language: 'fr',
  }),
}));

vi.mock('@nordic-island/ui', () => ({
  Breadcrumb: ({ items }: { items: { href: string; label: string }[] }) => (
    <nav data-testid="breadcrumb">
      {items.map((item) => (
        <a key={item.href} href={item.href}>
          {item.label}
        </a>
      ))}
    </nav>
  ),
}));

vi.mock('@/components/cv/CvLayout', () => ({
  CvLayout: () => <div data-testid="cv-layout">CV Layout</div>,
}));

vi.mock('@/components/cv/CvDownloadButton', () => ({
  CvDownloadButton: () => <button data-testid="download-button">Download</button>,
}));

describe('CvPageContent', () => {
  const mockCvDataFr = {
    personal: {
      name: 'John Doe',
      title: 'Développeur',
      birthYear: 1990,
      age: 36,
      experienceYears: 5,
      location: 'Paris',
      email: 'john@example.com',
    },
    summary: 'Résumé en français',
    experiences: [],
    expertise: [],
    contributions: [],
    education: [],
    skills: [],
    languages: [],
    projects: [],
  } as LocalizedCvData;

  const mockCvDataEn = {
    ...mockCvDataFr,
    summary: 'Summary in English',
  } as LocalizedCvData;

  const mockSkillsByCategory = {
    Frontend: ['React', 'TypeScript'],
    Backend: ['Node.js', 'Python'],
  };

  it('renders breadcrumb', () => {
    render(
      <CvPageContent
        cvDataFr={mockCvDataFr}
        cvDataEn={mockCvDataEn}
        skillsByCategory={mockSkillsByCategory}
      />
    );

    expect(screen.getByTestId('breadcrumb')).toBeInTheDocument();
  });

  it('renders page title', () => {
    render(
      <CvPageContent
        cvDataFr={mockCvDataFr}
        cvDataEn={mockCvDataEn}
        skillsByCategory={mockSkillsByCategory}
      />
    );

    expect(screen.getByText('Curriculum Vitae')).toBeInTheDocument();
  });

  it('renders page subtitle', () => {
    render(
      <CvPageContent
        cvDataFr={mockCvDataFr}
        cvDataEn={mockCvDataEn}
        skillsByCategory={mockSkillsByCategory}
      />
    );

    expect(screen.getByText('Développeur Full Stack')).toBeInTheDocument();
  });

  it('renders CV layout', () => {
    render(
      <CvPageContent
        cvDataFr={mockCvDataFr}
        cvDataEn={mockCvDataEn}
        skillsByCategory={mockSkillsByCategory}
      />
    );

    expect(screen.getByTestId('cv-layout')).toBeInTheDocument();
  });

  it('renders download buttons (top and bottom)', () => {
    render(
      <CvPageContent
        cvDataFr={mockCvDataFr}
        cvDataEn={mockCvDataEn}
        skillsByCategory={mockSkillsByCategory}
      />
    );

    const downloadButtons = screen.getAllByTestId('download-button');
    expect(downloadButtons).toHaveLength(2);
  });
});
