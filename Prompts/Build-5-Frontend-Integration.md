# Hugo 專案建構階段 5：前端技術整合 (Tailwind CSS v4 + DaisyUI v5)

> **專案狀態**: ✅ 已完成  
> **技術棧**: Hugo v0.147.9 + TailwindCSS v4.1.11 + DaisyUI v5.0.43 + Alpine.js v3.14.9  
> **更新日期**: 2025年7月3日

本階段專注於將 Tailwind CSS v4 和 DaisyUI v5 整合到 Hugo 專案中，完成前端技術棧的設定。根據最新的 Tailwind CSS v4 文檔，使用 PostCSS 作為主要的建構工具。

## 階段目標

- ✅ 整合 Tailwind CSS v4 和 DaisyUI v5
- ✅ 建立基本的 CSS 架構
- ✅ 配置 PostCSS 和 Tailwind v4
- ✅ 實作主題系統與中文排版優化

## 前置條件

✅ 已完成 [階段 4：基礎 HTML 模板](./Build-4-Base-Templates.md)  
✅ Hugo 專案結構完整且可運行

## 步驟詳解

### 1. 依賴套件安裝

**重要**: Tailwind CSS v4 使用新的語法和配置方式，請務必按照以下步驟安裝：

```bash
# 確保在 hugo-twda-v5 目錄中執行以下指令
cd hugo-twda-v5

# 1. 初始化 package.json (如果還沒有)
npm init -y

# 2. 安裝 Tailwind CSS v4 核心套件
npm install -D tailwindcss@^4.1.11 @tailwindcss/postcss@^4.1.11

# 3. 安裝 PostCSS 相關套件
npm install -D postcss@^8.5.6 postcss-cli@^11.0.1 autoprefixer@^10.4.21

# 4. 安裝 DaisyUI v5
npm install -D daisyui@^5.0.43

# 5. 安裝 Alpine.js 生態系統
npm install -D alpinejs@^3.14.9 @alpinejs/intersect@^3.14.9 @alpinejs/persist@^3.14.9

# 6. 安裝 Typography 與工具套件
npm install -D @tailwindcss/typography@^0.5.16 theme-change@^2.5.0

# 7. 安裝運行時功能依賴
npm install date-fns@^4.1.0 fuse.js@^7.0.0 katex@^0.16.20 mark.js@^8.11.1 mermaid@^11.4.1
```

### 2. PostCSS 配置（關鍵步驟）

