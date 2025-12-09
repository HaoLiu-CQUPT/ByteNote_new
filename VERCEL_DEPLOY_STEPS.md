# Vercel 部署详细步骤指南

本指南将帮助你从零开始在 Vercel 上成功部署 ByteNote 项目。

## 📋 前置准备

在开始之前，请确保：

- ✅ 拥有 GitHub 账号
- ✅ 拥有 Vercel 账号（可免费注册：[vercel.com](https://vercel.com)）
- ✅ 项目代码已推送到 GitHub 仓库
- ✅ 本地项目可以正常运行（`npm run dev` 成功）

---

## 🚀 第一步：准备代码并推送到 GitHub

### 1.1 检查代码状态

在项目根目录执行：

```bash
git status
```

确保所有更改都已提交。

### 1.2 推送到 GitHub

如果代码还没有推送到 GitHub：

```bash
# 添加所有文件
git add .

# 提交更改
git commit -m "准备 Vercel 部署"

# 推送到 GitHub
git push origin main
```

**重要**：确保代码已成功推送到 GitHub，可以在 GitHub 网页上查看确认。

---

## 🗄️ 第二步：准备 PostgreSQL Schema

**重要**：Vercel 不支持 SQLite，必须使用 PostgreSQL。

### 2.1 检查当前 Schema

项目中有两个 schema 文件：
- `prisma/schema.prisma` - 当前使用 SQLite（开发环境）
- `prisma/schema.postgresql.prisma` - PostgreSQL 版本（生产环境）

### 2.2 部署前准备

**重要说明**：
- 当前 `schema.prisma` 使用 SQLite，但这是为了本地开发方便
- 在 Vercel 部署时，Prisma 会根据 `DATABASE_URL` 环境变量自动识别数据库类型
- 由于 Vercel 的 `DATABASE_URL` 指向 PostgreSQL，Prisma 会自动使用 PostgreSQL
- **首次部署时**，`vercel.json` 配置使用 `prisma db push`，这会自动创建数据库表结构
- 无需手动切换 schema 文件，当前配置已经可以工作

**如果你想要更明确的配置**（可选）：
- 可以将 `schema.postgresql.prisma` 复制为 `schema.prisma`
- 但这不是必需的，因为 Prisma 会根据连接字符串自动识别

---

## 🌐 第三步：在 Vercel 创建项目

### 3.1 登录 Vercel

1. 访问 [vercel.com](https://vercel.com)
2. 点击右上角 **"Sign Up"** 或 **"Log In"**
3. 选择 **"Continue with GitHub"** 使用 GitHub 账号登录
4. 授权 Vercel 访问你的 GitHub 仓库

### 3.2 导入项目

1. 登录后，在 Dashboard 页面，点击 **"Add New..."** → **"Project"**
2. 在 "Import Git Repository" 页面，找到你的 `ByteNote` 仓库
3. 点击 **"Import"** 按钮

### 3.3 配置项目设置

在项目配置页面，你会看到以下设置：

- **Project Name**: 可以修改为自定义名称（如 `bytenote`）
- **Framework Preset**: 应该自动检测为 "Next.js"，无需修改
- **Root Directory**: 保持默认（`./`）
- **Build Command**: 保持默认（会自动使用 `vercel.json` 中的配置）
- **Output Directory**: 保持默认（`.next`）
- **Install Command**: 保持默认（`npm install`）

**暂时不要点击 "Deploy"**，先完成数据库和环境变量配置。

---

## 💾 第四步：创建 Vercel Postgres 数据库

### 4.1 创建数据库

**方法 A：在项目配置页面创建（推荐）**

1. 在项目配置页面，向下滚动
2. 找到 **"Storage"** 或 **"Add Storage"** 部分
3. 点击 **"Create Database"** 或 **"Add"** 按钮
4. 选择 **"Postgres"** 或 **"Vercel Postgres"**
5. 选择区域（建议选择 **"Hong Kong (hkg1)"** 或离你最近的区域）
6. 点击 **"Create"**
7. 等待 1-2 分钟创建完成

**方法 B：在项目 Dashboard 中创建（如果方法 A 找不到）**

1. **先完成项目部署**（即使没有数据库，也可以先部署）
2. 进入项目 Dashboard：
   - 在 Vercel 首页，点击你的项目名称
3. 进入 Storage 标签：
   - 在项目页面顶部，点击 **"Storage"** 标签
   - 或者点击左侧菜单中的 **"Storage"**
4. 创建数据库：
   - 点击 **"Create Database"** 或 **"Add Database"** 按钮
   - 选择 **"Postgres"** 或 **"Vercel Postgres"**
   - 选择区域（建议：`Hong Kong (hkg1)`）
   - 点击 **"Create"**
5. 等待创建完成

### 4.2 数据库创建完成后的自动变量

数据库创建完成后，Vercel 会自动创建以下环境变量：

- `POSTGRES_URL` - 标准连接字符串
- `POSTGRES_PRISMA_URL` ← **我们需要这个**（Prisma 专用连接池）
- `POSTGRES_URL_NON_POOLING` - 非连接池连接字符串

**重要**：Prisma 需要使用 `POSTGRES_PRISMA_URL`，因为它包含连接池配置。

---

## 🔐 第五步：配置环境变量

### 5.1 进入环境变量设置

**导航路径**：
1. 如果还在项目配置页面：
   - 向下滚动，找到 **"Environment Variables"** 部分
2. 如果已经在项目 Dashboard：
   - 点击顶部标签栏的 **"Settings"**
   - 在左侧菜单，点击 **"Environment Variables"**

### 5.2 添加 DATABASE_URL

1. 点击 **"Add New"** 或 **"Add"** 按钮
2. **Key（变量名）**：输入 `DATABASE_URL`
3. **Value（变量值）**：输入 `$POSTGRES_PRISMA_URL`
   - **重要**：直接输入 `$POSTGRES_PRISMA_URL`，Vercel 会自动解析这个引用
   - 不要输入实际的连接字符串，使用 `$` 符号引用 Vercel Postgres 自动创建的变量
4. **Environment（环境）**：**重要** - 选择所有环境：
   - ✅ Production（生产环境）
   - ✅ Preview（预览环境）
   - ✅ Development（开发环境）
5. 点击 **"Save"** 或 **"Add"**

### 5.3 生成并添加 JWT_SECRET

JWT_SECRET 用于用户登录认证，必须设置一个安全的随机字符串。

**生成密钥**：

在本地终端（PowerShell 或 CMD）执行：

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

会输出一串 64 个字符的字符串，例如：
```
a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2
```

**添加环境变量**：

1. 在环境变量页面，再次点击 **"Add New"**
2. **Key**：输入 `JWT_SECRET`
3. **Value**：粘贴刚才生成的 64 字符密钥
4. **Environment**：选择所有环境（Production、Preview、Development）
5. 点击 **"Save"**

### 5.4 添加 MODELSCOPE_API_KEY（可选）

如果你需要使用 AI 功能（AI 搜索、AI 摘要、主题聚合）：

1. 访问 [ModelScope 官网](https://www.modelscope.cn/)
2. 注册并登录账号
3. 进入个人中心 → "API Token" 或 "访问令牌"
4. 创建或查看 Token
5. 复制 Token

**添加环境变量**：

1. 在环境变量页面，再次点击 **"Add New"**
2. **Key**：输入 `MODELSCOPE_API_KEY`
3. **Value**：粘贴你的 ModelScope Token
4. **Environment**：选择所有环境
5. 点击 **"Save"**

**注意**：如果不使用 AI 功能，可以跳过这一步。

### 5.5 环境变量配置检查清单

在继续之前，确认以下环境变量都已添加：

- [ ] `DATABASE_URL` = `$POSTGRES_PRISMA_URL`
- [ ] `JWT_SECRET` = `你的64字符随机密钥`
- [ ] `MODELSCOPE_API_KEY` = `你的Token`（可选）

**重要**：
- 确保每个环境变量都添加到所有环境（Production、Preview、Development）
- 点击每个环境变量右侧的下拉菜单，确认已选择所有环境

---

## 🚀 第六步：部署项目

### 6.1 开始部署

1. 确认所有环境变量已配置
2. 确认数据库已创建
3. 点击页面底部的 **"Deploy"** 按钮

### 6.2 等待部署完成

Vercel 会自动执行以下步骤：

1. 安装依赖（`npm install`）
2. 生成 Prisma Client（`prisma generate`）
3. 运行数据库迁移（`prisma migrate deploy` 或 `prisma db push`）
4. 构建 Next.js 应用（`next build`）
5. 部署到全球 CDN

部署过程通常需要 **2-5 分钟**，你可以在部署日志中查看进度。

### 6.3 查看部署日志

在部署过程中：

1. 点击部署记录可以查看详细日志
2. 如果部署失败，查看错误信息
3. 常见问题：
   - **部署被取消（Ignored Build Step）** → 见下方解决方案
   - 环境变量未配置 → 检查环境变量设置
   - 数据库连接失败 → 检查 `DATABASE_URL` 是否正确
   - Prisma 迁移失败 → 检查数据库是否已创建
   - 构建错误 → 查看构建日志中的具体错误

### 6.4 如果部署被取消（Ignored Build Step）

**错误信息**：
```
The Deployment has been canceled as a result of running the command defined in the "Ignored Build Step" setting.
```

**原因**：
- `vercel.json` 中的 `ignoreCommand` 配置导致部署被跳过
- 这通常发生在首次部署或 schema 文件没有变化时

**解决方案**：
1. 已修复：`vercel.json` 中的 `ignoreCommand` 已被移除
2. 提交更改并推送：
   ```bash
   git add vercel.json
   git commit -m "修复: 移除 ignoreCommand 以允许部署"
   git push origin main
   ```
3. Vercel 会自动重新部署，这次应该会成功

---

## ✅ 第七步：验证部署

### 7.1 访问应用

部署成功后，Vercel 会提供一个 URL，例如：
```
https://your-project.vercel.app
```

点击 URL 访问应用。

### 7.2 测试功能

按照以下步骤测试应用是否正常工作：

1. **注册账号**
   - 访问 `/auth/register` 或点击 "注册"
   - 创建一个新账号
   - 如果成功，说明 `JWT_SECRET` 配置正确

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

### 7.3 如果遇到错误

如果部署失败或功能不正常：

1. **查看部署日志**：
   - 进入项目 → Deployments → 点击最新的部署
   - 查看 Build Logs 和 Runtime Logs

2. **检查环境变量**：
   - 进入 Settings → Environment Variables
   - 确认所有变量都已添加且值正确

3. **检查数据库**：
   - 进入 Storage 标签
   - 确认数据库已创建且运行正常

4. **重新部署**：
   - 在 Deployments 页面，点击最新部署右侧的 "..." 菜单
   - 选择 "Redeploy"

---

## 🔧 常见问题排查

### 问题 1：部署失败 - "Prisma Client not generated"

**错误信息**：
```
Error: @prisma/client did not initialize yet. Please run "prisma generate"
```

**解决方案**：
1. 检查 `vercel.json` 中的 `buildCommand` 是否包含 `prisma generate`
2. 检查 `package.json` 中的 `postinstall` 脚本是否包含 `prisma generate`
3. 清除构建缓存后重新部署

### 问题 2：数据库连接失败

**错误信息**：
```
Error: Environment variable not found: DATABASE_URL
Error code: P1012
```

**解决方案**：
1. 检查 `DATABASE_URL` 环境变量是否正确设置
2. 确认使用的是 `$POSTGRES_PRISMA_URL`（不是 `POSTGRES_URL`）
3. 检查数据库是否已创建并运行
4. 确认环境变量已添加到所有环境（Production、Preview、Development）

### 问题 3：迁移失败

**错误信息**：
```
Error: Migration failed
```

**解决方案**：
1. 确保使用 `prisma migrate deploy`（不是 `prisma migrate dev`）
2. 检查数据库连接字符串格式
3. 查看 Vercel 部署日志中的详细错误信息
4. 如果使用 `prisma db push`，确保数据库是空的或可以接受数据丢失

### 问题 4：环境变量不生效

**解决方案**：
1. 确保环境变量已添加到所有环境（Production、Preview、Development）
2. **重新部署项目**（环境变量更改后必须重新部署才能生效）
3. 检查变量名拼写是否正确（区分大小写）
4. 确认变量值格式正确（无多余空格）

### 问题 5：JWT 认证失败

**解决方案**：
1. 检查 `JWT_SECRET` 是否已配置
2. 确保 `JWT_SECRET` 是随机生成的强密钥（64 字符）
3. 清除浏览器 Cookie 后重试
4. 确认环境变量已重新部署

### 问题 6：找不到 Storage 标签

**解决方案**：
1. 尝试在 **Settings** → 左侧菜单查找 **"Storage"**
2. 或者使用外部数据库服务（Supabase、Neon 等）
3. 参考 [VERCEL_FIX_DATABASE_URL.md](./VERCEL_FIX_DATABASE_URL.md) 中的外部数据库配置方法

---

## 📝 部署后维护

### 更新应用

每次推送代码到 GitHub 主分支，Vercel 会自动重新部署：

```bash
git add .
git commit -m "更新功能"
git push origin main
```

### 查看部署历史

1. 在 Vercel 项目页面，点击 **"Deployments"**
2. 查看所有部署记录
3. 可以回滚到之前的版本（点击部署记录右侧的 "..." 菜单）

### 查看日志

1. 在 Vercel 项目页面，点击 **"Functions"**
2. 查看服务器端日志
3. 排查运行时错误

### 监控和性能

1. 在 Vercel 项目页面，查看 **"Analytics"**
2. 监控访问量、性能指标
3. 查看错误率

---

## 🎯 完整部署检查清单

在部署前，确认以下所有项：

### 代码准备
- [ ] 代码已推送到 GitHub
- [ ] `.env` 文件已添加到 `.gitignore`（不会被提交）
- [ ] 所有更改已提交

### Vercel 配置
- [ ] Vercel 项目已创建
- [ ] GitHub 仓库已连接

### 数据库配置
- [ ] Vercel Postgres 数据库已创建
- [ ] 数据库区域已选择（建议：Hong Kong）

### 环境变量配置
- [ ] `DATABASE_URL` = `$POSTGRES_PRISMA_URL`（已添加）
- [ ] `JWT_SECRET` = `64字符随机密钥`（已添加）
- [ ] `MODELSCOPE_API_KEY` = `你的Token`（可选，已添加）
- [ ] 所有环境变量已添加到所有环境（Production、Preview、Development）

### 部署验证
- [ ] 部署成功（无错误）
- [ ] 可以访问应用 URL
- [ ] 可以注册账号
- [ ] 可以登录
- [ ] 可以创建笔记
- [ ] AI 功能正常（如果配置了）

---

## 🔐 安全建议

1. **JWT_SECRET**：使用强随机密钥，不要使用默认值或简单字符串
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

如果按照以上步骤操作后仍然遇到问题，请检查部署日志中的具体错误信息，并参考相关的故障排除文档。

