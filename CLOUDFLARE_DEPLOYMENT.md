# Cloudflare Worker 部署指南

本文档提供了部署处理短链接重定向的 Cloudflare Worker 的完整指南。Worker 将读取 KV 存储中的长链接并执行重定向操作。

## 部署方法

本项目提供了两种部署 Cloudflare Worker 的方法：

### 方法一：使用简化部署脚本（无需参数）

此方法使用 `deploy-pass-args.js` 脚本，其中所有配置都在脚本中硬编码。

### 方法二：使用修复脚本（手动指定参数）

此方法使用 `fix-deploy.js` 脚本，允许您在命令行中传递参数。

## 前提条件

无论使用哪种部署方法，您都需要：

1. 安装 Node.js 和 npm
2. 创建 Cloudflare 账户
3. 设置 Cloudflare KV 命名空间
4. 注册域名并在 Cloudflare 上进行管理
5. 安装 Wrangler CLI（通过 `npm install -g wrangler`）或使用项目中的 `npx wrangler`

## 方法一：使用 deploy-pass-args.js（无参数部署）

### 配置步骤

1. 打开 `deploy-pass-args.js` 文件
2. 修改硬编码的值：
   ```javascript
   // 硬编码的 KV 命名空间 ID 和域名
   const KV_NAMESPACE_ID = "替换为您的KV命名空间ID"; // 例如: a1b2c3d4e5f6g7h8i9j0
   const DOMAIN = "g2.al";
   ```
3. 保存文件

### 部署步骤

1. 在项目根目录中执行：
   ```
   npm run deploy:worker
   ```
   或直接运行：
   ```
   node deploy-pass-args.js
   ```

2. 脚本将：
   - 生成 `wrangler.toml` 配置文件
   - 使用 `npx wrangler deploy` 部署 Worker

## 方法二：使用 fix-deploy.js（带参数部署）

### 部署步骤

1. 在项目根目录中执行（添加适当的参数）：
   ```
   npm run fix:deploy <KV命名空间ID> <域名>
   ```
   或直接运行：
   ```
   node fix-deploy.js <KV命名空间ID> <域名>
   ```

   例如：
   ```
   node fix-deploy.js a1b2c3d4e5f6g7h8i9j0 g2.al
   ```

   参数说明：
   - `<KV命名空间ID>`: 您在 Cloudflare 中创建的 KV 命名空间的 ID（必需）
   - `<域名>`: 用于短链接的域名，默认为 `g2.al`（可选）

2. 脚本将：
   - 生成 `wrangler.toml` 配置文件
   - 使用 `npx wrangler deploy` 部署 Worker

## Cloudflare Pages 部署

如果您的项目使用 Cloudflare Pages，请确保：

1. 在 Cloudflare Pages 项目设置中配置以下环境变量：
   - `KV_NAMESPACE_ID`：您的 KV 命名空间 ID
   - `DOMAIN`：您的短链接域名

2. 确保 Worker 代码配置为从环境变量中读取域名

## 故障排除

### 常见问题

1. **KV 命名空间 ID 无效**
   - 检查您的 KV 命名空间 ID 是否正确
   - 确保您的 Cloudflare 账户有权访问该 KV 命名空间

2. **域名配置错误**
   - 确保域名在 Cloudflare 上正确配置
   - 检查 DNS 记录是否指向正确的 Worker

3. **Windows 环境兼容性**
   - 如果在 Windows 环境中遇到问题，请使用 `fix-deploy.js` 脚本，它具有更好的 Windows 兼容性

4. **部署权限错误**
   - 确保您已使用 `wrangler login` 登录到 Cloudflare 账户
   - 检查您的 API 令牌是否有正确的权限

### 手动部署命令

如果脚本失败，您也可以手动部署：

```
npx wrangler deploy
```

其中：
- `<KV命名空间ID>` 是您的 Cloudflare KV 命名空间 ID（必需）
- `<域名>` 是您的短链接域名（可选，默认为 "g2.al"）

## 在 Cloudflare Pages 中设置

如果您使用 Cloudflare Pages 进行部署：

1. 登录 Cloudflare 仪表板
2. 转到 Workers & Pages > 您的项目 > 设置 > 构建与部署
3. 将"部署命令"字段设置为：
   ```
   npm run deploy:worker
   ```
   或者：
   ```
   npm run fix:deploy <您的KV命名空间ID> <您的域名>
   ```
4. 保存设置并触发新的部署

## 获取 KV 命名空间 ID

如果您不知道您的 KV 命名空间 ID：

1. 登录 Cloudflare 仪表板
2. 转到 Workers & Pages > KV
3. 找到您的命名空间，ID 将显示在列表中

## 工作原理

部署脚本会：

1. 创建一个包含正确配置的 `wrangler.toml` 文件，其中包括：
   - KV 命名空间 ID
   - 域名配置
   - Worker 名称（设置为 "g2"）
   - 环境变量配置
2. 使用 Wrangler 工具部署 Worker

Worker 代码（`cloudflare-worker.js`）已配置为从环境变量中读取域名：

```javascript
// 从环境变量中获取域名配置
const SHORT_DOMAIN = env.VITE_SHORT_URL_DOMAIN || 'g2.al';
```

这确保了 Worker 使用与配置文件相同的域名。

## 故障排除

### KV 命名空间 ID 错误

如果您遇到以下错误：

```
KV namespace 'your_kv_namespace_id_here' is not valid. [code: 10042]
```

这表示 KV 命名空间 ID 未被正确设置。解决方法：

1. 确保您在 `deploy-pass-args.js` 中正确设置了 `KV_NAMESPACE_ID` 变量
2. 或者使用 `fix-deploy.js` 脚本并提供正确的 KV 命名空间 ID：
   ```
   node fix-deploy.js <您的KV命名空间ID> <您的域名>
   ```

### Windows 环境的兼容性

`fix-deploy.js` 脚本专门设计为兼容 Windows 环境，使用了 CommonJS 语法，避免了 ES 模块导入问题。

### 其他故障排除

如果部署失败，请检查：

1. Worker 名称设置为 "g2"
2. KV 命名空间 ID 是有效的
3. 域名配置正确
4. 确保 `VITE_SHORT_URL_DOMAIN` 环境变量与您实际使用的域名一致

## 手动部署

如果需要手动部署，可以使用以下命令：

```bash
npx wrangler deploy
```

这需要您已经正确配置了 `wrangler.toml` 文件。

## 测试部署

部署成功后，您可以通过访问短链接来测试 Worker 是否正常工作：

```
https://your-domain.com/your-short-code
```

这里的 `your-domain.com` 是您配置的域名，`your-short-code` 是短链接的代码。如果一切正常，您将被重定向到原始 URL。 