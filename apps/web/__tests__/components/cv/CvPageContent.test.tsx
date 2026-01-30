import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { CvPageContent } from '@/components/cv/CvPageContent';

vi.mock('@daviani/ui', () => ({
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
  Breadcrumb: ({ items }: { items: { href: string; labelKey: string }[] }) => (
    <nav data-testid="breadcrumb">
      {items.map((item) => (
        <a key={item.href} href={item.href}>
          {item.labelKey}
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
    basics: {
      name: 'John Doe',
      label: 'Développeur',
      email: 'john@example.com',
      url: 'https://example.com',
      location: { city: 'Paris', region: 'IDF' },
      summary: 'Résumé en français',
      profiles: [],
    },
    work: [],
    education: [],
    skills: [],
    languages: [],
    certificates: [],
    projects: [],
  };

  const mockCvDataEn = {
    ...mockCvDataFr,
    basics: { ...mockCvDataFr.basics, summary: 'Summary in English' },
  };

  const mockSkillsByCategory = {
    Frontend: ['React', 'TypeScript'],
    Backend: ['Node.js', 'Python'],
  };

  it('renders page title', () => {
    render(
      <CvPageContent
        cvDataFr={mockCvDataFr}
        cvDataEn={mockCvDataEn}
        skillsByCategory={mockSkillsByCategory}
      />
    );

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Curriculum Vitae');
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
