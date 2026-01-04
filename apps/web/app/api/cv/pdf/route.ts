import { NextRequest, NextResponse } from 'next/server';
import puppeteer from 'puppeteer';
import { getLocalizedCvData, getAllCvSkills } from '@/lib/content/cv-keystatic';

export const dynamic = 'force-dynamic';

/**
 * Generate PDF CV with options:
 * - theme: 'light' | 'dark' (default: 'light')
 * - lang: 'fr' | 'en' (default: 'fr')
 * - action: 'download' | 'print' (default: 'download')
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const theme = (searchParams.get('theme') as 'light' | 'dark') || 'light';
  const lang = (searchParams.get('lang') as 'fr' | 'en') || 'fr';
  const action = (searchParams.get('action') as 'download' | 'print') || 'download';

  // Get CV data
  const cvData = getLocalizedCvData(lang);
  const skills = getAllCvSkills();

  if (!cvData) {
    return NextResponse.json({ error: 'CV data not found' }, { status: 404 });
  }

  // Generate HTML for the CV
  const html = generateCvHtml(cvData, skills, theme, lang);

  try {
    // Launch puppeteer
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    const page = await browser.newPage();

    // Set viewport for A4
    await page.setViewport({
      width: 794, // A4 width at 96 DPI
      height: 1123, // A4 height at 96 DPI
    });

    // Set content
    await page.setContent(html, {
      waitUntil: 'networkidle0',
    });

    // Generate PDF
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '0',
        right: '0',
        bottom: '0',
        left: '0',
      },
    });

    await browser.close();

    // Determine filename based on language
    const filename = lang === 'fr'
      ? 'Daviani-Fillatre-CV.pdf'
      : 'Daviani-Fillatre-Resume.pdf';

    // Return PDF
    const headers: HeadersInit = {
      'Content-Type': 'application/pdf',
    };

    // For download, add Content-Disposition attachment
    // For print, browser will open inline
    if (action === 'download') {
      headers['Content-Disposition'] = `attachment; filename="${filename}"`;
    } else {
      headers['Content-Disposition'] = `inline; filename="${filename}"`;
    }

    return new NextResponse(Buffer.from(pdfBuffer), { headers });
  } catch (error) {
    console.error('Error generating PDF:', error);
    return NextResponse.json(
      { error: 'Failed to generate PDF' },
      { status: 500 }
    );
  }
}

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

function generateCvHtml(
  cvData: LocalizedCvData,
  skills: string[],
  theme: 'light' | 'dark',
  lang: 'fr' | 'en'
): string {
  const isDark = theme === 'dark';
  const isFr = lang === 'fr';

  // Nord theme colors
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
    nord14: '#A3BE8C',
  };

  // Theme-specific colors
  const bg = isDark ? colors.nord0 : colors.nord6;
  const cardBg = isDark ? colors.nord0 : '#FFFFFF';
  const sidebarBg = colors.nord1;
  const textPrimary = isDark ? colors.nord6 : colors.nord0;
  const textSecondary = isDark ? colors.nord4 : colors.nord3;
  const border = isDark ? colors.nord3 : colors.nord5;

  // Translations
  const t = {
    yearsExperience: isFr ? "ans d'expérience" : 'years of experience',
    yearsOld: isFr ? 'ans' : 'years old',
    contact: isFr ? 'Contact' : 'Contact',
    expertise: isFr ? "Domaines d'expertise" : 'Areas of Expertise',
    skills: isFr ? 'Compétences Clés' : 'Key Skills',
    contributions: isFr ? 'Contributions' : 'Contributions',
    experience: isFr ? 'Expériences Professionnelles' : 'Professional Experience',
    education: isFr ? 'Formation' : 'Education',
    projects: isFr ? 'Projets Personnels' : 'Personal Projects',
    current: isFr ? "Aujourd'hui" : 'Present',
    stack: isFr ? 'Stack' : 'Stack',
  };

  const experiencesHtml = cvData.experiences
    .map(
      (exp) => `
    <div class="experience-card">
      <div class="exp-header">
        <div>
          <div class="exp-role">${exp.role}</div>
          <div class="exp-company">${exp.company}</div>
        </div>
        <div class="exp-date">${exp.start} - ${exp.current ? t.current : exp.end}</div>
      </div>
      <div class="exp-content">
        ${exp.summary ? `<p style="margin-bottom: ${exp.highlights && exp.highlights.length > 0 ? '4px' : '0'}">${exp.summary}</p>` : ''}
        ${exp.highlights && exp.highlights.length > 0 ? `<ul class="exp-highlights">${exp.highlights.map((h) => `<li><span class="arrow">→</span>${h}</li>`).join('')}</ul>` : ''}
        ${exp.stack && exp.stack.length > 0 ? `<div class="exp-stack"><strong>${t.stack} :</strong> ${exp.stack.join(', ')}</div>` : ''}
      </div>
    </div>
  `
    )
    .join('');

  const educationHtml = cvData.education
    .map(
      (edu) => `
    <div class="education-card">
      <div class="edu-header">
        <div>
          <div class="edu-degree">${edu.degree}</div>
          <div class="edu-institution">${edu.institution}</div>
        </div>
        <div class="edu-date">${edu.start === edu.end ? edu.start : `${edu.start} - ${edu.end}`}</div>
      </div>
    </div>
  `
    )
    .join('');

  const expertiseHtml = cvData.expertise
    .map((exp) => `<div class="expertise-item"><span class="bullet">•</span>${exp.title}</div>`)
    .join('');

  const skillsHtml = skills.map((skill) => `<span class="skill-tag">${skill}</span>`).join('');

  const contributionsHtml = cvData.contributions
    .map(
      (contrib) => `
    <div class="contribution-item">
      <div class="contrib-type">${contrib.type} • ${contrib.date}</div>
      <div class="contrib-desc">${contrib.description}</div>
    </div>
  `
    )
    .join('');

  const projectsHtml = cvData.projects && cvData.projects.length > 0
    ? cvData.projects
        .map(
          (proj) => `
    <div class="project-card">
      <div class="proj-header">
        <div>
          <div class="proj-title">${proj.title}</div>
          ${proj.url ? `<a href="${proj.url}" class="proj-url">${proj.url.replace(/^https?:\/\//, '')}</a>` : ''}
        </div>
        <div class="proj-date">${proj.start} - ${proj.end}</div>
      </div>
      <div class="proj-content">
        ${proj.description ? `<p class="proj-desc">${proj.description}</p>` : ''}
        ${proj.stack && proj.stack.length > 0 ? `<div class="proj-stack"><strong>${t.stack} :</strong> ${proj.stack.join(', ')}</div>` : ''}
      </div>
    </div>
  `
        )
        .join('')
    : '';

  return `<!DOCTYPE html>
<html lang="${lang}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>CV - ${cvData.personal.name}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    html, body {
      height: 297mm;
      max-height: 297mm;
      overflow: hidden;
    }

    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
      background: ${bg};
      color: ${textPrimary};
      font-size: 8px;
      line-height: 1.3;
      -webkit-font-smoothing: antialiased;
    }

    .cv-container {
      width: 210mm;
      height: 297mm;
      max-height: 297mm;
      margin: 0 auto;
      background: ${cardBg};
      display: flex;
      gap: 6px;
      padding: 6px;
      overflow: hidden;
    }

    /* Sidebar */
    .sidebar {
      width: 32%;
      background: ${sidebarBg};
      border-radius: 8px;
      overflow: hidden;
      position: relative;
    }

    .sidebar-gradient {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 80px;
      background: radial-gradient(ellipse at top, rgba(136, 192, 208, 0.18) 0%, transparent 70%);
      pointer-events: none;
    }

    .profile-section {
      position: relative;
      text-align: center;
      padding: 12px 10px 10px;
    }

    .profile-photo {
      width: 65px;
      height: 65px;
      border-radius: 50%;
      margin: 0 auto 8px;
      border: 2px solid rgba(136, 192, 208, 0.3);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
      object-fit: cover;
    }

    .profile-name {
      font-size: 13px;
      font-weight: 600;
      color: ${colors.nord6};
      margin-bottom: 2px;
      letter-spacing: -0.3px;
    }

    .profile-title {
      font-size: 9px;
      font-weight: 500;
      color: ${colors.nord8};
      margin-bottom: 2px;
    }

    .profile-experience {
      font-size: 7.5px;
      color: ${colors.nord4};
      opacity: 0.7;
    }

    .sidebar-content {
      padding: 0 10px 10px;
    }

    .section-title {
      font-size: 7.5px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 1px;
      color: ${colors.nord8};
      margin: 10px 0 6px;
      opacity: 0.9;
    }

    .section-title:first-child {
      margin-top: 0;
    }

    .contact-item {
      position: relative;
      margin: 4px 0;
      padding-left: 10px;
      font-size: 7.5px;
      color: ${colors.nord4};
      opacity: 0.85;
      word-break: break-word;
    }

    .contact-item .bullet {
      position: absolute;
      left: 0;
      color: ${colors.nord8};
      font-weight: 700;
      font-size: 9px;
    }

    .contact-item a {
      color: ${colors.nord4};
      text-decoration: none;
    }

    .expertise-item {
      position: relative;
      margin: 4px 0;
      padding-left: 10px;
      font-size: 7.5px;
      color: ${colors.nord4};
      opacity: 0.9;
    }

    .expertise-item .bullet {
      position: absolute;
      left: 0;
      color: ${colors.nord8};
      font-weight: 700;
      font-size: 9px;
    }

    .skills-container {
      display: flex;
      flex-wrap: wrap;
      gap: 4px;
      margin-top: 6px;
    }

    .skill-tag {
      background: ${colors.nord10};
      color: white;
      padding: 3px 6px;
      border-radius: 4px;
      font-size: 7px;
      font-weight: 500;
    }

    .contributions-box {
      margin-top: 10px;
      padding: 8px;
      background: rgba(163, 190, 140, 0.1);
      border-radius: 6px;
      border: 1px solid rgba(163, 190, 140, 0.15);
    }

    .contributions-title {
      font-size: 7.5px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 1px;
      color: ${colors.nord14};
      margin-bottom: 6px;
    }

    .contribution-item {
      margin-bottom: 6px;
    }

    .contribution-item:last-child {
      margin-bottom: 0;
    }

    .contrib-type {
      font-size: 6.5px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.4px;
      color: ${colors.nord14};
      margin-bottom: 2px;
    }

    .contrib-desc {
      font-size: 7px;
      line-height: 1.35;
      color: ${colors.nord4};
      opacity: 0.9;
    }

    /* Main content */
    .main {
      width: 68%;
      background: ${cardBg};
      border-radius: 8px;
      padding: 10px 12px;
      overflow: hidden;
    }

    .main-section-title {
      font-size: 12px;
      font-weight: 600;
      color: ${textPrimary};
      margin: 0 0 6px;
      letter-spacing: -0.3px;
    }

    .main-section-title:not(:first-child) {
      margin-top: 10px;
    }

    .experience-card {
      background: ${cardBg};
      border: 1px solid ${border};
      border-radius: 6px;
      padding: 6px 8px;
      margin-bottom: 5px;
    }

    .exp-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 8px;
      margin-bottom: 3px;
    }

    .exp-role {
      font-size: 9px;
      font-weight: 600;
      color: ${textPrimary};
      margin-bottom: 1px;
      letter-spacing: -0.1px;
    }

    .exp-company {
      font-size: 8px;
      font-weight: 500;
      color: ${colors.nord8};
    }

    .exp-date {
      flex-shrink: 0;
      white-space: nowrap;
      font-size: 7px;
      font-weight: 500;
      color: ${textSecondary};
      padding: 2px 6px;
      border-radius: 3px;
      background: rgba(136, 192, 208, 0.15);
    }

    .exp-content {
      font-size: 7.5px;
      line-height: 1.35;
      color: ${textSecondary};
    }

    .exp-highlights {
      margin: 2px 0 2px 8px;
      list-style: none;
    }

    .exp-highlights li {
      position: relative;
      margin: 2px 0;
      padding-left: 10px;
    }

    .exp-highlights .arrow {
      position: absolute;
      left: 0;
      color: ${colors.nord8};
      font-weight: 600;
      font-size: 8px;
    }

    .exp-stack {
      margin-top: 2px;
      font-size: 7px;
      color: ${colors.nord8};
    }

    .education-grid {
      display: grid;
      gap: 5px;
    }

    .education-card {
      background: ${cardBg};
      border: 1px solid ${border};
      border-radius: 6px;
      padding: 6px 8px;
    }

    .edu-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 8px;
    }

    .edu-degree {
      font-size: 9px;
      font-weight: 600;
      color: ${textPrimary};
      margin-bottom: 1px;
      letter-spacing: -0.1px;
    }

    .edu-institution {
      font-size: 8px;
      font-weight: 500;
      color: ${colors.nord8};
    }

    .edu-date {
      flex-shrink: 0;
      white-space: nowrap;
      font-size: 7px;
      font-weight: 500;
      color: ${textSecondary};
      padding: 2px 6px;
      border-radius: 3px;
      background: rgba(136, 192, 208, 0.15);
    }

    .project-card {
      background: ${cardBg};
      border: 1px solid ${border};
      border-radius: 6px;
      padding: 6px 8px;
      margin-bottom: 5px;
    }

    .proj-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 8px;
      margin-bottom: 3px;
    }

    .proj-title {
      font-size: 9px;
      font-weight: 600;
      color: ${textPrimary};
      margin-bottom: 1px;
      letter-spacing: -0.1px;
    }

    .proj-url {
      font-size: 7px;
      font-weight: 500;
      color: ${colors.nord8};
      text-decoration: none;
    }

    .proj-date {
      flex-shrink: 0;
      white-space: nowrap;
      font-size: 7px;
      font-weight: 500;
      color: ${textSecondary};
      padding: 2px 6px;
      border-radius: 3px;
      background: rgba(136, 192, 208, 0.15);
    }

    .proj-content {
      font-size: 7.5px;
      line-height: 1.35;
      color: ${textSecondary};
    }

    .proj-desc {
      margin-bottom: 2px;
    }

    .proj-stack {
      margin-top: 2px;
      font-size: 7px;
      color: ${colors.nord8};
    }

    @media print {
      body {
        print-color-adjust: exact;
        -webkit-print-color-adjust: exact;
      }
    }
  </style>
