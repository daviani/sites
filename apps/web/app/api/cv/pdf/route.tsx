import { NextRequest, NextResponse } from 'next/server';
import ReactPDF, {
  Document,
  Page,
  View,
  Text,
  Image,
  Link,
  StyleSheet,
  Font,
} from '@react-pdf/renderer';
import { getLocalizedCvData, getCvSkillsByCategory } from '@/lib/content/cv-keystatic';
import { NORD } from '@nordic-island/ui';

export const dynamic = 'force-dynamic';

// Register Inter font
Font.register({
  family: 'Inter',
  fonts: [
    { src: 'https://fonts.gstatic.com/s/inter/v18/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuLyfAZ9hjp-Ek-_EeA.woff', fontWeight: 400 },
    { src: 'https://fonts.gstatic.com/s/inter/v18/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuI6fAZ9hjp-Ek-_EeA.woff', fontWeight: 500 },
    { src: 'https://fonts.gstatic.com/s/inter/v18/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuGKYAZ9hjp-Ek-_EeA.woff', fontWeight: 600 },
    { src: 'https://fonts.gstatic.com/s/inter/v18/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuFuYAZ9hjp-Ek-_EeA.woff', fontWeight: 700 },
  ],
});

const c = NORD;

interface LocalizedCvData {
  personal: {
    name: string;
    title: string;
    birthYear: number;
    age: number;
    experienceYears: number;
    location: string;
    email: string;
    phone?: string;
    linkedin?: string;
    github?: string;
    website?: string;
    photo?: string;
  };
  summary: string;
  subtitle?: string;
  experiences: {
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
  }[];
  education: {
    start: string;
    end: string;
    institution: string;
    degree: string;
    description?: string;
  }[];
  languages: {
    language: string;
    level: string;
  }[];
  expertise: {
    title: string;
    description: string;
  }[];
  contributions: {
    date: string;
    type: string;
    description: string;
  }[];
  projects: {
    title: string;
    start: string;
    end: string;
    description: string;
    highlights: string[];
    stack: string[];
    url?: string;
  }[];
}

type SkillsByCategory = Record<string, string[]>;

