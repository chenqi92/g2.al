import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Link2, Mail, BarChart2, Clock, ExternalLink } from 'lucide-react';

interface ShortURL {
  id: string;
  originalUrl: string;
  shortUrl: string;
  clicks: number;
  createdAt: string;
}

interface TempEmail {
  id: string;
  address: string;
  messageCount: number;
  expiresAt: string;
}

export default function Dashboard() {
  const { t } = useTranslation();
  
  // Placeholder data - to be replaced with actual data from backend
  const shortUrls: ShortURL[] = [
    {
      id: '1',
      originalUrl: 'https://example.com/very/long/url/that/needs/shortening',
      shortUrl: 'https://short.url/abc123',
      clicks: 42,
      createdAt: '2024-03-10T12:00:00Z',
    },
  ];

  const tempEmails: TempEmail[] = [
    {
      id: '1',
      address: 'temp123@tempmail.example.com',
      messageCount: 5,
      expiresAt: '2024-03-11T12:00:00Z',
    },
  ];

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <BarChart2 className="h-12 w-12 text-cyan-400 mx-auto mb-4" />
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-blue-500 text-transparent bg-clip-text">
            {t('dashboard.title')}
          </h1>
          <p className="text-lg text-gray-300">
            {t('dashboard.description')}
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="bg-gradient-to-br from-cyan-900/50 to-blue-900/50 rounded-xl border border-cyan-800/50 p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-gray-400">{t('dashboard.stats.activeUrls')}</h3>
              <Link2 className="h-5 w-5 text-cyan-400" />
            </div>
            <p className="text-3xl font-bold mt-2">{shortUrls.length}</p>
          </div>
          <div className="bg-gradient-to-br from-cyan-900/50 to-blue-900/50 rounded-xl border border-cyan-800/50 p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-gray-400">{t('dashboard.stats.totalClicks')}</h3>
              <BarChart2 className="h-5 w-5 text-cyan-400" />
            </div>
            <p className="text-3xl font-bold mt-2">
              {shortUrls.reduce((acc, url) => acc + url.clicks, 0)}
            </p>
          </div>
          <div className="bg-gradient-to-br from-cyan-900/50 to-blue-900/50 rounded-xl border border-cyan-800/50 p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-gray-400">{t('dashboard.stats.activeEmails')}</h3>
              <Mail className="h-5 w-5 text-cyan-400" />
            </div>
            <p className="text-3xl font-bold mt-2">{tempEmails.length}</p>
          </div>
          <div className="bg-gradient-to-br from-cyan-900/50 to-blue-900/50 rounded-xl border border-cyan-800/50 p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-gray-400">{t('dashboard.stats.totalMessages')}</h3>
              <Mail className="h-5 w-5 text-cyan-400" />
            </div>
            <p className="text-3xl font-bold mt-2">
              {tempEmails.reduce((acc, email) => acc + email.messageCount, 0)}
            </p>
          </div>
        </div>

        {/* Short URLs Section */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold">{t('dashboard.shortUrls.title')}</h2>
            <Link
              to="/url-shortener"
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-700 transition-colors text-white"
            >
              <Link2 className="h-4 w-4" />
              {t('dashboard.shortUrls.createNew')}
            </Link>
          </div>
          <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 rounded-xl border border-gray-700 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">{t('dashboard.shortUrls.originalUrl')}</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">{t('dashboard.shortUrls.shortUrl')}</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">{t('dashboard.shortUrls.clicks')}</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">{t('dashboard.shortUrls.created')}</th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-gray-300">{t('dashboard.shortUrls.actions')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {shortUrls.map((url) => (
                    <tr key={url.id} className="hover:bg-gray-800/50">
                      <td className="px-6 py-4 text-sm">
                        <div className="max-w-xs truncate text-gray-300">{url.originalUrl}</div>
                      </td>
                      <td className="px-6 py-4 text-sm text-cyan-400">{url.shortUrl}</td>
                      <td className="px-6 py-4 text-sm text-gray-300">{url.clicks}</td>
                      <td className="px-6 py-4 text-sm text-gray-400">
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {new Date(url.createdAt).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-right">
                        <a
                          href={url.shortUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-400 hover:text-cyan-400"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Temporary Emails Section */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold">{t('dashboard.tempEmails.title')}</h2>
            <Link
              to="/temp-mail"
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-700 transition-colors text-white"
            >
              <Mail className="h-4 w-4" />
              {t('dashboard.tempEmails.createNew')}
            </Link>
          </div>
          <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 rounded-xl border border-gray-700 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">{t('dashboard.tempEmails.emailAddress')}</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">{t('dashboard.tempEmails.messages')}</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">{t('dashboard.tempEmails.expires')}</th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-gray-300">{t('dashboard.tempEmails.actions')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {tempEmails.map((email) => (
                    <tr key={email.id} className="hover:bg-gray-800/50">
                      <td className="px-6 py-4 text-sm text-cyan-400">{email.address}</td>
                      <td className="px-6 py-4 text-sm text-gray-300">{email.messageCount}</td>
                      <td className="px-6 py-4 text-sm text-gray-400">
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {new Date(email.expiresAt).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-right">
                        <Link
                          to="/temp-mail"
                          className="text-gray-400 hover:text-cyan-400"
                        >
                          <Mail className="h-4 w-4" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}