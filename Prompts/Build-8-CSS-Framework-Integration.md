# Hugo 專案建構階段 8：CSS 框架整合

> **專案狀態**: ✅ 進行中  
> **技術棧**: Hugo v0.147.9 + TailwindCSS v4.1.11 + DaisyUI v5.0.43 + Alpine.js v3.14.9

本階段專注於更深入地整合 Tailwind CSS 和 DaisyUI 框架，實現更豐富的 UI 元件和視覺效果，同時建立自定義元件和風格系統。

## 階段目標

- 深入整合 TailwindCSS v4 和 DaisyUI v5
- 建立自定義元件和組件庫
- 實作響應式設計和可訪問性
- 配置多主題支援和切換功能

## 前置條件

✅ 已完成 [階段 7：Alpine.js 整合](./Build-7-Alpinejs-Integration.md)  
✅ Alpine.js 已正確整合到專案中

## 步驟詳解

### 1. 建立自定義元件樣式

#### 1.1 元件樣式庫建立

**CLI 指令:**

```bash
# 確保在 hugo-twda-v5 目錄中執行以下指令
# cd hugo-twda-v5  # 如果尚未切換到此目錄

# 建立元件樣式目錄
mkdir -p themes/twda_v5/assets/css/components
```

**檔案內容 (`themes/twda_v5/assets/css/components/buttons.css`):**

```css
/* 自定義按鈕元件 */

/* 主要按鈕樣式擴展 */
.btn-fancy {
  @apply btn btn-primary relative overflow-hidden transition-all duration-300;
  @apply before:absolute before:inset-0 before:bg-white before:opacity-0 before:transition-opacity;
  @apply hover:before:opacity-20 active:before:opacity-30;
  @apply after:absolute after:inset-0 after:rounded-[inherit] after:border-2 after:border-transparent;
  @apply focus:outline-none focus:after:border-white focus:after:opacity-50;
}

/* 漸變按鈕 */
.btn-gradient {
  @apply bg-gradient-to-r from-primary to-accent border-none text-white;
  @apply hover:from-primary-focus hover:to-accent-focus;
  @apply active:from-primary-focus active:to-accent-focus;
}

/* 動畫按鈕 */
.btn-pulse {
  @apply relative overflow-hidden;
}

.btn-pulse::after {
  @apply content-[''] absolute inset-0 bg-white opacity-0 scale-0;
  @apply animate-ping;
  animation: pulse 1.5s infinite;
}

@keyframes pulse {
  0% {
    transform: scale(0.5);
    opacity: 0.4;
  }
  50% {
    opacity: 0.2;
  }
  100% {
    transform: scale(1.5);
    opacity: 0;
  }
}
```

**檔案內容 (`themes/twda_v5/assets/css/components/cards.css`):**

```css
/* 自定義卡片元件 */

/* 特色卡片 */
.card-feature {
  @apply card bg-base-100 shadow-lg hover:shadow-xl transition-all duration-300;
  @apply border border-base-300;
}

/* 文章卡片 */
.card-post {
  @apply card bg-base-100 overflow-hidden border border-base-300;
  @apply hover:border-primary hover:shadow-md transition-all duration-300;
}

.card-post .card-image {
  @apply h-48 overflow-hidden;
}

.card-post .card-image img {
  @apply w-full h-full object-cover object-center transition-transform duration-300;
  @apply hover:scale-105;
}

.card-post .card-body {
  @apply p-5;
}

/* 定價卡片 */
.card-pricing {
  @apply card bg-base-100 shadow-lg border border-base-300;
  @apply hover:shadow-xl hover:border-primary transition-all duration-300;
}

.card-pricing.featured {
  @apply border-primary shadow-md;
  @apply shadow-primary/20;
}

.card-pricing .price {
  @apply text-4xl font-bold text-center my-4;
}

.card-pricing .price-period {
  @apply text-sm opacity-75;
}
```

**檔案內容 (`themes/twda_v5/assets/css/components/forms.css`):**

```css
/* 自定義表單元件 */

/* 浮動標籤輸入框 */
.form-floating {
  @apply relative;
}

.form-floating input,
.form-floating textarea {
  @apply input input-bordered w-full pt-6 pb-2 h-auto;
}

.form-floating label {
  @apply absolute left-4 top-1/2 -translate-y-1/2 transition-all duration-200 pointer-events-none;
  @apply text-base-content/60 text-sm;
}

.form-floating input:focus ~ label,
.form-floating input:not(:placeholder-shown) ~ label,
.form-floating textarea:focus ~ label,
.form-floating textarea:not(:placeholder-shown) ~ label {
  @apply top-4 -translate-y-1/2 text-xs text-primary;
}

/* 表單組 */
.form-group {
  @apply mb-4;
}

.form-label {
  @apply block mb-2 font-medium;
}

.form-hint {
  @apply text-sm text-base-content/60 mt-1;
}

.form-error {
  @apply text-sm text-error mt-1;
}
```

