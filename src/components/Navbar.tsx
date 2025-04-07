import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Sun, Moon, Globe, Link as LinkIcon, Mail, User } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import AuthModal from './AuthModal';

const Navbar = () => {
  const { theme, toggleTheme } = useTheme();
  const { language, toggleLanguage } = useLanguage();
  const { t } = useTranslation();
  const { user, signOut } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  return (
    <>
      <nav className="backdrop-blur-md bg-black/30 border-b border-gray-700/50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center space-x-2 group">
              <div className="relative">
                <LinkIcon className="w-6 h-6 text-primary-400 group-hover:text-primary-300 transition-colors" />
                <div className="absolute inset-0 animate-pulse-slow bg-primary-400/20 rounded-full"></div>
              </div>
              <span className="font-bold text-xl bg-gradient-to-r from-primary-400 to-secondary-400 bg-clip-text text-transparent">
                WebTools
              </span>
            </Link>

            <div className="flex items-center space-x-8">
              <Link 
                to="/url-shortener" 
                className="flex items-center space-x-1 text-gray-300 hover:text-primary-400 transition-colors"
              >
                <LinkIcon className="w-4 h-4" />
                <span>{t('urlShortener')}</span>
              </Link>
              <Link 
                to="/temp-mail" 
                className="flex items-center space-x-1 text-gray-300 hover:text-primary-400 transition-colors"
              >
                <Mail className="w-4 h-4" />
                <span>{t('tempMail')}</span>
              </Link>
              {user && (
                <Link 
                  to="/dashboard" 
                  className="flex items-center space-x-1 text-gray-300 hover:text-primary-400 transition-colors"
                >
                  <User className="w-4 h-4" />
                  <span>{t('dashboard')}</span>
                </Link>
              )}
            </div>

            <div className="flex items-center space-x-4">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-full hover:bg-gray-700/50 transition-all duration-300 hover:scale-110"
                aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                {theme === 'dark' ? (
                  <Sun className="w-5 h-5 text-primary-400" />
                ) : (
                  <Moon className="w-5 h-5 text-primary-400" />
                )}
              </button>
              <button
                onClick={toggleLanguage}
                className="p-2 rounded-full hover:bg-gray-700/50 transition-all duration-300 hover:scale-110"
                aria-label={language === 'en' ? 'Switch to Chinese' : 'Switch to English'}
              >
                <Globe className="w-5 h-5 text-primary-400" />
              </button>
              {user ? (
                <div className="flex items-center space-x-4">
                  <span className="text-primary-400">
                    {user.user_metadata.user_name || user.email}
                  </span>
                  <button
                    onClick={() => signOut()}
                    className="px-4 py-2 rounded-lg border border-primary-400 text-primary-400 hover:bg-primary-400/10 transition-all duration-300"
                  >
                    {t('auth.signOut')}
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setIsAuthModalOpen(true)}
                  className="px-4 py-2 rounded-lg bg-gradient-to-r from-primary-500 to-secondary-500 text-white hover:from-primary-600 hover:to-secondary-600 transition-all duration-300 hover:scale-105"
                >
                  {t('auth.signIn')}
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </>
  );
};

export default Navbar;