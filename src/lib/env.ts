/**
 * 环境变量服务
 * 提供类型安全的环境变量访问，包括默认值
 */

// 环境变量
interface EnvVars {
  CLOUDFLARE_ACCOUNT_ID: string;
  CLOUDFLARE_API_TOKEN: string;
  CLOUDFLARE_KV_NAMESPACE_ID: string;
  SHORT_URL_DOMAIN: string;
  TEMP_EMAIL_DOMAINS: string[];
}

// 默认值
const defaults: EnvVars = {
  CLOUDFLARE_ACCOUNT_ID: '',
  CLOUDFLARE_API_TOKEN: '',
  CLOUDFLARE_KV_NAMESPACE_ID: '',
  SHORT_URL_DOMAIN: 'g2.al',
  TEMP_EMAIL_DOMAINS: ['tempmail.io', 'mailtemp.org', '10minutemail.com', 'throwawaymail.net', 'disposable.cc'],
};

/**
 * 检查环境变量是否存在
 */
function checkEnvVar(name: string): boolean {
  try {
    // 动态访问import.meta.env
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return !!(import.meta.env as any)[name];
  } catch (e) {
    console.warn(`访问环境变量${name}时出错:`, e);
    return false;
  }
}

/**
 * 安全获取环境变量值
 */
function safeGetEnvVar(name: string, defaultValue: string = ''): string {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const value = (import.meta.env as any)[name];
    return value || defaultValue;
  } catch (e) {
    console.warn(`获取环境变量${name}时出错:`, e);
    return defaultValue;
  }
}

/**
 * 获取环境变量
 */
export function getEnv(): EnvVars {
  // 向控制台输出所有环境变量的状态，方便调试
  console.log('环境变量状态:',
    {
      VITE_CLOUDFLARE_ACCOUNT_ID: checkEnvVar('VITE_CLOUDFLARE_ACCOUNT_ID'),
      VITE_CLOUDFLARE_API_TOKEN: checkEnvVar('VITE_CLOUDFLARE_API_TOKEN'),
      VITE_CLOUDFLARE_KV_NAMESPACE_ID: checkEnvVar('VITE_CLOUDFLARE_KV_NAMESPACE_ID'),
      VITE_SHORT_URL_DOMAIN: checkEnvVar('VITE_SHORT_URL_DOMAIN')
    }
  );

  return {
    CLOUDFLARE_ACCOUNT_ID: safeGetEnvVar('VITE_CLOUDFLARE_ACCOUNT_ID', defaults.CLOUDFLARE_ACCOUNT_ID),
    CLOUDFLARE_API_TOKEN: safeGetEnvVar('VITE_CLOUDFLARE_API_TOKEN', defaults.CLOUDFLARE_API_TOKEN),
    CLOUDFLARE_KV_NAMESPACE_ID: safeGetEnvVar('VITE_CLOUDFLARE_KV_NAMESPACE_ID', defaults.CLOUDFLARE_KV_NAMESPACE_ID),
    SHORT_URL_DOMAIN: safeGetEnvVar('VITE_SHORT_URL_DOMAIN', defaults.SHORT_URL_DOMAIN),
    TEMP_EMAIL_DOMAINS: parseEmailDomains(safeGetEnvVar('VITE_TEMP_EMAIL_DOMAINS')),
  };
}

/**
 * 解析邮箱域名字符串为数组
 */
function parseEmailDomains(emailDomainsString?: string): string[] {
  if (!emailDomainsString) {
    return defaults.TEMP_EMAIL_DOMAINS;
  }
  
  try {
    return emailDomainsString.split(',').map(domain => domain.trim());
  } catch (error) {
    console.error('解析邮箱域名失败:', error);
    return defaults.TEMP_EMAIL_DOMAINS;
  }
}

// 导出单例实例
export const env = getEnv(); 