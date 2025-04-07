import React from 'react';
import { useTranslation } from 'react-i18next';
import { FileText } from 'lucide-react';

export default function Terms() {
  const { t } = useTranslation();

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <div className="text-center mb-12">
        <FileText className="h-12 w-12 text-primary-400 mx-auto mb-4" />
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary-400 to-secondary-400 text-transparent bg-clip-text">
          {t('terms')}
        </h1>
        <p className="text-gray-400">{t('termsOfService.lastUpdated')}</p>
      </div>

      <div className="prose prose-invert max-w-none">
        <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 rounded-xl border border-gray-700 p-6 mb-8">
          <p className="text-lg text-gray-300">{t('termsOfService.intro')}</p>
        </div>

        <div className="space-y-8">
          <section className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 rounded-xl border border-gray-700 p-6">
            <h2 className="text-2xl font-semibold mb-4 text-primary-400">
              {t('termsOfService.usage.title')}
            </h2>
            <p className="text-gray-300">{t('termsOfService.usage.content')}</p>
          </section>

          <section className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 rounded-xl border border-gray-700 p-6">
            <h2 className="text-2xl font-semibold mb-4 text-primary-400">
              {t('termsOfService.sections.account.title')}
            </h2>
            <p className="text-gray-300">{t('termsOfService.sections.account.content')}</p>
          </section>

          <section className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 rounded-xl border border-gray-700 p-6">
            <h2 className="text-2xl font-semibold mb-4 text-primary-400">
              {t('termsOfService.restrictions.title')}
            </h2>
            <p className="text-gray-300">{t('termsOfService.restrictions.content')}</p>
          </section>

          <section className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 rounded-xl border border-gray-700 p-6">
            <h2 className="text-2xl font-semibold mb-4 text-primary-400">
              {t('termsOfService.sections.content.title')}
            </h2>
            <p className="text-gray-300">{t('termsOfService.sections.content.content')}</p>
          </section>

          <section className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 rounded-xl border border-gray-700 p-6">
            <h2 className="text-2xl font-semibold mb-4 text-primary-400">
              {t('termsOfService.termination.title')}
            </h2>
            <p className="text-gray-300">{t('termsOfService.termination.content')}</p>
          </section>

          <section className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 rounded-xl border border-gray-700 p-6">
            <h2 className="text-2xl font-semibold mb-4 text-primary-400">
              {t('termsOfService.sections.changes.title')}
            </h2>
            <p className="text-gray-300">{t('termsOfService.sections.changes.content')}</p>
          </section>

          <section className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 rounded-xl border border-gray-700 p-6">
            <h2 className="text-2xl font-semibold mb-4 text-primary-400">
              {t('termsOfService.liability.title')}
            </h2>
            <p className="text-gray-300">{t('termsOfService.liability.content')}</p>
          </section>
        </div>
      </div>
    </div>
  );
}