# 修复 Prisma 迁移错误：Provider 不匹配

## 🔴 错误信息

```
Error: P3019
The datasource provider `postgresql` specified in your schema does not match 
the one specified in the migration_lock.toml, `sqlite`.
```

## ✅ 解决方案

### 方案 1：删除旧迁移，让 Vercel 自动创建（推荐）

**步骤**：

1. **已删除旧的 SQLite 迁移**（已完成）

2. **修改构建命令**，使用 `prisma db push` 而不是 `prisma migrate deploy`：
   - 在 Vercel 项目 Settings → General → Build & Development Settings
   - 将 Build Command 修改为：
     ```bash
     prisma generate && prisma db push && next build
     ```
   - 或者，更新 `package.json` 中的 `vercel-build` 脚本

3. **重新部署**

**优点**：
- 简单快速
- 不需要本地 PostgreSQL
- Vercel 会自动创建表结构

**缺点**：
- 没有迁移历史记录
- 不适合需要版本控制的迁移

### 方案 2：创建新的 PostgreSQL 迁移（推荐用于生产环境）

**步骤**：

1. **确保有 PostgreSQL 数据库**：
   - 使用 Vercel Postgres（已在 Vercel 创建）
   - 或使用 Supabase、Neon 等外部服务

2. **获取数据库连接字符串**：
   - 从 Vercel 环境变量中获取 `DATABASE_URL` 或 `POSTGRES_PRISMA_URL`

3. **在本地创建迁移**：
   ```bash
   # 设置 DATABASE_URL（使用 Vercel 的数据库连接字符串）
   $env:DATABASE_URL="postgresql://..."
   
   # 创建新的迁移
   npx prisma migrate dev --name init_postgresql
   ```

4. **提交并推送**：
   ```bash
   git add prisma/migrations
   git commit -m "Add PostgreSQL migration"
   git push
   ```

5. **在 Vercel 重新部署**

**优点**：
- 有完整的迁移历史
- 适合生产环境
- 可以版本控制

**缺点**：
- 需要本地有 PostgreSQL 或访问 Vercel 数据库

### 方案 3：使用 prisma migrate deploy --skip-seed（最简单）

**步骤**：

1. **更新 vercel.json 或 package.json**：
   ```json
   {
     "scripts": {
       "vercel-build": "prisma generate && prisma migrate deploy --skip-seed && next build"
     }
   }
   ```

2. **但是**，由于没有迁移文件，这会失败

3. **更好的方法**：使用 `prisma db push`（见方案 1）

---

## 🎯 推荐操作（最简单）

### 步骤 1：更新构建命令

**方法 A：在 Vercel 项目设置中修改**

1. 进入 Vercel 项目 → Settings → General
2. 找到 "Build & Development Settings"
3. 将 "Build Command" 修改为：
   ```bash
   prisma generate && prisma db push && next build
   ```

**方法 B：更新 package.json**

更新 `package.json` 中的 `vercel-build` 脚本：

```json
{
  "scripts": {
    "vercel-build": "prisma generate && prisma db push && next build"
  }
}
```

### 步骤 2：提交更改

```bash
git add .
git commit -m "Fix: Remove SQLite migrations, use db push for PostgreSQL"
git push
```

### 步骤 3：重新部署

Vercel 会自动重新部署，这次应该会成功。

---

## 📝 说明

### `prisma db push` vs `prisma migrate deploy`

- **`prisma db push`**：
  - 直接将 schema 同步到数据库
  - 不需要迁移文件
  - 适合快速开发和首次部署
  - 不会创建迁移历史

- **`prisma migrate deploy`**：
  - 需要迁移文件
  - 适合生产环境
  - 有完整的迁移历史
  - 可以版本控制

对于首次部署到 Vercel，使用 `prisma db push` 是最简单的方法。

---

## 🔄 后续：创建迁移历史（可选）

如果以后需要迁移历史，可以：

1. 在本地连接到 Vercel 数据库
2. 运行 `npx prisma migrate dev --name init`
3. 这会基于当前数据库状态创建迁移文件
4. 提交到 Git

---

## ⚠️ 注意事项

- 删除 migrations 目录后，需要重新创建迁移或使用 `db push`
- 确保 `DATABASE_URL` 环境变量已正确配置
- 首次部署后，数据库表结构会自动创建