// =============================================================
// Styles — Nordic Island layout, A4, light mode only
// =============================================================
const s = StyleSheet.create({
  // --- Page ---
  page: {
    backgroundColor: c.nord6,
    fontFamily: 'Inter',
    fontSize: 9.5,
    paddingTop: 40,
    paddingHorizontal: 34,
    paddingBottom: 28,
  },

  // --- Island (header sombre) ---
  island: {
    backgroundColor: c.nord0,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: c.nord1,
    paddingTop: 14,
    paddingHorizontal: 12,
    paddingBottom: 12,
    marginBottom: 9,
  },
  islandTitle: {
    textAlign: 'center',
    fontSize: 11,
    fontWeight: 700,
    color: c.nord8,
    letterSpacing: -0.3,
    lineHeight: 1.3,
    paddingBottom: 7,
    marginBottom: 7,
  },
  islandGrid: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },
  islandCol: {
    flex: 1,
  },
  islandColLeft: {
    alignItems: 'flex-end',
  },
  islandColRight: {
    alignItems: 'flex-start',
  },
  islandText: {
    fontSize: 7.5,
    color: c.nord4,
    lineHeight: 1.6,
  },
  islandTextBold: {
    fontSize: 7.5,
    fontWeight: 500,
    color: c.nord4,
    lineHeight: 1.6,
  },
  islandSubtitle: {
    fontSize: 7.5,
    fontWeight: 500,
    color: 'rgba(216,222,233,0.85)',
    letterSpacing: 0.5,
    lineHeight: 1.6,
  },
  islandEmail: {
    fontSize: 7.5,
    color: '#FFFFFF',
    lineHeight: 1.6,
    textDecoration: 'none',
  },
  islandLink: {
    fontSize: 7.5,
    color: c.nord4,
    lineHeight: 1.6,
    textDecoration: 'none',
  },
  islandCity: {
    fontSize: 7.5,
    color: 'rgba(216,222,233,0.75)',
    lineHeight: 1.6,
  },
  islandPhone: {
    fontSize: 7.5,
    color: 'rgba(216,222,233,0.75)',
    lineHeight: 1.6,
  },
  // Photo — borderRadius appliqué directement sur l'Image (react-pdf ne clip pas via View overflow)
  photoZone: {
    width: 54,
    height: 54,
    alignItems: 'center',
    justifyContent: 'center',
  },
  photoImg: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: c.nord8,
  },
  // Skills row
  skillsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    rowGap: 2,
    columnGap: 6,
    paddingTop: 7,
    marginTop: 7,
    borderTopWidth: 0.5,
    borderTopColor: c.nord1,
    fontSize: 6.5,
    lineHeight: 1.5,
  },
  skillGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  skillLabel: {
    fontWeight: 600,
    color: c.nord8,
  },
  skillItems: {
    color: c.nord4,
  },
  skillSep: {
    color: c.nord3,
    marginLeft: 2,
    marginRight: 2,
  },

  // --- Body zone ---
  bodyZone: {
    paddingHorizontal: 2,
  },

  // --- Contributions ---
  highlightsTitle: {
    fontSize: 7,
    fontWeight: 700,
    letterSpacing: 1.5,
    color: c.nord14,
    marginBottom: 3,
    paddingBottom: 2,
    borderBottomWidth: 1,
    borderBottomColor: c.nord5,
  },
  highlightsCard: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 5,
    paddingVertical: 4,
    paddingHorizontal: 7,
    backgroundColor: '#FFFFFF',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: c.nord5,
    borderLeftWidth: 2,
    borderLeftColor: c.nord14,
    borderRightWidth: 2,
    borderRightColor: c.nord14,
  },
  highlightItem: {
    flex: 1,
  },
  highlightType: {
    fontSize: 6.5,
    fontWeight: 600,
    color: c.nord14,
  },
  highlightDesc: {
    fontSize: 6.5,
    color: c.nord2,
    lineHeight: 1.4,
  },

  // --- Sections ---
  section: {
    marginBottom: 5,
  },
  sectionTitle: {
    fontSize: 7,
    fontWeight: 700,
    letterSpacing: 1.5,
    color: c.nord10,
    marginBottom: 3,
    paddingBottom: 2,
    borderBottomWidth: 1,
    borderBottomColor: c.nord5,
  },

  // --- Experience cards ---
  expCard: {
    marginBottom: 4,
    paddingTop: 4,
    paddingHorizontal: 6,
    paddingBottom: 3,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: c.nord5,
    borderRadius: 4,
  },
  expHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 1,
  },
  expRole: {
    fontSize: 7.5,
    fontWeight: 600,
    color: c.nord0,
  },
  expDate: {
    fontSize: 6,
    fontWeight: 500,
    color: c.nord10,
    backgroundColor: c.nord6,
    paddingVertical: 1,
    paddingHorizontal: 5,
    borderRadius: 10,
    borderWidth: 0.5,
    borderColor: c.nord5,
  },
  expCompany: {
    fontSize: 6.5,
    fontWeight: 500,
    color: c.nord10,
    marginBottom: 1,
  },
  expDesc: {
    fontSize: 6.5,
    color: c.nord2,
    lineHeight: 1.5,
    marginBottom: 1,
  },
  expBullets: {
    marginVertical: 1,
  },
  expBulletItem: {
    flexDirection: 'row',
    marginBottom: 0.5,
    paddingLeft: 1,
  },
  expBulletArrow: {
    color: c.nord8,
    fontWeight: 700,
    fontSize: 7.5,
    width: 7,
  },
  expBulletText: {
    fontSize: 6.5,
    color: c.nord2,
    lineHeight: 1.45,
    flex: 1,
  },
  expStack: {
    fontSize: 6,
    color: c.nord3,
    marginTop: 2,
  },

  // --- Projects ---
  projCard: {
    marginBottom: 4,
    paddingTop: 4,
    paddingHorizontal: 6,
    paddingBottom: 3,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: c.nord5,
    borderRadius: 4,
  },
  projHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  projName: {
    fontSize: 7,
    fontWeight: 600,
    color: c.nord0,
  },
  projDate: {
    fontSize: 6,
    fontWeight: 500,
    color: c.nord10,
    backgroundColor: c.nord6,
    paddingVertical: 1,
    paddingHorizontal: 5,
    borderRadius: 10,
    borderWidth: 0.5,
    borderColor: c.nord5,
  },
  projDesc: {
    fontSize: 6.5,
    color: c.nord2,
    lineHeight: 1.5,
    marginTop: 1,
  },
  projStack: {
    fontSize: 6,
    color: c.nord3,
    marginTop: 1,
  },

  // --- Formation ---
  formationCard: {
    paddingVertical: 4,
    paddingHorizontal: 6,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: c.nord5,
    borderRadius: 4,
  },
  formationEntry: {
    fontSize: 6.5,
    color: c.nord2,
    lineHeight: 1.6,
    marginBottom: 1,
  },
  formationDegree: {
    fontWeight: 600,
    color: c.nord0,
  },
  formationYear: {
    color: c.nord3,
    fontSize: 6,
  },
});

