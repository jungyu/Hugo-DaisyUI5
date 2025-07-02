# Hugo 專案 WCAG 無障礙網頁內容指導原則

> 本文檔提供 Hugo + TailwindCSS + DaisyUI 專案符合 WCAG 2.1 AA 級無障礙標準的完整指導原則與實作方法。

## 目錄

1. [WCAG 基本原則](#1-wcag-基本原則)
2. [可感知性 (Perceivable)](#2-可感知性-perceivable)
3. [可操作性 (Operable)](#3-可操作性-operable)  
4. [可理解性 (Understandable)](#4-可理解性-understandable)
5. [堅固性 (Robust)](#5-堅固性-robust)
6. [Hugo 實作指南](#6-hugo-實作指南)
7. [DaisyUI 無障礙元件](#7-daisyui-無障礙元件)
8. [測試與驗證](#8-測試與驗證)
9. [AI Prompt 範例](#9-ai-prompt-範例)

---

## 1. WCAG 基本原則

WCAG 2.1 基於四大核心原則，簡稱 **POUR**：

### 1.1 Perceivable (可感知性)
資訊和使用者介面元件必須以使用者能夠感知的方式呈現。

### 1.2 Operable (可操作性)  
使用者介面元件和導航必須是可操作的。

### 1.3 Understandable (可理解性)
資訊和使用者介面的操作必須是可理解的。

### 1.4 Robust (堅固性)
內容必須足夠堅固，可被各種使用者代理（包括輔助技術）可靠地解讀。

---

## 2. 可感知性 (Perceivable)

### 2.1 替代文字 (Alt Text) - WCAG 1.1.1

**要求**: 為所有非文字內容提供替代文字。

**Hugo 實作方式**:

```html
<!-- ✅ 正確：有意義的圖片描述 -->
<img src="team-meeting.jpg" alt="五位團隊成員圍桌討論專案計畫">

<!-- ✅ 正確：裝飾性圖片使用空 alt -->
<img src="decorative-border.svg" alt="" role="presentation">

<!-- ✅ 正確：Hugo Shortcode 自動處理 -->
{{< picture src="product-demo.jpg" alt="產品展示畫面，顯示主要功能介面" >}}

<!-- ❌ 錯誤：缺少或無意義的 alt -->
<img src="image1.jpg" alt="圖片">
<img src="photo.jpg">
```

**Hugo Shortcode 範例**:
```go
{{/* layouts/shortcodes/accessible-image.html */}}
{{- $src := .Get "src" -}}
{{- $alt := .Get "alt" -}}
{{- $caption := .Get "caption" -}}
{{- $decorative := .Get "decorative" | default false -}}

<figure class="image-container">
  {{- if $decorative -}}
    <img src="{{ $src }}" alt="" role="presentation" loading="lazy">
  {{- else -}}
    <img src="{{ $src }}" alt="{{ $alt }}" loading="lazy">
  {{- end -}}
  {{- if $caption -}}
    <figcaption>{{ $caption }}</figcaption>
  {{- end -}}
</figure>
```

### 2.2 色彩對比 - WCAG 1.4.3

**要求**: 文字與背景對比度至少 4.5:1 (AA級)，大文字至少 3:1。

**DaisyUI 主題配置**:
```css
/* themes/twda_v5/assets/css/accessibility.css */
:root {
  /* 確保高對比度 */
  --text-high-contrast: #000000;
  --bg-high-contrast: #ffffff;
  --link-contrast: #0066cc;
  --focus-contrast: #ff6600;
}

/* 高對比度模式支援 */
@media (prefers-contrast: high) {
  .btn {
    border: 2px solid currentColor;
  }
  
  .link {
    text-decoration: underline;
    text-decoration-thickness: 2px;
  }
}
```

**TailwindCSS 配置**:
```javascript
// tailwind.config.js - 無障礙色彩系統
module.exports = {
  theme: {
    extend: {
      colors: {
        'accessible': {
          'text-primary': '#212529',    // 對比度 16.94:1
          'text-secondary': '#6c757d',  // 對比度 7.07:1  
          'link': '#0d6efd',           // 對比度 8.59:1
          'focus': '#fd7e14',          // 對比度 5.74:1
          'error': '#dc3545',          // 對比度 5.47:1
          'success': '#198754',        // 對比度 4.56:1
        }
      }
    }
  }
}
```

### 2.3 可調整文字大小 - WCAG 1.4.4

**要求**: 文字可放大至 200% 而不失去功能。

**Hugo 實作**:
```html
<!-- layouts/partials/accessibility/font-controls.html -->
<div class="font-size-controls" role="region" aria-label="字體大小控制">
  <button type="button" 
          class="btn btn-sm" 
          onclick="adjustFontSize('decrease')"
          aria-label="縮小字體">
    A-
  </button>
  <button type="button" 
          class="btn btn-sm" 
          onclick="adjustFontSize('reset')"
          aria-label="重設字體大小">
    A
  </button>
  <button type="button" 
          class="btn btn-sm" 
          onclick="adjustFontSize('increase')"
          aria-label="放大字體">
    A+
  </button>
</div>
```

**Alpine.js 實作**:
```javascript
// themes/twda_v5/assets/js/accessibility.js
Alpine.data('fontSizeController', () => ({
  fontSize: 16,
  init() {
    this.fontSize = parseInt(localStorage.getItem('fontSize')) || 16;
    this.applyFontSize();
  },
  increase() {
    if (this.fontSize < 32) {
      this.fontSize += 2;
      this.applyFontSize();
      this.save();
    }
  },
  decrease() {
    if (this.fontSize > 12) {
      this.fontSize -= 2;
      this.applyFontSize();
      this.save();
    }
  },
  reset() {
    this.fontSize = 16;
    this.applyFontSize();
    this.save();
  },
  applyFontSize() {
    document.documentElement.style.fontSize = `${this.fontSize}px`;
  },
  save() {
    localStorage.setItem('fontSize', this.fontSize);
  }
}));
```

---

## 3. 可操作性 (Operable)

### 3.1 鍵盤可訪問性 - WCAG 2.1.1

**要求**: 所有功能都可透過鍵盤操作。

**Hugo 實作**:
```html
<!-- ✅ 正確：可鍵盤操作的導航 -->
<nav class="main-navigation" role="navigation" aria-label="主要導航">
  <ul class="menu menu-horizontal">
    <li><a href="/" class="menu-item">首頁</a></li>
    <li class="dropdown" x-data="{ open: false }">
      <button class="menu-item" 
              @click="open = !open"
              @keydown.escape="open = false"
              @keydown.arrow-down="open = true"
              :aria-expanded="open"
              aria-haspopup="true">
        文章分類
        <svg class="dropdown-icon" :class="{ 'rotate-180': open }">...</svg>
      </button>
      <ul class="dropdown-content" 
          x-show="open" 
          x-transition
          @keydown.escape="open = false">
        <li><a href="/tech/" class="dropdown-item">技術文章</a></li>
        <li><a href="/life/" class="dropdown-item">生活分享</a></li>
      </ul>
    </li>
  </ul>
</nav>
```

### 3.2 焦點指示器 - WCAG 2.4.7

**要求**: 鍵盤焦點指示器必須清晰可見。

**CSS 實作**:
```css
/* themes/twda_v5/assets/css/focus.css */
/* 統一的焦點樣式 */
*:focus {
  outline: 2px solid var(--focus-color, #fd7e14);
  outline-offset: 2px;
  border-radius: 4px;
}

/* 隱藏預設瀏覽器焦點樣式，但保持可訪問性 */
*:focus:not(:focus-visible) {
  outline: none;
}

/* 滑鼠點擊時隱藏焦點，鍵盤使用時顯示 */
*:focus-visible {
  outline: 2px solid var(--focus-color, #fd7e14);
  outline-offset: 2px;
}

/* 跳過連結 */
.skip-link {
  position: absolute;
  top: -40px;
  left: 6px;
  background: var(--primary);
  color: var(--primary-content);
  padding: 8px;
  text-decoration: none;
  border-radius: 4px;
  z-index: 1000;
}

.skip-link:focus {
  top: 6px;
}
```

### 3.3 跳過連結 - WCAG 2.4.1

**Hugo 實作**:
```html
<!-- layouts/partials/accessibility/skip-links.html -->
<div class="skip-links">
  <a href="#main-content" class="skip-link">跳至主要內容</a>
  <a href="#main-navigation" class="skip-link">跳至主要導航</a>
  <a href="#search" class="skip-link">跳至搜尋</a>
  <a href="#footer" class="skip-link">跳至頁尾</a>
</div>
```

---

## 4. 可理解性 (Understandable)

### 4.1 語言識別 - WCAG 3.1.1

**Hugo 實作**:
```html
<!-- layouts/_default/baseof.html -->
<!DOCTYPE html>
<html lang="{{ .Site.Language.Lang }}" dir="{{ .Site.Language.LanguageDirection | default "ltr" }}">
<head>
  <meta charset="utf-8">
  <!-- 其他 meta 標籤 -->
</head>
<body>
  <!-- 多語言內容標示 -->
  <article lang="zh-TW">
    <h1>{{ .Title }}</h1>
    <div class="content">
      {{ .Content }}
    </div>
  </article>
  
  <!-- 引用其他語言內容 -->
  <blockquote lang="en" cite="https://example.com">
    "This is an English quote"
  </blockquote>
</body>
</html>
```

### 4.2 錯誤識別與建議 - WCAG 3.3.1

**表單驗證實作**:
```html
<!-- layouts/partials/forms/contact-form.html -->
<form class="form-control w-full max-w-md" 
      x-data="contactForm()" 
      @submit.prevent="submitForm()">
  
  <div class="form-group">
    <label for="name" class="label">
      <span class="label-text">姓名 <span class="required" aria-label="必填">*</span></span>
    </label>
    <input type="text" 
           id="name"
           name="name"
           class="input input-bordered w-full"
           :class="{ 'input-error': errors.name }"
           x-model="form.name"
           required
           aria-describedby="name-error"
           aria-invalid="false"
           :aria-invalid="errors.name ? 'true' : 'false'">
    <div id="name-error" 
         class="error-message" 
         x-show="errors.name" 
         role="alert"
         aria-live="polite">
      <span x-text="errors.name"></span>
    </div>
  </div>
  
  <div class="form-group">
    <label for="email" class="label">
      <span class="label-text">電子郵件 <span class="required" aria-label="必填">*</span></span>
    </label>
    <input type="email" 
           id="email"
           name="email"
           class="input input-bordered w-full"
           :class="{ 'input-error': errors.email }"
           x-model="form.email"
           required
           aria-describedby="email-error email-help"
           :aria-invalid="errors.email ? 'true' : 'false'">
    <div id="email-help" class="help-text">
      請輸入有效的電子郵件地址
    </div>
    <div id="email-error" 
         class="error-message" 
         x-show="errors.email" 
         role="alert">
      <span x-text="errors.email"></span>
    </div>
  </div>
  
  <button type="submit" 
          class="btn btn-primary"
          :disabled="isSubmitting"
          :aria-busy="isSubmitting">
    <span x-show="!isSubmitting">送出</span>
    <span x-show="isSubmitting">
      <span class="loading loading-spinner loading-sm"></span>
      送出中...
    </span>
  </button>
</form>
```

---

## 5. 堅固性 (Robust)

### 5.1 有效的 HTML - WCAG 4.1.1

**Hugo 模板最佳實踐**:
```html
<!-- layouts/_default/single.html -->
<article class="article" itemscope itemtype="https://schema.org/BlogPosting">
  <header class="article-header">
    <h1 class="article-title" itemprop="headline">{{ .Title }}</h1>
    <div class="article-meta">
      <time datetime="{{ .Date.Format "2006-01-02T15:04:05Z07:00" }}" 
            itemprop="datePublished">
        {{ .Date.Format "2006年01月02日" }}
      </time>
      {{ if .Lastmod }}
      <time datetime="{{ .Lastmod.Format "2006-01-02T15:04:05Z07:00" }}" 
            itemprop="dateModified">
        更新於 {{ .Lastmod.Format "2006年01月02日" }}
      </time>
      {{ end }}
    </div>
  </header>
  
  <div class="article-content" itemprop="articleBody">
    {{ .Content }}
  </div>
  
  <footer class="article-footer">
    {{ if .Params.tags }}
    <div class="tags" role="group" aria-label="文章標籤">
      {{ range .Params.tags }}
      <a href="{{ "/tags/" | relLangURL }}{{ . | urlize }}" 
         class="tag" 
         rel="tag">{{ . }}</a>
      {{ end }}
    </div>
    {{ end }}
  </footer>
</article>
```

### 5.2 ARIA 標籤正確使用 - WCAG 4.1.2

**常用 ARIA 模式**:
```html
<!-- 搜尋功能 -->
<div class="search-container" x-data="searchComponent()">
  <label for="search-input" class="sr-only">搜尋文章</label>
  <div class="search-input-group" role="search">
    <input type="search" 
           id="search-input"
           class="input input-bordered"
           placeholder="搜尋..."
           x-model="query"
           @input.debounce.300ms="performSearch()"
           aria-describedby="search-help"
           :aria-expanded="showResults"
           aria-autocomplete="list"
           aria-controls="search-results"
           role="combobox">
    <button type="button" 
            class="btn btn-primary"
            @click="performSearch()"
            aria-label="執行搜尋">
      <svg class="search-icon">...</svg>
    </button>
  </div>
  
  <div id="search-help" class="help-text">
    輸入關鍵字搜尋文章內容
  </div>
  
  <div id="search-results" 
       class="search-results"
       x-show="showResults"
       role="listbox"
       aria-label="搜尋結果">
    <template x-for="result in results" :key="result.id">
      <a :href="result.url" 
         class="search-result-item"
         role="option"
         :aria-selected="result.selected">
        <h3 x-text="result.title"></h3>
        <p x-text="result.excerpt"></p>
      </a>
    </template>
    
    <div x-show="results.length === 0 && query.length > 0" 
         role="status"
         aria-live="polite">
      未找到相關結果
    </div>
  </div>
</div>

<!-- 模態框 -->
<div class="modal" 
     :class="{ 'modal-open': showModal }"
     x-show="showModal"
     role="dialog"
     aria-modal="true"
     :aria-labelledby="modalId + '-title'"
     :aria-describedby="modalId + '-description'">
  <div class="modal-box">
    <h2 :id="modalId + '-title'" class="modal-title">{{ .Title }}</h2>
    <div :id="modalId + '-description'" class="modal-content">
      {{ .Content }}
    </div>
    <div class="modal-action">
      <button type="button" 
              class="btn" 
              @click="closeModal()"
              autofocus>
        確定
      </button>
    </div>
  </div>
  <div class="modal-backdrop" @click="closeModal()"></div>
</div>
```

---

## 6. Hugo 實作指南

### 6.1 無障礙 Shortcode 庫

```go
{{/* layouts/shortcodes/accessible-table.html */}}
{{- $caption := .Get "caption" -}}
{{- $headers := .Get "headers" | split "," -}}

<div class="table-container" role="region" aria-label="資料表">
  <table class="table table-zebra w-full">
    {{ if $caption }}
    <caption class="table-caption">{{ $caption }}</caption>
    {{ end }}
    <thead>
      <tr>
        {{ range $headers }}
        <th scope="col">{{ . | title }}</th>
        {{ end }}
      </tr>
    </thead>
    <tbody>
      {{ .Inner }}
    </tbody>
  </table>
</div>

{{/* 使用方式 */}}
{{< accessible-table caption="月份銷售統計" headers="月份,銷售額,成長率" >}}
<tr>
  <td>一月</td>
  <td>$10,000</td>
  <td>+5%</td>
</tr>
{{< /accessible-table >}}
```

### 6.2 無障礙導航元件

```html
<!-- layouts/partials/navigation/breadcrumb.html -->
<nav aria-label="網站路徑" class="breadcrumbs text-sm">
  <ol class="breadcrumb-list">
    <li class="breadcrumb-item">
      <a href="{{ .Site.BaseURL }}" class="breadcrumb-link">
        <svg class="home-icon" aria-hidden="true">...</svg>
        <span class="sr-only">首頁</span>
      </a>
    </li>
    
    {{ $pages := slice }}
    {{ range .Ancestors.Reverse }}
      {{ $pages = $pages | append . }}
    {{ end }}
    {{ $pages = $pages | append . }}
    
    {{ range $index, $page := $pages }}
      {{ if ne $index 0 }}
        <li class="breadcrumb-item">
          {{ if eq $page . }}
            <span class="breadcrumb-current" aria-current="page">
              {{ $page.Title }}
            </span>
          {{ else }}
            <a href="{{ $page.Permalink }}" class="breadcrumb-link">
              {{ $page.Title }}
            </a>
          {{ end }}
        </li>
      {{ end }}
    {{ end }}
  </ol>
</nav>
```

---

## 7. DaisyUI 無障礙元件

### 7.1 按鈕與表單元件

```html
<!-- 按鈕群組 -->
<div class="btn-group" role="group" aria-label="文字格式選項">
  <button class="btn" 
          aria-pressed="false" 
          @click="toggleBold()"
          aria-label="粗體">
    <strong>B</strong>
  </button>
  <button class="btn" 
          aria-pressed="false" 
          @click="toggleItalic()"
          aria-label="斜體">
    <em>I</em>
  </button>
  <button class="btn" 
          aria-pressed="false" 
          @click="toggleUnderline()"
          aria-label="底線">
    <u>U</u>
  </button>
</div>

<!-- 滑塊控制 -->
<div class="form-control">
  <label for="volume" class="label">
    <span class="label-text">音量</span>
  </label>
  <input type="range" 
         id="volume"
         min="0" 
         max="100" 
         value="50" 
         class="range range-primary"
         aria-valuemin="0"
         aria-valuemax="100"
         aria-valuenow="50"
         aria-valuetext="音量 50%">
  <div class="range-labels">
    <span>靜音</span>
    <span>最大音量</span>
  </div>
</div>

<!-- 手風琴 -->
<div class="collapse collapse-arrow">
  <input type="checkbox" 
         id="accordion-1"
         class="collapse-checkbox" 
         aria-expanded="false"> 
  <label for="accordion-1" 
         class="collapse-title"
         role="button"
         aria-controls="accordion-content-1">
    常見問題 1
  </label>
  <div id="accordion-content-1" 
       class="collapse-content"
       role="region"
       aria-labelledby="accordion-1">
    <p>這裡是問題的詳細回答內容...</p>
  </div>
</div>
```

### 7.2 回饋與狀態元件

```html
<!-- 警告訊息 -->
<div class="alert alert-warning" 
     role="alert" 
     aria-live="polite">
  <svg class="alert-icon" aria-hidden="true">...</svg>
  <div>
    <h3 class="alert-title">注意</h3>
    <div class="alert-description">請檢查您的輸入內容</div>
  </div>
</div>

<!-- 進度指示器 -->
<div class="progress-container" role="progressbar" 
     aria-valuemin="0" 
     aria-valuemax="100" 
     aria-valuenow="75"
     aria-labelledby="progress-label">
  <div id="progress-label" class="progress-label">上傳進度</div>
  <progress class="progress progress-primary w-full" value="75" max="100">75%</progress>
  <div class="progress-text" aria-live="polite">75% 完成</div>
</div>

<!-- 載入狀態 -->
<button class="btn btn-primary" 
        :disabled="isLoading"
        :aria-busy="isLoading">
  <span x-show="!isLoading">送出</span>
  <span x-show="isLoading" class="loading-state">
    <span class="loading loading-spinner loading-sm" aria-hidden="true"></span>
    <span class="sr-only">載入中</span>
    處理中...
  </span>
</button>
```

---

## 8. 測試與驗證

### 8.1 自動化測試腳本

```bash
# scripts/accessibility-test.sh
#!/bin/bash

echo "🔍 無障礙性測試開始..."

# 安裝測試工具
npm install -g @axe-core/cli lighthouse

# 建構網站
hugo --gc --minify

# Axe 核心無障礙測試
echo "📋 執行 Axe 無障礙測試..."
axe public --include-tags wcag2a,wcag2aa,wcag21aa --reporter json --output-file accessibility-report.json

# Lighthouse 無障礙評分
echo "🚨 執行 Lighthouse 測試..."
lighthouse public/index.html --only-categories=accessibility --output json --output-file lighthouse-accessibility.json

# HTML 驗證
echo "✅ HTML 標準驗證..."
html5validator --root public/ --log INFO

echo "🎉 無障礙測試完成！"
echo "📊 報告檔案："
echo "  - accessibility-report.json (Axe 詳細報告)"
echo "  - lighthouse-accessibility.json (Lighthouse 評分)"
```

### 8.2 鍵盤導航測試

```javascript
// themes/twda_v5/assets/js/keyboard-test.js
document.addEventListener('DOMContentLoaded', function() {
  // 鍵盤導航測試
  let focusableElements = [];
  let currentFocusIndex = -1;
  
  function getAllFocusableElements() {
    const selectors = [
      'a[href]',
      'button:not([disabled])',
      'textarea:not([disabled])',
      'input:not([disabled])',
      'select:not([disabled])',
      '[tabindex]:not([tabindex="-1"])'
    ];
    
    focusableElements = Array.from(
      document.querySelectorAll(selectors.join(','))
    ).filter(el => {
      return !el.hasAttribute('disabled') && 
             !el.hidden && 
             el.offsetParent !== null;
    });
  }
  
  // 檢查焦點陷阱
  function checkFocusTrap() {
    const modals = document.querySelectorAll('[role="dialog"][aria-modal="true"]');
    modals.forEach(modal => {
      if (modal.style.display !== 'none') {
        const focusableInModal = modal.querySelectorAll(
          'a[href], button, textarea, input, select, [tabindex]:not([tabindex="-1"])'
        );
        
        if (focusableInModal.length === 0) {
          console.warn('模態框缺少可焦點元素:', modal);
        }
      }
    });
  }
  
  // 檢查 ARIA 標籤
  function checkAriaLabels() {
    const elementsNeedingLabels = document.querySelectorAll(
      'button:not([aria-label]):not([aria-labelledby]), input:not([aria-label]):not([aria-labelledby])'
    );
    
    elementsNeedingLabels.forEach(el => {
      if (!el.textContent.trim() && !el.querySelector('img[alt]')) {
        console.warn('元素缺少無障礙標籤:', el);
      }
    });
  }
  
  // 執行測試
  getAllFocusableElements();
  checkFocusTrap();
  checkAriaLabels();
  
  console.log(`找到 ${focusableElements.length} 個可焦點元素`);
});
```

### 8.3 色彩對比檢查器

```javascript
// 色彩對比計算器
function calculateContrast(rgb1, rgb2) {
  function luminance(r, g, b) {
    const [rs, gs, bs] = [r, g, b].map(c => {
      c = c / 255;
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
  }
  
  const lum1 = luminance(rgb1.r, rgb1.g, rgb1.b);
  const lum2 = luminance(rgb2.r, rgb2.g, rgb2.b);
  
  const lighter = Math.max(lum1, lum2);
  const darker = Math.min(lum1, lum2);
  
  return (lighter + 0.05) / (darker + 0.05);
}

// 檢查頁面中所有文字元素的對比度
function checkAllTextContrasts() {
  const textElements = document.querySelectorAll('p, h1, h2, h3, h4, h5, h6, a, button, span, div, li');
  const problems = [];
  
  textElements.forEach(el => {
    const style = window.getComputedStyle(el);
    const textColor = style.color;
    const bgColor = style.backgroundColor;
    
    if (textColor && bgColor && bgColor !== 'rgba(0, 0, 0, 0)') {
      const contrast = getContrastFromColors(textColor, bgColor);
      const fontSize = parseFloat(style.fontSize);
      const fontWeight = style.fontWeight;
      
      const isLargeText = fontSize >= 18 || (fontSize >= 14 && (fontWeight === 'bold' || parseInt(fontWeight) >= 700));
      const minContrast = isLargeText ? 3 : 4.5;
      
      if (contrast < minContrast) {
        problems.push({
          element: el,
          contrast: contrast.toFixed(2),
          required: minContrast,
          textColor,
          bgColor
        });
      }
    }
  });
  
  return problems;
}
```

---

## 9. AI Prompt 範例

### 9.1 無障礙 HTML 生成

```text
請協助我創建符合 WCAG 2.1 AA 級標準的 Hugo 模板，需要：

HTML 語意化要求：
- 正確使用 HTML5 語意標籤 (header, nav, main, article, aside, footer)
- 適當的標題階層 (h1-h6) 不跳級
- 表單元素與標籤正確關聯
- 圖片提供有意義的 alt 文字

ARIA 最佳實踐：
- 適當使用 ARIA 標籤 (aria-label, aria-labelledby, aria-describedby)
- 正確的 role 屬性設定
- 動態內容使用 aria-live 區域
- 互動元素的狀態標示 (aria-expanded, aria-selected)

鍵盤導航支援：
- 所有互動元素可用 Tab 鍵導航
- 合理的 tabindex 順序
- 清楚的焦點指示器
- 鍵盤快捷鍵支援 (Enter, Space, Escape, Arrow keys)

DaisyUI 元件整合：
- 使用 DaisyUI 無障礙元件類別
- 確保色彩對比符合 4.5:1 標準
- 響應式設計考慮輔助技術
- 支援使用者字體大小調整

請提供完整的模板範例和說明。
```

### 9.2 表單無障礙最佳化

```text
請協助我設計符合 WCAG 標準的表單系統，需要：

表單結構要求：
- fieldset 和 legend 正確分組
- label 與 input 元素正確關聯
- 必填欄位明確標示
- 錯誤訊息清楚易懂

驗證與回饋：
- 即時驗證不干擾使用者輸入
- 錯誤訊息使用 aria-describedby 關聯
- 成功狀態的適當回饋
- aria-invalid 屬性正確設定

Alpine.js 整合：
- 響應式驗證邏輯
- 無障礙的錯誤狀態管理
- 鍵盤友善的互動行為
- 螢幕閱讀器相容的動態內容

請提供包含複雜驗證邏輯的表單範例。
```

### 9.3 導航系統最佳化

```text
請協助我創建無障礙的導航系統，需要：

導航結構：
- 多層級選單的正確 ARIA 標籤
- 鍵盤導航 (Arrow keys, Enter, Escape)
- 行動裝置友善的收合選單
- 跳過連結 (Skip links) 實作

搜尋功能：
- ARIA combobox 模式
- 自動完成建議的無障礙處理
- 搜尋結果的語意標記
- 鍵盤操作支援

麵包屑導航：
- 正確的 nav 和 aria-label
- 當前頁面的 aria-current 標示
- 結構化資料標記

請提供完整的導航元件實作。
```

---

## 總結

本指南提供了完整的 WCAG 2.1 實作方法，涵蓋：

✅ **完整的 WCAG 原則** - POUR 四大核心原則詳細說明
✅ **Hugo 專用實作** - Shortcode、模板、配置最佳實踐  
✅ **DaisyUI 整合** - 無障礙元件使用指南
✅ **Alpine.js 支援** - 動態互動的無障礙處理
✅ **自動化測試** - Axe、Lighthouse 測試腳本
✅ **實用工具** - 色彩對比檢查、鍵盤測試
✅ **AI Prompt 範例** - 快速生成無障礙代碼

遵循這些指導原則，您的 Hugo 網站將能為所有使用者提供優秀的可訪問體驗！    

