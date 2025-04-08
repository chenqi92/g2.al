# Cloudflare Worker 部署指南

本文档提供了部署处理短链接重定向的 Cloudflare Worker 的完整指南。Worker 将读取 KV 存储中的长链接并执行重定向操作。

## 前提条件

部署 Cloudflare Worker 需要：

1. 安装 Node.js 和 npm
2. 创建 Cloudflare 账户
3. 设置 Cloudflare KV 命名空间
4. 注册域名并在 Cloudflare 上进行管理
5. 在 Cloudflare 中创建正确的环境变量

## 环境变量配置

### Cloudflare Pages 中的环境变量配置

在 Cloudflare Pages 项目设置中，配置以下环境变量：

- `VITE_CLOUDFLARE_KV_NAMESPACE_ID` - 您的 KV 命名空间 ID
- `VITE_SHORT_URL_DOMAIN` - 您的短链接域名 (如 "g2.al")

这些环境变量将被 Worker 直接使用，无需额外配置。

## 部署步骤

1. 首先确保已经设置好环境变量
2. 在项目根目录执行以下命令部署 Worker：

```bash
npm run deploy:worker
```

部署脚本将：
- 自动从 Cloudflare 环境变量中读取配置
- 使用 Wrangler 部署 Worker

## 关于部署脚本的说明

项目使用了 ES 模块版本的部署脚本 `deploy-cf-worker.mjs`。这是因为 `package.json` 中设置了 `"type": "module"`，所以所有 `.js` 文件都会被视为 ES 模块。该脚本通过以下方式处理部署：

1. 从 Cloudflare 环境变量中读取 KV 命名空间 ID 和域名
2. 自动生成 `wrangler.toml` 配置文件
3. 使用 `npx wrangler deploy` 命令部署 Worker

## wrangler.toml 文件说明

`wrangler.toml` 文件配置如下：

```toml
name = "g2"
main = "cloudflare-worker.js"
compatibility_date = "2025-04-07"

# KV 命名空间绑定
kv_namespaces = [
  { binding = "URL_SHORTENER", id = "VITE_CLOUDFLARE_KV_NAMESPACE_ID" }
]

# 路由配置
routes = [
  { pattern = "VITE_SHORT_URL_DOMAIN/*", zone_name = "VITE_SHORT_URL_DOMAIN" }
]

# 环境变量配置
[vars]
# 这些环境变量会从Cloudflare控制台中直接获取
```

## 故障排除

### "require is not defined in ES module scope" 错误

如果遇到以下错误：

```
ReferenceError: require is not defined in ES module scope, you can use import instead
```

这是因为项目使用了 ES 模块（`"type": "module"` 在 `package.json` 中），但部署脚本使用了 CommonJS 的 `require` 语法。解决方法是：

1. 使用 `deploy-cf-worker.mjs` 脚本（已经使用 ES 模块语法）
2. 确保 `package.json` 中的部署命令使用此脚本：
   ```json
   "deploy:worker": "node deploy-cf-worker.mjs"
   ```

### KV 命名空间 ID 错误

如果您看到以下错误：

```
KV namespace 'VITE_CLOUDFLARE_KV_NAMESPACE_ID' is not valid. [code: 10042]
```

### 解决方案

1. 确保 Cloudflare Pages 中设置了正确的环境变量：
   - `VITE_CLOUDFLARE_KV_NAMESPACE_ID` - 您的真实 KV 命名空间 ID
   - `VITE_SHORT_URL_DOMAIN` - 您的短链接域名

2. 如果仍然有问题，可以手动编辑 `wrangler.toml` 文件：
   ```toml
   kv_namespaces = [
     { binding = "URL_SHORTENER", id = "您的实际KV命名空间ID" }
   ]
   
   routes = [
     { pattern = "您的实际域名/*", zone_name = "您的实际域名" }
   ]
   ```

3. 然后执行手动部署：
   ```bash
   npx wrangler deploy
   ```

## 获取 KV 命名空间 ID

如果您不知道您的 KV 命名空间 ID：

1. 登录 Cloudflare 仪表板
2. 转到 Workers & Pages > KV
3. 找到您的命名空间，ID 会显示在列表中

## 总结

确保：

1. Cloudflare 环境变量正确配置
2. KV 命名空间 ID 是有效的
3. 域名配置正确
4. 使用正确的 ES 模块语法脚本 (`deploy-cf-worker.mjs`)

## 测试部署

部署成功后，您可以通过访问短链接来测试 Worker 是否正常工作：

```
https://your-domain.com/your-short-code
```

这里的 `your-domain.com` 是您配置的 `VITE_SHORT_URL_DOMAIN` 值。如果一切正常，您将被重定向到原始 URL。 