# Hugo 專案建構階段 7：Alpine.js 整合

> **專案狀態**: ✅ 進行中  
> **技術棧**: Hugo v0.147.9 + TailwindCSS v4.1.11 + DaisyUI v5.0.43 + Alpine.js v3.14.9

本階段專注於將 Alpine.js 整合到 Hugo 專案中，為網站添加互動功能，實現無需額外 JavaScript 框架的動態行為。

## 階段目標

- 透過 NPM 方式整合 Alpine.js 到 Hugo 專案
- 建立組件化的 JavaScript 結構
- 實作常用互動功能
- 建立模組化的 Alpine.js 元件
- 確保靜態網站完全離線可用

## 前置條件

✅ 已完成 [階段 6：Hugo 配置系統](./Build-6-Hugo-Configuration.md)  
✅ Hugo 配置檔案已正確設置

## 步驟詳解

### 1. 整合 Alpine.js

本專案採用 NPM 方式整合 Alpine.js，確保編譯後的靜態網站可以完全離線運行，不依賴外部 CDN 服務。這種方式具有以下優勢：

- **完全離線運行**: 所有 JavaScript 資源都打包到靜態檔案中
- **更快的載入速度**: 避免外部資源載入延遲
- **更高的可靠性**: 不受 CDN 服務中斷影響
- **版本控制**: 確保使用固定版本，避免意外更新

#### 1.1 NPM 方式 (本專案採用)

**CLI 指令:**

```bash
# 安裝 Alpine.js、插件以及其他必要依賴
npm install alpinejs@3.14.9 @alpinejs/intersect@3.14.9 @alpinejs/persist@3.14.9 
npm install date-fns@4.1.0 fuse.js@7.1.0 mark.js@8.11.1
```

**更新 Alpine.js 入口檔案 (`themes/twda_v5/assets/js/app.js`):**

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
import './components/fontSize'
import './components/dateFormat'

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
        
        // 定義 Fuse 選項
        const fuseOptions = {
          keys: ['title', 'content', 'description'],
          includeMatches: true,
          threshold: 0.3,
          distance: 100
        }
        
        // 嘗試從 localStorage 獲取搜尋索引
        const cachedIndex = localStorage.getItem('searchIndex')
        
        if (cachedIndex) {
          const { data, timestamp } = JSON.parse(cachedIndex)
          const cacheAge = Date.now() - timestamp
          
          // 如果緩存不超過一天，直接使用緩存數據
          if (cacheAge < 86400000) {
            // 載入 Fuse.js 函式庫
            if (typeof Fuse === 'undefined') {
              await import('fuse.js')
            }
            
            this.fuseInstance = new Fuse(data, fuseOptions)
            this.isLoading = false
            return
          }
        }
        
        // 載入 Fuse.js 函式庫
        if (typeof Fuse === 'undefined') {
          await import('fuse.js')
        }
        
        // 從服務器獲取最新索引
        const response = await fetch('/index.json')
        const searchData = await response.json()
        
        // 建立 Fuse 實例
        this.fuseInstance = new Fuse(searchData, fuseOptions)
        
        // 緩存搜尋索引
        localStorage.setItem('searchIndex', JSON.stringify({
          data: searchData,
          timestamp: Date.now()
        }))
        
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

#### 3.6 字體大小調整元件

**檔案內容 (`themes/twda_v5/assets/js/components/fontSize.js`):**

```javascript
// Alpine.js 字體大小切換元件
document.addEventListener('alpine:init', () => {
  Alpine.data('fontSize', () => ({
    size: Alpine.$persist('text-base').as('fontSize'),
    
    init() {
      // 找到內容元素並應用字體大小
      this.applyFontSize();
    },
    
    setSize(newSize) {
      if (['text-custom-sm', 'text-base', 'text-custom-lg'].includes(newSize)) {
        this.size = newSize;
        this.applyFontSize();
      }
    },
    
    // 特定字體大小快捷方法
    setSmall() {
      this.setSize('text-custom-sm');
    },
    
    setMedium() {
      this.setSize('text-base');
    },
    
    setLarge() {
      this.setSize('text-custom-lg');
    },
    
    applyFontSize() {
      const content = document.getElementById('content');
      if (content) {
        // 移除所有字體大小類別
        content.classList.remove('text-custom-sm', 'text-base', 'text-custom-lg');
        // 添加新的字體大小類別
        content.classList.add(this.size);
      }
    }
  }));
});
```

