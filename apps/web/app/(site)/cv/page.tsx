import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'CV',
};

// Placeholder — la vraie page (visionneuse PDF conditionnelle au thème + téléchargement)
// est construite en Phase 4. Le CMS Keystatic du CV a été retiré (Phase 1).
export default function CvPage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-nord-4">CV — bientôt disponible en PDF.</p>
    </div>
  );
}
