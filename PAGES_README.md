# G2.AL 短链接服务 - Cloudflare Pages Functions 实现

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

3. 使用 Wrangler 启动开发服务器：

```bash
npm run pages:dev
```

### 部署到 Cloudflare Pages

1. 构建并部署项目：

```bash
npm run pages:deploy
```

2. 在 Cloudflare Pages 控制面板中配置：
   - 绑定 KV 命名空间
   - 设置环境变量

## 项目结构

```
g2.al/
├── public/             # 静态资源
├── functions/          # Cloudflare Pages Functions
│   ├── api/            # API 路由
│   │   └── url.js      # URL API 端点
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

## Cloudflare Pages Functions 说明

这个项目使用 Cloudflare Pages Functions 来处理 API 请求和短链接重定向：

### 1. API 路由 (`functions/api/url.js`)

处理 API 请求，如检查短链接是否存在：

```
GET /api/url?code=abc123
```

### 2. 路径捕获函数 (`functions/[[path]].js`)

捕获所有不匹配其他路由的请求，检查是否是短链接请求。如果是，则从 KV 存储中查找并重定向；如果不是，则让请求继续，由前端 SPA 路由处理。

### 3. 路由配置 (`functions/_routes.json`)

定义路由规则和优先级，确保 API 请求先被处理，然后是短链接捕获。

## 环境变量

项目使用以下环境变量：

| 变量名 | 描述 | 必需 |
|--------|------|------|
| VITE_CLOUDFLARE_ACCOUNT_ID | Cloudflare 账户 ID | ✅ |
| VITE_CLOUDFLARE_API_TOKEN | Cloudflare API 令牌 | ✅ |
| VITE_CLOUDFLARE_KV_NAMESPACE_ID | Cloudflare KV 命名空间 ID | ✅ |
| VITE_SHORT_URL_DOMAIN | 短链接域名 | ✅ |

## Cloudflare Pages 设置

部署到 Cloudflare Pages 后，需要进行以下设置：

1. 进入项目的 **Settings** > **Functions**
2. 在 **KV Namespace Bindings** 部分，添加绑定：
   - 变量名：`URL_SHORTENER`
   - KV 命名空间：选择您的命名空间
3. 在 **Environment Variables** 部分，添加以下环境变量：
   - `VITE_CLOUDFLARE_ACCOUNT_ID`
   - `VITE_CLOUDFLARE_API_TOKEN`
   - `VITE_CLOUDFLARE_KV_NAMESPACE_ID`
   - `VITE_SHORT_URL_DOMAIN`

## 贡献

欢迎提交 Pull Request 或创建 Issue 来帮助改进此项目。

## 许可证

[MIT](LICENSE) 