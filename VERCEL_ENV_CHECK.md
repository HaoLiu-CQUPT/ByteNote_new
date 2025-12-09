# Vercel 环境变量配置检查清单

## ✅ 当前配置状态

从你的 Vercel 环境变量页面，我看到：

- ✅ `POSTGRES_URL` - 已添加
- ✅ `PRISMA_DATABASE_URL` - 已添加（这是 Vercel Postgres 自动创建的）
- ✅ `DATABASE_URL` - 已添加

## 🔍 需要检查的关键点

### 1. 检查 `DATABASE_URL` 的值

**重要**：`DATABASE_URL` 的值必须正确设置，否则 Prisma 无法连接数据库。

**正确的配置方式**：

#### 方式 A：使用 Vercel 的变量引用（推荐）

1. 点击 `DATABASE_URL` 右侧的编辑图标（铅笔图标）
2. 检查 Value 字段的值
3. **应该设置为**：`$PRISMA_DATABASE_URL`
   - 注意：Vercel 可能自动创建的是 `PRISMA_DATABASE_URL` 而不是 `POSTGRES_PRISMA_URL`
   - 如果看到的是 `PRISMA_DATABASE_URL`，那么 `DATABASE_URL` 应该引用它

#### 方式 B：直接使用连接字符串

如果 `PRISMA_DATABASE_URL` 的值是完整的连接字符串，你也可以：
1. 点击 `PRISMA_DATABASE_URL` 右侧的眼睛图标查看实际值
2. 复制这个值
3. 将 `DATABASE_URL` 的值设置为相同的连接字符串

### 2. 验证环境变量设置

**检查步骤**：

1. **点击 `DATABASE_URL` 右侧的编辑图标**
2. **查看 Value 字段**：
   - 如果显示 `$PRISMA_DATABASE_URL` → ✅ 正确
   - 如果显示完整的连接字符串（以 `postgresql://` 开头）→ ✅ 也正确
   - 如果显示为空或其他值 → ❌ 需要修复

3. **确认 Environments**：
   - 确保 `DATABASE_URL` 应用于所有环境：
     - ✅ Production
     - ✅ Preview
     - ✅ Development

### 3. 如果 `DATABASE_URL` 值不正确，如何修复

**修复步骤**：

1. 点击 `DATABASE_URL` 右侧的编辑图标（铅笔图标）
2. 在 Value 字段中：
   - **如果 `PRISMA_DATABASE_URL` 存在**：输入 `$PRISMA_DATABASE_URL`
   - **或者**：点击 `PRISMA_DATABASE_URL` 的眼睛图标，复制其值，然后粘贴到 `DATABASE_URL` 的 Value 中
3. 确保 Environments 选择为 "All Environments"
4. 点击 "Save"

### 4. 检查其他必需的环境变量

确保以下变量都已添加：

- [ ] `DATABASE_URL` - 数据库连接（必须）
- [ ] `JWT_SECRET` - JWT 加密密钥（必须）
- [ ] `MODELSCOPE_API_KEY` - AI 功能（可选）

**如果 `JWT_SECRET` 还没有添加**：

1. 在 "Key" 字段输入：`JWT_SECRET`
2. 在 "Value" 字段输入：生成的密钥（见下方命令）
3. 选择 "All Environments"
4. 点击 "Save"

**生成 JWT_SECRET**（在本地终端执行）：
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## 🚀 修复后的下一步

1. **保存所有环境变量**
2. **触发重新部署**：
   - 在 Vercel 项目页面，点击 "Deployments" 标签
   - 找到最新的部署，点击右侧的 "..." 菜单
   - 选择 "Redeploy"
   - 或者推送新代码到 GitHub（会自动重新部署）

3. **等待部署完成**（2-5 分钟）

4. **验证部署**：
   - 访问应用 URL
   - 尝试注册一个新账号
   - 如果成功，说明配置正确

## ⚠️ 常见问题

### Q: `DATABASE_URL` 应该引用哪个变量？

**A**: 
- 如果 Vercel 创建了 `PRISMA_DATABASE_URL`，使用 `$PRISMA_DATABASE_URL`
- 如果 Vercel 创建了 `POSTGRES_PRISMA_URL`，使用 `$POSTGRES_PRISMA_URL`
- 或者直接使用完整的连接字符串

### Q: 如何查看环境变量的实际值？

**A**: 
- 点击变量右侧的眼睛图标（👁️）
- 注意：如果变量标记为 "Sensitive"，创建后可能无法再次查看

### Q: 环境变量添加后不生效？

**A**: 
- 确保已保存环境变量
- **重要**：必须重新部署项目，环境变量才会生效
- 检查变量是否应用于正确的环境（Production/Preview/Development）

### Q: 部署时仍然报 `DATABASE_URL` 未找到？

**A**: 
- 检查 `DATABASE_URL` 的值是否正确
- 确认变量已应用于所有环境
- 确认已重新部署项目
- 查看部署日志中的具体错误信息

## 📝 配置示例

**正确的环境变量配置**：

```
DATABASE_URL = $PRISMA_DATABASE_URL
JWT_SECRET = a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2
MODELSCOPE_API_KEY = sk-your-token-here (可选)
```

**所有变量都应该应用于**：
- ✅ Production
- ✅ Preview  
- ✅ Development

---

**如果按照以上步骤操作后仍然遇到问题，请检查部署日志中的具体错误信息。**


