#!/usr/bin/env node

/**
 * Cloudflare Worker 部署修复脚本 (ES Module 版本)
 * 
 * 使用方法:
 * node fix-deploy.mjs <KV_NAMESPACE_ID> <DOMAIN>
 * 
 * 例如:
 * node fix-deploy.mjs abc123def456 example.com
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// 获取当前目录路径
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 从环境变量获取参数，如果未提供则使用命令行参数
const kvNamespaceId = process.env.VITE_CLOUDFLARE_KV_NAMESPACE_ID || process.argv[2];
const domain = process.env.VITE_SHORT_URL_DOMAIN || process.argv[3];

if (!kvNamespaceId || !domain) {
  console.error('错误: 缺少必要的参数');
  console.error('请确保以下环境变量已设置:');
  console.error('- VITE_CLOUDFLARE_KV_NAMESPACE_ID');
  console.error('- VITE_SHORT_URL_DOMAIN');
  console.error('或者使用命令行参数:');
  console.error('node fix-deploy.mjs <KV_NAMESPACE_ID> <DOMAIN>');
  console.error('例如: node fix-deploy.mjs abc123def456 example.com');
  process.exit(1);
}

console.log(`使用 KV 命名空间 ID: ${kvNamespaceId}`);
console.log(`使用域名: ${domain}`);

// 创建新的 wrangler.toml 文件
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

// 写入更新后的配置文件
const wranglerPath = path.join(__dirname, 'wrangler.toml');
fs.writeFileSync(wranglerPath, wranglerContent);

console.log('已创建新的 wrangler.toml 文件内容:');
console.log(wranglerContent);

// 部署 Worker
try {
  console.log('开始部署 Cloudflare Worker...');
  execSync('npx wrangler deploy', { stdio: 'inherit' });
  console.log('Worker 部署成功!');
} catch (error) {
  console.error('部署失败:', error.message);
  process.exit(1);
} 