#### 1.2 主入口 CSS 更新

**檔案內容 (`themes/twda_v5/assets/css/app.css`):**

```css
/* TailwindCSS v4 + DaisyUI v5 完整整合 */
@import "tailwindcss";
@import "daisyui/dist/daisyui.css";

/* 自定義元件 */
@import "./components/buttons.css";
@import "./components/cards.css";
@import "./components/forms.css";

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

/* 自定義動畫類 */
@keyframes fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slide-in-up {
  from { transform: translateY(20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

/* 漸層背景 */
.bg-gradient-primary {
  @apply bg-gradient-to-br from-primary to-primary-focus;
}
```

### 2. DaisyUI v5 元件擴展和自訂

#### 2.1 更新 Tailwind 配置

**檔案內容 (`tailwind.config.js` 更新):**

```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  // 從 Hugo 專案的正確路徑指定檔案
  content: [
    './themes/twda_v5/layouts/**/*.html',
    './themes/twda_v5/assets/js/**/*.js',
    './content/**/*.md',
    './layouts/**/*.html',
    './assets/js/**/*.js'
  ],
  
  // DaisyUI v5 的深色模式配置
  darkMode: ['class', '[data-theme="dark"]'],
  
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: '1rem',
        md: '2rem'
      }
    },
    extend: {
      // 配置主題色彩
      colors: {
        brand: {
          50: '#eef8ff',
          100: '#daeeff',
          200: '#b6deff',
          300: '#7cc3ff',
          400: '#399ffc',
          500: '#147df3',
          600: '#036ae8',
          700: '#0052bb',
          800: '#054999',
          900: '#0a3d7d',
          950: '#07274f'
        }
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
        },
        'slide-in-down': {
          '0%': { transform: 'translateY(-20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' }
        },
        'slide-in-left': {
          '0%': { transform: 'translateX(-20px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' }
        },
        'slide-in-right': {
          '0%': { transform: 'translateX(20px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' }
        },
        'bounce-in': {
          '0%': { transform: 'scale(0.8)', opacity: '0' },
          '70%': { transform: 'scale(1.05)', opacity: '1' },
          '100%': { transform: 'scale(1)', opacity: '1' }
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' }
        },
        'glow': {
          '0%, 100%': { boxShadow: '0 0 5px rgba(59, 130, 246, 0.5)' },
          '50%': { boxShadow: '0 0 20px rgba(59, 130, 246, 0.8), 0 0 30px rgba(59, 130, 246, 0.6)' }
        }
      },
      animation: {
        'fade-in': 'fade-in 0.5s ease-out',
        'slide-in-up': 'slide-in-up 0.6s ease-out',
        'slide-in-down': 'slide-in-down 0.6s ease-out',
        'slide-in-left': 'slide-in-left 0.6s ease-out',
        'slide-in-right': 'slide-in-right 0.6s ease-out',
        'bounce-in': 'bounce-in 0.8s ease-out',
        'float': 'float 3s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite'
      },
      
      // Typography 整合
      typography: ({ theme }) => ({
        DEFAULT: {
          css: {
            '--tw-prose-body': theme('colors.gray[700]'),
            '--tw-prose-headings': theme('colors.gray[900]'),
            '--tw-prose-links': theme('colors.brand[600]'),
            '--tw-prose-code': theme('colors.gray[900]'),
            '--tw-prose-pre-code': theme('colors.gray[200]'),
            '--tw-prose-pre-bg': theme('colors.gray[800]'),
            '--tw-prose-quote-borders': theme('colors.brand[200]'),
            '--tw-prose-captions': theme('colors.gray[500]'),
            lineHeight: '1.8',
            letterSpacing: '0.025em'
          }
        },
        invert: {
          css: {
            '--tw-prose-body': theme('colors.gray[300]'),
            '--tw-prose-headings': theme('colors.gray[100]'),
            '--tw-prose-links': theme('colors.brand[400]'),
            '--tw-prose-code': theme('colors.gray[100]'),
            '--tw-prose-pre-code': theme('colors.gray[300]'),
            '--tw-prose-pre-bg': theme('colors.gray[900]'),
            '--tw-prose-quote-borders': theme('colors.brand[700]'),
            '--tw-prose-captions': theme('colors.gray[400]')
          }
        }
      })
    }
  },
  
  plugins: [
    require('@tailwindcss/typography'),
    require('daisyui')
  ],
  
  // DaisyUI v5 配置
  daisyui: {
    themes: [
      {
        light: {
          primary: "#147df3",
          "primary-focus": "#036ae8",
          "primary-content": "#ffffff",
          secondary: "#6d28d9",
          "secondary-focus": "#5b21b6",
          "secondary-content": "#ffffff",
          accent: "#0ea5e9",
          "accent-focus": "#0284c7",
          "accent-content": "#ffffff",
          neutral: "#374151",
          "neutral-focus": "#1f2937",
          "neutral-content": "#ffffff",
          "base-100": "#ffffff",
          "base-200": "#f3f4f6",
          "base-300": "#e5e7eb",
          "base-content": "#1f2937",
          info: "#0ea5e9",
          success: "#10b981",
          warning: "#f59e0b",
          error: "#ef4444",
          "--rounded-box": "0.75rem",
          "--rounded-btn": "0.5rem",
          "--rounded-badge": "0.375rem",
          "--animation-btn": "0.2s",
          "--animation-input": "0.2s",
          "--btn-focus-scale": "0.95",
          "--border-btn": "1px",
          "--tab-border": "1px",
          "--tab-radius": "0.375rem",
        },
        dark: {
          primary: "#147df3",
          "primary-focus": "#036ae8",
          "primary-content": "#ffffff",
          secondary: "#8b5cf6",
          "secondary-focus": "#7c3aed",
          "secondary-content": "#ffffff",
          accent: "#0ea5e9",
          "accent-focus": "#0284c7",
          "accent-content": "#ffffff",
          neutral: "#111827",
          "neutral-focus": "#030712",
          "neutral-content": "#ffffff",
          "base-100": "#1f2937",
          "base-200": "#111827",
          "base-300": "#0f172a",
          "base-content": "#f3f4f6",
          info: "#0ea5e9",
          success: "#10b981",
          warning: "#f59e0b",
          error: "#ef4444",
          "--rounded-box": "0.75rem",
          "--rounded-btn": "0.5rem",
          "--rounded-badge": "0.375rem",
          "--animation-btn": "0.2s",
          "--animation-input": "0.2s",
          "--btn-focus-scale": "0.95",
          "--border-btn": "1px",
          "--tab-border": "1px",
          "--tab-radius": "0.375rem",
        },
        // 新增更多自定義主題
        forest: {
          primary: "#1eb854",
          "primary-focus": "#188c40",
          "primary-content": "#ffffff",
          secondary: "#1f6f45",
          "secondary-focus": "#18543b",
          "secondary-content": "#ffffff",
          accent: "#66cc8a",
          "accent-focus": "#41be6d",
          "accent-content": "#ffffff",
          neutral: "#233329",
          "neutral-focus": "#171f1c",
          "neutral-content": "#ffffff",
          "base-100": "#ffffff",
          "base-200": "#f0f7f1",
          "base-300": "#e0ebe2",
          "base-content": "#233329",
          info: "#3abff8",
          success: "#2bd4bd",
          warning: "#eab308",
          error: "#e11d48",
        },
        ocean: {
          primary: "#0891b2",
          "primary-focus": "#0369a1",
          "primary-content": "#ffffff",
          secondary: "#1d4ed8",
          "secondary-focus": "#1e40af",
          "secondary-content": "#ffffff",
          accent: "#06b6d4",
          "accent-focus": "#0891b2",
          "accent-content": "#ffffff",
          neutral: "#134e5e",
          "neutral-focus": "#0c3944",
          "neutral-content": "#ffffff",
          "base-100": "#ffffff",
          "base-200": "#f0f9ff",
          "base-300": "#e0f2fe",
          "base-content": "#0f172a",
          info: "#0ea5e9",
          success: "#22c55e",
          warning: "#f59e0b",
          error: "#ef4444",
        },
        cherry: {
          primary: "#e11d48",
          "primary-focus": "#be123c",
          "primary-content": "#ffffff",
          secondary: "#9333ea",
          "secondary-focus": "#7e22ce",
          "secondary-content": "#ffffff",
          accent: "#f43f5e",
          "accent-focus": "#e11d48",
          "accent-content": "#ffffff",
          neutral: "#450a0a",
          "neutral-focus": "#3f0a0a",
          "neutral-content": "#ffffff",
          "base-100": "#ffffff",
          "base-200": "#fef2f2",
          "base-300": "#fee2e2",
          "base-content": "#450a0a",
          info: "#3b82f6",
          success: "#10b981",
          warning: "#f59e0b",
          error: "#f87171",
        }
      }
    ],
    darkTheme: "dark",
    logs: false
  }
};
```

