# 修复 Vercel 部署错误：DATABASE_URL 未找到

## 🔴 错误信息

```
Error: Environment variable not found: DATABASE_URL.
Error code: P1012
```

这个错误表示 Vercel 部署时找不到 `DATABASE_URL` 环境变量。

## ✅ 解决方案

### 方法 1：使用 Vercel Postgres（推荐）

#### 步骤 1：创建 Vercel Postgres 数据库

1. **进入项目 Dashboard**：
   - 访问 [Vercel Dashboard](https://vercel.com/dashboard)
   - 点击你的项目名称

2. **进入 Storage 标签**：
   - 在项目页面顶部，点击 **"Storage"** 标签
   - 如果看不到 Storage 标签，点击 **"Settings"** → 在左侧菜单找到 **"Storage"**

3. **创建数据库**：
   - 点击 **"Create Database"** 或 **"Add Database"** 按钮
   - 选择 **"Postgres"** 或 **"Vercel Postgres"**
   - 选择区域（建议：`Hong Kong (hkg1)`）
   - 点击 **"Create"**
   - 等待 1-2 分钟创建完成

4. **数据库创建完成后**，Vercel 会自动创建以下环境变量：
   - `POSTGRES_URL`
   - `POSTGRES_PRISMA_URL` ← **我们需要这个**
   - `POSTGRES_URL_NON_POOLING`

#### 步骤 2：添加 DATABASE_URL 环境变量

1. **进入项目 Settings**：
   - 在项目页面，点击 **"Settings"** 标签
   - 在左侧菜单，点击 **"Environment Variables"**

2. **添加 DATABASE_URL**：
   - 点击 **"Add New"** 或 **"Add"** 按钮
   - **Key（变量名）**：输入 `DATABASE_URL`
   - **Value（变量值）**：输入 `$POSTGRES_PRISMA_URL`
     - **重要**：直接输入 `$POSTGRES_PRISMA_URL`，Vercel 会自动解析这个引用
   - **Environment（环境）**：选择所有环境
     - ✅ Production
     - ✅ Preview
     - ✅ Development
   - 点击 **"Save"** 或 **"Add"**

3. **添加 JWT_SECRET**（必需）：
   - 再次点击 **"Add New"**
   - **Key**：`JWT_SECRET`
   - **Value**：生成一个随机密钥（见下方命令）
   - **Environment**：选择所有环境
   - 点击 **"Save"**

**生成 JWT_SECRET 的命令**（在本地终端执行）：
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

复制输出的 64 个字符的字符串作为 `JWT_SECRET` 的值。

4. **添加 MODELSCOPE_API_KEY**（可选，用于 AI 功能）：
   - 如果需要 AI 功能，再次点击 **"Add New"**
   - **Key**：`MODELSCOPE_API_KEY`
   - **Value**：你的 ModelScope API Token
   - **Environment**：选择所有环境
   - 点击 **"Save"**

#### 步骤 3：重新部署

1. **触发重新部署**：
   - 方法 A：在项目页面，点击 **"Deployments"** 标签
   - 找到最新的部署记录，点击右侧的 **"..."** 菜单
   - 选择 **"Redeploy"**
   - 或者
   - 方法 B：在项目 Settings → Git，点击 **"Redeploy"** 按钮

2. **等待部署完成**（2-5 分钟）

3. **验证部署**：
   - 部署成功后，访问应用 URL
   - 尝试注册一个新账号
   - 如果成功，说明配置正确

---

### 方法 2：使用外部数据库（如果找不到 Vercel Postgres）

如果找不到 Vercel Postgres 选项，可以使用外部 PostgreSQL 服务：

#### 使用 Supabase（推荐，最简单）

1. **创建 Supabase 项目**：
   - 访问 [Supabase](https://supabase.com) 并注册
   - 点击 "New Project"
   - 输入项目名称和数据库密码（记住密码）
   - 选择区域
   - 点击 "Create new project"
   - 等待 2 分钟创建完成

2. **获取连接字符串**：
   - 在项目 Dashboard，点击左侧 **"Settings"** → **"Database"**
   - 找到 **"Connection string"** 部分
   - 选择 **"URI"** 标签
   - 复制连接字符串（格式：`postgresql://postgres:[YOUR-PASSWORD]@db.xxx.supabase.co:5432/postgres`）
   - **重要**：将 `[YOUR-PASSWORD]` 替换为你创建项目时设置的密码

3. **在 Vercel 添加环境变量**：
   - 进入 Vercel 项目 → Settings → Environment Variables
   - 添加 `DATABASE_URL`，值为刚才复制的连接字符串（已替换密码）
   - 添加 `JWT_SECRET`（使用上面的命令生成）
   - 添加 `MODELSCOPE_API_KEY`（可选）

4. **重新部署**

---

## 📋 环境变量检查清单

在重新部署前，确认以下环境变量都已添加：

- [ ] `DATABASE_URL` = `$POSTGRES_PRISMA_URL`（如果使用 Vercel Postgres）
  或
- [ ] `DATABASE_URL` = `postgresql://...`（如果使用外部数据库）
- [ ] `JWT_SECRET` = `你的64字符随机密钥`
- [ ] `MODELSCOPE_API_KEY` = `你的Token`（可选）

**重要**：确保每个环境变量都添加到所有环境（Production、Preview、Development）

---

## 🔍 详细导航路径

### 在 Vercel 中添加环境变量的完整路径：

1. 访问 [Vercel Dashboard](https://vercel.com/dashboard)
2. 点击你的项目名称
3. 点击顶部标签栏的 **"Settings"**
4. 在左侧菜单，点击 **"Environment Variables"**
5. 点击 **"Add New"** 按钮
6. 输入变量名和值
7. 选择要应用的环境（建议全选）
8. 点击 **"Save"**

### 创建 Vercel Postgres 的完整路径：

1. 访问 [Vercel Dashboard](https://vercel.com/dashboard)
2. 点击你的项目名称
3. 点击顶部标签栏的 **"Storage"**（如果看不到，尝试 **"Settings"** → 左侧菜单的 **"Storage"**）
4. 点击 **"Create Database"** 或 **"Add Database"**
5. 选择 **"Postgres"**
6. 选择区域
7. 点击 **"Create"**

---

## ⚠️ 常见问题

### Q1: 找不到 Storage 标签？

**解决方案**：
- 尝试在 **Settings** → 左侧菜单查找 **"Storage"**
- 或者使用外部数据库服务（Supabase、Neon 等）

### Q2: 添加环境变量后仍然报错？

**检查清单**：
- ✅ 确认环境变量名称拼写正确（`DATABASE_URL`，不是 `DATABASE_URL_` 或其他）
- ✅ 确认值正确（`$POSTGRES_PRISMA_URL` 或完整的连接字符串）
- ✅ 确认已选择所有环境（Production、Preview、Development）
- ✅ 确认已保存环境变量
- ✅ 确认已重新部署项目

### Q3: 如何验证环境变量已添加？

1. 进入项目 Settings → Environment Variables
2. 你应该能看到所有已添加的变量
3. 如果使用 Vercel Postgres，`POSTGRES_PRISMA_URL` 应该自动存在

### Q4: 重新部署后仍然失败？

1. **检查部署日志**：
   - 进入项目 → Deployments → 点击最新的部署
   - 查看 Build Logs，找到具体的错误信息

2. **验证环境变量**：
   - 在部署日志中，环境变量不会显示值（安全原因）
   - 但可以确认变量是否存在

3. **清除缓存并重新部署**：
   - 在项目 Settings → General
   - 找到 "Clear Build Cache" 选项
   - 清除缓存后重新部署

---

## 🎯 快速修复步骤总结

1. ✅ 进入 Vercel 项目 Dashboard
2. ✅ 创建 Postgres 数据库（Storage 标签 → Create Database）
3. ✅ 添加环境变量（Settings → Environment Variables）：
   - `DATABASE_URL` = `$POSTGRES_PRISMA_URL`
   - `JWT_SECRET` = `生成的密钥`
4. ✅ 重新部署项目
5. ✅ 验证部署成功

---

## 📚 相关文档

- [Vercel Postgres 文档](https://vercel.com/docs/storage/vercel-postgres)
- [Vercel 环境变量文档](https://vercel.com/docs/concepts/projects/environment-variables)
- [完整部署指南](./VERCEL_DEPLOYMENT.md)

---

**如果按照以上步骤操作后仍然遇到问题，请检查部署日志中的具体错误信息。**


