'use client';

import { Breadcrumb } from '@nordic-island/ui';
import { useTranslation } from '@/hooks/use-translation';

export default function AboutPageClient() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen">
      <div className="max-w-4xl mx-auto px-4 pt-5 pb-16">
        <div className="mb-8">
          <Breadcrumb items={[{ href: '/about', label: t('nav.about.title') }]} homeLabel={t('common.home')} ariaLabel={t('common.breadcrumb')} />
        </div>

        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-nord-0 dark:text-nord-6">
            {t('pages.about.title')}
          </h1>
        </div>

        <article className="prose prose-lg dark:prose-invert max-w-none">
          <section className="mb-12">
            <h2 className="text-2xl md:text-3xl font-semibold mb-6 text-nord-0 dark:text-nord-6">
              {t('pages.about.crossroad.title')}
            </h2>
            <p className="text-nord-3 dark:text-nord-4 mb-4 leading-relaxed">
              {t('pages.about.crossroad.p1')}
            </p>
            <p className="text-nord-3 dark:text-nord-4 mb-4 leading-relaxed">
              {t('pages.about.crossroad.p2')}
            </p>
            <p className="text-nord-3 dark:text-nord-4 leading-relaxed">
              {t('pages.about.crossroad.p3')}
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl md:text-3xl font-semibold mb-6 text-nord-0 dark:text-nord-6">
              {t('pages.about.building.title')}
            </h2>
            <p className="text-nord-3 dark:text-nord-4 mb-4 leading-relaxed">
              {t('pages.about.building.p1')}
            </p>
            <p className="text-nord-3 dark:text-nord-4 mb-4 leading-relaxed">
              {t('pages.about.building.p2')}
            </p>
            <p className="text-nord-3 dark:text-nord-4 mb-4 leading-relaxed">
              {t('pages.about.building.p3')}
            </p>
            <p className="text-nord-3 dark:text-nord-4 leading-relaxed">
              {t('pages.about.building.p4')}
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl md:text-3xl font-semibold mb-6 text-nord-0 dark:text-nord-6">
              {t('pages.about.transmit.title')}
            </h2>
            <p className="text-nord-3 dark:text-nord-4 mb-4 leading-relaxed">
              {t('pages.about.transmit.p1')}
            </p>
            <p className="text-nord-3 dark:text-nord-4 leading-relaxed">
              {t('pages.about.transmit.p2')}
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl md:text-3xl font-semibold mb-6 text-nord-0 dark:text-nord-6">
              {t('pages.about.breathe.title')}
            </h2>
            <p className="text-nord-3 dark:text-nord-4 mb-4 leading-relaxed">
              {t('pages.about.breathe.p1')}
            </p>
            <p className="text-nord-3 dark:text-nord-4 leading-relaxed">
              {t('pages.about.breathe.p2Start')}
              <a
                href="/photos"
                className="text-nord-10 hover:text-nord-9 underline underline-offset-2 transition-colors"
              >
                {t('pages.about.breathe.p2Link')}
              </a>
              {t('pages.about.breathe.p2End')}
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl md:text-3xl font-semibold mb-6 text-nord-0 dark:text-nord-6">
              {t('pages.about.next.title')}
            </h2>
            <p className="text-nord-3 dark:text-nord-4 leading-relaxed">
              {t('pages.about.next.p1')}
            </p>
          </section>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-12">
            <a
              href="/contact"
              className="inline-flex items-center justify-center px-6 py-3 text-base font-medium rounded-lg bg-nord-btn text-white hover:bg-nord-btn-hover transition-colors focus:outline-none focus:ring-2 focus:ring-nord-10 focus:ring-offset-2"
            >
              {t('pages.about.cta.contact')}
            </a>
            <a
              href="/rdv"
              className="inline-flex items-center justify-center px-6 py-3 text-base font-medium rounded-lg border-2 border-nord-10 text-nord-10 dark:text-nord-8 hover:bg-nord-btn hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-nord-10 focus:ring-offset-2"
            >
              {t('pages.about.cta.appointment')}
            </a>
          </div>
        </article>
      </div>
    </div>
  );
}
