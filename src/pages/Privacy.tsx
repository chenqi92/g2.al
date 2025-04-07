import React from 'react';
import { useTranslation } from 'react-i18next';
import { Shield } from 'lucide-react';

export default function Privacy() {
  const { t } = useTranslation();

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <div className="text-center mb-12">
        <Shield className="h-12 w-12 text-primary-400 mx-auto mb-4" />
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary-400 to-secondary-400 text-transparent bg-clip-text">
          {t('privacy')}
        </h1>
        <p className="text-gray-400">{t('privacyPolicy.lastUpdated')}</p>
      </div>

      <div className="prose prose-invert max-w-none">
        <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 rounded-xl border border-gray-700 p-6 mb-8">
          <p className="text-lg text-gray-300">{t('privacyPolicy.intro')}</p>
        </div>

        <div className="space-y-8">
          <section className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 rounded-xl border border-gray-700 p-6">
            <h2 className="text-2xl font-semibold mb-4 text-primary-400">
              {t('privacyPolicy.dataCollection.title')}
            </h2>
            <p className="text-gray-300">{t('privacyPolicy.dataCollection.content')}</p>
          </section>

          <section className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 rounded-xl border border-gray-700 p-6">
            <h2 className="text-2xl font-semibold mb-4 text-primary-400">
              {t('privacyPolicy.dataUse.title')}
            </h2>
            <p className="text-gray-300">{t('privacyPolicy.dataUse.content')}</p>
          </section>

          <section className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 rounded-xl border border-gray-700 p-6">
            <h2 className="text-2xl font-semibold mb-4 text-primary-400">
              {t('privacyPolicy.sections.cookies.title')}
            </h2>
            <p className="text-gray-300">{t('privacyPolicy.sections.cookies.content')}</p>
          </section>

          <section className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 rounded-xl border border-gray-700 p-6">
            <h2 className="text-2xl font-semibold mb-4 text-primary-400">
              {t('privacyPolicy.sections.thirdParty.title')}
            </h2>
            <p className="text-gray-300">{t('privacyPolicy.sections.thirdParty.content')}</p>
          </section>

          <section className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 rounded-xl border border-gray-700 p-6">
            <h2 className="text-2xl font-semibold mb-4 text-primary-400">
              {t('privacyPolicy.dataSecurity.title')}
            </h2>
            <p className="text-gray-300">{t('privacyPolicy.dataSecurity.content')}</p>
          </section>

          <section className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 rounded-xl border border-gray-700 p-6">
            <h2 className="text-2xl font-semibold mb-4 text-primary-400">
              {t('privacyPolicy.userRights.title')}
            </h2>
            <p className="text-gray-300">{t('privacyPolicy.userRights.content')}</p>
          </section>

          <section className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 rounded-xl border border-gray-700 p-6">
            <h2 className="text-2xl font-semibold mb-4 text-primary-400">
              {t('privacyPolicy.sections.updates.title')}
            </h2>
            <p className="text-gray-300">{t('privacyPolicy.sections.updates.content')}</p>
          </section>
        </div>
      </div>
    </div>
  );
}