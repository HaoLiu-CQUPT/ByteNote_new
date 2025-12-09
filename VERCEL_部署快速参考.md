# Vercel 部署快速参考

这是一个简化的快速参考指南，详细步骤请查看 [VERCEL_DEPLOY_STEPS.md](./VERCEL_DEPLOY_STEPS.md)。

## 🚀 5 步快速部署

### 1️⃣ 推送代码到 GitHub

```bash
git add .
git commit -m "准备部署"
git push origin main
```

### 2️⃣ 在 Vercel 创建项目

1. 访问 [vercel.com](https://vercel.com) 并登录
2. 点击 **"Add New..."** → **"Project"**
3. 选择你的 GitHub 仓库
4. 点击 **"Import"**

### 3️⃣ 创建 Postgres 数据库

在项目配置页面或项目 Dashboard：

1. 找到 **"Storage"** 标签
2. 点击 **"Create Database"** → 选择 **"Postgres"**
3. 选择区域（建议：**Hong Kong (hkg1)**）
4. 点击 **"Create"**，等待 1-2 分钟

### 4️⃣ 配置环境变量

在 **Settings** → **Environment Variables** 添加：

| 变量名 | 值 | 说明 |
|--------|-----|------|
| `DATABASE_URL` | `$POSTGRES_PRISMA_URL` | 数据库连接（自动引用） |
| `JWT_SECRET` | `生成的密钥` | 见下方命令 |
| `MODELSCOPE_API_KEY` | `你的Token` | 可选，AI 功能需要 |

**生成 JWT_SECRET**：
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

**重要**：确保所有环境变量都添加到所有环境（Production、Preview、Development）

### 5️⃣ 部署

1. 确认环境变量已添加
2. 点击 **"Deploy"** 按钮
3. 等待 2-5 分钟
4. 访问提供的 URL 测试

## ✅ 验证部署

1. 访问应用 URL
2. 注册一个新账号
3. 创建一条测试笔记
4. 如果都成功，说明部署成功！

## ⚠️ 常见问题

### 部署失败 - DATABASE_URL 未找到

**解决**：
1. 确认数据库已创建
2. 确认 `DATABASE_URL` = `$POSTGRES_PRISMA_URL`
3. 确认环境变量已添加到所有环境
4. 重新部署

### 找不到 Storage 标签

**解决**：
- 尝试在 **Settings** → 左侧菜单查找 **"Storage"**
- 或使用外部数据库（Supabase、Neon 等）

### 环境变量不生效

**解决**：
- 修改环境变量后必须**重新部署**才能生效
- 确认变量已添加到所有环境

## 📚 详细文档

- **完整部署指南**：[VERCEL_DEPLOY_STEPS.md](./VERCEL_DEPLOY_STEPS.md)
- **数据库配置问题**：[VERCEL_FIX_DATABASE_URL.md](./VERCEL_FIX_DATABASE_URL.md)
- **本地开发配置**：[LOCAL_DEVELOPMENT.md](./LOCAL_DEVELOPMENT.md)

## 🎯 检查清单

部署前确认：

- [ ] 代码已推送到 GitHub
- [ ] Vercel 项目已创建
- [ ] Postgres 数据库已创建
- [ ] `DATABASE_URL` = `$POSTGRES_PRISMA_URL`（已添加）
- [ ] `JWT_SECRET` = `64字符密钥`（已添加）
- [ ] `MODELSCOPE_API_KEY` = `Token`（可选，已添加）
- [ ] 所有环境变量已添加到所有环境
- [ ] 部署成功
- [ ] 可以注册和登录
- [ ] 可以创建笔记

---

**需要帮助？** 查看 [VERCEL_DEPLOY_STEPS.md](./VERCEL_DEPLOY_STEPS.md) 中的"常见问题排查"部分。

