# Hugo + TailwindCSS(DaisyUI) 專案建構指南 - 第二部分（2/2）

> 本文件涵蓋：
> 1. Tailwind CSS v4 + DaisyUI v5 整合
> 2. Hugo 資源處理（ESBuild + PostCSS）

---

## 目錄

1. [Tailwind CSS v4 + DaisyUI v5 整合](#階段六tailwind-css-v4--daisyui-v5-整合)
   - [安裝與升級](#安裝與升級)
   - [CSS 與 DaisyUI 導入](#css-與-daisyui-導入)
   - [Tailwind 與 DaisyUI 配置](#tailwind-與-daisyui-配置)
   - [PostCSS 配置](#postcss-配置)
   - [主題切換功能](#主題切換功能)
   - [DaisyUI 5 新功能與遷移](#daisyui-5-新功能與遷移)
   - [最佳實踐與故障排除](#最佳實踐與故障排除)
2. [Hugo 資源處理 (ESBuild + PostCSS)](#階段八hugo-資源處理-esbuild--postcss)
   - [資源管道配置](#81-資源管道配置)
   - [JavaScript 處理流程](#82-javascript-處理流程)
   - [CSS 處理流程](#83-css-處理流程)

---

## 階段六：Tailwind CSS v4 + DaisyUI v5 整合

### 安裝與升級

```bash
npm install -D tailwindcss@^4.1.11 @tailwindcss/postcss@^4.1.11 autoprefixer@latest
npm install daisyui@^5.0.43
```

如從 DaisyUI 4 升級，請同步：
```bash
npm update daisyui@^5.0.43 tailwindcss@^4.1.11
```

---

### CSS 與 DaisyUI 導入

在 `themes/twda_v5/assets/css/app.css`：

```css
@import "tailwindcss";
@import "daisyui/dist/daisyui.css";

:root {
  --primary-color: #3b82f6;
  --secondary-color: #64748b;
}

body {
  font-family: 'Inter', 'Noto Sans TC', -apple-system, BlinkMacSystemFont, sans-serif;
  line-height: 1.6;
}
```

> ⚠️ DaisyUI 5 建議直接 @import 完整 CSS，或用 @plugin "daisyui"（僅 Tailwind 4 支援）。

---

### Tailwind 與 DaisyUI 配置

在 `themes/twda_v5/tailwind.config.js`：

```javascript
module.exports = {
  content: [
    "./content/**/*.{html,js,md}",
    "./layouts/**/*.html",
    "./themes/twda_v5/layouts/**/*.html",
    "./themes/twda_v5/assets/**/*.{js,ts}",
    "./assets/**/*.{js,ts}",
    "./data/**/*.{json,toml,yaml,yml}",
    "./i18n/**/*.toml",
    "./themes/twda_v5/data/**/*.{json,toml,yaml,yml}",
    "./themes/twda_v5/i18n/**/*.toml"
  ],
  darkMode: ['class', '[data-theme="dark"]'],
  theme: {
    extend: {
      fontFamily: {
        'sans': ['Inter', 'Noto Sans TC', 'system-ui', 'sans-serif'],
      }
    }
  },
  plugins: [
    require('daisyui')
  ],
  daisyui: {
    themes: [
      "light", "dark", "dracula", "cmyk", "caramellatte", "abyss", "silk"
      // ...可加入更多 DaisyUI 5 主題
    ],
    darkTheme: "dark",
    base: true,
    styled: true,
    utils: true,
    prefix: '',
    logs: true,
    themeRoot: ':root'
  }
}
```

---

### PostCSS 配置

在 `themes/twda_v5/postcss.config.js`：

```javascript
module.exports = {
  plugins: {
    '@tailwindcss/postcss': {},
    autoprefixer: {},
  },
}
```

---

### 主題切換功能

1. **HTML 結構**

在 `themes/twda_v5/layouts/_default/baseof.html` 或 `head.html`：

```html
<html data-theme="light">
<!-- 或動態設定 -->
<html data-theme="{{ .Site.Params.theme | default "light" }}">
```

2. **主題切換按鈕**

在 `themes/twda_v5/layouts/partials/header.html`：

```html
<div class="dropdown dropdown-end">
  <div tabindex="0" role="button" class="btn btn-ghost btn-circle">
    <svg class="w-5 h-5 fill-current" viewBox="0 0 24 24">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
    </svg>
  </div>
  <ul tabindex="0" class="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow">
    <li>
      <button data-set-theme="light" class="justify-between">
        <span>🌞 Light</span>
        <span class="hidden theme-indicator-light">✓</span>
      </button>
    </li>
    <li>
      <button data-set-theme="dark" class="justify-between">
        <span>🌙 Dark</span>
        <span class="hidden theme-indicator-dark">✓</span>
      </button>
    </li>
  </ul>
</div>
```

3. **JavaScript 主題切換邏輯**

在 `themes/twda_v5/assets/js/theme.js`：

```javascript
document.addEventListener('DOMContentLoaded', function() {
  const savedTheme = localStorage.getItem('theme') || 'light';
  document.documentElement.setAttribute('data-theme', savedTheme);
  updateThemeIndicator(savedTheme);
  document.querySelectorAll('[data-set-theme]').forEach(button => {
    button.addEventListener('click', function() {
      const theme = this.getAttribute('data-set-theme');
      setTheme(theme);
    });
  });
  function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    updateThemeIndicator(theme);
    window.dispatchEvent(new CustomEvent('themechange', { detail: { theme: theme } }));
  }
  function updateThemeIndicator(theme) {
    document.querySelectorAll('[class*="theme-indicator-"]').forEach(indicator => {
      indicator.classList.add('hidden');
    });
    const currentIndicator = document.querySelector(`.theme-indicator-${theme}`);
    if (currentIndicator) {
      currentIndicator.classList.remove('hidden');
    }
  }
});
```

---

### DaisyUI 5 新功能與遷移

- 新增主題：caramellatte、abyss、silk
- 新增組件：List、Status、Fieldset、Label、Filter、Calendar、Validator、Dock
- 新修飾符：soft、dash、xl
- 新顏色變數：`--color-primary` 等
- 升級指引：
  - CSS 導入改為 `@import "daisyui/dist/daisyui.css";`
  - 類別名稱如 `card-compact` → `card-sm`，`btm-nav` → `dock`
  - 參考 DaisyUI 官方[升級指南](https://daisyui.com/docs/v5/)

---

### 最佳實踐與故障排除

- **主題文件組織**：
  - `themes/twda_v5/assets/css/app.css`
  - `themes/twda_v5/assets/js/theme.js`
  - `themes/twda_v5/layouts/partials/head.html`
- **響應式設計**：所有 DaisyUI 5 修飾符支援響應式前綴
- **自定義主題**：建議用 DaisyUI 主題產生器
- **常見問題**：
  - CSS 未生成：檢查 PostCSS 配置與 DaisyUI 路徑
  - 主題切換不工作：檢查 JS 載入與 data-theme 屬性
  - 響應式類別無效：確認 DaisyUI 5 版本
  - Tailwind v4 兼容性：PostCSS 插件需用 `@tailwindcss/postcss`

---

## 階段八：Hugo 資源處理（ESBuild + PostCSS）

### 8.1 資源管道配置

**資源管道概述**

Hugo 的資源管道（Resources Pipeline）允許開發者對靜態資源（如 CSS、JavaScript、圖片等）進行處理與優化。本專案中，我們將使用 ESBuild 處理 JavaScript，並使用 PostCSS 處理 CSS。

**目錄結構**

確保你的專案目錄結構如下：

```
your-hugo-site/
├── assets/
│   ├── css/
│   │   └── app.css
│   ├── js/
│   │   ├── alpine.js
│   │   ├── components.js
│   │   └── main.js
│   └── images/
├── content/
├── layouts/
│   └── _default/
│       └── baseof.html
├── public/
└── resources/
```

**主要步驟**

1. **安裝必要套件**

   確保安裝以下 npm 套件：

   ```bash
   npm install --save-dev tailwindcss@latest postcss@latest autoprefixer@latest
   ```

2. **配置 PostCSS**

   在專案根目錄創建或更新 `postcss.config.js` 檔案：

   ```javascript
   module.exports = {
     plugins: {
       tailwindcss: {},
       autoprefixer: {},
     },
   }
   ```

3. **配置 Tailwind CSS**

   在專案根目錄創建或更新 `tailwind.config.js` 檔案，確保包含所有需要處理的檔案路徑：

   ```javascript
   /** @type {import('tailwindcss').Config} */
   module.exports = {
     content: [
       "./content/**/*.{html,js,md}",
       "./layouts/**/*.html",
       "./themes/twda_v5/layouts/**/*.html",
       "./themes/twda_v5/assets/**/*.{js,ts}",
       "./assets/**/*.{js,ts}",
       "./data/**/*.{json,toml,yaml,yml}",
       "./i18n/**/*.toml",
       "./themes/twda_v5/data/**/*.{json,toml,yaml,yml}",
       "./themes/twda_v5/i18n/**/*.toml"
     ],
     darkMode: ['class', '[data-theme="dracula"]'],
     theme: {
       extend: {
         // 自訂主題設定
       }
     },
     plugins: [
       require('@tailwindcss/typography'),
       require('daisyui')
     ],
     daisyui: {
       themes: [
         {
           dracula: {
             "primary": "#ff79c6",
             "primary-focus": "#ff65c1",
             "primary-content": "#000000",
             "secondary": "#bd93f9",
             "secondary-focus": "#b085f5",
             "secondary-content": "#000000",
             "accent": "#ffb86c",
             "accent-focus": "#ffa96b",
             "accent-content": "#000000",
             "neutral": "#414558",
             "neutral-focus": "#343749",
             "neutral-content": "#ffffff",
             "base-100": "#282a36",
             "base-200": "#1e1f29",
             "base-300": "#15161e",
             "base-content": "#f8f8f2",
             "info": "#8be9fd",
             "success": "#50fa7b",
             "warning": "#f1fa8c",
             "error": "#ff5555"
           }
         },
         {
           cmyk: {
             "primary": "#0891b2",
             "primary-focus": "#0e7490",
             "primary-content": "#ffffff",
             "secondary": "#7c3aed",
             "secondary-focus": "#6d28d9",
             "secondary-content": "#ffffff",
             "accent": "#f59e0b",
             "accent-focus": "#d97706",
             "accent-content": "#000000",
             "neutral": "#374151",
             "neutral-focus": "#1f2937",
             "neutral-content": "#f9fafb",
             "base-100": "#ffffff",
             "base-200": "#f9fafb",
             "base-300": "#f3f4f6",
             "base-content": "#1f2937",
             "info": "#3b82f6",
             "success": "#10b981",
             "warning": "#f59e0b",
             "error": "#ef4444"
           }
         }
       ],
       darkTheme: "dracula",
       base: true,
       styled: true,
       utils: true,
       prefix: '',
       logs: true,
       themeRoot: ':root'
     }
   }
   ```

3. **處理 CSS**

   使用以下命令處理 CSS 檔案：

   ```bash
   npx postcss assets/css/app.css -o public/css/app.css
   ```

4. **處理 JavaScript**

   使用 ESBuild 處理 JavaScript 檔案，確保支援最新的 JavaScript 語法與特性：

   ```bash
   npx esbuild assets/js/main.js --bundle --outfile=public/js/main.js --minify
   ```

5. **啟動 Hugo 伺服器**

   使用以下命令啟動 Hugo 伺服器，並觀察變更：

   ```bash
   hugo server -D
   ```

6. **檢查輸出**

   確保在 `public` 目錄中生成了正確的 CSS 和 JavaScript 檔案，並且在瀏覽器中正確加載。

---

### 8.2 JavaScript 處理流程

**JavaScript 處理概述**

本專案使用 ESBuild 作為主要的 JavaScript 打包工具，並結合 Hugo 的資源管道進行優化處理。

**主要步驟**

1. **安裝 ESBuild**

   確保已安裝 ESBuild，若未安裝可使用以下命令安裝：

   ```bash
   npm install --save-dev esbuild
   ```

2. **配置 ESBuild**

   在專案根目錄創建或更新 `esbuild.config.js` 檔案，建議 loader 支援二代圖檔格式（webp、avif）：

   ```javascript
   const { build } = require('esbuild');

   build({
     entryPoints: ['themes/twda_v5/assets/js/main.js'],
     bundle: true,
     minify: true,
     outfile: 'public/js/main.js',
     sourcemap: true,
     loader: {
       '.js': 'jsx',
       '.ts': 'tsx',
       '.png': 'dataurl',
       '.jpg': 'dataurl',
       '.jpeg': 'dataurl',
       '.gif': 'dataurl',
       '.svg': 'dataurl',
       '.webp': 'dataurl',
       '.avif': 'dataurl',
     },
   }).catch(() => process.exit(1));
   ```

3. **處理 JavaScript**

   使用以下命令處理 JavaScript 檔案：

   ```bash
   npx esbuild
   ```

4. **檢查輸出**

   確保在 `public/js` 目錄中生成了正確的 JavaScript 檔案，並且在瀏覽器中正確加載。

---

### 8.3 CSS 處理流程

**CSS 處理概述**

本專案使用 PostCSS 結合 Tailwind CSS 進行 CSS 的處理與優化。

**主要步驟**

1. **安裝 PostCSS 與 Tailwind CSS**

   確保已安裝 PostCSS 與 Tailwind CSS，若未安裝可使用以下命令安裝：

   ```bash
   npm install --save-dev postcss tailwindcss
   ```

2. **配置 PostCSS**

   在專案根目錄創建或更新 `postcss.config.js` 檔案：

   ```javascript
   module.exports = {
     plugins: {
       tailwindcss: {},
       autoprefixer: {},
     },
   }
   ```

3. **處理 CSS**

   使用以下命令處理 CSS 檔案：

   ```bash
   npx postcss assets/css/app.css -o public/css/app.css
   ```

4. **檢查輸出**

   確保在 `public/css` 目錄中生成了正確的 CSS 檔案，並且在瀏覽器中正確加載。

---

**AI Prompt:**

```text
請協助我建立進階的 TailwindCSS + DaisyUI 整合系統，需要：

進階 Tailwind 配置：
- 完整字體系統: Inter + Noto Sans TC (中文) + JetBrains Mono
- 自訂顏色擴展與間距
- 豐富動畫系統: fade, slide, bounce, pulse, spin
- 響應式斷點擴展 (xs: 475px)

Typography 深度整合：
- DaisyUI CSS 變數完整支援
- 中文排版最佳化 (行高、字間距)
- 程式碼區塊美化
- 表格與引用樣式
- 深色模式完整支援

自訂 DaisyUI 主題：
- dracula: 完整深色主題色彩定義
- cmyk: 專業淺色主題色彩定義
- 語意化顏色系統 (primary, secondary, accent, neutral, base)
- 狀態顏色 (info, success, warning, error)

請說明主題設計原則與色彩無障礙最佳實踐。
```
