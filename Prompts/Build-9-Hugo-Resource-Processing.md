# Hugo 專案建構階段 9：Hugo 資源處理

> **專案狀態**: ✅ 進行中  
> **技術棧**: Hugo v0.147.9 + TailwindCSS v4.1.11 + DaisyUI v5.0.43 + Alpine.js v3.14.9

本階段專注於配置 Hugo 的資源處理系統 (Hugo Pipes)，以最佳化 CSS、JavaScript、圖片和其他靜態資源，確保網站高效載入和執行。

## 階段目標

- 配置 Hugo Pipes 處理 CSS 和 JavaScript
- 實作圖片最佳化和自適應圖片功能
- 建立高效的資源管道
- 增強網站效能與使用者體驗

## 前置條件

✅ 已完成 [階段 8：CSS 框架整合](./Build-8-CSS-Framework-Integration.md)  
✅ CSS 框架與元件已正確整合到專案中

## 步驟詳解

### 1. 配置 Hugo Pipes 處理 CSS

#### 1.1 CSS 處理流程

**修改 Head 模板 (`themes/twda_v5/layouts/partials/head.html`):**

```html
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{{ if .IsHome }}{{ .Site.Title }}{{ else }}{{ .Title }} | {{ .Site.Title }}{{ end }}</title>
  <meta name="description" content="{{ with .Description }}{{ . }}{{ else }}{{ with .Site.Params.description }}{{ . }}{{ end }}{{ end }}">
  
  <!-- 使用 Hugo Pipes 處理 CSS -->
  {{ $styles := resources.Get "css/app.css" }}
  
  {{ if hugo.IsProduction }}
    <!-- 生產環境: PostCSS 處理 + 最小化 -->
    {{ $styles = $styles | resources.PostCSS | minify | fingerprint "sha512" }}
    <link rel="stylesheet" href="{{ $styles.RelPermalink }}" integrity="{{ $styles.Data.Integrity }}" crossorigin="anonymous">
  {{ else }}
    <!-- 開發環境: 僅 PostCSS 處理 -->
    {{ $styles = $styles | resources.PostCSS }}
    <link rel="stylesheet" href="{{ $styles.RelPermalink }}">
  {{ end }}
  
  <!-- 添加字體資源 -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono&family=Noto+Sans+TC:wght@400;500;700&family=Noto+Serif+TC:wght@400;700&display=swap" rel="stylesheet">
  
  <!-- 其他頭部元素... -->
</head>
```

#### 1.2 PostCSS 配置

**確保 Hugo 項目根目錄已有 `postcss.config.js`:**

```javascript
// 確保已包含所有必要的 PostCSS 插件
module.exports = {
  plugins: {
    'tailwindcss': {},
    'autoprefixer': {},
  }
}
```

### 2. 配置 Hugo Pipes 處理 JavaScript

#### 2.1 JavaScript 處理流程

**修改 Footer 模板 (`themes/twda_v5/layouts/partials/footer.html`):**

```html
<footer class="bg-base-300 py-10">
  <div class="container mx-auto px-4">
    <!-- 頁尾內容... -->
  </div>
  
  <!-- 使用 Hugo Pipes 處理 JavaScript -->
  {{ $js := resources.Get "js/app.js" }}
  
  {{ if hugo.IsProduction }}
    <!-- 生產環境: ESBuild + 最小化 -->
    {{ $js = $js | js.Build (dict "minify" true "target" "es2015" "format" "iife") | fingerprint "sha512" }}
    <script src="{{ $js.RelPermalink }}" integrity="{{ $js.Data.Integrity }}" crossorigin="anonymous" defer></script>
  {{ else }}
    <!-- 開發環境: ESBuild (不最小化) -->
    {{ $js = $js | js.Build (dict "minify" false "target" "es2015" "format" "iife" "sourceMap" true) }}
    <script src="{{ $js.RelPermalink }}" defer></script>
  {{ end }}
</footer>
```

#### 2.2 JavaScript 模組化架構

**修改主應用程式 JS (`themes/twda_v5/assets/js/app.js`):**

