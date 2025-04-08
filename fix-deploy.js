#!/usr/bin/env node

/**
 * Cloudflare Worker 部署修复脚本
 * 
 * 使用方法:
 * node fix-deploy.js <KV_NAMESPACE_ID> <DOMAIN>
 * 
 * 例如:
 * node fix-deploy.js abc123def456 example.com
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// 获取命令行参数
const kvNamespaceId = process.argv[2];
const domain = process.argv[3];

if (!kvNamespaceId || !domain) {
  console.error('错误: 缺少必要的参数');
  console.error('使用方法: node fix-deploy.js <KV_NAMESPACE_ID> <DOMAIN>');
  console.error('例如: node fix-deploy.js abc123def456 example.com');
  process.exit(1);
}

console.log(`使用 KV 命名空间 ID: ${kvNamespaceId}`);
console.log(`使用域名: ${domain}`);

// 创建新的 wrangler.toml 文件
const wranglerContent = `name = "url-shortener"
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