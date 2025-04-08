#!/usr/bin/env node

/**
 * Cloudflare Worker 部署脚本 - 统一版本
 * 
 * 此脚本会自动从Cloudflare环境变量中读取配置并部署Worker
 * 无需传递参数或修改脚本
 * 
 * 使用方法:
 * node deploy-cf-worker.js
 */

// 使用 require 以兼容所有环境
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// 从环境变量中读取配置
const kvNamespaceId = process.env.VITE_CLOUDFLARE_KV_NAMESPACE_ID;
const domain = process.env.VITE_SHORT_URL_DOMAIN || 'g2.al';

if (!kvNamespaceId) {
  console.log('警告: 未找到 VITE_CLOUDFLARE_KV_NAMESPACE_ID 环境变量');
  console.log('将使用 Cloudflare Pages 环境变量');
}

console.log(`使用 KV 命名空间 ID: ${kvNamespaceId || '从Cloudflare环境读取'}`);
console.log(`使用域名: ${domain}`);

// 创建 wrangler.toml 文件
const wranglerContent = `name = "g2"
main = "cloudflare-worker.js" 
compatibility_date = "2025-04-07"

# KV 命名空间绑定
kv_namespaces = [
  { binding = "URL_SHORTENER", id = "${kvNamespaceId}" }
]

# 路由配置
routes = [
  { pattern = "${domain}/*", zone_name = "${domain}" }
]

# 环境变量配置
[vars]
VITE_SHORT_URL_DOMAIN = "${domain}"
`;

// 写入 wrangler.toml 文件
const wranglerPath = path.join(__dirname, 'wrangler.toml');
fs.writeFileSync(wranglerPath, wranglerContent);

console.log('已创建 wrangler.toml 文件');

// 部署 Worker
try {
  console.log('开始部署 Cloudflare Worker...');
  execSync('npx wrangler deploy', { stdio: 'inherit' });
  console.log('Worker 部署成功!');
} catch (error) {
  console.error('部署失败:', error.message);
  process.exit(1);
} 