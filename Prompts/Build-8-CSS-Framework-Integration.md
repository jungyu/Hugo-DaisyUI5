# Hugo 專案建構階段 8：CSS 框架進階擴展與最佳實踐

> **專案狀態**: ✅ 進行中  
> **技術棧**: Hugo v0.147.9 + TailwindCSS v4.1.11 + DaisyUI v5.0.43 + Alpine.js v3.14.9  
> **更新日期**: 2025年7月3日

本階段專注於在 [階段 5：前端技術整合](./Build-5-Frontend-Integration.md) 的基礎上，進一步擴展 Tailwind CSS 和 DaisyUI 功能，實現更進階的 UI 元件和視覺效果，同時改進專案的可訪問性和使用者體驗。我們將建立更多自定義元件和風格系統，以豐富專案的 UI 設計語言。

## 階段目標

- ✅ 擴展自定義進階元件庫（卡片、表單、按鈕變體等）
- ✅ 改進響應式設計和 WCAG 可訪問性
- ✅ 建立更完善的多主題系統（超越基本的明暗模式）
- ✅ 設計一致的視覺語言和微動畫系統

## 前置條件

✅ 已完成 [階段 5：前端技術整合](./Build-5-Frontend-Integration.md)  
✅ 已完成 [階段 7：Alpine.js 整合](./Build-7-Alpinejs-Integration.md)  
✅ Tailwind CSS v4 + DaisyUI v5 基礎配置已完成

## 步驟詳解

本階段將在 [階段 5：前端技術整合](./Build-5-Frontend-Integration.md) 基礎上進行擴展，專注於更進階的 CSS 框架應用。我們假設您已經完成了基本的 Tailwind CSS v4 和 DaisyUI v5 整合。

### 1. 建立進階自定義元件庫

在基礎元件之上，我們將建立更多進階和複合元件，滿足各種常見 UI 設計需求。

#### 1.1 互動效果增強元件

讓我們創建一些具有進階交互效果的元件，使網站更具吸引力和動感。

**檔案內容 (`themes/twda_v5/assets/css/components/advanced-buttons.css`):**

```css
/* 進階按鈕效果集合 */

/* 漸變效果按鈕 */
.btn-gradient {
  @apply bg-gradient-to-r from-primary to-accent border-none text-white;
  @apply hover:from-primary-focus hover:to-accent-focus;
  @apply active:from-primary-focus active:to-accent-focus;
  @apply relative overflow-hidden;
}

/* 脈衝按鈕 */
.btn-pulse {
  @apply relative overflow-hidden;
}

.btn-pulse::after {
  @apply content-[''] absolute inset-0 bg-white opacity-0 scale-0;
  animation: pulse 1.5s infinite;
}

@keyframes pulse {
  0% { transform: scale(0.5); opacity: 0.4; }
  50% { opacity: 0.2; }
  100% { transform: scale(1.5); opacity: 0; }
}

/* 浮動效果按鈕 */
.btn-float {
  @apply transition-transform duration-300;
  @apply hover:-translate-y-1 active:translate-y-0;
}

/* 發光按鈕 */
.btn-glow {
  @apply relative;
  @apply before:absolute before:inset-0 before:rounded-[inherit];
  @apply before:bg-primary/20 before:opacity-0 before:blur-md;
  @apply before:transition-all before:duration-300;
  @apply hover:before:opacity-100 hover:before:scale-110;
}
```

#### 1.2 進階卡片元件

**檔案內容 (`themes/twda_v5/assets/css/components/advanced-cards.css`):**

```css
/* 進階卡片元件集合 */

/* 視差卡片 */
.card-parallax {
  @apply card overflow-hidden;
  @apply relative transform transition-transform duration-700;
  @apply hover:z-10;
}

.card-parallax .card-image {
  @apply h-48 relative overflow-hidden;
  @apply transition-transform duration-700 ease-out;
}

.card-parallax:hover .card-image {
  @apply transform scale-105;
}

.card-parallax .card-body {
  @apply transform transition-all duration-500;
}

.card-parallax:hover .card-body {
  @apply bg-base-100/90 backdrop-blur-sm;
}

/* 3D 翻轉卡片 */
.card-flip {
  @apply relative h-64 w-full perspective-1000;
}

.card-flip-inner {
  @apply relative w-full h-full transition-transform duration-500;
  transform-style: preserve-3d;
}

.card-flip:hover .card-flip-inner {
  transform: rotateY(180deg);
}

.card-flip-front, .card-flip-back {
  @apply card absolute w-full h-full backface-hidden;
}

.card-flip-back {
  transform: rotateY(180deg);
  @apply bg-primary text-primary-content;
}
```

