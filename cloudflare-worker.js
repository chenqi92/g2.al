/**
 * Cloudflare Worker for URL shortener service
 * 
 * This worker handles requests to shortened URLs and redirects
 * to the original URL stored in Cloudflare KV.
 * 
 * Deploy this script to Cloudflare Workers with access to your KV namespace
 */

/**
 * 处理请求的主函数
 */
export default {
  async fetch(request, env, ctx) {
    // 获取 KV 命名空间
    const URL_SHORTENER = env.URL_SHORTENER;
    
    // 从环境变量中获取域名配置
    const SHORT_DOMAIN = env.VITE_SHORT_URL_DOMAIN || 'g2.al';
    
    // 分析请求信息
    const url = new URL(request.url);
    const { pathname, hostname, href } = url;
    
    // 调试信息
    console.log(`处理请求: ${href}`);
    console.log(`路径: ${pathname}, 主机名: ${hostname}`);
    console.log(`短链接域名配置: ${SHORT_DOMAIN}`);
    
    // 获取 Cloudflare Pages 域名
    // 这通常是 xxx.pages.dev 或自定义域名
    const PAGES_DOMAIN = env.PAGES_DOMAIN || 'g2-al.pages.dev';
    console.log(`Pages域名: ${PAGES_DOMAIN}`);
    
    // 检查是否是workers.dev请求
    const isWorkersDev = hostname.includes('workers.dev');
    if (isWorkersDev) {
      console.log('检测到workers.dev域名请求');
    }

    // 检查是否是网站根路径或静态资源
    if (pathname === '/' || pathname === '/index.html' || 
        pathname.startsWith('/assets/') || pathname.startsWith('/src/') || 
        pathname.includes('.js') || pathname.includes('.css') || 
        pathname.includes('.svg') || pathname.includes('.ico')) {
      console.log(`转发根路径或静态资源请求: ${pathname}`);
      
      // 创建转发到Cloudflare Pages的URL
      let pagesUrl = new URL(request.url);
      
      // 如果是workers.dev域名请求，则需要修改主机名为Pages域名
      if (isWorkersDev) {
        pagesUrl = new URL(`https://${PAGES_DOMAIN}${pathname}${url.search}`);
        console.log(`转发到Pages URL: ${pagesUrl.href}`);
      }
      
      // 将请求传递给Cloudflare Pages托管的前端
      return fetch(pagesUrl, {
        method: request.method,
        headers: request.headers,
        body: request.body
      });
    }

    // 检查是否是短链接请求
    // 对原始短链接域名或workers.dev域名都进行处理
    if ((hostname === SHORT_DOMAIN || isWorkersDev) && pathname.length > 1) {
      console.log(`处理短链接请求: ${pathname.substring(1)}`);
      return handleShortUrl(pathname.substring(1), URL_SHORTENER);
    }

    // 对于 API 端点
    if (pathname.startsWith('/api/')) {
      console.log(`处理API请求: ${pathname}`);
      return handleApiRequest(request, pathname, URL_SHORTENER);
    }

    // 其他路径（如 /url-shortener, /temp-mail 等前端路由）传递给Cloudflare Pages
    console.log(`转发前端路由请求: ${pathname}`);
    
    // 创建转发到Cloudflare Pages的URL
    let pagesUrl = new URL(request.url);
    
    // 如果是workers.dev域名请求，则需要修改主机名为Pages域名
    if (isWorkersDev) {
      pagesUrl = new URL(`https://${PAGES_DOMAIN}${pathname}${url.search}`);
      console.log(`转发到Pages URL: ${pagesUrl.href}`);
    }
    
    return fetch(pagesUrl, {
      method: request.method,
      headers: request.headers,
      body: request.body
    });
  }
};

/**
 * 处理短链接重定向
 */
async function handleShortUrl(shortCode, URL_SHORTENER) {
  try {
    console.log(`从KV查找短链接: ${shortCode}`);
    // 从 KV 中查找原始 URL
    const originalUrl = await URL_SHORTENER.get(shortCode);

    if (!originalUrl) {
      console.log(`短链接未找到: ${shortCode}`);
      return new Response('Short URL not found', {
        status: 404,
        headers: {
          'Content-Type': 'text/plain'
        }
      });
    }

    console.log(`找到短链接，重定向到: ${originalUrl}`);
    
    // 增加点击计数
    incrementClickCount(shortCode, URL_SHORTENER).catch(error => {
      console.error('Error updating click count:', error);
    });

    // 重定向到原始 URL
    return Response.redirect(originalUrl, 302);
  } catch (error) {
    console.error('Error processing short URL:', error);
    return new Response('Server Error', { status: 500 });
  }
}

/**
 * 增加点击计数
 */
async function incrementClickCount(shortCode, URL_SHORTENER) {
  try {
    // 获取当前元数据
    const metadata = await URL_SHORTENER.getWithMetadata(shortCode);
    if (!metadata || !metadata.value) return;

    // 更新点击计数
    const newMetadata = metadata.metadata || {};
    newMetadata.clickCount = (newMetadata.clickCount || 0) + 1;

    // 存储更新后的元数据
    await URL_SHORTENER.put(shortCode, metadata.value, {
      metadata: newMetadata
    });
    
    console.log(`更新点击计数成功: ${shortCode}, 新计数: ${newMetadata.clickCount}`);
  } catch (error) {
    console.error('Error incrementing click count:', error);
  }
}

/**
 * 处理 API 请求
 */
async function handleApiRequest(request, pathname, URL_SHORTENER) {
  // 目前只处理检查短链接是否存在的 GET 请求
  if (pathname === '/api/url' && request.method === 'GET') {
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
    const originalUrl = await URL_SHORTENER.get(code);
    console.log(`短链接存在: ${!!originalUrl}, URL: ${originalUrl || 'N/A'}`);
    
    return new Response(JSON.stringify({ 
      exists: !!originalUrl,
      url: originalUrl 
    }), {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  console.log(`未找到API端点: ${pathname}`);
  return new Response('API Not Found', { status: 404 });
} 