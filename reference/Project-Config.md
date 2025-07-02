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

### 5. JavaScript 架構配置

#### 入口文件架構

專案採用雙入口點架構，通過 Hugo ESBuild 統一打包：

**app.js** - 前端框架與功能模組入口

```javascript
import '../css/app.css';

// 功能模組導入
import './partials/switch-theme.js';      // 主題切換
import './partials/switch-font-size.js';  // 字體大小
import './partials/fuse-search.js';       // 搜尋功能
import './partials/katex-render.js';      // 數學公式
import './partials/mermaid-render.js';    // 圖表渲染
import './partials/date-fns-render.js';   // 日期處理

// Alpine.js 框架初始化
import Alpine from 'alpinejs';
import intersect from '@alpinejs/intersect';
import persist from '@alpinejs/persist';

// 插件註冊與啟動
(() => {
    Alpine.plugin(intersect);
    Alpine.plugin(persist);
    Alpine.start();
})();
```

**main.js** - UX 交互功能入口

```javascript
// 回到頁頂功能
const scrollToTopButton = document.getElementById("scrollToTopButton");
scrollToTopButton.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

// 公告系統
document.addEventListener("DOMContentLoaded", function () {
  // 公告容器管理
  // 本地存儲狀態管理
  // 動畫效果控制
});
```

#### Alpine.js 配置

**插件系統**

- `@alpinejs/intersect`: 交集觀察器，用於元素可見性檢測
- `@alpinejs/persist`: 狀態持久化，自動保存狀態到 localStorage

**啟動配置**

- 採用 IIFE (立即執行函數) 包裝，避免全局變量污染
- 按序註冊插件，確保功能完整性
- 統一啟動點，保證初始化順序

#### 功能模組化架構

**模組分離原則**

- 每個功能獨立模組文件
- 單一職責，便於維護
- 支援按需載入和樹搖優化

**核心功能模組**

1. **主題切換** (`switch-theme.js`)
   - DaisyUI 主題系統整合
   - 深色/淺色模式切換
   - 狀態持久化存儲

2. **字體大小調整** (`switch-font-size.js`)
   - 動態字體大小控制
   - 用戶偏好記憶
   - 無障礙功能支援

3. **搜尋系統** (`fuse-search.js`)
   - Fuse.js 模糊搜尋整合
   - 中文搜尋優化
   - 即時搜尋建議

4. **數學公式渲染** (`katex-render.js`)
   - KaTeX 公式引擎
   - 多種分隔符支援
   - 自動渲染配置

5. **圖表渲染** (`mermaid-render.js`)
   - Mermaid 圖表引擎
   - 多主題支援
   - 響應式圖表

6. **日期處理** (`date-fns-render.js`)
   - date-fns 日期格式化
   - 國際化支援
   - 相對時間顯示

#### UX 交互功能配置

**回到頁頂功能**

- 平滑滾動動畫 (`behavior: "smooth"`)
- 一鍵回頂部，提升用戶體驗
- 響應式按鈕定位

**公告系統架構**

```javascript
// 狀態管理
let alertTimeout;

// 顯示控制
function showAlert(duration = 10000) {
  // 清除現有定時器
  // 顯示動畫控制
  // 自動隱藏定時器
}

// 持久化狀態檢查
if (localStorage.getItem('noticeConfirmed') !== 'true') {
  showAlert();
}

// 事件處理器
confirmButton.addEventListener("click", function () {
  localStorage.setItem("noticeConfirmed", "true");
  // 隱藏邏輯
});
```

**公告系統特色**

- **狀態持久化**: 使用 localStorage 記錄用戶確認狀態
- **智能顯示**: 只對未確認用戶顯示公告
- **動畫控制**: CSS 類切換實現平滑動畫
- **事件管理**: 確認/關閉按鈕獨立處理
- **自動隱藏**: 10秒自動隱藏機制
- **錯誤處理**: DOM 元素存在性檢查

#### 事件驅動架構

**DOM 準備就緒檢查**

```javascript
document.addEventListener("DOMContentLoaded", function () {
  // 確保 DOM 完全載入後執行
  // 避免元素未找到錯誤
  // 提供更好的用戶體驗
});
```

**防御性編程**

```javascript
if (alertContainer) {
  // 檢查元素存在性
  // 避免 null 錯誤
} else {
  console.error("Element not found!");
}
```

**記憶體管理**

- 適當使用 `clearTimeout()` 清理定時器
- 避免記憶體洩漏
- 優化長時間運行性能

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

### 環境需求

1. **系統要求**: macOS/Linux/Windows
2. **Node.js**: v18+ (建議使用 LTS 版本)
3. **Hugo**: v0.147.9+ Extended 版本
4. **包管理器**: Yarn v4.6.0+ (或 npm/pnpm)
5. **瀏覽器**: Chrome 90+, Firefox 88+, Safari 14+

### 開發工作流

1. **專案初始化**:
   ```bash
   git clone <repository-url>
   cd Hugo-DaisyUI5
   yarn install
   ```

