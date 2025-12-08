# Vercel 部署快速指南

## 🚀 5 分钟快速部署

### 第一步：推送到 GitHub

```bash
git add .
git commit -m "Prepare for Vercel deployment"
git push origin main
```

### 第二步：在 Vercel 创建项目

1. 访问 [vercel.com](https://vercel.com) 并登录
2. 点击 "Add New..." → "Project"
3. 选择你的 GitHub 仓库
4. 点击 "Import"

### 第三步：创建 Postgres 数据库

1. 在项目配置页面，找到 "Storage" 或 "Databases"
2. 点击 "Create Database" → 选择 "Postgres"
3. 选择区域（建议：Hong Kong）
4. 点击 "Create"

### 第四步：配置环境变量

在 "Environment Variables" 部分添加：

| 变量名 | 值 | 说明 |
|--------|-----|------|
| `DATABASE_URL` | `$POSTGRES_PRISMA_URL` | 从 Postgres 数据库自动获取 |
| `JWT_SECRET` | `生成一个随机密钥` | 见下方命令 |

**生成 JWT_SECRET**：
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

**可选 - AI 功能**：
| 变量名 | 值 |
|--------|-----|
| `MODELSCOPE_API_KEY` | `你的 ModelScope Token` |

### 第五步：部署

1. 确认所有环境变量已添加
2. 点击 "Deploy"
3. 等待 2-5 分钟
4. 访问提供的 URL

## ✅ 验证部署

1. 访问应用 URL（如：`https://your-project.vercel.app`）
2. 注册一个新账号
3. 创建一条测试笔记
4. 如果都成功，说明部署成功！

## 📚 详细文档

- **完整部署指南**：查看 [VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md)
- **本地开发配置**：查看 [LOCAL_DEVELOPMENT.md](./LOCAL_DEVELOPMENT.md)

## ⚠️ 重要提示

1. **数据库**：Vercel 必须使用 PostgreSQL，不能使用 SQLite
2. **环境变量**：确保添加到所有环境（Production、Preview、Development）
3. **重新部署**：修改环境变量后需要重新部署
4. **自动部署**：每次推送到 GitHub 主分支会自动重新部署

## 🆘 遇到问题？

查看 [VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md) 中的"常见问题排查"部分。