### 3. 響應式設計和可訪問性

**建立響應式效用類 (`themes/twda_v5/assets/css/utils.css`):**

```css
/* 響應式效用類 */
.container-narrow {
  @apply container max-w-5xl mx-auto;
}

.container-wide {
  @apply container max-w-7xl mx-auto;
}

/* 螢幕閱讀器專用類 */
.sr-only {
  @apply absolute w-px h-px p-0 -m-px overflow-hidden whitespace-nowrap border-0;
}

.sr-only-focusable:focus {
  @apply not-sr-only static w-auto h-auto overflow-visible whitespace-normal;
  @apply p-2 m-2;
}

/* 可訪問性焦點樣式 */
.focus-visible {
  @apply focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2;
}

/* 可訪問性跳過導航 */
.skip-to-content {
  @apply sr-only focus:not-sr-only;
  @apply fixed top-0 left-0 z-50;
  @apply bg-primary text-primary-content px-4 py-2;
}

/* 布局效用 */
.flex-center {
  @apply flex items-center justify-center;
}

.flex-between {
  @apply flex items-center justify-between;
}
```

**更新主入口 CSS 引入 utils.css:**

```css
/* TailwindCSS v4 + DaisyUI v5 完整整合 */
@import "tailwindcss";
@import "daisyui/dist/daisyui.css";

/* 自定義元件 */
@import "./components/buttons.css";
@import "./components/cards.css";
@import "./components/forms.css";
@import "./utils.css";

/* 其他樣式... */
```

