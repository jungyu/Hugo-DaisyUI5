# Hugo 專案配置文檔

## 技術堆疊概覽

本專案採用現代化的靜態網站技術堆疊，整合多項前端工具以提供高效的開發體驗和優化的用戶體驗。

### 核心技術

- **Hugo**: v0.147.9 靜態網站生成器 (Go 語言開發)
- **Tailwind CSS**: v4.1.11 原子化 CSS 框架
- **DaisyUI**: v5.0.43 基於 Tailwind CSS 的 UI 組件庫
- **Alpine.js**: v3.14.9 輕量級 JavaScript 框架
- **Yarn**: v4.6.0 包管理器 (或可選用 npm/pnpm)
- **Hugo 內建打包**: ESBuild + PostCSS (替代 Webpack)

## 詳細配置

### 1. Hugo 配置

#### 基本設定 (`config/_default/config.toml`)
```toml
baseURL = 'https://localhost:1313'
languageCode = 'zh-TW'
title = '艾倫 R&D'
theme = 'twda_v5'
publishDir = 'public'
```

#### 內容組織
- **分類法**: categories, tags, series, authors
- **永久鏈接**: `/blogs/:sections[1]/:year/:slug/`
- **分頁**: 每頁 9 篇文章

#### 輸出格式
- HTML, RSS, JSON, SITEMAP

### 2. Tailwind CSS 配置 (`tailwind.config.js`)

#### JIT 模式
```javascript
mode: "jit"
```

#### 內容掃描路徑
- `./content/**/*.{html,js,md}`
- `./themes/twda/layouts/**/*.html`
- `./themes/twda/assets/js/**/*.js`

#### DaisyUI 主題
- `"dracula"` (深色主題)
- `"cmyk"` (淺色主題)

#### 插件
- `@tailwindcss/aspect-ratio`
- `@tailwindcss/typography`
- `daisyui`

### 3. Hugo 資源處理配置

#### JavaScript 處理 (使用 Hugo ESBuild)
```yaml
# config.yaml
build:
  writeStats: true
  
params:
  assets:
    js:
      - name: "main"
        src: "themes/twda_v5/assets/js/main.js"
      - name: "app" 
        src: "themes/twda_v5/assets/js/app.js"
```

#### 資源優化
- **JavaScript**: ESBuild 打包和壓縮
- **CSS**: PostCSS 處理 Tailwind CSS
- **圖片**: Hugo 內建圖片處理
- **字體**: 直接復制到 static 目錄

### 4. PostCSS 配置 (`postcss.config.js`)

#### 插件
- **Tailwind CSS**: 主要 CSS 框架
- **postcss-preset-env**: 現代 CSS 功能支援
- **autoprefixer**: 生產環境自動添加瀏覽器前綴

### 5. Alpine.js 配置

#### 插件
- `@alpinejs/intersect`: 交集觀察器
- `@alpinejs/persist`: 狀態持久化

#### 功能模組
- 主題切換
- 字體大小調整
- Fuse.js 搜尋
- KaTeX 數學公式渲染
- Mermaid 圖表渲染
- date-fns 日期處理

### 6. 依賴套件

#### 開發依賴 (devDependencies)
```json
{
  "@alpinejs/intersect": "^3.14.9",
  "@alpinejs/persist": "^3.14.9",
  "@tailwindcss/typography": "^0.5.16",
  "alpinejs": "^3.14.9",
  "daisyui": "^5.0.43",
  "postcss": "^8.5.6",
  "postcss-cli": "^11.0.1",
  "postcss-preset-env": "^10.1.3",
  "tailwindcss": "^4.1.11",
  "theme-change": "^2.5.0"
}
```

#### 運行時依賴 (dependencies)
```json
{
  "date-fns": "^4.1.0",
  "fuse.js": "^7.0.0",
  "katex": "^0.16.20",
  "mark.js": "^8.11.1",
  "mermaid": "^11.4.1"
}
```

### 7. npm 腳本

#### 開發環境
```bash
yarn start              # 啟動 Hugo 開發服務器
yarn dev                # Hugo 開發服務器 (端口 1313)
yarn serve              # Hugo 開發服務器別名
```

#### 生產構建
```bash
yarn build              # Hugo 生產構建
yarn build:css          # 單獨構建 CSS (如需要)
yarn preview            # 預覽生產構建
```

### 8. 部署配置

#### Firebase Hosting (`firebase.json`)
```json
{
  "hosting": {
    "public": "public",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ]
  }
}
```

### 9. 主題架構 (twda)

#### 目錄結構
```
themes/twda/
├── archetypes/         # 內容模板
├── assets/            # 資源文件
│   ├── css/           # CSS 樣式
│   └── js/            # JavaScript 代碼
├── content/           # 主題內容
├── data/              # 數據文件
├── layouts/           # 模板布局
├── static/            # 靜態資源
└── i18n/              # 國際化文件
```

### 10. 特殊功能配置

#### KaTeX 數學公式
- 支援行內公式: `\\(...\\)`
- 支援塊級公式: `$$...$$`

#### Mermaid 圖表
- 流程圖、時序圖、甘特圖等
- 通過 Hugo shortcode 調用

#### 搜尋功能
- 使用 Fuse.js 實現模糊搜尋
- 支援中文搜尋

#### 主題切換
- 支援深色/淺色主題切換
- 使用 theme-change 套件
- 狀態持久化

## 開發建議

1. **環境要求**: Node.js 18+, Hugo v0.147.9+, Yarn v4.6.0+
2. **開發流程**: 使用 `yarn dev` 開啟開發環境
3. **代碼格式**: 遵循 ESLint 和 Prettier 規範
4. **CSS 架構**: 優先使用 Tailwind CSS v4 + DaisyUI v5 類名
5. **JavaScript**: 優先使用 Alpine.js 進行互動功能開發
6. **資源處理**: 使用 Hugo 內建 ESBuild 和 PostCSS
