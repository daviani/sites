'use client';

import { useTranslation } from '@/hooks/use-translation';
import Image from 'next/image';
import type { LocalizedCvData } from '@/lib/content/cv-keystatic';

type SkillsByCategory = Record<string, string[]>;

interface CvIslandProps {
  cvData: LocalizedCvData;
  skillsByCategory: SkillsByCategory;
}

/**
 * Mapping category keys → compact display labels per language.
 * Merged: os + cloud → "Infra", tools excluded (shown in PDF only).
 */
const categoryLabels: Record<string, { fr: string; en: string }> = {
  frontend: { fr: 'Front', en: 'Front' },
  backend: { fr: 'Back', en: 'Back' },
  cicd: { fr: 'CI/CD', en: 'CI/CD' },
  infra: { fr: 'Infra', en: 'Infra' },
  databases: { fr: 'BDD', en: 'DB' },
  shell: { fr: 'Shell', en: 'Shell' },
  testing: { fr: 'Tests', en: 'Tests' },
};

/** Order of skill groups displayed in the island */
const displayOrder = ['frontend', 'backend', 'cicd', 'infra', 'databases', 'shell', 'testing'];

export function CvIsland({ cvData, skillsByCategory }: CvIslandProps) {
  const { t, language } = useTranslation();
  const { personal, subtitle, languages } = cvData;

  // Merge os + cloud into "infra" for compact display
  const mergedSkills: Record<string, string[]> = {
    ...skillsByCategory,
    infra: [
      ...(skillsByCategory.os || []),
      ...(skillsByCategory.cloud || []),
    ],
  };

  // Build skill groups to display (non-empty only)
  const skillGroups = displayOrder
    .map((key) => ({
      key,
      label: categoryLabels[key]?.[language as 'fr' | 'en'] || key,
      items: mergedSkills[key] || [],
    }))
    .filter((g) => g.items.length > 0);

  // Build languages entry for skills row
  const langEntry = languages.length > 0
    ? languages.map((l) => `${l.language} ${l.level.toLowerCase()}`).join(', ')
    : null;

  return (
    <header
      className="overflow-hidden rounded-[20px] border border-nord-1 bg-nord-0 px-6 pb-6 pt-7"
      style={{
        backgroundImage: `radial-gradient(ellipse at top, rgba(136, 192, 208, 0.12) 0%, transparent 60%)`,
      }}
    >
      {/* Title row — centered */}
      <div className="pb-3.5 text-center">
        <h2 className="text-base font-bold leading-snug tracking-tight text-nord-8 md:text-[16px]">
          {personal.name}
        </h2>
        <p className="mt-1 text-[12px] font-semibold tracking-wide text-nord-9">
          {personal.title}
        </p>
      </div>

      {/* 3-column grid: info | photo | contact */}
      <div className="grid grid-cols-1 items-center gap-3 md:grid-cols-[1fr_auto_1fr] md:gap-x-3.5">
        {/* Left column — info */}
        <div className="flex flex-col items-center gap-1 text-[10.5px] leading-relaxed text-nord-4 md:items-end md:text-right">
          <span className="rounded px-1.5 py-1 font-medium">
            {personal.experienceYears} {t('pages.cv.labels.yearsExperience')}
          </span>
          {subtitle && (
            <span className="font-medium tracking-wide opacity-85">
              {subtitle.split(' · ').map((word, i) => (
                <span key={i}>
                  {i > 0 && ' · '}
                  <span className="rounded px-1.5 py-1">{word}</span>
                </span>
              ))}
            </span>
          )}
          <span className="rounded px-1.5 py-1 opacity-75">{personal.location}</span>
        </div>

        {/* Center — photo */}
        <div className="hidden md:flex justify-center">
          {personal.photo ? (
            <div className="relative h-20 w-20 overflow-hidden rounded-full border-[2.5px] border-nord-8">
              <Image
                src={personal.photo}
                alt={personal.name}
                fill
                className="object-cover"
                sizes="80px"
                priority
              />
            </div>
          ) : (
            <div className="flex h-20 w-20 items-center justify-center rounded-full border-[2.5px] border-nord-8 bg-nord-0">
              <span className="text-2xl font-semibold text-nord-8">
                {personal.name.charAt(0)}
              </span>
            </div>
          )}
        </div>

        {/* Right column — contact */}
        <div className="flex flex-col items-center gap-1 text-[10.5px] leading-relaxed text-nord-4 md:items-start md:text-left">
          <a
            href={`mailto:${personal.email}`}
            aria-label={`Envoyer un email à ${personal.email}`}
            className="rounded px-1.5 py-1 text-white no-underline transition-colors hover:text-nord-8 focus:outline-none focus:ring-2 focus:ring-nord-10"
          >
            {personal.email}
          </a>
          <span className="px-1.5 py-1">
            {personal.website && (
              <a
                href={personal.website}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Site web ${personal.website.replace('https://', '')} (nouvelle fenêtre)`}
                className="rounded px-1.5 py-1 text-nord-4 no-underline transition-colors hover:text-nord-8 focus:outline-none focus:ring-2 focus:ring-nord-10"
              >
                {personal.website.replace('https://', '')}
              </a>
            )}
            {personal.github && (
              <>
                {' · '}
                <a
                  href={personal.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Profil GitHub (nouvelle fenêtre)"
                  className="rounded px-1.5 py-1 text-nord-4 no-underline transition-colors hover:text-nord-8 focus:outline-none focus:ring-2 focus:ring-nord-10"
                >
                  {personal.github.replace('https://', '')}
                </a>
              </>
            )}
            {personal.linkedin && (
              <>
                {' · '}
                <a
                  href={personal.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Profil LinkedIn (nouvelle fenêtre)"
                  className="rounded px-1.5 py-1 text-nord-4 no-underline transition-colors hover:text-nord-8 focus:outline-none focus:ring-2 focus:ring-nord-10"
                >
                  LinkedIn
                </a>
              </>
            )}
          </span>
          {personal.phone && (
            <span className="px-1.5 py-1 opacity-75">{personal.phone}</span>
          )}
        </div>
      </div>

      {/* Skills row */}
      <div className="mt-3.5 flex flex-wrap items-center justify-center gap-x-2.5 gap-y-1 border-t border-nord-1/50 pt-3.5 text-[9px] leading-normal">
        {skillGroups.map((group, i) => (
          <span key={group.key} className="flex items-center gap-1">
            {i > 0 && <span className="mr-1.5 text-nord-3">|</span>}
            <span className="font-semibold text-nord-8">{group.label} :</span>
            <span className="text-nord-4">{group.items.join(' · ')}</span>
          </span>
        ))}
        {langEntry && (
          <span className="flex items-center gap-1">
            <span className="mr-1.5 text-nord-3">|</span>
            <span className="font-semibold text-nord-8">
              {language === 'fr' ? 'Langues' : 'Languages'} :
            </span>
            <span className="text-nord-4">{langEntry}</span>
          </span>
        )}
      </div>
    </header>
  );
}