### 4. 主題切換實作

**主題切換器元件 (`themes/twda_v5/layouts/partials/theme-switcher.html`):**

```html
<div 
  x-data="{
    themes: ['light', 'dark', 'forest', 'ocean', 'cherry'],
    currentTheme: localStorage.getItem('theme') || 'light',
    setTheme(theme) {
      this.currentTheme = theme;
      document.documentElement.setAttribute('data-theme', theme);
      localStorage.setItem('theme', theme);
    }
  }" 
  class="dropdown dropdown-end"
>
  <label tabindex="0" class="btn btn-ghost btn-circle">
    <!-- 亮色主題圖標 -->
    <svg x-show="currentTheme === 'light'" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
    
    <!-- 暗色主題圖標 -->
    <svg x-show="currentTheme === 'dark'" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
    
    <!-- 森林主題圖標 -->
    <svg x-show="currentTheme === 'forest'" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>
    
    <!-- 海洋主題圖標 -->
    <svg x-show="currentTheme === 'ocean'" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
    
    <!-- 櫻桃主題圖標 -->
    <svg x-show="currentTheme === 'cherry'" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
  </label>
  
  <ul tabindex="0" class="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52">
    <li>
      <button 
        @click="setTheme('light')" 
        :class="{ 'active': currentTheme === 'light' }"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
        明亮主題
      </button>
    </li>
    <li>
      <button 
        @click="setTheme('dark')" 
        :class="{ 'active': currentTheme === 'dark' }"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
        暗黑主題
      </button>
    </li>
    <li>
      <button 
        @click="setTheme('forest')" 
        :class="{ 'active': currentTheme === 'forest' }"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>
        森林主題
      </button>
    </li>
    <li>
      <button 
        @click="setTheme('ocean')" 
        :class="{ 'active': currentTheme === 'ocean' }"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
        海洋主題
      </button>
    </li>
    <li>
      <button 
        @click="setTheme('cherry')" 
        :class="{ 'active': currentTheme === 'cherry' }"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
        櫻桃主題
      </button>
    </li>
  </ul>
</div>
```

**引入主題切換器至 Header (`themes/twda_v5/layouts/partials/header.html`):**

