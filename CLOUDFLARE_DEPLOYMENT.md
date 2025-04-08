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

- `VITE_SHORT_URL_DOMAIN` - 您的短链接域名 (如 "g2.al")

对于 KV 命名空间，请在 Cloudflare Pages 的 Worker 设置中直接绑定 KV 命名空间。部署脚本会自动检测是否在 Cloudflare Pages 环境中运行，并跳过 KV 配置。

### 本地/VPS 环境中的环境变量配置

在本地或 VPS 环境中，您需要创建 `.env` 文件或设置环境变量：

```
VITE_CLOUDFLARE_KV_NAMESPACE_ID=your_kv_namespace_id_here
VITE_SHORT_URL_DOMAIN=g2.al
```

## Cloudflare Pages 与 Worker 的协作

本项目使用 Cloudflare Pages 托管前端应用程序，同时使用 Cloudflare Worker 处理短链接重定向。它们的工作方式如下：

### 1. 工作流程

1. 当用户访问您的域名时，请求首先到达 Cloudflare Worker
2. Worker 检查请求路径：
   - 如果是根路径('/')、静态资源或前端路由：传递给 Cloudflare Pages 托管的前端应用
   - 如果是短链接（如 'g2.al/abc123'）：从 KV 存储中查找并重定向
   - 如果是 API 请求('/api/...')：由 Worker 处理

### 2. Worker 代码中的路由处理

Worker 代码中包含了以下路由处理逻辑：

```javascript
// 检查是否是网站根路径或静态资源
if (pathname === '/' || pathname.startsWith('/index.html') || 
    pathname.startsWith('/assets/') || pathname.startsWith('/src/') || 
    pathname.includes('.js') || pathname.includes('.css') || 
    pathname.includes('.svg') || pathname.includes('.ico')) {
  // 将请求传递给Cloudflare Pages托管的前端
  return fetch(request);
}

// 检查是否是短链接请求
if (hostname === SHORT_DOMAIN && pathname.length > 1) {
  return handleShortUrl(pathname.substring(1), URL_SHORTENER);
}

// 对于 API 端点
if (pathname.startsWith('/api/')) {
  return handleApiRequest(request, pathname, URL_SHORTENER);
}

// 其他路径（如 /url-shortener, /temp-mail 等前端路由）传递给Cloudflare Pages
return fetch(request);
```

### 3. 为何需要这种协作方式

这种架构允许：
- 使用 React Router 等客户端路由
- 无需单独的后端服务器处理 API 请求
- 短链接功能与前端应用共享同一域名
- Cloudflare Pages 自动处理静态资源缓存和全球分发

### 4. 部署顺序

为确保系统正常工作，请按以下顺序部署：

1. 首先部署前端应用到 Cloudflare Pages
2. 然后部署 Worker 与 KV 存储
3. 确保 Worker 路由配置为处理所有请求（即 '/*'）

## 部署步骤

1. 首先确保已经设置好环境变量
   - Cloudflare Pages: 仅需设置 `VITE_SHORT_URL_DOMAIN` 并手动绑定 KV
   - 本地/VPS: 需设置 `VITE_CLOUDFLARE_KV_NAMESPACE_ID` 和 `VITE_SHORT_URL_DOMAIN`

2. 在项目根目录执行以下命令部署 Worker：

```bash
npm run deploy:worker
```

部署脚本将：
- 自动检测当前环境（Cloudflare Pages 或本地/VPS）
- 根据环境创建相应的 wrangler.toml 配置
- 使用 Wrangler 部署 Worker

## 关于部署脚本的说明

项目使用了 ES 模块版本的部署脚本 `deploy-cf-worker.mjs`。这是因为 `package.json` 中设置了 `"type": "module"`，所以所有 `.js` 文件都会被视为 ES 模块。该脚本通过以下方式处理部署：

1. 检测当前环境（Cloudflare Pages 或本地/VPS）
2. 在 Cloudflare Pages 环境中：完全跳过 KV 命名空间配置（使用已绑定的 KV）
3. 在本地/VPS 环境中：使用环境变量中的 KV 命名空间 ID
4. 自动生成 `wrangler.toml` 配置文件
5. 使用 `npx wrangler deploy` 命令部署 Worker

## 在 Cloudflare Pages 中设置 KV 绑定

在 Cloudflare Pages 中，您需要手动绑定 KV 命名空间：

1. 登录 Cloudflare 控制面板
2. 进入 Pages > 您的项目 > 设置 > Functions > KV 命名空间绑定
3. 添加 KV 命名空间绑定：
   - 变量名称：`URL_SHORTENER`
   - KV 命名空间：选择您的 KV 命名空间

## 使用环境变量而非硬编码值

`wrangler.toml` 文件现在使用环境变量而不是硬编码值。这样做有以下好处：

1. 更安全 - 避免将敏感信息直接写入代码
2. 更灵活 - 同一部署脚本可用于不同环境
3. 更易维护 - 只需通过环境变量更改配置

### wrangler.toml 中的环境变量语法

Cloudflare Wrangler 支持使用 `$变量名` 语法引用环境变量：

```toml
routes = [
  { pattern = "$VITE_SHORT_URL_DOMAIN/*", zone_name = "$VITE_SHORT_URL_DOMAIN" }
]
```

