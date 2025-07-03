# Hugo 專案建構階段 10：專案展示與範例

> **專案狀態**: ✅ 進行中  
> **技術棧**: Hugo v0.147.9 + TailwindCSS v4.1.11 + DaisyUI v5.0.43 + Alpine.js v3.14.9

本階段專注於建立專案展示頁面，實現各種常見的布局和功能，展示完整專案範例，驗證整合所有技術棧的實際效果。此階段的內容結構和配置設定已與[階段 6：Hugo 配置系統](./Build-6-Hugo-Configuration.md)同步，確保專案的一致性。

## 階段目標

- 建立專案首頁和展示頁面
- 實現常見的 UI 模式和布局
- 展示互動元件和功能
- 測試整個技術棧的整合效果
- 確保內容結構與 Hugo 配置系統一致

## 前置條件

✅ 已完成 [階段 6：Hugo 配置系統](./Build-6-Hugo-Configuration.md)  
✅ 已完成 [階段 9：Hugo 資源處理](./Build-9-Hugo-Resource-Processing.md)  
✅ 配置系統和資源處理已正確設置

## 步驟詳解

### 1. 建立範例內容

#### 1.1 建立範例頁面

**CLI 指令:**

```bash
# 確保在 hugo-twda-v5 目錄中執行以下指令
# cd hugo-twda-v5  # 如果尚未切換到此目錄

# 建立範例內容目錄
# 根據 Build-6 的配置，內容目錄應該與默認語言設置對齊
mkdir -p content/{posts,pages,projects}

# 建立首頁內容
cat > content/_index.md << 'EOF'
---
title: "Hugo-DaisyUI5 示範網站"
description: "基於 Hugo v0.147.9 + TailwindCSS v4.1.11 + DaisyUI v5.0.43 + Alpine.js v3.14.9 的現代靜態網站"
date: 2025-07-01
draft: false
---

歡迎來到 Hugo-DaisyUI5 示範網站！這個專案展示了如何將 Hugo、TailwindCSS v4、DaisyUI v5 和 Alpine.js 整合在一起，創建一個現代化、高效能且易於維護的靜態網站。
EOF

# 建立關於頁面 (使用 Build-6 中的 URL 模式配置)
cat > content/pages/about.md << 'EOF'
---
title: "關於專案"
description: "關於 Hugo-DaisyUI5 專案的詳細資訊"
date: 2025-07-01
draft: false
layout: "single"
menu:
  main:
    weight: 20
---

## 關於 Hugo-DaisyUI5

Hugo-DaisyUI5 是一個示範專案，旨在展示如何整合下列技術：

- **Hugo v0.147.9**: 強大的靜態網站生成器
- **TailwindCSS v4.1.11**: 現代實用優先的 CSS 框架
- **DaisyUI v5.0.43**: 基於 TailwindCSS 的組件庫
- **Alpine.js v3.14.9**: 輕量級 JavaScript 框架

### 主要特色

1. **高效能**: 經過優化的構建流程，確保快速載入
2. **響應式設計**: 在所有裝置上展示良好
3. **多主題支持**: 內建多種主題切換功能
4. **可擴展性**: 模組化架構易於擴展
5. **無障礙設計**: 符合 WCAG 標準
6. **SEO 優化**: 內建 SEO 最佳實踐

### 技術細節

本專案遵循 Hugo 模塊系統和資源處理管道的最佳實踐，確保代碼的可重用性和可維護性。

```go
// Hugo 資源處理示例
{{ $styles := resources.Get "css/main.css" | resources.PostCSS | minify | fingerprint }}
<link rel="stylesheet" href="{{ $styles.RelPermalink }}" integrity="{{ $styles.Data.Integrity }}">
```

### 聯繫我們

如有任何問題，請通過 [GitHub](https://github.com/yourusername/hugo-daisyui5) 聯繫我們。
EOF

# 建立範例文章 (使用 Build-6 中的 posts 目錄)
cat > content/posts/getting-started.md << 'EOF'
---
title: "開始使用 Hugo-DaisyUI5"
description: "如何開始使用和自訂 Hugo-DaisyUI5 專案"
date: 2025-07-02
draft: false
tags: ["hugo", "tailwind", "daisyui", "alpine"]
categories: ["教學"]
featured: true
toc: true
---

## 介紹

本文將指導您如何開始使用 Hugo-DaisyUI5 專案，包括安裝、配置和自訂。

## 安裝

首先，克隆專案儲存庫：

```bash
git clone https://github.com/yourusername/hugo-daisyui5.git
cd hugo-daisyui5
```

安裝依賴：

```bash
npm install
```

## 運行本地開發伺服器

啟動開發伺服器：

```bash
hugo server -D
```

## 自訂主題

### 修改顏色方案

打開 `tailwind.config.js` 檔案，修改 DaisyUI 主題配置：

```javascript
daisyui: {
  themes: [
    {
      light: {
        primary: "#3b82f6",  // 修改主色調
        // 其他顏色...
      }
    }
  ]
}
```

### 添加新組件

在 `themes/twda_v5/layouts/partials/components/` 目錄中創建新組件。

## 部署

構建生產版本：

```bash
hugo --minify
```

生成的 `public` 目錄可以部署到任何靜態網站託管服務，如 Netlify、Vercel 或 GitHub Pages。

## 下一步

- 查看 [完整文檔](/documentation/)
- 探索 [組件範例](/components/)
- 了解 [進階自訂](/advanced/)
EOF

# 建立另一篇範例文章 (使用 Build-6 中的 posts 目錄)
cat > content/posts/component-showcase.md << 'EOF'
---
title: "DaisyUI v5 元件展示"
description: "展示 DaisyUI v5 提供的各種元件及其用法"
date: 2025-07-03
draft: false
tags: ["daisyui", "components", "ui"]
categories: ["指南"]
featured: true
toc: true
---

## DaisyUI v5 元件庫

DaisyUI 是一個基於 TailwindCSS 的組件庫，提供了各種預先設計的組件，幫助您快速構建美觀的使用者介面。

## 按鈕

DaisyUI 提供了各種按鈕樣式：

{{< showcase-buttons >}}

## 卡片

不同樣式的卡片組件：

{{< showcase-cards >}}

## 表單

各種表單元素：

{{< showcase-forms >}}

## 導航

導航組件示例：

{{< showcase-navigation >}}

## 模態窗口

互動式模態窗口：

{{< showcase-modals >}}

## 主題定制

DaisyUI v5 允許您輕鬆定制和切換主題：

{{< showcase-themes >}}

## 使用 Alpine.js 增強互動性

結合 Alpine.js 可以為組件添加豐富的互動性：

```html
<div x-data="{ open: false }">
  <button @click="open = !open" class="btn btn-primary">
    切換顯示
  </button>
  
  <div x-show="open" class="mt-4 p-4 bg-base-200 rounded-box">
    這是一個可切換顯示的內容區塊
  </div>
