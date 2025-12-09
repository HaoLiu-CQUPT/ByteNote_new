# GitHub 推送失败解决方案

如果遇到 `Failed to connect to github.com port 443` 错误，可以尝试以下解决方案：

## 方案 1：配置 Git 代理（如果你使用代理）

如果你使用代理访问 GitHub，需要配置 Git 使用代理：

```bash
# 设置 HTTP 代理（替换为你的代理地址和端口）
git config --global http.proxy http://127.0.0.1:7890
git config --global https.proxy http://127.0.0.1:7890

# 或者使用 SOCKS5 代理
git config --global http.proxy socks5://127.0.0.1:1080
git config --global https.proxy socks5://127.0.0.1:1080

# 推送后，如果需要移除代理
git config --global --unset http.proxy
git config --global --unset https.proxy
```

## 方案 2：使用 SSH 代替 HTTPS

SSH 连接通常更稳定：

```bash
# 1. 检查是否已有 SSH 密钥
ls ~/.ssh

# 2. 如果没有，生成 SSH 密钥
ssh-keygen -t ed25519 -C "your_email@example.com"

# 3. 将公钥添加到 GitHub
# 复制 ~/.ssh/id_ed25519.pub 的内容，添加到 GitHub Settings → SSH and GPG keys

# 4. 更改远程仓库地址为 SSH
git remote set-url origin git@github.com:HaoLiu-CQUPT/ByteNote_new.git

# 5. 测试连接
ssh -T git@github.com

# 6. 推送
git push origin main
```

## 方案 3：使用 GitHub Desktop

1. 下载并安装 [GitHub Desktop](https://desktop.github.com/)
2. 登录你的 GitHub 账号
3. 打开项目仓库
4. 点击 "Push origin" 按钮

## 方案 4：使用网页上传（临时方案）

如果只是推送一个小的修复，可以：

1. 访问 GitHub 仓库网页
2. 点击文件，然后点击 "Edit" 按钮
3. 直接编辑 `components/NoteEditor.tsx` 文件
4. 将第 10-16 行替换为：
   ```typescript
   const ReactMarkdown = dynamic(() => import("react-markdown"), {
     ssr: false,
     loading: () => <div className="text-xs text-gray-500 p-2">加载预览中...</div>
   });
   ```
5. 提交更改

## 方案 5：等待网络恢复

如果是临时的网络问题：
- 等待几分钟后重试
- 检查你的网络连接
- 尝试使用移动热点或其他网络

## 方案 6：使用镜像站点（如果可用）

某些地区可以使用 GitHub 镜像站点，但这需要特殊配置。

## 当前需要推送的更改

需要推送的更改是简化了 `react-markdown` 的导入方式，从：
```typescript
const ReactMarkdown = dynamic(
  () => import("react-markdown").then((mod) => mod.default),
  {
    ssr: false,
    loading: () => <div className="text-xs text-gray-500 p-2">加载预览中...</div>
  }
);
```

改为：
```typescript
const ReactMarkdown = dynamic(() => import("react-markdown"), {
  ssr: false,
  loading: () => <div className="text-xs text-gray-500 p-2">加载预览中...</div>
});
```

这个更改已经提交到本地仓库，只需要推送到远程即可。

