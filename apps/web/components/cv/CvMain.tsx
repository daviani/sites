'use client';

import { useTranslation } from '@/hooks/use-translation';
import type { LocalizedCvData } from '@/lib/content/cv-keystatic';

interface CvMainProps {
  cvData: LocalizedCvData;
}

export function CvMain({ cvData }: CvMainProps) {
  const { t } = useTranslation();

  const { contributions, experiences, projects, education } = cvData;

  return (
    <main className="px-1">
      {/* Contributions Section */}
      {contributions && contributions.length > 0 && (
        <>
          <SectionTitle color="green" first>
            {t('pages.cv.sections.contributions')}
          </SectionTitle>
          <div className="mb-2 rounded-xl border border-nord-5 bg-nord-6 px-3 py-2.5 dark:border-nord-3 dark:bg-nord-2">
            {contributions.map((c, i) => (
              <div key={i} className={i < contributions.length - 1 ? 'mb-2' : ''}>
                <div className="mb-1 flex flex-col items-center gap-1 md:flex-row md:items-center md:justify-between">
                  <span className="text-[11px] font-semibold text-nord-0 dark:text-nord-6">
                    {c.type}
                  </span>
                  <DateBadge>{c.date}</DateBadge>
                </div>
                <div className="text-[9.5px] leading-snug text-nord-2 dark:text-nord-4">
                  {c.description}
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Experiences Section */}
      <SectionTitle first={!contributions || contributions.length === 0}>
        {t('pages.cv.sections.experience')}
      </SectionTitle>
      {experiences.map((exp, i) => (
        <ExperienceCard key={i} experience={exp} />
      ))}

      {/* Projects Section */}
      {projects && projects.length > 0 && (
        <>
          <SectionTitle>{t('pages.cv.sections.projects')}</SectionTitle>
          {projects.map((project, i) => (
            <ProjectCard key={i} project={project} />
          ))}
        </>
      )}

      {/* Education Section */}
      <SectionTitle>{t('pages.cv.sections.education')}</SectionTitle>
      <div className="rounded-xl border border-nord-5 bg-nord-6 px-4 py-3 dark:border-nord-3 dark:bg-nord-2">
        {education.map((edu, i) => (
          <EducationEntry key={i} education={edu} isLast={i === education.length - 1} />
        ))}
      </div>
    </main>
  );
}

/* ─── Sub-components ─────────────────────────── */

function SectionTitle({
  children,
  first,
  color,
}: {
  children: React.ReactNode;
  first?: boolean;
  color?: 'green';
}) {
  const colorClass = 'text-nord-3 dark:text-nord-10';
  return (
    <h3
      className={`text-[10px] font-bold uppercase tracking-[1.5px] ${colorClass} border-b-[1.5px] border-nord-5 pb-1 dark:border-nord-3 ${first ? 'mb-2' : 'mb-2 mt-4'}`}
    >
      {children}
    </h3>
  );
}

/* ─── Experience ─────────────────────────────── */

interface Experience {
  start: string;
  end?: string;
  current: boolean;
  compact: boolean;
  company: string;
  role: string;
  location: string;
  summary?: string;
  highlights: string[];
  stack: string[];
}

function ExperienceCard({ experience }: { experience: Experience }) {
  const { t } = useTranslation();
  const isCompact = experience.compact;

  return (
    <div
      className={`mb-2 rounded-xl border border-nord-5 bg-nord-6 px-3 transition-all duration-200 hover:-translate-y-px dark:border-nord-3 dark:bg-nord-2 ${isCompact ? 'py-2' : 'py-2.5'}`}
    >
      {/* Header */}
      <div className="mb-1 flex flex-col items-center gap-1 md:flex-row md:items-center md:justify-between">
        <span className="text-[11px] font-semibold text-nord-0 dark:text-nord-6">
          {experience.role}
        </span>
        <DateBadge>
          {experience.start} – {experience.current ? t('pages.cv.labels.current') : experience.end}
        </DateBadge>
      </div>

      {/* Company / summary */}
      {experience.summary ? (
        <div className="mb-1 text-[9.5px] font-medium text-nord-1 dark:text-nord-4">
          {experience.summary}
        </div>
      ) : (
        <div className="mb-1 text-[9.5px] font-medium text-nord-1 dark:text-nord-4">
          {experience.company}
        </div>
      )}

      {/* Bullets */}
      {experience.highlights && experience.highlights.length > 0 && (
        <ul className="list-none">
          {experience.highlights.map((h, i) => (
            <li
              key={i}
              className="relative mb-0.5 pl-2.5 text-[9.5px] leading-snug text-nord-2 dark:text-nord-4"
            >
              <span className="absolute left-0 text-[11px] font-bold text-nord-3 dark:text-nord-4">›</span>
              {h}
            </li>
          ))}
        </ul>
      )}

      {/* Stack */}
      {experience.stack && experience.stack.length > 0 && (
        <div className="mt-1 text-[8.5px] italic text-nord-3 dark:text-nord-4">
          {experience.stack.join(' · ')}
        </div>
      )}
    </div>
  );
}

/* ─── Project ────────────────────────────────── */

interface Project {
  title: string;
  start: string;
  end: string;
  description: string;
  highlights: string[];
  stack: string[];
  url?: string;
}

function ProjectCard({ project }: { project: Project }) {
  return (
    <div className="mb-2 rounded-xl border border-nord-5 bg-nord-6 px-3 py-2.5 transition-all duration-200 hover:-translate-y-px dark:border-nord-3 dark:bg-nord-2">
      {/* Header */}
      <div className="mb-1 flex flex-col items-center gap-1 md:flex-row md:items-center md:justify-between">
        <span className="text-[10.5px] font-semibold text-nord-0 dark:text-nord-6">
          {project.title}
        </span>
        <DateBadge>
          {project.start} – {project.end}
        </DateBadge>
      </div>

      {project.description && (
        <div className="text-[9.5px] leading-snug text-nord-2 dark:text-nord-4">
          {project.description}
        </div>
      )}

      {project.stack && project.stack.length > 0 && (
        <div className="mt-1 text-[8.5px] italic text-nord-3 dark:text-nord-4">
          {project.stack.join(' · ')}
        </div>
      )}
    </div>
  );
}

/* ─── Education ──────────────────────────────── */

interface Education {
  start: string;
  end: string;
  institution: string;
  degree: string;
  description?: string;
}

function EducationEntry({ education, isLast }: { education: Education; isLast: boolean }) {
  const year =
    education.start === education.end
      ? education.start
      : `${education.start} – ${education.end}`;

  return (
    <div className={`text-[9.5px] leading-relaxed text-nord-2 dark:text-nord-4 ${isLast ? '' : 'mb-1'}`}>
      {education.description ? (
        <>
          <strong className="font-semibold text-nord-0 dark:text-nord-6">
            {education.description}
          </strong>
          {' — '}
          {education.institution}
          <span className="ml-1 text-[9px] text-nord-3 dark:text-nord-4">· {year}</span>
        </>
      ) : (
        <>
          <strong className="font-semibold text-nord-0 dark:text-nord-6">
            {education.degree}
          </strong>
          {' — '}
          {education.institution}
          <span className="ml-1 text-[9px] text-nord-3 dark:text-nord-4">· {year}</span>
        </>
      )}
    </div>
  );
}

/* ─── Shared ─────────────────────────────────── */

function DateBadge({ children }: { children: React.ReactNode }) {
  return (
    <span className="w-fit shrink-0 whitespace-nowrap rounded-full border border-nord-5 bg-nord-6 px-2 py-0.5 text-[8.5px] font-medium text-nord-2 dark:border-nord-3 dark:bg-nord-1 dark:text-nord-4">
      {children}
    </span>
  );
}