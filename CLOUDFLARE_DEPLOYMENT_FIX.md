# Cloudflare Pages 部署修复指南

本文档解释了如何修复在 Cloudflare Pages 上部署 Worker 时遇到的常见问题。

## ES 模块与 CommonJS 问题

如果你在 Cloudflare Pages 上部署时遇到类似以下错误：

```
ReferenceError: require is not defined in ES module scope, you can use import instead
```

这是因为你的 `package.json` 中有 `"type": "module"`，这表示所有 `.js` 文件都会被视为 ES 模块，但 `deploy-worker.js` 使用了 CommonJS 语法。

### 解决方案

我们已经准备了两个修复方案：

#### 方案 1: 使用 deploy-worker.mjs

我们已经创建了 `deploy-worker.mjs`，它使用 ES 模块语法，可以在 Cloudflare Pages 中运行：

1. 修改 Cloudflare Pages 中的部署命令为：
```
npm run deploy:worker
```

这将使用更新后的脚本。

#### 方案 2: 使用 fix-deploy.mjs

如果第一个方案不起作用，你可以使用专门的修复脚本：

1. 修改 Cloudflare Pages 中的部署命令为：
```
npm run deploy:worker:fix
```

或者直接：
```
node fix-deploy.mjs
```

这个脚本会自动从环境变量中读取 KV 命名空间 ID 和域名，然后创建一个正确的 `wrangler.toml` 文件。

## KV 命名空间 ID 错误

如果你看到以下错误：

```
KV namespace 'your_kv_namespace_id_here' is not valid. [code: 10042]
```

### 解决方案

确保 Cloudflare Pages 中设置了以下环境变量：

1. `VITE_CLOUDFLARE_KV_NAMESPACE_ID` - 你的 KV 命名空间 ID
2. `VITE_SHORT_URL_DOMAIN` - 你的短链接域名 (如 "g2.al")

## 手动部署方法

如果以上方法都不起作用，你可以手动创建一个 `wrangler.toml` 文件：

1. 使用以下内容创建 `wrangler.toml` 文件（替换占位符）：

```toml
name = "g2"
main = "cloudflare-worker.js"
compatibility_date = "2025-04-07"

# KV 命名空间绑定
kv_namespaces = [
  { binding = "URL_SHORTENER", id = "你的KV命名空间ID" }
]

# 路由配置
routes = [
  { pattern = "g2.al/*", zone_name = "g2.al" }
]

# 环境变量配置
[vars]
VITE_SHORT_URL_DOMAIN = "g2.al"
```

2. 修改 Cloudflare Pages 中的部署命令为：
```
npx wrangler deploy
```

## 获取 KV 命名空间 ID

如果你不知道你的 KV 命名空间 ID：

1. 登录 Cloudflare 仪表板
2. 转到 Workers & Pages > KV
3. 找到你的命名空间，ID 会显示在列表中

## 总结

确保：

1. 使用正确的 ES 模块语法（.mjs 文件或正确的导入/导出）
2. 配置了所有必要的环境变量 
3. Worker 名称设置为 "g2"
4. KV 命名空间 ID 是有效的
5. 域名配置正确

如果你仍然遇到问题，可以尝试直接使用 Cloudflare 仪表板中的 Worker 页面进行部署。 