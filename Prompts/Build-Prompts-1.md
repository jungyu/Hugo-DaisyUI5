# Hugo + TailwindCSS(DaisyUI) 專案完整建構指南 - 第一部分

> 基於 Hugo v0.147.9 官方標準的完整建構指南，結合 TailwindCSS 與 DaisyUI，提供從零到完整網站的詳細步驟與 AI 提示。

本文檔提供詳細的分步建構指令與 AI 互動提示，幫助開發者從零創建現代化的 Hugo 靜態網站。**已根據實際執行經驗修正常見問題**。

## 🚀 改進重點

- ✅ 修正 Hugo v0.128.0+ 的 PostCSS 語法
- ✅ 提供 CDN fallback 策略
- ✅ 添加錯誤排除指引
- ✅ 優化依賴安裝順序
- ✅ 簡化初始模板
- ✅ **修正終端工作目錄問題**
- ✅ **修正 TOML 配置文件編碼問題**
- ✅ **補齊所有必要的 Hugo 模板文件**

## 第一部分目錄 (階段 1-5)

1. [環境準備與驗證](#階段一環境準備與驗證)
2. [Hugo 專案初始化](#階段二hugo-專案初始化)
3. [主題架構建立 (twda_v5)](#階段三主題架構建立-twda_v5)
4. [創建基礎 HTML 模板](#階段四創建基礎-html-模板)
5. [前端技術棧整合 (Node.js + Yarn)](#階段五前端技術棧整合-nodejs--yarn)

## 階段一：環境準備與驗證

### 1.1 檢查必要環境

**CLI 指令:**

```bash
# 檢查 Node.js 版本 (需要 18.x 或更高)
node --version

# 檢查 Hugo 版本 (需要 v0.147.9 或更高，必須是 Extended 版本)
hugo version

# 檢查 Yarn 版本 (建議 v4.6.0+)
yarn --version

# 檢查 Go 版本 (Hugo 模組需要)
go version

# 如果沒有安裝 Hugo Extended 版本
# macOS:
brew install hugo

# Ubuntu/Debian:
sudo snap install hugo --channel=extended

# Windows: 下載 hugo_extended_版本 from https://github.com/gohugoio/hugo/releases
```

**環境驗證:**

```bash
# 驗證 Hugo Extended 版本 (應該包含 "extended" 字樣)
hugo version | grep -i extended

# 驗證 Node.js 功能
node -e "console.log('Node.js 工作正常:', process.version)"

# 檢查網路連接 (用於下載依賴)
curl -s https://registry.npmjs.org/ > /dev/null && echo "NPM 註冊表連接正常"
```

## 階段二：Hugo 專案初始化

> **⚠️ 重要提醒：所有後續指令都必須在 `hugo-daisyui5` 目錄內執行！**

### 2.1 創建 Hugo 專案

**CLI 指令:**

```bash
# 創建新的 Hugo 站點
hugo new site hugo-daisyui5

# ⚠️ 重要：進入專案目錄，所有後續操作都在此目錄內
cd hugo-daisyui5

# 確認當前目錄正確
pwd
# 應該顯示：/path/to/your/hugo-daisyui5

# 初始化 Git 倉庫
git init

# 創建 .gitignore
cat > .gitignore << 'EOF'
# Hugo
/public/
/resources/
.hugo_build.lock

# Node.js
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Yarn v4
.yarn/*
!.yarn/patches
!.yarn/plugins
!.yarn/releases
!.yarn/sdks
!.yarn/versions

# Build outputs
dist/
.cache/

# OS & IDE
.DS_Store
.vscode/
.idea/

# Environment
.env*
EOF

# 初始化 Yarn v4.6.0
yarn init -y
yarn set version 4.6.0

# 確保有空的 yarn.lock (避免工作區衝突)
touch yarn.lock
```

### 2.2 創建目錄結構

**CLI 指令:**

```bash
# 創建內容分類目錄（實際使用的結構）
mkdir -p content/{posts,pages,tags,categories,authors}

# 創建靜態資源目錄
mkdir -p static/{images,icons,documents}

# 創建 assets 子目錄結構
mkdir -p assets/{css,js,images}

# 創建額外必要目錄
mkdir -p data layouts/shortcodes
```

## 階段三：主題架構建立 (twda_v5)

### 3.1 創建主題結構

**CLI 指令:**

```bash
# 創建主題根目錄
mkdir -p themes/twda_v5/{layouts,assets,static,data,i18n}

# 創建模板目錄
mkdir -p themes/twda_v5/layouts/{_default,partials,shortcodes}

# 創建主題資產目錄
mkdir -p themes/twda_v5/assets/{css,js,images}

# 創建主題元數據
cat > themes/twda_v5/theme.toml << 'EOF'
name = "TWDA v5"
license = "MIT"
licenselink = "https://github.com/your-username/twda_v5/blob/main/LICENSE"
description = "TailwindCSS + DaisyUI v5 theme for Hugo"
homepage = "https://github.com/your-username/twda_v5"
tags = ["responsive", "tailwindcss", "daisyui", "modern", "clean", "blog", "minimal"]
features = ["responsive", "dark-mode", "seo", "accessibility"]
min_version = "0.121.0"

[author]
name = "Your Name"
homepage = "https://yourwebsite.com"
EOF
```

# 創建主題配置
cat > themes/twda_v5/hugo.toml << 'EOF'
[params]
  version = "5.0.0"
  description = "基於 TailwindCSS v4.1.11 + DaisyUI v5.0.43 + Alpine.js v3.14.9 的現代化 Hugo 主題"
  
[module]
  [module.hugoVersion]
    min = "0.147.9"
    extended = true
EOF

# 創建內容模板
cat > themes/twda_v5/archetypes/default.md << 'EOF'
---
type: "{{ .Section }}"
title: "{{ .Name | humanize | title }}"
description: ""
slug: "{{ .Name }}"
date: {{ .Date }}
featured: ""
draft: true
comment: true
toc: true
reward: true
pinned: false
carousel: false
series: []
categories: []
tags: []
authors: []
---

在這裡撰寫您的內容...
EOF
```

### 3.2 創建樣式與腳本

**⚠️ 注意：TailwindCSS 語法錯誤是正常的**

以下 CSS 文件中的 `@tailwind` 和 `@apply` 指令會顯示 lint 錯誤，這是正常現象，因為編輯器還不知道 TailwindCSS 語法。這些錯誤在 PostCSS 處理後會消失。

```bash
# 創建主題 CSS 文件
cat > themes/twda_v5/assets/css/app.css << 'EOF'
/* TWDA v5 主題樣式入口 */
@tailwind base;
@tailwind components;
@tailwind utilities;

/* 自訂基礎樣式 */
@layer base {
  html {
    @apply scroll-smooth;
  }
  
  body {
    @apply bg-base-100 text-base-content font-sans antialiased;
  }
  
  /* 程式碼高亮樣式 */
  pre {
    @apply bg-base-200 rounded-lg p-4 overflow-x-auto my-4;
  }
  
  code {
    @apply bg-base-200 px-1 py-0.5 rounded text-sm;
  }
  
  pre code {
    @apply bg-transparent p-0;
  }
}

/* 自訂組件樣式 */
@layer components {
  .navbar-custom {
    @apply navbar bg-base-100 shadow-lg border-b border-base-300;
  }
  
  .card-post {
    @apply card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1;
  }
  
  .btn-theme-toggle {
    @apply btn btn-ghost btn-circle;
  }
}

/* 暗色模式特定樣式 */
[data-theme="dracula"] {
  .prose {
    @apply prose-invert;
  }
}
EOF

# 創建簡化版 JavaScript（避免複雜的模組系統問題）
cat > assets/js/main.js << 'EOF'
// TWDA v5 主題 - 基礎 JavaScript 功能
console.log('TWDA v5 主題已載入');
console.log('技術棧: Hugo v0.147.9 + TailwindCSS v4.1.11 + DaisyUI v5.0.43');

// DOM 載入完成後的初始化
document.addEventListener('DOMContentLoaded', function() {
  // 外部連結設定
  document.querySelectorAll('a[href^="http"]').forEach(link => {
    if (!link.getAttribute('target')) {
      link.setAttribute('target', '_blank');
      link.setAttribute('rel', 'noopener noreferrer');
    }
  });
  
  // 平滑滾動設定
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
  
  // 圖片懶載入支援
  if ('loading' in HTMLImageElement.prototype) {
    document.querySelectorAll('img').forEach(img => {
      if (!img.getAttribute('loading')) {
        img.setAttribute('loading', 'lazy');
      }
    });
  }
});
EOF
```

### 3.3 創建基礎模板系統

**CLI 指令:**

```bash
# 創建 partials 目錄
mkdir -p themes/twda_v5/layouts/partials/{components,meta}

# 創建 head.html - 修正 Hugo v0.128.0+ 語法並提供 fallback
cat > themes/twda_v5/layouts/partials/head.html << 'EOF'
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{{ if .Title }}{{ .Title }} - {{ end }}{{ .Site.Title }}</title>
<meta name="description" content="{{ if .Description }}{{ .Description }}{{ else }}{{ .Site.Params.description }}{{ end }}">

<!-- 預載入重要資源 -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>

<!-- 樣式表 - 使用 Hugo v0.128.0+ 新語法 -->
{{ $css := resources.Get "css/main.css" }}
{{ if $css }}
  {{ $processedCSS := $css | css.PostCSS | minify }}
  {{ if $processedCSS }}
    <link rel="stylesheet" href="{{ $processedCSS.RelPermalink }}">
  {{ else }}
    <!-- PostCSS 處理失敗，使用 CDN fallback -->
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://cdn.jsdelivr.net/npm/daisyui@5.0.43/dist/full.min.css" rel="stylesheet" type="text/css" />
  {{ end }}
{{ else }}
  <!-- 檔案不存在，使用 CDN fallback -->
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://cdn.jsdelivr.net/npm/daisyui@5.0.43/dist/full.min.css" rel="stylesheet" type="text/css" />
{{ end }}

<!-- Alpine.js -->
<script defer src="https://unpkg.com/alpinejs@3.14.9/dist/cdn.min.js"></script>
EOF

# 創建 header.html
cat > themes/twda_v5/layouts/partials/header.html << 'EOF'
<header class="navbar bg-base-100 shadow-lg">
  <div class="navbar-start">
    <div class="dropdown">
      <label tabindex="0" class="btn btn-ghost lg:hidden">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h8m-8 6h16"></path>
        </svg>
      </label>
    </div>
    <a href="/" class="btn btn-ghost normal-case text-xl">{{ .Site.Title }}</a>
  </div>
  
  <div class="navbar-center hidden lg:flex">
    <ul class="menu menu-horizontal px-1">
      <li><a href="/">首頁</a></li>
      <li><a href="/blogs/">部落格</a></li>
      <li><a href="/about/">關於</a></li>
    </ul>
  </div>
  
  <div class="navbar-end">
    <button class="btn btn-ghost btn-circle" onclick="toggleTheme()">
      <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
        <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"></path>
      </svg>
    </button>
  </div>
</header>
EOF

# 創建 footer.html
cat > themes/twda_v5/layouts/partials/footer.html << 'EOF'
<footer class="footer footer-center p-10 bg-base-200 text-base-content rounded-t-lg">
  <div>
    <svg class="w-10 h-10 fill-current" viewBox="0 0 24 24">
      <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
    </svg>
    <p class="font-bold">
      {{ .Site.Title }}
      <br>基於 Hugo + TailwindCSS + DaisyUI 構建
    </p>
    <p>Copyright © 2025 - All right reserved</p>
  </div>
  <div>
    <div class="grid grid-flow-col gap-4">
      <a class="link link-hover">關於我們</a>
      <a class="link link-hover">聯絡方式</a>
      <a class="link link-hover">隱私政策</a>
    </div>
  </div>
</footer>
EOF

# 創建 scripts.html
cat > themes/twda_v5/layouts/partials/scripts.html << 'EOF'
<!-- 主題切換功能 -->
<script>
function toggleTheme() {
  const themes = ['dracula', 'cmyk'];
  const currentTheme = document.documentElement.getAttribute('data-theme');
  const nextTheme = themes[(themes.indexOf(currentTheme) + 1) % themes.length];
  document.documentElement.setAttribute('data-theme', nextTheme);
  localStorage.setItem('theme', nextTheme);
}

// 載入儲存的主題
document.addEventListener('DOMContentLoaded', function() {
  const savedTheme = localStorage.getItem('theme') || 'dracula';
  document.documentElement.setAttribute('data-theme', savedTheme);
});
</script>

<!-- Hugo 處理的 JavaScript -->
{{ $js := resources.Get "js/main.js" }}
{{ if $js }}
<script src="{{ $js.RelPermalink }}"></script>
{{ end }}
EOF

# 創建基礎模板 (baseof.html)
cat > themes/twda_v5/layouts/_default/baseof.html << 'EOF'
<!DOCTYPE html>
<html lang="{{ .Site.Language.Lang | default "zh-tw" }}" data-theme="{{ .Site.Params.theme | default "dracula" }}">
<head>
  {{- partial "head.html" . -}}
</head>
<body class="bg-base-100 text-base-content">
  {{- partial "header.html" . -}}
  
  <main class="min-h-screen">
    {{- block "main" . }}{{- end }}
  </main>
  
  {{- partial "footer.html" . -}}
  {{- partial "scripts.html" . -}}
</body>
</html>
EOF

# 創建首頁模板
cat > themes/twda_v5/layouts/index.html << 'EOF'
{{- define "main" }}
<div class="hero min-h-screen bg-base-200">
  <div class="hero-content text-center">
    <div class="max-w-md">
      <h1 class="text-5xl font-bold">{{ .Site.Title }}</h1>
      <p class="py-6">{{ .Site.Params.description | default "歡迎來到我的 Hugo 網站" }}</p>
      <a href="/blogs/" class="btn btn-primary">開始探索</a>
    </div>
  </div>
</div>

{{- if .Site.Params.featured_posts }}
<section class="py-12">
  <div class="container mx-auto px-4">
    <h2 class="text-3xl font-bold text-center mb-8">精選文章</h2>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {{- range first 3 (where .Site.RegularPages "Type" "blogs") }}
      {{- partial "components/post-card.html" . }}
      {{- end }}
    </div>
  </div>
</section>
{{- end }}
{{- end }}
EOF

# 創建文章卡片組件
cat > themes/twda_v5/layouts/partials/components/post-card.html << 'EOF'
<div class="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300">
  {{- if .Params.featured }}
  <figure>
    <img src="{{ .Params.featured }}" alt="{{ .Title }}" class="w-full h-48 object-cover">
  </figure>
  {{- end }}
  
  <div class="card-body">
    <h2 class="card-title">
      {{ .Title }}
      {{- if .Draft }}
      <div class="badge badge-secondary">草稿</div>
      {{- end }}
      {{- if .Params.pinned }}
      <div class="badge badge-accent">置頂</div>
      {{- end }}
    </h2>
    
    <p class="text-base-content/80">{{ .Summary | truncate 150 }}</p>
    
    <div class="flex justify-between items-center text-sm text-base-content/60 mt-2">
      <time datetime="{{ .Date.Format "2006-01-02" }}">
        {{ .Date.Format "2006年01月02日" }}
      </time>
      
      {{- if .ReadingTime }}
      <span>{{ .ReadingTime }} 分鐘閱讀</span>
      {{- end }}
    </div>
    
    {{- if .Params.tags }}
    <div class="flex flex-wrap gap-1 mt-2">
      {{- range first 3 .Params.tags }}
      <span class="badge badge-outline badge-sm">{{ . }}</span>
      {{- end }}
    </div>
    {{- end }}
    
    <div class="card-actions justify-end mt-4">
      <a href="{{ .RelPermalink }}" class="btn btn-primary btn-sm">閱讀更多</a>
    </div>
  </div>
</div>
EOF
```

## 階段四：創建基礎 HTML 模板

### 4.1 創建基礎模板系統

**CLI 指令:**

```bash
# 創建基礎模板 (baseof.html) - 使用 CDN 版本確保相容性
cat > themes/twda_v5/layouts/_default/baseof.html << 'EOF'
<!DOCTYPE html>
<html lang="{{ .Site.Language.Lang | default "zh-tw" }}" data-theme="light">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>{{ if .Title }}{{ .Title }} | {{ end }}{{ .Site.Title }}</title>
    <meta name="description" content="{{ if .Description }}{{ .Description }}{{ else }}{{ .Site.Params.description }}{{ end }}">
    
    <!-- DaisyUI CSS CDN -->
    <link href="https://cdn.jsdelivr.net/npm/daisyui@4.12.14/dist/full.min.css" rel="stylesheet" type="text/css" />
    <script src="https://cdn.tailwindcss.com"></script>
    
    <!-- Google Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    
    <!-- Theme Toggle Script -->
    <script src="https://cdn.jsdelivr.net/npm/theme-change@2.0.2/index.js"></script>
</head>
<body class="font-sans">
    {{ partial "header.html" . }}
    
    <main>
        {{ block "main" . }}{{ end }}
    </main>
    
    {{ partial "footer.html" . }}
    
    <!-- Alpine.js -->
    <script defer src="https://unpkg.com/alpinejs@3.x.x/dist/cdn.min.js"></script>
</body>
</html>
EOF

# 創建導航列 (header.html)
cat > themes/twda_v5/layouts/partials/header.html << 'EOF'
<header class="navbar bg-base-100 shadow-lg">
  <div class="navbar-start">
    <div class="dropdown">
      <label tabindex="0" class="btn btn-ghost lg:hidden">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h8m-8 6h16"></path>
        </svg>
      </label>
      <ul tabindex="0" class="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
        {{ range .Site.Menus.main }}
        <li><a href="{{ .URL }}">{{ .Name }}</a></li>
        {{ end }}
      </ul>
    </div>
    <a href="/" class="btn btn-ghost normal-case text-xl font-bold">{{ .Site.Title }}</a>
  </div>
  
  <div class="navbar-center hidden lg:flex">
    <ul class="menu menu-horizontal px-1">
      {{ range .Site.Menus.main }}
      <li><a href="{{ .URL }}" class="hover:bg-base-200">{{ .Name }}</a></li>
      {{ end }}
    </ul>
  </div>
  
  <div class="navbar-end">
    <!-- Theme Toggle -->
    <div class="dropdown dropdown-end">
      <label tabindex="0" class="btn btn-ghost btn-circle">
        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clip-rule="evenodd"></path>
        </svg>
      </label>
      <ul tabindex="0" class="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-32">
        <li><a data-set-theme="light">🌞 Light</a></li>
        <li><a data-set-theme="dark">🌙 Dark</a></li>
        <li><a data-set-theme="cupcake">🧁 Cupcake</a></li>
        <li><a data-set-theme="forest">🌲 Forest</a></li>
      </ul>
    </div>
  </div>
</header>
EOF

# 創建頁尾 (footer.html)
cat > themes/twda_v5/layouts/partials/footer.html << 'EOF'
<footer class="footer footer-center p-10 bg-base-200 text-base-content">
  <div>
    <svg class="w-10 h-10 fill-current" viewBox="0 0 24 24">
      <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
    </svg>
    <p class="font-bold">
      {{ .Site.Title }}
      <br/>Powered by Hugo + DaisyUI v5
    </p>
    <p>Copyright © {{ now.Format "2006" }} - All rights reserved</p>
  </div>
  <div>
    <div class="grid grid-flow-col gap-4">
      {{ with .Site.Params.social.twitter }}
      <a href="{{ . }}" class="link link-hover" target="_blank" rel="noopener">
        <svg class="w-6 h-6 fill-current" viewBox="0 0 24 24">
          <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
        </svg>
      </a>
      {{ end }}
      {{ with .Site.Params.social.github }}
      <a href="{{ . }}" class="link link-hover" target="_blank" rel="noopener">
        <svg class="w-6 h-6 fill-current" viewBox="0 0 24 24">
          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
        </svg>
      </a>
      {{ end }}
    </div>
  </div>
</footer>
EOF
```

### 4.2 創建頁面模板

**CLI 指令:**

```bash
# 創建首頁模板
cat > themes/twda_v5/layouts/index.html << 'EOF'
{{ define "main" }}
<div class="hero min-h-screen bg-gradient-to-br from-primary/10 to-secondary/10">
  <div class="hero-content text-center">
    <div class="max-w-md">
      <h1 class="text-5xl font-bold text-primary">{{ .Site.Title }}</h1>
      <p class="py-6 text-lg">
        {{ .Site.Params.description | default "歡迎來到我們的現代化網站" }}
      </p>
      <div class="space-x-4">
        <a href="/posts/" class="btn btn-primary">查看文章</a>
        <a href="/about/" class="btn btn-outline btn-secondary">關於我們</a>
      </div>
    </div>
  </div>
</div>

<!-- 特色內容區域 -->
<section class="py-16 bg-base-100">
  <div class="container mx-auto px-4">
    <h2 class="text-3xl font-bold text-center mb-12">最新文章</h2>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {{ range first 3 (where .Site.RegularPages "Section" "posts") }}
      <div class="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow duration-300">
        <div class="card-body">
          <h3 class="card-title">{{ .Title }}</h3>
          <p class="text-base-content/70">{{ .Summary | truncate 100 }}</p>
          <div class="card-actions justify-end">
            <a href="{{ .RelPermalink }}" class="btn btn-primary btn-sm">閱讀更多</a>
          </div>
          <div class="text-sm text-base-content/50 mt-2">
            {{ .Date.Format "2006年01月02日" }}
          </div>
        </div>
      </div>
      {{ end }}
    </div>
    
    {{ if eq (len (where .Site.RegularPages "Section" "posts")) 0 }}
    <div class="text-center py-8">
      <p class="text-base-content/60">目前還沒有文章，敬請期待！</p>
    </div>
    {{ end }}
  </div>
</section>
{{ end }}
EOF

# 創建單頁模板
cat > themes/twda_v5/layouts/_default/single.html << 'EOF'
{{ define "main" }}
<div class="container mx-auto px-4 py-8 max-w-4xl">
  <article class="prose prose-lg max-w-none">
    <header class="mb-8">
      <h1 class="text-4xl font-bold mb-4">{{ .Title }}</h1>
      
      {{ if .Date }}
      <div class="flex items-center gap-4 text-sm text-base-content/60 mb-4">
        <time datetime="{{ .Date.Format "2006-01-02" }}">
          {{ .Date.Format "2006年01月02日" }}
        </time>
        {{ if .ReadingTime }}
        <span>閱讀時間：{{ .ReadingTime }} 分鐘</span>
        {{ end }}
      </div>
      {{ end }}
      
      {{ if .Params.tags }}
      <div class="flex flex-wrap gap-2 mb-6">
        {{ range .Params.tags }}
        <span class="badge badge-outline">{{ . }}</span>
        {{ end }}
      </div>
      {{ end }}
    </header>
    
    <div class="content">
      {{ .Content }}
    </div>
  </article>
  
  {{ if .IsPage }}
  <nav class="flex justify-between items-center mt-12 pt-8 border-t border-base-300">
    {{ with .PrevInSection }}
    <a href="{{ .RelPermalink }}" class="btn btn-outline btn-sm">
      ← {{ .Title }}
    </a>
    {{ else }}
    <div></div>
    {{ end }}
    
    {{ with .NextInSection }}
    <a href="{{ .RelPermalink }}" class="btn btn-outline btn-sm">
      {{ .Title }} →
    </a>
    {{ else }}
    <div></div>
    {{ end }}
  </nav>
  {{ end }}
</div>
{{ end }}
EOF

# 創建列表頁模板
cat > themes/twda_v5/layouts/_default/list.html << 'EOF'
{{ define "main" }}
<div class="container mx-auto px-4 py-8">
  <header class="mb-8">
    <h1 class="text-4xl font-bold mb-4">{{ .Title }}</h1>
    {{ if .Content }}
    <div class="prose">
      {{ .Content }}
    </div>
    {{ end }}
  </header>
  
  {{ if .Pages }}
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {{ range .Pages }}
    <article class="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow duration-300">
      <div class="card-body">
        <h2 class="card-title">
          <a href="{{ .RelPermalink }}" class="link link-hover">{{ .Title }}</a>
        </h2>
        
        {{ if .Summary }}
        <p class="text-base-content/70">{{ .Summary | truncate 150 }}</p>
        {{ end }}
        
        <div class="flex justify-between items-center text-sm text-base-content/60">
          {{ if .Date }}
          <time datetime="{{ .Date.Format "2006-01-02" }}">
            {{ .Date.Format "2006年01月02日" }}
          </time>
          {{ end }}
          
          {{ if .ReadingTime }}
          <span>{{ .ReadingTime }} 分鐘</span>
          {{ end }}
        </div>
        
        {{ if .Params.tags }}
        <div class="flex flex-wrap gap-1 mt-2">
          {{ range first 3 .Params.tags }}
          <span class="badge badge-outline badge-sm">{{ . }}</span>
          {{ end }}
        </div>
        {{ end }}
        
        <div class="card-actions justify-end mt-4">
          <a href="{{ .RelPermalink }}" class="btn btn-primary btn-sm">閱讀更多</a>
        </div>
      </div>
    </article>
    {{ end }}
  </div>
  {{ else }}
  <div class="text-center py-12">
    <h2 class="text-2xl font-semibold mb-4">目前沒有內容</h2>
    <p class="text-base-content/70">請稍後再查看更多內容</p>
  </div>
  {{ end }}
</div>
{{ end }}
EOF
```

## 階段五：前端技術棧整合 (Node.js + Yarn)

### 5.1 Hugo 主站配置

> **⚠️ 重要：TOML 配置文件編碼修正**
>
> 為避免編碼問題導致 Hugo 無法識別配置文件，使用純 ASCII 內容。

**CLI 指令:**

```bash
# 更新 Hugo 主配置文件 (使用純 ASCII 編碼)
cat > hugo.toml << 'EOF'
baseURL = "https://yoursite.com"
languageCode = "zh-tw"
title = "Hugo DaisyUI v5 Site"
theme = "twda_v5"
enableEmoji = true
enableRobotsTXT = true
enableGitInfo = true

[params]
  description = "A modern Hugo site with DaisyUI v5"
  author = "Your Name"
  keywords = ["Hugo", "DaisyUI", "TailwindCSS", "Blog"]
  
  [params.social]
    twitter = "https://twitter.com/yourusername"
    github = "https://github.com/yourusername"
    linkedin = "https://linkedin.com/in/yourusername"

[menu]
  [[menu.main]]
    name = "Home"
    url = "/"
    weight = 10
  
  [[menu.main]]
    name = "Posts"
    url = "/posts/"
    weight = 20
  
  [[menu.main]]
    name = "About"
    url = "/about/"
    weight = 30

[markup]
  [markup.goldmark]
    [markup.goldmark.renderer]
      unsafe = true
  [markup.highlight]
    style = "github"
    codeFences = true
    guessSyntax = true
    lineNos = false

[privacy]
  [privacy.youtube]
    privacyEnhanced = true
EOF

# 驗證配置文件已正確創建
ls -la hugo.toml
file hugo.toml
```

### 5.2 創建示例內容

**CLI 指令:**

```bash
# 創建首頁內容
cat > content/_index.md << 'EOF'
---
title: "首頁"
description: "歡迎來到我的 Hugo + DaisyUI v5 網站"
---

歡迎來到現代化的 Hugo 網站！

這個網站使用了最新的技術棧：Hugo、TailwindCSS 和 DaisyUI。

## 功能特色

- 響應式設計
- 現代化 UI 組件
- 快速載入
- SEO 優化
EOF

# 創建關於頁面
cat > content/about.md << 'EOF'
---
title: "關於我們"
description: "了解更多關於我們的網站"
---

這是關於頁面的內容。

您可以在這裡添加關於您或您的組織的更多資訊。
EOF

# 創建第一篇文章
cat > content/posts/first-post.md << 'EOF'
---
title: "第一篇文章"
description: "這是我的第一篇文章"
date: 2024-01-01T00:00:00Z
tags: ["Hugo", "DaisyUI", "開始"]
categories: ["技術"]
author: "作者"
draft: false
---

這是我的第一篇文章內容。

## 副標題

文章的詳細內容...

### 清單範例

- 項目一
- 項目二
- 項目三

### 程式碼範例

```bash
hugo server -D
```

這樣就可以啟動您的 Hugo 網站了！
EOF
```

### 5.3 Package.json 配置

**CLI 指令:**

```bash
# 更新 package.json 配置
cat > package.json << 'EOF'
{
  "name": "hugo-daisyui5",
  "version": "1.0.0",
  "description": "Hugo website with DaisyUI v5",
  "scripts": {
    "start": "hugo server -D --bind 0.0.0.0 --port 1313",
    "dev": "hugo server -D --watch",
    "build": "hugo --gc --minify",
    "preview": "hugo server --environment production",
    "clean": "rm -rf public resources .hugo_build.lock"
  },
  "devDependencies": {
    "@tailwindcss/typography": "^0.5.10",
    "autoprefixer": "^10.4.16",
    "daisyui": "^4.12.14",
    "postcss": "^8.4.32",
    "postcss-cli": "^11.0.0",
    "tailwindcss": "^3.4.0"
  },
  "dependencies": {
    "alpinejs": "^3.13.3",
    "theme-change": "^2.5.0"
  },
  "keywords": ["hugo", "daisyui", "tailwindcss", "static-site"],
  "author": "Your Name",
  "license": "MIT",
  "packageManager": "yarn@4.6.0"
}
EOF

# 確保有空的 yarn.lock 檔案 (解決 Yarn PnP 工作區問題)
touch yarn.lock

# 安裝依賴包
yarn install
```

### 5.4 TailwindCSS 配置

**CLI 指令:**

```bash
# 創建 TailwindCSS 配置檔案
cat > tailwind.config.js << 'EOF'
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './hugo_stats.json',
    './content/**/*.{html,js,md}',
    './themes/twda_v5/layouts/**/*.html',
    './themes/twda_v5/assets/js/**/*.js',
    './data/**/*.{json,toml,yaml,yml}'
  ],
  theme: {
    extend: {
      fontFamily: {
        'sans': ['Inter', 'Noto Sans TC', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' }
        }
      }
    }
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('daisyui')
  ],
  daisyui: {
    themes: ["light", "dark", "cupcake", "forest", "dracula"],
    darkTheme: "dark",
    base: true,
    styled: true,
    utils: true,
    logs: true,
    rtl: false,
  }
}
EOF
```
{
  "name": "hugo-daisyui5",
  "version": "1.0.0",
  "description": "Hugo website with TailwindCSS v4.1.11 and DaisyUI v5.0.43",
  "scripts": {
    "start": "hugo server -D --bind 0.0.0.0 --port 1313",
    "dev": "hugo server -D --bind 0.0.0.0 --port 1313 --watch",
    "serve": "hugo server -D --bind 0.0.0.0 --port 1313",
    "build": "hugo --gc --minify --environment production",
    "build:css": "postcss themes/twda_v5/assets/css/app.css -o assets/css/style.css",
    "preview": "hugo server --environment production --bind 0.0.0.0",
    "clean": "rm -rf public resources .hugo_build.lock",
    "deploy": "hugo --environment production && firebase deploy"
  },
  "devDependencies": {
    "@alpinejs/intersect": "^3.14.9",
    "@alpinejs/persist": "^3.14.9",
    "@tailwindcss/typography": "^0.5.16",
    "alpinejs": "^3.14.9",
    "autoprefixer": "^10.4.20",
    "daisyui": "^5.0.43",
    "postcss": "^8.5.6",
    "postcss-cli": "^11.0.1",
    "postcss-preset-env": "^10.1.3",
    "tailwindcss": "^4.1.11",
    "theme-change": "^2.5.0"
  },
  "dependencies": {
    "date-fns": "^4.1.0",
    "fuse.js": "^7.0.0",
    "katex": "^0.16.20",
    "mark.js": "^8.11.1",
    "mermaid": "^11.4.1"
  },
  "keywords": ["hugo", "tailwindcss", "daisyui", "alpinejs", "static-site"],
  "author": "Your Name",
  "license": "MIT",
  "packageManager": "yarn@4.6.0",
  "engines": {
    "node": ">=18.0.0",
    "yarn": ">=4.6.0"
  }
}
EOF

EOF
```

**CLI 指令:**

```bash
# 創建 TailwindCSS 配置
cat > tailwind.config.js << 'EOF'
/** @type {import('tailwindcss').Config} */
module.exports = {
  mode: "jit",
  content: [
    "./content/**/*.{html,js,md}",
    "./themes/twda_v5/layouts/**/*.html",
    "./themes/twda_v5/assets/js/**/*.js",
    "./data/**/*.{json,toml,yaml,yml}"
  ],
  theme: {
    extend: {
      fontFamily: {
        'sans': ['Inter', 'Noto Sans TC', 'system-ui', 'sans-serif'],
        'mono': ['JetBrains Mono', 'Fira Code', 'Cascadia Code', 'monospace']
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'bounce-subtle': 'bounceSubtle 2s infinite'
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' }
        },
        bounceSubtle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' }
        }
      }
    }
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('daisyui')
  ],
  daisyui: {
    themes: ["dracula", "cmyk"],
    darkTheme: "dracula",
    base: true,
    styled: true,
    utils: true,
    prefix: '',
    logs: true,
    themeRoot: ':root'
  }
}
EOF
```

### 4.3 PostCSS 配置

**CLI 指令:**

```bash
# 創建 PostCSS 配置
cat > postcss.config.js << 'EOF'
module.exports = {
  plugins: {
    tailwindcss: {},
    'postcss-preset-env': {
      stage: 1,
      features: {
        'nesting-rules': true,
        'custom-properties': true,
        'custom-media-queries': true,
        'color-function': true
      }
    },
    ...(process.env.HUGO_ENVIRONMENT === 'production' ? { 
      autoprefixer: {},
      cssnano: {
        preset: 'default'
      }
    } : {})
  }
}
EOF

# 創建主要 CSS 檔案
cat > assets/css/main.css << 'EOF'
/* 主要 CSS 入口文件 - 整合 Hugo 資源處理 */
@import '../themes/twda_v5/assets/css/app.css';

/* 專案特定樣式覆寫 */
@layer base {
  /* 中文字體最佳化 */
  :root {
    font-family: 'Inter', 'Noto Sans TC', system-ui, sans-serif;
  }
  
  /* 改善中文行高 */
  body {
    line-height: 1.75;
    letter-spacing: 0.025em;
  }
  
  /* 程式碼區塊中文支援 */
  code, pre {
    font-family: 'JetBrains Mono', 'Cascadia Code', 'Noto Sans Mono CJK TC', monospace;
  }
}

/* 專案特定組件 */
@layer components {
  /* 文章內容樣式 */
  .article-content {
    @apply prose prose-lg max-w-none;
    @apply prose-headings:font-bold prose-headings:tracking-tight;
    @apply prose-p:text-base-content/90 prose-p:leading-relaxed;
    @apply prose-a:text-primary hover:prose-a:text-primary-focus;
    @apply prose-strong:text-base-content prose-strong:font-semibold;
    @apply prose-code:bg-base-200 prose-code:px-1 prose-code:py-0.5 prose-code:rounded;
    @apply prose-pre:bg-base-200 prose-pre:border prose-pre:border-base-300;
    @apply prose-blockquote:border-l-primary prose-blockquote:bg-base-200/50;
    @apply prose-th:text-base-content prose-td:text-base-content;
  }
  
  /* 載入狀態 */
  .loading-skeleton {
    @apply animate-pulse bg-base-300 rounded;
  }
  
  /* 錯誤狀態 */
  .error-message {
    @apply alert alert-error shadow-lg;
  }
  
  /* 成功狀態 */
  .success-message {
    @apply alert alert-success shadow-lg;
  }
}

/* 工具類擴展 */
@layer utilities {
  /* 視覺隱藏 (保持可訪問性) */
  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }
  
  /* 螢幕閱讀器跳過 */
  .focus\:not-sr-only:focus {
    position: static;
    width: auto;
    height: auto;
    padding: 0;
    margin: 0;
    overflow: visible;
    clip: auto;
    white-space: normal;
  }
}
EOF
```

### 4.4 Hugo 配置

> **⚠️ 重要：TOML 配置文件編碼修正**
>
> 為避免編碼問題導致 Hugo 無法識別配置文件，使用純 ASCII 內容並確保在正確目錄內創建。

**CLI 指令:**

```bash
# 確認當前在 hugo-daisyui5 目錄內
pwd
# 應該顯示：/path/to/your/hugo-daisyui5

# 更新 Hugo 配置 (使用純 ASCII 編碼)
cat > hugo.toml << 'EOF'
baseURL = 'https://example.org/'
languageCode = 'zh-tw'
title = 'Hugo + DaisyUI v5 Website'
theme = 'twda_v5'

[params]
  description = "Modern Hugo website with TailwindCSS v4.1.11 + DaisyUI v5.0.43 + Alpine.js v3.14.9"
  theme = "dracula"
  featured_posts = true

[markup]
  [markup.goldmark]
    [markup.goldmark.renderer]
      unsafe = true
EOF

# 驗證配置文件已正確創建
ls -la hugo.toml
file hugo.toml
```

### 4.5 創建完整的 Hugo 模板文件

> **⚠️ 重要：補齊所有必要的模板文件**
>
> 為避免 Hugo 顯示 "found no layout file" 警告，需要創建完整的模板文件。

**CLI 指令:**

```bash
# 創建 section 頁面模板 (解決 section 警告)
cat > themes/twda_v5/layouts/_default/section.html << 'EOF'
{{- define "main" }}
<div class="container mx-auto px-4 py-8">
  <h1 class="text-4xl font-bold mb-6">{{ .Title }}</h1>
  
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {{- range .Pages }}
    {{- partial "components/post-card.html" . }}
    {{- end }}
  </div>
  
  {{- if eq (len .Pages) 0 }}
  <div class="text-center py-12">
    <h2 class="text-2xl font-semibold mb-4">目前沒有文章</h2>
    <p class="text-base-content/70">請稍後再查看更多內容</p>
  </div>
  {{- end }}
</div>
{{- end }}
EOF

# 創建 single 頁面模板 (解決 page 警告)
cat > themes/twda_v5/layouts/_default/single.html << 'EOF'
{{- define "main" }}
<article class="container mx-auto px-4 py-8 max-w-4xl">
  <header class="mb-8">
    <h1 class="text-4xl font-bold mb-4">{{ .Title }}</h1>
    
    <div class="flex flex-wrap items-center gap-4 text-sm text-base-content/70 mb-4">
      <time datetime="{{ .Date.Format "2006-01-02" }}">
        {{ .Date.Format "2006年01月02日" }}
      </time>
      
      {{- if .ReadingTime }}
      <span>{{ .ReadingTime }} 分鐘閱讀</span>
      {{- end }}
      
      {{- if .Params.authors }}
      <span>作者：{{ delimit .Params.authors ", " }}</span>
      {{- end }}
    </div>
    
    {{- if .Params.tags }}
    <div class="flex flex-wrap gap-2">
      {{- range .Params.tags }}
      <span class="badge badge-outline">{{ . }}</span>
      {{- end }}
    </div>
    {{- end }}
  </header>
  
  {{- if .Params.featured }}
  <figure class="mb-8">
    <img src="{{ .Params.featured }}" alt="{{ .Title }}" class="w-full rounded-lg shadow-lg">
  </figure>
  {{- end }}
  
  <div class="prose prose-lg max-w-none">
    {{ .Content }}
  </div>
  
  {{- if .Params.toc }}
  <aside class="mt-8 p-6 bg-base-200 rounded-lg">
    <h3 class="text-lg font-semibold mb-4">目錄</h3>
    {{ .TableOfContents }}
  </aside>
  {{- end }}
</article>
{{- end }}
EOF

# 創建 taxonomy 頁面模板 (解決 taxonomy 警告)
cat > themes/twda_v5/layouts/_default/taxonomy.html << 'EOF'
{{- define "main" }}
<div class="container mx-auto px-4 py-8">
  <h1 class="text-4xl font-bold mb-6">{{ .Title }}</h1>
  
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {{- range .Pages }}
    {{- partial "components/post-card.html" . }}
    {{- end }}
  </div>
  
  {{- if eq (len .Pages) 0 }}
  <div class="text-center py-12">
    <h2 class="text-2xl font-semibold mb-4">此分類下目前沒有內容</h2>
    <p class="text-base-content/70">請稍後再查看更多內容</p>
  </div>
  {{- end }}
</div>
{{- end }}
EOF

# 創建示例內容進行測試
cat > content/blogs/welcome.md << 'EOF'
---
title: "歡迎來到 Hugo + DaisyUI v5 網站"
description: "這是一個使用 Hugo、TailwindCSS 和 DaisyUI 建立的現代化網站示例"
date: 2025-07-02T15:54:00+08:00
draft: false
featured: ""
comment: true
toc: true
pinned: true
tags: ["Hugo", "TailwindCSS", "DaisyUI", "Alpine.js"]
categories: ["教學"]
authors: ["Admin"]
---

歡迎使用 Hugo + DaisyUI v5！

這是一個基於現代化技術棧建立的網站示例。

## 技術棧

- **Hugo v0.147.9+extended** - 快速的靜態網站產生器
- **TailwindCSS v4.1.11** - 實用優先的 CSS 框架
- **DaisyUI v5.0.43** - 美麗的 TailwindCSS 組件庫
- **Alpine.js v3.14.9** - 輕量級的 JavaScript 框架

恭喜！您的網站已經成功運行！
EOF

# 創建關於頁面
cat > content/about.md << 'EOF'
---
title: "關於本站"
description: "了解更多關於這個 Hugo + DaisyUI v5 網站的資訊"
date: 2025-07-02T15:55:00+08:00
draft: false
comment: false
toc: false
---

## 關於我們

這是一個使用現代化技術棧建立的演示網站，展示了 Hugo 靜態網站產生器與 TailwindCSS、DaisyUI 和 Alpine.js 的完美結合。

### 建立目的

此網站旨在提供現代化網站建構的最佳實踐示例和完整的開發環境配置指南。
EOF
```

### 4.6 修正 CDN 配置 (解決 PostCSS 問題)

> **⚠️ 重要：使用 CDN fallback 避免 PostCSS 配置問題**
>
> 由於 Yarn PnP 與 Hugo 的 npx 調用可能有兼容性問題，暫時使用 CDN 版本確保專案能正常運行。

**CLI 指令:**

```bash
# 修正 head.html 使用 CDN fallback
cat > themes/twda_v5/layouts/partials/head.html << 'EOF'
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{{ if .Title }}{{ .Title }} - {{ end }}{{ .Site.Title }}</title>
<meta name="description" content="{{ if .Description }}{{ .Description }}{{ else }}{{ .Site.Params.description }}{{ end }}">

<!-- 預載入重要資源 -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>

<!-- 樣式表 - 暫時使用 CDN 避免 PostCSS 問題 -->
<script src="https://cdn.tailwindcss.com"></script>
<link href="https://cdn.jsdelivr.net/npm/daisyui@5.0.43/dist/full.min.css" rel="stylesheet" type="text/css" />
<script>
  tailwind.config = {
    theme: {
      extend: {
        fontFamily: {
          'sans': ['Inter', 'Noto Sans TC', 'system-ui', 'sans-serif'],
          'mono': ['JetBrains Mono', 'Fira Code', 'Cascadia Code', 'monospace']
        }
      }
    },
    daisyui: {
      themes: ["dracula", "cmyk"],
      darkTheme: "dracula"
    }
  }
</script>

<!-- Alpine.js -->
<script defer src="https://unpkg.com/alpinejs@3.14.9/dist/cdn.min.js"></script>
EOF
```

### 4.7 Git 提交與測試啟動

> **⚠️ 重要：必須提交 Git 以避免 Git log 錯誤**

**CLI 指令:**

```bash
# 確認當前目錄正確
pwd
ls -la hugo.toml

# ⚠️ 重要：提交 Git 避免 "Failed to read Git log" 錯誤
git add .
git commit -m "Initial Hugo + DaisyUI v5 setup"

# 清理快取並測試建構
hugo --gc

# 啟動開發伺服器
hugo server -D --bind 0.0.0.0 --port 1313
```

**預期結果:**

```
Watching for changes in /path/to/hugo-daisyui5/{archetypes,assets,content,data,i18n,layouts,package.json,static,tailwind.config.js,themes}
Watching for config changes in /path/to/hugo-daisyui5/hugo.toml
Start building sites … 
hugo v0.147.9+extended+withdeploy

                  │ EN 
─────────┼──
 Pages            │ 20 
 Paginator pages  │  0 
 Non-page files   │  0 
 Static files     │  0 
 Processed images │  0 
 Aliases          │  0 
 Cleaned          │  0 

Built in 20 ms
Environment: "development"
Web Server is available at http://localhost:1313/
```

## 🔧 常見問題排除

### 問題 1: 終端工作目錄錯誤

**症狀**: Hugo 顯示 "Unable to locate config file or config directory" 錯誤

**解決方案**:

1. 確保所有指令都在 `hugo-daisyui5` 目錄內執行：
   ```bash
   cd hugo-daisyui5
   pwd  # 確認目錄正確
   ```

2. 使用完整路徑啟動：
   ```bash
   bash -c 'cd /path/to/your/hugo-daisyui5 && hugo server -D'
   ```

### 問題 2: TOML 配置文件編碼問題

**症狀**: Hugo 無法讀取配置文件，即使文件存在

**解決方案**:

1. 重新創建純 ASCII 編碼的配置文件：
   ```bash
   rm hugo.toml
   cat > hugo.toml << 'EOF'
   baseURL = 'https://example.org/'
   languageCode = 'zh-tw'
   title = 'Hugo + DaisyUI v5 Website'
   theme = 'twda_v5'
   EOF
   ```

2. 驗證文件編碼：
   ```bash
   file hugo.toml
   ```

### 問題 3: Hugo 模板警告

**症狀**: 看到 "found no layout file for html" 警告

**解決方案**:

創建所有必要的模板文件（已在步驟 4.5 中包含）：
- `_default/section.html`
- `_default/single.html`
- `_default/taxonomy.html`

### 問題 4: PostCSS 處理失敗

**症狀**: 看到 "POSTCSS: failed to transform" 錯誤

**解決方案**:

1. 確認 postcss-cli 已安裝：
   ```bash
   yarn info postcss
   ```

2. 使用 CDN fallback（已在步驟 4.6 中配置）

3. 檢查 postcss.config.js 語法

### 問題 5: Yarn PnP 兼容性

**症狀**: "doesn't seem to be part of the project" 錯誤或 "The nearest package directory doesn't seem to be part of the project"

**解決方案**:

1. 確保有空的 yarn.lock 文件：
   ```bash
   touch yarn.lock
   ```

2. 重新安裝依賴：
   ```bash
   yarn install
   ```

3. 如果仍有問題，檢查上層目錄是否有 yarn.lock：
   ```bash
   ls -la ../yarn.lock
   # 如果存在，移除或創建獨立專案
   ```

### 問題 6: Alpine.js 不工作

**症狀**: JavaScript 功能無效

**解決方案**:

1. 檢查瀏覽器控制台錯誤
2. 確認 Alpine.js CDN 載入
3. 檢查 data-* 屬性語法

## 📋 檢查清單

在進行下一步之前，請確認：

- [ ] Hugo 伺服器在 <http://localhost:1313> 運行
- [ ] 網站顯示 DaisyUI 樣式（卡片陰影、按鈕樣式等）
- [ ] 主題切換按鈕有效
- [ ] 導航列響應式功能正常
- [ ] 瀏覽器控制台無嚴重錯誤
- [ ] 所有模板警告已消除

## 🚀 完成總結

🎉 **Hugo + DaisyUI v5 專案建置成功！**

### ✅ 已完成功能

1. **環境配置**: Hugo Extended v0.147.9+, Node.js, Yarn v4.6.0
2. **專案結構**: 完整的目錄架構與 Git 版本控制
3. **主題系統**: twda_v5 主題與完整模板結構
4. **前端技術**: TailwindCSS + DaisyUI + Alpine.js 整合
5. **錯誤處理**: CDN fallback 與常見問題解決方案

### 🔧 重要修正

1. **終端工作目錄問題**: 添加目錄確認步驟，使用完整路徑啟動
2. **TOML 配置編碼**: 使用純 ASCII 內容避免編碼問題
3. **缺失模板文件**: 補齊所有必要的 Hugo 布局模板
4. **PostCSS 兼容性**: 實施 CDN fallback 策略
5. **Yarn PnP 問題**: 提供 yarn.lock 處理方案

### ✨ 技術亮點

- 🎯 **零錯誤啟動**: 解決了所有常見的配置問題
- 🚀 **完整模板**: 包含 section, single, taxonomy 等所有必要模板
- 🔄 **自動 fallback**: PostCSS 失敗時自動使用 CDN
- 📁 **正確目錄**: 確保所有操作在正確的工作目錄執行
- 🌐 **跨平台**: 適用於 macOS, Linux, Windows

### 📝 下一步建議

1. **創建內容**: 添加文章、頁面和作者資料
2. **自訂樣式**: 根據需求調整主題顏色和字體
3. **功能擴展**: 添加搜尋、評論、數學公式等功能
4. **SEO 優化**: 設置 meta 標籤、sitemap、robots.txt
5. **部署準備**: 配置 GitHub Actions 或其他 CI/CD

---

## 下一步

完成第一部分後，請繼續使用：

- **[Build-Prompts-2.md](./Build-Prompts-2.md)** - 階段 5-8 (Hugo 配置、CSS/JS 整合、資源處理)
- **[Build-Prompts-3.md](./Build-Prompts-3.md)** - 階段 9-12 (內容組織、功能擴展、測試優化、部署)

您的 Hugo + DaisyUI v5 基礎架構已經完成！🎊
