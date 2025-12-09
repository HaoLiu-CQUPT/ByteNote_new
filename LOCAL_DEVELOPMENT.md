# 本地开发环境配置

## 使用 SQLite（本地开发）

由于项目已配置为使用 PostgreSQL（用于 Vercel 部署），如果你想在本地开发时继续使用 SQLite，可以按照以下步骤操作：

### 方法 1：使用 schema.sqlite.prisma（推荐）

1. **备份当前的 schema.prisma**：
```bash
cp prisma/schema.prisma prisma/schema.postgresql.prisma
```

2. **使用 SQLite schema**：
```bash
cp prisma/schema.sqlite.prisma prisma/schema.prisma
```

3. **更新 .env 文件**：
```env
DATABASE_URL=file:./prisma/dev.db
```

4. **重新生成 Prisma Client**：
```bash
npx prisma generate
```

5. **运行迁移**：
```bash
npx prisma migrate dev
```

### 方法 2：使用 PostgreSQL（推荐用于生产环境一致性）

#### 使用 Docker 运行 PostgreSQL

1. **创建 docker-compose.yml**：
```yaml
version: '3.8'
services:
  postgres:
    image: postgres:15
    environment:
      POSTGRES_USER: bytenote
      POSTGRES_PASSWORD: bytenote
      POSTGRES_DB: bytenote
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

2. **启动 PostgreSQL**：
```bash
docker-compose up -d
```

3. **更新 .env 文件**：
```env
DATABASE_URL=postgresql://bytenote:bytenote@localhost:5432/bytenote
```

4. **运行迁移**：
```bash
npx prisma migrate dev
```

#### 使用本地安装的 PostgreSQL

1. **安装 PostgreSQL**（如果还没有）：
   - Windows: 下载并安装 [PostgreSQL](https://www.postgresql.org/download/windows/)
   - macOS: `brew install postgresql`
   - Linux: `sudo apt install postgresql`

2. **创建数据库**：
```bash
createdb bytenote
```

3. **更新 .env 文件**：
```env
DATABASE_URL=postgresql://用户名:密码@localhost:5432/bytenote
```

4. **运行迁移**：
```bash
npx prisma migrate dev
```

## 切换回 PostgreSQL（部署前）

在推送到 GitHub 之前，确保使用 PostgreSQL schema：

```bash
# 如果使用了 SQLite schema，切换回 PostgreSQL
cp prisma/schema.postgresql.prisma prisma/schema.prisma

# 重新生成 Prisma Client
npx prisma generate
```

## 注意事项

- **Vercel 部署必须使用 PostgreSQL**，所以主 schema.prisma 文件应该使用 PostgreSQL
- 本地开发可以使用 SQLite 或 PostgreSQL
- 如果使用 SQLite，某些 PostgreSQL 特有的功能可能不可用
- 建议在本地也使用 PostgreSQL，以确保与生产环境一致