这样，Wrangler 会在部署时自动从环境变量中读取值替换这些变量。

### 确保环境变量存在

请确保在部署前设置了以下环境变量：

- Cloudflare Pages 环境: `VITE_SHORT_URL_DOMAIN`
- 本地/VPS 环境: `VITE_CLOUDFLARE_KV_NAMESPACE_ID` 和 `VITE_SHORT_URL_DOMAIN`

如果没有设置这些变量，部署将会失败。

## 重要提示：关于环境变量的使用

在 Cloudflare Pages 中，您可以在项目设置中配置环境变量：

1. 登录 Cloudflare 控制面板
2. 进入 Pages > 您的项目 > 设置 > 环境变量
3. 添加 `VITE_SHORT_URL_DOMAIN` 变量并设置值

在本地/VPS环境中，您可以使用 `.env` 文件或直接设置系统环境变量。

## wrangler.toml 文件说明

根据部署环境，`wrangler.toml` 文件配置将有所不同：

### Cloudflare Pages 环境中的配置

```toml
name = "g2"
main = "cloudflare-worker.js"
compatibility_date = "2025-04-07"

# 在Cloudflare Pages中，KV命名空间已手动绑定，无需在此配置

# 路由配置使用环境变量
routes = [
  { pattern = "$VITE_SHORT_URL_DOMAIN/*", zone_name = "$VITE_SHORT_URL_DOMAIN" }
]

# 环境变量配置
[vars]
```

### 本地/VPS 环境中的配置

```toml
name = "g2"
main = "cloudflare-worker.js"
compatibility_date = "2025-04-07"

# KV 命名空间绑定
kv_namespaces = [
  { binding = "URL_SHORTENER", id = "your-kv-namespace-id" }
]

# 路由配置使用环境变量
routes = [
  { pattern = "$VITE_SHORT_URL_DOMAIN/*", zone_name = "$VITE_SHORT_URL_DOMAIN" }
]

# 环境变量配置
[vars]
```

## 故障排除

### 前端页面不显示

如果部署后前端页面不显示，检查以下几点：

1. 确保 Worker 的路由配置正确 - 应该处理所有请求（'/*'）
2. 检查 Worker 代码是否包含了将前端请求传递给 Cloudflare Pages 的逻辑
3. 查看 Cloudflare Pages 构建是否成功
4. 查看浏览器控制台是否有错误
5. 确保域名的 DNS 设置正确，指向 Cloudflare

修复方法：
1. 更新 Worker 代码，确保包含根路径处理逻辑
2. 重新部署 Worker
3. 在 Cloudflare 控制面板中检查路由设置

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

### 环境变量相关错误

如果您看到以下错误：

```
Error: A route pattern references an environment variable that doesn't exist
```

或类似错误，这表示 Wrangler 无法找到您在 `wrangler.toml` 中引用的环境变量。解决方法：

1. 确保在 Cloudflare Pages 或本地环境中正确设置了 `VITE_SHORT_URL_DOMAIN` 环境变量
2. 检查变量名称是否拼写正确
3. 尝试重新运行部署命令

### KV 命名空间 ID 错误

如果在 Cloudflare Pages 中看到以下错误：

```
KV namespace 'VITE_CLOUDFLARE_KV_NAMESPACE_ID' is not valid. [code: 10042]
```

### 解决方案

这表明部署脚本没有正确处理 Cloudflare Pages 环境。解决方法：

1. 确保 `wrangler.toml` 中完全移除了 KV 命名空间配置部分
2. 确保在 Cloudflare Pages 控制台中正确绑定了 KV 命名空间
3. 尝试直接使用 `npx wrangler deploy --no-bundle` 作为部署命令

如果在 VPS/本地环境中看到类似错误：

```
KV namespace 'undefined' is not valid. [code: 10042]
```

确保已设置环境变量 `VITE_CLOUDFLARE_KV_NAMESPACE_ID`。

## 获取 KV 命名空间 ID

如果您不知道您的 KV 命名空间 ID：

1. 登录 Cloudflare 仪表板
2. 转到 Workers & Pages > KV
3. 找到您的命名空间，ID 会显示在列表中

## 总结

确保：

1. 根据部署环境正确配置
   - Cloudflare Pages: 手动绑定 KV 命名空间，完全移除 wrangler.toml 中的 KV 配置
   - 本地/VPS: 设置 `VITE_CLOUDFLARE_KV_NAMESPACE_ID` 环境变量
2. 设置 `VITE_SHORT_URL_DOMAIN` 环境变量（所有环境中都需要）
3. 使用正确的 ES 模块语法脚本 (`deploy-cf-worker.mjs`)
4. Worker 代码正确处理前端请求和短链接请求

## 测试部署

部署成功后，您可以测试以下功能：

1. 访问网站主页 (`https://your-domain.com/`)，应该显示前端应用
2. 访问短链接 (`https://your-domain.com/your-short-code`)，应该重定向到原始 URL
3. 访问 API 端点 (`https://your-domain.com/api/url?code=your-short-code`)，应该返回 JSON 响应

如果一切正常，您的系统应该已经设置完成，能够处理短链接并显示前端应用程序。 