</div>
```

## 總結

DaisyUI v5 與 TailwindCSS v4 和 Alpine.js 的組合提供了強大而靈活的 UI 開發能力，讓您能夠快速構建現代化的網站界面。
EOF

# 建立範例項目頁面 (使用 Build-6 中的 projects 目錄)
cat > content/projects/sample-project.md << 'EOF'
---
title: "樣本專案展示"
description: "展示 Hugo-DaisyUI5 專案的完整功能"
date: 2025-07-04
draft: false
featuredImage: "images/sample-project.jpg"
technologies: ["Hugo", "TailwindCSS", "DaisyUI", "Alpine.js"]
liveURL: "https://example.com"
repoURL: "https://github.com/example/repo"
layout: "project"
---

## 專案概述

這是一個使用 Hugo-DaisyUI5 框架構建的樣本專案，展示了各種功能和組件。

## 主要功能

- 響應式設計
- 深色/淺色模式切換
- 互動式組件
- SEO 優化
- 高性能加載

## 技術細節

本專案利用了 Hugo 的資源處理管道和 TailwindCSS 的 JIT 編譯器，結合 DaisyUI 組件和 Alpine.js 互動功能，創建了一個現代化的網站體驗。

## 展示圖片

{{< adaptive-image src="images/showcase/desktop-view.jpg" alt="桌面視圖" caption="網站桌面版布局" >}}

{{< adaptive-image src="images/showcase/mobile-view.jpg" alt="移動端視圖" caption="網站移動端布局" >}}

## 用戶反饋

> "界面現代，加載速度快，用戶體驗極佳！"
> — 測試用戶 A

> "深色模式實現得非常出色，保護了我的眼睛。"
> — 測試用戶 B

## 性能指標

- 頁面載入時間：< 1 秒
- 首次內容繪製：< 0.5 秒
- 互動準備時間：< 1.2 秒
- Lighthouse 分數：95+
EOF
```

### 2. 建立展示用 Shortcodes

#### 2.1 按鈕展示 Shortcode

**檔案內容 (`themes/twda_v5/layouts/shortcodes/showcase-buttons.html`):**