#### 1.3 進階表單元件

**檔案內容 (`themes/twda_v5/assets/css/components/advanced-forms.css`):**

```css
/* 進階表單元件 */

/* 步驟式表單 */
.form-stepper {
  @apply flex items-center justify-between mb-8;
}

.form-stepper-step {
  @apply flex flex-col items-center relative;
}

.form-stepper-step-number {
  @apply w-10 h-10 rounded-full bg-base-300 flex items-center justify-center font-bold;
  @apply text-base-content transition-all duration-300;
}

.form-stepper-step.active .form-stepper-step-number {
  @apply bg-primary text-primary-content;
}

.form-stepper-step.completed .form-stepper-step-number {
  @apply bg-success text-success-content;
}

.form-stepper-step-label {
  @apply mt-2 text-sm text-center;
}

.form-stepper-line {
  @apply flex-1 h-1 bg-base-300;
}

.form-stepper-line.active {
  @apply bg-primary;
}

/* 輸入驗證動畫 */
.input-validation {
  @apply relative;
}

.input-validation-icon {
  @apply absolute right-3 top-1/2 -translate-y-1/2;
  @apply opacity-0 transition-opacity duration-300;
}

.input-validation.valid .input-validation-icon.valid {
  @apply opacity-100 text-success;
}

.input-validation.invalid .input-validation-icon.invalid {
  @apply opacity-100 text-error;
}
```

#### 1.4 主入口 CSS 更新

將所有進階元件整合到主 CSS 檔案中：

**檔案內容 (`themes/twda_v5/assets/css/app-advanced.css`):**

```css
/* TailwindCSS v4 + DaisyUI v5 進階整合 */
@import "tailwindcss";
@plugin "daisyui";

/* 基礎元件 - 從階段 5 導入 */
@import "./components/buttons.css";
@import "./components/cards.css";
@import "./components/forms.css";

/* 進階元件 - 本階段新增 */
@import "./components/advanced-buttons.css";
@import "./components/advanced-cards.css";
@import "./components/advanced-forms.css";
@import "./components/animations.css";
@import "./components/accessibility.css";

/* 擴展動畫效果庫 */
@keyframes floating {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
}

@keyframes pulse-ring {
  0% { transform: scale(0.8); opacity: 0.8; }
  70% { transform: scale(1.5); opacity: 0; }
  100% { transform: scale(2); opacity: 0; }
}

@keyframes slide-in-right {
  from { transform: translateX(50px); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
}

/* 動畫輔助類 */
.animate-floating {
  animation: floating 3s ease-in-out infinite;
}

.animate-pulse-ring {
  animation: pulse-ring 1.5s cubic-bezier(0.24, 0, 0.38, 1) infinite;
}

.animate-slide-in-right {
  animation: slide-in-right 0.6s ease-out;
}
```

### 2. 進階主題與風格系統

#### 2.1 多主題擴展系統

在基礎主題系統的基礎上，我們將建立一個更完整的多主題擴展系統，包括顏色、字體和風格切換。

**檔案內容 (`themes/twda_v5/assets/css/theme-system.css`):**

