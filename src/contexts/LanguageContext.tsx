import React, { createContext, useContext, useState, useEffect } from 'react';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Initialize i18n
i18n.use(initReactI18next).init({
  resources: {
    en: {
      translation: {
        urlShortener: 'URL Shortener',
        tempMail: 'Temp Mail',
        dashboard: 'Dashboard',
        welcome: 'Welcome to WebTools',
        description: 'Your all-in-one solution for URL shortening and temporary email services.',
        auth: {
          signIn: 'Sign In',
          signUp: 'Sign Up',
          signOut: 'Sign Out',
          email: 'Email',
          password: 'Password',
          loading: 'Loading...',
          error: 'Authentication failed',
          signInSuccess: 'Successfully signed in',
          signUpSuccess: 'Successfully signed up',
          haveAccount: 'Already have an account? Sign in',
          needAccount: 'Need an account? Sign up',
          continueWithGithub: 'Continue with GitHub',
          continueWithGoogle: 'Continue with Google',
          chooseProvider: 'Choose a login method'
        },
        about: {
          title: 'About WebTools',
          description: 'WebTools provides secure and efficient URL shortening and temporary email services for your digital needs.'
        },
        quickLinks: 'Quick Links',
        legal: 'Legal',
        privacy: 'Privacy Policy',
        terms: 'Terms of Service',
        rights: 'All rights reserved.',
        tempMailPage: {
          title: 'Temporary Email',
          description: 'Generate disposable email addresses for secure, anonymous communication',
          yourAddress: 'Your Temporary Email Address',
          newAddress: 'New Address',
          refresh: 'Refresh',
          copyAddress: 'Copy email address',
          inbox: 'Inbox',
          noMessages: 'No messages yet',
          selectEmail: 'Select an email to view its contents',
          from: 'From',
          error: {
            generate: 'Failed to generate new email address',
            copy: 'Failed to copy email address',
            refresh: 'Failed to refresh inbox'
          }
        },
        urlShortenerPage: {
          title: 'URL Shortener',
          description: 'Transform long URLs into short, manageable links',
          enterUrl: 'Enter your long URL',
          shortenButton: 'Shorten URL',
          processing: 'Processing...',
          shortenedUrl: 'Shortened URL',
          copyToClipboard: 'Copy to clipboard',
          openLink: 'Open link',
          downloadQr: 'Download QR Code',
          error: 'Failed to shorten URL',
          copyError: 'Failed to copy URL',
          colorTemplates: 'Color Templates',
          shapeTemplates: 'Shape Templates',
          patternEffects: 'Pattern Effects',
          templates: {
            classic: 'Classic',
            modernBlue: 'Modern Blue',
            purple: 'Purple',
            neonGreen: 'Neon Green',
            sunset: 'Sunset',
            darkMode: 'Dark Mode'
          },
          shapes: {
            squares: 'Squares',
            dots: 'Dots',
            rounded: 'Rounded',
            star: 'Star'
          },
          patterns: {
            solid: 'Solid',
            gradient: 'Gradient',
            sketch: 'Sketch',
            watercolor: 'Watercolor'
          }
        },
        privacyPolicy: {
          lastUpdated: 'Last Updated: March 15, 2024',
          intro: 'This Privacy Policy describes how WebTools ("we," "us," or "our") collects, uses, and shares your personal information.',
          dataCollection: {
            title: 'Information We Collect',
            content: 'We collect information that you provide directly to us, including email addresses and URLs.'
          },
          dataUse: {
            title: 'How We Use Your Information',
            content: 'We use the information to provide and improve our services.'
          },
          dataSecurity: {
            title: 'Data Security',
            content: 'We implement appropriate measures to protect your information.'
          },
          userRights: {
            title: 'Your Rights',
            content: 'You have the right to access or delete your information.'
          }
        },
        termsOfService: {
          lastUpdated: 'Last Updated: March 15, 2024',
          intro: 'These Terms of Service govern your use of WebTools.',
          usage: {
            title: 'Acceptable Use',
            content: 'Use our services only for lawful purposes.'
          },
          restrictions: {
            title: 'Restrictions',
            content: 'Do not use our services for harmful activities.'
          },
          termination: {
            title: 'Termination',
            content: 'We may terminate service access at any time.'
          },
          liability: {
            title: 'Limitation of Liability',
            content: 'We are not liable for indirect damages.'
          }
        }
      }
    },
    zh: {
      translation: {
        urlShortener: '短链生成',
        tempMail: '临时邮箱',
        dashboard: '控制台',
        welcome: '欢迎使用 WebTools',
        description: '为您提供短链接生成和临时邮箱服务的一站式解决方案。',
        auth: {
          signIn: '登录',
          signUp: '注册',
          signOut: '退出',
          email: '邮箱',
          password: '密码',
          loading: '加载中...',
          error: '认证失败',
          signInSuccess: '登录成功',
          signUpSuccess: '注册成功',
          haveAccount: '已有账号？登录',
          needAccount: '需要账号？注册',
          continueWithGithub: '使用 GitHub 登录',
          continueWithGoogle: '使用 Google 登录',
          chooseProvider: '选择登录方式'
        },
        about: {
          title: '关于 WebTools',
          description: 'WebTools 为您的数字需求提供安全高效的短链接生成和临时邮箱服务。'
        },
        quickLinks: '快速链接',
        legal: '法律信息',
        privacy: '隐私政策',
        terms: '服务条款',
        rights: '保留所有权利。',
        tempMailPage: {
          title: '临时邮箱',
          description: '生成临时邮箱地址，保护您的隐私安全',
          yourAddress: '您的临时邮箱地址',
          newAddress: '新建邮箱',
          refresh: '刷新',
          copyAddress: '复制邮箱地址',
          inbox: '收件箱',
          noMessages: '暂无邮件',
          selectEmail: '选择邮件查看内容',
          from: '发件人',
          error: {
            generate: '生成新邮箱地址失败',
            copy: '复制邮箱地址失败',
            refresh: '刷新收件箱失败'
          }
        },
        urlShortenerPage: {
          title: '短链生成',
          description: '将长网址转换为简短的链接',
          enterUrl: '输入长网址',
          shortenButton: '生成短链',
          processing: '处理中...',
          shortenedUrl: '生成的短链接',
          copyToClipboard: '复制到剪贴板',
          openLink: '打开链接',
          downloadQr: '下载二维码',
          error: '生成短链接失败',
          copyError: '复制链接失败',
          colorTemplates: '颜色模板',
          shapeTemplates: '形状模板',
          patternEffects: '样式效果',
          templates: {
            classic: '经典黑白',
            modernBlue: '现代蓝',
            purple: '紫色',
            neonGreen: '霓虹绿',
            sunset: '日落橙',
            darkMode: '暗黑模式'
          },
          shapes: {
            squares: '方形',
            dots: '圆形',
            rounded: '圆角',
            star: '星形'
          },
          patterns: {
            solid: '纯色',
            gradient: '渐变',
            sketch: '手绘',
            watercolor: '水墨'
          }
        },
        privacyPolicy: {
          lastUpdated: '最后更新：2024年3月15日',
          intro: '本隐私政策描述了 WebTools（"我们"）如何收集、使用和共享您的个人信息。',
          dataCollection: {
            title: '我们收集的信息',
            content: '我们收集您直接提供的信息，包括电子邮件地址和网址。'
          },
          dataUse: {
            title: '信息使用方式',
            content: '我们使用收集的信息来提供和改进服务。'
          },
          dataSecurity: {
            title: '数据安全',
            content: '我们采取适当的措施保护您的信息。'
          },
          userRights: {
            title: '您的权利',
            content: '您有权访问或删除您的信息。'
          }
        },
        termsOfService: {
          lastUpdated: '最后更新：2024年3月15日',
          intro: '这些服务条款规定了您使用 WebTools 的条件。',
          usage: {
            title: '可接受的使用',
            content: '仅将我们的服务用于合法目的。'
          },
          restrictions: {
            title: '限制',
            content: '不得将我们的服务用于有害活动。'
          },
          termination: {
            title: '终止',
            content: '我们可能随时终止服务访问。'
          },
          liability: {
            title: '责任限制',
            content: '我们对间接损害不承担责任。'
          }
        }
      }
    }
  },
  lng: 'en',
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false
  }
});

type Language = 'en' | 'zh';

interface LanguageContextType {
  language: Language;
  toggleLanguage: () => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(() => {
    const savedLang = localStorage.getItem('language');
    return (savedLang as Language) || 'en';
  });

  useEffect(() => {
    localStorage.setItem('language', language);
    i18n.changeLanguage(language);
  }, [language]);

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'zh' : 'en');
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};