// =============================================================
// Skill groups config (same logic as CvIsland web component)
// =============================================================
const categoryLabels: Record<string, { fr: string; en: string }> = {
  frontend: { fr: 'Front', en: 'Front' },
  backend: { fr: 'Back', en: 'Back' },
  cicd: { fr: 'CI/CD', en: 'CI/CD' },
  infra: { fr: 'Infra', en: 'Infra' },
  databases: { fr: 'BDD', en: 'DB' },
  shell: { fr: 'Shell', en: 'Shell' },
  testing: { fr: 'Tests', en: 'Tests' },
};
const displayOrder = ['frontend', 'backend', 'cicd', 'infra', 'databases', 'shell', 'testing'];

// =============================================================
// CV Document Component — Nordic Island Layout
// =============================================================
function CvDocument({
  cvData,
  skillsByCategory,
  lang,
}: {
  cvData: LocalizedCvData;
  skillsByCategory: SkillsByCategory;
  lang: 'fr' | 'en';
}) {
  const isFr = lang === 'fr';

  const t = {
    yearsExperience: isFr ? "ans d'expérience" : 'years of experience',
    contributions: isFr ? 'Contributions' : 'Contributions',
    experience: isFr ? 'Expériences Professionnelles' : 'Professional Experience',
    projects: isFr ? 'Projets Personnels' : 'Personal Projects',
    education: isFr ? 'Formation' : 'Education',
    languages: isFr ? 'Langues' : 'Languages',
  };

  // Merge os + cloud → infra (same logic as web)
  const mergedSkills: Record<string, string[]> = {
    ...skillsByCategory,
    infra: [
      ...(skillsByCategory.os || []),
      ...(skillsByCategory.cloud || []),
    ],
  };

  // Build skill groups (non-empty only)
  const skillGroups = displayOrder
    .map((key) => ({
      key,
      label: categoryLabels[key]?.[lang] || key,
      items: mergedSkills[key] || [],
    }))
    .filter((g) => g.items.length > 0);

  // Languages entry for skills row
  const langEntry = cvData.languages.length > 0
    ? cvData.languages.map((l) => `${l.language} ${l.level.toLowerCase()}`).join(', ')
    : null;

  // Photo URL
  const photoUrl = cvData.personal.photo
    ? cvData.personal.photo.startsWith('/')
      ? `${process.env.NEXT_PUBLIC_SITE_URL || 'https://daviani.dev'}${cvData.personal.photo}`
      : cvData.personal.photo
    : null;

  // Links display
  const links = [
    cvData.personal.website?.replace('https://', ''),
    cvData.personal.github?.replace('https://', ''),
    cvData.personal.linkedin ? 'LinkedIn' : null,
  ].filter(Boolean).join(' · ');

  return (
    <Document>
      <Page size="A4" style={s.page}>
        {/* ============ ISLAND ============ */}
        <View style={s.island}>
          {/* Title */}
          <Text style={s.islandTitle}>
            {cvData.personal.name} · {cvData.personal.title}
          </Text>

          {/* 3-column grid: info | photo | contact */}
          <View style={s.islandGrid}>
            {/* Left column */}
            <View style={[s.islandCol, s.islandColLeft]}>
              <Text style={s.islandTextBold}>
                {cvData.personal.experienceYears} {t.yearsExperience}
              </Text>
              {cvData.subtitle && (
                <Text style={s.islandSubtitle}>{cvData.subtitle}</Text>
              )}
              <Text style={s.islandCity}>{cvData.personal.location}</Text>
            </View>

            {/* Photo */}
            {photoUrl ? (
              <View style={s.photoZone}>
                {/* eslint-disable-next-line jsx-a11y/alt-text -- @react-pdf/renderer Image is PDF, not HTML */}
                <Image src={photoUrl} style={s.photoImg} />
              </View>
            ) : (
              <View style={[s.photoZone, { alignItems: 'center', justifyContent: 'center', backgroundColor: c.nord0 }]}>
                <Text style={{ color: c.nord3, fontSize: 5 }}>PHOTO</Text>
              </View>
            )}

            {/* Right column */}
            <View style={[s.islandCol, s.islandColRight]}>
              <Link src={`mailto:${cvData.personal.email}`} style={s.islandEmail}>
                {cvData.personal.email}
              </Link>
              <Text style={s.islandLink}>{links}</Text>
              {cvData.personal.phone && (
                <Text style={s.islandPhone}>{cvData.personal.phone}</Text>
              )}
            </View>
          </View>

          {/* Skills row */}
          <View style={s.skillsRow}>
            {skillGroups.map((group, i) => (
              <View key={group.key} style={{ flexDirection: 'row', alignItems: 'center' }}>
                {i > 0 && <Text style={s.skillSep}>|</Text>}
                <View style={s.skillGroup}>
                  <Text style={s.skillLabel}>{group.label} :</Text>
                  <Text style={s.skillItems}>{group.items.join(', ')}</Text>
                </View>
              </View>
            ))}
            {langEntry && (
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={s.skillSep}>|</Text>
                <View style={s.skillGroup}>
                  <Text style={s.skillLabel}>{t.languages} :</Text>
                  <Text style={s.skillItems}>{langEntry}</Text>
                </View>
              </View>
            )}
          </View>
        </View>

        {/* ============ BODY ============ */}
        <View style={s.bodyZone}>
          {/* --- Contributions --- */}
          {cvData.contributions && cvData.contributions.length > 0 && (
            <>
              <Text style={s.highlightsTitle}>{t.contributions.toUpperCase()}</Text>
              <View style={s.highlightsCard}>
                {cvData.contributions.map((contrib, i) => (
                  <View key={i} style={s.highlightItem}>
                    <Text style={s.highlightType}>
                      {contrib.type} · {contrib.date}
                    </Text>
                    <Text style={s.highlightDesc}>{contrib.description}</Text>
                  </View>
                ))}
              </View>
            </>
          )}

          {/* --- Expériences --- */}
          <View style={s.section}>
            <Text style={s.sectionTitle}>{t.experience.toUpperCase()}</Text>
            {cvData.experiences.map((exp, i) => (
              <View key={i} style={s.expCard}>
                <View style={s.expHeader}>
                  <Text style={s.expRole}>{exp.role}</Text>
                  <Text style={s.expDate}>
                    {exp.start} – {exp.current ? (isFr ? "Aujourd'hui" : 'Present') : exp.end}
                  </Text>
                </View>
                {exp.summary && (
                  <Text style={s.expCompany}>{exp.summary}</Text>
                )}
                {!exp.summary && exp.company && (
                  <Text style={s.expCompany}>{exp.company}</Text>
                )}
                {exp.highlights && exp.highlights.length > 0 && (
                  <View style={s.expBullets}>
                    {exp.highlights.map((h, j) => (
                      <View key={j} style={s.expBulletItem}>
                        <Text style={s.expBulletArrow}>›</Text>
                        <Text style={s.expBulletText}>{h}</Text>
                      </View>
                    ))}
                  </View>
                )}
                {!exp.highlights?.length && !exp.summary && exp.company && null}
                {exp.compact && exp.company !== exp.role && (
                  <Text style={s.expDesc}>{exp.summary || ''}</Text>
                )}
                {exp.stack && exp.stack.length > 0 && (
                  <Text style={s.expStack}>{exp.stack.join(' · ')}</Text>
                )}
              </View>
            ))}
          </View>

          {/* --- Projets --- */}
          {cvData.projects && cvData.projects.length > 0 && (
            <View style={s.section}>
              <Text style={s.sectionTitle}>{t.projects.toUpperCase()}</Text>
              {cvData.projects.map((proj, i) => (
                <View key={i} style={s.projCard}>
                  <View style={s.projHeader}>
                    <Text style={s.projName}>{proj.title}</Text>
                    <Text style={s.projDate}>
                      {proj.start} – {proj.end}
                    </Text>
                  </View>
                  {proj.description && (
                    <Text style={s.projDesc}>{proj.description}</Text>
                  )}
                  {proj.stack && proj.stack.length > 0 && (
                    <Text style={s.projStack}>{proj.stack.join(' · ')}</Text>
                  )}
                </View>
              ))}
            </View>
          )}

          {/* --- Formation --- */}
          <View style={s.section}>
            <Text style={s.sectionTitle}>{t.education.toUpperCase()}</Text>
            <View style={s.formationCard}>
              {cvData.education.map((edu, i) => (
                <View key={i} style={s.formationEntry}>
                  <Text>
                    <Text style={s.formationDegree}>{edu.degree}</Text>
                    {' — '}{edu.institution}{' '}
                    <Text style={s.formationYear}>
                      · {edu.start === edu.end ? edu.start : `${edu.start} – ${edu.end}`}
                    </Text>
                  </Text>
                  {edu.description && (
                    <Text style={{ fontSize: 6, color: c.nord3, marginTop: 1 }}>
                      {edu.description}
                    </Text>
                  )}
                </View>
              ))}
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
}

/**
 * Generate PDF CV — Nordic Island layout
 * Options: ?lang=fr|en &action=download|print
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const lang = (searchParams.get('lang') as 'fr' | 'en') || 'fr';
  const action = (searchParams.get('action') as 'download' | 'print') || 'download';

  const cvData = getLocalizedCvData(lang);
  const skillsByCategory = getCvSkillsByCategory();

  if (!cvData) {
    return NextResponse.json({ error: 'CV data not found' }, { status: 404 });
  }

  try {
    const pdfStream = await ReactPDF.renderToStream(
      <CvDocument cvData={cvData} skillsByCategory={skillsByCategory} lang={lang} />
    );

    const chunks: Buffer[] = [];
    for await (const chunk of pdfStream) {
      chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
    }
    const pdfBuffer = Buffer.concat(chunks);

    const filename =
      lang === 'fr' ? 'Daviani-Fillatre-CV.pdf' : 'Daviani-Fillatre-Resume.pdf';

    const headers: HeadersInit = {
      'Content-Type': 'application/pdf',
    };

    if (action === 'download') {
      headers['Content-Disposition'] = `attachment; filename="${filename}"`;
    } else {
      headers['Content-Disposition'] = `inline; filename="${filename}"`;
    }

    return new NextResponse(pdfBuffer, { headers });
  } catch (error) {
    console.error('Error generating PDF:', error);
    return NextResponse.json({ error: 'Failed to generate PDF' }, { status: 500 });
  }
}