```javascript
// 主要 JavaScript 入口文件
// 由 Hugo Pipes 處理並自動監測所有模組導入

// 核心功能
import './core/theme'
import './core/navigation'
import './core/search'

// 互動元件
import './components/modal'
import './components/dropdown'
import './components/tabs'
import './components/carousel'

// Alpine.js 配置
import Alpine from 'alpinejs'
import intersect from '@alpinejs/intersect'
import persist from '@alpinejs/persist'

// 註冊 Alpine.js 插件
Alpine.plugin(intersect)
Alpine.plugin(persist)

// 公開 Alpine.js 實例
window.Alpine = Alpine

// 啟動 Alpine.js
Alpine.start()

// 記錄應用初始化
console.log('Hugo-DaisyUI5 應用已初始化')
```

### 3. 圖片處理與最佳化

#### 3.1 配置 Hugo 圖片處理

**建立 `config/_default/imaging.toml`:**

```toml
# Hugo 圖片處理配置
quality = 90
resampleFilter = "lanczos"
anchor = "smart"
bgColor = "#ffffff"

[exif]
  disableDate = true
  disableLatLong = true
  includeFields = ""
  excludeFields = ""
```

#### 3.2 自適應圖片 Shortcode

**建立自適應圖片 Shortcode (`themes/twda_v5/layouts/shortcodes/adaptive-image.html`):**

```html
{{ $src := .Get "src" }}
{{ $alt := .Get "alt" | default "" }}
{{ $class := .Get "class" | default "" }}
{{ $caption := .Get "caption" | default "" }}
{{ $lazy := .Get "lazy" | default "true" }}

{{ $image := resources.Get $src }}
{{ if $image }}
  {{ $tiny := $image.Resize "20x jpg q20" }}
  {{ $small := $image.Resize "600x webp q85" }}
  {{ $medium := $image.Resize "1200x webp q85" }}
  {{ $large := $image.Resize "1800x webp q85" }}
  {{ $original := $image.Resize "2400x webp q90" }}
  
  <figure class="{{ $class }}">
    <div class="relative overflow-hidden">
      <!-- 模糊載入預覽 -->
      <img
        src="{{ $tiny.RelPermalink }}"
        class="w-full h-auto filter blur-xl absolute inset-0 object-cover"
        aria-hidden="true"
      />
      
      <!-- 主要自適應圖片 -->
      <img
        {{ if eq $lazy "true" }}loading="lazy"{{ end }}
        src="{{ $small.RelPermalink }}"
        srcset="
          {{ $small.RelPermalink }} 600w,
          {{ $medium.RelPermalink }} 1200w,
          {{ $large.RelPermalink }} 1800w,
          {{ $original.RelPermalink }} 2400w
        "
        sizes="(max-width: 600px) 100vw, (max-width: 1200px) 85vw, 75vw"
        alt="{{ $alt }}"
        width="{{ $image.Width }}"
        height="{{ $image.Height }}"
        class="w-full h-auto relative z-10"
      />
    </div>
    
    {{ if $caption }}
      <figcaption class="text-sm text-center mt-2 text-base-content/70">{{ $caption | markdownify }}</figcaption>
    {{ end }}
  </figure>
{{ else }}
  <div class="p-4 bg-error text-error-content rounded">圖片檔案無法載入: {{ $src }}</div>
{{ end }}
```

### 4. CSS 和 JavaScript 打包優化

#### 4.1 CSS Bundle 分離

**建立不同用途的 CSS Bundle:**

```bash
# 建立不同用途的 CSS 檔案
mkdir -p themes/twda_v5/assets/css/bundles
```

**建立通用 CSS Bundle (`themes/twda_v5/assets/css/bundles/common.css`):**

```css
/* 核心樣式 - 所有頁面都載入 */
@import "tailwindcss";
@import "daisyui/dist/daisyui.css";
@import "../utils.css";
```

**建立文章頁面 CSS Bundle (`themes/twda_v5/assets/css/bundles/post.css`):**

```css
/* 文章頁面特定樣式 */
@import "../components/article.css";
@import "../components/code.css";
@import "../components/toc.css";
```

**修改 head.html 以條件性載入 CSS:**

```html
<!-- 基本樣式 (所有頁面) -->
{{ $common := resources.Get "css/bundles/common.css" | resources.PostCSS }}
<link rel="stylesheet" href="{{ $common.RelPermalink }}">

<!-- 條件性載入頁面特定樣式 -->
{{ if eq .Type "posts" }}
  {{ $postStyles := resources.Get "css/bundles/post.css" | resources.PostCSS }}
  <link rel="stylesheet" href="{{ $postStyles.RelPermalink }}">
{{ end }}
```

