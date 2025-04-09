# G2.AL - Cloudflare Pages 完整指南

本文档提供了基于 Cloudflare Pages Functions 实现短链接与临时邮箱服务的完整指南。

## 项目概述

这是一个基于 Cloudflare Pages Functions 和 KV 存储的服务，提供以下功能：

- 创建短链接并重定向到原始 URL
- 跟踪短链接点击次数
- 临时邮箱服务
- 响应式界面设计
- 支持国际化 (i18n)

## 技术栈

- **前端**：React、TypeScript、Vite
- **后端**：Cloudflare Pages Functions
- **存储**：Cloudflare KV

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
VITE_TEMP_EMAIL_DOMAINS=tempmail.io,mailtemp.org,10minutemail.com,throwawaymail.net,disposable.cc
```

3. 创建 `.dev.vars` 文件（不要提交到版本控制），用于本地 Wrangler 开发：

```
VITE_CLOUDFLARE_ACCOUNT_ID=your_account_id_here
VITE_CLOUDFLARE_API_TOKEN=your_api_token_here
VITE_CLOUDFLARE_KV_NAMESPACE_ID=your_kv_namespace_id_here
VITE_SHORT_URL_DOMAIN=g2.al
VITE_TEMP_EMAIL_DOMAINS=tempmail.io,mailtemp.org,10minutemail.com,throwawaymail.net,disposable.cc
```

4. 使用 Wrangler 启动开发服务器：

```bash
npm run pages:dev
```

## Cloudflare 设置和部署流程

### 前提条件

1. 一个 Cloudflare 账户
2. 一个 GitHub 仓库，包含项目代码
3. 一个注册到 Cloudflare 的域名（可选，如 g2.al）

### 1. 创建 KV 命名空间

1. 登录 Cloudflare 控制面板
2. 进入 **Workers & Pages** 菜单
3. 点击 **KV** 选项卡
4. 点击 **创建命名空间**
5. 输入命名空间名称，如 `URL_SHORTENER`
6. 记下命名空间 ID，这将在环境变量中使用

### 2. 创建 Cloudflare Pages 项目

1. 进入 **Workers & Pages** 菜单
2. 点击 **创建应用程序**
3. 选择 **连接到 Git**
4. 授权 Cloudflare 访问您的 GitHub 账户（如果尚未授权）
5. 选择包含项目代码的仓库

### 3. 配置构建设置

在构建配置部分，使用以下设置：

- **构建命令**: `npm run build`
- **构建输出目录**: `dist`
- **根目录**: (保持空白)
- **Node.js 版本**: `18` (或更高)

构建过程会执行以下操作：
1. 运行 `vite build` 构建前端应用，生成 `dist` 目录
2. 运行 `build-config.js` 脚本，将 `functions` 目录复制到 `dist/functions`

### 4. 绑定 KV 命名空间到 Pages Functions

1. 部署完成后，进入您的 Pages 项目
2. 点击 **设置** > **Functions**
3. 在 **KV 命名空间绑定** 部分，点击 **添加绑定**
4. 填写以下信息：
   - 变量名：`URL_SHORTENER`
   - KV 命名空间：选择之前创建的命名空间
5. 点击 **保存**

### 5. 设置环境变量

在 **环境变量** 部分，添加以下变量：

| 变量名 | 值 | 描述 |
|--------|------|------|
| VITE_CLOUDFLARE_ACCOUNT_ID | your_account_id | Cloudflare 账户 ID |
| VITE_CLOUDFLARE_API_TOKEN | your_api_token | Cloudflare API 令牌 |
| VITE_CLOUDFLARE_KV_NAMESPACE_ID | your_kv_namespace_id | KV 命名空间 ID |
| VITE_SHORT_URL_DOMAIN | g2.al | 短链接域名 |
| VITE_TEMP_EMAIL_DOMAINS | tempmail.io,mailtemp.org,... | 临时邮箱域名列表 |

确保这些变量应用于 **生产环境** 和 **预览环境**。

### 6. 设置自定义域名 (可选)

1. 部署完成后，进入项目的 **自定义域** 部分
2. 点击 **设置自定义域**
3. 输入您的域名（例如 `g2.al`）
4. 按照说明设置 DNS 记录
5. 等待 SSL 证书配置完成

### 7. 部署

点击 **保存并部署** 按钮，Cloudflare Pages 将开始构建和部署应用。

或者您也可以通过命令行部署：

```bash
npm run pages:deploy
```

## 项目架构与组件

### 项目结构

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

### Pages Functions 工作原理

Cloudflare Pages Functions 提供了一种无服务器方式来添加动态功能：

1. **API 路由** (`functions/api/url.js`) - 处理 API 请求，例如：
   ```
   GET /api/url?code=abc123
   ```

2. **路径捕获函数** (`functions/[[path]].js`) - 捕获所有不匹配其他路由的请求，检查是否是短链接请求。如果是，则从 KV 存储中查找并重定向；如果不是，则让请求继续，由前端 SPA 路由处理。

3. **路由配置** (`functions/_routes.json`) - 定义路由规则和优先级，确保 API 请求先被处理，然后是短链接捕获。

### 在 URL 缩短系统中的应用

1. 当用户创建短链接时：
   - 前端生成随机短代码（如 `abc123`）
   - 通过 Cloudflare API 将原始 URL 存储在 KV 存储中
   - 短链格式为：`https://g2.al/abc123`

