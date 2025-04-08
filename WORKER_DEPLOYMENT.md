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
- `VITE_SHORT_URL_DOMAIN`：您的短链接域名（这非常重要，Worker 中的重定向逻辑依赖此值）

### Cloudflare Pages 构建环境

如果您使用 Cloudflare Pages 进行构建，请在 Cloudflare Pages 项目设置中配置以下环境变量：

- `VITE_CLOUDFLARE_ACCOUNT_ID`
- `VITE_CLOUDFLARE_API_TOKEN`
- `VITE_CLOUDFLARE_KV_NAMESPACE_ID`
- `VITE_SHORT_URL_DOMAIN`

**重要说明**：
- `CF_PAGES` 变量无需手动配置，Cloudflare Pages 环境会自动设置为 `1`
- 部署脚本会自动检测是否在 Cloudflare Pages 环境中运行

## 配置文件说明

### wrangler.toml

`wrangler.toml` 文件中有几处关键配置会在部署时自动更新：

1. **KV 命名空间配置**:
   ```toml
   kv_namespaces = [
     { binding = "URL_SHORTENER", id = "your_kv_namespace_id_here" }
   ]
   ```
   部署脚本会将 `your_kv_namespace_id_here` 替换为 `VITE_CLOUDFLARE_KV_NAMESPACE_ID` 环境变量的值。

2. **路由配置**:
   ```toml
   routes = [
     { pattern = "g2.al/*", zone_name = "g2.al" }
   ]
   ```
   部署脚本会将 `g2.al` 替换为 `VITE_SHORT_URL_DOMAIN` 环境变量的值。

3. **环境变量**:
   ```toml
   [vars]
   # 环境变量将在部署时自动同步
   ```
   部署脚本会将所有必要的环境变量同步到此部分，包括 `VITE_SHORT_URL_DOMAIN`，这个变量在 Worker 代码中被用于识别短链接请求。

## cloudflare-worker.js

Worker 代码已更新为从环境变量读取域名配置：

```js
// 从环境变量中获取域名配置
const SHORT_DOMAIN = env.VITE_SHORT_URL_DOMAIN || 'g2.al';
```

这确保了 Worker 使用与配置文件相同的域名。

## 环境变量同步

部署脚本会自动将环境变量同步到 `wrangler.toml` 文件中。这意味着：

1. 在本地/其他主机构建环境中，`.env` 文件中的环境变量会被同步到 `wrangler.toml` 的 `[vars]` 部分
2. 在 Cloudflare Pages 构建环境中，Cloudflare 环境变量会被同步到 `wrangler.toml` 的 `[vars]` 部分
3. KV 命名空间的 ID 和路由配置中的域名也会被自动更新

这样，无论您在哪种环境中部署，Worker 都能使用相同的环境变量配置。

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
- 更新 `wrangler.toml` 配置，包括 KV 命名空间 ID、域名和环境变量
- 使用 Wrangler 部署 Worker

## 故障排除

如果部署失败，请检查：

1. 环境变量是否正确配置
   - 本地/其他主机：检查 `.env` 文件
   - Cloudflare Pages：检查 Cloudflare Pages 项目设置中的环境变量
2. Cloudflare API 令牌是否有足够的权限
3. KV 命名空间 ID 是否正确
4. 域名是否已在 Cloudflare 上注册并配置
5. 确保 `VITE_SHORT_URL_DOMAIN` 环境变量与您实际使用的域名一致

## 手动部署

如果需要手动部署，可以使用以下命令：

```bash
npx wrangler deploy
```

## 测试部署

部署成功后，您可以通过访问短链接来测试 Worker 是否正常工作：

```
https://your-domain.com/your-short-code
```

这里的 `your-domain.com` 会自动替换为您配置的 `VITE_SHORT_URL_DOMAIN` 值。如果一切正常，您将被重定向到原始 URL。 