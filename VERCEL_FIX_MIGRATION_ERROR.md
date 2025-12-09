# 修复 Vercel 部署错误：Provider 不匹配

## 🔴 错误信息

```
Error: P3019
The datasource provider `postgresql` specified in your schema does not match 
the one specified in the migration_lock.toml, `sqlite`.
```

## 🔍 问题原因

1. **Schema 使用 PostgreSQL**：`prisma/schema.prisma` 中配置的是 `postgresql`
2. **迁移历史使用 SQLite**：`prisma/migrations` 目录中的 `migration_lock.toml` 记录的是 `sqlite`
3. **Vercel 运行了错误的命令**：Vercel 可能运行了 `prisma migrate deploy` 而不是 `prisma db push`

## ✅ 解决方案

### 方案 1：在 Vercel 项目设置中修改构建命令（推荐）

**步骤**：

1. **登录 Vercel Dashboard**
   - 访问 [vercel.com/dashboard](https://vercel.com/dashboard)
   - 找到你的项目并点击进入

2. **进入项目设置**
   - 点击顶部标签栏的 **"Settings"**
   - 在左侧菜单中，点击 **"General"**

3. **修改构建命令**
   - 向下滚动找到 **"Build & Development Settings"** 部分
   - 找到 **"Build Command"** 字段
   - **删除**现有的构建命令（如果有）
   - **输入**以下命令：
     ```bash
     prisma generate && prisma db push --accept-data-loss && next build
     ```
   - 或者使用：
     ```bash
     npm run vercel-build
     ```

4. **保存设置**
   - 点击页面底部的 **"Save"** 按钮

5. **重新部署**
   - 点击 **"Deployments"** 标签
   - 找到最新的部署记录
   - 点击右侧的 **"..."** 菜单
   - 选择 **"Redeploy"**
   - 或者推送新的代码到 GitHub，Vercel 会自动重新部署

### 方案 2：删除 migrations 目录（如果存在）

如果 `prisma/migrations` 目录在 Git 仓库中，需要删除它：

**步骤**：

1. **检查 migrations 目录是否在 Git 中**
   ```bash
   git ls-files | grep migrations
   ```

2. **如果存在，删除它**
   ```bash
   # 删除 migrations 目录（如果存在）
   git rm -r prisma/migrations
   git commit -m "Remove SQLite migrations for PostgreSQL migration"
   git push
   ```

3. **确保 .gitignore 忽略 migrations**
   - 检查 `.gitignore` 文件，确保包含：
     ```
     /prisma/migrations
     ```

### 方案 3：为 PostgreSQL 创建新的迁移（高级）

如果你需要迁移历史记录：

**步骤**：

1. **获取 Vercel 数据库连接字符串**
   - 在 Vercel 项目 → Settings → Environment Variables
   - 找到 `DATABASE_URL` 或 `POSTGRES_PRISMA_URL`
   - 复制连接字符串

2. **在本地创建迁移**
   ```bash
   # 设置环境变量（Windows PowerShell）
   $env:DATABASE_URL="postgresql://..."
   
   # 创建新的迁移
   npx prisma migrate dev --name init_postgresql
   ```

3. **提交并推送**
   ```bash
   git add prisma/migrations
   git commit -m "Add PostgreSQL migration"
   git push
   ```

4. **在 Vercel 重新部署**

## 🎯 推荐操作（最简单）

### 步骤 1：在 Vercel 项目设置中修改构建命令

1. 进入 Vercel Dashboard → 你的项目 → Settings → General
2. 找到 "Build & Development Settings"
3. 将 "Build Command" 修改为：
   ```bash
   prisma generate && prisma db push --accept-data-loss && next build
   ```
4. 保存设置

### 步骤 2：确保 migrations 目录被忽略

检查 `.gitignore` 文件，确保包含：
```
/prisma/migrations
```

### 步骤 3：重新部署

在 Vercel Dashboard 中：
- 点击 "Deployments" 标签
- 找到最新的部署
- 点击 "Redeploy"

或者推送代码到 GitHub：
```bash
git add .
git commit -m "Fix: Use db push instead of migrate deploy"
git push
```

## 📝 说明

### `prisma db push` vs `prisma migrate deploy`

- **`prisma db push`**：
  - 直接将 schema 同步到数据库
  - 不需要迁移文件
  - 适合快速开发和首次部署
  - 不会创建迁移历史
  - **推荐用于首次部署到 Vercel**

- **`prisma migrate deploy`**：
  - 需要迁移文件
  - 适合生产环境
  - 有完整的迁移历史
  - 可以版本控制
  - **需要先创建迁移文件**

### 为什么会出现这个错误？

1. 本地开发时使用了 SQLite，创建了 SQLite 迁移
2. 部署到 Vercel 时需要使用 PostgreSQL
3. Vercel 尝试运行 `prisma migrate deploy`，但发现迁移历史是 SQLite，而 schema 是 PostgreSQL
4. Prisma 检测到不匹配，抛出错误

## ⚠️ 注意事项

- 确保 `DATABASE_URL` 环境变量已正确配置
- 首次部署后，数据库表结构会自动创建
- 使用 `prisma db push` 不会创建迁移历史，如果需要迁移历史，请使用方案 3

## 🔄 后续步骤

部署成功后：
1. 验证数据库连接
2. 测试应用功能
3. 如果需要迁移历史，可以后续创建（见方案 3）

---

**如果问题仍然存在，请检查**：
1. Vercel 项目设置中的构建命令是否正确
2. `DATABASE_URL` 环境变量是否已配置
3. 是否有 migrations 目录在 Git 仓库中

