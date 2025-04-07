import React, { useState } from 'react';
import { Mail, RefreshCw, Copy, Trash2, Clock } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface Email {
  id: string;
  from: string;
  subject: string;
  timestamp: string;
  content: string;
}

export default function TempMail() {
  const { t } = useTranslation();
  const [tempEmail, setTempEmail] = useState('user123@tempmail.example.com');
  const [emails, setEmails] = useState<Email[]>([]);
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const generateNewEmail = async () => {
    setIsLoading(true);
    try {
      // TODO: Implement email generation logic
      setTempEmail(`user${Math.random().toString(36).substring(2, 8)}@tempmail.example.com`);
      setEmails([]);
      setSelectedEmail(null);
    } catch (err) {
      setError(t('tempMailPage.error.generate'));
    } finally {
      setIsLoading(false);
    }
  };

  const copyEmailAddress = async () => {
    try {
      await navigator.clipboard.writeText(tempEmail);
    } catch (err) {
      setError(t('tempMailPage.error.copy'));
    }
  };

  const refreshInbox = async () => {
    setIsLoading(true);
    try {
      // TODO: Implement inbox refresh logic
    } catch (err) {
      setError(t('tempMailPage.error.refresh'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <Mail className="h-12 w-12 text-primary-400 mx-auto mb-4" />
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary-400 to-secondary-400 text-transparent bg-clip-text">
            {t('tempMailPage.title')}
          </h1>
          <p className="text-lg text-gray-300">
            {t('tempMailPage.description')}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Email Address Controls */}
          <div className="lg:col-span-3">
            <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 rounded-xl border border-gray-700 p-6">
              <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
                <div className="flex-1 w-full">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    {t('tempMailPage.yourAddress')}
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      readOnly
                      value={tempEmail}
                      className="block w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-gray-100 focus:ring-2 focus:ring-primary-400 focus:border-transparent"
                    />
                    <button
                      onClick={copyEmailAddress}
                      className="p-3 text-gray-400 hover:text-primary-400 rounded-lg hover:bg-gray-700/50"
                      title={t('tempMailPage.copyAddress')}
                    >
                      <Copy className="h-5 w-5" />
                    </button>
                  </div>
                </div>
                <div className="flex gap-2 self-end">
                  <button
                    onClick={generateNewEmail}
                    disabled={isLoading}
                    className="flex items-center justify-center gap-2 px-4 py-3 border border-transparent rounded-lg text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
                  >
                    <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                    {t('tempMailPage.newAddress')}
                  </button>
                  <button
                    onClick={refreshInbox}
                    disabled={isLoading}
                    className="flex items-center justify-center gap-2 px-4 py-3 border border-primary-600 rounded-lg text-sm font-medium text-primary-400 hover:bg-primary-600/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
                  >
                    <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                    {t('tempMailPage.refresh')}
                  </button>
                </div>
              </div>

              {error && (
                <div className="mt-4 p-4 bg-red-900/50 border border-red-700 rounded-lg">
                  <p className="text-sm text-red-400">{error}</p>
                </div>
              )}
            </div>
          </div>

          {/* Email List */}
          <div className="lg:col-span-1 bg-gradient-to-br from-gray-900/50 to-gray-800/50 rounded-xl border border-gray-700 overflow-hidden h-[600px] flex flex-col">
            <div className="p-4 border-b border-gray-700">
              <h2 className="text-lg font-semibold text-gray-100">{t('tempMailPage.inbox')}</h2>
            </div>
            <div className="flex-1 overflow-y-auto">
              {emails.length === 0 ? (
                <div className="h-full flex items-center justify-center p-6 text-center text-gray-400">
                  <div>
                    <Mail className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>{t('tempMailPage.noMessages')}</p>
                  </div>
                </div>
              ) : (
                <div className="divide-y divide-gray-700">
                  {emails.map((email) => (
                    <button
                      key={email.id}
                      onClick={() => setSelectedEmail(email)}
                      className={`w-full p-4 text-left hover:bg-gray-800/50 transition-colors ${
                        selectedEmail?.id === email.id ? 'bg-gray-800/50' : ''
                      }`}
                    >
                      <p className="text-sm font-medium text-gray-100 truncate">{email.subject}</p>
                      <p className="text-xs text-gray-400 mt-1">{email.from}</p>
                      <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                        <Clock className="h-3 w-3" />
                        <span>{email.timestamp}</span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Email Content */}
          <div className="lg:col-span-2 bg-gradient-to-br from-gray-900/50 to-gray-800/50 rounded-xl border border-gray-700 h-[600px] flex flex-col">
            {selectedEmail ? (
              <div className="h-full flex flex-col">
                <div className="p-6 border-b border-gray-700">
                  <div className="flex items-start justify-between">
                    <div>
                      <h2 className="text-xl font-semibold text-gray-100">{selectedEmail.subject}</h2>
                      <p className="text-sm text-gray-400 mt-1">{t('tempMailPage.from')}: {selectedEmail.from}</p>
                      <p className="text-sm text-gray-500 mt-1">{selectedEmail.timestamp}</p>
                    </div>
                    <button
                      onClick={() => setSelectedEmail(null)}
                      className="p-2 text-gray-400 hover:text-red-400 rounded-lg hover:bg-gray-800/50"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
                <div className="p-6 flex-1 overflow-auto">
                  <div className="prose prose-invert max-w-none">
                    {selectedEmail.content}
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center p-6 text-center text-gray-400">
                <div>
                  <Mail className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>{t('tempMailPage.selectEmail')}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}