# Hugo 專案建構階段 7：Alpine.js 整合

> **專案狀態**: ✅ 進行中  
> **技術棧**: Hugo v0.147.9 + TailwindCSS v4.1.11 + DaisyUI v5.0.43 + Alpine.js v3.14.9

本階段專注於將 Alpine.js 整合到 Hugo 專案中，為網站添加互動功能，實現無需額外 JavaScript 框架的動態行為。

## 階段目標

- 整合 Alpine.js 到 Hugo 專案
- 建立組件化的 JavaScript 結構
- 實作常用互動功能
- 建立模組化的 Alpine.js 元件

## 前置條件

✅ 已完成 [階段 6：Hugo 配置系統](./Build-6-Hugo-Configuration.md)  
✅ Hugo 配置檔案已正確設置

## 步驟詳解

### 1. 整合 Alpine.js

我們可以選擇兩種方式整合 Alpine.js：通過 CDN 或使用 NPM。在本專案中，我們將兩種方式都實作，讓您可以選擇最適合您的方案。

#### 1.1 CDN 方式 (簡單、快速)

**修改檔案 (`themes/twda_v5/layouts/partials/head.html`):**

```html
<!-- Alpine.js CDN 集成 (v3.14.9) -->
<script defer src="https://cdn.jsdelivr.net/npm/alpinejs@3.14.9/dist/cdn.min.js"></script>

<!-- Alpine.js 插件 (可選) -->
<script defer src="https://cdn.jsdelivr.net/npm/@alpinejs/intersect@3.14.9/dist/cdn.min.js"></script>
<script defer src="https://cdn.jsdelivr.net/npm/@alpinejs/persist@3.14.9/dist/cdn.min.js"></script>
```

#### 1.2 NPM 方式 (模組化、更可控)

**CLI 指令:**

```bash
# 確保已安裝 Alpine.js 及其插件
npm install alpinejs@3.14.9 @alpinejs/intersect@3.14.9 @alpinejs/persist@3.14.9
```

**建立 Alpine.js 入口檔案 (`themes/twda_v5/assets/js/app.js`):**

```javascript
// Alpine.js 核心及插件
import Alpine from 'alpinejs'
import intersect from '@alpinejs/intersect'
import persist from '@alpinejs/persist'

// 註冊 Alpine.js 插件
Alpine.plugin(intersect)
Alpine.plugin(persist)

// 自定義 Alpine.js 元件
import './components/dropdown'
import './components/modal'
import './components/tabs'
import './components/darkMode'
import './components/search'

// 啟動 Alpine.js
window.Alpine = Alpine
Alpine.start()
```

### 2. 建立組件化結構

**CLI 指令:**

```bash
# 建立組件目錄結構
mkdir -p themes/twda_v5/assets/js/components
mkdir -p themes/twda_v5/assets/js/utils
```

### 3. 實作常用互動元件

#### 3.1 下拉選單元件

**檔案內容 (`themes/twda_v5/assets/js/components/dropdown.js`):**

```javascript
// Alpine.js 下拉選單元件
export default () => {
  Alpine.data('dropdown', () => ({
    open: false,
    
    toggle() {
      this.open = !this.open
    },
    
    close() {
      this.open = false
    }
  }))
}

// 註冊元件
document.addEventListener('alpine:init', () => {
  Alpine.data('dropdown', () => ({
    open: false,
    
    toggle() {
      this.open = !this.open
    },
    
    close() {
      this.open = false
    }
  }))
})
```

#### 3.2 模態視窗元件

**檔案內容 (`themes/twda_v5/assets/js/components/modal.js`):**

```javascript
// Alpine.js 模態視窗元件
document.addEventListener('alpine:init', () => {
  Alpine.data('modal', () => ({
    visible: false,
    
    show() {
      this.visible = true
      document.body.classList.add('overflow-hidden')
    },
    
    hide() {
      this.visible = false
      document.body.classList.remove('overflow-hidden')
    },
    
    toggle() {
      this.visible ? this.hide() : this.show()
    }
  }))
})
```

#### 3.3 頁籤元件

**檔案內容 (`themes/twda_v5/assets/js/components/tabs.js`):**

