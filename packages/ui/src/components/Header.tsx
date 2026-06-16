'use client';

import { ReactNode, useState, useEffect, useRef } from 'react';
import { FoxLogo } from './FoxLogo';
import { FoxMark } from './FoxMark';

interface NavItem {
  href: string;
  label: string;
}

export interface HeaderProps {
  logo?: ReactNode;
  className?: string;
  homeUrl?: string;
  navItems?: NavItem[];
  secondaryNavItems?: NavItem[];
  currentPath?: string;
  actions?: ReactNode;
  menuLabels?: {
    open: string;
    close: string;
  };
}

/**
 * Header = îlot flottant translucide (glass-card), détaché des bords.
 *
 * Deux formats pilotés par le SCROLL, avec transition animée (CSS pur) :
 * - extended (sommet)   : logo PNG complet (aurore, comme l'accueil) + wordmark + actions
 *                         sur la 1ʳᵉ ligne, nav desktop sur une 2ᵉ ligne ;
 * - compacted (défilé)  : signet SVG + wordmark + nav inline + actions sur une seule ligne.
 *
 * Animation : le logo PNG↔SVG fait un cross-fade dans un conteneur qui transitionne sa
 * taille (48↔34) ; la nav ligne 2 se replie (max-height + opacity) tandis que la nav inline
 * apparaît en fondu dans un créneau flex-1 déjà réservé (aucun reflow). `aria-hidden` bascule
 * pour n'exposer qu'une seule nav à la fois (a11y + pas de double landmark).
 *
 * `<Daviani.dev/>` est TOUJOURS affiché. Le « . » est en orange feu.
 */
