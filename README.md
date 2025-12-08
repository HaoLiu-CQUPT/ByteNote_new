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
- ✅ **性能优化**：懒加载、首屏优化
- ✅ **AI 检索**：支持自然语言查询并返回语义相关的笔记内容
- ✅ **AI 摘要**：自动生成笔记摘要，快速了解笔记内容
- ✅ **主题聚合**：AI 自动分析笔记，将相关主题的笔记分组展示

## 🚀 快速开始

### 前置要求

- Node.js 18+ 
- npm 或 yarn

### 安装步骤

1. **克隆项目**
```bash
git clone <your-repo-url>
cd 前端
```

2. **安装依赖**
```bash
npm install
```

3. **配置环境变量**
   
   这是**非常重要**的一步，必须完成才能运行项目。详细步骤请参考下面的 [环境变量配置](#-环境变量配置) 章节。
   
   **快速操作**：
   - 在项目根目录（与 `package.json` 同级）创建 `.env` 文件
   - 复制下面的模板内容到 `.env` 文件中
   - 替换 `JWT_SECRET` 的值（使用步骤 3.1 生成的密钥）
   - 如需使用 AI 功能，添加 `MODELSCOPE_API_KEY`
   
   **详细步骤请往下看 [环境变量配置](#-环境变量配置) 章节**

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
│   ├── categories/        # 分类管理
│   └── tags/              # 标签管理
├── components/            # React 组件
│   ├── NoteEditor.tsx     # Markdown 编辑器
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
    └── sw.js             # Service Worker
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

# 检查格式化
npm run format:check

# Prisma 生成客户端
npm run prisma:generate

# Prisma 数据库迁移
npm run prisma:migrate
```

## 🌐 部署

### Vercel 部署（推荐）

1. 将代码推送到 GitHub
2. 在 [Vercel](https://vercel.com) 导入项目
3. 配置环境变量：
   - `JWT_SECRET`: JWT 加密密钥
   - `DATABASE_URL`: 数据库连接（使用 Vercel Postgres）
4. 部署完成

详细部署说明请查看 [DEPLOYMENT.md](./DEPLOYMENT.md)

## 🔐 环境变量配置

### 步骤 1：创建 `.env` 文件

在项目根目录（与 `package.json` 同级）创建 `.env` 文件。

#### Windows 系统

**方法一：使用命令行**
```powershell
# 在项目根目录打开 PowerShell
cd "c:\Users\刘昊\Desktop\前端"
New-Item -Path .env -ItemType File
```

**方法二：使用文件管理器**
1. 打开项目文件夹
2. 右键点击空白处 → 新建 → 文本文档
3. 将文件重命名为 `.env`（注意：文件名以点开头，没有扩展名）
4. 如果系统提示"如果改变文件扩展名，可能会导致文件不可用"，点击"是"

#### macOS / Linux 系统

```bash
# 在项目根目录执行
touch .env
```

### 步骤 2：配置环境变量

#### 2.1 打开 `.env` 文件

**Windows 系统：**
- 在项目文件夹中找到 `.env` 文件
- 如果看不到文件，需要显示隐藏文件：
  - 文件资源管理器 → 查看 → 显示 → 隐藏的项目
- 右键点击 `.env` 文件 → 打开方式 → 选择"记事本"或"VS Code"或其他文本编辑器

**macOS / Linux 系统：**
- 在终端中执行：`code .env`（如果使用 VS Code）
- 或使用其他文本编辑器打开

#### 2.2 编辑文件内容

在 `.env` 文件中，**完全替换**所有内容为以下内容：

```env
# JWT 密钥（用于用户认证，必须设置）
JWT_SECRET=your-secret-key-change-in-production

# 数据库连接（开发环境使用 SQLite）
DATABASE_URL=file:./prisma/dev.db

# ModelScope API Key（可选，用于 AI 功能）
MODELSCOPE_API_KEY=your-modelscope-token-here
```

**操作步骤：**
1. 选中 `.env` 文件中的所有内容（`Ctrl+A`）
2. 删除所有内容（`Delete` 键）
3. 复制上面的模板内容
4. 粘贴到文件中（`Ctrl+V`）
5. 保存文件（`Ctrl+S`）

**重要提示：**
- 每行一个配置项
- `=` 号两边**不要有空格**（错误：`KEY = value`，正确：`KEY=value`）
- 注释行以 `#` 开头，可以忽略
- 不要删除任何行（即使暂时不配置 AI 功能，也要保留 `MODELSCOPE_API_KEY=` 这一行，等号后面可以为空）

**文件内容示例（复制后）：**
```
# JWT 密钥（用于用户认证，必须设置）
JWT_SECRET=your-secret-key-change-in-production

# 数据库连接（开发环境使用 SQLite）
DATABASE_URL=file:./prisma/dev.db

# ModelScope API Key（可选，用于 AI 功能）
MODELSCOPE_API_KEY=your-modelscope-token-here
```

#### 2.3 保存文件

- 按 `Ctrl+S`（Windows）或 `Cmd+S`（macOS）保存
- 确保文件已保存（编辑器标题栏如果没有 `*` 号，说明已保存）

#### 2.4 检查文件位置

确保 `.env` 文件在项目根目录，与以下文件在同一级：
- `package.json`
- `README.md`
- `next.config.mjs`

**文件结构应该是：**
```
前端/
├── .env          ← 在这里
├── package.json
├── README.md
├── app/
├── components/
└── ...
```

### 步骤 3：生成并配置 JWT 密钥

JWT 密钥用于用户登录认证，必须设置一个安全的随机字符串。

#### 3.1 生成 JWT 密钥

**Windows PowerShell：**
1. 打开 PowerShell（在项目文件夹中，按住 `Shift` 键，右键点击空白处 → "在此处打开 PowerShell 窗口"）
2. 执行以下命令：
```powershell
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```
3. 会输出一串类似这样的字符：`a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6`
4. **复制这串字符**（选中后按 `Ctrl+C`）

**macOS / Linux：**
1. 打开终端，进入项目目录
2. 执行以下命令：
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```
3. 复制输出的字符串

#### 3.2 将密钥添加到 `.env` 文件

1. 打开 `.env` 文件（参考步骤 2.1）
2. 找到这一行：`JWT_SECRET=your-secret-key-change-in-production`
3. 将 `your-secret-key-change-in-production` **替换**为你刚才复制的密钥
4. 例如，如果生成的密钥是 `a1b2c3d4...`，那么这一行应该变成：
   ```env
   JWT_SECRET=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6
   ```
5. 保存文件（`Ctrl+S` 或 `Cmd+S`）

**注意：**
- 密钥必须是随机生成的，不要使用示例中的密钥
- 密钥长度应该是 64 个字符（32 字节的十六进制表示）
- 不要泄露这个密钥，它用于保护用户登录安全

### 步骤 4：获取 ModelScope API Key（可选，用于 AI 功能）

ModelScope（魔塔社区）是阿里云提供的 AI 模型服务平台，支持 DeepSeek-V3.2 等模型，提供 OpenAI 兼容的 API。

1. **注册 ModelScope 账号**
   - 访问 [ModelScope 官网](https://www.modelscope.cn/)
   - 注册账号并完成认证

2. **获取 API Token**
   - 登录 ModelScope 平台
   - 进入个人中心 → "API Token" 或 "访问令牌"
   - 点击 "创建 Token" 或查看现有 Token
   - **重要**：立即复制 Token，妥善保存（页面关闭后无法再次查看）

3. **配置环境变量**
   
   将获取到的 Token 添加到 `.env` 文件中：
   
   1. 打开 `.env` 文件（参考步骤 2.1）
   2. 找到这一行：`MODELSCOPE_API_KEY=your-modelscope-token-here`
   3. 将 `your-modelscope-token-here` **替换**为你从 ModelScope 复制的 Token
   4. 例如，如果 Token 是 `sk-abc123...`，那么这一行应该变成：
      ```env
      MODELSCOPE_API_KEY=sk-abc123def456...
      ```
   5. 保存文件（`Ctrl+S` 或 `Cmd+S`）
   
   **注意：**
   - 如果暂时不使用 AI 功能，可以保留 `MODELSCOPE_API_KEY=`（等号后面为空）
   - Token 格式通常是 `sk-` 开头的字符串
   - 不要泄露这个 Token，它用于调用 AI API

4. **了解费用（可选）**
   - ModelScope API 由阿里云百炼提供，可能有免费额度
   - 建议查看 ModelScope 平台的计费说明
   - 根据使用量设置预算限制

**注意**：
- `MODELSCOPE_API_KEY` 是可选的。如果不设置，AI 功能将不可用，但其他功能正常
- API 调用可能产生费用，请妥善保管 Token，不要提交到代码仓库
- 建议在 `.gitignore` 中已包含 `.env` 文件
- 使用的模型：`deepseek-ai/DeepSeek-V3.2`（对话）和 `deepseek-embedding-v3`（嵌入向量）
- 详细文档可参考：[ModelScope 官方文档](https://www.modelscope.cn/)

### 步骤 5：验证配置

#### 5.1 检查 `.env` 文件格式

打开 `.env` 文件，检查以下几点：

✅ **正确的格式示例：**
```env
JWT_SECRET=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6
DATABASE_URL=file:./prisma/dev.db
MODELSCOPE_API_KEY=sk-your-token-here
```

❌ **常见错误：**
- `JWT_SECRET = value`（等号两边有空格）→ 应该是 `JWT_SECRET=value`
- `JWT_SECRET=value `（值后面有空格）→ 删除末尾空格
- 缺少某一行 → 确保三行都存在
- 使用了中文引号 → 使用英文引号或不用引号

#### 5.2 最终检查清单

在继续之前，确认：

- [ ] `.env` 文件在项目根目录（与 `package.json` 同级）
- [ ] `JWT_SECRET=` 后面有 64 个字符的密钥（不是 `your-secret-key-change-in-production`）
- [ ] `DATABASE_URL=file:./prisma/dev.db` 这一行存在且正确
- [ ] `MODELSCOPE_API_KEY=` 这一行存在（如果使用 AI 功能，后面要有 Token）
- [ ] 文件已保存（编辑器标题栏没有 `*` 号）

#### 5.3 重启开发服务器

**重要：修改 `.env` 文件后，必须重启服务器才能生效！**

1. 如果服务器正在运行，按 `Ctrl+C` 停止
2. 重新启动：
   ```bash
   npm run dev
   ```

#### 5.4 测试配置

1. **测试基础功能：**
   - 访问 [http://localhost:3000](http://localhost:3000)
   - 尝试注册一个新账号
   - 如果能成功注册和登录，说明 `JWT_SECRET` 配置正确

2. **测试 AI 功能（如果配置了）：**
   - 登录后，访问笔记列表页
   - 切换到 "🤖 AI 搜索" 模式
   - 如果显示配置错误提示，说明 `MODELSCOPE_API_KEY` 未正确设置
   - 如果可以使用，说明配置成功

3. **如果遇到错误：**
   - 检查浏览器控制台（F12）的错误信息
   - 检查终端中的错误信息
   - 确认 `.env` 文件格式正确
   - 确认已重启服务器

### 完整示例 `.env` 文件

```env
# ============================================
# ByteNote - 环境变量配置
# ============================================

# JWT 密钥（必须）
# 使用上面的命令生成一个随机密钥
JWT_SECRET=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6

# 数据库连接（开发环境）
DATABASE_URL=file:./prisma/dev.db

# ModelScope API Key（可选，用于 AI 功能）
# 获取方式：https://www.modelscope.cn/ - ModelScope 魔塔社区
MODELSCOPE_API_KEY=your-modelscope-token-here
```

### 常见问题

**Q: 找不到 `.env` 文件？**
- Windows：确保文件资源管理器显示隐藏文件（查看 → 显示 → 隐藏的项目）
- 确保文件在项目根目录，与 `package.json` 同级

**Q: 环境变量不生效？**
- 确保 `.env` 文件在项目根目录
- 重启开发服务器（环境变量只在启动时读取）
- 检查 `.env` 文件格式是否正确（无多余空格、正确换行）

**Q: AI 功能提示未配置？**
- 检查 `MODELSCOPE_API_KEY` 是否正确设置
- 确保 API Token 格式正确
- 检查 ModelScope 账号是否有可用额度

**Q: 如何查看当前环境变量？**
- 在代码中：`console.log(process.env.MODELSCOPE_API_KEY)`
- 注意：不要在生产环境打印敏感信息

### 生产环境配置

生产环境（如 Vercel、Railway 等）需要在平台的环境变量设置中配置：

1. **Vercel**
   - 项目设置 → Environment Variables
   - 添加 `JWT_SECRET`、`DATABASE_URL`、`MODELSCOPE_API_KEY`

2. **Railway**
   - 项目 → Variables
   - 添加相应的环境变量

3. **其他平台**
   - 参考平台文档，在环境变量设置中添加上述变量

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

**📖 详细测试步骤请查看 [OFFLINE_TESTING_GUIDE.md](./OFFLINE_TESTING_GUIDE.md)**

**🤖 AI 功能使用指南请查看 [AI_FEATURES_GUIDE.md](./AI_FEATURES_GUIDE.md)**
- 右下角显示同步状态

### AI 功能

> **前置要求**：使用 AI 功能前，需要先配置 `MODELSCOPE_API_KEY` 环境变量。详细配置方法请参考 [环境变量配置](#-环境变量配置) 章节。

#### AI 语义搜索

1. 在笔记列表页，切换到 "🤖 AI 搜索" 模式
2. 用自然语言描述你想找的内容，例如：
   - "关于 React 的笔记"
   - "学习计划相关的笔记"
   - "记录会议内容的笔记"
3. AI 会理解你的意图，返回语义相关的笔记
4. 搜索结果按相似度排序，最相关的笔记排在前面

**使用技巧**：
- 使用自然语言，不需要精确的关键词匹配
- 可以描述概念、主题或内容类型
- 首次使用需要等待几秒，系统会为笔记生成向量索引

#### AI 摘要

1. 打开任意笔记详情页
2. 点击 "🤖 生成摘要" 按钮
3. AI 会自动分析笔记内容，生成简洁的摘要（不超过 150 字）
4. 摘要会自动保存到数据库，下次查看时直接显示在笔记顶部

**使用场景**：
- 快速了解长笔记的主要内容
- 为笔记添加智能摘要，方便后续查找
- 摘要会随笔记内容更新而更新（需要重新生成）

#### 主题聚合

1. 访问 "🤖 AI 功能" 页面（导航栏中的 "🤖 AI 功能"）
2. 在 "主题聚合" 标签页，点击 "重新分析" 按钮
3. AI 会自动分析你的笔记内容，识别共同主题
4. 将相关主题的笔记分组展示，帮助你发现笔记之间的关联

**功能说明**：
- 自动识别笔记中的主题和概念
- 将相关笔记归类到同一主题下
- 每个主题显示包含的笔记数量
- 可以点击笔记卡片查看详细内容

**注意事项**：
- 主题聚合需要一定数量的笔记才能有效工作（建议至少 5 条笔记）
- 分析过程可能需要几秒到几十秒，取决于笔记数量
- 如果笔记内容差异很大，可能不会产生明显的主题分组

## 🎨 功能特性

### 已实现

- ✅ 用户注册/登录/退出
- ✅ 笔记 CRUD 操作
- ✅ Markdown 编辑与实时预览
- ✅ 分类和标签管理
- ✅ 搜索与筛选
- ✅ 分页展示
- ✅ 响应式布局
- ✅ 主题切换
- ✅ 自动保存草稿
- ✅ 快捷键操作
- ✅ 离线编辑与同步
- ✅ 性能优化（懒加载）
- ✅ AI 语义搜索
- ✅ AI 摘要生成
- ✅ AI 主题聚合

### 待实现（可选）

- ⏳ 协同编辑（多用户实时编辑）
- ⏳ 笔记导出（PDF、Markdown）
- ⏳ 笔记分享链接
- ⏳ 全文搜索优化

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

MIT License

## 📧 联系方式

如有问题或建议，请提交 Issue。

---

**享受记录知识的乐趣！** 📚✨

