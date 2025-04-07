import React from 'react';
import { Link } from 'react-router-dom';
import { Github, Twitter, Mail } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';

export default function Footer() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-t from-gray-900 to-transparent">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About Section */}
          <div className="col-span-2">
            <h3 className="text-lg font-semibold text-cyan-400 mb-4">{t('about.title')}</h3>
            <p className="text-gray-400 mb-4">
              {t('footer.description')}
            </p>
            <div className="flex space-x-4">
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-cyan-400" title={t('footer.followUs')}>
                <Github className="h-6 w-6" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-cyan-400" title={t('footer.followUs')}>
                <Twitter className="h-6 w-6" />
              </a>
              <a href="mailto:contact@example.com" className="text-gray-400 hover:text-cyan-400" title={t('footer.contactUs')}>
                <Mail className="h-6 w-6" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-cyan-400 mb-4">{t('quickLinks')}</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/url-shortener" className="text-gray-400 hover:text-cyan-400">
                  {t('urlShortener')}
                </Link>
              </li>
              <li>
                <Link to="/temp-mail" className="text-gray-400 hover:text-cyan-400">
                  {t('tempMail')}
                </Link>
              </li>
              {user && (
                <li>
                  <Link to="/dashboard" className="text-gray-400 hover:text-cyan-400">
                    {t('dashboard')}
                  </Link>
                </li>
              )}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-lg font-semibold text-cyan-400 mb-4">{t('legal')}</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/privacy" className="text-gray-400 hover:text-cyan-400">
                  {t('privacy')}
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-gray-400 hover:text-cyan-400">
                  {t('terms')}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-800">
          <p className="text-center text-gray-400">
            © {currentYear} WebTools. {t('rights')}
          </p>
        </div>
      </div>
    </footer>
  );
}