#!/usr/bin/env node

/**
 * Cloudflare Worker 部署脚本
 * 
 * 使用方法:
 * node deploy-worker.js
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// 获取当前文件的目录路径
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
      dotenv.config();
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

// 打印环境变量值（仅显示部分值以保护安全）
for (const key of requiredEnvVars) {
  const value = process.env[key];
  if (value) {
    if (key.includes('TOKEN') || key.includes('ID')) {
      // 对于敏感信息，仅显示前几个字符和长度
      console.log(`${key}: ${value.substring(0, 4)}...${value.substring(value.length - 4)} (${value.length} 字符)`);
    } else {
      console.log(`${key}: ${value}`);
    }
  }
}

// 更新 wrangler.toml 文件
const wranglerPath = path.join(__dirname, 'wrangler.toml');
console.log(`读取 wrangler.toml 文件: ${wranglerPath}`);
let wranglerContent = fs.readFileSync(wranglerPath, 'utf8');

// 保存原始内容以便比较
const originalContent = wranglerContent;

// 获取 KV 命名空间 ID
const kvNamespaceId = process.env.VITE_CLOUDFLARE_KV_NAMESPACE_ID;
if (!kvNamespaceId) {
  console.error('错误: VITE_CLOUDFLARE_KV_NAMESPACE_ID 环境变量为空');
  process.exit(1);
}

console.log(`KV 命名空间 ID: ${kvNamespaceId.substring(0, 4)}...${kvNamespaceId.substring(kvNamespaceId.length - 4)}`);

// 获取域名
const domainValue = process.env.VITE_SHORT_URL_DOMAIN;
if (!domainValue) {
  console.error('错误: VITE_SHORT_URL_DOMAIN 环境变量为空');
  process.exit(1);
}
console.log(`短链接域名: ${domainValue}`);

// 替换变量
console.log('替换 wrangler.toml 中的变量...');
wranglerContent = wranglerContent.replace(/\$\{kvNamespaceId\}/g, kvNamespaceId);
wranglerContent = wranglerContent.replace(/\$\{domain\}/g, domainValue);

// 同步环境变量到 wrangler.toml
// 检查是否已经有 [vars] 部分
if (!wranglerContent.includes('[vars]')) {
  // 如果没有，添加 [vars] 部分
  console.log('添加 [vars] 部分到 wrangler.toml');
  wranglerContent += '\n\n[vars]\n';
}

// 添加或更新环境变量
// 注意：这里我们确保所有必要的环境变量都会被传递给 Worker
console.log('同步环境变量到 wrangler.toml...');
const envVars = {
  'VITE_CLOUDFLARE_ACCOUNT_ID': process.env.VITE_CLOUDFLARE_ACCOUNT_ID,
  'VITE_CLOUDFLARE_API_TOKEN': process.env.VITE_CLOUDFLARE_API_TOKEN,
  'VITE_CLOUDFLARE_KV_NAMESPACE_ID': process.env.VITE_CLOUDFLARE_KV_NAMESPACE_ID,
  'VITE_SHORT_URL_DOMAIN': process.env.VITE_SHORT_URL_DOMAIN
};

// 检查每个环境变量是否已经在 wrangler.toml 中
Object.entries(envVars).forEach(([key, value]) => {
  const regex = new RegExp(`${key}\\s*=\\s*"[^"]*"`, 'g');
  if (wranglerContent.match(regex)) {
    // 如果已存在，更新值
    wranglerContent = wranglerContent.replace(regex, `${key} = "${value}"`);
  } else {
    // 如果不存在，添加到 [vars] 部分
    const varsSectionIndex = wranglerContent.indexOf('[vars]') + '[vars]'.length;
    wranglerContent = wranglerContent.slice(0, varsSectionIndex) + 
      `\n${key} = "${value}"` + 
      wranglerContent.slice(varsSectionIndex);
  }
});

// 检查内容是否被修改
if (wranglerContent === originalContent) {
  console.error('错误: wrangler.toml 内容未被修改，替换操作可能失败');
  process.exit(1);
}

// 写入更新后的配置文件
fs.writeFileSync(wranglerPath, wranglerContent);
console.log('已写入更新后的 wrangler.toml 文件');

// 打印更新后的内容（部分）
console.log('更新后的 wrangler.toml 内容片段:');
const contentLines = wranglerContent.split('\n');
const kvLines = contentLines.filter(line => line.includes('kv_namespaces') || line.includes('URL_SHORTENER') || line.includes('binding'));
console.log(kvLines.join('\n'));

console.log('已更新 wrangler.toml 配置，同步了环境变量');
console.log(`使用域名: ${domainValue}`);

// 部署 Worker
try {
  console.log('开始部署 Cloudflare Worker...');
  execSync('npx wrangler deploy', { stdio: 'inherit' });
  console.log('Worker 部署成功!');
} catch (error) {
  console.error('部署失败:', error.message);
  process.exit(1);
} 