2. **開發環境啟動**:
   ```bash
   yarn dev                # 啟動 Hugo 開發服務器
   ```

3. **代碼開發**:
   - 遵循 ESLint 和 Prettier 規範
   - 使用 VS Code 建議的擴展套件
   - 定期執行 `yarn build` 檢查建構狀態

4. **測試與驗證**:
   - 本地測試多種瀏覽器相容性
   - 檢查響應式設計
   - 驗證 SEO 和無障礙功能

### 架構指南

1. **CSS 架構**: 
   - 優先使用 Tailwind CSS v4 + DaisyUI v5 類名
   - 避免自定義 CSS，善用 Tailwind 工具類
   - 使用 DaisyUI 組件系統保持一致性

2. **JavaScript 開發**: 
   - 優先使用 Alpine.js 進行互動功能開發
   - 遵循模組化設計原則
   - 使用 localStorage 進行狀態管理

3. **Hugo 模板**: 
   - 遵循 Hugo 最佳實踐
   - 使用 Partial 模板提高重用性
   - 善用 Hugo 內建函數和管道

4. **效能優化**: 
   - 圖片使用 Hugo 內建處理功能
   - CSS/JS 壓縮與快取策略
   - 善用 CDN 和瀏覽器快取

### 維護與部署

1. **版本控制**: 
   - 遵循語義化版本規範
   - 使用 Conventional Commits
   - 定期更新依賴套件

2. **部署策略**: 
   - 支援 Netlify、Vercel、GitHub Pages
   - CI/CD 自動化建構與部署
   - 環境變數管理

3. **監控與分析**: 
   - Google Analytics 集成
   - Core Web Vitals 效能監控
   - 錯誤追蹤與日誌管理

### 疑難排解

1. **常見問題**: 
   - Hugo 版本相容性檢查
   - Node.js 依賴衝突解決
   - CSS 樣式載入問題

2. **除錯工具**: 
   - Hugo 內建除錯模式
   - 瀏覽器開發者工具
   - PostCSS 和 Tailwind CSS 除錯

3. **社群資源**: 
   - Hugo 官方文檔
   - Tailwind CSS 社群
   - DaisyUI 組件庫文檔

## JavaScript 最佳實踐

### 1. 模組化設計

- **單一職責**: 每個模組負責一個功能
- **鬆耦合**: 模組間依賴最小化
- **可重用性**: 便於其他專案複用

### 2. 性能優化

- **懶加載**: 按需載入功能模組
- **事件委託**: 減少事件監聽器數量
- **記憶體管理**: 及時清理不需要的資源

### 3. 錯誤處理

- **防御性檢查**: 驗證 DOM 元素存在性
- **優雅降級**: 功能失效時不影響其他功能
- **錯誤日誌**: 便於調試和維護

### 4. 用戶體驗

- **平滑動畫**: 提供視覺反饋
- **狀態持久化**: 記住用戶偏好
- **響應式設計**: 適配多種設備

### 5. 開發與部署

#### 開發工作流

```bash
# 安裝依賴
yarn install

# 開發環境
yarn dev                # Hugo 開發服務器
yarn start              # 啟動 Hugo 開發服務器

# 建構與部署
yarn build              # 生產環境建構
yarn preview            # 預覽生產構建
```

#### 程式碼品質

- **ESLint**: JavaScript 語法檢查
- **Prettier**: 程式碼格式化
- **JSDoc**: 文檔註釋規範
- **單元測試**: 核心功能測試覆蓋

#### 效能監控

- **Bundle 分析**: 定期檢查打包大小
- **載入時間**: 監控首屏載入性能
- **記憶體使用**: 避免記憶體洩漏
- **用戶體驗指標**: Core Web Vitals 監測

### 版本升級說明

#### 從舊版本 (Webpack) 到新版本 (Hugo ESBuild) 的主要變更

**技術棧變更：**

| 項目 | 舊版本 | 新版本 | 說明 |
|------|--------|--------|------|
| CSS 框架 | Tailwind CSS v3.4.17 | Tailwind CSS v4.1.11 | 升級到最新版本 |
| UI 組件庫 | DaisyUI v4.12.23 | DaisyUI v5.0.43 | 重大版本升級 |
| 打包工具 | Webpack v5.97.1 | Hugo ESBuild | 改用 Hugo 內建工具 |
| PostCSS | postcss-loader | @tailwindcss/postcss | 新的 PostCSS 處理器 |

**主要優勢：**

1. **建構速度提升**: Hugo ESBuild 比 Webpack 快 10-100 倍
2. **配置簡化**: 移除複雜的 Webpack 配置
3. **開發體驗**: 更快的熱重載和即時預覽
4. **維護成本**: 減少依賴套件和配置檔案

**遷移注意事項：**

- 所有 `import` 語句需要改為 CDN 載入或 Hugo 資源處理
- Webpack 特定的配置檔案可以移除
- Alpine.js 改為 CDN 載入，模組註冊方式調整
- CSS 處理流程改為純 PostCSS + Hugo 管道
