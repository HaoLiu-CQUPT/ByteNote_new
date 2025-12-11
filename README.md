# ByteNote

一个功能完整的在线笔记管理平台，支持 Markdown 编辑、实时预览、分类标签管理、搜索筛选等功能。

## ✨ 主要功能

- ✅ **用户系统**：注册、登录、退出登录，JWT 鉴权
- ✅ **笔记管理**：创建、编辑、删除、查看笔记
- ✅ **Markdown 编辑**：实时预览，支持常用语法
- ✅ **分类与标签**：完整的分类和标签管理
- ✅ **搜索筛选**：关键字搜索 + 分类/标签筛选
- ✅ **分页展示**：笔记列表分页浏览
- ✅ **响应式布局**：完美适配移动端和桌面端
- ✅ **主题切换**：支持浅色/深色主题
- ✅ **自动保存**：编辑时自动保存草稿
- ✅ **快捷键**：Ctrl+S / Cmd+S 快速保存
- ✅ **离线支持**：无网络时可编辑，网络恢复后自动同步
- ✅ **性能优化**：懒加载、首屏优化、分页加载

## 🚀 快速开始

### 前置要求

- Node.js 18+
- npm 或 yarn

### 安装步骤

1. **克隆项目**
```bash
git clone <your-repo-url>
cd ByteNote
```

2. **安装依赖**
```bash
npm install
```

3. **配置环境变量**

在项目根目录创建 `.env` 文件：

```env
# JWT 密钥（必须，用于用户认证）
JWT_SECRET=your-secret-key-here

# 数据库连接（开发环境使用 SQLite）
DATABASE_URL=file:./prisma/dev.db

# ModelScope API Key（可选，AI 功能暂未实现）
MODELSCOPE_API_KEY=
```

**生成 JWT 密钥**：
```bash
# Windows PowerShell
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# macOS / Linux
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

将生成的 64 位字符串替换 `your-secret-key-here`。

4. **初始化数据库**
```bash
npx prisma generate
npx prisma migrate dev --name init
```

5. **启动开发服务器**
```bash
npm run dev
```

6. **访问应用**

打开浏览器访问 [http://localhost:3000](http://localhost:3000)

## 📁 项目结构

```
.
├── app/                    # Next.js App Router 页面
│   ├── api/               # API 路由
│   ├── auth/              # 登录/注册页面
│   ├── notes/             # 笔记相关页面
│   ├── categories/         # 分类管理
│   └── tags/               # 标签管理
├── components/            # React 组件
│   ├── NoteEditor.tsx     # Markdown 编辑器
│   ├── NoteCard.tsx       # 笔记卡片
│   ├── UserMenu.tsx       # 用户菜单
│   ├── ThemeToggle.tsx   # 主题切换
│   └── OfflineSync.tsx   # 离线同步
├── lib/                   # 工具函数
│   ├── auth.ts           # 认证逻辑
│   ├── prisma.ts         # Prisma 客户端
│   └── offline.ts        # 离线存储
├── prisma/                # 数据库配置
│   └── schema.prisma     # 数据模型
└── public/                # 静态资源
    └── sw.js              # Service Worker
```

## 🛠️ 技术栈

- **框架**: Next.js 14 (App Router)
- **语言**: TypeScript
- **样式**: Tailwind CSS
- **数据库**: SQLite (开发) / PostgreSQL (生产)
- **ORM**: Prisma
- **认证**: JWT + HTTP-only Cookie
- **Markdown**: react-markdown

## 📝 开发命令

```bash
# 开发模式
npm run dev

# 构建生产版本
npm run build

# 启动生产服务器
npm start

# 代码检查
npm run lint

# 代码格式化
npm run format

# Prisma 生成客户端
npm run prisma:generate

# Prisma 数据库迁移
npm run prisma:migrate
```

## 📖 使用说明

### 注册和登录

1. 访问 `/auth/register` 注册新账号
2. 填写邮箱、昵称、密码
3. 注册成功后跳转到登录页
4. 登录后即可开始使用

### 创建笔记

1. 点击"新建笔记"
2. 输入标题和 Markdown 内容
3. 选择分类和标签（可选）
4. 左侧编辑，右侧实时预览
5. 点击"保存笔记"或按 `Ctrl+S` / `Cmd+S`

### 管理分类和标签

1. 访问"分类"或"标签"页面
2. 创建、编辑、删除分类/标签
3. 在笔记编辑时选择分类和标签

### 搜索和筛选

1. 在笔记列表页输入关键字搜索
2. 选择分类下拉筛选
3. 点击标签按钮多选筛选
4. 支持组合搜索

### 离线编辑

- 无网络时仍可创建和编辑笔记
- 内容自动保存到本地
- 网络恢复后自动同步到服务器
- 右下角显示同步状态

## 🎨 功能特性

### 已实现

- ✅ 用户注册/登录/退出
- ✅ 笔记 CRUD 操作
- ✅ Markdown 编辑与实时预览
- ✅ 分类和标签管理
- ✅ 搜索与筛选
- ✅ 分页展示
- ✅ 响应式布局
- ✅ 主题切换（浅色/深色）
- ✅ 自动保存草稿
- ✅ 快捷键操作（Ctrl+S）
- ✅ 离线编辑与同步
- ✅ 性能优化（懒加载、首屏优化）

### 待实现（可选）

- ⏳ 协同编辑（多用户实时编辑）
- ⏳ 笔记导出（PDF、Markdown）
- ⏳ 笔记分享链接
- ⏳ 全文搜索优化
- ⏳ 线上真实部署
- ⏳ 融合AI

## 🔧 常见问题

**Q: 找不到 `.env` 文件？**
- Windows：确保文件资源管理器显示隐藏文件（查看 → 显示 → 隐藏的项目）
- 确保文件在项目根目录，与 `package.json` 同级

**Q: 环境变量不生效？**
- 确保 `.env` 文件在项目根目录
- 重启开发服务器（环境变量只在启动时读取）
- 检查 `.env` 文件格式是否正确（无多余空格、正确换行）

**Q: 数据库迁移失败？**
- 确保已运行 `npx prisma generate`
- 检查 `DATABASE_URL` 是否正确
- 删除 `prisma/dev.db` 后重新运行迁移


**享受记录知识的乐趣！** 📚✨
