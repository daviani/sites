interface NavigationCardProps {
  href: string;
  icon: string;
  title: string;
  description: string;
}

export function NavigationCard({ href, icon, title, description }: NavigationCardProps) {
  return (
    <a
      href={href}
      className="group bg-white dark:bg-nord1 p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all hover:scale-105"
    >
      <div className="text-4xl mb-2">{icon}</div>
      <h3 className="text-lg font-bold text-nord10 group-hover:text-nord9">
        {title}
      </h3>
      <p className="text-sm text-nord3 dark:text-nord4 mt-1">
        {description}
      </p>
    </a>
  );
}
