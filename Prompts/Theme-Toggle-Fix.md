# 主題切換功能修正指南

> 2025年7月2日更新：針對 Alpine.$persist 不兼容問題的完整修正流程

## 問題說明

在實施主題切換功能時，可能遇到以下錯誤：
```
Uncaught TypeError: Alpine.$persist is not a function
```

此錯誤是因為 `@alpinejs/persist` 插件在 `alpine:init` 事件時尚未完全載入，導致 `Alpine.$persist` 方法不可用。

## 修正方案：使用 localStorage 替代 Alpine.$persist

### 1. 修正 assets/js/alpine.js 中的主題 Store

```javascript
// 修正前 (會出錯的版本)
Alpine.store('theme', {
  current: Alpine.$persist('dracula').as('theme'),
  // ...
})

// 修正後 (正確版本)
Alpine.store('theme', {
  current: localStorage.getItem('theme') || 'dracula',
  
  init() {
    this.apply()
    
    // 監聽系統主題變化
    if (window.matchMedia) {
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
        if (this.current === 'system') {
          this.apply()
        }
      })
    }
  },
  
  apply() {
    document.documentElement.setAttribute('data-theme', this.current)
    localStorage.setItem('theme', this.current) // 手動保存到 localStorage
    
    // 設置 dark class 用於 Tailwind dark mode
    if (this.current === 'dracula') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
    
    // 更新 Mermaid 主題
    if (window.mermaid) {
      window.mermaid.initialize({
        theme: this.current === 'dracula' ? 'dark' : 'default'
      })
    }
  },
  
  setTheme(theme) {
    this.current = theme
    this.apply()
  },
  
  toggle() {
    this.current = this.current === 'dracula' ? 'cmyk' : 'dracula'
    this.apply()
  }
})
```

### 2. 修正其他組件中的 $persist 使用

```javascript
// themeToggle 組件修正
Alpine.data('themeToggle', () => ({
  theme: localStorage.getItem('themeToggle') || 'dracula',
  
  updateTheme() {
    localStorage.setItem('themeToggle', this.theme) // 手動保存
    let effectiveTheme = this.theme
    
    if (this.theme === 'system') {
      effectiveTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dracula' : 'cmyk'
    }
    
    document.documentElement.setAttribute('data-theme', effectiveTheme)
    // ...其他邏輯
  }
}))

// navThemeToggle 組件修正
Alpine.data('navThemeToggle', () => ({
  currentTheme: localStorage.getItem('navTheme') || 'dracula',
  
  setTheme(theme) {
    this.currentTheme = theme
    localStorage.setItem('navTheme', theme) // 手動保存
    this.dropdownOpen = false
  }
}))

// 搜尋組件修正
Alpine.store('search', {
  query: localStorage.getItem('searchQuery') || '',
  // 在搜尋方法中保存查詢
  search() {
    localStorage.setItem('searchQuery', this.query)
    // ...搜尋邏輯
  }
})
```

### 3. 確保 header.html 使用正確的語法

由於 Hugo 模板引擎對 Alpine.js 語法敏感，使用 `onclick` 事件處理器：

```html
<div class="navbar-end">
  <!-- Theme Toggle with Alpine.js -->
  <div class="dropdown dropdown-end" x-data="{ open: false }">
    <label tabindex="0" class="btn btn-ghost btn-circle" @click="open = !open">
      <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
        <path fill-rule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clip-rule="evenodd"></path>
      </svg>
    </label>
    <ul tabindex="0" class="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-40" 
        x-show="open" @click.outside="open = false" 
        x-transition:enter="transition ease-out duration-200"
        x-transition:enter-start="opacity-0 scale-95"
        x-transition:enter-end="opacity-100 scale-100"
        x-transition:leave="transition ease-in duration-150"
        x-transition:leave-start="opacity-100 scale-100"
        x-transition:leave-end="opacity-0 scale-95">
      <li>
        <a data-theme="cmyk" onclick="Alpine.store('theme').setTheme('cmyk'); this.closest('.dropdown').querySelector('[x-data]').__x.$data.open = false">
          😊 Light
        </a>
      </li>
      <li>
        <a data-theme="dracula" onclick="Alpine.store('theme').setTheme('dracula'); this.closest('.dropdown').querySelector('[x-data]').__x.$data.open = false">
          🌙 Dark
        </a>
      </li>
    </ul>
  </div>
</div>
```

### 4. 檢查常見問題

**問題 1：header.html 檔案為空**
```bash
# 檢查檔案大小
ls -la themes/twda_v5/layouts/partials/header.html

# 如果顯示 0 bytes，則需要重新創建完整的 header.html
```

**問題 2：Hugo 模板語法錯誤**
```bash
# 建構時出現模板錯誤
hugo --gc --minify
# Error: "'" in attribute name 或類似錯誤

# 解決方法：使用 onclick 而非 Alpine.js @ 綁定語法
```

**問題 3：主題不持久化**
```javascript
// 確保每次主題變更都保存到 localStorage
apply() {
  document.documentElement.setAttribute('data-theme', this.current)
  localStorage.setItem('theme', this.current) // 必須手動保存
}
```

### 5. 測試與驗證

```bash
# 重新建構網站
hugo --gc --minify

# 啟動開發伺服器
hugo server --port 1314

# 在瀏覽器中測試：
# 1. 點擊主題切換按鈕
# 2. 檢查 data-theme 屬性變化
# 3. 重新載入頁面確認主題持久化
# 4. 檢查瀏覽器控制台無 JavaScript 錯誤
```

### 6. 完整的主題功能特性

修正後的主題切換功能支援：

- ✅ **雙主題切換**：Dracula (深色) 與 CMYK (淺色)
- ✅ **持久化儲存**：使用 localStorage 保存使用者選擇
- ✅ **即時套用**：點擊後立即變更主題
- ✅ **DaisyUI 整合**：正確設置 `data-theme` 屬性
- ✅ **Tailwind 相容**：同步設置 `dark` class
- ✅ **Mermaid 支援**：自動調整圖表主題
- ✅ **無 JavaScript 錯誤**：移除 Alpine.$persist 依賴

## 故障排除快速清單

1. **檢查 header.html 檔案是否存在且非空**
2. **確認 Alpine.js CDN 正確載入**
3. **驗證 JavaScript bundle 包含主題功能**
4. **測試瀏覽器控制台無錯誤**
5. **確認 localStorage 正常運作**
6. **檢查 Hugo 建構無模板語法錯誤**

## 修正步驟總結

1. 將所有 `Alpine.$persist()` 替換為 `localStorage.getItem()` / `localStorage.setItem()`
2. 在每個主題變更方法中手動保存到 localStorage
3. 使用 `onclick` 事件處理器避免 Hugo 模板語法衝突
4. 確保 header.html 完整且非空
5. 重新建構並測試功能

完成以上修正後，主題切換功能將完全正常運作，無任何 JavaScript 錯誤。
