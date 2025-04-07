import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Link as LinkIcon, Mail, ArrowRight } from 'lucide-react';

const Home = () => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-3xl mx-auto"
      >
        <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-cyan-400 to-blue-500 text-transparent bg-clip-text">
          {t('welcome')}
        </h1>
        <p className="text-xl text-gray-300 mb-12">
          {t('description')}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
          <Link
            to="/url-shortener"
            className="group p-6 rounded-xl bg-gradient-to-br from-cyan-900/50 to-blue-900/50 border border-cyan-800/50 hover:border-cyan-400/50 transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-4">
              <LinkIcon className="w-8 h-8 text-cyan-400" />
              <ArrowRight className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" />
            </div>
            <h2 className="text-xl font-semibold mb-2">{t('urlShortener')}</h2>
            <p className="text-gray-400">Transform long URLs into short, manageable links with advanced analytics.</p>
          </Link>

          <Link
            to="/temp-mail"
            className="group p-6 rounded-xl bg-gradient-to-br from-cyan-900/50 to-blue-900/50 border border-cyan-800/50 hover:border-cyan-400/50 transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-4">
              <Mail className="w-8 h-8 text-cyan-400" />
              <ArrowRight className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" />
            </div>
            <h2 className="text-xl font-semibold mb-2">{t('tempMail')}</h2>
            <p className="text-gray-400">Generate temporary email addresses for secure, disposable communication.</p>
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default Home;