import { getLocalizedCvData, getAllCvSkills } from '@/lib/content/cv-keystatic';
import { CvPageContent } from '@/components/cv/CvPageContent';

export default function CvPage() {
  // Server-side: read CV data from Keystatic YAML
  // Default to French, client will handle locale switching
  const cvDataFr = getLocalizedCvData('fr');
  const cvDataEn = getLocalizedCvData('en');
  const skills = getAllCvSkills();

  if (!cvDataFr || !cvDataEn) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-nord-4">CV data not found</p>
      </div>
    );
  }

  return <CvPageContent cvDataFr={cvDataFr} cvDataEn={cvDataEn} skills={skills} />;
}