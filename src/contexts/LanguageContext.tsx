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
        dashboard: {
          title: 'Dashboard',
          description: 'Manage your shortened URLs and temporary email addresses',
          stats: {
            activeUrls: 'Active URLs',
            totalClicks: 'Total Clicks',
            activeEmails: 'Active Emails',
            totalMessages: 'Total Messages'
          },
          shortUrls: {
            title: 'Short URLs',
            createNew: 'Create New',
            originalUrl: 'Original URL',
            shortUrl: 'Short URL',
            clicks: 'Clicks',
            created: 'Created',
            actions: 'Actions'
          },
          tempEmails: {
            title: 'Temporary Emails',
            createNew: 'Create New',
            emailAddress: 'Email Address',
            messages: 'Messages',
            expires: 'Expires',
            actions: 'Actions'
          }
        },
        welcome: 'Welcome to WebTools',
        description: 'Your all-in-one solution for URL shortening and temporary email services.',
        home: {
          urlShortenerDesc: 'Transform long URLs into short, manageable links with advanced analytics.',
          tempMailDesc: 'Generate temporary email addresses for secure, disposable communication.'
        },
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
          mainDescription: 'Generate disposable email addresses for secure, anonymous communication',
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
          },
          features: {
            title: 'Features:',
            disposable: 'Create disposable email addresses instantly',
            secure: 'Secure and anonymous communication',
            autoDelete: 'Automatic deletion after expiry',
            noSignup: 'No signup required'
          }
        },
        urlShortenerPage: {
          title: 'URL Shortener',
          mainDescription: 'Transform long URLs into short, manageable links',
          enterUrl: 'Enter your long URL',
          shortenButton: 'Shorten URL',
          processing: 'Processing...',
          shortenedUrl: 'Shortened URL',
          copyToClipboard: 'Copy to clipboard',
          openLink: 'Open link',
          downloadQr: 'Download QR Code',
          error: 'Failed to shorten URL',
          copyError: 'Failed to copy URL',
          success: 'URL shortened successfully!',
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
          },
          footerText: 'Secure, fast, and reliable URL shortening service.',
          features: {
            title: 'Features:',
            qrCode: 'Generate customizable QR codes',
            analytics: 'Track click analytics',
            secure: 'Secure and reliable links',
            customize: 'Customize your short URLs'
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
          },
          sections: {
            cookies: {
              title: 'Cookies and Tracking',
              content: 'We use cookies to improve your experience and analyze website traffic.'
            },
            thirdParty: {
              title: 'Third-Party Services',
              content: 'We may use third-party services to process information.'
            },
            updates: {
              title: 'Policy Updates',
              content: 'We may update this policy from time to time.'
            }
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
          },
          sections: {
            account: {
              title: 'Account Terms',
              content: 'You are responsible for maintaining the security of your account.'
            },
            content: {
              title: 'Content Guidelines',
              content: 'You must not use our services to share illegal or harmful content.'
            },
            changes: {
              title: 'Service Changes',
              content: 'We reserve the right to modify or discontinue services at any time.'
            }
          }
        },
        footer: {
          description: 'WebTools - Your trusted companion for URL shortening and temporary email services.',
          followUs: 'Follow Us',
          contactUs: 'Contact Us'
        }
      }
    },
    zh: {
      translation: {
        urlShortener: '短链生成',
        tempMail: '临时邮箱',
        dashboard: {
          title: '控制台',
          description: '管理您的短链接和临时邮箱',
          stats: {
            activeUrls: '活跃链接',
            totalClicks: '总点击量',
            activeEmails: '活跃邮箱',
            totalMessages: '总消息数'
          },
          shortUrls: {
            title: '短链接',
            createNew: '新建链接',
            originalUrl: '原始链接',
            shortUrl: '短链接',
            clicks: '点击量',
            created: '创建时间',
            actions: '操作'
          },
          tempEmails: {
            title: '临时邮箱',
            createNew: '新建邮箱',
            emailAddress: '邮箱地址',
            messages: '消息数',
            expires: '过期时间',
            actions: '操作'
          }
        },
        welcome: '欢迎使用 WebTools',
        description: '为您提供短链接生成和临时邮箱服务的一站式解决方案。',
        home: {
          urlShortenerDesc: '将长网址转换为简短的链接，并进行高级分析。',
          tempMailDesc: '生成临时邮箱地址，用于安全、可丢弃的通信。'
        },
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
          mainDescription: '生成临时邮箱地址，保护您的隐私安全',
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
          },
          features: {
            title: '功能特点：',
            disposable: '即时创建一次性邮箱',
            secure: '安全匿名的通信方式',
            autoDelete: '到期自动删除',
            noSignup: '无需注册'
          }
        },
        urlShortenerPage: {
          title: '短链生成',
          mainDescription: '将长网址转换为简短的链接',
          enterUrl: '输入长网址',
          shortenButton: '生成短链',
          processing: '处理中...',
          shortenedUrl: '生成的短链接',
          copyToClipboard: '复制到剪贴板',
          openLink: '打开链接',
          downloadQr: '下载二维码',
          error: '生成短链接失败',
          copyError: '复制链接失败',
          success: '短链接生成成功！',
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
          },
          footerText: '安全、快速、可靠的短链接服务。',
          features: {
            title: '功能特点：',
            qrCode: '生成自定义二维码',
            analytics: '追踪点击分析',
            secure: '安全可靠的链接',
            customize: '自定义短链接'
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
          },
          sections: {
            cookies: {
              title: 'Cookie 和跟踪',
              content: '我们使用 Cookie 来改善您的体验并分析网站流量。'
            },
            thirdParty: {
              title: '第三方服务',
              content: '我们可能使用第三方服务来处理信息。'
            },
            updates: {
              title: '政策更新',
              content: '我们可能会不时更新此政策。'
            }
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
          },
          sections: {
            account: {
              title: '账户条款',
              content: '您有责任维护账户的安全。'
            },
            content: {
              title: '内容准则',
              content: '您不得使用我们的服务分享非法或有害内容。'
            },
            changes: {
              title: '服务变更',
              content: '我们保留随时修改或终止服务的权利。'
            }
          }
        },
        footer: {
          description: 'WebTools - 您值得信赖的短链接和临时邮箱服务伙伴。',
          followUs: '关注我们',
          contactUs: '联系我们'
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