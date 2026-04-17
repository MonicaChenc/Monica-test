---
sidebar_position: 99
title: 常见问题
---

# 常见问题

## 为什么 GitHub Actions 会提示 Node.js 弃用告警？

因为部分 GitHub Pages 官方 action 内部仍引用旧运行时。
只要工作流是绿钩，部署就是成功的。

## 如何预览文档改动？

运行：

```bash
npm run start
```

然后访问 `http://localhost:3000`。

## 提交前如何校验？

运行：

```bash
npm run build
```

这样可以提前发现断链和构建问题。