#### 3.7 日期格式化元件

**檔案內容 (`themes/twda_v5/assets/js/components/dateFormat.js`):**

```javascript
// Alpine.js 日期格式化元件 (使用 date-fns)
document.addEventListener('alpine:init', () => {
  Alpine.data('dateFormat', () => ({
    formattedDate: '',
    relativeDate: '',
    
    // 初始化
    init() {
      // 動態引入 date-fns
      this.importDateFns()
    },
    
    // 動態引入 date-fns 庫
    async importDateFns() {
      try {
        // 檢查是否有 date-post-date 元素
        const postDateElement = this.$el.querySelector('[data-post-date]')
        if (!postDateElement) return
        
        const postDateString = postDateElement.dataset.postDate
        const postDate = new Date(postDateString)
        
        // 動態引入 date-fns
        const { format, formatDistance } = await import('date-fns')
        const { zhTW } = await import('date-fns/locale')
        
        // 格式化日期 (繁體中文)
        this.formattedDate = format(postDate, 'yyyy年MM月dd日', { locale: zhTW })
        
        // 計算相對日期 (例如：3天前)
        this.relativeDate = formatDistance(postDate, new Date(), { 
          locale: zhTW, 
          addSuffix: true 
        })
        
        // 更新顯示
        if (postDateElement) {
          postDateElement.textContent = this.formattedDate
        }
        
        const relativeElement = this.$el.querySelector('[data-relative-date]')
        if (relativeElement) {
          relativeElement.textContent = this.relativeDate
        }
        
      } catch (error) {
        console.error('載入 date-fns 出錯:', error)
      }
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

#### 4.3 字體大小調整範例

**範例 HTML (`themes/twda_v5/layouts/partials/font-size-toggle.html`):**

```html
<div x-data="fontSize" class="font-size-control">
  <div class="inline-flex items-center justify-center rounded-md gap-1" role="group" aria-label="字體大小調整">
    <button 
      @click="setSmall" 
      class="btn btn-sm btn-ghost"
      :class="{'btn-active': size === 'text-custom-sm'}"
      id="btnTextSmall">
      <span class="text-sm">A</span>
    </button>
    <button 
      @click="setMedium" 
      class="btn btn-sm btn-ghost"
      :class="{'btn-active': size === 'text-base'}"
      id="btnTextBase">
      <span class="text-base">A</span>
    </button>
    <button 
      @click="setLarge" 
      class="btn btn-sm btn-ghost"
      :class="{'btn-active': size === 'text-custom-lg'}"
      id="btnTextLarge">
      <span class="text-lg">A</span>
    </button>
  </div>
</div>
```

#### 4.4 日期格式化範例

**範例 HTML (`themes/twda_v5/layouts/partials/date-formatter.html`):**

```html
<div x-data="dateFormat" class="date-format">
  <!-- 日期顯示區域 -->
  <time 
    data-post-date="{{ .Date.Format "2006-01-02T15:04:05Z07:00" }}"
    class="text-sm text-base-content/70">
    <!-- 日期將由 Alpine.js 填充 -->
  </time>
  
  <!-- 相對日期顯示區域 (例如：3天前) -->
  <span 
    data-relative-date 
    class="text-sm text-base-content/70 ml-2">
    <!-- 相對日期將由 Alpine.js 填充 -->
  </span>
