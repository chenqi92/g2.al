#!/usr/bin/env node

/**
 * Cloudflare Worker 部署脚本
 * 
 * 使用方法:
 * node deploy-pass-args.js
 * 
 * KV 命名空间 ID 和域名已在脚本中硬编码，无需传递参数
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// 获取当前目录路径
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ********************************************
// ************ 重要：修改这里 ****************
// ********************************************
// 硬编码的 KV 命名空间 ID 和域名
const KV_NAMESPACE_ID = "替换为您的KV命名空间ID"; // 例如: a1b2c3d4e5f6g7h8i9j0
const DOMAIN = "g2.al";
// ********************************************

console.log(`使用 KV 命名空间 ID: ${KV_NAMESPACE_ID}`);
console.log(`使用域名: ${DOMAIN}`);

// 创建 wrangler.toml 文件
const wranglerContent = `name = "g2"
main = "cloudflare-worker.js" 
compatibility_date = "2025-04-07"

# KV 命名空间绑定
kv_namespaces = [
  { binding = "URL_SHORTENER", id = "${KV_NAMESPACE_ID}" }
]

# 路由配置
routes = [
  { pattern = "${DOMAIN}/*", zone_name = "${DOMAIN}" }
]

# 环境变量配置
[vars]
VITE_SHORT_URL_DOMAIN = "${DOMAIN}"
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