</head>
<body>
  <div class="cv-container">
    <!-- Sidebar -->
    <aside class="sidebar">
      <div class="sidebar-gradient"></div>

      <div class="profile-section">
        ${cvData.personal.photo ? `<img src="${cvData.personal.photo.startsWith('/') ? `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}${cvData.personal.photo}` : cvData.personal.photo}" alt="${cvData.personal.name}" class="profile-photo" />` : ''}
        <div class="profile-name">${cvData.personal.name}</div>
        <div class="profile-title">${cvData.personal.title}</div>
        <div class="profile-experience">${cvData.personal.experienceYears} ${t.yearsExperience}</div>
      </div>

      <div class="sidebar-content">
        <div class="section-title">${t.contact}</div>
        <div class="contact-item"><span class="bullet">•</span>${cvData.personal.location}, ${cvData.personal.age} ${t.yearsOld}</div>
        ${cvData.personal.phone ? `<div class="contact-item"><span class="bullet">•</span>${cvData.personal.phone}</div>` : ''}
        <div class="contact-item"><span class="bullet">•</span><a href="mailto:${cvData.personal.email}">${cvData.personal.email}</a></div>
        ${cvData.personal.linkedin ? `<div class="contact-item"><span class="bullet">•</span><a href="${cvData.personal.linkedin}">${cvData.personal.linkedin.replace('https://', '')}</a></div>` : ''}
        ${cvData.personal.github ? `<div class="contact-item"><span class="bullet">•</span><a href="${cvData.personal.github}">${cvData.personal.github.replace('https://', '')}</a></div>` : ''}
        ${cvData.personal.website ? `<div class="contact-item"><span class="bullet">•</span><a href="${cvData.personal.website}">${cvData.personal.website.replace('https://', '')}</a></div>` : ''}

        <div class="section-title">${t.expertise}</div>
        ${expertiseHtml}

        <div class="section-title">${t.skills}</div>
        <div class="skills-container">
          ${skillsHtml}
        </div>

        ${
          cvData.contributions && cvData.contributions.length > 0
            ? `
        <div class="contributions-box">
          <div class="contributions-title">${t.contributions}</div>
          ${contributionsHtml}
        </div>
        `
            : ''
        }
      </div>
    </aside>

    <!-- Main content -->
    <main class="main">
      <h2 class="main-section-title">${t.experience}</h2>
      ${experiencesHtml}

      <h2 class="main-section-title">${t.education}</h2>
      <div class="education-grid">
        ${educationHtml}
      </div>

      ${projectsHtml ? `
      <h2 class="main-section-title">${t.projects}</h2>
      ${projectsHtml}
      ` : ''}
    </main>
  </div>
</body>
</html>`;
}