/**
 * Cloudflare Pages 构建配置脚本
 * 
 * 此脚本在构建过程中运行，确保Pages Functions正确部署
 * 会将functions目录复制到dist/functions目录
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// 获取当前文件的目录路径
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 复制目录的函数
function copyDir(src, dest) {
  // 创建目标目录
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  // 读取源目录内容
  const entries = fs.readdirSync(src, { withFileTypes: true });

  // 复制每个文件/目录
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      // 递归复制子目录
      copyDir(srcPath, destPath);
    } else {
      // 复制文件
      fs.copyFileSync(srcPath, destPath);
      console.log(`复制文件: ${srcPath} -> ${destPath}`);
    }
  }
}

// 程序入口
function main() {
  console.log('开始配置Cloudflare Pages构建...');
  
  const functionsDir = path.join(__dirname, 'functions');
  const destDir = path.join(__dirname, 'dist', 'functions');
  
  if (!fs.existsSync(functionsDir)) {
    console.error('错误: functions目录不存在!');
    process.exit(1);
  }
  
  console.log(`将复制functions目录到: ${destDir}`);
  copyDir(functionsDir, destDir);
  
  console.log('Cloudflare Pages构建配置完成!');
}

// 执行主函数
main(); 