```css
/* 進階多主題系統 */

/* 基本變數定義 */
:root {
  /* 全局陰影效果 */
  --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  --shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
  --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
  --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
  
  /* 動畫參數 */
  --transition-fast: 0.15s;
  --transition-normal: 0.3s;
  --transition-slow: 0.5s;
  --ease-out-expo: cubic-bezier(0.16, 1, 0.3, 1);
  --ease-in-out: cubic-bezier(0.42, 0, 0.58, 1);
  
  /* 字體大小調整系統 */
  --font-scale: 1;
}

/* 字體大小調整類 */
.font-size-sm {
  --font-scale: 0.9;
}

.font-size-base {
  --font-scale: 1;
}

.font-size-lg {
  --font-scale: 1.1;
}

.font-size-xl {
  --font-scale: 1.2;
}

/* 應用字體大小調整 */
html {
  font-size: calc(16px * var(--font-scale));
}

/* 新增額外主題 */
[data-theme="ocean"] {
  --primary: 8 145 178; /* #0891b2 */
  --primary-focus: 8 126 164; /* #087ea4 */
  --primary-content: 255 255 255; /* #ffffff */
  
  --secondary: 6 182 212; /* #06b6d4 */
  --secondary-focus: 22 163 191; /* #16a3bf */
  --secondary-content: 255 255 255; /* #ffffff */
  
  --accent: 2 132 199; /* #0284c7 */
  --accent-focus: 3 105 161; /* #0369a1 */
  --accent-content: 255 255 255; /* #ffffff */
  
  /* 基礎色彩 */
  --base-100: 255 255 255; /* #ffffff */
  --base-200: 241 245 249; /* #f1f5f9 */
  --base-300: 226 232 240; /* #e2e8f0 */
  --base-content: 15 23 42; /* #0f172a */
}

[data-theme="cherry"] {
  --primary: 225 29 72; /* #e11d48 */
  --primary-focus: 190 18 60; /* #be123c */
  --primary-content: 255 255 255; /* #ffffff */
  
  --secondary: 244 63 94; /* #f43f5e */
  --secondary-focus: 219 39 119; /* #db2777 */
  --secondary-content: 255 255 255; /* #ffffff */
  
  --accent: 249 168 212; /* #f9a8d4 */
  --accent-focus: 236 72 153; /* #ec4899 */
  --accent-content: 15 23 42; /* #0f172a */
  
  /* 基礎色彩 */
  --base-100: 255 255 255; /* #ffffff */
  --base-200: 252 231 243; /* #fce7f3 */
  --base-300: 249 168 212; /* #f9a8d4 */
  --base-content: 15 23 42; /* #0f172a */
}
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

#### 2.2 主題切換增強系統

創建一個支持多種主題切換並記住使用者偏好的進階系統：

**檔案內容 (`themes/twda_v5/assets/js/components/themeManager.js`):**

```javascript
// 進階主題管理系統
// 先定義一個輔助函數來獲取系統偏好
const getSystemPreferenceHelper = () => {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

export default () => ({
  // 使用 DaisyUI v5 精選主題
  themes: ['light', 'dark', 'cupcake', 'dracula', 'autumn', 'emerald'],
  currentTheme: localStorage.getItem('theme') || getSystemPreferenceHelper(),
  fontSize: localStorage.getItem('fontSize') || 'base',
  fontSizeOptions: ['sm', 'base', 'lg', 'xl'],
  
  init() {
    this.applyTheme(this.currentTheme);
    this.applyFontSize(this.fontSize);
    this.setupListeners();
    
    // 發送初始主題加載事件
    window.dispatchEvent(new CustomEvent('theme-loaded', { 
      detail: { theme: this.currentTheme }
    }));
  },
  
  getSystemPreference() {
    return getSystemPreferenceHelper();
  },
  
  applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    this.currentTheme = theme;
    
    // 發送主題變更事件
    window.dispatchEvent(new CustomEvent('theme-changed', { 
      detail: { theme }
    }));
  },
  
  applyFontSize(size) {
    // 移除所有字體大小類
    this.fontSizeOptions.forEach(option => {
      document.documentElement.classList.remove(`font-size-${option}`);
    });
    
    // 應用選擇的字體大小
    if (size !== 'base') {
      document.documentElement.classList.add(`font-size-${size}`);
    }
    
    localStorage.setItem('fontSize', size);
    this.fontSize = size;
    
    // 發送字體大小變更事件
    window.dispatchEvent(new CustomEvent('font-size-changed', { 
      detail: { size }
    }));
  },
  
  setupListeners() {
    // 監聽系統偏好變更
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
      if (!localStorage.getItem('theme-locked')) {
        this.applyTheme(e.matches ? 'dark' : 'light');
      }
    });
  }
});
```

### 3. 可訪問性與 WCAG 合規

建立符合 WCAG 2.1 AA 級標準的可訪問性增強功能：

**檔案內容 (`themes/twda_v5/assets/css/components/accessibility.css`):**

```css
/* WCAG 2.1 AA 可訪問性增強 */