#### 4.2 JavaScript 懶加載與條件載入

**建立 JavaScript 加載器 (`themes/twda_v5/assets/js/loader.js`):**

```javascript
// JavaScript 模組懶加載器
const moduleLoader = {
  // 已載入的模組
  loadedModules: {},

  // 按需載入模組
  load: function(moduleName, condition = true) {
    if (!condition || this.loadedModules[moduleName]) return Promise.resolve()
    
    return new Promise((resolve, reject) => {
      import(/* @vite-ignore */ `./modules/${moduleName}.js`)
        .then(module => {
          this.loadedModules[moduleName] = true
          if (typeof module.default === 'function') {
            module.default()
          }
          resolve(module)
        })
        .catch(err => {
          console.error(`載入模組 ${moduleName} 失敗:`, err)
          reject(err)
        })
    })
  }
}

// 導出加載器
export default moduleLoader
```

**使用加載器延遲載入功能 (`themes/twda_v5/assets/js/app.js`):**

```javascript
// 導入核心功能
import './core/theme'
import './core/navigation'

// 導入模組加載器
import moduleLoader from './loader'

// 初始化 Alpine.js
import Alpine from 'alpinejs'
import persist from '@alpinejs/persist'
Alpine.plugin(persist)
window.Alpine = Alpine
Alpine.start()

// 按需載入模組
document.addEventListener('DOMContentLoaded', () => {
  // 在文章頁面載入語法高亮和目錄
  moduleLoader.load('syntax-highlight', document.querySelector('.article-content pre code'))
  moduleLoader.load('table-of-contents', document.querySelector('.toc'))
  
  // 如果頁面上有搜尋框，載入搜尋功能
  moduleLoader.load('search', document.querySelector('.search-container'))
  
  // 如果頁面上有輪播，載入輪播功能
  moduleLoader.load('carousel', document.querySelector('.carousel'))
})
```

### 5. 資源預加載和關鍵 CSS 內聯

**建立關鍵 CSS 提取 (`themes/twda_v5/layouts/partials/critical-css.html`):**

```html
<style>
  /* 關鍵路徑 CSS - 直接內嵌以提高初始載入速度 */
  :root {
    --font-sans: 'Inter', 'Noto Sans TC', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  }
  
  body {
    font-family: var(--font-sans);
    margin: 0;
    padding: 0;
  }
  
  .container {
    width: 100%;
    margin-left: auto;
    margin-right: auto;
    padding-left: 1rem;
    padding-right: 1rem;
  }
  
  @media (min-width: 640px) {
    .container {
      max-width: 640px;
    }
  }
  
  @media (min-width: 768px) {
    .container {
      max-width: 768px;
    }
  }
  
  @media (min-width: 1024px) {
    .container {
      max-width: 1024px;
    }
  }
  
  @media (min-width: 1280px) {
    .container {
      max-width: 1280px;
    }
  }
  
  /* 基本頁面結構 */
  .header {
    width: 100%;
    z-index: 50;
  }
  
  .main {
    flex-grow: 1;
  }
  
  .footer {
    background-color: var(--footer-bg, #f3f4f6);
    padding-top: 2.5rem;
    padding-bottom: 2.5rem;
  }
</style>
```

**更新 head.html 使用關鍵 CSS 內聯:**

```html
<head>
  <!-- 其他頭部標籤... -->
  
  <!-- 關鍵 CSS 內聯 -->
  {{ partial "critical-css.html" . }}
  
  <!-- 使用 preload 指示關鍵資源 -->
  <link rel="preload" href="{{ (resources.Get "css/bundles/common.css" | resources.PostCSS).RelPermalink }}" as="style">
  <link rel="preload" href="{{ (resources.Get "js/app.js" | js.Build (dict "minify" true)).RelPermalink }}" as="script">
  
  <!-- 字體預載 -->
  <link rel="preload" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" as="style">
  <link rel="preload" href="https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@400;500;700&display=swap" as="style">
  
  <!-- 延遲加載非關鍵 CSS -->
  <link rel="stylesheet" href="{{ (resources.Get "css/bundles/common.css" | resources.PostCSS).RelPermalink }}" media="print" onload="this.media='all'">
  <noscript><link rel="stylesheet" href="{{ (resources.Get "css/bundles/common.css" | resources.PostCSS).RelPermalink }}"></noscript>
  
  <!-- 其他頭部標籤... -->
</head>
```

