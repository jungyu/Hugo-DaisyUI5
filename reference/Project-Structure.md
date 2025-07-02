# Hugo 專案架構文檔

## 專案總覽

Hugo-DaisyUI5 是一個基於 Hugo 靜態網站生成器的現代化部落格平台，整合了 Tailwind CSS、DaisyUI、Alpine.js 等前端技術，提供優秀的開發體驗和用戶體驗。本專案遵循 Hugo 官方最新架構標準，採用模組化設計和最佳實踐。

## Hugo 官方標準架構

根據 Hugo v0.147.9 官方文件，Hugo 使用 **聯合文件系統 (Union File System)** 將多個目錄掛載到相同位置，實現主題繼承和模組化。標準的目錄結構包含以下核心目錄：

### 核心目錄說明

- **archetypes/**: 內容模板目錄，定義新內容的預設 Front Matter
- **assets/**: 全域資源目錄，通過 Hugo Pipes 資源管道處理 (ESBuild、PostCSS、Sass)
- **config/**: 配置目錄，支援環境特定和模組化配置
- **content/**: 內容目錄，包含所有網站內容、頁面包 (Page Bundles) 和 Front Matter
- **data/**: 數據目錄，存放 JSON、TOML、YAML 等結構化數據文件
- **i18n/**: 國際化目錄，多語言翻譯文件
- **layouts/**: 佈局模板目錄，包含所有 HTML 模板、部分模板和短代碼
- **static/**: 靜態文件目錄，文件直接複製到輸出目錄，不經過處理
- **themes/**: 主題目錄，可包含多個主題並支援主題組件

### 自動生成目錄

- **public/**: 構建輸出目錄 (`hugo` 命令生成)
- **resources/**: 資源緩存目錄 (Hugo Pipes 自動生成和管理)

### 頁面類型 (Page Kinds)

- **home**: 網站首頁 (`_index.md` in root)
- **page**: 單一內容頁面 (`index.md` 或 `.md` 檔案)
- **section**: 內容區段頁面 (`_index.md` in section)
- **taxonomy**: 分類法列表頁 (如 `/categories/`)
- **term**: 分類詞彙頁 (如 `/categories/tech/`)
- **404**: 錯誤頁面

### 頁面包 (Page Bundles)

**葉子包 (Leaf Bundle):**

- 包含 `index.md` 和零個或多個資源
- 位於分支末端，無子頁面
- 資源可通過 `.Resources` 訪問

**分支包 (Branch Bundle):**

- 包含 `_index.md` 和零個或多個資源
- 可包含子頁面和其他包
- 頂層目錄也是分支包

## 實際專案結構

```text
Hugo-DaisyUI5/
├── archetypes/                 # Hugo 內容模板
│   └── default.md             # 默認文章模板
├── assets/                    # 靜態資源目錄
│   ├── icons/                 # 圖標文件
│   └── images/                # 圖片資源
├── config/                    # Hugo 配置目錄
│   ├── _default/              # 默認配置
│   │   ├── config.toml        # 主要配置文件
│   │   ├── markup.toml        # 標記語言配置
│   │   ├── params.toml        # 參數配置
│   │   ├── security.toml      # 安全配置
│   │   ├── i18n.toml          # 國際化配置
│   │   ├── taxonomies.toml    # 分類法配置
│   │   └── pagination.toml    # 分頁配置
│   └── production/            # 生產環境配置
├── content/                   # 網站內容目錄
│   ├── _index.md             # 首頁內容
│   ├── authors/              # 作者資訊
│   ├── blogs/                # 部落格文章
│   │   └── trick/            # 技術文章分類
│   ├── courses/              # 課程內容
│   └── pages/                # 靜態頁面
├── data/                     # 數據文件目錄
│   ├── authors.toml          # 作者數據
│   ├── carousel.toml         # 輪播數據
│   ├── sponsors.toml         # 贊助商數據
│   └── page_filters.yaml     # 頁面過濾器
├── i18n/                     # 國際化翻譯文件
├── layouts/                  # 自定義布局模板
├── public/                   # 構建輸出目錄
├── resources/                # Hugo 處理後的資源
│   └── _gen/                 # 自動生成的資源
├── static/                   # 靜態文件目錄
├── themes/                   # Hugo 主題目錄
│   └── twda_v5/              # 自定義主題 (v5 對應 DaisyUI v5)
├── firebase.json             # Firebase 部署配置
├── package.json              # Node.js 項目配置
├── postcss.config.js         # PostCSS 配置
├── tailwind.config.js        # Tailwind CSS 配置
└── yarn.lock                 # Yarn 依賴鎖定文件
```

## 主題架構 (twda_v5)

```text
themes/twda_v5/
├── archetypes/               # 主題內容模板
│   └── default.md
├── assets/                   # 主題資源文件
│   ├── css/                  # 樣式文件
│   │   └── app.css          # 主要樣式入口
│   └── js/                   # JavaScript 文件
│       ├── app.js           # 主要 JS 入口
│       ├── main.js          # UX 相關功能
│       └── partials/        # 功能模組
│           ├── switch-theme.js      # 主題切換
│           ├── switch-font-size.js  # 字體大小
│           ├── fuse-search.js       # 搜尋功能
│           ├── katex-render.js      # 數學公式
│           ├── mermaid-render.js    # 圖表渲染
│           └── date-fns-render.js   # 日期處理
├── content/                  # 主題示例內容
├── data/                     # 主題數據文件
├── layouts/                  # 主題布局模板
│   ├── _default/            # 默認布局
│   │   ├── baseof.html      # 基礎模板
│   │   ├── list.html        # 列表頁模板
│   │   └── single.html      # 單頁模板
│   ├── partials/            # 部分模板
│   │   ├── head.html        # 頁面頭部
│   │   ├── header.html      # 網站標頭
│   │   ├── footer.html      # 網站頁尾
│   │   └── sidebar.html     # 側邊欄
│   ├── shortcodes/          # 短代碼模板
│   │   ├── mermaid.html     # Mermaid 圖表
│   │   └── post-date.html   # 文章日期
│   └── index.html           # 首頁模板
├── static/                   # 主題靜態文件
├── i18n/                     # 主題國際化文件
├── LICENSE                   # 主題授權文件
├── README.md                 # 主題說明文件
├── hugo.toml                 # 主題 Hugo 配置
└── theme.toml                # 主題元數據
```

## 內容架構

### 部落格內容結構

```text
content/blogs/
└── trick/                    # 技術文章分類
    └── 2025/                # 年份分組
        ├── 0614-ubuntu-ufw-config/
        │   ├── index.md     # 文章內容
        │   └── images/      # 文章圖片
        ├── 0702-claude-code-vs-github-copilot/
        │   ├── index.md
        │   └── images/
        └── 0702-gemini2.5-vs-claude4/
            ├── index.md
            └── images/
```

### Front Matter 架構

每篇文章都包含豐富的 Front Matter 元數據：

```yaml
---
type: blogs                   # 內容類型
title: "文章標題"             # 文章標題
description: "文章描述"       # SEO 描述
slug: "url-slug"             # URL 別名
date: 2025-07-02             # 發布日期
featured: "images/featured.jpg" # 特色圖片
draft: false                 # 草稿狀態
comment: true                # 評論功能
toc: true                    # 目錄功能
reward: true                 # 打賞功能
pinned: false                # 置頂狀態
carousel: true               # 輪播顯示
series:                      # 文章系列
  - AI開發工具
categories:                  # 分類
  - 程式設計
  - 技術指南
tags:                        # 標籤
  - GitHub Copilot
  - AI 工具
authors:                     # 作者
  - "Aaron Yu"
aliases:                     # URL 別名
  - "/blogs/trick/old-url/"
galleries:                   # 圖片集
  - image: "images/example.jpg"
    title: "圖片標題"
    description: "圖片描述"
---
```

## 數據架構

### 作者數據 (data/authors.toml)

```toml
[aaron-yu]
name = "Aaron Yu"
email = "aaron@makiot.com"
avatar = "/images/authors/aaron.jpg"
bio = "全端開發者，專注於 AI 工具與現代化 Web 技術"
social = [
  { name = "GitHub", url = "https://github.com/aaron" },
  { name = "Twitter", url = "https://twitter.com/aaron" }
]
```

### 輪播數據 (data/carousel.toml)

```toml
[[items]]
title = "文章標題"
description = "文章描述"
image = "/images/carousel/image1.jpg"
link = "/blogs/article-slug/"
```

## 配置系統架構

### 環境特定配置

Hugo 支援模組化配置和環境特定配置：

```text
config/
├── _default/              # 基礎配置 (所有環境)
│   ├── hugo.toml         # 主要配置
│   ├── build.toml        # 構建配置 (ESBuild, PostCSS, 緩存破壞者)
│   ├── caches.toml       # 緩存策略設定
│   ├── imaging.toml      # 圖片處理設定
│   ├── languages.toml    # 多語言配置
│   ├── markup.toml       # Markdown 渲染設定
│   ├── menus.toml        # 選單配置
│   ├── minify.toml       # 資源壓縮設定
│   ├── module.toml       # 模組和掛載配置
│   ├── outputFormats.toml # 輸出格式定義
│   ├── outputs.toml      # 頁面類型輸出配置
│   ├── params.toml       # 自定義參數
│   ├── permalinks.toml   # URL 結構設定
│   ├── privacy.toml      # 隱私設定
│   ├── related.toml      # 相關內容設定
│   ├── security.toml     # 安全策略設定
│   ├── server.toml       # 開發服務器設定
│   ├── services.toml     # 外部服務配置
│   ├── sitemap.toml      # 網站地圖設定
│   └── taxonomies.toml   # 分類法配置
├── development/           # 開發環境覆蓋
├── production/            # 生產環境覆蓋
└── staging/              # 預發布環境覆蓋
```

### 核心配置範例

**hugo.toml (主要設定):**

```toml
baseURL = 'https://example.org'
languageCode = 'zh-tw'
title = 'My Site'
theme = 'my-theme'

# 核心目錄設定
contentDir = 'content'
dataDir = 'data'
layoutDir = 'layouts'
publishDir = 'public'
staticDir = 'static'

# 構建設定
buildDrafts = false
buildExpired = false
buildFuture = false
enableGitInfo = true
enableRobotsTXT = true
environment = 'production'
```

**build.toml (構建和資源處理):**

```toml
# 構建統計 (用於 Tailwind CSS JIT)
[buildStats]
  enable = true
  disableClasses = false
  disableIDs = false
  disableTags = false

# 緩存破壞者 (監聽檔案變更)
[[cachebusters]]
  source = 'assets/.*\\.(js|ts|jsx|tsx)'
  target = 'js'

[[cachebusters]]
  source = '(postcss|tailwind)\\.config\\.js'
  target = 'css'
```

### Hugo 模組系統

**module.toml (模組和掛載配置):**

```toml
# Hugo 版本要求
[hugoVersion]
  min = "0.140.0"
  extended = false

# 導入外部模組/主題
[[imports]]
  path = "github.com/user/hugo-theme"
  disable = false

# 目錄掛載 (聯合文件系統)
[[mounts]]
  source = "assets"
  target = "assets"

[[mounts]]
  source = "static"
  target = "static"
```

本專案支援 Hugo 模組系統特性：

- 導入外部主題作為模組
- 掛載不同來源的目錄到虛擬文件系統
- 管理主題和插件依賴
- 支援主題組件和組合

### 開發環境流程

1. **Hugo 開發服務器** (`hugo server -D --watch`)
   - 監聽內容變更
   - 即時重建
   - 本地預覽 (localhost:1313)
   - ESBuild 自動處理 JavaScript
   - PostCSS 自動處理 CSS

### 生產構建流程

1. **Hugo 生產構建** (`hugo --environment=production`)
   - 靜態網站生成
   - ESBuild JavaScript 打包和最小化
   - PostCSS CSS 處理和最小化
   - 圖片優化處理
   - 模板渲染
   - 輸出到 `public/` 目錄

2. **Firebase 部署** (`firebase deploy`)
   - 上傳 `public/` 目錄
   - CDN 分發
   - 自定義域名

## 功能模組架構

### JavaScript 功能模組

- **主題切換**: 深色/淺色主題切換，狀態持久化
- **字體大小**: 動態調整文字大小
- **搜尋功能**: 基於 Fuse.js 的模糊搜尋
- **數學公式**: KaTeX 渲染支援
- **圖表渲染**: Mermaid 流程圖、時序圖等
- **日期處理**: date-fns 國際化日期格式

### CSS 架構

- **Tailwind CSS**: 原子化 CSS 框架
- **DaisyUI**: 預建 UI 組件
- **響應式設計**: 移動優先設計理念
- **主題系統**: 支援多主題切換

### Alpine.js 互動功能

- **狀態管理**: 使用 Alpine.js 管理前端狀態
- **插件支援**:
  - `@alpinejs/intersect`: 交集觀察器
  - `@alpinejs/persist`: 狀態持久化

## 部署架構

### Firebase Hosting

- **靜態文件託管**: 高性能 CDN
- **自動 SSL**: 自動 HTTPS 憑證
- **自定義域名**: 支援自定義域名
- **版本管理**: 部署版本控制

### 構建輸出

```text
public/                       # 最終部署目錄
├── index.html               # 首頁
├── blogs/                   # 部落格文章
├── categories/              # 分類頁面
├── tags/                    # 標籤頁面
├── authors/                 # 作者頁面
├── js/                      # Hugo ESBuild 處理的 JavaScript
│   ├── main.min.js         # 主要 JS 文件
│   └── app.min.js          # 應用 JS 文件
├── css/                     # Hugo PostCSS 處理的 CSS
│   └── app.min.css         # 打包後的 CSS
├── images/                  # 圖片資源
├── fonts/                   # 字體文件
├── sitemap.xml             # 網站地圖
├── robots.txt              # 搜索引擎指引
└── index.json              # 搜尋索引
```

## 性能優化架構

### 資源優化

- **代碼分割**: Hugo ESBuild 動態導入
- **圖片優化**: Hugo 內建圖片處理 (WebP, AVIF)
- **字體優化**: 字體子集化和預載
- **CSS 優化**: Tailwind CSS JIT 模式，未使用樣式自動移除
- **JavaScript 優化**: ESBuild 自動壓縮和最小化

### 緩存策略

- **靜態資源**: 長期緩存
- **HTML 文件**: 短期緩存
- **API 響應**: 適當緩存
- **圖片**: CDN 緩存

這個架構設計確保了專案的可維護性、擴展性和性能，同時提供了優秀的開發體驗。通過使用 Hugo 內建的 ESBuild 和 PostCSS 支援，我們簡化了構建流程，提升了構建速度，並減少了外部依賴的複雜性。

## Hugo 官方架構標準

本專案嚴格遵循 Hugo v0.147.9 官方架構標準，採用以下核心特性：

### 聯合文件系統 (Union File System)

- 支援多目錄掛載到相同位置
- 實現主題繼承和模組化
- 檔案優先級由掛載順序決定

### 資源處理管道 (Hugo Pipes)

- **ESBuild**: JavaScript/TypeScript 打包和最小化
- **PostCSS**: CSS 後處理和轉換
- **圖片處理**: 自動調整大小、格式轉換、質量優化
- **指紋識別**: 自動為靜態資源生成版本標識

### 輸出格式系統

- **HTML**: 標準網頁輸出
- **RSS**: 自動生成 RSS 訂閱源
- **JSON**: API 格式輸出
- **Sitemap**: 自動生成網站地圖
- **自定義格式**: 支援 manifest.json 等自定義輸出

### 配置系統

- **環境特定**: development、production、staging 環境配置
- **模組化配置**: 將配置分割為多個專用檔案
- **安全策略**: 內建安全設定和權限控制
- **緩存策略**: 智能緩存管理和性能優化

### 模組系統

- **Go Modules**: 基於 Go 模組系統
- **主題組件**: 支援多主題組合和繼承
- **外部依賴**: 可導入 GitHub 等外部模組
- **目錄掛載**: 靈活的目錄映射和覆蓋

## 相關文檔

- **[Hugo-Structure-Complete.md](./Hugo-Structure-Complete.md)**: Hugo 官方完整架構標準文檔
- **[Project-Config.md](./Project-Config.md)**: 專案配置詳細說明
- **[Build-Prompts.md](./Build-Prompts.md)**: 專案建構提示指南

## 參考資料

**Hugo 官方文檔:**

- [Hugo 官方文檔 - 目錄結構](https://gohugo.io/getting-started/directory-structure/)
- [Hugo 官方文檔 - 配置設定](https://gohugo.io/getting-started/configuration/)
- [Hugo 官方文檔 - 內容組織](https://gohugo.io/content-management/organization/)
- [Hugo 官方文檔 - 頁面包](https://gohugo.io/content-management/page-bundles/)
- [Hugo 官方文檔 - Front Matter](https://gohugo.io/content-management/front-matter/)
- [Hugo 官方文檔 - 模板系統](https://gohugo.io/templates/)
- [Hugo 官方文檔 - 資源處理](https://gohugo.io/hugo-pipes/)
- [Hugo 官方文檔 - 模組系統](https://gohugo.io/hugo-modules/)
- [Hugo 官方文檔 - 輸出格式](https://gohugo.io/configuration/output-formats/)
- [Hugo 官方文檔 - 構建配置](https://gohugo.io/configuration/build/)

**技術參考:**

- [Hugo Pipes 介紹](https://gohugo.io/hugo-pipes/introduction/)
- [Hugo 模組配置](https://gohugo.io/configuration/module/)
- [Hugo 主題組件](https://gohugo.io/hugo-modules/theme-components/)
- [Hugo 性能優化](https://gohugo.io/troubleshooting/performance/)

---

> 本文檔基於 Hugo v0.147.9 官方標準編寫，確保專案架構符合最新的 Hugo 最佳實踐和官方建議。建議定期查看 Hugo 官方文檔以獲取最新功能和架構更新。
