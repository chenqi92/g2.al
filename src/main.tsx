import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// 添加简单的加载指示器
const rootElement = document.getElementById('root');

if (rootElement) {
  // 显示初始加载状态
  rootElement.innerHTML = `
    <div style="min-height: 100vh; display: flex; align-items: center; justify-content: center; background: #111827;">
      <div style="text-align: center;">
        <div style="width: 64px; height: 64px; border: 4px solid #1ec2ff; border-top-color: transparent; border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto;"></div>
        <p style="margin-top: 20px; color: #e5e7eb; font-family: sans-serif;">正在加载应用...</p>
      </div>
    </div>
    <style>
      @keyframes spin { 
        0% { transform: rotate(0deg); } 
        100% { transform: rotate(360deg); } 
      }
    </style>
  `;

  // 渲染应用
  setTimeout(() => {
    const root = createRoot(rootElement);
    root.render(
      <StrictMode>
        <App />
      </StrictMode>
    );
  }, 500); // 短暂延迟以确保DOM已准备就绪
} else {
  console.error('找不到根元素!');
}
