/**
 * Cloudflare Worker for URL shortener service
 * 
 * This worker handles requests to shortened URLs and redirects
 * to the original URL stored in Cloudflare KV.
 * 
 * Deploy this script to Cloudflare Workers with access to your KV namespace
 */

// 获取 KV 命名空间
const URL_SHORTENER = env.URL_SHORTENER;

// 域名配置
const SHORT_DOMAIN = 'g2.al';

/**
 * 处理请求的主函数
 */
async function handleRequest(request) {
  const url = new URL(request.url);
  const { pathname, hostname } = url;

  // 检查是否是短链接请求
  if (hostname === SHORT_DOMAIN && pathname.length > 1) {
    return handleShortUrl(pathname.substring(1));
  }

  // 对于 API 端点
  if (pathname.startsWith('/api/')) {
    return handleApiRequest(request, pathname);
  }

  // 否则返回 404
  return new Response('Not Found', { status: 404 });
}

/**
 * 处理短链接重定向
 */
async function handleShortUrl(shortCode) {
  try {
    // 从 KV 中查找原始 URL
    const originalUrl = await URL_SHORTENER.get(shortCode);

    if (!originalUrl) {
      return new Response('Short URL not found', {
        status: 404,
        headers: {
          'Content-Type': 'text/plain'
        }
      });
    }

    // 增加点击计数
    incrementClickCount(shortCode).catch(error => {
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
async function incrementClickCount(shortCode) {
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
  } catch (error) {
    console.error('Error incrementing click count:', error);
  }
}

/**
 * 处理 API 请求
 */
async function handleApiRequest(request, pathname) {
  // 目前只处理检查短链接是否存在的 GET 请求
  if (pathname === '/api/url' && request.method === 'GET') {
    const url = new URL(request.url);
    const code = url.searchParams.get('code');

    if (!code) {
      return new Response(JSON.stringify({ error: 'Missing code parameter' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const originalUrl = await URL_SHORTENER.get(code);
    return new Response(JSON.stringify({ 
      exists: !!originalUrl,
      url: originalUrl 
    }), {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  return new Response('Not Found', { status: 404 });
}

// 导出事件监听器
export default {
  fetch: handleRequest
}; 