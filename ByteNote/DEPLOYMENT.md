# 部署指南

## Vercel 部署（推荐）

### 前置要求
- GitHub 账号
- Vercel 账号（可免费注册）

### 部署步骤

#### 1. 准备代码
确保代码已推送到 GitHub 仓库。

#### 2. 在 Vercel 部署

1. **登录 Vercel**
   - 访问 [vercel.com](https://vercel.com)
   - 使用 GitHub 账号登录

2. **导入项目**
   - 点击 "Add New Project"
   - 选择你的 GitHub 仓库
   - Vercel 会自动检测 Next.js 项目

3. **配置环境变量**
   - 在项目设置中添加环境变量：
     ```
     JWT_SECRET=your-secret-key-here-change-in-production
     ```
   - 点击 "Deploy"

4. **等待部署完成**
   - Vercel 会自动构建和部署
   - 部署完成后会提供访问链接（如：`https://your-project.vercel.app`）

#### 3. 数据库配置

**注意**：Vercel 是无服务器环境，SQLite 文件系统是只读的。需要：

**方案 A：使用 Vercel Postgres（推荐）**
1. 在 Vercel 项目设置中启用 Postgres
2. 修改 `prisma/schema.prisma`：
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```
3. 运行迁移：`npx prisma migrate deploy`

**方案 B：使用外部数据库服务**
- 使用 Supabase、PlanetScale 等云数据库
- 更新 `DATABASE_URL` 环境变量

#### 4. 更新 Prisma 配置（如果使用 Postgres）

```prisma
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

### 自动部署

每次推送到 GitHub 主分支，Vercel 会自动重新部署。

---

## 其他部署方式

### Railway 部署

1. 访问 [railway.app](https://railway.app)
2. 使用 GitHub 登录
3. 创建新项目，选择 GitHub 仓库
4. 添加环境变量：
   - `JWT_SECRET`
   - `DATABASE_URL`（Railway 会自动提供 Postgres）
5. 部署完成

### 云服务器部署（Ubuntu）

#### 1. 服务器准备
```bash
# 更新系统
sudo apt update && sudo apt upgrade -y

# 安装 Node.js 18+
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# 安装 PM2（进程管理）
sudo npm install -g pm2

# 安装 Nginx（反向代理）
sudo apt install -y nginx
```

#### 2. 克隆项目
```bash
cd /var/www
sudo git clone https://github.com/your-username/your-repo.git
cd your-repo
sudo npm install
```

#### 3. 配置环境变量
```bash
sudo nano .env
```
添加：
```
JWT_SECRET=your-secret-key
DATABASE_URL=file:./dev.db
NODE_ENV=production
```

#### 4. 构建和启动
```bash
# 生成 Prisma Client
npx prisma generate

# 运行迁移
npx prisma migrate deploy

# 构建项目
npm run build

# 使用 PM2 启动
pm2 start npm --name "notes-platform" -- start
pm2 save
pm2 startup
```

#### 5. 配置 Nginx
```bash
sudo nano /etc/nginx/sites-available/notes-platform
```

添加配置：
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

启用配置：
```bash
sudo ln -s /etc/nginx/sites-available/notes-platform /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

#### 6. 配置 SSL（Let's Encrypt）
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

---

## 环境变量说明

| 变量名 | 说明 | 必需 | 默认值 |
|--------|------|------|--------|
| `JWT_SECRET` | JWT 加密密钥 | ✅ | `dev-secret-change-me` |
| `DATABASE_URL` | 数据库连接字符串 | ✅ | `file:./dev.db` |
| `NODE_ENV` | 运行环境 | ❌ | `development` |

---

## 部署检查清单

- [ ] 代码已推送到 GitHub
- [ ] 环境变量已配置（JWT_SECRET）
- [ ] 数据库已配置（Postgres 或其他）
- [ ] Prisma 迁移已运行
- [ ] 构建成功（`npm run build`）
- [ ] 域名已配置（可选）
- [ ] SSL 证书已配置（生产环境必需）

---

## 常见问题

### Q: Vercel 部署后数据库连接失败？
A: Vercel 不支持 SQLite，需要使用 Postgres 或其他云数据库。

### Q: 如何更新已部署的应用？
A: 推送到 GitHub 主分支，Vercel 会自动重新部署。

### Q: 如何查看部署日志？
A: 在 Vercel 项目页面点击 "Deployments" → 选择部署 → 查看日志。

### Q: 生产环境如何设置 JWT_SECRET？
A: 使用强随机字符串，建议 32 字符以上：
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

## 访问说明

部署成功后，访问地址：
- **Vercel**: `https://your-project.vercel.app`
- **Railway**: `https://your-project.railway.app`
- **自定义域名**: `https://your-domain.com`

首次访问需要：
1. 注册账号
2. 登录后开始使用

