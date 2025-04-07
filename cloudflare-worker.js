/**
 * Cloudflare Worker for URL shortener service
 * 
 * This worker handles requests to shortened URLs and redirects
 * to the original URL stored in Cloudflare KV.
 * 
 * Deploy this script to Cloudflare Workers with access to your KV namespace
 */

// Name of your KV Namespace
const KV_NAMESPACE = 'URL_SHORTENER';

// Domain for short URLs (should match your app config)
const SHORT_DOMAIN = 'g2.al';

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request));
});

/**
 * Main request handler
 */
async function handleRequest(request) {
  const url = new URL(request.url);
  const { pathname, hostname } = url;

  // Check if this is a short URL request
  if (hostname === SHORT_DOMAIN && pathname.length > 1) {
    return handleShortUrl(pathname.substring(1));
  }

  // For API endpoints
  if (pathname.startsWith('/api/')) {
    return handleApiRequest(request, pathname);
  }

  // Otherwise pass through to your main application or return 404
  return new Response('Not Found', { status: 404 });
}

/**
 * Handle short URL redirect
 */
async function handleShortUrl(shortCode) {
  try {
    // Look up the original URL in KV
    const originalUrl = await URL_SHORTENER.get(shortCode);

    if (!originalUrl) {
      return new Response('Short URL not found', {
        status: 404,
        headers: {
          'Content-Type': 'text/plain'
        }
      });
    }

    // Increment click count in metadata
    incrementClickCount(shortCode).catch(error => {
      console.error('Error updating click count:', error);
    });

    // Redirect to the original URL
    return Response.redirect(originalUrl, 302);
  } catch (error) {
    console.error('Error processing short URL:', error);
    return new Response('Server Error', { status: 500 });
  }
}

/**
 * Increment click count in metadata
 */
async function incrementClickCount(shortCode) {
  try {
    // Fetch the current metadata
    const metadata = await URL_SHORTENER.getWithMetadata(shortCode);
    if (!metadata || !metadata.value) return;

    // Update click count
    const newMetadata = metadata.metadata || {};
    newMetadata.clickCount = (newMetadata.clickCount || 0) + 1;

    // Store updated metadata
    await URL_SHORTENER.put(shortCode, metadata.value, {
      metadata: newMetadata
    });
  } catch (error) {
    console.error('Error incrementing click count:', error);
  }
}

/**
 * Handle API requests
 */
async function handleApiRequest(request, pathname) {
  // For now, only handle GET requests to check if a short URL exists
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