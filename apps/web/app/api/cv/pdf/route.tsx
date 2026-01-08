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

// Nord theme colors (complete palette)
const colors = {
  // Polar Night
  nord0: '#2E3440',
  nord1: '#3B4252',
  nord2: '#434C5E',
  nord3: '#4C566A',
  // Snow Storm
  nord4: '#D8DEE9',
  nord5: '#E5E9F0',
  nord6: '#ECEFF4',
  // Frost
  nord7: '#8FBCBB',
  nord8: '#88C0D0',
  nord9: '#81A1C1',
  nord10: '#5E81AC',
  // Aurora
  nord11: '#BF616A', // red
  nord12: '#D08770', // orange
  nord13: '#EBCB8B', // yellow
  nord14: '#A3BE8C', // green
  nord15: '#B48EAD', // purple
};

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

// Styles - Compact for single page A4
const styles = StyleSheet.create({
  page: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    fontFamily: 'Inter',
    fontSize: 7,
    padding: 8,
    gap: 8,
  },
  // === SIDEBAR (unchanged) ===
  sidebar: {
    width: '32%',
    backgroundColor: colors.nord1,
    borderRadius: 6,
    overflow: 'hidden',
  },
  profileSection: {
    alignItems: 'center',
    padding: '10 8 8',
  },
  profilePhoto: {
    width: 55,
    height: 55,
    borderRadius: 27,
    marginBottom: 6,
    objectFit: 'cover',
    borderWidth: 3,
    borderColor: colors.nord8,
  },
  profileName: {
    fontSize: 11,
    fontWeight: 600,
    color: colors.nord6,
    marginBottom: 2,
  },
  profileTitle: {
    fontSize: 8,
    fontWeight: 500,
    color: colors.nord8,
    marginBottom: 2,
    textAlign: 'center',
  },
  profileExperience: {
    fontSize: 7,
    color: colors.nord4,
    opacity: 0.7,
  },
  sidebarContent: {
    padding: '0 10 10',
  },
  sectionTitle: {
    fontSize: 7,
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    color: colors.nord8,
    marginTop: 10,
    marginBottom: 5,
  },
  contactItem: {
    marginVertical: 1.5,
    paddingLeft: 8,
    fontSize: 6.5,
    color: colors.nord4,
    position: 'relative',
  },
  contactBullet: {
    position: 'absolute',
    left: 0,
    color: colors.nord8,
    fontWeight: 700,
    fontSize: 8,
  },
  contactLink: {
    color: colors.nord4,
    textDecoration: 'none',
  },
  expertiseItem: {
    marginVertical: 1,
    paddingLeft: 8,
    fontSize: 6.5,
    color: colors.nord4,
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 2,
    marginTop: 2,
  },
  skillCategory: {
    marginTop: 4,
  },
  skillCategoryLabel: {
    fontSize: 5.5,
    fontWeight: 600,
    color: colors.nord4,
    opacity: 0.7,
    marginBottom: 2,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  skillTag: {
    backgroundColor: colors.nord10,
    color: 'white',
    padding: '1.5 3',
    borderRadius: 2,
    fontSize: 5.5,
    fontWeight: 500,
  },
  languageItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 1,
    fontSize: 6.5,
    color: colors.nord4,
  },
  languageLevel: {
    color: colors.nord8,
    fontWeight: 500,
  },
  contributionsBox: {
    marginTop: 8,
    padding: 6,
    backgroundColor: '#454E58',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#4B555B',
  },
  contributionsTitle: {
    fontSize: 7,
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    color: colors.nord14,
    marginBottom: 4,
  },
  contributionItem: {
    marginBottom: 4,
  },
  contribType: {
    fontSize: 6,
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: 0.3,
    color: colors.nord14,
    marginBottom: 1,
  },
  contribDesc: {
    fontSize: 6,
    lineHeight: 1.3,
    color: colors.nord4,
  },
  // === MAIN CONTENT (compact) ===
  main: {
    width: '68%',
    backgroundColor: '#FFFFFF',
    borderRadius: 6,
    padding: '8 10',
  },
  mainSectionTitle: {
    fontSize: 9,
    fontWeight: 600,
    color: colors.nord0,
    marginBottom: 4,
  },
  mainSectionTitleNotFirst: {
    fontSize: 9,
    fontWeight: 600,
    color: colors.nord0,
    marginTop: 5,
    marginBottom: 4,
  },
  experienceCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: colors.nord5,
    borderRadius: 4,
    padding: '3 5',
    marginBottom: 3,
  },
  expHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 6,
    marginBottom: 2,
  },
  expRole: {
    fontSize: 7,
    fontWeight: 600,
    color: colors.nord0,
    marginBottom: 1,
  },
  expCompany: {
    fontSize: 6,
    fontWeight: 500,
    color: colors.nord8,
  },
  expDate: {
    fontSize: 5.5,
    fontWeight: 500,
    color: colors.nord3,
    padding: '1 4',
    borderRadius: 2,
    backgroundColor: '#E8F4F8',
  },
  expContent: {
    fontSize: 6,
    lineHeight: 1.3,
    color: colors.nord3,
  },
  expHighlights: {
    marginVertical: 1,
    marginLeft: 4,
  },
  expHighlightItem: {
    marginVertical: 0.5,
    paddingLeft: 7,
    fontSize: 6,
    color: colors.nord3,
  },
  expArrow: {
    position: 'absolute',
    left: 0,
    color: colors.nord8,
    fontWeight: 600,
    fontSize: 6,
  },
  expStack: {
    marginTop: 1,
    fontSize: 5.5,
    color: colors.nord8,
  },
  educationCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: colors.nord5,
    borderRadius: 4,
    padding: '3 5',
    marginBottom: 3,
  },
  eduHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 6,
  },
  eduDegree: {
    fontSize: 7,
    fontWeight: 600,
    color: colors.nord0,
    marginBottom: 1,
  },
  eduInstitution: {
    fontSize: 6,
    fontWeight: 500,
    color: colors.nord8,
  },
  eduDate: {
    fontSize: 5.5,
    fontWeight: 500,
    color: colors.nord3,
    padding: '1 4',
    borderRadius: 2,
    backgroundColor: '#E8F4F8',
  },
  projectCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: colors.nord5,
    borderRadius: 4,
    padding: '3 5',
    marginBottom: 3,
  },
  projHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 6,
    marginBottom: 2,
  },
  projTitle: {
    fontSize: 7,
    fontWeight: 600,
    color: colors.nord0,
    marginBottom: 1,
  },
  projUrl: {
    fontSize: 5.5,
    fontWeight: 500,
    color: colors.nord8,
    textDecoration: 'none',
  },
  projDate: {
    fontSize: 5.5,
    fontWeight: 500,
    color: colors.nord3,
    padding: '1 4',
    borderRadius: 2,
    backgroundColor: 'rgba(136, 192, 208, 0.15)',
  },
  projContent: {
    fontSize: 6,
    lineHeight: 1.3,
    color: colors.nord3,
  },
  projDesc: {
    marginBottom: 1,
  },
  projStack: {
    marginTop: 1,
    fontSize: 5.5,
    color: colors.nord8,
  },
});