```javascript
// Alpine.js 頁籤元件
document.addEventListener('alpine:init', () => {
  Alpine.data('tabs', () => ({
    selectedTab: null,
    tabs: [],
    
    init() {
      this.tabs = Array.from(this.$el.querySelectorAll('[x-tab]')).map(tab => ({
        id: tab.getAttribute('x-tab'),
        el: tab
      }))
      
      // 預設選擇第一個頁籤
      this.selectedTab = this.tabs.length > 0 ? this.tabs[0].id : null
    },
    
    selectTab(id) {
      this.selectedTab = id
    },
    
    isSelected(id) {
      return this.selectedTab === id
    }
  }))
})
```

#### 3.4 深色模式切換元件

**檔案內容 (`themes/twda_v5/assets/js/components/darkMode.js`):**

```javascript
// Alpine.js 深色模式切換元件
document.addEventListener('alpine:init', () => {
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
    }
  }))
})
```

#### 3.5 搜尋元件

**檔案內容 (`themes/twda_v5/assets/js/components/search.js`):**

```javascript
// Alpine.js 搜尋元件 (使用 Fuse.js)
document.addEventListener('alpine:init', () => {
  Alpine.data('search', () => ({
    query: '',
    results: [],
    showResults: false,
    isLoading: false,
    fuseInstance: null,
    
    init() {
      this.$watch('query', (value) => {
        if (value.length > 2) {
          this.performSearch()
        } else {
          this.results = []
        }
      })
      
      // 動態載入 Fuse.js (僅在需要時)
      if (!this.fuseInstance) {
        this.loadSearchIndex()
      }
    },
    
    async loadSearchIndex() {
      try {
        this.isLoading = true
        
        // 載入 Fuse.js 函式庫
        if (typeof Fuse === 'undefined') {
          await import('fuse.js')
        }
        
        // 載入搜尋索引
        const response = await fetch('/index.json')
        const searchData = await response.json()
        
        // 建立 Fuse 實例
        this.fuseInstance = new Fuse(searchData, {
          keys: ['title', 'content', 'description'],
          includeMatches: true,
          threshold: 0.3,
          distance: 100
        })
        
        this.isLoading = false
      } catch (error) {
        console.error('載入搜尋索引失敗:', error)
        this.isLoading = false
      }
    },
    
    performSearch() {
      if (!this.fuseInstance || this.query.length < 3) return
      
      this.isLoading = true
      this.showResults = true
      
      try {
        const searchResults = this.fuseInstance.search(this.query)
        this.results = searchResults.slice(0, 10).map(result => result.item)
      } catch (error) {
        console.error('搜尋過程中發生錯誤:', error)
        this.results = []
      } finally {
        this.isLoading = false
      }
    },
    
    clearSearch() {
      this.query = ''
      this.results = []
      this.showResults = false
    }
  }))
})
```

### 4. 使用 Alpine.js 元件範例

#### 4.1 下拉選單範例

**範例 HTML (`themes/twda_v5/layouts/partials/nav-dropdown.html`):**

```html
<div x-data="dropdown" class="relative">
  <!-- 觸發按鈕 -->
  <button 
    @click="toggle" 
    @click.outside="close"
    class="btn btn-ghost"
    :aria-expanded="open"
  >
    選單
    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-1" :class="{'rotate-180': open}" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
    </svg>
  </button>
  
  <!-- 下拉內容 -->
  <div 
    x-show="open" 
    x-transition:enter="transition ease-out duration-100"
    x-transition:enter-start="opacity-0 scale-95"
    x-transition:enter-end="opacity-100 scale-100"
    x-transition:leave="transition ease-in duration-75"
    x-transition:leave-start="opacity-100 scale-100"
    x-transition:leave-end="opacity-0 scale-95"
    class="absolute right-0 mt-2 w-48 bg-base-100 rounded-box shadow-lg z-50 overflow-hidden"
    style="display: none;"
  >
    <div class="py-1">
      <a href="#" class="block px-4 py-2 hover:bg-base-200">選項 1</a>
      <a href="#" class="block px-4 py-2 hover:bg-base-200">選項 2</a>
      <a href="#" class="block px-4 py-2 hover:bg-base-200">選項 3</a>
    </div>
  </div>
</div>
```

#### 4.2 模態視窗範例

**範例 HTML (`themes/twda_v5/layouts/partials/modal.html`):**

