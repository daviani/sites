'use client';

import { useTranslation } from '@daviani/ui';
import { getCvStaticData, getAllSkills } from '@/lib/content/cv';

interface TranslatedExpertise {
  title: string;
  description: string;
}

interface TranslatedContribution {
  type: string;
  date: string;
  description: string;
}

export function CvSidebar() {
  const { t, tObject } = useTranslation();
  const staticData = getCvStaticData();
  const skills = getAllSkills();

  // Get translated data
  const name = t('pages.cv.data.personal.name');
  const title = t('pages.cv.data.personal.title');
  const expertise = tObject<TranslatedExpertise[]>('pages.cv.data.expertise') ?? [];
  const contributions = tObject<TranslatedContribution[]>('pages.cv.data.contributions') ?? [];

  return (
    <aside className="relative flex flex-col overflow-hidden rounded-xl bg-nord-1 shadow-lg" style={{ width: '35%' }}>
      {/* Radial gradient overlay */}
      <div
        className="pointer-events-none absolute left-0 right-0 top-0"
        style={{
          height: '140px',
          background: 'radial-gradient(ellipse at top, rgba(136, 192, 208, 0.18) 0%, transparent 70%)',
        }}
      />

      {/* Profile Section */}
      <div className="relative text-center" style={{ padding: '28px 18px 24px' }}>
        {staticData.personal.photo ? (
          <img
            src={staticData.personal.photo}
            alt={name}
            className="mx-auto mb-4 block rounded-full object-cover"
            style={{
              width: '100px',
              height: '100px',
              border: '3px solid rgba(136, 192, 208, 0.3)',
              boxShadow: '0 6px 20px rgba(0, 0, 0, 0.3), 0 2px 6px rgba(0, 0, 0, 0.2)',
            }}
          />
        ) : (
          <div
            className="mx-auto mb-4 flex items-center justify-center rounded-full bg-nord-3"
            style={{
              width: '100px',
              height: '100px',
              border: '3px solid rgba(136, 192, 208, 0.3)',
              boxShadow: '0 6px 20px rgba(0, 0, 0, 0.3), 0 2px 6px rgba(0, 0, 0, 0.2)',
            }}
          >
            <span className="text-3xl text-nord-8">{name.charAt(0)}</span>
          </div>
        )}

        <div className="mb-1 text-nord-6" style={{ fontSize: '19px', fontWeight: 600, letterSpacing: '-0.35px', lineHeight: 1.2 }}>
          {name}
        </div>

        <div className="mb-1 text-nord-8" style={{ fontSize: '12.5px', fontWeight: 500, letterSpacing: '-0.05px' }}>
          {title}
        </div>

        <div className="text-nord-4" style={{ fontSize: '10px', fontWeight: 400, opacity: 0.7 }}>
          {staticData.personal.experienceYears} {t('pages.cv.labels.yearsExperience')}
        </div>
      </div>

      {/* Sidebar Content */}
      <div className="flex-1" style={{ padding: '0 18px 24px' }}>
        {/* Contact Section */}
        <SectionTitle first>{t('pages.cv.labels.contact')}</SectionTitle>
        <ContactItem>{staticData.personal.location}, {staticData.age} {t('pages.cv.labels.yearsOld')}</ContactItem>
        {staticData.personal.phone && <ContactItem>{staticData.personal.phone}</ContactItem>}
        <ContactItem href={`mailto:${staticData.personal.email}`}>
          {staticData.personal.email}
        </ContactItem>
        <ContactItem href={staticData.personal.linkedin}>
          {staticData.personal.linkedin.replace('https://', '')}
        </ContactItem>
        <ContactItem href={staticData.personal.github}>
          {staticData.personal.github.replace('https://', '')}
        </ContactItem>
        <ContactItem href={staticData.personal.website}>
          {staticData.personal.website.replace('https://', '')}
        </ContactItem>

        {/* Expertise Section */}
        <SectionTitle>{t('pages.cv.sections.expertise')}</SectionTitle>
        <div style={{ marginTop: '12px' }}>
          {expertise.map((exp, i) => (
            <ExpertiseItem key={i}>{exp.title}</ExpertiseItem>
          ))}
        </div>

        {/* Skills Section */}
        <SectionTitle>{t('pages.cv.sections.skills')}</SectionTitle>
        <div className="flex flex-wrap" style={{ gap: '7px', marginTop: '12px' }}>
          {skills.map((skill, i) => (
            <SkillTag key={i}>{skill}</SkillTag>
          ))}
        </div>

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
      className="text-nord-8"
      style={{
        fontSize: '10px',
        margin: first ? '0 0 12px 0' : '24px 0 12px 0',
        fontWeight: 600,
        textTransform: 'uppercase',
        letterSpacing: '1.3px',
        opacity: 0.9,
      }}
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
      className="text-nord-4 transition-all duration-200 hover:text-nord-8 hover:opacity-100"
      style={{ textDecoration: 'none', opacity: 0.85, wordBreak: 'break-word' }}
    >
      {children}
    </a>
  ) : (
    <span className="text-nord-4" style={{ opacity: 0.85 }}>{children}</span>
  );

  return (
    <div
      className="relative text-nord-4"
      style={{ margin: '10px 0', paddingLeft: '14px', fontSize: '10px', fontWeight: 400, lineHeight: 1.4 }}
    >
      <span className="absolute left-0 text-nord-8" style={{ fontWeight: 700, fontSize: '13px' }}>
        •
      </span>
      {content}
    </div>
  );
}

function ExpertiseItem({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="relative text-nord-4"
      style={{ margin: '10px 0', paddingLeft: '14px', fontSize: '10px', lineHeight: 1.45, fontWeight: 400, opacity: 0.9 }}
    >
      <span className="absolute left-0 text-nord-8" style={{ fontWeight: 700, fontSize: '13px' }}>
        •
      </span>
      {children}
    </div>
  );
}

function SkillTag({ children }: { children: React.ReactNode }) {
  return (
    <span
      className="bg-nord-10/90 text-white shadow-[0_0_12px_rgba(94,129,172,0.4)] transition-all duration-300 hover:-translate-y-0.5 hover:scale-105"
      style={{
        padding: '6px 11px',
        borderRadius: '7px',
        fontSize: '9px',
        fontWeight: 500,
      }}
    >
      {children}
    </span>
  );
}

function ContributionsSection({ contributions, title }: { contributions: TranslatedContribution[]; title: string }) {
  return (
    <div
      style={{
        marginTop: '24px',
        padding: '14px',
        background: 'rgba(163, 190, 140, 0.1)',
        borderRadius: '10px',
        border: '1px solid rgba(163, 190, 140, 0.15)',
      }}
    >
      <div
        className="text-nord-14"
        style={{
          fontSize: '10px',
          fontWeight: 600,
          marginBottom: '12px',
          textTransform: 'uppercase',
          letterSpacing: '1.2px',
        }}
      >
        {title}
      </div>

      {contributions.map((contrib, i) => (
        <div key={i} style={{ marginBottom: i < contributions.length - 1 ? '12px' : 0 }}>
          <div
            className="text-nord-14"
            style={{
              fontSize: '9px',
              fontWeight: 600,
              marginBottom: '4px',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
            }}
          >
            {contrib.type} • {contrib.date}
          </div>
          <div className="text-nord-4" style={{ fontSize: '9.5px', lineHeight: 1.5, opacity: 0.9 }}>
            {contrib.description}
          </div>
        </div>
      ))}
    </div>
  );
}