</div>
```

可以在文章模板中使用此部分顯示格式化的日期：

```html
{{ partial "date-formatter.html" . }}
```

#### 4.5 頁籤元件範例

**範例 HTML (`themes/twda_v5/layouts/partials/content-tabs.html`):**

```html
<div x-data="tabs" class="tabs-container">
  <!-- 頁籤導航 -->
  <div class="tabs tabs-boxed mb-4">
    <button 
      x-tab="tab1" 
      :class="{ 'tab-active': isSelected('tab1') }" 
      @click="selectTab('tab1')" 
      class="tab">
      功能介紹
    </button>
    <button 
      x-tab="tab2" 
      :class="{ 'tab-active': isSelected('tab2') }" 
      @click="selectTab('tab2')" 
      class="tab">
      技術規格
    </button>
    <button 
      x-tab="tab3" 
      :class="{ 'tab-active': isSelected('tab3') }" 
      @click="selectTab('tab3')" 
      class="tab">
      常見問題
    </button>
  </div>
  
  <!-- 頁籤內容 -->
  <div class="tab-content">
    <div x-show="isSelected('tab1')" class="p-4 bg-base-200 rounded-box">
      <h3 class="text-lg font-bold mb-2">功能介紹</h3>
      <p>這裡是功能介紹的詳細內容...</p>
    </div>
    
    <div x-show="isSelected('tab2')" class="p-4 bg-base-200 rounded-box">
      <h3 class="text-lg font-bold mb-2">技術規格</h3>
      <p>這裡是技術規格的詳細內容...</p>
    </div>
    
    <div x-show="isSelected('tab3')" class="p-4 bg-base-200 rounded-box">
      <h3 class="text-lg font-bold mb-2">常見問題</h3>
      <p>這裡是常見問題的詳細內容...</p>
    </div>
  </div>
</div>
```

可以在任何內容頁面中使用此部分顯示標籤切換內容：

```html
{{ partial "content-tabs.html" . }}
```

### 5. 整合至 Hugo 模板

**修改檔案 (`themes/twda_v5/layouts/_default/baseof.html`):**

```html
<!DOCTYPE html>
<html lang="{{ .Site.LanguageCode }}" data-theme="light" x-data="{}" x-bind:class="{'dark': Alpine.$data.darkMode?.dark}">
<head>
  {{ partial "head.html" . }}
</head>
<body class="min-h-screen flex flex-col">
  {{ partial "header.html" . }}
  
  <main class="flex-grow">
    {{ block "main" . }}{{ end }}
  </main>
  
  {{ partial "footer.html" . }}
  
  <!-- Alpine.js 腳本透過 Hugo Pipes 處理和打包 -->
  {{ $js := resources.Get "js/app.js" | js.Build (dict "minify" true) }}
  <script src="{{ $js.RelPermalink }}"></script>
