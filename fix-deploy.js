#!/usr/bin/env node

/**
 * Cloudflare Worker 部署修复脚本 (Windows 兼容版本)
 * 
 * 使用方法：
 * node fix-deploy.js <KV命名空间ID> <域名>
 * 
 * 例如:
 * node fix-deploy.js a1b2c3d4e5f6g7h8i9j0 g2.al
 */

// 使用 require 而非 import 以兼容所有环境
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// 获取命令行参数
const args = process.argv.slice(2);
const kvNamespaceId = args[0];
const domain = args[1] || 'g2.al';

if (!kvNamespaceId) {
  console.error('错误: 请提供 KV 命名空间 ID');
  console.log('用法: node fix-deploy.js <KV命名空间ID> <域名>');
  console.log('例如: node fix-deploy.js a1b2c3d4e5f6g7h8i9j0 g2.al');
  process.exit(1);
}

console.log(`使用 KV 命名空间 ID: ${kvNamespaceId}`);
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

console.log('已创建 wrangler.toml 文件:');
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