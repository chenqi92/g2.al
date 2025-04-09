# Cloudflare Pages Functions 设置指南

本文档介绍如何设置 Cloudflare Pages Functions 和 KV 来处理短链接服务。

## 前提条件

1. 一个 Cloudflare 账户
2. 一个注册到 Cloudflare 的域名（比如 g2.al）

## 设置步骤

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
4. 选择您的代码仓库
5. 设置构建配置：
   - 构建命令：`npm run build`
   - 构建输出目录：`dist`
6. 点击 **保存并部署**

### 3. 绑定 KV 命名空间到 Pages Functions

1. 部署完成后，进入您的 Pages 项目
2. 点击 **设置** > **Functions**
3. 在 **KV 命名空间绑定** 部分，点击 **添加绑定**
4. 填写以下信息：
   - 变量名：`URL_SHORTENER`
   - KV 命名空间：选择之前创建的命名空间
5. 点击 **保存**

### 4. 设置环境变量

1. 在 Pages 项目设置中，点击 **环境变量**
2. 添加以下环境变量：
   - `VITE_CLOUDFLARE_ACCOUNT_ID`：您的 Cloudflare 账号 ID
   - `VITE_CLOUDFLARE_API_TOKEN`：您的 Cloudflare API 令牌
   - `VITE_CLOUDFLARE_KV_NAMESPACE_ID`：您的 KV 命名空间 ID
   - `VITE_SHORT_URL_DOMAIN`：您的短链接域名（如 `g2.al`）
3. 选择这些变量应用的环境（生产环境和预览环境）
4. 点击 **保存**

### 5. 自定义域名设置

1. 进入您的 Pages 项目，点击 **自定义域** 
2. 点击 **设置自定义域**
3. 输入您的域名（如 `g2.al`）
4. 按照说明设置 DNS 记录
5. 等待 SSL 证书配置完成

## 本地开发设置

要在本地开发和测试 Pages Functions：

1. 确保安装了 Wrangler CLI：

```bash
npm install -g wrangler
```

2. 创建 `.dev.vars` 文件（不要提交到版本控制），添加：

```
VITE_CLOUDFLARE_ACCOUNT_ID=your_account_id_here
VITE_CLOUDFLARE_API_TOKEN=your_api_token_here
VITE_CLOUDFLARE_KV_NAMESPACE_ID=your_kv_namespace_id_here
VITE_SHORT_URL_DOMAIN=g2.al
```

3. 使用以下命令启动开发服务器：

```bash
npm run pages:dev
```

## Pages Functions 工作原理

Cloudflare Pages Functions 提供了一种无服务器方式来添加动态功能：

1. `functions/` 目录包含所有的函数文件
2. `functions/api/` 包含 API 端点
3. `functions/[[path]].js` 是一个路径捕获函数，处理所有没有特定函数的路径
4. 当用户访问网站时，Cloudflare Pages 会：
   - 对静态资源请求提供静态文件
   - 对 API 请求执行相应的 API 函数
   - 对短链接请求执行路径捕获函数
   - 对其他路径提供 SPA 入口，由客户端路由器处理

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

## 日志和监控

在 Cloudflare Pages 控制面板中：

1. 转到您的 Pages 项目
2. 点击 **Functions** 选项卡
3. 查看调用日志和指标
4. 对于更详细的日志，可以在函数中添加 `console.log()`语句

## 故障排除

### 页面无法加载

确保：
- 自定义域已正确配置
- Pages 构建成功
- `_routes.json` 文件配置正确

### 短链接不工作

检查：
- KV 命名空间绑定是否正确
- 路径捕获函数(`[[path]].js`)是否正确实现
- KV 存储中是否有对应的短链接数据

### 本地开发问题

确保：
- Wrangler CLI 已安装
- `.dev.vars` 文件包含所有必需的环境变量
- KV 命名空间 ID 填写正确 