</body>
</html>
```

### 6. 整合實際功能到模板

#### 6.1 搜尋功能

要在網站中添加搜尋功能，請按照以下步驟操作：

##### 步驟一：確保 JSON 輸出格式

首先確保已在 Hugo 配置中啟用 JSON 輸出格式（用於建立搜尋索引）：

```toml
# config/_default/outputs.toml
home = ["HTML", "RSS", "JSON"]
```

##### 步驟二：創建搜尋索引模板

創建搜尋索引模板 (`layouts/index.json`)：

```go
{{- $.Scratch.Add "index" slice -}}
{{- range where site.RegularPages "Type" "not in" (slice "page" "json") -}}
    {{- $.Scratch.Add "index" (dict 
        "title" .Title
        "permalink" .Permalink
        "summary" .Summary
        "content" .Plain
        "tags" .Params.tags
        "categories" .Params.categories
        "date" (.Date.Format "2006-01-02")
    ) -}}
{{- end -}}
{{- $.Scratch.Get "index" | jsonify -}}
```

##### 步驟三：使用搜尋元件

在頁面中使用搜尋元件 (`themes/twda_v5/layouts/partials/search.html`)：

```html
<!-- 搜尋界面，使用 Alpine.js search 組件 -->
<div x-data="search" class="search-container w-full max-w-xl mx-auto">
  <!-- 搜尋輸入框 -->
  <div class="form-control w-full relative">
    <input 
      type="text" 
      x-model="query" 
      id="search-query"
      placeholder="輸入關鍵字搜尋..." 
      class="input input-bordered w-full pr-10"
      @focus="showResults = true"
    />
    
    <!-- 清除按鈕 -->
    <button 
      x-show="query.length > 0" 
      @click="clearSearch" 
      class="absolute inset-y-0 right-0 pr-3 flex items-center"
      style="display: none;"
    >
      <svg class="h-5 w-5 text-base-content/60" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
      </svg>
    </button>
  </div>
  
  <!-- 載入中指示器 -->
  <div x-show="isLoading" class="search-loading mt-4 text-center" style="display: none;">
    <span class="loading loading-spinner loading-md"></span>
    <span class="ml-2">載入搜尋結果...</span>
  </div>
  
  <!-- 搜尋結果 -->
  <div 
    x-show="showResults && query.length > 2" 
    @click.away="showResults = false"
    class="search-results mt-2 bg-base-100 rounded-box shadow-lg border border-base-300 overflow-hidden"
    style="display: none;"
  >
    <div id="search-results" class="divide-y divide-base-300">
      <!-- 無結果顯示 -->
      <template x-if="results.length === 0 && !isLoading && query.length > 2">
        <p class="search-results-empty p-4 text-center text-base-content/70">
          沒有找到符合的結果
        </p>
      </template>
      
      <!-- 結果列表 -->
      <template x-for="(result, index) in results" :key="index">
        <div class="p-4 hover:bg-base-200">
          <a :href="result.permalink" class="block">
            <h3 class="text-lg font-semibold mb-1" x-text="result.title"></h3>
            <p class="text-sm text-base-content/70" x-text="result.description || result.summary || ''"></p>
            
            <!-- 標籤列表 -->
            <div class="mt-2 flex flex-wrap gap-1" x-show="result.tags && result.tags.length">
              <template x-for="tag in result.tags" :key="tag">
                <span class="bg-primary-100 text-primary-800 text-xs font-medium mr-1 px-2 py-0.5 rounded dark:bg-primary-200 dark:text-primary-800">
                  <span x-text="tag"></span>
                </span>
              </template>
            </div>
          </a>
        </div>
      </template>
    </div>
  </div>
  
  <!-- 搜尋結果模板（用於 mark.js 高亮） -->
  <script id="search-result-template" type="text/x-template">
    <div class="p-4 hover:bg-base-200">
      <a href="${link}" class="block">
        <h3 class="text-lg font-semibold mb-1">${title}</h3>
        <p class="text-sm text-base-content/70" id="summary-${key}">${snippet}</p>
        ${isset tags}<div class="mt-2 flex flex-wrap gap-1">${tags}</div>${end}
      </a>
    </div>
  </script>
</div>
```

在頁面中引用搜尋元件：

```go
{{ partial "search.html" . }}
```

### 7. 進階整合案例

#### 7.1 搜索模態框整合

Alpine.js 的模態框和搜索功能可以結合使用，創建一個完全由 Alpine.js 驅動的搜索體驗：

```html
<!-- 搜尋按鈕 (位於 header.html) -->
<button class="btn btn-ghost btn-circle" @click="$dispatch('open-modal', {id: 'search-modal'})">
    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
    </svg>
</button>

<!-- 搜尋模態框 (使用 Alpine.js 的 modal 元件) -->
<div 
  x-data="modal"
  x-show="visible"
  x-on:open-modal.window="$event.detail.id === 'search-modal' && show()"
  x-on:close-modal.window="$event.detail.id === 'search-modal' && hide()"
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
  
  <!-- 模態框內容 -->
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
    <!-- 搜尋元件 -->
    {{ partial "search.html" . }}
  </div>
</div>
```

這種整合方式使得：

1. 點擊搜索按鈕時，通過事件分發系統觸發模態框
2. 模態框使用 Alpine.js 的過渡效果平滑顯示
3. 在模態框內嵌入搜索組件，實現無刷新搜索體驗
4. 按 ESC 鍵或點擊背景即可關閉模態框

#### 7.2 組件間通信

Alpine.js 的事件系統可以實現組件間的通信，例如從一個組件觸發另一個組件的動作：

```html
<!-- 組件 A：發送事件 -->
<button @click="$dispatch('font-size-change', {size: 'large'})">
  增大字體
</button>