### 6. 資源壓縮與靜態檔案最佳化

**建立資源最佳化腳本 (`scripts/optimize.sh`):**

```bash
#!/bin/bash

# 資源最佳化腳本
echo "🚀 開始最佳化資源..."

# 確認 public 目錄存在
if [ ! -d "public" ]; then
  echo "❌ public 目錄不存在。請先執行 Hugo 建構。"
  exit 1
fi

# 檢查必要工具
for cmd in jpegoptim optipng pngquant svgo brotli gzip; do
  if ! command -v $cmd &> /dev/null; then
    echo "❌ 找不到命令 $cmd。請安裝所需工具。"
    exit 1
  fi
fi

# 最佳化 JPEG 圖片
echo "📷 最佳化 JPEG 圖片..."
find public -type f -name "*.jpg" -o -name "*.jpeg" | xargs jpegoptim --max=85 --strip-all --all-progressive --quiet

# 最佳化 PNG 圖片
echo "📷 最佳化 PNG 圖片..."
find public -type f -name "*.png" | xargs optipng -quiet -o5
find public -type f -name "*.png" | xargs pngquant --quality=65-80 --skip-if-larger --force --ext=.png

# 最佳化 SVG
echo "🖌️ 最佳化 SVG 圖片..."
find public -type f -name "*.svg" | xargs svgo --multipass --quiet

# 產生壓縮版本
echo "🗜️ 產生 Brotli 壓縮版本..."
find public -type f \( -name "*.html" -o -name "*.js" -o -name "*.css" -o -name "*.xml" -o -name "*.svg" -o -name "*.json" \) | xargs brotli -q 11 -f

echo "🗜️ 產生 Gzip 壓縮版本..."
find public -type f \( -name "*.html" -o -name "*.js" -o -name "*.css" -o -name "*.xml" -o -name "*.svg" -o -name "*.json" \) | xargs gzip -9 -k -f

# 計算節省的空間
original_size=$(du -sh public | cut -f1)
compressed_size=$(du -sh public | cut -f1)

echo "✅ 資源最佳化完成！"
echo "📊 統計:"
echo "  原始大小: $original_size"
echo "  最終大小: $compressed_size"

# 列出大型檔案
echo "📁 最大的 10 個檔案:"
find public -type f -not -name "*.br" -not -name "*.gz" | xargs du -h | sort -hr | head -n 10

echo "🏁 完成!"
```

**讓腳本可執行:**

```bash
chmod +x scripts/optimize.sh
```

## 驗證與檢查

完成 Hugo 資源處理配置後，請確認以下事項：

- [ ] CSS 和 JavaScript 正確通過 Hugo Pipes 處理
- [ ] 圖片處理和最佳化功能正常工作
- [ ] 自適應圖片 shortcode 可正常使用
- [ ] 資源預加載和關鍵 CSS 正確實作
- [ ] 檢查網站效能以確認最佳化是否有效

## AI Prompt 協助

> 我已經配置了 Hugo Pipes 來處理我的 CSS 和 JavaScript 資源，但似乎遇到了一些問題。特別是 PostCSS 處理和圖片最佳化功能不正確。請幫我檢查我的 Hugo 資源管道配置，確保 TailwindCSS 能夠正確處理，並且自適應圖片功能也能正確工作。

## 下一階段

✅ [階段 10：專案展示與範例](./Build-10-Project-Showcase.md) - 建立專案展示頁面，實現常見布局和功能，展示完整專案範例。

---

📚 **相關資源:**
- [Hugo Pipes 文件](https://gohugo.io/hugo-pipes/)
- [Hugo 圖片處理](https://gohugo.io/content-management/image-processing/)
- [Web 效能最佳實踐](https://web.dev/performance-scoring/)
- [使用 Hugo 的資源最佳化指南](https://discourse.gohugo.io/t/resource-optimization-in-hugo/13704)
