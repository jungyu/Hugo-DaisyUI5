# Hugo + TailwindCSS(DaisyUI) 專案完整建構指南 - 第二部分

> 繼續第一部分的建構流程，專注於 Hugo 配置系統、CSS/JS 整合與資源處理

本文檔涵蓋建構指南的第二部分 (階段 5-8)，包含 Hugo 深度配置、前端技術棧完整整合，以及 Hugo 內建資源處理管道的設置。

## 第二部分目錄 (階段 5-8)

1. [Hugo 配置系統 (twda_v5 主題)](#階段五hugo-配置系統-twda_v5-主題)
   - [基礎配置文件 (config/_default/)](#51-基礎配置文件-config_default)
   - [參數配置 (params.toml)](#52-參數配置-paramstoml)
   - [國際化配置 (i18n/)](#53-國際化配置-i18n)
2. [Tailwind CSS v4 + DaisyUI v5 整合](#階段六tailwind-css-v4--daisyui-v5-整合)
   - [進階 CSS 架構建立](#61-進階-css-架構建立)
3. [Alpine.js v3.14.9 功能模組](#階段七alpinejs-v3149-功能模組)
   - [核心 JavaScript 架構](#71-核心-javascript-架構)
   - [互動功能模組](#72-互動功能模組)
   - [狀態管理與持久化](#73-狀態管理與持久化)
4. [Hugo 資源處理 (ESBuild + PostCSS)](#階段八hugo-資源處理-esbuild--postcss)
   - [資源管道配置](#81-資源管道配置)
   - [JavaScript 處理流程](#82-javascript-處理流程)
   - [CSS 處理流程](#83-css-處理流程)

## 前置要求

請確保已完成第一部分 (階段 1-4)：

- ✅ 環境驗證與專案初始化
- ✅ twda_v5 主題架構建立
- ✅ 前端技術棧基礎配置
- ✅ 依賴安裝與基礎檔案建立

## 階段五：Hugo 配置系統 (twda_v5 主題)

### 5.1 基礎配置文件 (config/_default/)

**CLI 指令:**

```bash
# 創建主配置文件 (基於 Project-Config.md 規格)
cat > config/_default/config.toml << 'EOF'
baseURL = 'https://localhost:1313'
languageCode = 'zh-TW'
defaultContentLanguage = 'zh-tw'
title = '艾倫 R&D'
theme = 'twda_v5'

# Hugo 基本設定
configDir = "config"
contentDir = "content"
dataDir = "data"
layoutDir = "layouts"
publishDir = 'public'
staticDir = "static"

# 內容設定
paginate = 9
paginatePath = "page"
enableRobotsTXT = true
enableGitInfo = true
hasCJKLanguage = true

# 構建設定
buildDrafts = false
buildFuture = false
buildExpired = false

# 安全設定
disablePathToLower = false
removePathAccents = false

# 輸出格式
[outputs]
  home = ['HTML', 'RSS', 'JSON']
  page = ['HTML']
  section = ['HTML', 'RSS']
  taxonomy = ['HTML', 'RSS']
  term = ['HTML', 'RSS']

# 分類法 (符合專案規格)
[taxonomies]
  category = "categories"
  tag = "tags"
  series = "series"
  author = "authors"

# 永久鏈接 (符合專案規格: /blogs/:sections[1]/:year/:slug/)
[permalinks]
  blogs = "/blogs/:sections[1]/:year/:slug/"
  posts = "/blogs/:sections[1]/:year/:slug/"

# 分頁設定 (Hugo v0.128.0+ 新格式)
[pagination]
  pagerSize = 9
  path = "page"

# 相關內容
[related]
  threshold = 80
  includeNewer = true
  toLower = false
  [[related.indices]]
    name = "keywords"
    weight = 100
  [[related.indices]]
    name = "tags"
    weight = 80
  [[related.indices]]
    name = "categories"
    weight = 60
  [[related.indices]]
    name = "date"
    weight = 10

# 服務設定
[services]
  [services.googleAnalytics]
    ID = ""
  [services.disqus]
    shortname = ""

# 隱私設定
[privacy]
  [privacy.googleAnalytics]
    anonymizeIP = true
    respectDoNotTrack = true
    useSessionStorage = true
  [privacy.youtube]
    privacyEnhanced = true
EOF

# 創建 Hugo 資源處理配置
cat > config/_default/build.toml << 'EOF'
# Hugo v0.147.9 內建資源處理配置
# 整合 ESBuild (JavaScript) + PostCSS (CSS) + 圖片處理

[build]
  # 建構統計 (用於 Tailwind CSS JIT 模式)
  writeStats = true
  
  # 允許在 assets 中使用 JS 配置
  noJSConfigInAssets = false
  
  # 資源緩存策略
  useResourceCacheWhen = "fallback"

# JavaScript 資源緩存破壞者 (ESBuild)
[[build.cachebusters]]
  source = 'assets/.*\\.(js|ts|jsx|tsx)'
  target = 'js'

[[build.cachebusters]]
  source = 'themes/.*/assets/.*\\.(js|ts|jsx|tsx)'
  target = 'js'

# CSS 相關配置緩存破壞者 (PostCSS)
[[build.cachebusters]]
  source = '(postcss|tailwind)\\.config\\.(js|cjs|mjs)'
  target = 'css'

[[build.cachebusters]]
  source = 'assets/.*\\.(css|scss|sass)'
  target = 'css'

[[build.cachebusters]]
  source = 'themes/.*/assets/.*\\.(css|scss|sass)'
  target = 'css'

# 套件相關緩存破壞者
[[build.cachebusters]]
  source = 'package\\.json'
  target = 'js'

[[build.cachebusters]]
  source = 'yarn\\.lock'
  target = 'js'

# 圖片資源緩存破壞者
[[build.cachebusters]]
  source = 'assets/.*\\.(png|jpg|jpeg|gif|svg|webp|avif)'
  target = 'images'

# 數據檔案緩存破壞者
[[build.cachebusters]]
  source = 'data/.*\\.(json|toml|yaml|yml)'
  target = 'data'

# 內容檔案緩存破壞者
[[build.cachebusters]]
  source = 'content/.*\\.md'
  target = 'content'
EOF

# 創建輸出格式配置
cat > config/_default/outputFormats.toml << 'EOF'
# 自訂輸出格式
[outputFormats]

[outputFormats.RSS]
  mediaType = "application/rss+xml"
  baseName = "index"
  isPlainText = false
  rel = "alternate"
  isHTML = false
  noUgly = true
  permalinkable = false

[outputFormats.JSON]
  mediaType = "application/json"
  baseName = "index"
  isPlainText = true
  isHTML = false
  noUgly = true
  permalinkable = false

[outputFormats.SearchIndex]
  mediaType = "application/json"
  baseName = "search"
  isPlainText = true
  isHTML = false
  noUgly = true
  permalinkable = false
EOF

# 創建媒體類型配置
cat > config/_default/mediaTypes.toml << 'EOF'
# 自訂媒體類型
[mediaTypes]

[mediaTypes."application/manifest+json"]
  suffixes = ["webmanifest"]

[mediaTypes."text/netlify"]
  delimiter = ""
  suffixes = [""]
EOF
```

**AI Prompt:**

```text
請協助我配置 Hugo 基礎系統，需要符合以下專案規格：

基本設定：
- 網站標題: "艾倫 R&D"
- 語言: zh-TW (支援中文字符)
- 主題: twda_v5
- 時區: Asia/Taipei

內容配置：
- 分頁: 每頁 9 篇文章
- 分類法: categories, tags, series, authors
- 永久鏈接: /blogs/:sections[1]/:year/:slug/
- 相關內容推薦機制

輸出格式：
- HTML, RSS, JSON
- 搜尋索引 (SearchIndex)
- PWA 支援 (webmanifest)

資源處理：
- Hugo 內建 ESBuild + PostCSS
- 緩存破壞機制 (JavaScript, CSS, 圖片)
- 建構統計輸出

請說明每個配置的作用與最佳實踐。
```

### 5.2 參數配置 (params.toml)

**CLI 指令:**

```bash
# 創建參數配置 (符合專案所有功能需求)
cat > config/_default/params.toml << 'EOF'
# 網站基本資訊
description = '艾倫 R&D - 基於 Hugo + TailwindCSS v4.1.11 + DaisyUI v5.0.43 的現代化網站'
author = '艾倫'
subtitle = '技術研發與分享'
keywords = ['Hugo', 'TailwindCSS', 'DaisyUI', 'Alpine.js', '前端開發', '技術分享']
version = "5.0.0"

# 網站元數據
[site]
  logo = "/images/logo.svg"
  favicon = "/favicon.ico"
  appleTouchIcon = "/images/apple-touch-icon.png"

# DaisyUI 主題配置 (符合專案規格)
[theme]
  default = "dracula"
  light = "cmyk"
  dark = "dracula"
  enableToggle = true
  enableSystem = true
  storage = "localStorage"

# 搜尋功能 (Fuse.js 配置)
[search]
  enabled = true
  provider = "fuse"
  placeholder = "搜尋文章、分類、標籤..."
  maxResults = 10
  [search.fuse]
    threshold = 0.3
    distance = 100
    location = 0
    minMatchCharLength = 2
    keys = [
      { name = "title", weight = 2.0 },
      { name = "content", weight = 1.0 },
      { name = "tags", weight = 1.5 },
      { name = "categories", weight = 1.5 },
      { name = "description", weight = 1.2 }
    ]

# 數學公式 (KaTeX 配置)
[math]
  enabled = true
  provider = "katex"
  version = "0.16.20"
  [math.katex]
    inlineLeftDelimiter = "\\\\("
    inlineRightDelimiter = "\\\\)"
    blockLeftDelimiter = "$$"
    blockRightDelimiter = "$$"
    throwOnError = false
    errorColor = "#cc0000"
    strict = "warn"
    trust = false
    macros = {}

# 圖表功能 (Mermaid 配置)
[diagrams]
  enabled = true
  provider = "mermaid"
  version = "11.4.1"
  [diagrams.mermaid]
    theme = "default"
    darkTheme = "dark"
    fontFamily = "Inter, system-ui, sans-serif"
    [diagrams.mermaid.flowchart]
      useMaxWidth = true
      htmlLabels = true
    [diagrams.mermaid.sequence]
      useMaxWidth = true
      wrap = true
    [diagrams.mermaid.gantt]
      useMaxWidth = true

# Alpine.js 功能模組
[alpinejs]
  enabled = true
  version = "3.14.9"
  plugins = ["intersect", "persist"]
  [alpinejs.persist]
    storage = "localStorage"
    prefix = "alpine"

# 字體配置
[fonts]
  enableCustom = true
  sizeAdjustment = true
  [fonts.families]
    sans = ["Inter", "Noto Sans TC", "system-ui", "sans-serif"]
    mono = ["JetBrains Mono", "Cascadia Code", "Noto Sans Mono CJK TC", "monospace"]
  [fonts.sizes]
    small = "text-sm"
    medium = "text-base"
    large = "text-lg"
    xl = "text-xl"

# 社交連結 (使用物件格式，非陣列)
[social]
  github = "https://github.com/username"
  twitter = "https://twitter.com/username"
  linkedin = "https://linkedin.com/in/username"
  rss = "/index.xml"

# 啟用狀態
[social.enabled]
  github = true
  twitter = true
  linkedin = true
  rss = true

# SEO 設定
[seo]
  enableStructuredData = true
  enableOpenGraph = true
  enableTwitterCard = true
  twitterCardType = "summary_large_image"
  [seo.openGraph]
    siteName = "艾倫 R&D"
    type = "website"
    locale = "zh_TW"
  [seo.twitter]
    site = "@username"
    creator = "@username"

# 文章設定
[posts]
  showReadingTime = true
  showWordCount = true
  showTableOfContents = true
  showRelatedPosts = true
  relatedPostsCount = 3
  showBreadcrumb = true
  showPagination = true
  showShareButtons = true
  showLastModified = true
  showAuthors = true
  [posts.comments]
    enabled = false
    provider = "giscus"
  [posts.syntax]
    lineNumbers = true
    tabWidth = 2
    theme = "github"

# 頁面載入與效能
[performance]
  enableLazyLoading = true
  enableImageOptimization = true
  enableMinification = true
  enableCompression = true
  [performance.images]
    defaultFormat = "webp"
    quality = 85
    sizes = [480, 768, 1024, 1366, 1920]

# 分析功能 (預備整合)
[analytics]
  enabled = false
  provider = "google"
  id = ""

# PWA 支援
[pwa]
  enabled = true
  name = "艾倫 R&D"
  shortName = "AaronRD"
  description = "技術研發與分享平台"
  themeColor = "#1f2937"
  backgroundColor = "#ffffff"
  display = "standalone"
  orientation = "portrait"

# 開發設定
[development]
  showDrafts = true
  showFuture = false
  showExpired = false
  liveReload = true
  port = 1313
EOF

# 創建菜單配置
cat > config/_default/menus.toml << 'EOF'
# 主導航菜單
[[main]]
  name = "首頁"
  url = "/"
  weight = 10

[[main]]
  name = "文章"
  url = "/blogs/"
  weight = 20

[[main]]
  name = "分類"
  url = "/categories/"
  weight = 30

[[main]]
  name = "標籤"
  url = "/tags/"
  weight = 40

[[main]]
  name = "系列"
  url = "/series/"
  weight = 50

[[main]]
  name = "作者"
  url = "/authors/"
  weight = 60

[[main]]
  name = "關於"
  url = "/about/"
  weight = 70

# 頁尾菜單
[[footer]]
  name = "隱私政策"
  url = "/privacy/"
  weight = 10

[[footer]]
  name = "使用條款"
  url = "/terms/"
  weight = 20

[[footer]]
  name = "聯絡我們"
  url = "/contact/"
  weight = 30

[[footer]]
  name = "網站地圖"
  url = "/sitemap.xml"
  weight = 40

# 側邊欄菜單 (快速連結)
[[sidebar]]
  name = "最新文章"
  url = "/blogs/"
  weight = 10

[[sidebar]]
  name = "熱門標籤"
  url = "/tags/"
  weight = 20

[[sidebar]]
  name = "文章系列"
  url = "/series/"
  weight = 30
EOF
```

**AI Prompt:**

```text
請協助我創建完整的 Hugo 參數配置系統，需要符合以下規格：

核心功能配置：
- DaisyUI 主題系統: dracula (深色), cmyk (淺色)
- Fuse.js 搜尋引擎: 支援中文搜尋與權重配置
- KaTeX 數學公式: 完整渲染設定與錯誤處理
- Mermaid 圖表: 多主題支援與響應式設計
- Alpine.js 插件: intersect, persist 整合

進階功能：
- SEO 最佳化: OpenGraph, Twitter Cards, 結構化資料
- 字體系統: Inter + Noto Sans TC 中文支援
- 效能最佳化: 圖片處理、懶載入、壓縮
- PWA 支援: 離線可用、安裝提示

導航系統：
- 主導航: 首頁、文章、分類、標籤、系列、作者、關於
- 頁尾導航: 隱私政策、使用條款、聯絡我們、網站地圖
- 側邊欄: 最新文章、熱門標籤、文章系列

請說明參數模組化的優勢與維護策略。
```

### 5.3 國際化配置 (i18n/)

**CLI 指令:**

```bash
# 創建國際化目錄
mkdir -p i18n

# 創建繁體中文翻譯
cat > i18n/zh-tw.toml << 'EOF'
# 基本導航
[home]
other = "首頁"

[about]
other = "關於"

[contact]
other = "聯絡"

[blog]
other = "部落格"

[blogs]
other = "文章"

[posts]
other = "文章"

[categories]
other = "分類"

[tags]
other = "標籤"

[series]
other = "系列"

[authors]
other = "作者"

# 內容相關
[readMore]
other = "閱讀更多"

[readingTime]
one = "{{ .Count }} 分鐘"
other = "{{ .Count }} 分鐘"

[wordCount]
one = "{{ .Count }} 字"
other = "{{ .Count }} 字"

[publishDate]
other = "發布日期"

[lastModified]
other = "最後修改"

[author]
other = "作者"

[date]
other = "日期"

# 文章內容
[tableOfContents]
other = "目錄"

[relatedPosts]
other = "相關文章"

[recentPosts]
other = "最新文章"

[allPosts]
other = "所有文章"

[noContent]
other = "暫無內容"

[noResults]
other = "沒有找到結果"

# 分頁
[prevPage]
other = "上一頁"

[nextPage]
other = "下一頁"

[page]
other = "第 {{ .Current }} 頁，共 {{ .Total }} 頁"

# 搜尋
[search]
other = "搜尋"

[searchPlaceholder]
other = "搜尋文章、標籤、分類..."

[searchResults]
other = "搜尋結果"

[searchResultsCount]
one = "找到 {{ .Count }} 個結果"
other = "找到 {{ .Count }} 個結果"

# 分享
[share]
other = "分享"

[shareOn]
other = "分享到 {{ .Platform }}"

# 評論
[comments]
other = "評論"

[leaveComment]
other = "留言"

[showComments]
other = "顯示評論"

[hideComments]
other = "隱藏評論"

# 功能按鈕
[backToTop]
other = "回到頂部"

[toggleTheme]
other = "切換主題"

[toggleMenu]
other = "切換選單"

[toggleSearch]
other = "開啟搜尋"

[closeSearch]
other = "關閉搜尋"

# 表單
[name]
other = "姓名"

[email]
other = "電子郵件"

[message]
other = "訊息"

[send]
other = "發送"

[required]
other = "必填"

[optional]
other = "選填"

# 錯誤頁面
[404Title]
other = "頁面未找到"

[404Message]
other = "很抱歉，您請求的頁面不存在。"

[404BackHome]
other = "返回首頁"

# 頁尾
[copyright]
other = "版權所有"

[poweredBy]
other = "技術支援"

[allRightsReserved]
other = "保留所有權利"

# 時間格式
[timeFormat]
other = "2006年01月02日"

[timeFormatShort]
other = "01-02"

[timeFormatLong]
other = "2006年01月02日 15:04"

# 單位
[minute]
one = "分鐘"
other = "分鐘"

[hour]
one = "小時"
other = "小時"

[day]
one = "天"
other = "天"

[week]
one = "週"
other = "週"

[month]
one = "月"
other = "月"

[year]
one = "年"
other = "年"

# 狀態
[draft]
other = "草稿"

[published]
other = "已發布"

[featured]
other = "精選"

[pinned]
other = "置頂"

[archived]
other = "已封存"

# 載入狀態
[loading]
other = "載入中..."

[loadMore]
other = "載入更多"

[noMoreContent]
other = "沒有更多內容"

# 通知
[success]
other = "成功"

[error]
other = "錯誤"

[warning]
other = "警告"

[info]
other = "資訊"
EOF

# 創建英文翻譯
cat > i18n/en.toml << 'EOF'
# Basic navigation
[home]
other = "Home"

[about]
other = "About"

[contact]
other = "Contact"

[blog]
other = "Blog"

[blogs]
other = "Articles"

[posts]
other = "Posts"

[categories]
other = "Categories"

[tags]
other = "Tags"

[series]
other = "Series"

[authors]
other = "Authors"

# Content related
[readMore]
other = "Read More"

[readingTime]
one = "{{ .Count }} minute"
other = "{{ .Count }} minutes"

[wordCount]
one = "{{ .Count }} word"
other = "{{ .Count }} words"

[publishDate]
other = "Published"

[lastModified]
other = "Last Modified"

[author]
other = "Author"

[date]
other = "Date"

# Article content
[tableOfContents]
other = "Table of Contents"

[relatedPosts]
other = "Related Posts"

[recentPosts]
other = "Recent Posts"

[allPosts]
other = "All Posts"

[noContent]
other = "No content available"

[noResults]
other = "No results found"

# Pagination
[prevPage]
other = "Previous"

[nextPage]
other = "Next"

[page]
other = "Page {{ .Current }} of {{ .Total }}"

# Search
[search]
other = "Search"

[searchPlaceholder]
other = "Search articles, tags, categories..."

[searchResults]
other = "Search Results"

[searchResultsCount]
one = "{{ .Count }} result found"
other = "{{ .Count }} results found"

# Share
[share]
other = "Share"

[shareOn]
other = "Share on {{ .Platform }}"

# Comments
[comments]
other = "Comments"

[leaveComment]
other = "Leave a Comment"

[showComments]
other = "Show Comments"

[hideComments]
other = "Hide Comments"

# Function buttons
[backToTop]
other = "Back to Top"

[toggleTheme]
other = "Toggle Theme"

[toggleMenu]
other = "Toggle Menu"

[toggleSearch]
other = "Open Search"

[closeSearch]
other = "Close Search"

# Forms
[name]
other = "Name"

[email]
other = "Email"

[message]
other = "Message"

[send]
other = "Send"

[required]
other = "Required"

[optional]
other = "Optional"

# Error pages
[404Title]
other = "Page Not Found"

[404Message]
other = "Sorry, the page you requested does not exist."

[404BackHome]
other = "Back to Home"

# Footer
[copyright]
other = "Copyright"

[poweredBy]
other = "Powered by"

[allRightsReserved]
other = "All rights reserved"

# Time formats
[timeFormat]
other = "January 2, 2006"

[timeFormatShort]
other = "01-02"

[timeFormatLong]
other = "January 2, 2006 15:04"

# Units
[minute]
one = "minute"
other = "minutes"

[hour]
one = "hour"
other = "hours"

[day]
one = "day"
other = "days"

[week]
one = "week"
other = "weeks"

[month]
one = "month"
other = "months"

[year]
one = "year"
other = "years"

# Status
[draft]
other = "Draft"

[published]
other = "Published"

[featured]
other = "Featured"

[pinned]
other = "Pinned"

[archived]
other = "Archived"

# Loading states
[loading]
other = "Loading..."

[loadMore]
other = "Load More"

[noMoreContent]
other = "No more content"

# Notifications
[success]
other = "Success"

[error]
other = "Error"

[warning]
other = "Warning"

[info]
other = "Information"
EOF
```

**AI Prompt:**

```text
請協助我建立完整的國際化系統，需要：

語言支援：
- 繁體中文 (zh-tw.toml) - 主要語言
- 英文 (en.toml) - 備用語言

翻譯涵蓋範圍：
- 基本導航: 首頁、關於、聯絡、文章等
- 內容相關: 閱讀時間、字數統計、發布日期
- 文章功能: 目錄、相關文章、分享、評論
- 搜尋系統: 搜尋、結果顯示、無結果提示
- 分頁導航: 上下頁、頁碼顯示
- 表單元素: 名稱、郵件、訊息、必填提示
- 錯誤頁面: 404 頁面完整提示
- 狀態顯示: 草稿、已發布、精選、置頂
- 時間格式: 多種日期時間顯示格式

特色功能：
- 單複數支援 (one/other)
- 變數插入 ({{ .Count }}, {{ .Platform }})
- 中文語境最佳化
- 無障礙友善術語

請說明國際化最佳實踐與維護策略。
```

## 階段六：Tailwind CSS v4 + DaisyUI v5 整合

### 6.1 進階 CSS 架構建立

**重要提醒：避免常見配置錯誤**

> ⚠️ **關鍵修正點**：
> 1. 檔案命名：使用 `app.css` 而非 `main.css`
> 2. DaisyUI 導入：必須使用 `@import "daisyui/daisyui.css"`
> 3. 避免 `@apply` 語法：在 TailwindCSS v4 中可能有相容性問題
> 4. Hugo 模板：確保 `baseof.html` 引用正確的 CSS 檔案路徑

**CLI 指令:**

```bash
# 1. 首先創建正確的 CSS 檔案結構
cat > assets/css/app.css << 'EOF'
/* TailwindCSS v4 + DaisyUI v5 正確整合 */
@import "tailwindcss";
@import "daisyui/daisyui.css";

/* 自定義樣式 - 避免使用 @apply 語法 */
:root {
  --primary-color: #3b82f6;
  --secondary-color: #64748b;
}

body {
  font-family: 'Inter', 'Noto Sans TC', -apple-system, BlinkMacSystemFont, sans-serif;
  line-height: 1.6;
}

/* 響應式圖片 */
img {
  max-width: 100%;
  height: auto;
}

/* 程式碼區塊樣式 - 使用標準 CSS */
pre {
  background-color: oklch(var(--b2));
  padding: 1rem;
  border-radius: 0.5rem;
  overflow-x: auto;
  border: 1px solid oklch(var(--bc)/0.1);
}

code {
  background-color: oklch(var(--b2));
  padding: 0.125rem 0.25rem;
  border-radius: 0.25rem;
  font-size: 0.875rem;
}

/* 表格樣式 */
table {
  max-width: none;
}

/* 404 頁面樣式 */
.error-404 {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 內容寬度限制 */
.prose {
  max-width: 65ch;
}

/* 動畫效果 */
.fade-in {
  animation: fadeIn 0.5s ease-in;
}

@keyframes fadeIn {
  from { 
    opacity: 0; 
    transform: translateY(20px); 
  }
  to { 
    opacity: 1; 
    transform: translateY(0); 
  }
}
EOF

# 2. 確保主題佈局檔案使用正確的 CSS 路徑
cat > themes/twda_v5/layouts/_default/baseof.html << 'EOF'
<!DOCTYPE html>
<html lang="{{ .Site.Language.Lang | default "zh-tw" }}" data-theme="{{ .Site.Params.theme.default | default "dracula" }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>{{ if .Title }}{{ .Title }} | {{ end }}{{ .Site.Title }}</title>
    <meta name="description" content="{{ if .Description }}{{ .Description }}{{ else }}{{ .Site.Params.description }}{{ end }}">
    
    <!-- ⚠️ 重要：使用 Hugo v0.128.0+ 新的 CSS 處理 API -->
    {{ $css := resources.Get "css/app.css" | css.PostCSS | resources.Minify }}
    <link rel="stylesheet" href="{{ $css.RelPermalink }}">
    
    <!-- Google Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    
    <!-- 數學公式支援 (KaTeX) -->
    {{ if .Site.Params.math.enabled }}
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@{{ .Site.Params.math.version | default "0.16.20" }}/dist/katex.min.css">
    <script defer src="https://cdn.jsdelivr.net/npm/katex@{{ .Site.Params.math.version | default "0.16.20" }}/dist/katex.min.js"></script>
    <script defer src="https://cdn.jsdelivr.net/npm/katex@{{ .Site.Params.math.version | default "0.16.20" }}/dist/contrib/auto-render.min.js"></script>
    {{ end }}
    
    <!-- Alpine.js - 使用 CDN 避免 ES6 模組問題 -->
    <script defer src="https://cdn.jsdelivr.net/npm/@alpinejs/persist@3.14.9/dist/cdn.min.js"></script>
    <script defer src="https://cdn.jsdelivr.net/npm/@alpinejs/intersect@3.14.9/dist/cdn.min.js"></script>
    <script defer src="https://cdn.jsdelivr.net/npm/alpinejs@3.14.9/dist/cdn.min.js"></script>
    
    <!-- Fuse.js for search -->
    <script src="https://cdn.jsdelivr.net/npm/fuse.js@7.0.0/dist/fuse.min.js"></script>
</head>
<body class="font-sans">
    {{ partial "header.html" . }}
    
    <main>
        {{ block "main" . }}{{ end }}
    </main>
    
    {{ partial "footer.html" . }}
    
    <!-- 本地 JavaScript 資源 -->
    {{ $alpine := resources.Get "js/alpine.js" }}
    {{ $components := resources.Get "js/components.js" }}
    {{ $main := resources.Get "js/main.js" }}
    {{ $js := slice $alpine $components $main | resources.Concat "js/bundle.js" | resources.Minify }}
    <script src="{{ $js.RelPermalink }}"></script>
    
    <!-- 數學公式渲染 -->
    {{ if .Site.Params.math.enabled }}
    <script>
        document.addEventListener("DOMContentLoaded", function() {
            renderMathInElement(document.body, {
                delimiters: [
                    {left: "$$", right: "$$", display: true},
                    {left: "\\\\(", right: "\\\\)", display: false}
                ]
            });
        });
    </script>
    {{ end }}
</body>
</html>
EOF

# 3. 更新 package.json 避免版本衝突
cat > package.json << 'EOF'
{
  "name": "hugo-daisyui5",
  "version": "5.0.0",
  "description": "Hugo site with TailwindCSS v4.1.11 + DaisyUI v5.0.43",
  "main": "index.js",
  "scripts": {
    "dev": "hugo server --bind 0.0.0.0 --port 1313 --disableFastRender --navigateToChanged",
    "start": "npm run dev",
    "build": "hugo --gc --minify",
    "build:preview": "hugo --gc --minify --baseURL /",
    "clean": "rm -rf public resources",
    "lint:css": "npx postcss assets/css/app.css --output /dev/null",
    "validate": "npm run lint:css && hugo --gc --minify"
  },
  "dependencies": {},
  "devDependencies": {
    "@tailwindcss/postcss": "^4.1.11",
    "@tailwindcss/typography": "^0.5.16",
    "autoprefixer": "^10.4.20",
    "daisyui": "^5.0.43",
    "postcss": "^8.4.49",
    "postcss-cli": "^11.0.0",
    "tailwindcss": "^4.1.11"
  },
  "keywords": [
    "hugo",
    "tailwindcss",
    "daisyui",
    "alpine.js",
    "frontend"
  ],
  "author": "Aaron",
  "license": "MIT"
}
EOF

```bash
# 更新 Tailwind 配置以支援完整功能
cat > tailwind.config.js << 'EOF'
/** @type {import('tailwindcss').Config} */
module.exports = {
  mode: "jit",
  content: [
    "./content/**/*.{html,js,md}",
    "./layouts/**/*.html",
    "./themes/twda_v5/layouts/**/*.html",
    "./themes/twda_v5/assets/**/*.{js,ts}",
    "./assets/**/*.{js,ts}",
    "./data/**/*.{json,toml,yaml,yml}",
    "./i18n/**/*.toml",
    "./themes/twda_v5/data/**/*.{json,toml,yaml,yml}",
    "./themes/twda_v5/i18n/**/*.toml"
  ],
  darkMode: ['class', '[data-theme="dracula"]'],
  theme: {
    extend: {
      fontFamily: {
        'sans': ['Inter', 'Noto Sans TC', '-apple-system', 'BlinkMacSystemFont', 'system-ui', 'sans-serif'],
        'mono': ['JetBrains Mono', 'Cascadia Code', 'Fira Code', 'Noto Sans Mono CJK TC', 'Monaco', 'Consolas', 'monospace'],
        'serif': ['Noto Serif TC', 'Georgia', 'Times', 'serif']
      },
      colors: {
        'custom': {
          50: '#f8fafc',
          500: '#64748b',
          900: '#0f172a'
        }
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem'
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'fade-out': 'fadeOut 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'slide-left': 'slideLeft 0.3s ease-out',
        'slide-right': 'slideRight 0.3s ease-out',
        'bounce-subtle': 'bounceSubtle 2s infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 3s linear infinite'
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        fadeOut: {
          '0%': { opacity: '1', transform: 'translateY(0)' },
          '100%': { opacity: '0', transform: 'translateY(-10px)' }
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' }
        },
        slideDown: {
          '0%': { transform: 'translateY(-20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' }
        },
        slideLeft: {
          '0%': { transform: 'translateX(20px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' }
        },
        slideRight: {
          '0%': { transform: 'translateX(-20px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' }
        },
        bounceSubtle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' }
        }
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: 'none',
            lineHeight: '1.75',
            // DaisyUI 變數整合
            color: 'var(--fallback-bc,oklch(var(--bc)/1))',
            '[class~="lead"]': {
              color: 'var(--fallback-bc,oklch(var(--bc)/0.8))'
            },
            a: {
              color: 'var(--fallback-p,oklch(var(--p)/1))',
              textDecoration: 'none',
              borderBottom: '1px solid transparent',
              transition: 'all 0.2s ease',
              '&:hover': {
                color: 'var(--fallback-pf,oklch(var(--pf)/1))',
                borderBottomColor: 'var(--fallback-p,oklch(var(--p)/0.5))'
              }
            },
            strong: {
              color: 'var(--fallback-bc,oklch(var(--bc)/1))',
              fontWeight: '600'
            },
            'ol[type="A"]': {
              '--list-counter-style': 'upper-alpha'
            },
            'ol[type="a"]': {
              '--list-counter-style': 'lower-alpha'
            },
            'ol[type="A" s]': {
              '--list-counter-style': 'upper-alpha'
            },
            'ol[type="a" s]': {
              '--list-counter-style': 'lower-alpha'
            },
            'ol[type="I"]': {
              '--list-counter-style': 'upper-roman'
            },
            'ol[type="i"]': {
              '--list-counter-style': 'lower-roman'
            },
            'ol[type="I" s]': {
              '--list-counter-style': 'upper-roman'
            },
            'ol[type="i" s]': {
              '--list-counter-style': 'lower-roman'
            },
            'ol[type="1"]': {
              '--list-counter-style': 'decimal'
            },
            'ol > li': {
              position: 'relative'
            },
            'ol > li::marker': {
              fontWeight: '400',
              color: 'var(--fallback-bc,oklch(var(--bc)/0.5))'
            },
            'ul > li': {
              position: 'relative'
            },
            'ul > li::marker': {
              color: 'var(--fallback-bc,oklch(var(--bc)/0.5))'
            },
            hr: {
              borderColor: 'var(--fallback-bc,oklch(var(--bc)/0.2))',
              borderTopWidth: 1,
              marginTop: '3em',
              marginBottom: '3em'
            },
            blockquote: {
              fontWeight: '500',
              fontStyle: 'italic',
              color: 'var(--fallback-bc,oklch(var(--bc)/1))',
              borderLeftWidth: '0.25rem',
              borderLeftColor: 'var(--fallback-p,oklch(var(--p)/1))',
              quotes: '"\\201C""\\201D""\\2018""\\2019"',
              marginTop: '1.6em',
              marginBottom: '1.6em',
              paddingLeft: '1em',
              backgroundColor: 'var(--fallback-b2,oklch(var(--b2)/0.5))',
              borderRadius: '0.5rem',
              padding: '1rem'
            },
            h1: {
              color: 'var(--fallback-bc,oklch(var(--bc)/1))',
              fontWeight: '800',
              fontSize: '2.25em',
              marginTop: '0',
              marginBottom: '0.8888889em',
              lineHeight: '1.1111111'
            },
            h2: {
              color: 'var(--fallback-bc,oklch(var(--bc)/1))',
              fontWeight: '700',
              fontSize: '1.5em',
              marginTop: '2em',
              marginBottom: '1em',
              lineHeight: '1.3333333'
            },
            h3: {
              color: 'var(--fallback-bc,oklch(var(--bc)/1))',
              fontWeight: '600',
              fontSize: '1.25em',
              marginTop: '1.6em',
              marginBottom: '0.6em',
              lineHeight: '1.6'
            },
            h4: {
              color: 'var(--fallback-bc,oklch(var(--bc)/1))',
              fontWeight: '600',
              marginTop: '1.5em',
              marginBottom: '0.5em',
              lineHeight: '1.5'
            },
            'figure figcaption': {
              color: 'var(--fallback-bc,oklch(var(--bc)/0.6))',
              fontSize: '0.875em',
              lineHeight: '1.4285714',
              marginTop: '0.8571429em'
            },
            code: {
              color: 'var(--fallback-bc,oklch(var(--bc)/1))',
              fontWeight: '600',
              fontSize: '0.875em',
              backgroundColor: 'var(--fallback-b2,oklch(var(--b2)/1))',
              paddingLeft: '0.25rem',
              paddingRight: '0.25rem',
              paddingTop: '0.125rem',
              paddingBottom: '0.125rem',
              borderRadius: '0.25rem'
            },
            'code::before': {
              content: 'none'
            },
            'code::after': {
              content: 'none'
            },
            pre: {
              color: 'var(--fallback-bc,oklch(var(--bc)/1))',
              backgroundColor: 'var(--fallback-b2,oklch(var(--b2)/1))',
              overflowX: 'auto',
              fontWeight: '400',
              fontSize: '0.875em',
              lineHeight: '1.7142857',
              marginTop: '1.7142857em',
              marginBottom: '1.7142857em',
              borderRadius: '0.375rem',
              paddingTop: '0.8571429em',
              paddingRight: '1.1428571em',
              paddingBottom: '0.8571429em',
              paddingLeft: '1.1428571em',
              border: '1px solid var(--fallback-bc,oklch(var(--bc)/0.1))'
            },
            'pre code': {
              backgroundColor: 'transparent',
              borderWidth: '0',
              borderRadius: '0',
              padding: '0',
              fontWeight: 'inherit',
              color: 'inherit',
              fontSize: 'inherit',
              fontFamily: 'inherit',
              lineHeight: 'inherit'
            },
            table: {
              width: '100%',
              tableLayout: 'auto',
              textAlign: 'left',
              marginTop: '2em',
              marginBottom: '2em',
              fontSize: '0.875em',
              lineHeight: '1.7142857'
            },
            thead: {
              borderBottomWidth: '1px',
              borderBottomColor: 'var(--fallback-bc,oklch(var(--bc)/0.3))'
            },
            'thead th': {
              color: 'var(--fallback-bc,oklch(var(--bc)/1))',
              fontWeight: '600',
              verticalAlign: 'bottom',
              paddingRight: '0.5714286em',
              paddingBottom: '0.5714286em',
              paddingLeft: '0.5714286em'
            },
            'tbody tr': {
              borderBottomWidth: '1px',
              borderBottomColor: 'var(--fallback-bc,oklch(var(--bc)/0.1))'
            },
            'tbody tr:last-child': {
              borderBottomWidth: '0'
            },
            'tbody td': {
              verticalAlign: 'baseline',
              paddingTop: '0.5714286em',
              paddingRight: '0.5714286em',
              paddingBottom: '0.5714286em',
              paddingLeft: '0.5714286em'
            },
            'tbody td, thead th': {
              textAlign: 'left'
            }
          }
        },
        lg: {
          css: {
            fontSize: '1.125em',
            lineHeight: '1.7777778',
            h1: {
              fontSize: '2.6666667em',
              marginTop: '0',
              marginBottom: '0.8333333em',
              lineHeight: '1'
            },
            h2: {
              fontSize: '1.6666667em',
              marginTop: '1.8666667em',
              marginBottom: '1.0666667em',
              lineHeight: '1.3333333'
            },
            h3: {
              fontSize: '1.3333333em',
              marginTop: '1.6666667em',
              marginBottom: '0.6666667em',
              lineHeight: '1.5'
            }
          }
        }
      },
      screens: {
        'xs': '475px'
      }
    }
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('daisyui')
  ],
  daisyui: {
    themes: [
      {
        dracula: {
          "primary": "#ff79c6",
          "primary-focus": "#ff65c1",
          "primary-content": "#000000",
          "secondary": "#bd93f9",
          "secondary-focus": "#b085f5",
          "secondary-content": "#000000",
          "accent": "#ffb86c",
          "accent-focus": "#ffa96b",
          "accent-content": "#000000",
          "neutral": "#414558",
          "neutral-focus": "#343749",
          "neutral-content": "#ffffff",
          "base-100": "#282a36",
          "base-200": "#1e1f29",
          "base-300": "#15161e",
          "base-content": "#f8f8f2",
          "info": "#8be9fd",
          "success": "#50fa7b",
          "warning": "#f1fa8c",
          "error": "#ff5555"
        }
      },
      {
        cmyk: {
          "primary": "#0891b2",
          "primary-focus": "#0e7490",
          "primary-content": "#ffffff",
          "secondary": "#7c3aed",
          "secondary-focus": "#6d28d9",
          "secondary-content": "#ffffff",
          "accent": "#f59e0b",
          "accent-focus": "#d97706",
          "accent-content": "#000000",
          "neutral": "#374151",
          "neutral-focus": "#1f2937",
          "neutral-content": "#f9fafb",
          "base-100": "#ffffff",
          "base-200": "#f9fafb",
          "base-300": "#f3f4f6",
          "base-content": "#1f2937",
          "info": "#3b82f6",
          "success": "#10b981",
          "warning": "#f59e0b",
          "error": "#ef4444"
        }
      }
    ],
    darkTheme: "dracula",
    base: true,
    styled: true,
    utils: true,
    prefix: '',
    logs: true,
    themeRoot: ':root'
  }
}
EOF
```

**AI Prompt:**

```text
請協助我建立進階的 TailwindCSS + DaisyUI 整合系統，需要：

進階 Tailwind 配置：
- 完整字體系統: Inter + Noto Sans TC (中文) + JetBrains Mono
- 自訂顏色擴展與間距
- 豐富動畫系統: fade, slide, bounce, pulse, spin
- 響應式斷點擴展 (xs: 475px)

Typography 深度整合：
- DaisyUI CSS 變數完整支援
- 中文排版最佳化 (行高、字間距)
- 程式碼區塊美化
- 表格與引用樣式
- 深色模式完整支援

自訂 DaisyUI 主題：
- dracula: 完整深色主題色彩定義
- cmyk: 專業淺色主題色彩定義
- 語意化顏色系統 (primary, secondary, accent, neutral, base)
- 狀態顏色 (info, success, warning, error)

請說明主題設計原則與色彩無障礙最佳實踐。
```

---

## 下一步

完成第二部分的前半段後，請繼續：

- 階段七：Alpine.js v3.14.9 功能模組完整實作
- 階段八：Hugo 資源處理 (ESBuild + PostCSS) 進階配置

然後進入：

- **[Build-Prompts-3.md](./Build-Prompts-3.md)** - 階段 9-12 (內容組織、功能擴展、測試優化、部署)

## 小結

第二部分前半段完成了：

1. ✅ **Hugo 配置系統**: 完整的 config/_default/ 模組化配置
2. ✅ **參數系統**: 功能豐富的 params.toml 設定
3. ✅ **國際化**: 中英文完整翻譯系統
4. ✅ **進階 CSS**: TailwindCSS + DaisyUI 深度整合
5. ✅ **Alpine.js 功能模組**: 完整的前端互動系統
6. ✅ **Hugo 資源處理**: PostCSS + ESBuild 整合

## 疑難排解

### Hugo v0.128.0+ 相容性問題

#### 1. 分頁配置更新

**問題**: `paginate` 和 `paginatePath` 參數已被棄用  
**解決方案**: 使用新的 `[pagination]` 段落格式

```toml
# 舊格式 (已棄用)
paginate = 9
paginatePath = "page"

# 新格式 (v0.128.0+)
[pagination]
  pagerSize = 9
  path = "page"
```

#### 2. 資源處理 API 更新

**問題**: `resources.PostCSS` 已被移除  
**解決方案**: 使用新的 `css.PostCSS` API

```html
<!-- 舊格式 (已移除) -->
{{ $css := resources.Get "css/main.css" | resources.PostCSS | resources.Minify }}

<!-- 新格式 (v0.128.0+) -->
{{ $css := resources.Get "css/app.css" | css.PostCSS | resources.Minify }}
```

### 社交媒體配置問題

#### 3. 模板與配置格式不符

**問題**: footer.html 期待 `.Site.Params.social.twitter` 但配置使用陣列格式  
**解決方案**: 統一使用物件格式

```toml
# 正確格式
[social]
  github = "https://github.com/username"
  twitter = "https://twitter.com/username"
  linkedin = "https://linkedin.com/in/username"
  rss = "/index.xml"
```

### PostCSS 依賴問題

#### 4. 套件版本衝突

**問題**: PostCSS 版本衝突導致安裝失敗  
**解決方案**:

1. 修正 package.json 版本號
2. 使用 `--legacy-peer-deps` 安裝

```bash
npm install --legacy-peer-deps
```

### CSS 檔案路徑與載入問題

#### 5. CSS 檔案命名與路徑錯誤

**問題**: Hugo 無法找到 CSS 檔案或樣式未載入  
**根本原因**: 
- `baseof.html` 引用 `css/main.css` 但實際檔案是 `css/app.css`
- DaisyUI 樣式未正確導入

**完整解決方案**:

```bash
# 1. 確保 CSS 檔案命名正確
# 檔案應該是: assets/css/app.css

# 2. 檢查 app.css 內容
cat > assets/css/app.css << 'EOF'
/* TailwindCSS v4 + DaisyUI v5 正確整合 */
@import "tailwindcss";
@import "daisyui/daisyui.css";

/* 自定義樣式 - 避免使用 @apply 語法 */
:root {
  --primary-color: #3b82f6;
  --secondary-color: #64748b;
}

body {
  font-family: 'Inter', 'Noto Sans TC', -apple-system, BlinkMacSystemFont, sans-serif;
  line-height: 1.6;
}

/* 響應式圖片 */
img {
  max-width: 100%;
  height: auto;
}

/* 程式碼區塊樣式 - 使用標準 CSS */
pre {
  background-color: oklch(var(--b2));
  padding: 1rem;
  border-radius: 0.5rem;
  overflow-x: auto;
  border: 1px solid oklch(var(--bc)/0.1);
}

code {
  background-color: oklch(var(--b2));
  padding: 0.125rem 0.25rem;
  border-radius: 0.25rem;
  font-size: 0.875rem;
}

/* 表格樣式 */
table {
  max-width: none;
}

/* 404 頁面樣式 */
.error-404 {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 內容寬度限制 */
.prose {
  max-width: 65ch;
}

/* 動畫效果 */
.fade-in {
  animation: fadeIn 0.5s ease-in;
}

@keyframes fadeIn {
  from { 
    opacity: 0; 
    transform: translateY(20px); 
  }
  to { 
    opacity: 1; 
    transform: translateY(0); 
  }
}
EOF

# 2. 確保 baseof.html 引用正確路徑
# 在 themes/twda_v5/layouts/_default/baseof.html 中:
# {{ $css := resources.Get "css/app.css" | css.PostCSS | resources.Minify }}
# <link rel="stylesheet" href="{{ $css.RelPermalink }}">

# 3. 更新 package.json 避免版本衝突
cat > package.json << 'EOF'
{
  "name": "hugo-daisyui5",
  "version": "5.0.0",
  "description": "Hugo site with TailwindCSS v4.1.11 + DaisyUI v5.0.43",
  "main": "index.js",
  "scripts": {
    "dev": "hugo server --bind 0.0.0.0 --port 1313 --disableFastRender --navigateToChanged",
    "start": "npm run dev",
    "build": "hugo --gc --minify",
    "build:preview": "hugo --gc --minify --baseURL /",
    "clean": "rm -rf public resources",
    "lint:css": "npx postcss assets/css/app.css --output /dev/null",
    "validate": "npm run lint:css && hugo --gc --minify"
  },
  "dependencies": {},
  "devDependencies": {
    "@tailwindcss/postcss": "^4.1.11",
    "@tailwindcss/typography": "^0.5.16",
    "autoprefixer": "^10.4.20",
    "daisyui": "^5.0.43",
    "postcss": "^8.4.49",
    "postcss-cli": "^11.0.0",
    "tailwindcss": "^4.1.11"
  },
  "keywords": [
    "hugo",
    "tailwindcss",
    "daisyui",
    "alpine.js",
    "frontend"
  ],
  "author": "Aaron",
  "license": "MIT"
}
EOF

# 更新 Tailwind 配置以支援完整功能
cat > tailwind.config.js << 'EOF'
/** @type {import('tailwindcss').Config} */
module.exports = {
  mode: "jit",
  content: [
    "./content/**/*.{html,js,md}",
    "./layouts/**/*.html",
    "./themes/twda_v5/layouts/**/*.html",
    "./themes/twda_v5/assets/**/*.{js,ts}",
    "./assets/**/*.{js,ts}",
    "./data/**/*.{json,toml,yaml,yml}",
    "./i18n/**/*.toml",
    "./themes/twda_v5/data/**/*.{json,toml,yaml,yml}",
    "./themes/twda_v5/i18n/**/*.toml"
  ],
  darkMode: ['class', '[data-theme="dracula"]'],
  theme: {
    extend: {
      fontFamily: {
        'sans': ['Inter', 'Noto Sans TC', '-apple-system', 'BlinkMacSystemFont', 'system-ui', 'sans-serif'],
        'mono': ['JetBrains Mono', 'Cascadia Code', 'Fira Code', 'Noto Sans Mono CJK TC', 'Monaco', 'Consolas', 'monospace'],
        'serif': ['Noto Serif TC', 'Georgia', 'Times', 'serif']
      },
      colors: {
        'custom': {
          50: '#f8fafc',
          500: '#64748b',
          900: '#0f172a'
        }
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem'
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'fade-out': 'fadeOut 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'slide-left': 'slideLeft 0.3s ease-out',
        'slide-right': 'slideRight 0.3s ease-out',
        'bounce-subtle': 'bounceSubtle 2s infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 3s linear infinite'
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        fadeOut: {
          '0%': { opacity: '1', transform: 'translateY(0)' },
          '100%': { opacity: '0', transform: 'translateY(-10px)' }
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' }
        },
        slideDown: {
          '0%': { transform: 'translateY(-20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' }
        },
        slideLeft: {
          '0%': { transform: 'translateX(20px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' }
        },
        slideRight: {
          '0%': { transform: 'translateX(-20px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' }
        },
        bounceSubtle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' }
        }
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: 'none',
            lineHeight: '1.75',
            // DaisyUI 變數整合
            color: 'var(--fallback-bc,oklch(var(--bc)/1))',
            '[class~="lead"]': {
              color: 'var(--fallback-bc,oklch(var(--bc)/0.8))'
            },
            a: {
              color: 'var(--fallback-p,oklch(var(--p)/1))',
              textDecoration: 'none',
              borderBottom: '1px solid transparent',
              transition: 'all 0.2s ease',
              '&:hover': {
                color: 'var(--fallback-pf,oklch(var(--pf)/1))',
                borderBottomColor: 'var(--fallback-p,oklch(var(--p)/0.5))'
              }
            },
            strong: {
              color: 'var(--fallback-bc,oklch(var(--bc)/1))',
              fontWeight: '600'
            },
            'ol[type="A"]': {
              '--list-counter-style': 'upper-alpha'
            },
            'ol[type="a"]': {
              '--list-counter-style': 'lower-alpha'
            },
            'ol[type="A" s]': {
              '--list-counter-style': 'upper-alpha'
            },
            'ol[type="a" s]': {
              '--list-counter-style': 'lower-alpha'
            },
            'ol[type="I"]': {
              '--list-counter-style': 'upper-roman'
            },
            'ol[type="i"]': {
              '--list-counter-style': 'lower-roman'
            },
            'ol[type="I" s]': {
              '--list-counter-style': 'upper-roman'
            },
            'ol[type="i" s]': {
              '--list-counter-style': 'lower-roman'
            },
            'ol[type="1"]': {
              '--list-counter-style': 'decimal'
            },
            'ol > li': {
              position: 'relative'
            },
            'ol > li::marker': {
              fontWeight: '400',
              color: 'var(--fallback-bc,oklch(var(--bc)/0.5))'
            },
            'ul > li': {
              position: 'relative'
            },
            'ul > li::marker': {
              color: 'var(--fallback-bc,oklch(var(--bc)/0.5))'
            },
            hr: {
              borderColor: 'var(--fallback-bc,oklch(var(--bc)/0.2))',
              borderTopWidth: 1,
              marginTop: '3em',
              marginBottom: '3em'
            },
            blockquote: {
              fontWeight: '500',
              fontStyle: 'italic',
              color: 'var(--fallback-bc,oklch(var(--bc)/1))',
              borderLeftWidth: '0.25rem',
              borderLeftColor: 'var(--fallback-p,oklch(var(--p)/1))',
              quotes: '"\\201C""\\201D""\\2018""\\2019"',
              marginTop: '1.6em',
              marginBottom: '1.6em',
              paddingLeft: '1em',
              backgroundColor: 'var(--fallback-b2,oklch(var(--b2)/0.5))',
              borderRadius: '0.5rem',
              padding: '1rem'
            },
            h1: {
              color: 'var(--fallback-bc,oklch(var(--bc)/1))',
              fontWeight: '800',
              fontSize: '2.25em',
              marginTop: '0',
              marginBottom: '0.8888889em',
              lineHeight: '1.1111111'
            },
            h2: {
              color: 'var(--fallback-bc,oklch(var(--bc)/1))',
              fontWeight: '700',
              fontSize: '1.5em',
              marginTop: '2em',
              marginBottom: '1em',
              lineHeight: '1.3333333'
            },
            h3: {
              color: 'var(--fallback-bc,oklch(var(--bc)/1))',
              fontWeight: '600',
              fontSize: '1.25em',
              marginTop: '1.6em',
              marginBottom: '0.6em',
              lineHeight: '1.6'
            },
            h4: {
              color: 'var(--fallback-bc,oklch(var(--bc)/1))',
              fontWeight: '600',
              marginTop: '1.5em',
              marginBottom: '0.5em',
              lineHeight: '1.5'
            },
            'figure figcaption': {
              color: 'var(--fallback-bc,oklch(var(--bc)/0.6))',
              fontSize: '0.875em',
              lineHeight: '1.4285714',
              marginTop: '0.8571429em'
            },
            code: {
              color: 'var(--fallback-bc,oklch(var(--bc)/1))',
              fontWeight: '600',
              fontSize: '0.875em',
              backgroundColor: 'var(--fallback-b2,oklch(var(--b2)/1))',
              paddingLeft: '0.25rem',
              paddingRight: '0.25rem',
              paddingTop: '0.125rem',
              paddingBottom: '0.125rem',
              borderRadius: '0.25rem'
            },
            'code::before': {
              content: 'none'
            },
            'code::after': {
              content: 'none'
            },
            pre: {
              color: 'var(--fallback-bc,oklch(var(--bc)/1))',
              backgroundColor: 'var(--fallback-b2,oklch(var(--b2)/1))',
              overflowX: 'auto',
              fontWeight: '400',
              fontSize: '0.875em',
              lineHeight: '1.7142857',
              marginTop: '1.7142857em',
              marginBottom: '1.7142857em',
              borderRadius: '0.375rem',
              paddingTop: '0.8571429em',
              paddingRight: '1.1428571em',
              paddingBottom: '0.8571429em',
              paddingLeft: '1.1428571em',
              border: '1px solid var(--fallback-bc,oklch(var(--bc)/0.1))'
            },
            'pre code': {
              backgroundColor: 'transparent',
              borderWidth: '0',
              borderRadius: '0',
              padding: '0',
              fontWeight: 'inherit',
              color: 'inherit',
              fontSize: 'inherit',
              fontFamily: 'inherit',
              lineHeight: 'inherit'
            },
            table: {
              width: '100%',
              tableLayout: 'auto',
              textAlign: 'left',
              marginTop: '2em',
              marginBottom: '2em',
              fontSize: '0.875em',
              lineHeight: '1.7142857'
            },
            thead: {
              borderBottomWidth: '1px',
              borderBottomColor: 'var(--fallback-bc,oklch(var(--bc)/0.3))'
            },
            'thead th': {
              color: 'var(--fallback-bc,oklch(var(--bc)/1))',
              fontWeight: '600',
              verticalAlign: 'bottom',
              paddingRight: '0.5714286em',
              paddingBottom: '0.5714286em',
              paddingLeft: '0.5714286em'
            },
            'tbody tr': {
              borderBottomWidth: '1px',
              borderBottomColor: 'var(--fallback-bc,oklch(var(--bc)/0.1))'
            },
            'tbody tr:last-child': {
              borderBottomWidth: '0'
            },
            'tbody td': {
              verticalAlign: 'baseline',
              paddingTop: '0.5714286em',
              paddingRight: '0.5714286em',
              paddingBottom: '0.5714286em',
              paddingLeft: '0.5714286em'
            },
            'tbody td, thead th': {
              textAlign: 'left'
            }
          }
        },
        lg: {
          css: {
            fontSize: '1.125em',
            lineHeight: '1.7777778',
            h1: {
              fontSize: '2.6666667em',
              marginTop: '0',
              marginBottom: '0.8333333em',
              lineHeight: '1'
            },
            h2: {
              fontSize: '1.6666667em',
              marginTop: '1.8666667em',
              marginBottom: '1.0666667em',
              lineHeight: '1.3333333'
            },
            h3: {
              fontSize: '1.3333333em',
              marginTop: '1.6666667em',
              marginBottom: '0.6666667em',
              lineHeight: '1.5'
            }
          }
        }
      },
      screens: {
        'xs': '475px'
      }
    }
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('daisyui')
  ],
  daisyui: {
    themes: [
      {
        dracula: {
          "primary": "#ff79c6",
          "primary-focus": "#ff65c1",
          "primary-content": "#000000",
          "secondary": "#bd93f9",
          "secondary-focus": "#b085f5",
          "secondary-content": "#000000",
          "accent": "#ffb86c",
                   "accent-focus": "#ffa96b",
          "accent-content": "#000000",
          "neutral": "#414558",
          "neutral-focus": "#343749",
          "neutral-content": "#ffffff",
          "base-100": "#282a36",
          "base-200": "#1e1f29",
          "base-300": "#15161e",
          "base-content": "#f8f8f2",
          "info": "#8be9fd",
          "success": "#50fa7b",
          "warning": "#f1fa8c",
          "error": "#ff5555"
        }
      },
      {
        cmyk: {
          "primary": "#0891b2",
          "primary-focus": "#0e7490",
          "primary-content": "#ffffff",
          "secondary": "#7c3aed",
          "secondary-focus": "#6d28d9",
          "secondary-content": "#ffffff",
          "accent": "#f59e0b",
          "accent-focus": "#d97706",
          "accent-content": "#000000",
          "neutral": "#374151",
          "neutral-focus": "#1f2937",
          "neutral-content": "#f9fafb",
          "base-100": "#ffffff",
          "base-200": "#f9fafb",
          "base-300": "#f3f4f6",
          "base-content": "#1f2937",
          "info": "#3b82f6",
          "success": "#10b981",
          "warning": "#f59e0b",
          "error": "#ef4444"
        }
      }
    ],
    darkTheme: "dracula",
    base: true,
    styled: true,
    utils: true,
    prefix: '',
    logs: true,
    themeRoot: ':root'
  }
}
EOF
```

---

## 🔧 主題切換功能修正 (2025年7月2日更新)

如果遇到 `Uncaught TypeError: Alpine.$persist is not a function` 錯誤，請參考：

📋 **修正文檔**：[Theme-Toggle-Fix.md](./Theme-Toggle-Fix.md)

**快速修正要點**：
1. 將 `Alpine.$persist()` 替換為 `localStorage.getItem()` / `localStorage.setItem()`
2. 使用 `onclick` 事件處理器避免 Hugo 模板語法衝突
3. 確保 `header.html` 檔案完整且非空
4. 重新建構並測試功能

---

專案現已完成 Hugo + DaisyUI v5 + Alpine.js 的完整整合，所有核心功能正常運作。