```html
<div class="not-prose grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 my-8">
  <!-- 基本按鈕 -->
  <div class="card bg-base-200 p-4">
    <h3 class="text-lg font-semibold mb-4">基本按鈕</h3>
    <div class="flex flex-wrap gap-2">
      <button class="btn">默認按鈕</button>
      <button class="btn btn-primary">主要按鈕</button>
      <button class="btn btn-secondary">次要按鈕</button>
    </div>
  </div>
  
  <!-- 按鈕尺寸 -->
  <div class="card bg-base-200 p-4">
    <h3 class="text-lg font-semibold mb-4">按鈕尺寸</h3>
    <div class="flex flex-wrap items-center gap-2">
      <button class="btn btn-xs">極小</button>
      <button class="btn btn-sm">小型</button>
      <button class="btn">普通</button>
      <button class="btn btn-lg">大型</button>
    </div>
  </div>
  
  <!-- 輪廓按鈕 -->
  <div class="card bg-base-200 p-4">
    <h3 class="text-lg font-semibold mb-4">輪廓按鈕</h3>
    <div class="flex flex-wrap gap-2">
      <button class="btn btn-outline">輪廓</button>
      <button class="btn btn-outline btn-primary">主要</button>
      <button class="btn btn-outline btn-secondary">次要</button>
    </div>
  </div>
  
  <!-- 按鈕狀態 -->
  <div class="card bg-base-200 p-4">
    <h3 class="text-lg font-semibold mb-4">按鈕狀態</h3>
    <div class="flex flex-wrap gap-2">
      <button class="btn btn-primary btn-active">活動</button>
      <button class="btn btn-primary btn-disabled">禁用</button>
      <button class="btn btn-primary loading">載入中</button>
    </div>
  </div>
  
  <!-- 圖標按鈕 -->
  <div class="card bg-base-200 p-4">
    <h3 class="text-lg font-semibold mb-4">圖標按鈕</h3>
    <div class="flex flex-wrap gap-2">
      <button class="btn btn-circle">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
      </button>
      <button class="btn btn-primary">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
        喜歡
      </button>
    </div>
  </div>
  
  <!-- 自定義按鈕 -->
  <div class="card bg-base-200 p-4">
    <h3 class="text-lg font-semibold mb-4">自定義按鈕</h3>
    <div class="flex flex-wrap gap-2">
      <button class="btn btn-fancy">漸變按鈕</button>
      <button class="btn btn-pulse">脈衝按鈕</button>
      <button class="btn btn-gradient">漸變按鈕</button>
    </div>
  </div>
</div>
```

#### 2.2 卡片展示 Shortcode

**檔案內容 (`themes/twda_v5/layouts/shortcodes/showcase-cards.html`):**

```html
<div class="not-prose grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 my-8">
  <!-- 基本卡片 -->
  <div class="card bg-base-100 shadow-xl">
    <div class="card-body">
      <h2 class="card-title">基本卡片</h2>
      <p>這是一個基本卡片示例，展示了 DaisyUI 卡片組件的基本結構。</p>
      <div class="card-actions justify-end">
        <button class="btn btn-primary">查看</button>
      </div>
    </div>
  </div>
  
  <!-- 圖片卡片 -->
  <div class="card bg-base-100 shadow-xl">
    <figure><img src="https://picsum.photos/id/1/400/250" alt="示例圖片" /></figure>
    <div class="card-body">
      <h2 class="card-title">圖片卡片</h2>
      <p>這個卡片包含了一張頂部圖片，適合用於文章、產品展示等。</p>
      <div class="card-actions justify-end">
        <button class="btn btn-primary">查看</button>
      </div>
    </div>
  </div>
  
  <!-- 徽章卡片 -->
  <div class="card bg-base-100 shadow-xl">
    <div class="card-body">
      <h2 class="card-title">
        帶徽章的卡片
        <div class="badge badge-secondary">NEW</div>
      </h2>
      <p>這個卡片標題中包含了一個徽章，用於突出顯示特殊狀態。</p>
      <div class="card-actions justify-end">
        <div class="badge badge-outline">設計</div>
        <div class="badge badge-outline">產品</div>
      </div>
    </div>
  </div>
  
  <!-- 特色卡片 -->
  <div class="card-feature">
    <div class="card-body">
      <h2 class="card-title">特色卡片</h2>
      <p>這是使用我們自定義 CSS 類的特色卡片，具有特殊的懸停效果和邊框。</p>
      <div class="card-actions justify-end">
        <button class="btn btn-accent">探索</button>
      </div>
    </div>
  </div>
  
  <!-- 文章卡片 -->
  <div class="card-post">
    <div class="card-image">
      <img src="https://picsum.photos/id/20/400/250" alt="文章圖片" />
    </div>
    <div class="card-body">
      <h2 class="card-title">文章卡片</h2>
      <p>專為博客文章設計的卡片樣式，圖片有懸停放大效果。</p>
      <div class="flex justify-between items-center mt-4">
        <div class="text-sm opacity-70">2025年7月1日</div>
        <button class="btn btn-sm btn-primary">閱讀更多</button>
      </div>
    </div>
  </div>
  
  <!-- 定價卡片 -->
  <div class="card-pricing featured">
    <div class="card-body text-center">
      <h2 class="card-title justify-center">專業版</h2>
      <div class="price">$19<span class="price-period">/月</span></div>
      <ul class="space-y-2 my-4 text-left">
        <li class="flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg>
          所有基本功能
        </li>
        <li class="flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg>
          高級分析
        </li>
        <li class="flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg>
          優先支持
        </li>
      </ul>
      <div class="card-actions">
        <button class="btn btn-primary w-full">立即購買</button>
      </div>
    </div>
  </div>
</div>
```

