'use client';

import { useTranslation } from '@daviani/ui';
import Image from 'next/image';
import type { LocalizedCvData } from '@/lib/content/cv-keystatic';

type SkillsByCategory = Record<string, string[]>;

interface CvSidebarProps {
  cvData: LocalizedCvData;
  skillsByCategory: SkillsByCategory;
}

const categoryLabels: Record<string, { fr: string; en: string }> = {
  frontend: { fr: 'Front-end', en: 'Front-end' },
  backend: { fr: 'Back-end', en: 'Back-end' },
  databases: { fr: 'BDD', en: 'Databases' },
  cicd: { fr: 'CI/CD', en: 'CI/CD' },
  os: { fr: 'Systèmes', en: 'Systems' },
  cloud: { fr: 'Cloud', en: 'Cloud' },
  testing: { fr: 'Testing', en: 'Testing' },
  tools: { fr: 'Outils', en: 'Tools' },
};

const categoryOrder = ['frontend', 'backend', 'databases', 'cicd', 'os', 'cloud', 'testing', 'tools'];

export function CvSidebar({ cvData, skillsByCategory }: CvSidebarProps) {
  const { t, language } = useTranslation();

  const { personal, expertise, contributions, languages } = cvData;

  return (
    <aside className="relative mx-auto flex w-[calc(100%-2rem)] flex-col overflow-hidden rounded-xl bg-nord-1 shadow-lg md:mx-0 md:w-[35%]">
      {/* Radial gradient overlay */}
      <div
        className="pointer-events-none absolute left-0 right-0 top-0"
        style={{
          height: '140px',
          background: 'radial-gradient(ellipse at top, rgba(136, 192, 208, 0.18) 0%, transparent 70%)',
        }}
      />

      {/* Profile Section */}
      <div className="relative px-4 pb-6 pt-7 text-center">
        {personal.photo ? (
          <div className="relative mx-auto mb-4 h-24 w-24 overflow-hidden rounded-full border-[3px] border-nord-8/30 shadow-[0_6px_20px_rgba(0,0,0,0.3),0_2px_6px_rgba(0,0,0,0.2)] md:h-[100px] md:w-[100px]">
            <Image
              src={personal.photo}
              alt={personal.name}
              fill
              className="object-cover"
              sizes="100px"
              priority
            />
          </div>
        ) : (
          <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full border-[3px] border-nord-8/30 bg-nord-3 shadow-[0_6px_20px_rgba(0,0,0,0.3),0_2px_6px_rgba(0,0,0,0.2)] md:h-[100px] md:w-[100px]">
            <span className="text-3xl text-nord-8">{personal.name.charAt(0)}</span>
          </div>
        )}

        <div className="mb-1 text-lg font-semibold leading-tight tracking-tight text-nord-6 md:text-[19px]">
          {personal.name}
        </div>

        <div className="mb-1 text-sm font-medium text-nord-8 md:text-[12.5px]">
          {personal.title}
        </div>

        <div className="text-xs font-normal text-nord-4 opacity-70 md:text-[10px]">
          {personal.experienceYears} {t('pages.cv.labels.yearsExperience')}
        </div>
      </div>

      {/* Sidebar Content */}
      <div className="flex-1 px-8 pb-6 md:px-4">
        {/* Contact Section */}
        <SectionTitle first>{t('pages.cv.labels.contact')}</SectionTitle>
        <ContactItem>{personal.location}, {personal.age} {t('pages.cv.labels.yearsOld')}</ContactItem>
        {personal.phone && <ContactItem>{personal.phone}</ContactItem>}
        <ContactItem href={`mailto:${personal.email}`}>
          {personal.email}
        </ContactItem>
        {personal.linkedin && (
          <ContactItem href={personal.linkedin}>
            {personal.linkedin.replace('https://', '')}
          </ContactItem>
        )}
        {personal.github && (
          <ContactItem href={personal.github}>
            {personal.github.replace('https://', '')}
          </ContactItem>
        )}
        {personal.website && (
          <ContactItem href={personal.website}>
            {personal.website.replace('https://', '')}
          </ContactItem>
        )}

        {/* Expertise Section */}
        <SectionTitle>{t('pages.cv.sections.expertise')}</SectionTitle>
        <div className="mt-3">
          {expertise.map((exp, i) => (
            <ExpertiseItem key={i}>{exp.title}</ExpertiseItem>
          ))}
        </div>

        {/* Skills Section */}
        <SectionTitle>{t('pages.cv.sections.skills')}</SectionTitle>
        {categoryOrder.map((category) => {
          const categorySkills = skillsByCategory[category] || [];
          if (categorySkills.length === 0) return null;
          return (
            <div key={category} className="mt-2.5">
              <div className="mb-1.5 text-center text-[9px] font-semibold uppercase tracking-wide text-nord-4 opacity-60 md:text-left md:text-[8px]">
                {categoryLabels[category]?.[language as 'fr' | 'en'] || category}
              </div>
              <div className="flex flex-wrap justify-center gap-1.5 md:justify-start">
                {categorySkills.map((skill, i) => (
                  <SkillTag key={i}>{skill}</SkillTag>
                ))}
              </div>
            </div>
          );
        })}

        {/* Languages Section */}
        {languages && languages.length > 0 && (
          <>
            <SectionTitle>{t('pages.cv.sections.languages')}</SectionTitle>
            <div className="mt-2">
              {languages.map((lang, i) => (
                <div
                  key={i}
                  className="my-1.5 flex items-center justify-between text-xs text-nord-4 md:text-[10px]"
                >
                  <span className="opacity-90">{lang.language}</span>
                  <span className="font-medium text-nord-8">{lang.level}</span>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Contributions Section */}
        {contributions && contributions.length > 0 && (
          <ContributionsSection contributions={contributions} title={t('pages.cv.sections.contributions')} />
        )}
      </div>
    </aside>
  );
}

function SectionTitle({ children, first }: { children: React.ReactNode; first?: boolean }) {
  return (
    <div
      className={`text-center text-xs font-semibold uppercase tracking-wider text-nord-8 opacity-90 md:text-left md:text-[10px] ${first ? 'mb-3' : 'mb-3 mt-6'}`}
    >
      {children}
    </div>
  );
}

function ContactItem({
  href,
  children,
}: {
  href?: string;
  children: React.ReactNode;
}) {
  const content = href ? (
    <a
      href={href}
      target={href.startsWith('mailto:') ? undefined : '_blank'}
      rel={href.startsWith('mailto:') ? undefined : 'noopener noreferrer'}
      className="break-words text-nord-4 opacity-85 no-underline transition-all duration-200 hover:text-nord-8 hover:opacity-100"
    >
      {children}
    </a>
  ) : (
    <span className="text-nord-4 opacity-85">{children}</span>
  );

  return (
    <div className="relative my-2.5 pl-3.5 text-xs font-normal leading-relaxed text-nord-4 md:text-[10px]">
      <span className="absolute left-0 text-sm font-bold text-nord-8">•</span>
      {content}
    </div>
  );
}

function ExpertiseItem({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative my-2.5 pl-3.5 text-xs font-normal leading-relaxed text-nord-4 opacity-90 md:text-[10px]">
      <span className="absolute left-0 text-sm font-bold text-nord-8">•</span>
      {children}
    </div>
  );
}

function SkillTag({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-lg bg-nord-btn/90 px-3 py-1.5 text-xs font-medium text-white shadow-[0_0_12px_rgba(74,111,165,0.4)] transition-all duration-300 hover:-translate-y-0.5 hover:scale-105 md:px-2.5 md:py-1.5 md:text-[9px]">
      {children}
    </span>
  );
}

interface Contribution {
  date: string;
  type: string;
  description: string;
}

function ContributionsSection({ contributions, title }: { contributions: Contribution[]; title: string }) {
  return (
    <div className="mt-6 rounded-xl border border-nord-14/15 bg-nord-14/10 p-4 md:p-3.5">
      <div className="mb-3 text-center text-xs font-semibold uppercase tracking-wider text-nord-14 md:mb-2.5 md:text-left md:text-[10px]">
        {title}
      </div>

      {contributions.map((contrib, i) => (
        <div key={i} className={i < contributions.length - 1 ? 'mb-4 md:mb-3' : ''}>
          <div className="mb-1.5 text-center text-[11px] font-semibold uppercase tracking-wide text-nord-14 md:mb-1 md:text-left md:text-[9px]">
            {contrib.type} • {contrib.date}
          </div>
          <div className="text-center text-xs leading-relaxed text-nord-4 opacity-90 md:text-left md:text-[9.5px]">
            {contrib.description}
          </div>
        </div>
      ))}
    </div>
  );
}