2. 当用户访问短链接时：
   - Pages Function 处理请求
   - 从 KV 存储中查找短代码对应的原始 URL
   - 增加点击计数
   - 将用户重定向到原始 URL

## 环境变量说明

项目使用以下环境变量：

| 变量名 | 描述 | 必需 | 默认值 |
|--------|------|------|--------|
| VITE_CLOUDFLARE_ACCOUNT_ID | Cloudflare 账户 ID | ✅ | - |
| VITE_CLOUDFLARE_API_TOKEN | Cloudflare API 令牌 | ✅ | - |
| VITE_CLOUDFLARE_KV_NAMESPACE_ID | Cloudflare KV 命名空间 ID | ✅ | - |
| VITE_SHORT_URL_DOMAIN | 短链接域名 | ✅ | g2.al |
| VITE_TEMP_EMAIL_DOMAINS | 临时邮箱域名列表，以逗号分隔 | ❌ | tempmail.io,mailtemp.org,10minutemail.com,throwawaymail.net,disposable.cc |

## 故障排除

### 构建失败

如果构建过程失败，可能的原因包括：

1. **Node.js 版本问题**: 确保使用 Node.js 18 或更高版本
2. **依赖项安装问题**: 检查构建日志中是否有依赖项安装失败的报错
3. **构建脚本问题**: 确保 `build-config.js` 脚本正确工作

### 函数不工作

如果 Pages Functions 不工作，可能的原因包括：

1. **KV 绑定问题**: 确保已正确绑定 KV 命名空间
2. **函数目录未复制**: 检查 `build-config.js` 脚本是否成功运行，函数是否复制到 `dist/functions` 目录
3. **环境变量问题**: 确保所有必要的环境变量都已正确设置

### 检查构建日志

1. 在 Cloudflare Pages 控制面板中，转到您的项目
2. 点击最近的部署
3. 查看 **构建日志** 以获取详细信息
4. 如果看到错误，根据错误信息进行相应调整

### 页面不显示

如果前端页面无法加载，检查以下几点：
- 自定义域已正确配置
- Pages 构建成功
- `_routes.json` 文件配置正确
- 查看浏览器控制台是否有错误

## 日志和监控

在 Cloudflare Pages 控制面板中：

1. 转到您的 Pages 项目
2. 点击 **Functions** 选项卡
3. 查看调用日志和指标
4. 对于更详细的日志，在函数中添加 `console.log()` 语句 