#### 2.3 表單展示 Shortcode

**檔案內容 (`themes/twda_v5/layouts/shortcodes/showcase-forms.html`):**

```html
<div class="not-prose my-8">
  <!-- 基本表單 -->
  <div class="card bg-base-200 p-6 mb-8">
    <h3 class="text-xl font-semibold mb-4">基本表單</h3>
    <form class="space-y-4">
      <div class="form-control">
        <label class="label">
          <span class="label-text">Email</span>
        </label>
        <input type="email" placeholder="email@example.com" class="input input-bordered" />
      </div>
      <div class="form-control">
        <label class="label">
          <span class="label-text">密碼</span>
        </label>
        <input type="password" placeholder="密碼" class="input input-bordered" />
        <label class="label">
          <a href="#" class="label-text-alt link link-hover">忘記密碼?</a>
        </label>
      </div>
      <div class="form-control">
        <button class="btn btn-primary">登入</button>
      </div>
    </form>
  </div>
  
  <!-- 自定義表單樣式 -->
  <div class="card bg-base-200 p-6 mb-8">
    <h3 class="text-xl font-semibold mb-4">自定義表單元素</h3>
    <form class="space-y-4">
      <!-- 浮動標籤輸入框 -->
      <div class="form-floating">
        <input type="text" placeholder=" " class="input input-bordered" id="floating-name" />
        <label for="floating-name">姓名</label>
      </div>
      
      <!-- 表單組 -->
      <div class="form-group">
        <label class="form-label" for="email">Email</label>
        <input type="email" id="email" class="input input-bordered w-full" />
        <div class="form-hint">我們不會與任何人分享您的郵箱。</div>
      </div>
      
      <!-- 帶錯誤的表單組 -->
      <div class="form-group">
        <label class="form-label" for="password">密碼</label>
        <input type="password" id="password" class="input input-bordered input-error w-full" />
        <div class="form-error">密碼必須至少包含8個字符。</div>
      </div>
      
      <!-- 複選框 -->
      <div class="form-control">
        <label class="cursor-pointer label justify-start gap-2">
          <input type="checkbox" class="checkbox checkbox-primary" />
          <span class="label-text">記住我</span>
        </label>
      </div>
      
      <!-- 提交按鈕 -->
      <div class="form-control">
        <button class="btn btn-fancy">註冊</button>
      </div>
    </form>
  </div>
  
  <!-- 表單佈局 -->
  <div class="card bg-base-200 p-6">
    <h3 class="text-xl font-semibold mb-4">響應式表單佈局</h3>
    <form>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div class="form-control">
          <label class="label">
            <span class="label-text">名字</span>
          </label>
          <input type="text" class="input input-bordered" />
        </div>
        
        <div class="form-control">
          <label class="label">
            <span class="label-text">姓氏</span>
          </label>
          <input type="text" class="input input-bordered" />
        </div>
      </div>
      
      <div class="form-control mb-4">
        <label class="label">
          <span class="label-text">地址</span>
        </label>
        <textarea class="textarea textarea-bordered" rows="3"></textarea>
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div class="form-control">
          <label class="label">
            <span class="label-text">城市</span>
          </label>
          <input type="text" class="input input-bordered" />
        </div>
        
        <div class="form-control">
          <label class="label">
            <span class="label-text">省份</span>
          </label>
          <select class="select select-bordered">
            <option>選擇省份</option>
            <option>台北市</option>
            <option>新北市</option>
            <option>台中市</option>
            <option>高雄市</option>
          </select>
        </div>
        
        <div class="form-control">
          <label class="label">
            <span class="label-text">郵編</span>
          </label>
          <input type="text" class="input input-bordered" />
        </div>
      </div>
      
      <div class="form-control">
        <button class="btn btn-primary">提交</button>
      </div>
    </form>
  </div>
</div>
```

### 3. 實作主題展示頁面

**建立主題展示頁面 (`content/zh-tw/pages/themes.md`):**

```markdown
---
title: "主題展示"
description: "展示 DaisyUI v5 提供的多種主題選項"
date: 2025-07-01
draft: false
layout: "themes"
menu:
  main:
    weight: 30
---

這個頁面展示了 DaisyUI v5 提供的各種主題選項，以及我們為 Hugo-DaisyUI5 專案添加的自定義主題。您可以點擊下方的主題卡片來預覽不同的主題風格。
```

**建立主題展示模板 (`themes/twda_v5/layouts/_default/themes.html`):**

