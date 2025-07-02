# Hugo + TailwindCSS + DaisyUI 專案補充建構指南

> 本文檔記錄在實際建構過程中發現的缺失項目與自動補充的內容

## 🎯 補充內容概覽

在執行原始建構指南時，發現了一些缺失的配置和文件，本文檔記錄這些重要的補充項目，確保專案能夠完整運行。

## 🛠️ 自動補充的內容

### 1. JavaScript 功能模組

#### 1.1 Alpine.js 主題切換功能
**文件**: `themes/twda_v5/assets/js/theme.js`

```javascript
// Alpine.js 主題切換和初始化
document.addEventListener('alpine:init', () => {
    Alpine.data('themeToggle', () => ({
        theme: localStorage.getItem('theme') || 'dracula',
        
        init() {
            this.setTheme(this.theme);
        },
        
        toggle() {
            this.theme = this.theme === 'dracula' ? 'cmyk' : 'dracula';
            this.setTheme(this.theme);
            localStorage.setItem('theme', this.theme);
        },
        
        setTheme(theme) {
            document.documentElement.setAttribute('data-theme', theme);
        }
    }));
});

// 頁面載入時立即設置主題，避免閃爍
(function() {
    const theme = localStorage.getItem('theme') || 'dracula';
    document.documentElement.setAttribute('data-theme', theme);
})();
```

**補充原因**: 原始指南中沒有具體的 JavaScript 實作，這是實現 DaisyUI 主題切換的核心功能。

#### 1.2 主要 CSS 配置
**文件**: `themes/twda_v5/assets/css/main.css`

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

/* 自定義基礎樣式 */
@layer base {
  html {
    @apply scroll-smooth;
  }
  
  body {
    @apply transition-colors duration-300;
  }
}

/* 自定義組件樣式 */
@layer components {
  .btn-theme-toggle {
    @apply btn btn-ghost btn-circle;
  }
  
  .theme-transition {
    @apply transition-all duration-300 ease-in-out;
  }
}

/* 自定義工具樣式 */
@layer utilities {
  .text-shadow {
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
  }
}
```

**補充原因**: 需要處理 TailwindCSS `@apply` 指令的 lint 警告，並提供基礎樣式架構。

### 2. Hugo 配置修正

#### 2.1 分頁設定語法更新
**文件**: `config/_default/config.toml`

**原始語法**:
```toml
paginate = 10
paginatePath = "page"
```

**修正後語法**:
```toml
[pagination]
  pagerSize = 10
  path = "page"
```

**補充原因**: Hugo 新版本中分頁設定語法已更新，舊語法會產生警告。

#### 2.2 MediaTypes 配置問題解決
**問題**: `config/_default/mediaTypes.toml` 格式錯誤導致 Hugo 無法啟動

**解決方案**: 移除有問題的 mediaTypes.toml 文件
```bash
rm config/_default/mediaTypes.toml
```

**補充原因**: 原始配置文件格式不正確，移除後使用 Hugo 預設配置更穩定。

### 3. 模板系統補充

#### 3.1 JSON 輸出模板
**文件**: `themes/twda_v5/layouts/index.json`

```json
{
  "site": {
    "title": {{ .Site.Title | jsonify }},
    "description": {{ .Site.Params.description | default "" | jsonify }},
    "url": {{ .Site.BaseURL | jsonify }},
    "language": {{ .Site.LanguageCode | jsonify }}
  },
  "pages": [
    {{- $pages := where .Site.RegularPages "Type" "ne" "page" -}}
    {{- range $index, $page := $pages -}}
      {{- if $index }},{{ end }}
      {
        "title": {{ $page.Title | jsonify }},
        "url": {{ $page.Permalink | jsonify }},
        "date": {{ $page.Date.Format "2006-01-02" | jsonify }},
        "summary": {{ $page.Summary | jsonify }}
      }
    {{- end -}}
  ]
}
```

**補充原因**: 解決 "found no layout file for 'json' for kind 'home'" 警告，提供 JSON API 支援。

#### 3.2 404 錯誤頁面
**文件**: `themes/twda_v5/layouts/404.html`

```html
{{ define "main" }}
<div class="hero min-h-screen bg-base-200">
  <div class="hero-content text-center">
    <div class="max-w-md">
      <h1 class="text-5xl font-bold">404</h1>
      <p class="py-6">抱歉，找不到您要的頁面。</p>
      <a href="{{ .Site.BaseURL }}" class="btn btn-primary">回到首頁</a>
    </div>
  </div>
</div>
{{ end }}
```

**補充原因**: 提供使用者友善的錯誤頁面，使用 DaisyUI 組件設計。

### 4. 版本控制配置

#### 4.1 .gitignore 設定
**文件**: `.gitignore`

```gitignore
# Hugo 建構輸出
public/

# Node.js 依賴
node_modules/

