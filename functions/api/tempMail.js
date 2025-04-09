/**
 * Cloudflare Pages API 路由 - 临时邮箱域名查询
 * /api/tempMail/domains
 * 用于获取可用的临时邮箱域名列表
 */
export async function onRequest(context) {
  // 获取环境变量
  const { env } = context;
  
  // 从环境变量中获取临时邮箱域名配置
  const emailDomainsString = env.VITE_TEMP_EMAIL_DOMAINS || 'tempmail.io,mailtemp.org,10minutemail.com';
  
  // 分割域名字符串为数组
  const emailDomains = emailDomainsString.split(',').map(domain => domain.trim());
  
  console.log(`获取临时邮箱域名列表: ${emailDomains.join(', ')}`);
  
  // 返回域名列表
  return new Response(JSON.stringify({ 
    domains: emailDomains 
  }), {
    headers: { 'Content-Type': 'application/json' }
  });
} 