```html
<header class="bg-base-100 border-b border-base-300 shadow-sm sticky top-0 z-50">
  <div class="container mx-auto flex items-center justify-between p-4">
    <!-- 跳過導航 (可訪問性) -->
    <a href="#main-content" class="skip-to-content">跳至主內容</a>
    
    <!-- Logo -->
    <a href="{{ .Site.Home.RelPermalink }}" class="flex items-center">
      <span class="text-xl font-bold text-primary">{{ .Site.Title }}</span>
    </a>
    
    <!-- 主菜單 -->
    <nav class="hidden md:flex items-center space-x-6">
      {{ $currentPage := . }}
      {{ range .Site.Menus.main }}
        <a 
          href="{{ .URL }}" 
          class="hover:text-primary transition-colors {{ if $currentPage.IsMenuCurrent "main" . }}text-primary font-medium{{ end }}"
        >
          {{ .Name }}
        </a>
      {{ end }}
    </nav>
    
    <!-- 工具列 -->
    <div class="flex items-center gap-2">
      <!-- 語言切換 (如果有啟用多語言) -->
      {{ if .Site.IsMultiLingual }}
        <div class="dropdown dropdown-end">
          <label tabindex="0" class="btn btn-ghost btn-circle">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
            </svg>
          </label>
          <ul tabindex="0" class="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52">
            {{ range .Site.Languages }}
              {{ if ne $.Site.Language.Lang .Lang }}
                <li>
                  <a href="{{ $.Permalink | replaceRE (printf "/%s/" $.Site.Language.Lang) (printf "/%s/" .Lang) }}" class="block px-4 py-2">
                    {{ .LanguageName }}
                  </a>
                </li>
              {{ end }}
            {{ end }}
          </ul>
        </div>
      {{ end }}
      
      <!-- 主題切換器 -->
      {{ partial "theme-switcher.html" . }}
      
      <!-- 行動選單按鈕 -->
      <button
        class="btn btn-ghost btn-circle md:hidden"
        x-data=""
        @click="$dispatch('toggle-menu')"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7" />
        </svg>
      </button>
    </div>
  </div>
</header>

<!-- 行動選單 -->
<div
  x-data="{ open: false }"
  x-show="open"
  x-on:toggle-menu.window="open = !open"
  x-transition:enter="transition ease-out duration-200"
  x-transition:enter-start="opacity-0 -translate-y-10"
  x-transition:enter-end="opacity-100 translate-y-0"
  x-transition:leave="transition ease-in duration-150"
  x-transition:leave-start="opacity-100 translate-y-0"
  x-transition:leave-end="opacity-0 -translate-y-10"
  class="fixed inset-0 z-40 md:hidden"
  style="display: none;"
>
  <!-- 背景遮罩 -->
  <div class="fixed inset-0 bg-black bg-opacity-50" @click="open = false"></div>
  
  <!-- 選單內容 -->
  <div class="relative bg-base-100 w-full p-4 h-auto">
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-lg font-medium">選單</h2>
      <button @click="open = false" class="btn btn-ghost btn-sm btn-circle">✕</button>
    </div>
    
    <nav class="space-y-2">
      {{ range .Site.Menus.main }}
        <a 
          href="{{ .URL }}" 
          class="block py-2 hover:bg-base-200 px-4 rounded-lg hover:text-primary transition-colors {{ if $currentPage.IsMenuCurrent "main" . }}text-primary font-medium bg-base-200{{ end }}"
          @click="open = false"
        >
          {{ .Name }}
        </a>
      {{ end }}
    </nav>
  </div>
</div>
```

## 驗證與檢查

完成 CSS 框架整合後，請確認以下事項：

- [ ] 自定義元件樣式已正確引入並可用
- [ ] Tailwind 和 DaisyUI 配置正確更新
- [ ] 多主題切換功能正常運作
- [ ] 響應式設計在不同尺寸的裝置上表現良好
- [ ] 頁面元素符合可訪問性標準

## AI Prompt 協助

> 我已經整合了 Tailwind CSS v4 和 DaisyUI v5 到我的 Hugo 專案中，但遇到了一些問題。主題切換不正常工作，某些自定義元件樣式沒有被正確應用。請幫我檢查我的 CSS 架構和 Tailwind 配置是否有問題，特別是元件的引入順序和 DaisyUI 主題配置部分。

## 下一階段

✅ [階段 9：Hugo 資源處理](./Build-9-Hugo-Resource-Processing.md) - 配置 Hugo 資源處理系統，優化圖片、CSS 和 JavaScript 資源。

---

📚 **相關資源:**
- [Tailwind CSS v4 官方文件](https://tailwindcss.com/docs)
- [DaisyUI v5 組件文檔](https://daisyui.com/components/)
- [Web 內容可訪問性指南 (WCAG)](https://www.w3.org/WAI/standards-guidelines/wcag/)
- [Hugo 前端工具指南](https://gohugo.io/categories/asset-management/)
