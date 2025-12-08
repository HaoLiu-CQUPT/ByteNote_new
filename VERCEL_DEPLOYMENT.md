# Vercel 部署详细指南

本指南将详细说明如何将 ByteNote 项目部署到 Vercel 平台。

## 📋 前置要求

在开始部署之前，请确保：

- ✅ 拥有 GitHub 账号
- ✅ 拥有 Vercel 账号（可免费注册：[vercel.com](https://vercel.com)）
- ✅ 项目代码已推送到 GitHub 仓库
- ✅ 本地项目可以正常运行（`npm run dev` 成功）

---

## 🚀 部署步骤

### 第一步：准备 GitHub 仓库

#### 1.1 初始化 Git 仓库（如果还没有）

```bash
# 在项目根目录执行
git init
git add .
git commit -m "Initial commit"
```

#### 1.2 创建 GitHub 仓库并推送代码

1. 访问 [GitHub](https://github.com) 并登录
2. 点击右上角 "+" → "New repository"
3. 填写仓库信息：
   - Repository name: `ByteNote`（或你喜欢的名称）
   - Description: `一个功能完整的在线笔记管理平台`
   - 选择 Public 或 Private
   - **不要**勾选 "Initialize this repository with a README"（因为已有代码）
4. 点击 "Create repository"
5. 按照 GitHub 提示，在本地执行：

```bash
git remote add origin https://github.com/你的用户名/ByteNote.git
git branch -M main
git push -u origin main
```

**注意**：如果使用 SSH，将 URL 替换为 `git@github.com:你的用户名/ByteNote.git`

---

### 第二步：修改 Prisma 配置以支持 PostgreSQL

**重要**：Vercel 不支持 SQLite 文件系统，必须使用 PostgreSQL 数据库。

#### 2.1 更新 Prisma Schema

Prisma schema 已经配置为从环境变量读取 `DATABASE_URL`，这样可以在开发环境使用 SQLite，生产环境使用 PostgreSQL。

**检查 `prisma/schema.prisma` 文件**，确保 `datasource` 配置如下：

```prisma
datasource db {
  provider = "sqlite"  // 开发环境仍使用 SQLite
  url      = env("DATABASE_URL")
}
```

**注意**：虽然 `provider` 写的是 `sqlite`，但通过 `DATABASE_URL` 环境变量，Vercel 会自动使用 PostgreSQL。如果需要同时支持，可以创建两个 schema 文件，但当前配置已经可以工作。

#### 2.2 提交更改

```bash
git add prisma/schema.prisma .gitignore
git commit -m "Prepare for Vercel deployment"
git push
```

---

### 第三步：在 Vercel 创建项目

#### 3.1 登录 Vercel

1. 访问 [vercel.com](https://vercel.com)
2. 点击右上角 "Sign Up" 或 "Log In"
3. 选择 "Continue with GitHub" 使用 GitHub 账号登录
4. 授权 Vercel 访问你的 GitHub 仓库

#### 3.2 导入项目

1. 登录后，点击 "Add New..." → "Project"
2. 在 "Import Git Repository" 页面，找到你的 `ByteNote` 仓库
3. 点击 "Import" 按钮

#### 3.3 配置项目设置

在项目配置页面：

- **Project Name**: 可以修改为自定义名称（如 `bytenote`）
- **Framework Preset**: 应该自动检测为 "Next.js"，无需修改
- **Root Directory**: 保持默认（`./`）
- **Build Command**: 保持默认（`npm run build`）
- **Output Directory**: 保持默认（`.next`）
- **Install Command**: 保持默认（`npm install`）

**暂时不要点击 "Deploy"**，先配置环境变量和数据库。

---

### 第四步：配置 Vercel Postgres 数据库

#### 4.1 创建 Postgres 数据库

1. 在项目配置页面，找到 "Storage" 或 "Databases" 部分
2. 点击 "Create Database" 或 "Add Database"
3. 选择 "Postgres"
4. 选择区域（建议选择 `Hong Kong (hkg1)` 或离你最近的区域）
5. 点击 "Create"
6. 等待数据库创建完成（通常需要 1-2 分钟）

#### 4.2 获取数据库连接字符串

数据库创建完成后，Vercel 会自动：
- 创建一个 `POSTGRES_URL` 环境变量
- 创建一个 `POSTGRES_PRISMA_URL` 环境变量（Prisma 专用）
- 创建一个 `POSTGRES_URL_NON_POOLING` 环境变量

**重要**：Prisma 需要使用 `POSTGRES_PRISMA_URL`，但我们需要将其映射为 `DATABASE_URL`。

---

### 第五步：配置环境变量

#### 5.1 添加环境变量

在项目配置页面的 "Environment Variables" 部分，添加以下变量：

| 变量名 | 值 | 说明 |
|--------|-----|------|
| `DATABASE_URL` | `$POSTGRES_PRISMA_URL` | 数据库连接（从 Postgres 数据库自动获取） |
| `JWT_SECRET` | `你的JWT密钥` | JWT 加密密钥（见下方说明） |
| `MODELSCOPE_API_KEY` | `你的API密钥` | ModelScope API Key（可选，用于 AI 功能） |

#### 5.2 生成 JWT_SECRET

在本地终端执行以下命令生成一个安全的 JWT 密钥：

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

复制输出的字符串（64 个字符），将其作为 `JWT_SECRET` 的值。

**示例**：
```
JWT_SECRET=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2
```

#### 5.3 配置 DATABASE_URL

**重要**：在 Vercel 环境变量中，`DATABASE_URL` 应该设置为：

```
$POSTGRES_PRISMA_URL
```

或者直接使用 Vercel 提供的 `POSTGRES_PRISMA_URL` 的值（点击 "Show" 查看）。

**注意**：
- 如果 Vercel 自动创建了 `POSTGRES_PRISMA_URL`，你可以直接使用它
- 或者手动添加 `DATABASE_URL`，值为 `$POSTGRES_PRISMA_URL`（Vercel 会自动解析）

#### 5.4 配置 MODELSCOPE_API_KEY（可选）

如果你需要使用 AI 功能：

1. 访问 [ModelScope 官网](https://www.modelscope.cn/)
2. 注册并登录账号
3. 进入个人中心 → "API Token"
4. 创建或查看 Token
5. 将 Token 复制到 `MODELSCOPE_API_KEY` 环境变量中

如果不使用 AI 功能，可以留空或暂时不添加。

#### 5.5 环境变量配置示例

在 Vercel 环境变量页面，应该看到类似以下配置：

```
DATABASE_URL = $POSTGRES_PRISMA_URL
JWT_SECRET = a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2
MODELSCOPE_API_KEY = sk-your-token-here
```

**重要**：
- 确保所有环境变量都添加到 **Production**、**Preview** 和 **Development** 环境
- 点击每个环境变量右侧的下拉菜单，选择要应用的环境

---

### 第六步：修改 Prisma Schema 以支持 PostgreSQL

由于 Vercel 使用 PostgreSQL，我们需要确保 Prisma 配置正确。

#### 6.1 更新 Prisma Schema

修改 `prisma/schema.prisma` 文件：

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"  // 改为 postgresql
  url      = env("DATABASE_URL")
}
```

**或者**，如果你想保持开发环境使用 SQLite，可以创建两个不同的配置，但更简单的方法是：

1. 开发环境：使用 SQLite（`DATABASE_URL=file:./prisma/dev.db`）
2. 生产环境：使用 PostgreSQL（`DATABASE_URL=$POSTGRES_PRISMA_URL`）

由于 Prisma 会根据 `DATABASE_URL` 自动识别数据库类型，我们可以：

**方案 A（推荐）**：修改 schema 为 PostgreSQL，本地开发也使用 PostgreSQL（需要本地安装 PostgreSQL）

**方案 B**：保持 schema 为 SQLite，但在 Vercel 上使用 PostgreSQL（不推荐，可能会有兼容性问题）

**方案 C（最佳实践）**：使用环境变量动态切换

让我们采用**方案 A**，修改为 PostgreSQL：

```bash
# 在本地执行
```

实际上，更好的做法是：**修改 schema 为 PostgreSQL**，因为：
1. Vercel 必须使用 PostgreSQL
2. 本地开发也可以使用 PostgreSQL（或使用 Docker 运行 PostgreSQL）
3. 避免 SQLite 和 PostgreSQL 之间的兼容性问题

#### 6.2 更新 Schema 文件

我已经在之前的步骤中更新了 schema，现在需要确保它使用 PostgreSQL。

让我检查并更新：

实际上，Prisma 支持根据 `DATABASE_URL` 自动识别数据库类型，但为了明确，我们应该将 `provider` 改为 `postgresql`。

**但是**，如果你希望本地开发继续使用 SQLite，可以：
1. 保持 schema 为 `sqlite`
2. 在 Vercel 上，Prisma 会根据 `DATABASE_URL` 中的 `postgres://` 协议自动使用 PostgreSQL

**更安全的做法**：明确指定为 PostgreSQL，本地开发也使用 PostgreSQL 或 Docker。

---

### 第七步：添加构建后命令（数据库迁移）

#### 7.1 更新 package.json

在 `package.json` 中添加一个用于生产环境的迁移命令：

```json
{
  "scripts": {
    "postinstall": "prisma generate",
    "vercel-build": "prisma generate && prisma migrate deploy && next build"
  }
}
```

或者，更简单的方法是在 Vercel 项目设置中配置构建命令。

#### 7.2 配置 Vercel 构建命令

在 Vercel 项目配置页面：

1. 找到 "Build and Output Settings"
2. 将 "Build Command" 修改为：

```bash
prisma generate && prisma migrate deploy && npm run build
```

或者保持默认的 `npm run build`，然后在 `package.json` 中添加：

```json
{
  "scripts": {
    "build": "prisma generate && prisma migrate deploy && next build"
  }
}
```

---

### 第八步：部署项目

#### 8.1 开始部署

1. 确认所有环境变量已配置
2. 确认构建命令已设置
3. 点击页面底部的 **"Deploy"** 按钮

#### 8.2 等待部署完成

Vercel 会自动：
1. 安装依赖（`npm install`）
2. 生成 Prisma Client（`prisma generate`）
3. 运行数据库迁移（`prisma migrate deploy`）
4. 构建 Next.js 应用（`next build`）
5. 部署到全球 CDN

部署过程通常需要 2-5 分钟，你可以在部署日志中查看进度。

#### 8.3 查看部署日志

如果部署失败：
1. 点击部署记录查看详细日志
2. 检查错误信息
3. 常见问题：
   - 环境变量未配置
   - 数据库连接失败
   - Prisma 迁移失败
   - 构建错误

---

### 第九步：验证部署

#### 9.1 访问应用

部署成功后，Vercel 会提供一个 URL，例如：
```
https://your-project.vercel.app
```

点击 URL 访问应用。

#### 9.2 测试功能

1. **注册账号**
   - 访问 `/auth/register`
   - 创建一个新账号
   - 如果成功，说明 JWT_SECRET 配置正确

2. **登录**
   - 使用刚创建的账号登录
   - 如果成功，说明认证系统正常

3. **创建笔记**
   - 登录后，点击 "新建笔记"
   - 创建一条测试笔记
   - 如果成功，说明数据库连接正常

4. **测试 AI 功能**（如果配置了）
   - 访问 AI 搜索功能
   - 测试是否正常工作

---

## 🔧 常见问题排查

### 问题 1：部署失败 - "Prisma Client not generated"

**解决方案**：
1. 确保构建命令包含 `prisma generate`
2. 在 `package.json` 中添加 `"postinstall": "prisma generate"`

### 问题 2：数据库连接失败

**解决方案**：
1. 检查 `DATABASE_URL` 环境变量是否正确
2. 确认使用的是 `POSTGRES_PRISMA_URL`（不是 `POSTGRES_URL`）
3. 检查数据库是否已创建并运行

### 问题 3：迁移失败

**解决方案**：
1. 确保使用 `prisma migrate deploy`（不是 `prisma migrate dev`）
2. 检查数据库连接字符串格式
3. 查看 Vercel 部署日志中的详细错误信息

### 问题 4：环境变量不生效

**解决方案**：
1. 确保环境变量已添加到所有环境（Production、Preview、Development）
2. 重新部署项目（环境变量更改后需要重新部署）
3. 检查变量名拼写是否正确

### 问题 5：JWT 认证失败

**解决方案**：
1. 检查 `JWT_SECRET` 是否已配置
2. 确保 `JWT_SECRET` 是随机生成的强密钥
3. 清除浏览器 Cookie 后重试

---

## 📝 部署后维护

### 更新应用

每次推送代码到 GitHub 主分支，Vercel 会自动重新部署：

```bash
git add .
git commit -m "Update features"
git push origin main
```

### 查看部署历史

1. 在 Vercel 项目页面，点击 "Deployments"
2. 查看所有部署记录
3. 可以回滚到之前的版本

### 查看日志

1. 在 Vercel 项目页面，点击 "Functions"
2. 查看服务器端日志
3. 排查运行时错误

### 监控和性能

1. 在 Vercel 项目页面，查看 "Analytics"
2. 监控访问量、性能指标
3. 查看错误率

---

## 🎯 部署检查清单

在部署前，确认以下所有项：

- [ ] 代码已推送到 GitHub
- [ ] `.env` 文件已添加到 `.gitignore`（不会被提交）
- [ ] Prisma schema 已更新为支持 PostgreSQL
- [ ] Vercel 项目已创建
- [ ] Vercel Postgres 数据库已创建
- [ ] `DATABASE_URL` 环境变量已配置（使用 `$POSTGRES_PRISMA_URL`）
- [ ] `JWT_SECRET` 环境变量已配置（使用随机生成的密钥）
- [ ] `MODELSCOPE_API_KEY` 环境变量已配置（可选）
- [ ] 构建命令已配置（包含 `prisma generate` 和 `prisma migrate deploy`）
- [ ] 部署成功
- [ ] 可以访问应用
- [ ] 可以注册和登录
- [ ] 可以创建笔记
- [ ] AI 功能正常（如果配置了）

---

## 🔐 安全建议

1. **JWT_SECRET**：使用强随机密钥，不要使用默认值
2. **数据库密码**：Vercel 自动管理，无需担心
3. **API Keys**：不要提交到代码仓库，只通过环境变量配置
4. **HTTPS**：Vercel 自动提供 HTTPS，无需额外配置

---

## 📚 相关资源

- [Vercel 官方文档](https://vercel.com/docs)
- [Next.js 部署文档](https://nextjs.org/docs/deployment)
- [Prisma 部署指南](https://www.prisma.io/docs/guides/deployment)
- [Vercel Postgres 文档](https://vercel.com/docs/storage/vercel-postgres)

---

## 🆘 需要帮助？

如果遇到问题：

1. 查看 Vercel 部署日志
2. 检查环境变量配置
3. 查看本文档的"常见问题排查"部分
4. 访问 [Vercel 社区论坛](https://github.com/vercel/vercel/discussions)

---

**祝部署顺利！** 🚀