```html
{{ define "main" }}
<div class="container mx-auto px-4 py-8">
  <header class="mb-10 text-center">
    <h1 class="text-4xl font-bold">{{ .Title }}</h1>
    {{ if .Description }}
    <p class="text-xl mt-2 text-base-content/80">{{ .Description }}</p>
    {{ end }}
  </header>
  
  <div class="max-w-3xl mx-auto mb-10">
    {{ .Content }}
  </div>
  
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 my-8"
       x-data="{
         themes: ['light', 'dark', 'forest', 'ocean', 'cherry'],
         currentTheme: localStorage.getItem('theme') || 'light',
         setTheme(theme) {
           this.currentTheme = theme;
           document.documentElement.setAttribute('data-theme', theme);
           localStorage.setItem('theme', theme);
         }
       }">
    
    <!-- 淺色主題 -->
    <div class="card bg-base-100 shadow-xl overflow-hidden cursor-pointer" 
         :class="{ 'ring-2 ring-primary': currentTheme === 'light' }"
         @click="setTheme('light')">
      <div class="h-32 bg-gradient-to-r from-blue-500 to-purple-500"></div>
      <div class="card-body">
        <h2 class="card-title">淺色主題</h2>
        <p>清新明亮的默認主題，適合大多數網站。</p>
        <div class="flex gap-2 mt-4">
          <div class="w-6 h-6 rounded-full bg-primary"></div>
          <div class="w-6 h-6 rounded-full bg-secondary"></div>
          <div class="w-6 h-6 rounded-full bg-accent"></div>
        </div>
      </div>
    </div>
    
    <!-- 暗黑主題 -->
    <div class="card bg-base-100 shadow-xl overflow-hidden cursor-pointer" 
         :class="{ 'ring-2 ring-primary': currentTheme === 'dark' }"
         @click="setTheme('dark')">
      <div class="h-32 bg-gradient-to-r from-gray-800 to-gray-900"></div>
      <div class="card-body">
        <h2 class="card-title">暗黑主題</h2>
        <p>深色模式主題，減少眼睛疲勞，適合夜間閱讀。</p>
        <div class="flex gap-2 mt-4">
          <div class="w-6 h-6 rounded-full bg-primary"></div>
          <div class="w-6 h-6 rounded-full bg-secondary"></div>
          <div class="w-6 h-6 rounded-full bg-accent"></div>
        </div>
      </div>
    </div>
    
    <!-- 森林主題 -->
    <div class="card bg-base-100 shadow-xl overflow-hidden cursor-pointer" 
         :class="{ 'ring-2 ring-primary': currentTheme === 'forest' }"
         @click="setTheme('forest')">
      <div class="h-32 bg-gradient-to-r from-green-600 to-green-800"></div>
      <div class="card-body">
        <h2 class="card-title">森林主題</h2>
        <p>以綠色為基調的自然風格主題，給人平靜舒適的感覺。</p>
        <div class="flex gap-2 mt-4">
          <div class="w-6 h-6 rounded-full bg-primary"></div>
          <div class="w-6 h-6 rounded-full bg-secondary"></div>
          <div class="w-6 h-6 rounded-full bg-accent"></div>
        </div>
      </div>
    </div>
    
    <!-- 海洋主題 -->
    <div class="card bg-base-100 shadow-xl overflow-hidden cursor-pointer" 
         :class="{ 'ring-2 ring-primary': currentTheme === 'ocean' }"
         @click="setTheme('ocean')">
      <div class="h-32 bg-gradient-to-r from-blue-600 to-cyan-500"></div>
      <div class="card-body">
        <h2 class="card-title">海洋主題</h2>
        <p>以藍色為主的清新主題，給人寧靜深邃的感覺。</p>
        <div class="flex gap-2 mt-4">
          <div class="w-6 h-6 rounded-full bg-primary"></div>
          <div class="w-6 h-6 rounded-full bg-secondary"></div>
          <div class="w-6 h-6 rounded-full bg-accent"></div>
        </div>
      </div>
    </div>
    
    <!-- 櫻桃主題 -->
    <div class="card bg-base-100 shadow-xl overflow-hidden cursor-pointer" 
         :class="{ 'ring-2 ring-primary': currentTheme === 'cherry' }"
         @click="setTheme('cherry')">
      <div class="h-32 bg-gradient-to-r from-red-500 to-pink-500"></div>
      <div class="card-body">
        <h2 class="card-title">櫻桃主題</h2>
        <p>以紅色為主的活潑主題，給人熱情奔放的感覺。</p>
        <div class="flex gap-2 mt-4">
          <div class="w-6 h-6 rounded-full bg-primary"></div>
          <div class="w-6 h-6 rounded-full bg-secondary"></div>
          <div class="w-6 h-6 rounded-full bg-accent"></div>
        </div>
      </div>
    </div>
  </div>
  
  <!-- 主題預覽 -->
  <div class="mt-16">
    <h2 class="text-2xl font-bold mb-6 text-center">主題效果預覽</h2>
    
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      <!-- 按鈕預覽 -->
      <div class="card bg-base-200 p-6">
        <h3 class="font-semibold mb-4">按鈕</h3>
        <div class="flex flex-wrap gap-2">
          <button class="btn">默認按鈕</button>
          <button class="btn btn-primary">主要按鈕</button>
          <button class="btn btn-secondary">次要按鈕</button>
          <button class="btn btn-accent">強調按鈕</button>
          <button class="btn btn-outline">輪廓按鈕</button>
        </div>
      </div>
      
      <!-- 警告框預覽 -->
      <div class="card bg-base-200 p-6">
        <h3 class="font-semibold mb-4">警告框</h3>
        <div class="space-y-2">
          <div class="alert alert-info">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="stroke-current shrink-0 w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            <span>信息提示</span>
          </div>
          <div class="alert alert-success">
            <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            <span>成功提示</span>
          </div>
        </div>
      </div>
    </div>
    
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- 表單預覽 -->
      <div class="card bg-base-200 p-6">
        <h3 class="font-semibold mb-4">表單元素</h3>
        <div class="space-y-4">
          <input type="text" placeholder="輸入框" class="input input-bordered w-full" />
          <select class="select select-bordered w-full">
            <option disabled selected>選擇選項</option>
            <option>選項 1</option>
            <option>選項 2</option>
          </select>
          <div class="flex items-center gap-2">
            <input type="checkbox" class="checkbox checkbox-primary" />
            <span>複選框</span>
          </div>
          <div class="flex items-center gap-2">
            <input type="radio" name="radio" class="radio radio-primary" />
            <span>單選框</span>
          </div>
        </div>
      </div>
      
      <!-- 標籤頁預覽 -->
      <div class="card bg-base-200 p-6">
        <h3 class="font-semibold mb-4">標籤頁</h3>
        <div class="tabs">
          <a class="tab tab-lifted tab-active">標籤 1</a> 
          <a class="tab tab-lifted">標籤 2</a> 
          <a class="tab tab-lifted">標籤 3</a>
        </div>
        <div class="p-4 bg-base-100">
          <p>標籤頁內容區域</p>
        </div>
      </div>
    </div>
  </div>
</div>
{{ end }}
```

