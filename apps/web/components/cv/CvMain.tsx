'use client';

import { useTranslation } from '@nordic-island/ui';
import type { LocalizedCvData } from '@/lib/content/cv-keystatic';

interface CvMainProps {
  cvData: LocalizedCvData;
}

export function CvMain({ cvData }: CvMainProps) {
  const { t } = useTranslation();

  const { experiences, education, projects } = cvData;

  return (
    <main className="mx-auto w-[calc(100%-2rem)] rounded-xl bg-white px-4 py-5 md:mx-0 md:w-[65%] md:px-6 dark:bg-nord-0">
      {/* Experiences Section */}
      <MainSectionTitle first>{t('pages.cv.sections.experience')}</MainSectionTitle>

      {experiences.map((exp, i) => (
        <ExperienceCard key={i} experience={exp} />
      ))}

      {/* Education Section */}
      <MainSectionTitle>{t('pages.cv.sections.education')}</MainSectionTitle>

      <div className="grid grid-cols-1 gap-3">
        {education.map((edu, i) => (
          <EducationCard key={i} education={edu} />
        ))}
      </div>

      {/* Projects Section */}
      {projects && projects.length > 0 && (
        <>
          <MainSectionTitle>{t('pages.cv.sections.projects')}</MainSectionTitle>

          {projects.map((project, i) => (
            <ProjectCard key={i} project={project} />
          ))}
        </>
      )}
    </main>
  );
}

function MainSectionTitle({ children, first }: { children: React.ReactNode; first?: boolean }) {
  return (
    <h2
      className={`text-center text-lg font-semibold leading-tight tracking-tight text-nord-0 md:text-left md:text-[17px] dark:text-nord-6 ${first ? 'mb-3' : 'mb-3 mt-5'}`}
    >
      {children}
    </h2>
  );
}

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
      className={`mb-4 rounded-lg border border-nord-5 bg-white px-4 transition-all duration-300 hover:-translate-y-px md:mb-3 dark:border-nord-3 dark:bg-nord-2 ${isCompact ? 'py-3 md:py-2.5' : 'py-4 md:py-3'}`}
    >
      {/* Header */}
      <div className="mb-3 flex flex-col items-center gap-1.5 md:mb-2 md:flex-row md:items-start md:justify-between md:gap-3">
        <div className="text-center md:text-left">
          <div className="mb-0.5 text-sm font-semibold leading-snug tracking-tight text-nord-0 md:text-[12.5px] dark:text-nord-6">
            {experience.role}
          </div>
          <div className="text-xs font-medium text-nord-3 md:text-[11px] dark:text-nord-8">
            {experience.company}
          </div>
        </div>
        <div className="mt-1.5 w-fit shrink-0 whitespace-nowrap rounded bg-nord-8/15 px-2.5 py-1 text-[11px] font-medium text-nord-3 md:mt-0 md:text-[10px] dark:text-nord-4">
          {experience.start} - {experience.current ? t('pages.cv.labels.current') : experience.end}
        </div>
      </div>

      {/* Description */}
      <div className={`leading-relaxed text-nord-3 dark:text-nord-4 ${isCompact ? 'text-xs md:text-[10px]' : 'text-xs md:text-[10.5px]'}`}>
        {experience.summary && (
          <p className={experience.highlights && experience.highlights.length > 0 ? 'mb-1.5' : ''}>
            {experience.summary}
          </p>
        )}

        {experience.highlights && experience.highlights.length > 0 && (
          <ul className="my-1.5 ml-3.5 list-none">
            {experience.highlights.map((highlight, i) => (
              <li key={i} className="relative my-1 pl-3.5 leading-relaxed">
                <span className="absolute left-0 text-[11px] font-semibold text-nord-8">→</span>
                {highlight}
              </li>
            ))}
          </ul>
        )}

        {experience.stack && experience.stack.length > 0 && (
          <strong className="mt-1 block text-[11px] font-semibold text-nord-3 md:text-[10px] dark:text-nord-8">
            {t('pages.cv.labels.stack')} : {experience.stack.join(', ')}
          </strong>
        )}
      </div>
    </div>
  );
}

interface Education {
  start: string;
  end: string;
  institution: string;
  degree: string;
}

function EducationCard({ education }: { education: Education }) {
  return (
    <div className="rounded-lg border border-nord-5 bg-white px-4 py-4 transition-all duration-300 hover:-translate-y-px md:py-3 dark:border-nord-3 dark:bg-nord-2">
      <div className="flex flex-col items-center gap-1 md:flex-row md:items-start md:justify-between md:gap-3">
        <div className="text-center md:text-left">
          <div className="mb-0.5 text-sm font-semibold leading-snug tracking-tight text-nord-0 md:text-[12.5px] dark:text-nord-6">
            {education.degree}
          </div>
          <div className="text-xs font-medium text-nord-3 md:text-[11px] dark:text-nord-8">
            {education.institution}
          </div>
        </div>
        <div className="mt-1 w-fit shrink-0 whitespace-nowrap rounded bg-nord-8/15 px-2.5 py-1 text-[11px] font-medium text-nord-3 md:mt-0 md:text-[10px] dark:text-nord-4">
          {education.start === education.end ? education.start : `${education.start} - ${education.end}`}
        </div>
      </div>
    </div>
  );
}

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
  const { t } = useTranslation();

  return (
    <div className="mb-4 rounded-lg border border-nord-5 bg-white px-4 py-4 transition-all duration-300 hover:-translate-y-px md:mb-3 md:py-3 dark:border-nord-3 dark:bg-nord-2">
      {/* Header */}
      <div className="mb-3 flex flex-col items-center gap-1.5 md:mb-2 md:flex-row md:items-start md:justify-between md:gap-3">
        <div className="text-center md:text-left">
          <div className="mb-0.5 text-sm font-semibold leading-snug tracking-tight text-nord-0 md:text-[12.5px] dark:text-nord-6">
            {project.title}
          </div>
          {project.url && (
            <a
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] font-medium text-nord-3 hover:underline md:text-[10px] dark:text-nord-8"
            >
              {project.url.replace(/^https?:\/\//, '')}
            </a>
          )}
        </div>
        <div className="mt-1 w-fit shrink-0 whitespace-nowrap rounded bg-nord-8/15 px-2.5 py-1 text-[11px] font-medium text-nord-3 md:mt-0 md:text-[10px] dark:text-nord-4">
          {project.start} - {project.end}
        </div>
      </div>

      {/* Description */}
      <div className="text-xs leading-relaxed text-nord-3 md:text-[10.5px] dark:text-nord-4">
        {project.description && <p className="mb-1.5">{project.description}</p>}

        {project.highlights && project.highlights.length > 0 && (
          <ul className="my-1.5 ml-3.5 list-none">
            {project.highlights.map((highlight, i) => (
              <li key={i} className="relative my-1 pl-3.5 leading-relaxed">
                <span className="absolute left-0 text-[11px] font-semibold text-nord-8">→</span>
                {highlight}
              </li>
            ))}
          </ul>
        )}

        {project.stack && project.stack.length > 0 && (
          <strong className="mt-1 block text-[11px] font-semibold text-nord-3 md:text-[10px] dark:text-nord-8">
            {t('pages.cv.labels.stack')} : {project.stack.join(', ')}
          </strong>
        )}
      </div>
    </div>
  );
}