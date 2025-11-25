import { Card } from '@daviani/ui';

interface NavigationCardProps {
  href: string;
  icon: string;
  title: string;
  description: string;
}

export function NavigationCard({ href, icon, title, description }: NavigationCardProps) {
  return (
    <a href={href} className="block group">
      <Card variant="elevated" className="hover:scale-105">
        <div className="text-4xl mb-2">{icon}</div>
        <h3 className="text-lg font-bold text-nord-10 dark:text-nord-8 group-hover:text-nord-9">
          {title}
        </h3>
        <p className="text-sm text-nord-3 dark:text-nord-4 mt-1">
          {description}
        </p>
      </Card>
    </a>
  );
}

