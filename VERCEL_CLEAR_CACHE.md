# 清除 Vercel 构建缓存

如果 Vercel 部署时仍然出现旧的错误（例如显示有 `catch` 处理的代码），可能是构建缓存问题。

## 方法 1：在 Vercel Dashboard 中清除缓存（推荐）

1. **登录 Vercel Dashboard**
   - 访问 [vercel.com/dashboard](https://vercel.com/dashboard)
   - 找到你的项目并点击进入

2. **进入项目设置**
   - 点击顶部标签栏的 **"Settings"**
   - 在左侧菜单中，找到 **"General"**

3. **清除构建缓存**
   - 向下滚动找到 **"Build & Development Settings"** 部分
   - 找到 **"Clear Build Cache"** 或 **"Clear Cache"** 按钮
   - 点击清除缓存

4. **重新部署**
   - 点击 **"Deployments"** 标签
   - 找到最新的部署记录
   - 点击右侧的 **"..."** 菜单
   - 选择 **"Redeploy"**

## 方法 2：通过推送空提交触发重新构建

如果找不到清除缓存的选项，可以推送一个空提交来触发重新构建：

```bash
git commit --allow-empty -m "触发重新构建以清除缓存"
git push origin main
```

## 方法 3：在 Vercel 项目设置中禁用缓存

1. 进入项目 Settings → General
2. 找到 **"Build & Development Settings"**
3. 查看是否有 **"Build Cache"** 选项
4. 如果存在，可以临时禁用以强制重新构建

## 方法 4：检查构建命令

确保 Vercel 项目设置中的构建命令是正确的：

1. 进入项目 Settings → General
2. 找到 **"Build & Development Settings"**
3. 确认 **"Build Command"** 为：
   ```bash
   prisma generate && prisma db push --accept-data-loss && next build
   ```

## 验证

清除缓存后，新的部署应该：
- 使用最新的代码（没有 catch 处理）
- 成功通过类型检查
- 完成构建

如果问题仍然存在，请检查：
1. 代码是否已正确推送到 GitHub
2. Vercel 是否连接到正确的分支
3. 查看最新的构建日志确认使用的代码版本