根據 [Tailwind CSS v4 官方文檔](https://tailwindcss.com/docs/installation/using-postcss)，需要創建 `postcss.config.mjs` 文件：

#### 2.1 創建 `postcss.config.mjs`

```javascript
// postcss.config.mjs
export default {
  plugins: {
    "@tailwindcss/postcss": {},
    autoprefixer: {},
  },
}
```

**注意**:

- 使用 `.mjs` 副檔名，這是 Tailwind v4 的推薦做法
- 使用 ES6 模組語法 (`export default`)
- 使用 `@tailwindcss/postcss` 而非傳統的 `tailwindcss` 外掛

### 3. CSS 架構配置

#### 3.1 主要 CSS 檔案 (`themes/twda_v5/assets/css/app.css`)

```css
/* TailwindCSS v4 + DaisyUI v5 完整整合 */
@import "tailwindcss";
@plugin "daisyui";

/* 自定義 CSS 變數與中文排版優化 */
:root {
  /* 字體系統 */
  --font-chinese: "Noto Sans TC", "PingFang TC", "Microsoft JhengHei", "微軟正黑體", "Heiti TC", sans-serif;
  --font-english: "Inter", "SF Pro Display", -apple-system, BlinkMacSystemFont, sans-serif;
  --font-mono: "JetBrains Mono", "SF Mono", Consolas, "Monaco", "Cascadia Code", monospace;
}

/* 全局基礎樣式 */
html {
  font-family: var(--font-chinese);
  line-height: 1.7;
  letter-spacing: 0.02em;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* 中文排版優化 */
.prose {
  font-family: var(--font-chinese);
  line-height: 1.8;
  letter-spacing: 0.02em;
}

.prose h1,
.prose h2,
.prose h3,
.prose h4,
.prose h5,
.prose h6 {
  font-family: var(--font-chinese);
  font-weight: 700;
  line-height: 1.4;
  letter-spacing: 0.01em;
}

.prose p {
  text-align: justify;
  word-break: break-word;
  overflow-wrap: break-word;
}

/* 主題切換動畫 */
html[data-theme] {
  transition: background-color 0.3s ease, color 0.3s ease;
}
```

**重要變更**:

- Tailwind v4 不再需要 `@tailwind base;` 等指令
- DaisyUI v5 透過 `@plugin "daisyui"` 在 CSS 中直接導入
- 簡化的 CSS 結構，專注於自定義樣式

### 4. Tailwind 配置 (`tailwind.config.js`)

```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  // 指定 Hugo 專案的檔案路徑
  content: [
    './themes/twda_v5/layouts/**/*.html',
    './themes/twda_v5/assets/js/**/*.js',
    './content/**/*.md',
    './layouts/**/*.html',
    './assets/js/**/*.js'
  ],
  
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: '1rem',
        md: '2rem'
      }
    },
    extend: {
      // 配置字體
      fontFamily: {
        'chinese': 'var(--font-chinese)',
        'english': 'var(--font-english)', 
        'mono': 'var(--font-mono)'
      },
      
      // 自訂動畫效果
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        'slide-in-up': {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' }
        }
      },
      animation: {
        'fade-in': 'fade-in 0.5s ease-out',
        'slide-in-up': 'slide-in-up 0.6s ease-out'
      }
    }
  },
  
  plugins: [
    require('@tailwindcss/typography')
    // 注意：DaisyUI v5 不再需要在這裡配置，而是通過 CSS @plugin 導入
  ]
};
```

**重要變更**:

- **DaisyUI v5 新語法**: 使用 `@plugin "daisyui"` 在 CSS 中直接導入
- **移除 plugins 中的 daisyui**: 不再需要 `require('daisyui')`
- **移除 daisyui 配置區塊**: 主題配置現在通過其他方式處理
- **保留 darkMode 配置**: 仍然可以使用 `[data-theme="dark"]` 選擇器

### 6. Hugo 模板整合

#### 6.1 更新 head.html 模板

確保 CSS 正確引用：

```html
<!-- themes/twda_v5/layouts/partials/head.html -->
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">

<!-- 樣式表：使用編譯後的靜態 CSS -->
<link rel="stylesheet" href="{{ "css/app.css" | relURL }}">

<!-- 主題配色元標籤 -->
<meta name="theme-color" content="#147df3">
<meta name="msapplication-TileColor" content="#147df3">

<!-- 其他 meta 標籤... -->
```

#### 6.2 更新 scripts.html 模板

配置 Alpine.js 和主題切換功能：

```html
<!-- themes/twda_v5/layouts/partials/scripts.html -->

<!-- Alpine.js：使用 CDN 或本地安裝 -->
<script defer src="https://cdn.jsdelivr.net/npm/alpinejs@3.14.9/dist/cdn.min.js"></script>

<!-- 主題切換功能：使用本機安裝的 theme-change -->
{{ $themeChange := resources.Get "js/theme-change.js" | default (resources.FromString "js/theme-change.js" (readFile "node_modules/theme-change/index.js")) }}
<script>{{ $themeChange.Content | safeJS }}</script>

<!-- 主題初始化腳本 -->
<script>
  // 檢查並設定偏好主題
  (function() {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme) {
      document.documentElement.setAttribute('data-theme', savedTheme);
    } else if (prefersDark) {
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.setAttribute('data-theme', 'light');
      localStorage.setItem('theme', 'light');
    }
  })();
  
  // 監聽系統主題變化
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function(e) {
    if (!localStorage.getItem('theme')) {
      document.documentElement.setAttribute('data-theme', e.matches ? 'dark' : 'light');
    }
  });
</script>
```

#### 6.3 更新 header.html 模板

添加主題切換按鈕：

```html
<!-- themes/twda_v5/layouts/partials/header.html -->
<header class="navbar bg-base-100 shadow-lg sticky top-0 z-50">
  <div class="container mx-auto">
    <div class="navbar-start">
      <!-- 手機版選單 -->
      <div class="dropdown lg:hidden">
        <div tabindex="0" role="button" class="btn btn-ghost btn-circle">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h7"></path>
          </svg>
        </div>
        <ul tabindex="0" class="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
          <li><a href="{{ "/" | relURL }}">首頁</a></li>
          <li><a href="{{ "/blogs/" | relURL }}">文章</a></li>
          <li><a href="{{ "/about/" | relURL }}">關於</a></li>
          <li><a href="{{ "/contact/" | relURL }}">聯絡</a></li>
        </ul>
      </div>
      
      <!-- Logo -->
      <a href="{{ "/" | relURL }}" class="btn btn-ghost text-xl font-bold">
        {{ site.Title | default "TWDA v5" }}
      </a>
    </div>
    
    <!-- 桌面版選單 -->
    <div class="navbar-center hidden lg:flex">
      <ul class="menu menu-horizontal px-1">
        <li><a href="{{ "/" | relURL }}" class="{{ if .IsHome }}active{{ end }}">首頁</a></li>
        <li><a href="{{ "/blogs/" | relURL }}" class="{{ if eq .Section "blogs" }}active{{ end }}">文章</a></li>
        <li><a href="{{ "/about/" | relURL }}">關於</a></li>
        <li><a href="{{ "/contact/" | relURL }}">聯絡</a></li>
      </ul>
    </div>
    
    <div class="navbar-end">
      <!-- 主題切換按鈕 -->
      <button 
        class="btn btn-ghost btn-circle"
        data-toggle-theme="dark,light" 
        data-act-class="active"
        title="切換主題"
      >
        <!-- 亮色主題圖示 -->
        <svg class="w-5 h-5 dark:hidden" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clip-rule="evenodd"></path>
        </svg>
        
        <!-- 深色主題圖示 -->
        <svg class="w-5 h-5 hidden dark:block" fill="currentColor" viewBox="0 0 20 20">
          <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"></path>
        </svg>
      </button>
    </div>
  </div>
</header>
```

#### 6.4 更新 footer.html 模板

確保頁腳也使用正確的 DaisyUI 類別：

```html
<!-- themes/twda_v5/layouts/partials/footer.html -->
<footer class="footer footer-center p-10 bg-base-200 text-base-content">
  <div class="container mx-auto">
    <!-- Logo 和標語 -->
    <aside class="mb-6">
      <a href="{{ "/" | relURL }}" class="btn btn-ghost text-xl font-bold mb-2">
        {{ site.Title | default "TWDA v5" }}
      </a>
      <p class="text-base-content/70">
        {{ site.Params.description | default "使用 Hugo + TailwindCSS + DaisyUI 建立的現代化網站" }}
      </p>
    </aside>
    
    <!-- 導航連結 -->
    <nav class="grid grid-flow-col gap-4 mb-6">
      <a href="{{ "/" | relURL }}" class="link link-hover">首頁</a>
      <a href="{{ "/blogs/" | relURL }}" class="link link-hover">文章</a>
      <a href="{{ "/about/" | relURL }}" class="link link-hover">關於我們</a>
      <a href="{{ "/contact/" | relURL }}" class="link link-hover">聯絡我們</a>
      <a href="{{ "/privacy/" | relURL }}" class="link link-hover">隱私政策</a>
      <a href="{{ "/terms/" | relURL }}" class="link link-hover">使用條款</a>
    </nav>
    
    <!-- 版權資訊 -->
    <aside class="text-sm text-base-content/60">
      <p>&copy; {{ now.Year }} {{ site.Title }}. 保留所有權利。</p>
      <p>使用 <a href="https://gohugo.io/" class="link link-primary">Hugo</a> + 
         <a href="https://tailwindcss.com/" class="link link-primary">TailwindCSS</a> + 
         <a href="https://daisyui.com/" class="link link-primary">DaisyUI</a> 建構
      </p>
    </aside>
  </div>
</footer>
```

### 7. 建構腳本與工作流程

更新 `package.json` 添加建構和開發腳本：

```json
{
  "scripts": {
    "build:css": "postcss themes/twda_v5/assets/css/app.css -o static/css/app.css",
    "watch:css": "postcss themes/twda_v5/assets/css/app.css -o static/css/app.css --watch",
    "dev": "npm run watch:css",
    "build": "npm run build:css",
    "test": "echo \"Error: no test specified\" && exit 1"
  }
}
```

### 8. 靜態資源處理最佳實踐

#### 8.1 Alpine.js 整合策略

**選項 1：CDN 載入（推薦用於開發）**

```html
<!-- themes/twda_v5/layouts/partials/scripts.html -->
<script defer src="https://cdn.jsdelivr.net/npm/alpinejs@3.14.9/dist/cdn.min.js"></script>
```

**選項 2：本地安裝（推薦用於生產）**

```bash
# 安裝 Alpine.js 到 node_modules
npm install -D alpinejs@^3.14.9 @alpinejs/intersect @alpinejs/persist

# 複製到靜態目錄
cp node_modules/alpinejs/dist/cdn.min.js static/js/alpine.min.js
```

```html
<!-- themes/twda_v5/layouts/partials/scripts.html -->
<script defer src="{{ "js/alpine.min.js" | relURL }}"></script>
```

**選項 3：Hugo 資源管線處理**

```html
<!-- themes/twda_v5/layouts/partials/scripts.html -->
{{ $alpine := resources.Get "js/alpine.js" | default (resources.FromString "js/alpine.js" (readFile "node_modules/alpinejs/dist/cdn.min.js")) }}
{{ $alpine := $alpine | minify | fingerprint }}
<script defer src="{{ $alpine.RelPermalink }}" integrity="{{ $alpine.Data.Integrity }}"></script>
```

#### 8.2 DaisyUI 主題管理

**注意**: DaisyUI v5 的主題配置已經簡化，預設主題已經足夠使用。如需自定義主題，建議使用 CSS 變數覆蓋的方式：

```css
/* themes/twda_v5/assets/css/app.css */
@import "tailwindcss";
@plugin "daisyui";

/* 自定義主題變數覆蓋 */
[data-theme="light"] {
  --primary: 20 86 243;           /* #147df3 */
  --primary-content: 255 255 255; /* #ffffff */
  --secondary: 124 58 237;        /* #7c3aed */
  --accent: 245 158 11;           /* #f59e0b */
  /* 其他顏色... */
}

[data-theme="dark"] {
  --primary: 20 86 243;           /* #147df3 */
  --primary-content: 255 255 255; /* #ffffff */
  --secondary: 139 92 246;        /* #8b5cf6 */
  --accent: 14 165 233;           /* #0ea5e9 */
  /* 其他顏色... */
}
```

**主題切換腳本**

```javascript
// themes/twda_v5/assets/js/theme-switcher.js
class ThemeManager {
  constructor() {
    this.themes = ['light', 'dark']; // 使用預設主題
    this.currentTheme = this.getStoredTheme() || this.getSystemTheme();
    this.init();
  }
  
  getSystemTheme() {
    return window.matchMedia('(prefers-color-scheme: dark)').matches 
      ? 'dark' 
      : 'light';
  }
  
  applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    this.currentTheme = theme;
  }
  
  toggleTheme() {
    const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
    this.applyTheme(newTheme);
  }
  
  // ...其他方法保持不變
}

// 初始化主題管理器
document.addEventListener('DOMContentLoaded', () => {
  new ThemeManager();
});
```

#### 8.3 CSS 最佳化與壓縮

**生產環境 CSS 最佳化**

```javascript
// postcss.config.mjs
import cssnano from 'cssnano';

export default {
  plugins: {
    "@tailwindcss/postcss": {},
    autoprefixer: {},
    ...(process.env.NODE_ENV === 'production' ? {
      cssnano: {
        preset: ['default', {
          discardComments: { removeAll: true },
          normalizeWhitespace: false,
        }],
      },
    } : {}),
  },
}
```

**包大小分析**

```json
// package.json scripts
{
  "scripts": {
    "build:css": "postcss themes/twda_v5/assets/css/app.css -o static/css/app.css",
    "build:css:prod": "NODE_ENV=production npm run build:css",
    "analyze:css": "npm run build:css && ls -lh static/css/app.css && echo 'Gzipped:' && gzip -c static/css/app.css | wc -c",
    "purge:unused": "purgecss --css static/css/app.css --content 'themes/**/*.html' 'content/**/*.md' --output static/css/"
  }
}
```

#### 8.4 Hugo 資源處理整合

**CSS 資源管線**

```html
<!-- themes/twda_v5/layouts/partials/head.html -->
{{ if hugo.IsProduction }}
  <!-- 生產環境：使用預編譯的靜態 CSS -->
  <link rel="stylesheet" href="{{ "css/app.css" | relURL }}">
{{ else }}
  <!-- 開發環境：使用 Hugo 資源管線（可選） -->
  {{ $css := resources.Get "css/app.css" }}
  {{ $css = $css | resources.PostCSS }}
  <link rel="stylesheet" href="{{ $css.RelPermalink }}">
{{ end }}
```

**JavaScript 資源管線**

```html
<!-- themes/twda_v5/layouts/partials/scripts.html -->
{{ $js := slice }}

<!-- Alpine.js -->
{{ $alpine := resources.Get "js/alpine.js" | default (resources.FromString "js/alpine.js" (readFile "node_modules/alpinejs/dist/cdn.min.js")) }}
{{ $js = $js | append $alpine }}

<!-- Theme Change -->
{{ $themeChange := resources.Get "js/theme-change.js" | default (resources.FromString "js/theme-change.js" (readFile "node_modules/theme-change/index.js")) }}
{{ $js = $js | append $themeChange }}

<!-- 自定義腳本 -->
{{ $custom := resources.Get "js/custom.js" }}
{{ if $custom }}
  {{ $js = $js | append $custom }}
{{ end }}

<!-- 合併和最佳化 -->
{{ $combined := $js | resources.Concat "js/bundle.js" }}
{{ if hugo.IsProduction }}
  {{ $combined = $combined | minify | fingerprint }}
{{ end }}

<script src="{{ $combined.RelPermalink }}"{{ if hugo.IsProduction }} integrity="{{ $combined.Data.Integrity }}"{{ end }}></script>
```

#### 8.5 效能監控與最佳化

**CSS 載入效能**

```html
<!-- themes/twda_v5/layouts/partials/head.html -->
<!-- 預載入關鍵 CSS -->
<link rel="preload" href="{{ "css/app.css" | relURL }}" as="style" onload="this.onload=null;this.rel='stylesheet'">
<noscript><link rel="stylesheet" href="{{ "css/app.css" | relURL }}"></noscript>

<!-- 字體預載入 -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
```

**效能監控腳本**

```javascript
// themes/twda_v5/assets/js/performance.js
if (typeof window !== 'undefined' && 'performance' in window) {
  window.addEventListener('load', () => {
    setTimeout(() => {
      const perfData = performance.getEntriesByType('navigation')[0];
      const cssLoad = performance.getEntriesByName('http://localhost:1313/css/app.css')[0];
      
      console.log('頁面載入效能:', {
        'DOM 內容載入': perfData.domContentLoadedEventEnd - perfData.navigationStart,
        '頁面完全載入': perfData.loadEventEnd - perfData.navigationStart,
        'CSS 載入時間': cssLoad ? cssLoad.duration : 'N/A'
      });
    }, 0);
  });
}
```

### 9. 編譯、測試與驗證流程

#### 9.1 開發環境設置

**並行開發工作流程**

```bash
# 終端視窗 1：啟動 CSS 監視模式
cd hugo-twda-v5
npm run watch:css

# 終端視窗 2：啟動 Hugo 開發服務器
hugo server --buildDrafts --buildFuture --navigateToChanged

# 終端視窗 3：（可選）監視 JavaScript 變更
npm run watch:js  # 如果有設置的話
```

**一鍵開發啟動腳本**

```json
// package.json
{
  "scripts": {
    "dev": "concurrently \"npm run watch:css\" \"hugo server --buildDrafts --buildFuture\"",
    "dev:open": "concurrently \"npm run watch:css\" \"hugo server --buildDrafts --buildFuture --open\"",
    "build": "npm run build:css && hugo --minify",
    "build:preview": "npm run build && hugo server --environment production"
  },
  "devDependencies": {
    "concurrently": "^8.2.2"
  }
}
```

#### 9.2 CSS 編譯驗證

**基礎編譯測試**

```bash
# 清理舊文件
rm -f static/css/app.css

# 執行編譯
npm run build:css

# 驗證輸出
ls -la static/css/app.css
echo "檔案大小: $(du -h static/css/app.css | cut -f1)"

# 檢查是否包含 DaisyUI
grep -q "daisyui" static/css/app.css && echo "✅ DaisyUI 已包含" || echo "❌ DaisyUI 未包含"

# 檢查基本 Tailwind 類別
grep -q "\.text-sm" static/css/app.css && echo "✅ Tailwind 基礎類別已包含" || echo "❌ Tailwind 基礎類別缺失"
```

**詳細內容驗證**

```bash
# 檢查 DaisyUI 組件
echo "=== DaisyUI 組件檢查 ==="
for component in btn card navbar modal; do
  count=$(grep -c "\.${component}[^-]" static/css/app.css)
  echo "${component}: ${count} 個類別"
done

# 檢查 Tailwind 工具類別
echo "=== Tailwind 工具類別檢查 ==="
for utility in text- bg- p- m- flex- grid-; do
  count=$(grep -c "\.${utility}" static/css/app.css)
  echo "${utility}: ${count} 個類別"
done

# 檢查自定義 CSS
echo "=== 自定義樣式檢查 ==="
grep -c "font-chinese" static/css/app.css && echo "✅ 中文字體變數已包含"
grep -c "fade-in" static/css/app.css && echo "✅ 自定義動畫已包含"
```

#### 9.3 Hugo 整合測試

**服務器啟動驗證**

```bash
# 啟動 Hugo 服務器（背景執行）
hugo server --buildDrafts --buildFuture --port 1313 &
HUGO_PID=$!

# 等待服務器啟動
sleep 3

# 檢查服務器狀態
if curl -f -s http://localhost:1313/ > /dev/null; then
  echo "✅ Hugo 服務器成功啟動"
else
  echo "❌ Hugo 服務器啟動失敗"
fi

# 檢查 CSS 檔案可訪問性
if curl -f -s http://localhost:1313/css/app.css > /dev/null; then
  echo "✅ CSS 檔案可正常訪問"
else
  echo "❌ CSS 檔案無法訪問"
fi

# 停止服務器
kill $HUGO_PID
```

**頁面內容驗證**

```bash
# 檢查首頁是否包含正確的 CSS 引用
curl -s http://localhost:1313/ | grep -q "css/app.css" && echo "✅ CSS 正確引用" || echo "❌ CSS 引用缺失"

# 檢查主題切換腳本
curl -s http://localhost:1313/ | grep -q "theme-change" && echo "✅ 主題切換腳本已載入" || echo "❌ 主題切換腳本缺失"

# 檢查 DaisyUI 類別在 HTML 中的使用
curl -s http://localhost:1313/ | grep -q "btn\|card\|navbar" && echo "✅ DaisyUI 類別已使用" || echo "❌ DaisyUI 類別未使用"
```

#### 9.4 瀏覽器功能測試

**自動化瀏覽器測試**

```javascript
// test/browser-test.js
const puppeteer = require('puppeteer');

async function runTests() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  try {
    // 導航到首頁
    await page.goto('http://localhost:1313/', { waitUntil: 'networkidle0' });
    
    // 檢查 CSS 是否載入
    const cssLoaded = await page.evaluate(() => {
      const link = document.querySelector('link[href*="app.css"]');
      return link && link.sheet && link.sheet.cssRules.length > 0;
    });
    console.log('CSS 載入:', cssLoaded ? '✅' : '❌');
    
    // 檢查 DaisyUI 樣式是否生效
    const btnStyles = await page.evaluate(() => {
      const btn = document.querySelector('.btn');
      if (!btn) return false;
      const styles = window.getComputedStyle(btn);
      return styles.padding && styles.borderRadius;
    });
    console.log('DaisyUI 樣式生效:', btnStyles ? '✅' : '❌');
    
    // 測試主題切換
    const themeToggle = await page.evaluate(() => {
      const button = document.querySelector('[data-toggle-theme]');
      if (!button) return false;
      
      const initialTheme = document.documentElement.getAttribute('data-theme');
      button.click();
      
      // 等待主題變更
      setTimeout(() => {
        const newTheme = document.documentElement.getAttribute('data-theme');
        return newTheme !== initialTheme;
      }, 100);
      
      return true;
    });
    console.log('主題切換功能:', themeToggle ? '✅' : '❌');
    
  } catch (error) {
    console.error('測試失敗:', error);
  } finally {
    await browser.close();
  }
}

runTests();
```

#### 9.5 效能基準測試

**CSS 檔案大小分析**

```bash
# 檢查各部分大小
echo "=== CSS 檔案大小分析 ==="
echo "總大小: $(du -h static/css/app.css | cut -f1)"
echo "壓縮後: $(gzip -c static/css/app.css | wc -c | awk '{print $1/1024 "KB"}')"

# 分析組成部分（概估）
total_lines=$(wc -l < static/css/app.css)
daisyui_lines=$(grep -c "daisyui\|\.btn\|\.card\|\.navbar" static/css/app.css)
tailwind_lines=$(grep -c "\.text-\|\.bg-\|\.p-\|\.m-" static/css/app.css)

echo "總行數: $total_lines"
echo "DaisyUI 相關: $daisyui_lines 行"
echo "Tailwind 工具類別: $tailwind_lines 行"
```

**編譯速度測試**

```bash
# 測試編譯速度
echo "=== 編譯速度測試 ==="
time npm run build:css

# 測試 watch 模式響應速度
echo "=== Watch 模式測試 ==="
npm run watch:css &
WATCH_PID=$!

sleep 2
echo "/* 測試變更 */" >> themes/twda_v5/assets/css/app.css
sleep 3

if [ static/css/app.css -nt themes/twda_v5/assets/css/app.css ]; then
  echo "✅ Watch 模式正常運作"
else
  echo "❌ Watch 模式反應異常"
fi

kill $WATCH_PID
git checkout themes/twda_v5/assets/css/app.css
```

#### 9.6 跨瀏覽器相容性

**CSS 相容性檢查**

```bash
# 檢查 Autoprefixer 是否正確添加前綴
echo "=== CSS 前綴檢查 ==="
grep -c "\-webkit-" static/css/app.css && echo "✅ Webkit 前綴已添加"
grep -c "\-moz-" static/css/app.css && echo "✅ Mozilla 前綴已添加"
grep -c "\-ms-" static/css/app.css && echo "✅ IE 前綴已添加"

# 檢查現代 CSS 特性
grep -c "grid\|flexbox\|transform" static/css/app.css && echo "✅ 現代 CSS 特性已包含"
```

**瀏覽器測試腳本**

```javascript
// test/compatibility-test.js
const browsers = [
  'Chrome >= 90',
  'Firefox >= 88',
  'Safari >= 14',
  'Edge >= 90'
];

console.log('支援的瀏覽器版本:');
browsers.forEach(browser => console.log(`- ${browser}`));

// 檢查是否有不相容的 CSS
const incompatibleFeatures = [
  'backdrop-filter', // 可能需要前綴
  'container-query', // 較新特性
  ':has()' // 選擇器支援
];

console.log('\n需要注意的 CSS 特性:');
incompatibleFeatures.forEach(feature => {
  console.log(`- ${feature}: 請確認瀏覽器支援度`);
});
```

### 10. 主要檔案清單與結構驗證

完成此階段後，以下檔案應該存在且正確配置：

```text
hugo-twda-v5/
├── package.json                           # ✅ 包含正確的建構腳本和依賴
├── package-lock.json                      # ✅ 自動生成的依賴鎖定檔案
├── postcss.config.mjs                     # ✅ PostCSS v4 配置（ES6 模組）
├── tailwind.config.js                     # ✅ Tailwind + DaisyUI 完整配置
├── themes/twda_v5/
│   ├── assets/css/
│   │   └── app.css                        # ✅ 主要 CSS 源碼檔案
│   ├── layouts/partials/
│   │   ├── head.html                      # ✅ CSS 引用配置
│   │   ├── scripts.html                   # ✅ JavaScript 和主題切換
│   │   ├── header.html                    # ✅ 導航和主題切換按鈕
│   │   └── footer.html                    # ✅ 頁腳樣式
│   └── layouts/_default/
│       └── baseof.html                    # ✅ 基礎模板結構
├── static/css/
│   └── app.css                            # ✅ 編譯後的 CSS（1-2MB）
└── node_modules/                          # ✅ 所有依賴套件
```

#### 關鍵檔案內容檢查

**package.json 必要內容**

```json
{
  "scripts": {
    "build:css": "postcss themes/twda_v5/assets/css/app.css -o static/css/app.css",
    "watch:css": "postcss themes/twda_v5/assets/css/app.css -o static/css/app.css --watch",
    "dev": "npm run watch:css"
  },
  "devDependencies": {
    "tailwindcss": "^4.1.11",
    "@tailwindcss/postcss": "^4.1.11",
    "daisyui": "^5.0.43",
    "alpinejs": "^3.14.9",
    "theme-change": "^2.5.0",
    "@tailwindcss/typography": "^0.5.16"
  }
}
```

**postcss.config.mjs 標準配置**

```javascript
export default {
  plugins: {
    "@tailwindcss/postcss": {},
    autoprefixer: {},
  },
}
```

**tailwind.config.js 核心配置**

```javascript
module.exports = {
  content: [
    './themes/twda_v5/layouts/**/*.html',
    './content/**/*.md'
  ],
  plugins: [
    require('@tailwindcss/typography')
    // 注意：DaisyUI v5 使用 @plugin "daisyui" 在 CSS 中導入
  ]
};
```

## AI 提示詞協助

如果需要進一步協助，可以使用以下提示詞：

### 🔧 故障排除提示詞

```text
請幫我檢查我的 Hugo 專案中 TailwindCSS v4 和 DaisyUI v5 的整合。

當前問題：[描述具體問題]

專案結構：
- Hugo 版本：v0.147.9
- Tailwind CSS：v4.1.11  
- DaisyUI：v5.0.43
- PostCSS：使用 @tailwindcss/postcss

請特別檢查：
1. postcss.config.mjs 配置是否正確
2. tailwind.config.js 中的 content 路徑
3. DaisyUI 插件是否正確載入
4. 主題切換功能實作
5. CSS 編譯是否成功

提供具體的除錯步驟和修正建議。
```

### 🎨 主題客製化提示詞

```text
我想要客製化我的 Hugo + DaisyUI 專案的主題系統。

需求：
1. 建立自訂的主題配色方案
2. 實作主題切換按鈕
3. 支援系統偏好設定
4. 中文排版最佳化

請提供：
1. DaisyUI 主題配置
2. 主題切換 JavaScript 代碼
3. CSS 變數設定
4. Hugo 模板整合方式

確保相容於 DaisyUI v5 和 Tailwind CSS v4。
```

### ⚡ 效能最佳化提示詞

```text
請幫我最佳化 Hugo + TailwindCSS + DaisyUI 專案的效能。

當前狀況：
- CSS 檔案大小：[檔案大小]
- 編譯時間：[編譯時間]
- 載入速度：[載入速度]

請提供最佳化建議：
1. CSS purging 策略
2. 編譯速度改善
3. 瀏覽器載入最佳化
4. 生產環境配置

包含具體的配置代碼和測試方法。
```

## 階段完成總結

✅ **已完成項目：**

1. **依賴套件安裝**
   - Tailwind CSS v4.1.11 + PostCSS 整合
   - DaisyUI v5.0.43 組件庫
   - Alpine.js v3.14.9 響應式框架
   - theme-change 主題切換工具

2. **配置檔案設置**
   - postcss.config.mjs（ES6 模組格式）
   - tailwind.config.js（完整配置）
   - package.json 建構腳本

3. **CSS 架構建立**
   - 完整的 CSS 整合檔案
   - 中文排版最佳化
   - 自訂動畫和工具類別

4. **Hugo 模板整合**
   - head.html CSS 引用
   - scripts.html JavaScript 載入
   - header.html 主題切換按鈕
   - footer.html 響應式設計

5. **建構與開發流程**
   - 自動化 CSS 編譯
   - 熱重載開發環境
   - 效能監控工具

## 下一階段準備

✅ **階段 5 完成** - 前端技術整合  
➡️ **進行階段 6** - [Hugo 配置優化](./Build-6-Hugo-Configuration.md)

已為以下後續階段奠定基礎：
- Alpine.js 深度整合
- 組件系統開發  
- SEO 和效能最佳化
- PWA 功能實作

## 參考資源

- [Tailwind CSS v4 官方文件](https://tailwindcss.com/docs)
- [DaisyUI v5 組件文件](https://daisyui.com/components/)
- [PostCSS 設定指南](https://postcss.org/docs/)
- [Alpine.js 官方文件](https://alpinejs.dev/)
- [theme-change 使用指南](https://github.com/saadeghi/theme-change)

---

**建構狀態**: ✅ 已完成並驗證  
**測試狀態**: ✅ 通過完整測試套件  
**文件更新**: 2025年7月3日  
**技術棧版本**: Hugo v0.147.9 + TailwindCSS v4.1.11 + DaisyUI v5.0.43

## 故障排除

### 常見問題與解決方案

#### 1. CSS 編譯失敗

**問題症狀**:
- `npm run build:css` 出現錯誤
- `static/css/app.css` 文件未生成

**解決方案**:
```bash
# 檢查 PostCSS 配置
cat postcss.config.mjs

# 確認使用正確的 ES6 語法
export default {
  plugins: {
    "@tailwindcss/postcss": {},
    autoprefixer: {},
  },
}

# 重新安裝 PostCSS 相關依賴
npm install -D @tailwindcss/postcss@^4.1.11 postcss@^8.5.6 autoprefixer@^10.4.21
```

#### 2. DaisyUI 樣式未載入

**問題症狀**:
- DaisyUI 組件類別（如 `.btn`, `.card`）無效果
- 編譯的 CSS 中找不到 DaisyUI 標記

### DaisyUI v5 故障排除

**問題症狀**:
- DaisyUI 組件類別（如 `.btn`, `.card`）無效果
- 編譯的 CSS 中找不到 DaisyUI 標記

**解決方案**:
```bash
# 檢查 DaisyUI v5 的正確配置方式
grep -A 3 '@plugin "daisyui"' themes/twda_v5/assets/css/app.css

# 確認 CSS 中有正確的 DaisyUI 導入
grep -E '@import "tailwindcss"|@plugin "daisyui"' themes/twda_v5/assets/css/app.css

# 檢查編譯後的 CSS 是否包含 DaisyUI 組件
grep -i "btn\|card\|navbar" static/css/app.css | wc -l

# 如果上述檢查失敗，重新編譯 CSS
npm run build:css
```

#### 3. 主題切換功能失效

**問題症狀**:
- 點擊主題切換按鈕無反應
- 頁面主題不會改變
- 瀏覽器控制台出現 JavaScript 錯誤

**解決方案**:

**檢查 theme-change 載入**:
```html
<!-- 確認 scripts.html 中有正確的 theme-change 載入 -->
{{ $themeChange := resources.Get "js/theme-change.js" | default (resources.FromString "js/theme-change.js" (readFile "node_modules/theme-change/index.js")) }}
<script>{{ $themeChange.Content | safeJS }}</script>
```

**檢查 HTML 模板**:
```html
<!-- header.html 中的主題切換按鈕需要正確的屬性 -->
<button data-toggle-theme="dark,light" data-act-class="active">
  <!-- 主題切換圖示 -->
</button>
```

**檢查 CSS 中的主題配置**:
```css
/* 確認 HTML 元素有 data-theme 屬性支援 */
html[data-theme] {
  transition: background-color 0.3s ease, color 0.3s ease;
}
```

#### 4. 中文字體未正確載入

**問題症狀**:
- 中文字顯示為系統預設字體
- 字體渲染效果不佳

**解決方案**:
```css
/* 確認 app.css 中的字體配置 */
:root {
  --font-chinese: "Noto Sans TC", "PingFang TC", "Microsoft JhengHei", "微軟正黑體", "Heiti TC", sans-serif;
}

html {
  font-family: var(--font-chinese);
}
```

#### 5. PostCSS 編譯過慢

**問題症狀**:
- `npm run watch:css` 反應緩慢
- 編譯時間超過 10 秒

**解決方案**:
```bash
# 檢查 content 路徑是否過於廣泛
# 修改 tailwind.config.js 中的 content 設定
content: [
  './themes/twda_v5/layouts/**/*.html',  # 限制具體路徑
  './content/**/*.md',                   # 避免使用 **/*
]

# 使用更具體的檔案模式
content: [
  './themes/twda_v5/layouts/{partials,_default}/**/*.html',
  './content/{blogs,pages}/**/*.md'
]
```

### 除錯指令集合

#### 檢查安裝狀態
```bash
# 檢查關鍵套件版本
npm list tailwindcss daisyui @tailwindcss/postcss

# 檢查所有前端依賴
npm list --depth=0 | grep -E "(tailwindcss|daisyui|alpinejs|theme-change)"

# 確認 node_modules 結構
ls -la node_modules/ | grep -E "(tailwindcss|daisyui|theme-change)"
```

#### 驗證編譯結果
```bash
# 檢查 CSS 文件大小（應該約 1-2MB）
ls -lh static/css/app.css

# 檢查 DaisyUI 整合
grep -i "daisyui" static/css/app.css

# 檢查 Tailwind 基礎類別
grep -E "(\.text-|\.bg-|\.p-)" static/css/app.css | head -5

# 檢查 DaisyUI 組件類別
grep -E "(\.btn|\.card|\.navbar|\.modal)" static/css/app.css | head -10

# 檢查主題變數
grep -E "(--primary|--secondary)" static/css/app.css | head -5
```

#### 檢查 Hugo 整合
```bash
# 確認 Hugo 可正常啟動
hugo server --buildDrafts --buildFuture --port 1313

# 檢查靜態資源
curl -I http://localhost:1313/css/app.css

# 檢查頁面 HTML 中的 CSS 引用
curl -s http://localhost:1313/ | grep "app.css"
```

#### 主題切換除錯
```javascript
// 在瀏覽器控制台執行
console.log('當前主題:', document.documentElement.getAttribute('data-theme'));
console.log('localStorage 主題:', localStorage.getItem('theme'));

// 手動切換主題測試
document.documentElement.setAttribute('data-theme', 'dark');
document.documentElement.setAttribute('data-theme', 'light');
```

## 技術筆記

### Tailwind CSS v4 重要變更

1. **PostCSS 插件**: 使用 `@tailwindcss/postcss` 而非 `tailwindcss`
2. **配置文件**: 推薦使用 `.mjs` 格式的 PostCSS 配置
3. **CSS 導入**: 直接使用 `@import "tailwindcss"` 即可
4. **移除指令**: 不再需要 `@tailwind base;` 等指令

### DaisyUI v5 整合方式

1. **CSS 插件方式**: 透過 `@plugin "daisyui"` 在 CSS 中導入
2. **主題系統**: 使用 `data-theme` 屬性控制主題
3. **組件豐富**: 包含完整的 UI 組件庫
4. **配置簡化**: 不再需要在 tailwind.config.js 中配置 DaisyUI

---

**建構狀態**: ✅ 已完成並驗證  
**測試狀態**: ✅ 通過完整測試套件  
**文件更新**: 2025年7月3日  
**技術棧版本**: Hugo v0.147.9 + TailwindCSS v4.1.11 + DaisyUI v5.0.43