/* 螢幕閱讀器輔助類 */
.sr-only {
  @apply absolute w-px h-px p-0 -m-px overflow-hidden whitespace-nowrap border-0;
  clip: rect(0, 0, 0, 0);
  clip-path: inset(50%);
}

.sr-only-focusable:focus {
  @apply not-sr-only static w-auto h-auto overflow-visible whitespace-normal;
  @apply p-2 m-2;
  clip: auto;
  clip-path: none;
}

/* 鍵盤導航增強 */
:focus-visible {
  @apply outline-2 outline-offset-2 outline-primary;
}

/* 跳過導航鏈接 */
.skip-to-content {
  @apply sr-only focus:not-sr-only;
  @apply fixed top-0 left-0 z-[9999] m-3;
  @apply bg-primary text-primary-content px-4 py-3;
  @apply focus:outline-none focus:ring-2 focus:ring-primary-focus;
}

/* 高對比模式支援 */
@media (forced-colors: active) {
  .btn, .card, .badge {
    forced-color-adjust: none;
  }
}

### 4. DaisyUI v5 主題切換器整合

DaisyUI v5 提供了內建的主題控制器 (theme-controller)，可以通過純 CSS 的方式實現主題切換，不再需要依賴額外的 JavaScript。只需使用帶有 `theme-controller` 類的 checkbox 或 radio 輸入元素即可自動切換主題。

> **注意：** DaisyUI v5 的 theme-controller 功能基於 CSS 選擇器，僅支持某些現代瀏覽器 (Chrome 105+, Firefox 121+, Safari 15.4+)。對於更廣泛的瀏覽器支援，可以結合 Alpine.js 實現向下兼容。

#### 4.1 使用 Swap 元件實現主題切換器

**檔案內容 (`themes/twda_v5/layouts/partials/theme-switcher-swap.html`):**

```html
<label class="swap swap-rotate">
  <!-- 隱藏的複選框控制狀態 -->
  <input type="checkbox" class="theme-controller" value="dark" />
  
  <!-- 太陽圖示（亮色主題） -->
  <svg class="swap-off h-6 w-6 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
    <path d="M5.64,17l-.71.71a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0l.71-.71A1,1,0,0,0,5.64,17ZM5,12a1,1,0,0,0-1-1H3a1,1,0,0,0,0,2H4A1,1,0,0,0,5,12Zm7-7a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V4A1,1,0,0,0,12,5ZM5.64,7.05a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29,1,1,0,0,0,0-1.41l-.71-.71A1,1,0,0,0,4.93,6.34Zm12,.29a1,1,0,0,0,.7-.29l.71-.71a1,1,0,1,0-1.41-1.41L17,5.64a1,1,0,0,0,0,1.41A1,1,0,0,0,17.66,7.34ZM21,11H20a1,1,0,0,0,0,2h1a1,1,0,0,0,0-2Zm-9,8a1,1,0,0,0-1,1v1a1,1,0,0,0,2,0V20A1,1,0,0,0,12,19ZM18.36,17A1,1,0,0,0,17,18.36l.71.71a1,1,0,0,0,1.41,0,1,1,0,0,0,0-1.41ZM12,6.5A5.5,5.5,0,1,0,17.5,12,5.51,5.51,0,0,0,12,6.5Zm0,9A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z" />
  </svg>
  
  <!-- 月亮圖示（暗色主題） -->
  <svg class="swap-on h-6 w-6 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
    <path d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Zm-9.5,6.69A8.14,8.14,0,0,1,7.08,5.22v.27A10.15,10.15,0,0,0,17.22,15.63a9.79,9.79,0,0,0,2.1-.22A8.11,8.11,0,0,1,12.14,19.73Z" />
  </svg>
</label>
```

#### 4.2 使用多主題下拉選單

**檔案內容 (`themes/twda_v5/layouts/partials/theme-switcher-dropdown.html`):**

