'use client';

import { useTranslation } from '@daviani/ui';
import { getCvStaticData } from '@/lib/content/cv';

interface TranslatedExperience {
  company: string;
  role: string;
  location: string;
  highlights?: string[];
  summary?: string;
}

interface TranslatedEducation {
  institution: string;
  degree: string;
}

export function CvMain() {
  const { t, tObject } = useTranslation();
  const staticData = getCvStaticData();

  // Get translated data
  const experiences = tObject<TranslatedExperience[]>('pages.cv.data.experiences') ?? [];
  const education = tObject<TranslatedEducation[]>('pages.cv.data.education') ?? [];

  return (
    <main className="rounded-xl bg-white dark:bg-nord-0" style={{ width: '65%', padding: '20px 24px' }}>
      {/* Experiences Section */}
      <MainSectionTitle first>{t('pages.cv.sections.experience')}</MainSectionTitle>

      {experiences.map((exp, i) => (
        <ExperienceCard
          key={i}
          experience={exp}
          staticExp={staticData.experiences[i]}
        />
      ))}

      {/* Education Section */}
      <MainSectionTitle>{t('pages.cv.sections.education')}</MainSectionTitle>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '11px' }}>
        {education.map((edu, i) => (
          <EducationCard
            key={i}
            education={edu}
            staticEdu={staticData.education[i]}
          />
        ))}
      </div>
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

function ExperienceCard({
  experience,
  staticExp,
}: {
  experience: TranslatedExperience;
  staticExp: { start: string; end: string | null; current: boolean; compact?: boolean; stack: string[] };
}) {
  const { t } = useTranslation();
  const isCompact = staticExp.compact;

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
          {staticExp.start} - {staticExp.current ? t('pages.cv.labels.current') : staticExp.end}
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
        {experience.highlights && experience.highlights.length > 0 ? (
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
        ) : experience.summary ? (
          <p>{experience.summary}</p>
        ) : null}

        {staticExp.stack && staticExp.stack.length > 0 && (
          <strong className="mt-1 block text-nord-8" style={{ fontSize: '10px', fontWeight: 600 }}>
            {t('pages.cv.labels.stack')} : {staticExp.stack.join(', ')}
          </strong>
        )}
      </div>
    </div>
  );
}

function EducationCard({
  education,
  staticEdu,
}: {
  education: TranslatedEducation;
  staticEdu: { start: string; end: string };
}) {
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
          {staticEdu.start === staticEdu.end ? staticEdu.start : `${staticEdu.start} - ${staticEdu.end}`}
        </div>
      </div>
    </div>
  );
}