# 系統文件
.DS_Store
Thumbs.db

# IDE 配置
.vscode/
.idea/

# 暫存文件
*.tmp
*.log
```

**補充原因**: 避免追蹤建構產出和臨時文件，保持倉庫整潔。

### 5. 依賴管理補充

#### 5.1 package.json 配置
**實際安裝的依賴版本**:

```json
{
  "name": "hugo-daisyui5",
  "version": "1.0.0",
  "description": "Hugo site with TailwindCSS and DaisyUI 5",
  "scripts": {
    "dev": "hugo server",
    "build": "hugo --gc --minify",
    "preview": "hugo server --environment production"
  },
  "devDependencies": {
    "@tailwindcss/typography": "^0.5.15",
    "alpinejs": "^3.14.9",
    "autoprefixer": "^10.4.20",
    "daisyui": "^4.12.23",
    "postcss": "^8.5.0",
    "tailwindcss": "^3.4.16"
  }
}
```

**補充原因**: 實際可用的穩定版本與原始指南中的版本有差異。

### 6. 啟動問題解決流程

#### 6.1 常見錯誤處理序列

1. **MediaTypes 配置錯誤**
   ```bash
   # 移除有問題的配置文件
   rm config/_default/mediaTypes.toml
   ```

2. **分頁設定警告**
   ```toml
   # 更新為新語法
   [pagination]
     pagerSize = 10
     path = "page"
   ```

3. **JSON 模板缺失**
   ```bash
   # 創建 JSON 輸出模板
   touch themes/twda_v5/layouts/index.json
   ```

4. **Git 警告處理**
   ```bash
   # 初始化 Git 倉庫
   git init
   git add .
   git commit -m "Initial commit"
   ```

**補充原因**: 實際建構過程中遇到的問題和解決順序。

### 7. 開發環境驗證

#### 7.1 啟動驗證流程
```bash
# 1. 檢查 Hugo 版本
hugo version

# 2. 檢查 Yarn 安裝
yarn --version

# 3. 安裝依賴
yarn install

# 4. 啟動開發伺服器
hugo server --bind 0.0.0.0 --baseURL http://localhost --logLevel info

# 5. 驗證建構
hugo --gc --cleanDestinationDir
```

#### 7.2 成功指標
- ✅ Hugo 啟動無警告
- ✅ JSON 輸出正常 (`http://localhost:1313/index.json`)
- ✅ 主題切換功能正常
- ✅ TailwindCSS 樣式載入
- ✅ DaisyUI 組件顯示正確

## 📋 建議的建構檢查清單

### 環境檢查
- [ ] Hugo v0.147.9+ Extended 安裝
- [ ] Node.js 18+ 安裝
- [ ] Yarn 4.6.0+ 安裝

### 檔案建立檢查
- [ ] `themes/twda_v5/assets/js/theme.js` 存在且內容正確
- [ ] `themes/twda_v5/assets/css/main.css` 存在且內容正確
- [ ] `themes/twda_v5/layouts/index.json` 存在且內容正確
- [ ] `themes/twda_v5/layouts/404.html` 存在且內容正確
- [ ] `.gitignore` 正確設定

### 配置檢查
- [ ] `config/_default/config.toml` 分頁語法正確
- [ ] `package.json` 依賴版本相容
- [ ] `tailwind.config.js` DaisyUI 設定正確

### 功能檢查
- [ ] Hugo 啟動無錯誤警告
- [ ] 主題切換功能正常
- [ ] JSON API 輸出正常
- [ ] Git 倉庫初始化完成

## 🔧 故障排除

### 常見問題與解決方案

1. **Hugo 啟動失敗**
   - 檢查 mediaTypes.toml 是否有語法錯誤
   - 確認 config.toml 分頁設定語法

2. **樣式不生效**
   - 確認 TailwindCSS 和 DaisyUI 正確安裝
   - 檢查 main.css 是否正確引入

3. **主題切換不工作**
   - 確認 Alpine.js 正確載入
   - 檢查 theme.js 語法是否正確

4. **JSON 輸出 404**
   - 確認 index.json 模板存在
   - 檢查模板語法是否正確

## 📚 技術細節說明

### Alpine.js 與 DaisyUI 整合
- 使用 `data-theme` 屬性控制 DaisyUI 主題
- localStorage 持久化主題設定
- 避免頁面載入時的主題閃爍

### Hugo 模板系統
- JSON 模板使用 Hugo 的 jsonify 函數
- 支援多語言和多輸出格式
- 模板查找遵循 Hugo Layouts Lookup Rules

### TailwindCSS 配置
- 使用 @layer 指令組織樣式
- 自定義組件樣式與 DaisyUI 整合
- PostCSS 自動處理瀏覽器前綴

---

**建議**: 在使用原始建構指南時，請同時參考本補充文檔，確保所有必要的文件和配置都正確設置。