### 4. 建立組件展示頁面

**建立組件展示頁面 (`content/zh-tw/pages/components.md`):**

```markdown
---
title: "組件展示"
description: "Hugo-DaisyUI5 的組件庫展示頁面"
date: 2025-07-01
draft: false
layout: "components"
menu:
  main:
    weight: 40
---

這個頁面展示了 Hugo-DaisyUI5 專案中可用的各種組件，包括 DaisyUI v5 原生組件和我們的自定義組件。
```

**建立組件展示模板 (`themes/twda_v5/layouts/_default/components.html`):**

```html
{{ define "main" }}
<div class="container mx-auto px-4 py-8">
  <header class="mb-10">
    <h1 class="text-4xl font-bold">{{ .Title }}</h1>
    {{ if .Description }}
    <p class="text-xl mt-2 text-base-content/80">{{ .Description }}</p>
    {{ end }}
  </header>
  
  <!-- 組件導航 -->
  <div class="mb-8" x-data="{ activeTab: 'buttons' }">
    <div class="tabs tabs-boxed justify-center">
      <a class="tab" :class="{ 'tab-active': activeTab === 'buttons' }" @click="activeTab = 'buttons'">按鈕</a>
      <a class="tab" :class="{ 'tab-active': activeTab === 'cards' }" @click="activeTab = 'cards'">卡片</a>
      <a class="tab" :class="{ 'tab-active': activeTab === 'forms' }" @click="activeTab = 'forms'">表單</a>
      <a class="tab" :class="{ 'tab-active': activeTab === 'modals' }" @click="activeTab = 'modals'">模態窗口</a>
      <a class="tab" :class="{ 'tab-active': activeTab === 'alerts' }" @click="activeTab = 'alerts'">警告框</a>
      <a class="tab" :class="{ 'tab-active': activeTab === 'navigation' }" @click="activeTab = 'navigation'">導航</a>
    </div>
    
    <!-- 按鈕組件 -->
    <div x-show="activeTab === 'buttons'" class="mt-8">
      <h2 class="text-2xl font-bold mb-6">按鈕組件</h2>
      {{ partial "showcase/buttons.html" . }}
    </div>
    
    <!-- 卡片組件 -->
    <div x-show="activeTab === 'cards'" class="mt-8" style="display: none;">
      <h2 class="text-2xl font-bold mb-6">卡片組件</h2>
      {{ partial "showcase/cards.html" . }}
    </div>
    
    <!-- 表單組件 -->
    <div x-show="activeTab === 'forms'" class="mt-8" style="display: none;">
      <h2 class="text-2xl font-bold mb-6">表單組件</h2>
      {{ partial "showcase/forms.html" . }}
    </div>
    
    <!-- 模態窗口組件 -->
    <div x-show="activeTab === 'modals'" class="mt-8" style="display: none;">
      <h2 class="text-2xl font-bold mb-6">模態窗口組件</h2>
      {{ partial "showcase/modals.html" . }}
    </div>
    
    <!-- 警告框組件 -->
    <div x-show="activeTab === 'alerts'" class="mt-8" style="display: none;">
      <h2 class="text-2xl font-bold mb-6">警告框組件</h2>
      {{ partial "showcase/alerts.html" . }}
    </div>
    
    <!-- 導航組件 -->
    <div x-show="activeTab === 'navigation'" class="mt-8" style="display: none;">
      <h2 class="text-2xl font-bold mb-6">導航組件</h2>
      {{ partial "showcase/navigation.html" . }}
    </div>
  </div>
  
  <!-- 組件用法說明 -->
  <div class="mt-16 prose max-w-3xl mx-auto">
    {{ .Content }}
    
    <h2>如何使用這些組件</h2>
    
    <p>Hugo-DaisyUI5 組件的使用方式有兩種：</p>
    
    <h3>1. 直接使用 HTML</h3>
    
    <p>您可以直接在 Markdown 內容中使用 HTML 語法：</p>
    
<pre><code>&lt;button class="btn btn-primary"&gt;點擊我&lt;/button&gt;

&lt;div class="alert alert-info"&gt;
  &lt;svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="stroke-current shrink-0 w-6 h-6"&gt;&lt;path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"&gt;&lt;/path&gt;&lt;/svg&gt;
  &lt;span&gt;有用的信息提示！&lt;/span&gt;
&lt;/div&gt;</code></pre>
    
    <h3>2. 使用 Shortcodes</h3>
    
    <p>對於更複雜的組件，我們提供了方便的 Shortcodes：</p>
    
<pre><code>{{&lt; alert type="info" title="提示" &gt;}}
這是一條重要信息。
{{&lt; /alert &gt;}}

{{&lt; button link="/contact" primary=true &gt;}}聯繫我們{{&lt; /button &gt;}}

{{&lt; card title="卡片標題" image="path/to/image.jpg" &gt;}}
卡片內容放在這裡。
{{&lt; /card &gt;}}</code></pre>
    
    <h3>擴展和自定義</h3>
    
    <p>您可以通過修改 <code>themes/twda_v5/assets/css/components/</code> 目錄下的文件來自定義這些組件，或者創建新的組件。</p>
  </div>
</div>
{{ end }}
```

