import { NavigationCard } from '@/components/NavigationCard';

const navigationItems = [
  {
    href: 'https://portfolio.daviani.dev',
    icon: '💼',
    title: 'Portfolio',
    description: 'Projets & compétences'
  },
  {
    href: 'https://blog.daviani.dev',
    icon: '📝',
    title: 'Blog',
    description: 'Articles techniques'
  },
  {
    href: 'https://cv.daviani.dev',
    icon: '📄',
    title: 'CV',
    description: 'Curriculum vitae'
  },
  {
    href: 'https://contact.daviani.dev',
    icon: '✉️',
    title: 'Contact',
    description: 'Prenons contact'
  },
  {
    href: 'https://rdv.daviani.dev',
    icon: '📅',
    title: 'Rendez-vous',
    description: 'Planifier'
  },
  {
    href: 'https://legal.daviani.dev',
    icon: '⚖️',
    title: 'Légal',
    description: 'Mentions légales'
  }
];

export default function RootPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-nord6 via-nord5 to-nord4 dark:from-nord0 dark:via-nord1 dark:to-nord2">
      <div className="max-w-3xl mx-auto px-6 py-12 text-center">
        <h1 className="text-6xl font-bold mb-6 text-nord0 dark:text-nord6">
          Daviani Fillatre
        </h1>
        <p className="text-2xl text-nord2 dark:text-nord4 mb-12">
          Développeur Full-Stack & DevOps
        </p>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
          {navigationItems.map((item) => (
            <NavigationCard
              key={item.href}
              href={item.href}
              icon={item.icon}
              title={item.title}
              description={item.description}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
