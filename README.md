# WebTools

WebTools 是一个提供短链接生成和临时邮箱服务的现代化 Web 应用。

## 功能特点

- 🔗 短链接生成
  - 自定义二维码生成
  - 点击量统计
  - 多种样式模板
  - **基于 Cloudflare KV 存储**
- 📧 临时邮箱
  - 即时创建一次性邮箱
  - 安全匿名通信
  - 自动过期机制
- 🌐 多语言支持
  - 中文
  - English
- 🎨 现代化 UI
  - 响应式设计
  - 暗色主题
  - 流畅动画

## 技术栈

- React 18
- TypeScript
- Vite
- Tailwind CSS
- **Cloudflare Workers & KV**
- i18next
- React Router
- Framer Motion

## 开始使用

1. 克隆仓库：

```bash
git clone https://github.com/yourusername/webtools.git
cd webtools
```

2. 安装依赖：

```bash
npm install
```

3. 配置环境变量：

```bash
cp .env.example .env
```

编辑 `.env` 文件，填入你的 Cloudflare 配置：

```env
# Cloudflare Configuration
VITE_CLOUDFLARE_ACCOUNT_ID=your_account_id_here
VITE_CLOUDFLARE_API_TOKEN=your_api_token_here
VITE_CLOUDFLARE_KV_NAMESPACE_ID=your_kv_namespace_id_here

# URL Shortener Configuration
VITE_SHORT_URL_DOMAIN=g2.al

# Temporary Email Configuration
VITE_TEMP_EMAIL_DOMAINS=tempmail.io,mailtemp.org,10minutemail.com,throwawaymail.net,disposable.cc
```

4. 启动开发服务器：

```bash
npm run dev
```

5. 构建生产版本：

```bash
npm run build
```

## Cloudflare 配置

短链接服务使用 Cloudflare Workers 和 KV 存储实现。详细设置步骤请参考 [CLOUDFLARE_SETUP.md](CLOUDFLARE_SETUP.md)。

主要配置步骤包括：

1. 创建 Cloudflare KV 命名空间
2. 部署 Cloudflare Worker 处理重定向
3. 配置域名路由
4. 设置 API 令牌

## 项目结构

```
src/
├── components/     # 可复用组件
├── contexts/       # React Context
├── lib/            # 工具库和配置
│   └── cloudflare.ts # Cloudflare KV API 客户端
├── pages/          # 页面组件
└── App.tsx         # 应用入口
cloudflare-worker.js # Cloudflare Worker 脚本
```

## 环境要求

- Node.js 16+
- npm 7+
- Cloudflare 账户

## 贡献指南

1. Fork 本仓库
2. 创建你的特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交你的改动 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启一个 Pull Request

## 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情 