<!-- 組件 B：接收事件 -->
<div x-data="fontSize" @font-size-change.window="setSize($event.detail.size)">
  <!-- 內容 -->
</div>
```

這種基於事件的通信方式保持了組件之間的低耦合，同時提供了靈活的交互能力。

### 8. Alpine.js 與 Hugo 整合的最佳實踐

#### 8.1 整合效能優化

1. **延遲載入非關鍵組件**：

   ```javascript
   // 在 app.js 中有條件地導入組件
   // 核心組件立即導入
   import './components/darkMode'
   import './components/dropdown'
   
   // 非關鍵組件可以延遲載入
   if (document.querySelector('[x-data="search"]')) {
     import('./components/search')
   }
   ```

2. **分割打包策略**：

   ```html
   <!-- 基礎 Alpine.js -->
   {{ $core := resources.Get "js/alpine-core.js" | js.Build (dict "minify" true) }}
   <script src="{{ $core.RelPermalink }}"></script>
   
   <!-- 頁面特定組件（按需載入） -->
   {{ if .IsHome }}
     {{ $home := resources.Get "js/home-components.js" | js.Build (dict "minify" true) }}
     <script src="{{ $home.RelPermalink }}"></script>
   {{ end }}
   ```

#### 8.2 調試技巧

1. **啟用 Alpine.js 開發模式**：

   ```javascript
   // 在開發環境中啟用，生產環境關閉
   if (process.env.NODE_ENV !== 'production') {
     window.Alpine.store('devtools', true)
   }
   ```

2. **添加調試輔助工具**：

   ```html
   <!-- 在頁面上顯示 Alpine.js 狀態 -->
   <div x-data="{ get state() { return JSON.stringify($data) } }" class="debug-panel">
     <pre x-text="state"></pre>
   </div>
   ```

#### 8.3 國際化支持

1. **與 Hugo 多語言整合**：

   ```html
   <div x-data="{ locale: '{{ .Site.Language.Lang }}' }">
     <button @click="$dispatch('change-locale', {locale: 'zh-tw'})">
       繁體中文
     </button>
     <button @click="$dispatch('change-locale', {locale: 'en'})">
       English
     </button>
   </div>
   ```

2. **多語言內容載入**：

   ```javascript
   Alpine.data('i18n', () => ({
     messages: {},
     async init() {
       const locale = document.documentElement.lang
       try {
         const response = await fetch(`/i18n/${locale}.json`)
         this.messages = await response.json()
       } catch (e) {
         console.error('Failed to load translations')
       }
     },
     t(key) {
       return this.messages[key] || key
     }
   }))
   ```

### 9. 驗證 Alpine.js 整合

完成所有配置和組件創建後，請執行以下測試步驟來驗證 Alpine.js 整合是否成功：

1. **檢查頁面載入**：

   ```bash
   # 啟動 Hugo 伺服器
   cd hugo-twda-v5
   hugo server
   ```

   在瀏覽器中打開 `http://localhost:1313/` 檢查網站是否正常載入，無 JavaScript 錯誤。

2. **驗證主題切換功能**：
   - 點擊頁面頂部的主題切換按鈕，檢查主題是否正確切換
   - 刷新頁面後，檢查主題選擇是否被記憶
   - 檢查系統主題偏好變更時網站主題是否隨之變更

3. **測試搜尋功能**：
   - 點擊搜尋按鈕，檢查模態框是否平滑顯示
   - 輸入關鍵字（至少 3 個字符），檢查搜尋結果是否顯示
   - 檢查第二次搜尋是否使用緩存（通過檢查網絡請求或者載入速度）

4. **測試字體大小調整**：
   - 在有 font-size-toggle 的頁面上，點擊不同的字體大小按鈕
   - 檢查內容區域的字體大小是否相應變更
   - 刷新頁面，確認字體大小設置被保留

5. **測試日期格式化**：
   - 在包含文章日期的頁面上，檢查日期是否被正確格式化
   - 確認相對時間（如「3 天前」）是否正確顯示

### 10. 常見問題排查

如果您在整合過程中遇到問題，請參考以下排查步驟：

