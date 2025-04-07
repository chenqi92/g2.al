# Cloudflare 设置指南

本文档介绍如何设置 Cloudflare KV 和 Workers 来处理短链接服务。

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

### 2. 创建 Worker

1. 进入 **Workers & Pages** 菜单
2. 点击 **创建应用程序**
3. 选择 **创建 Worker**
4. 输入 Worker 名称，如 `url-shortener`
5. 点击 **创建**，进入编辑界面
6. 将本项目中的 `cloudflare-worker.js` 文件内容粘贴到编辑器中
7. 在 **设置** 选项卡中，绑定 KV 命名空间：
   - 变量名称：`URL_SHORTENER`
   - KV 命名空间：选择之前创建的命名空间
8. 点击 **保存并部署**

### 3. 设置域名路由

1. 进入 **Workers & Pages** 菜单
2. 点击您的 Worker
3. 进入 **触发器** 选项卡
4. 自定义域：添加之前注册到 Cloudflare 的域名（如 g2.al）
5. 路由模式：选择 `*域名/*`，例如 `*g2.al/*`

### 4. 创建 API 令牌

1. 进入您的个人资料设置
2. 选择 **API 令牌**
3. 点击 **创建令牌**
4. 选择 **使用自定义设置创建令牌**
5. 填写令牌名称，如 `URL_Shortener_API`
6. 权限设置：
   - Account > Worker KV Storage > Edit
   - Account > Workers Scripts > Edit
7. 记录生成的令牌，这将在环境变量中使用

### 5. 更新环境变量

在项目的 `.env` 文件中填入以下信息：

```
# Cloudflare Configuration
VITE_CLOUDFLARE_ACCOUNT_ID=your_account_id_here
VITE_CLOUDFLARE_API_TOKEN=your_api_token_here
VITE_CLOUDFLARE_KV_NAMESPACE_ID=your_kv_namespace_id_here

# URL Shortener Configuration
VITE_SHORT_URL_DOMAIN=g2.al
```

- `VITE_CLOUDFLARE_ACCOUNT_ID`：在 Cloudflare 控制面板右下角找到
- `VITE_CLOUDFLARE_API_TOKEN`：之前创建的 API 令牌
- `VITE_CLOUDFLARE_KV_NAMESPACE_ID`：KV 命名空间 ID
- `VITE_SHORT_URL_DOMAIN`：设置的短链接域名

## 工作原理

1. 当用户创建短链时：
   - 前端生成随机短代码（如 `abc123`）
   - 通过 Cloudflare API 将原始 URL 存储在 KV 存储中
   - 短链格式为：`https://g2.al/abc123`

2. 当用户访问短链时：
   - Cloudflare Worker 处理请求
   - 从 KV 存储中查找短代码对应的原始 URL
   - 增加点击计数
   - 将用户重定向到原始 URL

## 故障排除

- **Worker 不处理请求**：确保域名路由正确配置
- **KV 存储失败**：检查 API 令牌权限
- **无法访问短链**：确保 Worker 正确绑定了 KV 命名空间

## 日志和监控

- 在 Worker 详情页面的 **日志** 选项卡中可以查看运行日志
- 启用 **尽情记录** 功能可以获取更详细的日志信息 