### 5. 建立示例布局展示

**檔案內容 (`themes/twda_v5/layouts/partials/showcase/layouts.html`):**

```html
<div class="space-y-16 my-8">
  <!-- 英雄區布局 -->
  <section class="card bg-base-200 overflow-hidden">
    <h3 class="text-xl font-semibold p-4 border-b border-base-300">英雄區布局</h3>
    <div class="hero min-h-[400px] bg-base-300">
      <div class="hero-content text-center">
        <div class="max-w-md">
          <h1 class="text-5xl font-bold">Hello there</h1>
          <p class="py-6">Provident cupiditate voluptatem et in. Quaerat fugiat ut assumenda excepturi exercitationem quasi. In deleniti eaque aut repudiandae et a id nisi.</p>
          <button class="btn btn-primary">Get Started</button>
        </div>
      </div>
    </div>
    <div class="bg-base-100 p-4">
      <pre class="language-html"><code>&lt;div class="hero min-h-[400px]"&gt;
  &lt;div class="hero-content text-center"&gt;
    &lt;div class="max-w-md"&gt;
      &lt;h1 class="text-5xl font-bold"&gt;Hello there&lt;/h1&gt;
      &lt;p class="py-6"&gt;內容...&lt;/p&gt;
      &lt;button class="btn btn-primary"&gt;Get Started&lt;/button&gt;
    &lt;/div&gt;
  &lt;/div&gt;
&lt;/div&gt;</code></pre>
    </div>
  </section>
  
  <!-- 特色區域布局 -->
  <section class="card bg-base-200 overflow-hidden">
    <h3 class="text-xl font-semibold p-4 border-b border-base-300">特色區域布局</h3>
    <div class="p-8 bg-base-300">
      <h2 class="text-3xl font-bold text-center mb-8">我們的特色</h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="card bg-base-100 shadow-xl">
          <div class="card-body items-center text-center">
            <div class="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-primary-content mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 class="card-title">快速</h3>
            <p>極致的性能優化，確保您的網站以閃電般的速度加載。</p>
          </div>
        </div>
        <div class="card bg-base-100 shadow-xl">
          <div class="card-body items-center text-center">
            <div class="w-16 h-16 bg-secondary rounded-full flex items-center justify-center text-secondary-content mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
              </svg>
            </div>
            <h3 class="card-title">美觀</h3>
            <p>現代化設計，讓您的網站既實用又賞心悅目。</p>
          </div>
        </div>
        <div class="card bg-base-100 shadow-xl">
          <div class="card-body items-center text-center">
            <div class="w-16 h-16 bg-accent rounded-full flex items-center justify-center text-accent-content mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
            </div>
            <h3 class="card-title">靈活</h3>
            <p>高度可定制，輕鬆適應各種項目需求。</p>
          </div>
        </div>
      </div>
    </div>
  </section>
  
  <!-- 博客布局 -->
  <section class="card bg-base-200 overflow-hidden">
    <h3 class="text-xl font-semibold p-4 border-b border-base-300">博客布局</h3>
    <div class="p-8 bg-base-300">
      <div class="container mx-auto">
        <h2 class="text-3xl font-bold mb-8">最新文章</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div class="card-post">
            <div class="card-image">
              <img src="https://picsum.photos/id/1/400/250" alt="文章圖片" />
            </div>
            <div class="card-body">
              <h3 class="card-title">使用 Hugo 建立靜態網站</h3>
              <p>Hugo 是世界上最快的靜態網站生成器，本文將指導您如何使用它...</p>
              <div class="flex justify-between items-center mt-4">
                <div class="text-sm opacity-70">2025年7月1日</div>
                <button class="btn btn-sm btn-primary">閱讀更多</button>
              </div>
            </div>
          </div>
          <div class="card-post">
            <div class="card-image">
              <img src="https://picsum.photos/id/2/400/250" alt="文章圖片" />
            </div>
            <div class="card-body">
              <h3 class="card-title">TailwindCSS v4 新特性</h3>
              <p>TailwindCSS v4 帶來了許多令人興奮的新功能，包括更好的性能...</p>
              <div class="flex justify-between items-center mt-4">
                <div class="text-sm opacity-70">2025年6月15日</div>
                <button class="btn btn-sm btn-primary">閱讀更多</button>
              </div>
            </div>
          </div>
          <div class="card-post">
            <div class="card-image">
              <img src="https://picsum.photos/id/3/400/250" alt="文章圖片" />
            </div>
            <div class="card-body">
              <h3 class="card-title">Alpine.js 互動式開發</h3>
              <p>使用 Alpine.js 為您的網站添加豐富的交互功能，無需複雜的框架...</p>
              <div class="flex justify-between items-center mt-4">
                <div class="text-sm opacity-70">2025年6月2日</div>
                <button class="btn btn-sm btn-primary">閱讀更多</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</div>
```

