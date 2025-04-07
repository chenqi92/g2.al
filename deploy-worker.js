#!/usr/bin/env node

/**
 * Cloudflare Worker 部署脚本
 * 
 * 使用方法:
 * node deploy-worker.js
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// 检查是否在 Cloudflare 构建环境中
const isCloudflareBuild = process.env.CF_PAGES === '1';

console.log(`当前构建环境: ${isCloudflareBuild ? 'Cloudflare Pages' : '本地/其他主机'}`);

// 检查环境变量
const requiredEnvVars = [
  'VITE_CLOUDFLARE_ACCOUNT_ID',
  'VITE_CLOUDFLARE_API_TOKEN',
  'VITE_CLOUDFLARE_KV_NAMESPACE_ID',
  'VITE_SHORT_URL_DOMAIN'
];

// 在 Cloudflare 构建环境中，使用 Cloudflare 的环境变量
if (isCloudflareBuild) {
  console.log('使用 Cloudflare 环境变量');
  
  // 检查 Cloudflare 环境变量
  const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName]);
  if (missingEnvVars.length > 0) {
    console.error('错误: 缺少以下 Cloudflare 环境变量:');
    missingEnvVars.forEach(varName => console.error(`- ${varName}`));
    console.error('\n请在 Cloudflare Pages 设置中配置这些变量。');
    process.exit(1);
  }
} else {
  // 在本地/其他主机构建环境中，使用 .env 文件
  console.log('使用 .env 文件中的环境变量');
  
  // 尝试加载 .env 文件
  try {
    if (fs.existsSync('.env')) {
      require('dotenv').config();
      console.log('已加载 .env 文件');
    } else {
      console.warn('警告: 未找到 .env 文件，将使用系统环境变量');
    }
  } catch (error) {
    console.warn('警告: 加载 .env 文件失败，将使用系统环境变量', error.message);
  }
  
  // 检查环境变量
  const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName]);
  if (missingEnvVars.length > 0) {
    console.error('错误: 缺少以下环境变量:');
    missingEnvVars.forEach(varName => console.error(`- ${varName}`));
    console.error('\n请确保在 .env 文件中设置了这些变量。');
    process.exit(1);
  }
}

// 更新 wrangler.toml 文件
const wranglerPath = path.join(__dirname, 'wrangler.toml');
let wranglerContent = fs.readFileSync(wranglerPath, 'utf8');

// 替换 KV 命名空间 ID
wranglerContent = wranglerContent.replace(
  /id = "your_kv_namespace_id_here"/,
  `id = "${process.env.VITE_CLOUDFLARE_KV_NAMESPACE_ID}"`
);

// 替换域名
wranglerContent = wranglerContent.replace(
  /{ pattern = "g2\.al\/\*", zone_name = "g2\.al" }/,
  `{ pattern = "${process.env.VITE_SHORT_URL_DOMAIN}/*", zone_name = "${process.env.VITE_SHORT_URL_DOMAIN}" }`
);

fs.writeFileSync(wranglerPath, wranglerContent);

console.log('已更新 wrangler.toml 配置');

// 部署 Worker
try {
  console.log('开始部署 Cloudflare Worker...');
  execSync('npx wrangler deploy', { stdio: 'inherit' });
  console.log('Worker 部署成功!');
} catch (error) {
  console.error('部署失败:', error.message);
  process.exit(1);
} 