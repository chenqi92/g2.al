/**
 * Cloudflare Pages 路径捕获函数
 * 处理所有不匹配其他路由的请求，检查是否是短链接
 */
export async function onRequest(context) {
  try {
    // 获取请求上下文和环境
    const { request, env, params } = context;
    
    // 检查环境变量和KV绑定
    if (!env.URL_SHORTENER) {
      console.error("KV绑定错误: URL_SHORTENER未定义");
      return new Response("Server configuration error: KV binding missing", { 
        status: 500,
        headers: { 'Content-Type': 'text/plain' }
      });
    }
    
    const URL_SHORTENER = env.URL_SHORTENER;
    
    // 从环境变量中获取域名配置
    const SHORT_DOMAIN = env.VITE_SHORT_URL_DOMAIN || 'g2.al';
    
    // 分析请求信息
    const url = new URL(request.url);
    const { pathname, hostname } = url;
    const path = params.path;
    
    console.log(`处理路径捕获请求: ${pathname}`);
    console.log(`捕获的路径: ${path}`);
    console.log(`环境变量: SHORT_DOMAIN=${SHORT_DOMAIN}`);
    
    // 检查是否是短链接请求
    // 确保路径不为空且不是预留的路由路径
    const reservedPaths = ['url-shortener', 'temp-mail', 'dashboard', 'privacy', 'terms'];
    
    if (path && !path.includes('/') && !reservedPaths.includes(path) && 
        !path.includes('.') && path.length > 0) {
      console.log(`识别为短链接请求: ${path}`);
      return handleShortUrl(path, URL_SHORTENER);
    }
    
    // 如果是静态资源请求，让它继续
    if (pathname.includes('.') || pathname.startsWith('/assets/')) {
      console.log(`静态资源请求: ${pathname}`);
      return context.next();
    }
    
    // 对于SPA路由，确保返回index.html
    if (reservedPaths.some(p => pathname.startsWith(`/${p}`))) {
      console.log(`SPA路由请求: ${pathname}`);
      // 确保返回index.html以支持客户端路由
      return context.next();
    }
    
    // 让 Cloudflare Pages 继续处理请求
    console.log(`继续正常流程: ${pathname}`);
    return context.next();
  } catch (error) {
    console.error(`路径处理器错误: ${error.message}`);
    return new Response(`Server Error: ${error.message}`, { 
      status: 500,
      headers: { 'Content-Type': 'text/plain' }
    });
  }
}

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