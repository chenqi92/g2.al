#!/usr/bin/env node

/**
 * Cloudflare Worker 部署脚本 - 统一版本 (ES 模块语法)
 * 
 * 此脚本会自动检测部署环境并使用相应的配置：
 * - 在Cloudflare Pages环境中：不配置KV命名空间（使用已绑定的KV）
 * - 在本地/VPS环境中：使用环境变量中的KV命名空间ID
 * 
 * 使用方法:
 * node deploy-cf-worker.mjs
 */

// 使用ES模块导入
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// 获取当前文件的目录路径
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 检测当前环境是否为Cloudflare Pages
const isCloudflarePages = process.env.CF_PAGES === '1';
console.log(`检测到运行环境: ${isCloudflarePages ? 'Cloudflare Pages' : '本地/VPS'}`);

// 从环境变量中读取配置
const kvNamespaceId = process.env.VITE_CLOUDFLARE_KV_NAMESPACE_ID;
const domain = process.env.VITE_SHORT_URL_DOMAIN || 'g2.al';

if (!isCloudflarePages && !kvNamespaceId) {
  console.log('警告: 在本地/VPS环境中未找到 VITE_CLOUDFLARE_KV_NAMESPACE_ID 环境变量');
  console.log('这可能导致部署失败，请确保设置了此环境变量');
}

console.log(`使用域名: ${domain}`);
if (!isCloudflarePages) {
  console.log(`使用 KV 命名空间 ID: ${kvNamespaceId || '未设置'}`);
}

// 根据环境创建不同的wrangler.toml内容
let wranglerContent;

if (isCloudflarePages) {
  // Cloudflare Pages环境 - 不包含KV命名空间配置
  wranglerContent = `name = "g2"
main = "cloudflare-worker.js" 
compatibility_date = "2025-04-07"

# 在Cloudflare Pages中，KV命名空间已手动绑定，无需在此配置

# 路由配置
routes = [
  { pattern = "${domain}/*", zone_name = "${domain}" }
]

# 环境变量配置
[vars]
VITE_SHORT_URL_DOMAIN = "${domain}"
`;
} else {
  // 本地/VPS环境 - 包含KV命名空间配置
  wranglerContent = `name = "g2"
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
}

// 写入 wrangler.toml 文件
const wranglerPath = path.join(__dirname, 'wrangler.toml');
fs.writeFileSync(wranglerPath, wranglerContent);

console.log('已创建 wrangler.toml 文件');
if (isCloudflarePages) {
  console.log('在Cloudflare Pages环境中运行，已移除KV命名空间配置（使用已绑定的KV）');
}

// 部署 Worker
try {
  console.log('开始部署 Cloudflare Worker...');
  execSync('npx wrangler deploy', { stdio: 'inherit' });
  console.log('Worker 部署成功!');
} catch (error) {
  console.error('部署失败:', error.message);
  process.exit(1);
} 