# Hugo 專案建構階段 5：前端技術整合 (Tailwind CSS v4 + DaisyUI v5)

> **專案狀態**: ✅ 進行中  
> **技術棧**: Hugo v0.147.9 + TailwindCSS v4.1.11 + DaisyUI v5.0.43 + Alpine.js v3.14.9

本階段專注於將 Tailwind CSS v4 和 DaisyUI v5 整合到 Hugo 專案中，完成前端技術棧的設定。這包括安裝依賴套件、配置 CSS 架構和建立主題系統。

## 階段目標

- 整合 Tailwind CSS v4 和 DaisyUI v5
- 建立基本的 CSS 架構
- 配置 Tailwind 和 PostCSS
- 實作主題系統

## 前置條件

✅ 已完成 [階段 4：基礎 HTML 模板](./Build-4-Base-Templates.md)  
✅ Hugo 專案結構完整且可運行

## 步驟詳解

### 1. 依賴套件安裝

**CLI 指令:**

```bash
# TailwindCSS v4 + PostCSS
npm install -D tailwindcss@^4.1.11 @tailwindcss/postcss@^4.1.11
npm install -D autoprefixer@latest postcss@^8.5.6 postcss-cli@^11.0.1

# DaisyUI v5
npm install daisyui@^5.0.43

# Alpine.js 相關 (選用 - 本專案使用 CDN)
npm install -D alpinejs@^3.14.9 @alpinejs/intersect@^3.14.9 @alpinejs/persist@^3.14.9

# Typography 與工具
npm install -D @tailwindcss/typography@^0.5.16
npm install -D theme-change@^2.5.0

# 運行時功能依賴
npm install date-fns@^4.1.0 fuse.js@^7.0.0 katex@^0.16.20 mark.js@^8.11.1 mermaid@^11.4.1
```

### 2. CSS 架構與配置

#### 2.1 主要 CSS 檔案 (`themes/twda_v5/assets/css/app.css`)

```css
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

### 3. Tailwind 配置檔案

**CLI 指令:**

```bash
# 生成 Tailwind 配置檔案
npx tailwindcss init -p
```

**檔案內容 (`tailwind.config.js`):**

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
        }
      }
    ],
    darkTheme: "dark",
    logs: false
  }
};
```

### 4. PostCSS 配置

**檔案內容 (`postcss.config.js`):**

```javascript
module.exports = {
  plugins: {
    'tailwindcss': {},
    'autoprefixer': {},
  }
}
```

### 5. 主題系統實作

**部分檔案 (`themes/twda_v5/layouts/partials/header.html`):**

```html
<header class="bg-base-100 border-b border-base-300 shadow-sm sticky top-0 z-50">
  <div class="container mx-auto flex items-center justify-between p-4">
    <!-- Logo -->
    <a href="{{ .Site.Home.RelPermalink }}" class="flex items-center">
      <span class="text-xl font-bold text-primary">{{ .Site.Title }}</span>
    </a>

    <!-- 主題切換按鈕 -->
    <div class="flex items-center gap-2">
      <button
        class="btn btn-circle btn-ghost btn-sm"
        data-toggle-theme="dark,light"
        data-act-class="active"
      >
        <i class="i-sun hidden dark:inline h-5 w-5"></i>
        <i class="i-moon dark:hidden h-5 w-5"></i>
      </button>
    </div>
  </div>
</header>
```

**主題切換腳本 (`themes/twda_v5/layouts/partials/footer.html`):**

```html
<!-- 主題切換腳本 (使用 theme-change 套件) -->
<script src="https://cdn.jsdelivr.net/npm/theme-change@2.5.0/index.js"></script>

<script>
  // 檢查並設定偏好主題
  (function() {
    // 檢查本地儲存
    const savedTheme = localStorage.getItem('theme');
    // 檢查系統偏好
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // 設定初始主題
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
</script>
```

## 驗證與檢查

完成前端技術整合後，請確認以下事項：

- [ ] Tailwind CSS 和 DaisyUI 依賴已正確安裝
- [ ] 基本 CSS 結構已建立並可用
- [ ] Tailwind 配置檔案正確配置並包含必要的路徑
- [ ] PostCSS 配置正確
- [ ] 主題切換功能可正常運作

## AI Prompt 協助

> 請幫我檢查我的 Hugo 專案中 TailwindCSS v4 和 DaisyUI v5 的整合。特別是 tailwind.config.js 中的 content 路徑是否正確，以及是否有任何 PostCSS 的配置問題。我需要讓 DaisyUI 的主題切換功能正常運作。

## 下一階段

✅ [階段 6：Hugo 配置系統](./Build-6-Hugo-Configuration.md) - 建立和配置 Hugo 配置檔案，包括網站參數、菜單和多語言支援。

---

📚 **相關資源:**
- [Tailwind CSS v4 官方文件](https://tailwindcss.com/docs)
- [DaisyUI v5 組件](https://daisyui.com/components/)
- [PostCSS 官方文件](https://postcss.org/)
- [theme-change 使用指南](https://github.com/saadeghi/theme-change)