```html
<div class="dropdown dropdown-end">
  <div tabindex="0" role="button" class="btn btn-ghost btn-circle">
    <svg width="20" height="20" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="h-5 w-5 stroke-current">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"></path>
    </svg>
  </div>
  <ul tabindex="0" class="dropdown-content z-[1] bg-base-300 rounded-box max-h-[70vh] w-52 overflow-y-auto p-2 shadow-2xl">
    <li><input type="radio" name="theme-dropdown" class="theme-controller w-full btn btn-sm btn-block btn-ghost justify-start" aria-label="淺色" value="light"/></li>
    <li><input type="radio" name="theme-dropdown" class="theme-controller w-full btn btn-sm btn-block btn-ghost justify-start" aria-label="深色" value="dark"/></li>
    <li><input type="radio" name="theme-dropdown" class="theme-controller w-full btn btn-sm btn-block btn-ghost justify-start" aria-label="杯子蛋糕" value="cupcake"/></li>
    <li><input type="radio" name="theme-dropdown" class="theme-controller w-full btn btn-sm btn-block btn-ghost justify-start" aria-label="德古拉" value="dracula"/></li>
    <li><input type="radio" name="theme-dropdown" class="theme-controller w-full btn btn-sm btn-block btn-ghost justify-start" aria-label="秋季" value="autumn"/></li>
    <li><input type="radio" name="theme-dropdown" class="theme-controller w-full btn btn-sm btn-block btn-ghost justify-start" aria-label="翡翠" value="emerald"/></li>
  </ul>
</div>
```

#### 4.3 使用單選按鈕實現多主題切換

**檔案內容 (`themes/twda_v5/layouts/partials/theme-switcher-radio.html`):**

```html
<fieldset class="flex gap-2 items-center">
  <label class="flex gap-2 cursor-pointer items-center">
    <input type="radio" name="theme-radios" class="radio radio-xs theme-controller" value="light"/>
    <span class="text-xs">淺色</span>
  </label>
  <label class="flex gap-2 cursor-pointer items-center">
    <input type="radio" name="theme-radios" class="radio radio-xs theme-controller" value="dark"/>
    <span class="text-xs">深色</span>
  </label>
  <label class="flex gap-2 cursor-pointer items-center">
    <input type="radio" name="theme-radios" class="radio radio-xs theme-controller" value="cupcake"/>
    <span class="text-xs">杯子蛋糕</span>
  </label>
  <label class="flex gap-2 cursor-pointer items-center">
    <input type="radio" name="theme-radios" class="radio radio-xs theme-controller" value="dracula"/>
    <span class="text-xs">德古拉</span>
  </label>
  <label class="flex gap-2 cursor-pointer items-center">
    <input type="radio" name="theme-radios" class="radio radio-xs theme-controller" value="emerald"/>
    <span class="text-xs">翡翠</span>
  </label>
</fieldset>
```

#### 4.4 使用 Alpine.js 與 DaisyUI 整合的進階主題切換器

**檔案內容 (`themes/twda_v5/layouts/partials/theme-switcher-alpine.html`):**

```html
<div x-data="darkMode" class="dropdown dropdown-end">
  <label tabindex="0" class="btn btn-ghost btn-circle">
    <!-- 深色模式圖示（暗色主題時顯示） -->
    <svg 
      x-show="dark" 
      class="h-5 w-5" 
      fill="none" 
      viewBox="0 0 24 24" 
      stroke="currentColor"
    >
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
    </svg>
    
    <!-- 亮色模式圖示（亮色主題時顯示） -->
    <svg 
      x-show="!dark" 
      class="h-5 w-5" 
      fill="none" 
      viewBox="0 0 24 24" 
      stroke="currentColor"
    >
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
  </label>
  
  <!-- 隱藏的 theme-controller 輸入元素（與 DaisyUI v5 theme-controller 整合） -->
  <input type="checkbox" class="theme-controller sr-only" value="dark" x-bind:checked="dark" @change="toggle()" />
  
  <ul tabindex="0" class="dropdown-content menu p-2 shadow-lg bg-base-300 rounded-box w-52">
    <li>
      <button @click="dark = false; updateTheme()" class="flex items-center gap-2" :class="{'font-bold': !dark}">
        <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
        淺色主題
      </button>
    </li>
    
    <li>
      <button @click="dark = true; updateTheme()" class="flex items-center gap-2" :class="{'font-bold': dark}">
        <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
        </svg>
        暗黑主題
      </button>
    </li>
  </ul>
</div>
```

