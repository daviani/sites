'use client';

import { useTranslation } from '@daviani/ui';
import type { LocalizedCvData } from '@/lib/content/cv-keystatic';

interface CvMainProps {
  cvData: LocalizedCvData;
}

export function CvMain({ cvData }: CvMainProps) {
  const { t } = useTranslation();

  const { experiences, education, projects } = cvData;

  return (
    <main className="rounded-xl bg-white dark:bg-nord-0" style={{ width: '65%', padding: '20px 24px' }}>
      {/* Experiences Section */}
      <MainSectionTitle first>{t('pages.cv.sections.experience')}</MainSectionTitle>

      {experiences.map((exp, i) => (
        <ExperienceCard key={i} experience={exp} />
      ))}

      {/* Education Section */}
      <MainSectionTitle>{t('pages.cv.sections.education')}</MainSectionTitle>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '11px' }}>
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
      className="text-nord-0 dark:text-nord-6"
      style={{
        fontSize: '17px',
        margin: first ? '0 0 12px 0' : '20px 0 12px 0',
        fontWeight: 600,
        letterSpacing: '-0.4px',
        lineHeight: 1.2,
      }}
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
      className="border border-nord-5 bg-white transition-all duration-300 hover:-translate-y-px dark:border-nord-3 dark:bg-nord-2"
      style={{
        marginBottom: '11px',
        padding: isCompact ? '10px 14px' : '11px 14px',
        borderRadius: '9px',
      }}
    >
      {/* Header */}
      <div className="flex items-start justify-between" style={{ marginBottom: '8px', gap: '12px' }}>
        <div>
          <div
            className="text-nord-0 dark:text-nord-6"
            style={{
              fontSize: '12.5px',
              fontWeight: 600,
              marginBottom: '3px',
              letterSpacing: '-0.15px',
              lineHeight: 1.3,
            }}
          >
            {experience.role}
          </div>
          <div className="text-nord-8" style={{ fontSize: '11px', fontWeight: 500 }}>
            {experience.company}
          </div>
        </div>
        <div
          className="shrink-0 whitespace-nowrap text-nord-3 dark:text-nord-4"
          style={{
            fontSize: '10px',
            fontWeight: 500,
            padding: '4px 10px',
            borderRadius: '5px',
            backgroundColor: 'rgba(136, 192, 208, 0.15)',
          }}
        >
          {experience.start} - {experience.current ? t('pages.cv.labels.current') : experience.end}
        </div>
      </div>

      {/* Description */}
      <div
        className="text-nord-3 dark:text-nord-4"
        style={{
          fontSize: isCompact ? '10px' : '10.5px',
          lineHeight: 1.5,
        }}
      >
        {experience.summary && (
          <p style={{ marginBottom: experience.highlights && experience.highlights.length > 0 ? '6px' : 0 }}>
            {experience.summary}
          </p>
        )}

        {experience.highlights && experience.highlights.length > 0 && (
          <ul style={{ margin: '6px 0 6px 14px', listStyle: 'none' }}>
            {experience.highlights.map((highlight, i) => (
              <li key={i} className="relative" style={{ margin: '4px 0', paddingLeft: '14px', lineHeight: 1.5 }}>
                <span className="absolute left-0 text-nord-8" style={{ fontWeight: 600, fontSize: '11px' }}>
                  →
                </span>
                {highlight}
              </li>
            ))}
          </ul>
        )}

        {experience.stack && experience.stack.length > 0 && (
          <strong className="mt-1 block text-nord-8" style={{ fontSize: '10px', fontWeight: 600 }}>
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
    <div
      className="border border-nord-5 bg-white transition-all duration-300 hover:-translate-y-px dark:border-nord-3 dark:bg-nord-2"
      style={{ padding: '11px 14px', borderRadius: '9px' }}
    >
      <div className="flex items-start justify-between" style={{ gap: '12px' }}>
        <div>
          <div
            className="text-nord-0 dark:text-nord-6"
            style={{
              fontSize: '12.5px',
              fontWeight: 600,
              marginBottom: '3px',
              letterSpacing: '-0.15px',
              lineHeight: 1.3,
            }}
          >
            {education.degree}
          </div>
          <div className="text-nord-8" style={{ fontSize: '11px', fontWeight: 500 }}>
            {education.institution}
          </div>
        </div>
        <div
          className="shrink-0 whitespace-nowrap text-nord-3 dark:text-nord-4"
          style={{
            fontSize: '10px',
            fontWeight: 500,
            padding: '4px 10px',
            borderRadius: '5px',
            backgroundColor: 'rgba(136, 192, 208, 0.15)',
          }}
        >
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
    <div
      className="border border-nord-5 bg-white transition-all duration-300 hover:-translate-y-px dark:border-nord-3 dark:bg-nord-2"
      style={{
        marginBottom: '11px',
        padding: '11px 14px',
        borderRadius: '9px',
      }}
    >
      {/* Header */}
      <div className="flex items-start justify-between" style={{ marginBottom: '8px', gap: '12px' }}>
        <div>
          <div
            className="text-nord-0 dark:text-nord-6"
            style={{
              fontSize: '12.5px',
              fontWeight: 600,
              marginBottom: '3px',
              letterSpacing: '-0.15px',
              lineHeight: 1.3,
            }}
          >
            {project.title}
          </div>
          {project.url && (
            <a
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-nord-8 hover:underline"
              style={{ fontSize: '10px', fontWeight: 500 }}
            >
              {project.url.replace(/^https?:\/\//, '')}
            </a>
          )}
        </div>
        <div
          className="shrink-0 whitespace-nowrap text-nord-3 dark:text-nord-4"
          style={{
            fontSize: '10px',
            fontWeight: 500,
            padding: '4px 10px',
            borderRadius: '5px',
            backgroundColor: 'rgba(136, 192, 208, 0.15)',
          }}
        >
          {project.start} - {project.end}
        </div>
      </div>

      {/* Description */}
      <div
        className="text-nord-3 dark:text-nord-4"
        style={{
          fontSize: '10.5px',
          lineHeight: 1.5,
        }}
      >
        {project.description && <p style={{ marginBottom: '6px' }}>{project.description}</p>}

        {project.highlights && project.highlights.length > 0 && (
          <ul style={{ margin: '6px 0 6px 14px', listStyle: 'none' }}>
            {project.highlights.map((highlight, i) => (
              <li key={i} className="relative" style={{ margin: '4px 0', paddingLeft: '14px', lineHeight: 1.5 }}>
                <span className="absolute left-0 text-nord-8" style={{ fontWeight: 600, fontSize: '11px' }}>
                  →
                </span>
                {highlight}
              </li>
            ))}
          </ul>
        )}

        {project.stack && project.stack.length > 0 && (
          <strong className="mt-1 block text-nord-8" style={{ fontSize: '10px', fontWeight: 600 }}>
            {t('pages.cv.labels.stack')} : {project.stack.join(', ')}
          </strong>
        )}
      </div>
    </div>
  );
}