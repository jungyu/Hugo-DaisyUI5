---
title: "歡迎來到我的第一篇文章"
description: "這是使用 Hugo + TailwindCSS + DaisyUI 5 創建的第一篇示範文章"
date: 2025-01-15T10:00:00+08:00
lastmod: 2025-01-15T10:00:00+08:00
type: "blogs"
featured: "/images/posts/first-post.jpg"
draft: false
comment: true
toc: true
reward: true
pinned: false
carousel: false
series: ["Hugo 入門"]
categories: ["技術", "教學"]
tags: ["Hugo", "TailwindCSS", "DaisyUI", "靜態網站"]
authors: ["Admin"]
---

歡迎來到我們的第一篇文章！這篇文章將帶您了解如何使用 Hugo、TailwindCSS 與 DaisyUI 5 創建現代化的靜態網站。

## 為什麼選擇這個技術棧？

### Hugo - 世界上最快的靜態網站產生器

Hugo 是一個用 Go 語言寫成的靜態網站產生器，具有以下優勢：

- **極速建構**：毫秒級的建構速度
- **零相依性**：單一二進位檔案，無需複雜的執行環境
- **豐富的主題生態**：超過 300 個免費主題可選擇
- **強大的內容管理**：支援 Markdown、短代碼、多語系等功能

### TailwindCSS - 實用優先的 CSS 框架

TailwindCSS 提供了一種全新的 CSS 寫作方式：

```html
<div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
  <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">
    標題文字
  </h2>
  <p class="text-gray-600 dark:text-gray-300">
    內容文字
  </p>
</div>
```

### DaisyUI - 基於 TailwindCSS 的組件庫

DaisyUI 5 提供了豐富的預設組件：

- **按鈕組件**：各種樣式的按鈕
- **卡片組件**：美觀的內容卡片
- **導航組件**：響應式導航選單
- **表單組件**：完整的表單元素

## 開始使用

### 安裝 Hugo

在 macOS 上使用 Homebrew 安裝：

```bash
brew install hugo
```

在 Ubuntu 上使用 Snap 安裝：

```bash
sudo snap install hugo --channel=extended
```

### 創建新網站

```bash
hugo new site my-website
cd my-website
```

### 安裝主題

```bash
git submodule add https://github.com/your-username/twda_v5.git themes/twda_v5
echo 'theme = "twda_v5"' >> config.toml
```

## 寫作體驗

使用 Hugo 寫作非常簡單，只需要：

1. 創建 Markdown 檔案
2. 添加 Front Matter 元數據
3. 撰寫內容
4. 執行 `hugo server` 預覽

### 程式碼高亮

Hugo 內建了語法高亮功能：

```javascript
// JavaScript 範例
function toggleTheme() {
  const theme = document.documentElement.getAttribute('data-theme');
  const newTheme = theme === 'light' ? 'dark' : 'light';
  document.documentElement.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);
}
```

```python
# Python 範例
def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n-1) + fibonacci(n-2)

print(f"第 10 個費波納契數是: {fibonacci(10)}")
```

## 總結

Hugo + TailwindCSS + DaisyUI 的組合為我們提供了：

- **高效能**：靜態網站的極速載入
- **現代化**：最新的前端技術棧
- **易維護**：清晰的程式碼結構
- **可擴展**：豐富的擴展生態

開始您的 Hugo 之旅吧！在後續的文章中，我們將深入探討更多進階功能。

---

*如果您喜歡這篇文章，歡迎分享給更多人！*
