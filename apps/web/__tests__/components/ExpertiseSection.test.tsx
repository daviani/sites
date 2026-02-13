import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ExpertiseSection } from '@/components/ExpertiseSection';

vi.mock('@nordic-island/ui', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        'home.expertise.title': 'Ce que je fais',
        'home.expertise.fullstack.title': 'Développement Full-Stack',
        'home.expertise.fullstack.description': 'Applications web modernes',
        'home.expertise.devops.title': 'DevOps & CI/CD',
        'home.expertise.devops.description': 'Pipelines automatisés',
        'home.expertise.infra.title': 'Infrastructure',
        'home.expertise.infra.description': 'Administration serveurs',
        'home.expertise.architecture.title': 'Architecture',
        'home.expertise.architecture.description': 'Conception d\'applications',
        'home.expertise.database.title': 'Bases de données',
        'home.expertise.database.description': 'PostgreSQL, MySQL',
        'home.expertise.accessibility.title': 'Accessibilité',
        'home.expertise.accessibility.description': 'RGAA et WCAG',
      };
      return translations[key] || key;
    },
  }),
}));

describe('ExpertiseSection', () => {
  it('renders section title', () => {
    render(<ExpertiseSection />);

    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Ce que je fais');
  });

  it('renders all 6 expertise cards', () => {
    render(<ExpertiseSection />);

    expect(screen.getByText('Développement Full-Stack')).toBeInTheDocument();
    expect(screen.getByText('DevOps & CI/CD')).toBeInTheDocument();
    expect(screen.getByText('Infrastructure')).toBeInTheDocument();
    expect(screen.getByText('Architecture')).toBeInTheDocument();
    expect(screen.getByText('Bases de données')).toBeInTheDocument();
    expect(screen.getByText('Accessibilité')).toBeInTheDocument();
  });

  it('renders descriptions for expertise cards', () => {
    render(<ExpertiseSection />);

    expect(screen.getByText('Applications web modernes')).toBeInTheDocument();
    expect(screen.getByText('Pipelines automatisés')).toBeInTheDocument();
  });

  it('renders icons for each expertise', () => {
    const { container } = render(<ExpertiseSection />);

    const svgIcons = container.querySelectorAll('svg');
    expect(svgIcons).toHaveLength(6);
  });

  it('has proper grid layout', () => {
    const { container } = render(<ExpertiseSection />);

    const grid = container.querySelector('.grid');
    expect(grid).toHaveClass('grid-cols-1');
    expect(grid).toHaveClass('sm:grid-cols-2');
    expect(grid).toHaveClass('lg:grid-cols-3');
  });
});
