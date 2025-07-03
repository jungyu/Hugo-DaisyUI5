# Build-3-Theme-Architecture.md

> Hugo + TailwindCSS + DaisyUI 建構指南 - 階段三：主題架構建立
>
> 基於 Hugo v0.147.9 官方標準，整合 TailwindCSS v4.1.11、DaisyUI v5.0.43、Alpine.js v3.14.9

## 階段三：主題架構建立 (twda_v5)

### 3.1 創建主題基礎結構

**CLI 指令:**

```bash
# 確保在 hugo-twda-v5 目錄中執行以下指令
# cd hugo-twda-v5  # 如果尚未切換到此目錄

# 創建 twda_v5 主題目錄結構
mkdir -p themes/twda_v5

# 創建主題的完整目錄架構
mkdir -p themes/twda_v5/{archetypes,assets,data,i18n,layouts,static}
mkdir -p themes/twda_v5/assets/{css,js,images}
mkdir -p themes/twda_v5/layouts/{_default,partials,shortcodes}
mkdir -p themes/twda_v5/layouts/partials/{components,helpers,seo}
mkdir -p themes/twda_v5/static/{images,icons,fonts}

# 確認目錄結構
tree themes/twda_v5 -I 'node_modules'
```

### 3.2 創建主題描述文件

**CLI 指令:**

```bash
# 確保在 hugo-twda-v5 目錄中執行以下指令
# cd hugo-twda-v5  # 如果尚未切換到此目錄

# 創建 theme.toml
cat > themes/twda_v5/theme.toml << 'EOF'
name = "TWDA v5"
license = "MIT"
licenselink = "https://github.com/username/twda_v5/blob/main/LICENSE"
description = "現代化 Hugo 主題，整合 TailwindCSS v4 + DaisyUI v5 + Alpine.js v3"
homepage = "https://github.com/username/twda_v5"
demosite = "https://twda-v5-demo.netlify.app"
tags = ["responsive", "dark-mode", "tailwindcss", "daisyui", "alpine", "blog", "portfolio"]
features = ["響應式設計", "深色模式", "SEO優化", "快速載入", "現代化組件"]
min_version = "0.147.9"

[author]
  name = "開發者"
  homepage = "https://github.com/username"

[original]
  name = "TWDA v5"
  homepage = "https://github.com/username/twda_v5"
  repo = "https://github.com/username/twda_v5"
EOF

# 創建 LICENSE 文件
cat > themes/twda_v5/LICENSE << 'EOF'
MIT License

Copyright (c) 2025 TWDA v5 Theme

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
EOF

# 創建主題 README
cat > themes/twda_v5/README.md << 'EOF'
# TWDA v5 - Hugo Theme

現代化 Hugo 主題，整合 TailwindCSS v4 + DaisyUI v5 + Alpine.js v3

## 技術棧

- **Hugo**: v0.147.9+
- **TailwindCSS**: v4.1.11
- **DaisyUI**: v5.0.43
- **Alpine.js**: v3.14.9

## 特色功能

- 🎨 現代化設計系統
- 🌙 深色/淺色主題切換
- 📱 完全響應式設計
- ⚡ 極快的載入速度
- 🔍 SEO 優化
- ♿ 無障礙支援

## 安裝使用

請參考完整的建構指南文檔。

## 授權

MIT License
EOF
```

### 3.3 創建主題配置範例

**CLI 指令:**

```bash
# 創建主題預設配置
cat > themes/twda_v5/config.toml << 'EOF'
# TWDA v5 主題預設配置
# 這個文件提供主題的建議配置，可複製到專案根目錄的 config/_default/

baseURL = 'https://example.com'
languageCode = 'zh-TW'
title = 'TWDA v5 Theme'
theme = 'twda_v5'

# 內容與發佈設定
defaultContentLanguage = 'zh-tw'
hasCJKLanguage = true
enableEmoji = true
enableRobotsTXT = true

# 分頁設定
[pagination]
  pagerSize = 10
  path = "page"

# 標記設定
[markup]
  [markup.goldmark]
    [markup.goldmark.renderer]
      unsafe = true
  [markup.highlight]
    style = "github-dark"
    lineNos = true
    codeFences = true

# 輸出格式
[outputs]
  home = ["HTML", "RSS", "JSON"]
  page = ["HTML"]
  section = ["HTML", "RSS"]

# 主題參數
[params]
  # 基本資訊
  description = "現代化靜態網站，基於 Hugo + TailwindCSS + DaisyUI"
  keywords = ["Hugo", "TailwindCSS", "DaisyUI", "Alpine.js"]
  author = "開發者"
  
  # 主題設定
  defaultTheme = "dracula"
  enableThemeToggle = true
  
  # 社交連結
  [params.social]
    github = "https://github.com/username"
    twitter = "https://twitter.com/username"
    
  # SEO 設定
  [params.seo]
    enableOpenGraph = true
    enableTwitterCard = true
    enableJsonLd = true
EOF
```

