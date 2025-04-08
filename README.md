# G2.AL 短链接服务

这是一个基于 Cloudflare Workers 和 KV 存储的短链接服务，提供快速、可靠的 URL 缩短功能。

## 功能特点

- 创建短链接并重定向到原始 URL
- 跟踪短链接点击次数
- 定制化短链接代码
- 响应式界面设计
- 支持国际化 (i18n)

## 技术栈

- 前端：React、TypeScript、Vite
- 后端：Cloudflare Workers
- 存储：Cloudflare KV

## 快速开始

### 本地开发

1. 克隆项目并安装依赖：

```bash
git clone https://github.com/yourusername/g2.al.git
cd g2.al
npm install
```

2. 创建 `.env` 文件，添加必要的环境变量：

```
VITE_CLOUDFLARE_ACCOUNT_ID=your_account_id_here
VITE_CLOUDFLARE_API_TOKEN=your_api_token_here
VITE_CLOUDFLARE_KV_NAMESPACE_ID=your_kv_namespace_id_here
VITE_SHORT_URL_DOMAIN=g2.al
```

3. 启动开发服务器：

```bash
npm run dev
```

### Cloudflare Worker 部署

短链接功能依赖于 Cloudflare Worker 来处理重定向请求。请参考 [CLOUDFLARE_DEPLOYMENT.md](./CLOUDFLARE_DEPLOYMENT.md) 文件获取详细的部署指南。

## 项目结构

```
g2.al/
├── public/             # 静态资源
├── src/
│   ├── components/     # React 组件
│   ├── contexts/       # React 上下文
│   ├── hooks/          # 自定义钩子
│   ├── lib/            # 工具函数和库
│   ├── locales/        # 国际化翻译文件
│   └── pages/          # 页面组件
├── cloudflare-worker.js  # Cloudflare Worker 脚本
├── deploy-pass-args.js   # 无参数部署脚本
├── fix-deploy.js         # 带参数部署脚本
└── wrangler.toml         # Cloudflare Wrangler 配置
```

## 环境变量

项目使用以下环境变量：

| 变量名 | 描述 | 必需 |
|--------|------|------|
| VITE_CLOUDFLARE_ACCOUNT_ID | Cloudflare 账户 ID | ✅ |
| VITE_CLOUDFLARE_API_TOKEN | Cloudflare API 令牌 | ✅ |
| VITE_CLOUDFLARE_KV_NAMESPACE_ID | Cloudflare KV 命名空间 ID | ✅ |
| VITE_SHORT_URL_DOMAIN | 短链接域名 | ✅ |

## 贡献

欢迎提交 Pull Request 或创建 Issue 来帮助改进此项目。

## 许可证

[MIT](LICENSE) 