## 驗證與檢查

完成專案展示與範例後，請確認以下事項：

- [ ] 範例頁面可以正確呈現
- [ ] 展示頁面的各種元件正常運作
- [ ] 響應式設計在不同尺寸的裝置上表現良好
- [ ] Alpine.js 互動功能正常運作
- [ ] 主題切換功能可以正常使用
- [ ] 各種布局範例展示正確
- [ ] 內容目錄結構與 Build-6 中的配置一致
- [ ] 選單項目正確顯示在導航中
- [ ] 永久連結格式正確（遵循 permalinks.toml 設置）
- [ ] 多語言支援功能正常（如果已啟用）

## AI Prompt 協助

> 我已經完成了 Hugo-DaisyUI5 專案的展示頁面，但有些元件的互動功能不正常工作。特別是主題切換和標籤頁切換功能似乎有問題。請幫我檢查 Alpine.js 的初始化和數據綁定是否正確，以及是否有任何 JavaScript 錯誤。

## 使用 Hugo 配置系統（與階段 6 一致）

為確保專案展示與範例能夠正確運行，請確保已完成 [階段 6：Hugo 配置系統](./Build-6-Hugo-Configuration.md) 中的配置設置。特別是：

1. **配置檔案結構**：確保 `config/_default/` 目錄中有正確的配置文件
2. **選單配置**：確認 `menus.toml` 中已設置正確的選單項目
3. **永久連結配置**：確保使用新的 `:contentbasename` 語法而非舊的 `:filename` 語法
4. **內容結構**：根據選用的語言配置，確保內容目錄結構正確

**檢查配置與範例一致性：**

```bash
# 驗證配置是否正確
hugo config

# 啟動本地服務器查看範例
hugo server -D
```

## 下一階段

✅ [階段 11：建構優化與 SEO](./Build-11-SEO-Optimization.md) - 實施進階的建構優化和 SEO 最佳實踐，確保網站高效且對搜尋引擎友好。

---

📚 **相關資源:**
- [DaisyUI v5 組件文檔](https://daisyui.com/components/)
- [Alpine.js 指南](https://alpinejs.dev/start-here)
- [Hugo 範本指南](https://gohugo.io/templates/introduction/)
- [TailwindCSS v4 文檔](https://tailwindcss.com/docs)
- [Hugo 配置文件](https://gohugo.io/getting-started/configuration/)
- [Hugo 多語言支援](https://gohugo.io/content-management/multilingual/)