#### 4.5 主題初始化與 DaisyUI v5 整合

**Alpine.js 與 DaisyUI v5 主題控制器的整合**

使用 Alpine.js 的 `darkMode` 元件與 DaisyUI v5 的 `theme-controller` 可以實現無縫整合。由於我們已經有了 `darkMode` 元件，我們只需要添加一個簡單的橋接腳本，確保兩者之間的主題同步：

```javascript
// themes/twda_v5/assets/js/theme-bridge.js
document.addEventListener('alpine:init', () => {
  // 擴展 darkMode 元件，添加與 DaisyUI v5 theme-controller 橋接功能
  Alpine.data('darkMode', () => ({
    dark: Alpine.$persist(false).as('darkMode'),
    
    init() {
      // 檢查系統偏好
      if (!this.dark) {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
        this.dark = prefersDark
      }
      
      this.updateTheme()
      
      // 監聽系統主題變更
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        if (!localStorage.getItem('darkMode')) {
          this.dark = e.matches
          this.updateTheme()
        }
      })
      
      // 監聽 DaisyUI theme-controller 變化
      document.querySelectorAll('.theme-controller').forEach(controller => {
        controller.addEventListener('change', (e) => {
          if (e.target.value === 'dark' && e.target.checked) {
            this.dark = true
          } else if (e.target.value === 'light' && e.target.checked) {
            this.dark = false
          }
        });
      });
    },
    
    toggle() {
      this.dark = !this.dark
      this.updateTheme()
    },
    
    updateTheme() {
      // 更新 HTML data-theme 屬性
      document.documentElement.setAttribute('data-theme', this.dark ? 'dark' : 'light')
      
      // 更新 HTML class 屬性
      if (this.dark) {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
      
      // 同步 theme-controller 元素狀態
      const themeController = document.querySelector(`.theme-controller[value="${this.dark ? 'dark' : 'light'}"]`)
      if (themeController) {
        themeController.checked = true
      }
    }
  }))
})
```

### 5. 創建主題展示頁面

為了展示我們實現的多主題系統和進階元件，建立一個專用的展示頁面是很有用的。這可以幫助開發者和設計師直觀地了解和測試不同的主題效果。

#### 5.1 建立主題展示頁面模板

**檔案內容 (`layouts/page/theme-showcase.html`):**

```html
{{ define "main" }}
<div class="container mx-auto py-10 px-4">
  <div class="prose prose-lg max-w-none mb-10">
    <h1 class="text-3xl font-bold">{{ .Title }}</h1>
    <p>{{ .Description }}</p>
  </div>

  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
    <!-- Swap 主題切換器 -->
    <div class="card bg-base-100 shadow-xl">
      <div class="card-body">
        <h2 class="card-title">Swap 主題切換器</h2>
        <p>使用 DaisyUI swap 元件實現的簡易明/暗主題切換。</p>
        <div class="flex justify-center py-4">
          {{ partial "theme-switcher-swap.html" . }}
        </div>
        <div class="card-actions justify-end">
          <div class="badge badge-outline">簡單</div>
          <div class="badge badge-primary">DaisyUI v5</div>
        </div>
      </div>
    </div>

    <!-- 下拉式主題選單 -->
    <div class="card bg-base-100 shadow-xl">
      <div class="card-body">
        <h2 class="card-title">主題下拉選單</h2>
        <p>使用 DaisyUI dropdown 元件實現的多主題切換下拉選單。</p>
        <div class="flex justify-center py-4">
          {{ partial "theme-switcher-dropdown.html" . }}
        </div>
        <div class="card-actions justify-end">
          <div class="badge badge-outline">進階</div>
          <div class="badge badge-primary">多主題</div>
        </div>
      </div>
    </div>

    <!-- 更多主題切換器和元件展示... -->
  </div>

  <!-- 按鈕展示 -->
  <div class="mt-12">
    <h2 class="text-2xl font-bold mb-6">按鈕樣式展示</h2>
    <div class="flex flex-wrap gap-2">
      <button class="btn">默認按鈕</button>
      <button class="btn btn-primary">主要按鈕</button>
      <button class="btn btn-secondary">次要按鈕</button>
      <!-- 更多按鈕樣式... -->
    </div>
  </div>

  <!-- 進階按鈕效果 -->
  <div class="mt-8">
    <h2 class="text-2xl font-bold mb-6">進階按鈕效果</h2>
    <div class="flex flex-wrap gap-2">
      <button class="btn btn-gradient">漸變按鈕</button>
      <button class="btn btn-primary btn-pulse">脈衝按鈕</button>
      <button class="btn btn-secondary btn-float">浮動按鈕</button>
      <button class="btn btn-accent btn-glow">發光按鈕</button>
    </div>
  </div>

  <!-- 卡片展示 -->
  <div class="mt-12">
    <h2 class="text-2xl font-bold mb-6">進階卡片展示</h2>
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <!-- 視差卡片和翻轉卡片展示... -->
    </div>
  </div>
</div>
{{ end }}
```

