# G2.AL 短链接服务

这是一个基于 Cloudflare Pages Functions 和 KV 存储的短链接服务，提供快速、可靠的 URL 缩短功能。

## 功能特点

- 创建短链接并重定向到原始 URL
- 跟踪短链接点击次数
- 定制化短链接代码
- 响应式界面设计
- 支持国际化 (i18n)

## 技术栈

- 前端：React、TypeScript、Vite
- 后端：Cloudflare Pages Functions
- 存储：Cloudflare KV

## 快速开始

详细的设置与部署说明请参考：
- [Cloudflare Pages 完整指南](./CLOUDFLARE_SETUP.md)

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
VITE_TEMP_EMAIL_DOMAINS=tempmail.io,mailtemp.org,10minutemail.com,throwawaymail.net,disposable.cc
```

3. 使用 Wrangler 启动开发服务器：

```bash
npm run pages:dev
```

### Cloudflare Pages Functions 部署

短链接功能依赖于 Cloudflare Pages Functions 来处理重定向请求：

```bash
npm run pages:deploy
```

在 Cloudflare Pages 控制面板中，您需要：

1. 绑定 KV 命名空间：
   - 变量名：`URL_SHORTENER`
   - 选择您的 KV 命名空间

2. 设置环境变量：
   - `VITE_CLOUDFLARE_ACCOUNT_ID`
   - `VITE_CLOUDFLARE_API_TOKEN`
   - `VITE_CLOUDFLARE_KV_NAMESPACE_ID`
   - `VITE_SHORT_URL_DOMAIN`
   - `VITE_TEMP_EMAIL_DOMAINS`

## 项目结构

```
g2.al/
├── public/             # 静态资源
├── functions/          # Cloudflare Pages Functions
│   ├── api/            # API 路由
│   │   └── url.js      # URL API 端点
│   │   └── tempMail.js # 临时邮箱 API 端点
│   ├── [[path]].js     # 路径捕获函数，处理短链接
│   └── _routes.json    # 路由配置
├── src/
│   ├── components/     # React 组件
│   ├── contexts/       # React 上下文
│   ├── hooks/          # 自定义钩子
│   ├── lib/            # 工具函数和库
│   ├── locales/        # 国际化翻译文件
│   └── pages/          # 页面组件
```

## 环境变量

项目使用以下环境变量：

| 变量名 | 描述 | 必需 | 默认值 |
|--------|------|------|--------|
| VITE_CLOUDFLARE_ACCOUNT_ID | Cloudflare 账户 ID | ✅ | - |
| VITE_CLOUDFLARE_API_TOKEN | Cloudflare API 令牌 | ✅ | - |
| VITE_CLOUDFLARE_KV_NAMESPACE_ID | Cloudflare KV 命名空间 ID | ✅ | - |
| VITE_SHORT_URL_DOMAIN | 短链接域名 | ✅ | g2.al |
| VITE_TEMP_EMAIL_DOMAINS | 临时邮箱域名列表，以逗号分隔 | ❌ | tempmail.io,mailtemp.org,10minutemail.com,throwawaymail.net,disposable.cc |

## 贡献

欢迎提交 Pull Request 或创建 Issue 来帮助改进此项目。

## 许可证

[MIT](LICENSE) 