```html
<!-- 觸發按鈕 -->
<button @click="$dispatch('open-modal', {id: 'my-modal'})" class="btn btn-primary">
  開啟模態視窗
</button>

<!-- 模態視窗 -->
<div 
  x-data="modal"
  x-show="visible"
  x-on:open-modal.window="$event.detail.id === 'my-modal' && show()"
  x-on:close-modal.window="$event.detail.id === 'my-modal' && hide()"
  x-on:keydown.escape.window="hide()"
  x-transition:enter="transition ease-out duration-300"
  x-transition:enter-start="opacity-0"
  x-transition:enter-end="opacity-100"
  x-transition:leave="transition ease-in duration-200"
  x-transition:leave-start="opacity-100"
  x-transition:leave-end="opacity-0"
  class="fixed inset-0 z-50 flex items-center justify-center"
  style="display: none;"
>
  <!-- 背景遮罩 -->
  <div class="fixed inset-0 bg-black bg-opacity-50" @click="hide"></div>
  
  <!-- 模態視窗內容 -->
  <div 
    class="bg-base-100 w-full max-w-md mx-auto rounded-box shadow-xl overflow-hidden z-10"
    @click.away="hide"
    x-transition:enter="transition ease-out duration-300"
    x-transition:enter-start="opacity-0 scale-95"
    x-transition:enter-end="opacity-100 scale-100"
    x-transition:leave="transition ease-in duration-200"
    x-transition:leave-start="opacity-100 scale-100"
    x-transition:leave-end="opacity-0 scale-95"
  >
    <!-- 模態視窗標頭 -->
    <div class="px-4 py-3 border-b border-base-300 flex items-center justify-between">
      <h3 class="text-lg font-medium">模態視窗標題</h3>
      <button @click="hide" class="btn btn-sm btn-circle btn-ghost">✕</button>
    </div>
    
    <!-- 模態視窗內文 -->
    <div class="p-4">
      <p>這是模態視窗內文...</p>
    </div>
    
    <!-- 模態視窗底部 -->
    <div class="px-4 py-3 border-t border-base-300 flex justify-end space-x-2">
      <button @click="hide" class="btn btn-ghost">取消</button>
      <button class="btn btn-primary">確認</button>
    </div>
  </div>
</div>
```

### 5. 整合至 Hugo 模板

**修改檔案 (`themes/twda_v5/layouts/_default/baseof.html`):**

```html
<!DOCTYPE html>
<html lang="{{ .Site.LanguageCode }}" data-theme="light" x-data="{}" x-bind:class="{'dark': $store.darkMode?.dark}">
<head>
  {{ partial "head.html" . }}
</head>
<body class="min-h-screen flex flex-col">
  {{ partial "header.html" . }}
  
  <main class="flex-grow">
    {{ block "main" . }}{{ end }}
  </main>
  
  {{ partial "footer.html" . }}
  
  <!-- Alpine.js 腳本由 Hugo Pipes 處理 -->
  {{ $js := resources.Get "js/app.js" | js.Build (dict "minify" true) }}
  <script src="{{ $js.RelPermalink }}"></script>
</body>
</html>
```

## 驗證與檢查

完成 Alpine.js 整合後，請確認以下事項：

- [ ] Alpine.js 已正確引入並初始化
- [ ] 各個互動元件能夠正確工作
- [ ] 深色模式切換功能正常運作
- [ ] 頁面沒有 JavaScript 錯誤
- [ ] 互動性能符合預期

## AI Prompt 協助

> 我已經將 Alpine.js 整合到我的 Hugo 專案中，但遇到一些問題。深色模式切換和搜尋功能似乎沒有正常工作。請幫我檢查 Alpine.js 組件的初始化問題，特別是深色模式和搜尋元件部分，以確保它們正確註冊並能夠使用 persist 和其他 Alpine.js 功能。

## 下一階段

✅ [階段 8：CSS 框架整合](./Build-8-CSS-Framework-Integration.md) - 深入整合 Tailwind CSS 和 DaisyUI 框架，實現更豐富的 UI 元件和視覺效果。

---

📚 **相關資源:**
- [Alpine.js 官方文件](https://alpinejs.dev/start-here)
- [Alpine.js Intersect Plugin](https://alpinejs.dev/plugins/intersect)
- [Alpine.js Persist Plugin](https://alpinejs.dev/plugins/persist)
- [Hugo 資源處理](https://gohugo.io/hugo-pipes/)