1. **檢查控制台錯誤**：
   打開瀏覽器開發者工具的控制台標籤，查看是否有 JavaScript 錯誤。

2. **檢查網絡請求**：
   確認資源是否正確載入，特別是 app.js 和 index.json。

3. **清除瀏覽器緩存**：

   ```shell
   Ctrl+F5 或 Cmd+Shift+R
   ```

   強制刷新頁面，清除瀏覽器緩存。

4. **檢查 Hugo 構建輸出**：
   尋找任何與 JavaScript 編譯或資源處理相關的錯誤。

## 整合總結

### 優點

1. **無需額外的構建步驟**：Alpine.js 與 Hugo 的整合非常直接，通過 Hugo Pipes 就能處理 JavaScript，無需複雜的構建流程。

2. **高性能**：Alpine.js 的輕量級特性使得最終生成的靜態網站保持高性能，加載迅速。

3. **完全離線可用**：採用 NPM 方式整合所有依賴，確保生成的網站可以完全離線運行。

4. **漸進式增強**：可以逐步為網站添加交互功能，不會一次性增加過多複雜性。

5. **良好的可維護性**：組件化的結構讓代碼更易於理解和維護。

### 注意事項

1. **避免使用全局變量**：盡量使用 Alpine.js 的數據管理方式，避免全局變量污染。

2. **清理冗餘代碼**：徹底移除舊的 jQuery 或其他框架的代碼，避免衝突。

3. **保持組件獨立**：每個組件應該專注於單一功能，避免耦合過高。

4. **考慮舊瀏覽器兼容性**：如果需要支持舊版瀏覽器，可能需要添加相應的 polyfills。

5. **測試多種設備**：確保 Alpine.js 組件在不同設備和屏幕尺寸上都能正常工作。

6. **優化離線性能**：利用本地存儲緩存搜尋索引等資源，提高重複操作的響應速度。

7. **確保無障礙性**：為所有交互元素添加適當的 ARIA 屬性和鍵盤操作支持。

通過遵循這些最佳實踐和注意事項，Alpine.js 可以成為 Hugo 靜態網站開發的強大助手，幫助實現豐富的交互體驗，同時保持網站的高性能和可靠性。

### 11. 驗證檔案結構與依賴

檢查以下檔案結構以確保所有必要的組件和模板都已正確創建:

```plaintext
hugo-twda-v5/
├── config/
│   └── _default/
│       └── outputs.toml   # 確認包含 JSON 輸出格式
├── layouts/
│   └── index.json         # 搜尋索引模板
├── themes/
│   └── twda_v5/
│       ├── assets/
│       │   ├── js/
│       │   │   ├── app.js                     # Alpine.js 入口檔案
│       │   │   └── components/
│       │   │       ├── darkMode.js           # 深色模式組件
│       │   │       ├── dateFormat.js         # 日期格式化組件
│       │   │       ├── dropdown.js           # 下拉選單組件
│       │   │       ├── fontSize.js           # 字體大小組件
│       │   │       ├── modal.js              # 模態視窗組件
│       │   │       ├── search.js             # 搜尋組件
│       │   │       └── tabs.js               # 頁籤組件
│       └── layouts/
│           ├── _default/
│           │   └── baseof.html               # 基礎模板 (確認 Alpine.js 屬性)
│           └── partials/
│               ├── date-formatter.html       # 日期格式化模板
│               ├── font-size-toggle.html     # 字體大小調整模板
│               ├── header.html               # 頁頭 (包含主題切換)
│               ├── search.html               # 搜尋界面模板
│               └── scripts.html              # 腳本加載模板
```

檢查 `package.json` 確認所有必要的依賴已安裝:

```json
{
  "dependencies": {
    "alpinejs": "^3.14.9",
    "@alpinejs/persist": "^3.14.9",
    "@alpinejs/intersect": "^3.14.9",
    "daisyui": "^5.0.43",
    "date-fns": "^4.1.0",
    "fuse.js": "^7.1.0",
    "mark.js": "^8.11.1"
  }
}
```

這些檔案構成了 Alpine.js 與 Hugo 的完整整合，確保了網站的互動功能能夠正確運作。
