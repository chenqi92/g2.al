/**
 * Cloudflare Pages API 路由 - URL 查询
 * /api/url?code=短码
 * 用于检查短链接是否存在并返回其信息
 */
export async function onRequest(context) {
  // 获取 KV 命名空间
  const { env, request } = context;
  const URL_SHORTENER = env.URL_SHORTENER;
  
  // 解析查询参数
  const url = new URL(request.url);
  const code = url.searchParams.get('code');

  if (!code) {
    console.log('API请求缺少code参数');
    return new Response(JSON.stringify({ error: 'Missing code parameter' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  console.log(`API请求检查短链接: ${code}`);
  try {
    const originalUrl = await URL_SHORTENER.get(code);
    console.log(`短链接存在: ${!!originalUrl}, URL: ${originalUrl || 'N/A'}`);
    
    return new Response(JSON.stringify({ 
      exists: !!originalUrl,
      url: originalUrl 
    }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('查询短链接时出错:', error);
    return new Response(JSON.stringify({ 
      error: 'Error checking URL'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
} 