export function Header({
  logo,
  className = '',
  homeUrl = '/',
  navItems = [],
  secondaryNavItems = [],
  currentPath = '',
  actions,
  menuLabels = { open: 'Open menu', close: 'Close menu' },
}: HeaderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // extended au sommet, compacted dès qu'on défile (seuil bas, déclenchement franc).
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll(); // état initial si la page est déjà défilée (refresh, ancre).
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Ferme le menu mobile au clic extérieur.
  useEffect(() => {
    if (!isOpen) return;

    function handleClickOutside(event: MouseEvent) {
      if (headerRef.current && !headerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  // Gestion du focus clavier du menu mobile : focus dans le menu à l'ouverture,
  // Escape pour fermer et rendre le focus au bouton déclencheur (disclosure, pas de trap).
  useEffect(() => {
    if (!isOpen) return;
    menuRef.current?.querySelector<HTMLElement>('a')?.focus();

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsOpen(false);
        triggerRef.current?.focus();
      }
    }

    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [isOpen]);

  const isActive = (href: string) =>
    currentPath === href || currentPath.startsWith(`${href}/`);

  const linkBase =
    'relative px-3 py-2 font-medium rounded-lg transition-colors whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2';
  // Taille des liens nav desktop : agrandis en extended (sommet), réduits en compacted (défilé).
  const linkSize = scrolled ? 'text-sm' : 'text-base md:text-lg';
  const linkInactive = 'text-fg-muted hover:text-fg hover:bg-surface-hi';
  const linkActive = 'text-fg font-semibold';

  // Lien de nav avec indicateur d'item actif = puce orange (accent chaud, règle 10%).
  const navLink = (item: NavItem) => {
    const active = isActive(item.href);
    return (
      <li key={item.href}>
        <a
          href={item.href}
          className={`${linkBase} ${linkSize} ${active ? linkActive : linkInactive}`}
          aria-current={active ? 'page' : undefined}
        >
          {item.label}
          {active && (
            <span
              aria-hidden="true"
              className="pointer-events-none absolute left-1/2 -translate-x-1/2 bottom-1 h-0.5 w-4 rounded-full bg-fire"
            />
          )}
        </a>
      </li>
    );
  };

  const brand = logo ?? (
    <a
      href={homeUrl}
      aria-label="Daviani.dev - Retour à l'accueil"
      className="flex items-center gap-2.5 cursor-pointer rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2"
    >
      {/* Cross-fade logo PNG (extended) ↔ signet SVG (compacted), conteneur qui se redimensionne. */}
      <span
        className={`relative block shrink-0 transition-all duration-300 ${
          scrolled ? 'w-[34px] h-[34px]' : 'w-16 h-16 md:w-32 md:h-32'
        }`}
      >
        <FoxLogo
          className={`absolute inset-0 w-full h-full transition-opacity duration-300 ${
            scrolled ? 'opacity-0' : 'opacity-100'
          }`}
        />
        <FoxMark
          className={`absolute inset-0 w-full h-full transition-opacity duration-300 ${
            scrolled ? 'opacity-100' : 'opacity-0'
          }`}
        />
      </span>
      {/* Wordmark TOUJOURS visible, agrandi en extended et réduit au scroll. Le « . » = étincelle orange feu. */}
      <span
        className={`font-mono font-bold whitespace-nowrap transition-all duration-300 ${
          scrolled ? 'text-base md:text-lg' : 'text-2xl md:text-4xl'
        }`}
      >
        <span className="text-accent">&lt;</span>
        <span className="text-fg">Daviani</span>
        <span className="text-fire font-extrabold">.</span>
        <span className="text-accent">dev</span>
        <span className="text-accent">/&gt;</span>
      </span>
    </a>
  );

  return (
    <header
      ref={headerRef}
      className={`fixed top-[var(--spacing-edge)] left-[var(--spacing-edge)] right-[var(--spacing-edge)] z-50 glass-card ${className}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-1.5">
        {/* Tout sur UNE ligne : logo + wordmark | nav inline | actions | burger mobile.
            La hauteur de la barre = celle du logo (élément le plus haut) → ≤140 en extended. */}
        <div className="flex items-center justify-between gap-4">
          <div className="shrink-0">{brand}</div>

          {/* Nav inline desktop — toujours visible (extended ET compacted), ne bouge pas */}
          {navItems.length > 0 && (
            <nav aria-label="Navigation principale" className="hidden md:flex flex-1 justify-center">
              <ul className="flex items-center gap-1">{navItems.map(navLink)}</ul>
            </nav>
          )}

          {actions && <div className="hidden md:flex items-center gap-4 shrink-0">{actions}</div>}

          <div className="md:hidden">
            <button
              ref={triggerRef}
              onClick={() => setIsOpen(!isOpen)}
              className="p-3 rounded-lg text-fg-muted hover:bg-surface-hi focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 transition-colors"
              aria-expanded={isOpen}
              aria-controls="mobile-menu"
              aria-label={isOpen ? menuLabels.close : menuLabels.open}
            >
              {isOpen ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Menu mobile déroulant */}
        {isOpen && (
          <div id="mobile-menu" ref={menuRef} className="md:hidden pb-4 mt-2">
            {navItems.length > 0 && (
              <ul className="flex flex-col items-center gap-1">
                {navItems.map((item) => {
                  const active = isActive(item.href);
                  return (
                    <li key={item.href} className="w-full">
                      <a
                        href={item.href}
                        className={`${linkBase} ${active ? linkActive : linkInactive} block text-center text-sm`}
                        aria-current={active ? 'page' : undefined}
                        onClick={() => setIsOpen(false)}
                      >
                        {item.label}
                      </a>
                    </li>
                  );
                })}
              </ul>
            )}

            {secondaryNavItems.length > 0 && (
              <ul className="flex flex-col items-center gap-1 mt-2 pt-2 border-t border-fg-subtle/30">
                {secondaryNavItems.map((item) => {
                  const active = isActive(item.href);
                  return (
                    <li key={item.href} className="w-full">
                      <a
                        href={item.href}
                        className={`${linkBase} ${active ? linkActive : linkInactive} block text-center text-xs`}
                        aria-current={active ? 'page' : undefined}
                        onClick={() => setIsOpen(false)}
                      >
                        {item.label}
                      </a>
                    </li>
                  );
                })}
              </ul>
            )}

            {actions && (
              <div className="flex items-center justify-center gap-4 mt-2 pt-2 border-t border-fg-subtle/30">
                {actions}
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