#### 5.2 創建主題展示頁面內容

**檔案內容 (`content/themes.md`):**

```markdown
---
title: "主題系統展示"
date: 2024-07-04
draft: false
description: "Hugo + TailwindCSS v4 + DaisyUI v5 主題系統展示頁面"
layout: "page/theme-showcase"
---

這個頁面展示了 Hugo + TailwindCSS v4 + DaisyUI v5 的主題系統功能，包含不同類型的主題切換器和色彩展示。

## 主題切換功能

本頁面展示了多種主題切換器的實現方式，包括：

1. Swap 元件實現的簡易明/暗主題切換
2. 多主題下拉選單
3. 單選按鈕組
4. Alpine.js 整合的進階主題切換器

## 進階元件

此頁面也展示了各種進階元件，包括：

- 漸變、脈衝、浮動和發光按鈕效果
- 視差效果卡片
- 3D 翻轉卡片

所有這些元件均支援主題系統，會根據當前選擇的主題自動調整樣式。
```

### 6. DaisyUI v5 主題配置更新

為了確保主題系統正確運作，需要在 `tailwind.config.js` 中進行適當的配置：

**檔案內容 (`tailwind.config.js`) 部分片段:**

```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  // ...前面的配置...
  
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
        }
      },
      // 引用 DaisyUI v5 精選主題
      "cupcake", "dracula", "autumn", "emerald"
    ],
    darkTheme: "dark",
    logs: false
  }
};
```

此配置確保了我們可以使用 DaisyUI v5 的主題系統，並且只啟用了我們需要的幾個官方主題：`light`、`dark`、`cupcake`、`dracula`、`autumn` 和 `emerald`。這樣可以減少最終構建的 CSS 大小，同時為用戶提供足夠的主題選擇。

## 驗證與檢查

完成 CSS 框架整合後，請確認以下事項：

- [ ] 自定義元件樣式已正確引入並可用
- [ ] Tailwind 和 DaisyUI 配置正確更新
- [ ] 多主題切換功能正常運作
- [ ] 響應式設計在不同尺寸的裝置上表現良好
- [ ] 頁面元素符合可訪問性標準
- [ ] 主題展示頁面可以正確顯示各種切換器和元件

## AI Prompt 協助

> 我已經整合了 Tailwind CSS v4 和 DaisyUI v5 到我的 Hugo 專案中，但遇到了一些問題。主題切換不正常工作，某些自定義元件樣式沒有被正確應用。請幫我檢查我的 CSS 架構和 Tailwind 配置是否有問題，特別是元件的引入順序和 DaisyUI 主題配置部分。

## 下一階段

✅ [階段 9：Hugo 資源處理](./Build-9-Hugo-Resource-Processing.md) - 配置 Hugo 資源處理系統，優化圖片、CSS 和 JavaScript 資源。

---

📚 **相關資源:**

- [Tailwind CSS v4 官方文件](https://tailwindcss.com/docs)
- [DaisyUI v5 組件文檔](https://daisyui.com/components/)
- [DaisyUI v5 主題控制器](https://daisyui.com/docs/themes/)
- [Alpine.js v3 官方文檔](https://alpinejs.dev)
- [Web 內容可訪問性指南 (WCAG)](https://www.w3.org/WAI/standards-guidelines/wcag/)
- [Hugo 前端工具指南](https://gohugo.io/categories/asset-management/)
