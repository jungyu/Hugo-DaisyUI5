# DaisyUI v5 Hugo 配置指南

## 概述

DaisyUI 5 是一個現代化的 Tailwind CSS 組件庫，與 Tailwind CSS 4 完全兼容。本指南說明如何在 Hugo 專案中正確配置 DaisyUI v5。

## 主要改進

### 1. Tailwind CSS 4 兼容性
- DaisyUI 5 完全支援 Tailwind CSS 4
- 可以在 CSS 文件中直接導入 DaisyUI 作為插件
- 零依賴，包大小減少 61%

### 2. 新的配置方式
使用 Tailwind CSS 4，可以直接在 CSS 文件中配置 DaisyUI：

```css
/* app.css */
@import "tailwindcss";
@plugin "daisyui";
```

或從 node_modules 導入完整的 CSS 文件：

```css
/* app.css */
@import "tailwindcss";
@import "daisyui/dist/daisyui.css";
```

## Hugo 專案配置

### 1. 安裝依賴

```bash
npm install -D tailwindcss@^4.1.11 @tailwindcss/postcss@^4.1.11
npm install daisyui@^5.0.43
```

### 2. CSS 配置

在 `assets/css/app.css` 或 `themes/your-theme/assets/css/app.css` 中：

```css
/* TailwindCSS v4 與 DaisyUI 基礎樣式 */
@import "tailwindcss";
@import "daisyui/dist/daisyui.css";

/* 自定義樣式 */
:root {
  --primary-color: #3b82f6;
  --secondary-color: #64748b;
}

body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  line-height: 1.6;
}
```

### 3. Tailwind 配置

在 `tailwind.config.js` 中：

```javascript
module.exports = {
  content: [
    "./content/**/*.{html,js,md}",
    "./layouts/**/*.html",
    "./themes/*/layouts/**/*.html",
    "./assets/**/*.{js,ts}",
    "./data/**/*.{json,toml,yaml,yml}",
    "./i18n/**/*.toml"
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
    // DaisyUI 作為 Tailwind 插件
    require('daisyui')
  ],
  daisyui: {
    themes: [
      "light",
      "dark", 
      "cupcake",
      "bumblebee",
      "emerald",
      "corporate",
      "synthwave",
      "retro",
      "cyberpunk",
      "valentine",
      "halloween",
      "garden",
      "forest",
      "aqua",
      "lofi",
      "pastel",
      "fantasy",
      "wireframe",
      "black",
      "luxury",
      "dracula",
      "cmyk",
      "autumn",
      "business",
      "acid",
      "lemonade",
      "night",
      "coffee",
      "winter",
      "dim",
      "nord",
      "sunset",
      // DaisyUI 5 新主題
      "caramellatte",
      "abyss",
      "silk"
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

### 4. PostCSS 配置

在 `postcss.config.js` 中：

```javascript
module.exports = {
  plugins: {
    '@tailwindcss/postcss': {},
    autoprefixer: {},
  },
}
```

### 5. Hugo 管道配置

在 Hugo 模板中處理 CSS（例如 `layouts/partials/head.html`）：

```html
{{- $options := (dict "targetPath" "css/app.min.css" "outputStyle" "compressed") }}
{{- $css := resources.Get "css/app.css" | resources.PostCSS $options }}
{{- if hugo.IsProduction }}
  {{- $css = $css | minify | fingerprint }}
{{- end }}
<link rel="stylesheet" href="{{ $css.RelPermalink }}" {{ if hugo.IsProduction }}integrity="{{ $css.Data.Integrity }}"{{ end }}>
```

## 主題切換功能

### 1. HTML 結構

使用 DaisyUI 推薦的 `data-theme` 屬性：

```html
<html data-theme="light">
<!-- 或動態設定 -->
<html data-theme="{{ .Site.Params.theme | default "light" }}">
```

### 2. 主題切換按鈕

```html
<!-- 在 header.html 中 -->
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

### 3. JavaScript 主題切換邏輯

在 `assets/js/theme.js` 或直接在模板中：

```javascript
// 主題切換功能
document.addEventListener('DOMContentLoaded', function() {
  // 從 localStorage 讀取已保存的主題
  const savedTheme = localStorage.getItem('theme') || 'light';
  document.documentElement.setAttribute('data-theme', savedTheme);
  
  // 更新主題指示器
  updateThemeIndicator(savedTheme);
  
  // 監聽主題切換按鈕
  document.querySelectorAll('[data-set-theme]').forEach(button => {
    button.addEventListener('click', function() {
      const theme = this.getAttribute('data-set-theme');
      setTheme(theme);
    });
  });
  
  function setTheme(theme) {
    // 設定 data-theme 屬性
    document.documentElement.setAttribute('data-theme', theme);
    
    // 保存到 localStorage
    localStorage.setItem('theme', theme);
    
    // 更新主題指示器
    updateThemeIndicator(theme);
    
    // 觸發 theme change 事件
    window.dispatchEvent(new CustomEvent('themechange', { 
      detail: { theme: theme } 
    }));
  }
  
  function updateThemeIndicator(theme) {
    // 隱藏所有指示器
    document.querySelectorAll('[class*="theme-indicator-"]').forEach(indicator => {
      indicator.classList.add('hidden');
    });
    
    // 顯示當前主題的指示器
    const currentIndicator = document.querySelector(`.theme-indicator-${theme}`);
    if (currentIndicator) {
      currentIndicator.classList.remove('hidden');
    }
  }
});
```

