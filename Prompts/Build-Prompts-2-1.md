# Hugo + TailwindCSS(DaisyUI) 專案建構指南 - 第二部分（1/2）

> 本文件涵蓋：
> 1. Hugo 配置系統 (twda_v5 主題)
> 2. Alpine.js v3.14.9 功能模組

---

## 目錄

1. [Hugo 配置系統 (twda_v5 主題)](#階段五hugo-配置系統-twda_v5-主題)
   - [基礎配置文件 (config/_default/)](#51-基礎配置文件-config_default)
   - [參數配置 (params.toml)](#52-參數配置-paramstoml)
   - [國際化配置 (i18n/)](#53-國際化配置-i18n)
2. [Alpine.js v3.14.9 功能模組](#階段七alpinejs-v3149-功能模組)
   - [核心 JavaScript 架構](#71-核心-javascript-架構)
   - [互動功能模組](#72-互動功能模組)
   - [狀態管理與持久化](#73-狀態管理與持久化)

---

## 前置要求

請確保已完成第一部分 (階段 1-4)：
- ✅ 環境驗證與專案初始化
- ✅ twda_v5 主題架構建立
- ✅ 前端技術棧基礎配置
- ✅ 依賴安裝與基礎檔案建立

---

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

---

## 階段七：Alpine.js v3.14.9 功能模組

### 7.1 核心 JavaScript 架構

（請將 Build-Prompts-2.md 中「3. Alpine.js」相關段落補上，若有 CLI 指令、配置、說明、AI Prompt 一併納入）

---

（如需補充 7.2 互動功能模組、7.3 狀態管理與持久化，請依 Build-Prompts-2.md 原文結構補全）
