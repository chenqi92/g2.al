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
          {t('legal.terms.title')}
        </h1>
        <p className="text-gray-400">{t('legal.terms.lastUpdated')}</p>
      </div>

      <div className="prose prose-invert max-w-none">
        <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 rounded-xl border border-gray-700 p-6 mb-8">
          <p className="text-lg text-gray-300">{t('legal.terms.intro')}</p>
        </div>

        <div className="space-y-8">
          <section className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 rounded-xl border border-gray-700 p-6">
            <h2 className="text-2xl font-semibold mb-4 text-primary-400">
              {t('legal.terms.usage.title')}
            </h2>
            <p className="text-gray-300">{t('legal.terms.usage.content')}</p>
          </section>

          <section className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 rounded-xl border border-gray-700 p-6">
            <h2 className="text-2xl font-semibold mb-4 text-primary-400">
              {t('legal.terms.restrictions.title')}
            </h2>
            <p className="text-gray-300">{t('legal.terms.restrictions.content')}</p>
          </section>

          <section className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 rounded-xl border border-gray-700 p-6">
            <h2 className="text-2xl font-semibold mb-4 text-primary-400">
              {t('legal.terms.termination.title')}
            </h2>
            <p className="text-gray-300">{t('legal.terms.termination.content')}</p>
          </section>

          <section className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 rounded-xl border border-gray-700 p-6">
            <h2 className="text-2xl font-semibold mb-4 text-primary-400">
              {t('legal.terms.liability.title')}
            </h2>
            <p className="text-gray-300">{t('legal.terms.liability.content')}</p>
          </section>
        </div>
      </div>
    </div>
  );
}