// CV Document Component
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
    yearsOld: isFr ? 'ans' : 'years old',
    contact: isFr ? 'Contact' : 'Contact',
    expertise: isFr ? "Domaines d'expertise" : 'Areas of Expertise',
    skills: isFr ? 'Compétences' : 'Skills',
    languages: isFr ? 'Langues' : 'Languages',
    contributions: isFr ? 'Contributions' : 'Contributions',
    experience: isFr ? 'Expériences Professionnelles' : 'Professional Experience',
    education: isFr ? 'Formation' : 'Education',
    projects: isFr ? 'Projets Personnels' : 'Personal Projects',
    current: isFr ? "Aujourd'hui" : 'Present',
    stack: isFr ? 'Stack' : 'Stack',
  };

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

  const photoUrl = cvData.personal.photo
    ? cvData.personal.photo.startsWith('/')
      ? `${process.env.NEXT_PUBLIC_SITE_URL || 'https://daviani.dev'}${cvData.personal.photo}`
      : cvData.personal.photo
    : null;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Sidebar */}
        <View style={styles.sidebar}>
          <View style={styles.profileSection}>
            {photoUrl && (
              <Image src={photoUrl} style={styles.profilePhoto} />
            )}
            <Text style={styles.profileName}>{cvData.personal.name}</Text>
            <Text style={styles.profileTitle}>{cvData.personal.title}</Text>
            <Text style={styles.profileExperience}>
              {cvData.personal.experienceYears} {t.yearsExperience}
            </Text>
          </View>

          <View style={styles.sidebarContent}>
            <Text style={styles.sectionTitle}>{t.contact}</Text>
            <View style={styles.contactItem}>
              <Text style={styles.contactBullet}>•</Text>
              <Text>
                {cvData.personal.location}, {cvData.personal.age} {t.yearsOld}
              </Text>
            </View>
            {cvData.personal.phone && (
              <View style={styles.contactItem}>
                <Text style={styles.contactBullet}>•</Text>
                <Text>{cvData.personal.phone}</Text>
              </View>
            )}
            <View style={styles.contactItem}>
              <Text style={styles.contactBullet}>•</Text>
              <Link src={`mailto:${cvData.personal.email}`} style={styles.contactLink}>
                {cvData.personal.email}
              </Link>
            </View>
            {cvData.personal.linkedin && (
              <View style={styles.contactItem}>
                <Text style={styles.contactBullet}>•</Text>
                <Link src={cvData.personal.linkedin} style={styles.contactLink}>
                  {cvData.personal.linkedin.replace('https://', '')}
                </Link>
              </View>
            )}
            {cvData.personal.github && (
              <View style={styles.contactItem}>
                <Text style={styles.contactBullet}>•</Text>
                <Link src={cvData.personal.github} style={styles.contactLink}>
                  {cvData.personal.github.replace('https://', '')}
                </Link>
              </View>
            )}
            {cvData.personal.website && (
              <View style={styles.contactItem}>
                <Text style={styles.contactBullet}>•</Text>
                <Link src={cvData.personal.website} style={styles.contactLink}>
                  {cvData.personal.website.replace('https://', '')}
                </Link>
              </View>
            )}

            <Text style={styles.sectionTitle}>{t.expertise}</Text>
            {cvData.expertise.map((exp, i) => (
              <View key={i} style={styles.expertiseItem}>
                <Text style={styles.contactBullet}>•</Text>
                <Text>{exp.title}</Text>
              </View>
            ))}

            <Text style={styles.sectionTitle}>{t.skills}</Text>
            {categoryOrder.map((category) => {
              const categorySkills = skillsByCategory[category] || [];
              if (categorySkills.length === 0) return null;
              return (
                <View key={category} style={styles.skillCategory}>
                  <Text style={styles.skillCategoryLabel}>
                    {categoryLabels[category]?.[lang] || category}
                  </Text>
                  <View style={styles.skillsContainer}>
                    {categorySkills.map((skill, i) => (
                      <Text key={i} style={styles.skillTag}>
                        {skill}
                      </Text>
                    ))}
                  </View>
                </View>
              );
            })}

            {cvData.languages && cvData.languages.length > 0 && (
              <>
                <Text style={styles.sectionTitle}>{t.languages}</Text>
                {cvData.languages.map((lng, i) => (
                  <View key={i} style={styles.languageItem}>
                    <Text>{lng.language}</Text>
                    <Text style={styles.languageLevel}>{lng.level}</Text>
                  </View>
                ))}
              </>
            )}

            {cvData.contributions && cvData.contributions.length > 0 && (
              <View style={styles.contributionsBox}>
                <Text style={styles.contributionsTitle}>{t.contributions}</Text>
                {cvData.contributions.map((contrib, i) => (
                  <View key={i} style={styles.contributionItem}>
                    <Text style={styles.contribType}>
                      {contrib.type} • {contrib.date}
                    </Text>
                    <Text style={styles.contribDesc}>{contrib.description}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        </View>

        {/* Main Content */}
        <View style={styles.main}>
          <Text style={styles.mainSectionTitle}>{t.experience}</Text>
          {cvData.experiences.map((exp, i) => (
            <View key={i} style={styles.experienceCard}>
              <View style={styles.expHeader}>
                <View>
                  <Text style={styles.expRole}>{exp.role}</Text>
                  <Text style={styles.expCompany}>{exp.company}</Text>
                </View>
                <Text style={styles.expDate}>
                  {exp.start} - {exp.current ? t.current : exp.end}
                </Text>
              </View>
              <View style={styles.expContent}>
                {exp.summary && (
                  <Text style={{ marginBottom: exp.highlights?.length > 0 ? 4 : 0 }}>
                    {exp.summary}
                  </Text>
                )}
                {exp.highlights && exp.highlights.length > 0 && (
                  <View style={styles.expHighlights}>
                    {exp.highlights.map((h, j) => (
                      <View key={j} style={styles.expHighlightItem}>
                        <Text style={styles.expArrow}>→</Text>
                        <Text>{h}</Text>
                      </View>
                    ))}
                  </View>
                )}
                {exp.stack && exp.stack.length > 0 && (
                  <Text style={styles.expStack}>
                    <Text style={{ fontWeight: 600 }}>{t.stack} : </Text>
                    {exp.stack.join(', ')}
                  </Text>
                )}
              </View>
            </View>
          ))}

          <Text style={styles.mainSectionTitleNotFirst}>{t.education}</Text>
          {cvData.education.map((edu, i) => (
            <View key={i} style={styles.educationCard}>
              <View style={styles.eduHeader}>
                <View>
                  <Text style={styles.eduDegree}>{edu.degree}</Text>
                  <Text style={styles.eduInstitution}>{edu.institution}</Text>
                </View>
                <Text style={styles.eduDate}>
                  {edu.start === edu.end ? edu.start : `${edu.start} - ${edu.end}`}
                </Text>
              </View>
            </View>
          ))}

          {cvData.projects && cvData.projects.length > 0 && (
            <>
              <Text style={styles.mainSectionTitleNotFirst}>{t.projects}</Text>
              {cvData.projects.map((proj, i) => (
                <View key={i} style={styles.projectCard}>
                  <View style={styles.projHeader}>
                    <View>
                      <Text style={styles.projTitle}>{proj.title}</Text>
                      {proj.url && (
                        <Link src={proj.url} style={styles.projUrl}>
                          {proj.url.replace(/^https?:\/\//, '')}
                        </Link>
                      )}
                    </View>
                    <Text style={styles.projDate}>
                      {proj.start} - {proj.end}
                    </Text>
                  </View>
                  <View style={styles.projContent}>
                    {proj.description && (
                      <Text style={styles.projDesc}>{proj.description}</Text>
                    )}
                    {proj.highlights && proj.highlights.length > 0 && (
                      <View style={styles.expHighlights}>
                        {proj.highlights.map((h, j) => (
                          <View key={j} style={styles.expHighlightItem}>
                            <Text style={styles.expArrow}>→</Text>
                            <Text>{h}</Text>
                          </View>
                        ))}
                      </View>
                    )}
                    {proj.stack && proj.stack.length > 0 && (
                      <Text style={styles.projStack}>
                        <Text style={{ fontWeight: 600 }}>{t.stack} : </Text>
                        {proj.stack.join(', ')}
                      </Text>
                    )}
                  </View>
                </View>
              ))}
            </>
          )}
        </View>
      </Page>
    </Document>
  );
}

/**
 * Generate PDF CV with options:
 * - lang: 'fr' | 'en' (default: 'fr')
 * - action: 'download' | 'print' (default: 'download')
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const lang = (searchParams.get('lang') as 'fr' | 'en') || 'fr';
  const action = (searchParams.get('action') as 'download' | 'print') || 'download';

  // Get CV data
  const cvData = getLocalizedCvData(lang);
  const skillsByCategory = getCvSkillsByCategory();

  if (!cvData) {
    return NextResponse.json({ error: 'CV data not found' }, { status: 404 });
  }

  try {
    // Generate PDF with React-PDF
    const pdfStream = await ReactPDF.renderToStream(
      <CvDocument cvData={cvData} skillsByCategory={skillsByCategory} lang={lang} />
    );

    // Convert stream to buffer
    const chunks: Buffer[] = [];
    for await (const chunk of pdfStream) {
      chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
    }
    const pdfBuffer = Buffer.concat(chunks);

    // Determine filename based on language
    const filename =
      lang === 'fr' ? 'Daviani-Fillatre-CV.pdf' : 'Daviani-Fillatre-Resume.pdf';

    // Return PDF
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
