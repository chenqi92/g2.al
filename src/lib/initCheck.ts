/**
 * 应用程序初始化检查
 * 在加载时运行一系列检查以确保应用能正确运行
 */

import { env } from './env';

const REQUIRED_ENV_VARS = [
  'VITE_CLOUDFLARE_ACCOUNT_ID',
  'VITE_CLOUDFLARE_API_TOKEN',
  'VITE_CLOUDFLARE_KV_NAMESPACE_ID',
  'VITE_SHORT_URL_DOMAIN'
];

/**
 * 检查环境变量是否存在
 * @returns {string[]} 缺失的环境变量列表
 */
function checkRequiredEnvVars(): string[] {
  const missing: string[] = [];
  
  REQUIRED_ENV_VARS.forEach(varName => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if (!(import.meta.env as any)[varName]) {
        missing.push(varName);
      }
    } catch (e) {
      console.warn(`检查环境变量 ${varName} 时出错:`, e);
      missing.push(varName);
    }
  });
  
  return missing;
}

/**
 * 运行所有初始化检查
 */
export function runInitChecks(): void {
  console.log('运行应用初始化检查...');
  
  // 检查环境变量
  const missingVars = checkRequiredEnvVars();
  if (missingVars.length > 0) {
    console.warn(`环境变量缺失: ${missingVars.join(', ')}`);
    console.log('将使用默认值代替，某些功能可能无法正常工作');
    
    if (missingVars.includes('VITE_CLOUDFLARE_ACCOUNT_ID') || 
        missingVars.includes('VITE_CLOUDFLARE_API_TOKEN') ||
        missingVars.includes('VITE_CLOUDFLARE_KV_NAMESPACE_ID')) {
      console.warn('缺少关键的Cloudflare API凭据，API相关功能将不可用');
      console.log('请在.env文件中添加这些环境变量或在Cloudflare Pages控制面板中配置');
    }
  } else {
    console.log('所有必需的环境变量都已设置');
  }
  
  // 检查环境变量的有效性
  if (env.VITE_CLOUDFLARE_ACCOUNT_ID === '') {
    console.warn('VITE_CLOUDFLARE_ACCOUNT_ID 未设置或为空');
  }
  
  if (env.VITE_CLOUDFLARE_API_TOKEN === '') {
    console.warn('VITE_CLOUDFLARE_API_TOKEN 未设置或为空');
  }
  
  if (env.VITE_CLOUDFLARE_KV_NAMESPACE_ID === '') {
    console.warn('VITE_CLOUDFLARE_KV_NAMESPACE_ID 未设置或为空');
  }
  
  // 检查临时邮箱域名配置
  if (env.VITE_TEMP_EMAIL_DOMAINS.length === 0) {
    console.warn('未配置临时邮箱域名，将使用默认值');
  } else {
    console.log(`已配置 ${env.VITE_TEMP_EMAIL_DOMAINS.length} 个临时邮箱域名`);
  }
  
  // 检查短链接域名配置
  if (!env.VITE_SHORT_URL_DOMAIN) {
    console.warn('未配置短链接域名，将使用默认值 g2.al');
  } else {
    console.log(`使用短链接域名: ${env.VITE_SHORT_URL_DOMAIN}`);
  }
  
  console.log('初始化检查完成');
} 