### 3.4 創建主題原型文件

**CLI 指令:**

```bash
# 創建文章原型
cat > themes/twda_v5/archetypes/default.md << 'EOF'
---
title: "{{ replace .Name "-" " " | title }}"
description: ""
date: {{ .Date }}
draft: true
tags: []
categories: []
---

<!-- 在這裡撰寫您的內容 -->
EOF

# 創建部落格文章原型
cat > themes/twda_v5/archetypes/blogs.md << 'EOF'
---
title: "{{ replace .Name "-" " " | title }}"
description: ""
date: {{ .Date }}
draft: true
tags: []
categories: []
author: "{{ .Site.Params.author | default "作者" }}"
featured: false
toc: true
---

<!-- 文章摘要 -->

<!--more-->

<!-- 文章內容 -->
EOF

# 創建頁面原型
cat > themes/twda_v5/archetypes/pages.md << 'EOF'
---
title: "{{ replace .Name "-" " " | title }}"
description: ""
date: {{ .Date }}
draft: true
type: "page"
layout: "single"
---

<!-- 頁面內容 -->
EOF
```

### 3.5 創建基礎 CSS 架構

**CLI 指令:**

```bash
# 創建主要 CSS 文件
cat > themes/twda_v5/assets/css/app.css << 'EOF'
/* TailwindCSS v4 + DaisyUI v5 完整整合 */
@import "tailwindcss";
@import "daisyui/dist/daisyui.css";

/* 中文排版最佳化 */
:root {
  --font-sans: 'Inter', 'Noto Sans TC', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  --font-serif: 'Noto Serif TC', Georgia, serif;
  --font-mono: 'JetBrains Mono', 'SF Mono', Monaco, Inconsolata, 'Roboto Mono', monospace;
  
  /* 中文排版 */
  --line-height-relaxed: 1.8;
  --letter-spacing-wide: 0.025em;
}

/* 基礎樣式重置 */
html {
  scroll-behavior: smooth;
}

body {
  font-family: var(--font-sans);
  line-height: var(--line-height-relaxed);
  letter-spacing: var(--letter-spacing-wide);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* 中文排版優化 */
.prose {
  line-height: 1.8;
  letter-spacing: 0.025em;
}

.prose h1, .prose h2, .prose h3, .prose h4, .prose h5, .prose h6 {
  letter-spacing: -0.025em;
  font-weight: 700;
}

/* 程式碼區塊美化 */
.prose code {
  font-family: var(--font-mono);
  font-size: 0.875em;
  font-weight: 500;
  background-color: hsl(var(--nc) / 0.1);
  padding: 0.125rem 0.25rem;
  border-radius: 0.25rem;
}

.prose pre {
  font-family: var(--font-mono);
  font-size: 0.875em;
  line-height: 1.6;
  background-color: hsl(var(--nc) / 0.05);
  border: 1px solid hsl(var(--bc) / 0.1);
  border-radius: 0.5rem;
  padding: 1rem;
  overflow-x: auto;
}

/* 表格樣式 */
.prose table {
  border-collapse: collapse;
  margin: 1.5rem 0;
  width: 100%;
}

.prose th, .prose td {
  border: 1px solid hsl(var(--bc) / 0.2);
  padding: 0.75rem;
  text-align: left;
}

.prose th {
  background-color: hsl(var(--nc) / 0.05);
  font-weight: 600;
}

/* 深色模式優化 */
[data-theme="dracula"] .prose code,
[data-theme="dark"] .prose code {
  background-color: hsl(var(--nc) / 0.2);
  color: hsl(var(--bc) / 0.9);
}

[data-theme="dracula"] .prose pre,
[data-theme="dark"] .prose pre {
  background-color: hsl(var(--nc) / 0.1);
  border-color: hsl(var(--bc) / 0.2);
}

/* 動畫系統 */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.animate-fade-in {
  animation: fadeIn 0.5s ease-out;
}

/* 響應式字體 */
.text-responsive-xs { font-size: clamp(0.75rem, 2vw, 0.875rem); }
.text-responsive-sm { font-size: clamp(0.875rem, 2.5vw, 1rem); }
.text-responsive-base { font-size: clamp(1rem, 3vw, 1.125rem); }
.text-responsive-lg { font-size: clamp(1.125rem, 3.5vw, 1.25rem); }
.text-responsive-xl { font-size: clamp(1.25rem, 4vw, 1.5rem); }
.text-responsive-2xl { font-size: clamp(1.5rem, 5vw, 2rem); }
.text-responsive-3xl { font-size: clamp(2rem, 6vw, 3rem); }

/* Hugo 語法突出 */
.highlight {
  border-radius: 0.5rem;
  overflow: hidden;
}

.highlight pre {
  margin: 0;
  border-radius: 0;
}
EOF
```

