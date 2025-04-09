/**
 * Cloudflare KV API client for managing short URLs
 */
import { env } from './env';

// Cloudflare API endpoint
const CF_API_URL = 'https://api.cloudflare.com/client/v4';

// 使用env对象获取Cloudflare账户详细信息
const CF_ACCOUNT_ID = env.CLOUDFLARE_ACCOUNT_ID;
const CF_API_TOKEN = env.CLOUDFLARE_API_TOKEN;
const CF_KV_NAMESPACE_ID = env.CLOUDFLARE_KV_NAMESPACE_ID;

// 验证配置是否有效
const isConfigValid = () => {
  if (!CF_ACCOUNT_ID || !CF_API_TOKEN || !CF_KV_NAMESPACE_ID) {
    console.error('Cloudflare API配置无效，请检查环境变量');
    return false;
  }
  return true;
};

// Headers for Cloudflare API requests
const getHeaders = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${CF_API_TOKEN}`
});

/**
 * Stores a URL mapping in Cloudflare KV
 * @param shortCode - The short code (key)
 * @param originalUrl - The original URL (value)
 * @param expirationTtl - Optional TTL in seconds (86400 = 1 day)
 * @returns Promise with the result
 */
export const storeUrl = async (
  shortCode: string, 
  originalUrl: string, 
  expirationTtl: number = 365 * 86400 // Default to 1 year
): Promise<{ success: boolean; error?: string }> => {
  if (!isConfigValid()) {
    return { 
      success: false, 
      error: '缺少必要的Cloudflare API配置。请检查环境变量设置。' 
    };
  }

  try {
    const response = await fetch(
      `${CF_API_URL}/accounts/${CF_ACCOUNT_ID}/storage/kv/namespaces/${CF_KV_NAMESPACE_ID}/values/${shortCode}`,
      {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify({
          value: originalUrl,
          metadata: {
            createdAt: new Date().toISOString(),
            clickCount: 0
          },
          expiration_ttl: expirationTtl
        })
      }
    );

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.errors?.[0]?.message || 'Failed to store URL');
    }
    
    return { success: true };
  } catch (error) {
    console.error('Error storing URL in Cloudflare KV:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error storing URL' 
    };
  }
};

/**
 * Retrieves a URL mapping from Cloudflare KV
 * @param shortCode - The short code to look up
 * @returns Promise with the original URL or null if not found
 */
export const getUrl = async (shortCode: string): Promise<string | null> => {
  if (!isConfigValid()) {
    console.error('Cloudflare API配置无效，无法获取URL');
    return null;
  }

  try {
    const response = await fetch(
      `${CF_API_URL}/accounts/${CF_ACCOUNT_ID}/storage/kv/namespaces/${CF_KV_NAMESPACE_ID}/values/${shortCode}`,
      {
        method: 'GET',
        headers: getHeaders()
      }
    );

    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error(`Failed to retrieve URL: ${response.statusText}`);
    }

    const data = await response.json();
    return data.value;
  } catch (error) {
    console.error('Error retrieving URL from Cloudflare KV:', error);
    return null;
  }
};

/**
 * Increments the click count for a given short URL
 * @param shortCode - The short code
 * @returns Promise indicating success
 */
export const incrementClickCount = async (shortCode: string): Promise<boolean> => {
  if (!isConfigValid()) {
    console.error('Cloudflare API配置无效，无法更新点击计数');
    return false;
  }

  try {
    // First get the current value and metadata
    const response = await fetch(
      `${CF_API_URL}/accounts/${CF_ACCOUNT_ID}/storage/kv/namespaces/${CF_KV_NAMESPACE_ID}/values/${shortCode}?metadata=true`,
      {
        method: 'GET',
        headers: getHeaders()
      }
    );

    if (!response.ok) {
      return false;
    }

    const data = await response.json();
    const originalUrl = data.value;
    const metadata = data.metadata || { clickCount: 0 };
    
    // Update the click count
    metadata.clickCount = (metadata.clickCount || 0) + 1;
    
    // Store the updated value
    await fetch(
      `${CF_API_URL}/accounts/${CF_ACCOUNT_ID}/storage/kv/namespaces/${CF_KV_NAMESPACE_ID}/values/${shortCode}`,
      {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify({
          value: originalUrl,
          metadata
        })
      }
    );
    
    return true;
  } catch (error) {
    console.error('Error incrementing click count:', error);
    return false;
  }
};

/**
 * Gets user statistics for short URLs
 * @returns Promise with statistics
 */
export const getStats = async (): Promise<{ totalUrls: number; totalClicks: number }> => {
  if (!isConfigValid()) {
    console.error('Cloudflare API配置无效，无法获取统计信息');
    return { totalUrls: 0, totalClicks: 0 };
  }

  try {
    // List all keys in the KV namespace
    const response = await fetch(
      `${CF_API_URL}/accounts/${CF_ACCOUNT_ID}/storage/kv/namespaces/${CF_KV_NAMESPACE_ID}/keys`,
      {
        method: 'GET',
        headers: getHeaders()
      }
    );

    if (!response.ok) {
      throw new Error('Failed to get keys');
    }

    const data = await response.json();
    const keys = data.result || [];
    
    let totalClicks = 0;
    
    // Get metadata for each key to sum up click counts
    for (const key of keys) {
      const metaResponse = await fetch(
        `${CF_API_URL}/accounts/${CF_ACCOUNT_ID}/storage/kv/namespaces/${CF_KV_NAMESPACE_ID}/metadata/${key.name}`,
        {
          method: 'GET',
          headers: getHeaders()
        }
      );
      
      if (metaResponse.ok) {
        const metaData = await metaResponse.json();
        totalClicks += metaData.clickCount || 0;
      }
    }
    
    return {
      totalUrls: keys.length,
      totalClicks
    };
  } catch (error) {
    console.error('Error getting stats:', error);
    return {
      totalUrls: 0,
      totalClicks: 0
    };
  }
};

/**
 * Deletes a URL mapping
 * @param shortCode - The short code to delete
 * @returns Promise indicating success
 */
export const deleteUrl = async (shortCode: string): Promise<boolean> => {
  if (!isConfigValid()) {
    console.error('Cloudflare API配置无效，无法删除URL');
    return false;
  }

  try {
    const response = await fetch(
      `${CF_API_URL}/accounts/${CF_ACCOUNT_ID}/storage/kv/namespaces/${CF_KV_NAMESPACE_ID}/values/${shortCode}`,
      {
        method: 'DELETE',
        headers: getHeaders()
      }
    );
    
    return response.ok;
  } catch (error) {
    console.error('Error deleting URL:', error);
    return false;
  }
}; 