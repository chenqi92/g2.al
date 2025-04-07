# Cloudflare Worker 部署指南

本文档介绍如何部署 Cloudflare Worker 来处理短链接重定向功能。

## 前提条件

1. 已安装 Node.js 和 npm
2. 已创建 Cloudflare 账户
3. 已创建 Cloudflare KV 命名空间
4. 已配置环境变量（见下文）

## 环境变量配置

### 本地/其他主机构建环境

在项目根目录创建 `.env` 文件，并添加以下环境变量：

```
# Cloudflare 配置
VITE_CLOUDFLARE_ACCOUNT_ID=your_account_id_here
VITE_CLOUDFLARE_API_TOKEN=your_api_token_here
VITE_CLOUDFLARE_KV_NAMESPACE_ID=your_kv_namespace_id_here

# 短链接域名配置
VITE_SHORT_URL_DOMAIN=g2.al
```

请将上述变量替换为您的实际值：
- `VITE_CLOUDFLARE_ACCOUNT_ID`：您的 Cloudflare 账户 ID
- `VITE_CLOUDFLARE_API_TOKEN`：具有 Workers 和 KV 权限的 API 令牌
- `VITE_CLOUDFLARE_KV_NAMESPACE_ID`：您创建的 KV 命名空间 ID
- `VITE_SHORT_URL_DOMAIN`：您的短链接域名

### Cloudflare Pages 构建环境

如果您使用 Cloudflare Pages 进行构建，请在 Cloudflare Pages 项目设置中配置以下环境变量：

- `VITE_CLOUDFLARE_ACCOUNT_ID`
- `VITE_CLOUDFLARE_API_TOKEN`
- `VITE_CLOUDFLARE_KV_NAMESPACE_ID`
- `VITE_SHORT_URL_DOMAIN`

这些变量将在 Cloudflare Pages 构建过程中自动可用。

## 部署步骤

1. 安装依赖：

```bash
npm install
```

2. 部署 Worker：

```bash
npm run deploy:worker
```

部署脚本会自动：
- 检测当前构建环境（Cloudflare Pages 或本地/其他主机）
- 根据环境选择使用 Cloudflare 环境变量或 `.env` 文件
- 检查必要的环境变量
- 更新 `wrangler.toml` 配置
- 使用 Wrangler 部署 Worker

## 故障排除

如果部署失败，请检查：

1. 环境变量是否正确配置
   - 本地/其他主机：检查 `.env` 文件
   - Cloudflare Pages：检查 Cloudflare Pages 项目设置中的环境变量
2. Cloudflare API 令牌是否有足够的权限
3. KV 命名空间 ID 是否正确
4. 域名是否已在 Cloudflare 上注册并配置

## 手动部署

如果需要手动部署，可以使用以下命令：

```bash
npx wrangler deploy
```

## 测试部署

部署成功后，您可以通过访问短链接来测试 Worker 是否正常工作：

```
https://g2.al/your-short-code
```

如果一切正常，您将被重定向到原始 URL。 