### 3.6 創建基礎 JavaScript 架構

**CLI 指令:**

```bash
# 創建主要 JavaScript 文件
cat > themes/twda_v5/assets/js/app.js << 'EOF'
// TWDA v5 主要 JavaScript 文件
// 整合 Alpine.js v3.14.9 與主題功能

// 防止 FOUC (Flash of Unstyled Content)
document.addEventListener('DOMContentLoaded', function() {
  // 頁面載入完成後的初始化
  console.log('TWDA v5 主題載入完成');
});

// 主題切換功能 (預留，將在後續階段實作)
// 這裡放置主題切換的核心邏輯

// Alpine.js 整合準備
// 將在階段七詳細實作 Alpine.js 功能模組
EOF

# 創建主題切換腳本 (基礎版本)
cat > themes/twda_v5/assets/js/theme.js << 'EOF'
// 主題切換功能 - 基礎版本
// 避免頁面載入時的主題閃爍

(function() {
  // 從 localStorage 讀取儲存的主題，預設為 dracula
  const savedTheme = localStorage.getItem('theme') || 'dracula';
  
  // 立即設置主題，避免閃爍
  document.documentElement.setAttribute('data-theme', savedTheme);
})();

// 主題切換函數 (將在後續階段擴展)
function toggleTheme() {
  const currentTheme = document.documentElement.getAttribute('data-theme');
  const newTheme = currentTheme === 'dracula' ? 'cmyk' : 'dracula';
  
  document.documentElement.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);
  
  console.log('主題已切換至:', newTheme);
}

// 設置特定主題
function setTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);
  
  console.log('主題已設置為:', theme);
}
EOF
```

### 3.7 主題架構驗證

**CLI 指令:**

```bash
# 檢查主題目錄結構
tree themes/twda_v5 -I 'node_modules'

# 預期結構應包含：
# themes/twda_v5/
# ├── LICENSE
# ├── README.md
# ├── archetypes/
# ├── assets/
# │   ├── css/
# │   │   └── app.css
# │   └── js/
# │       ├── app.js
# │       └── theme.js
# ├── config.toml
# ├── data/
# ├── i18n/
# ├── layouts/
# │   ├── _default/
# │   ├── partials/
# │   └── shortcodes/
# ├── static/
# └── theme.toml

# 驗證 Hugo 能識別主題
hugo list themes
```

### 3.8 主題架構檢查清單

**檢查項目:**

- [ ] 主題目錄結構完整
- [ ] theme.toml 文件存在且格式正確
- [ ] LICENSE 和 README.md 已創建
- [ ] 原型文件 (archetypes) 已設置
- [ ] 基礎 CSS 架構已建立
- [ ] 基礎 JavaScript 架構已建立
- [ ] Hugo 能識別主題
- [ ] 目錄結構符合 Hugo 主題標準

**AI Prompt:**

```text
請協助我驗證 Hugo 主題架構是否正確建立：

檢查項目：
1. 主題目錄結構是否符合 Hugo 標準
2. theme.toml 配置是否正確
3. 原型文件設置是否合理
4. CSS/JS 基礎架構是否準備就緒

主題規格：
- 名稱：TWDA v5
- 技術棧：Hugo v0.147.9 + TailwindCSS v4 + DaisyUI v5 + Alpine.js v3
- 特色：響應式、深色模式、SEO優化

如發現問題請提供修正建議。
```

---

**上一階段：** [Build-2-Hugo-Initialization.md](./Build-2-Hugo-Initialization.md)
**下一階段：** [Build-4-Base-Templates.md](./Build-4-Base-Templates.md)

**完整指南導航：**

- 階段一：環境準備與驗證
- 階段二：Hugo 專案初始化
- 階段三：主題架構建立 ← 當前
- 階段四：基礎 HTML 模板
- 階段五：前端技術棧整合
- 階段六：Hugo 配置系統
- 階段七：Alpine.js 功能模組
- 階段八：TailwindCSS+DaisyUI 整合
- 階段九：資源處理系統
- 階段十：實際專案展示
- 階段十一：建構優化與 SEO
- 階段十二：測試和驗證
- 階段十三：常見問題與疑難排解