## DaisyUI 5 新功能

### 1. 新組件
- **List**: 垂直列表布局
- **Status**: 狀態指示器（支援 xs, sm, md, lg, xl 尺寸）
- **Fieldset**: 表單字段分組
- **Label**: 表單標籤（支援浮動標籤）
- **Filter**: 單選過濾器
- **Calendar**: 日曆組件
- **Validator**: 表單驗證
- **Dock**: 底部導航（替代 bottom-navigation）

### 2. 新的樣式修飾符
- **soft**: 柔和樣式（按鈕、徽章、警告等）
- **dash**: 虛線樣式
- **xl**: 特大尺寸（所有支援尺寸的組件）

### 3. 新主題
- **caramellatte**: 溫暖的棕色調淺色主題
- **abyss**: 深綠色與藍綠色的深色主題  
- **silk**: 明亮乾淨的螢光色主題

### 4. 改進的顏色變數
DaisyUI 5 使用更易讀的 CSS 變數名稱：

```css
/* DaisyUI 5 新格式 */
:root {
  --color-primary: oklch(49.12% 0.309 275.75);
  --color-primary-content: oklch(89.824% 0.061 275.75);
  --color-base-100: oklch(100% 0 0);
  --color-base-200: oklch(96.115% 0 0);
  --color-base-300: oklch(92.416% 0.001 197.137);
  --color-base-content: oklch(27.807% 0.029 256.847);
}
```

## 最佳實踐

### 1. 主題文件組織
```
themes/your-theme/
├── assets/
│   ├── css/
│   │   └── app.css
│   └── js/
│       └── theme.js
├── layouts/
│   ├── partials/
│   │   ├── head.html
│   │   └── header.html
│   └── _default/
│       └── baseof.html
└── static/
```

### 2. 響應式設計
所有 DaisyUI 5 修飾符類別都支援響應式前綴：

```html
<button class="btn btn-sm md:btn-md lg:btn-lg">響應式按鈕</button>
<div class="alert alert-info md:alert-success">響應式警告</div>
```

### 3. 自定義主題
使用新的主題產生器創建自定義主題：
- 訪問 [https://daisyui.com/theme-generator/](https://daisyui.com/theme-generator/)
- 配置顏色、效果和尺寸
- 複製生成的 CSS 到您的專案

### 4. 效果變數
DaisyUI 5 引入新的效果變數：

```css
:root {
  --depth: 1; /* 深度效果 */
  --noise: 0.5; /* 噪點效果 */
}
```

## 遷移指南

### 從 DaisyUI 4 升級到 5

1. **更新依賴**：
```bash
npm update daisyui@^5.0.43 tailwindcss@^4.1.11
```

2. **更新 CSS 導入**：
```css
/* 舊版 */
@tailwind base;
@tailwind components;
@tailwind utilities;

/* 新版 */
@import "tailwindcss";
@import "daisyui/dist/daisyui.css";
```

3. **更新類別名稱**：
- `card-compact` → `card-sm`
- `btm-nav` → `dock`
- `form-control` → 使用新的 `fieldset` 組件
- `btn-group` → `join`（已在 2023 年棄用）

4. **更新主題變數**：
參考新的顏色變數格式並更新自定義主題。

## 故障排除

### 1. CSS 未生成
確保 PostCSS 配置正確且 DaisyUI CSS 文件路徑正確。

### 2. 主題切換不工作
檢查 JavaScript 是否正確載入，`data-theme` 屬性是否正確設定。

### 3. 響應式類別無效
確保使用最新版本的 DaisyUI 5，所有修飾符都已支援響應式。

### 4. 與 Tailwind v4 兼容性問題
確保使用正確的 PostCSS 插件 `@tailwindcss/postcss`。

## 資源連結

- [DaisyUI 5 官方文檔](https://daisyui.com/docs/v5/)
- [DaisyUI 5 更新日誌](https://daisyui.com/docs/changelog/)
- [DaisyUI 主題產生器](https://daisyui.com/theme-generator/)
- [Tailwind CSS 4 升級指南](https://tailwindcss.com/docs/upgrade-guide)
- [DaisyUI GitHub](https://github.com/saadeghi/daisyui)
