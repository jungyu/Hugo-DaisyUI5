# Hugo 官方架構標準完整文檔 (v0.147.9)

> 基於 Hugo 官方最新文件編寫的完整架構標準，涵蓋目錄結構、配置系統、內容組織、模板系統、資源處理、模組系統等所有核心概念。

## 目錄

1. [核心概念](#核心概念)
2. [標準目錄結構](#標準目錄結構)
3. [配置系統](#配置系統)
4. [內容組織](#內容組織)
5. [模板系統](#模板系統)
6. [資源處理](#資源處理)
7. [模組系統](#模組系統)
8. [輸出格式](#輸出格式)
9. [性能優化](#性能優化)
10. [最佳實踐](#最佳實踐)

## 核心概念

### Hugo 工作原理

Hugo 使用 **聯合文件系統 (Union File System)** 將多個目錄掛載到相同位置，實現主題繼承和模組化。

**特性：**

- 模組掛載順序決定檔案優先級
- 左側掛載優先於右側
- 支援主題繼承和覆蓋
- 自動處理資源依賴

### Page Kinds (頁面類型)

- **home**: 網站首頁 (`_index.md` in root)
- **page**: 單一內容頁面 (`index.md` 或 `.md` 檔案)
- **section**: 內容區段頁面 (`_index.md` in section)
- **taxonomy**: 分類法列表頁 (如 `/categories/`)
- **term**: 分類詞彙頁 (如 `/categories/tech/`)
- **404**: 錯誤頁面

## 標準目錄結構

### 基本骨架

```text
my-site/
├── archetypes/              # 內容模板目錄
│   └── default.md          # 預設文章模板
├── assets/                 # 全域資源 (資源管道處理)
│   ├── css/               # CSS 原始碼
│   ├── js/                # JavaScript 原始碼
│   ├── images/            # 需處理的圖片
│   └── scss/              # Sass/SCSS 文件
├── config/                # 配置目錄
│   ├── _default/          # 基礎配置
│   ├── development/       # 開發環境配置
│   └── production/        # 生產環境配置
├── content/               # 內容目錄
│   ├── _index.md         # 首頁內容
│   ├── posts/            # 文章區段
│   │   ├── _index.md    # 區段首頁
│   │   └── my-post/     # 頁面包
│   │       ├── index.md
│   │       └── images/
│   └── pages/            # 其他頁面
├── data/                  # 數據文件
│   ├── authors.toml      # 作者數據
│   └── config.json       # JSON 數據
├── i18n/                  # 國際化翻譯
│   ├── en.toml           # 英文翻譯
│   └── zh-tw.toml        # 繁體中文翻譯
├── layouts/               # 佈局模板
│   ├── _default/         # 預設佈局
│   │   ├── baseof.html  # 基礎模板
│   │   ├── list.html    # 列表頁模板
│   │   └── single.html  # 單頁模板
│   ├── partials/         # 部分模板
│   │   ├── head.html
│   │   ├── header.html
│   │   └── footer.html
│   └── shortcodes/       # 短代碼模板
├── static/                # 靜態文件
│   ├── favicon.ico       # 網站圖標
│   ├── robots.txt        # SEO 檔案
│   └── images/           # 靜態圖片
├── themes/                # 主題目錄
│   └── my-theme/         # 主題
├── public/                # 構建輸出 (自動生成)
├── resources/             # 資源緩存 (自動生成)
└── hugo.toml              # 主配置文件
```

## 配置系統

### 環境特定配置

```text
config/
├── _default/              # 基礎配置 (所有環境)
│   ├── hugo.toml         # 主要配置
│   ├── build.toml        # 構建配置
│   ├── caches.toml       # 緩存策略
│   ├── imaging.toml      # 圖片處理
│   ├── markup.toml       # 標記語言
│   ├── menus.toml        # 選單配置
│   ├── minify.toml       # 壓縮設定
│   ├── module.toml       # 模組配置
│   ├── outputFormats.toml # 輸出格式
│   ├── params.toml       # 自定義參數
│   ├── security.toml     # 安全策略
│   └── taxonomies.toml   # 分類法
├── development/           # 開發環境覆蓋
├── production/            # 生產環境覆蓋
└── staging/               # 預發布環境覆蓋
```

### 核心配置選項

**hugo.toml:**

```toml
baseURL = 'https://example.org'
languageCode = 'zh-tw'
title = 'My Site'
theme = 'my-theme'

# 目錄設定
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

# 環境設定
environment = 'production'
```

**build.toml:**

```toml
[buildStats]
  enable = true
  disableClasses = false
  disableIDs = false
  disableTags = false

[[cachebusters]]
  source = 'assets/.*\\.(js|ts|jsx|tsx)'
  target = 'js'

[[cachebusters]]
  source = '(postcss|tailwind)\\.config\\.js'
  target = 'css'
```

## 內容組織

### 頁面包 (Page Bundles)

#### 葉子包 (Leaf Bundle)

包含 `index.md` 和零個或多個資源：

```text
content/posts/my-post/
├── index.md              # 內容文件 (必需)
├── image1.jpg           # 頁面資源
├── image2.png           # 頁面資源
└── document.pdf         # 頁面資源
```

#### 分支包 (Branch Bundle)

包含 `_index.md` 和零個或多個資源：

```text
content/posts/
├── _index.md            # 分支包內容
├── featured.jpg         # 分支包資源
├── my-first-post/       # 子頁面 (葉子包)
│   └── index.md
└── my-second-post/      # 子頁面 (葉子包)
    └── index.md
```

### Front Matter

Hugo 支援三種 Front Matter 格式：

**YAML (推薦):**

```yaml
---
title: "文章標題"
date: 2025-07-02
draft: false
categories: [技術, 程式設計]
tags: [Hugo, 靜態網站]
description: "文章描述"
weight: 10
---
```

**TOML:**

```toml
+++
title = "文章標題"
date = 2025-07-02
draft = false
categories = ["技術", "程式設計"]
tags = ["Hugo", "靜態網站"]
description = "文章描述"
weight = 10
+++
```

### 預定義 Front Matter 欄位

**核心欄位:**

- `title`: 頁面標題
- `date`: 建立日期
- `lastmod`: 最後修改日期
- `publishDate`: 發布日期
- `expiryDate`: 到期日期
- `draft`: 草稿狀態 (boolean)
- `weight`: 排序權重 (integer)

**URL 控制:**

- `url`: 完整 URL 路徑
- `slug`: URL 最後段落
- `aliases`: URL 別名陣列

**內容控制:**

- `type`: 內容類型
- `layout`: 指定模板
- `outputs`: 輸出格式陣列
- `cascade`: 傳遞給子頁面的設定

**元數據:**

- `description`: 頁面描述
- `summary`: 內容摘要
- `keywords`: 關鍵字陣列
- `params`: 自定義參數 (map)

## 模板系統

### 模板查找順序

Hugo 按優先級查找模板：

1. **Layout 指定**: `layouts/posts/single.html`
2. **Type 特定**: `layouts/posts/single.html`
3. **Section 特定**: `layouts/section/single.html`
4. **預設模板**: `layouts/_default/single.html`
5. **主題模板**: `themes/theme-name/layouts/...`

### 基礎模板結構

**baseof.html:**

```go-html-template
<!DOCTYPE html>
<html lang="{{ .Site.Language.Lang }}">
<head>
  {{- partial "head.html" . -}}
</head>
<body>
  {{- partial "header.html" . -}}
  <main>
    {{- block "main" . }}{{- end }}
  </main>
  {{- partial "footer.html" . -}}
</body>
</html>
```

**single.html:**

```go-html-template
{{- define "main" }}
<article>
  <header>
    <h1>{{ .Title }}</h1>
    <time datetime="{{ .Date.Format "2006-01-02" }}">
      {{ .Date.Format "January 2, 2006" }}
    </time>
  </header>
  <div class="content">
    {{ .Content }}
  </div>
</article>
{{- end }}
```

**list.html:**

```go-html-template
{{- define "main" }}
<h1>{{ .Title }}</h1>
{{ range .Pages }}
  <article>
    <h2><a href="{{ .RelPermalink }}">{{ .Title }}</a></h2>
    <time>{{ .Date.Format "2006-01-02" }}</time>
    <p>{{ .Summary }}</p>
  </article>
{{ end }}
{{- end }}
```

### 部分模板 (Partials)

**head.html:**

```go-html-template
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{{ if .IsHome }}{{ .Site.Title }}{{ else }}{{ .Title }} | {{ .Site.Title }}{{ end }}</title>
<meta name="description" content="{{ with .Description }}{{ . }}{{ else }}{{ .Site.Params.description }}{{ end }}">

{{/* CSS */}}
{{ $css := resources.Get "css/main.css" | resources.PostCSS | resources.Minify | resources.Fingerprint }}
<link rel="stylesheet" href="{{ $css.RelPermalink }}">
```

## 資源處理 (Hugo Pipes)

### 資源管道

Hugo Pipes 提供強大的資源處理功能：

**CSS 處理:**

```go-html-template
{{ $css := resources.Get "css/main.css" }}
{{ $css = $css | resources.PostCSS }}
{{ if hugo.IsProduction }}
  {{ $css = $css | resources.Minify | resources.Fingerprint }}
{{ end }}
<link rel="stylesheet" href="{{ $css.RelPermalink }}">
```

**JavaScript 處理:**

```go-html-template
{{ $js := resources.Get "js/main.js" }}
{{ $js = $js | js.Build (dict "target" "es2018" "minify" hugo.IsProduction) }}
{{ if hugo.IsProduction }}
  {{ $js = $js | resources.Fingerprint }}
{{ end }}
<script src="{{ $js.RelPermalink }}"></script>
```

**圖片處理:**

```go-html-template
{{ $img := resources.Get "images/hero.jpg" }}
{{ $thumb := $img.Resize "300x200" }}
{{ $webp := $thumb.Format "webp" }}
<picture>
  <source srcset="{{ $webp.RelPermalink }}" type="image/webp">
  <img src="{{ $thumb.RelPermalink }}" alt="Hero image">
</picture>
```

## 模組系統

### 模組配置

**module.toml:**

```toml
[hugoVersion]
  min = "0.140.0"
  extended = false

[[imports]]
  path = "github.com/user/hugo-theme"
  disable = false

[[mounts]]
  source = "assets"
  target = "assets"

[[mounts]]
  source = "static"
  target = "static"
```

### 模組初始化

```bash
# 初始化模組
hugo mod init github.com/user/my-site

# 獲取模組
hugo mod get github.com/user/theme

# 更新模組
hugo mod get -u

# 清理模組緩存
hugo mod clean
```

## 輸出格式

### 預設輸出格式

Hugo 支援多種輸出格式：

- **HTML**: 標準網頁 (text/html)
- **RSS**: RSS 訂閱 (application/rss+xml)
- **JSON**: JSON API (application/json)
- **AMP**: AMP 頁面 (text/html)
- **Sitemap**: 網站地圖 (application/xml)

### 自定義輸出格式

**outputFormats.toml:**

```toml
[manifest]
  mediaType = "application/manifest+json"
  baseName = "manifest"
  isPlainText = true

[atom]
  mediaType = "application/atom+xml"
  baseName = "feed"
  isPlainText = true
```

**outputs.toml:**

```toml
home = ["HTML", "RSS", "JSON", "manifest"]
page = ["HTML"]
section = ["HTML", "RSS"]
taxonomy = ["HTML", "RSS"]
term = ["HTML", "RSS"]
```

## 性能優化

### 緩存配置

**caches.toml:**

```toml
[getjson]
  dir = ":cacheDir/:project"
  maxAge = "10m"

[getcsv]
  dir = ":cacheDir/:project"
  maxAge = "10m"

[images]
  dir = ":resourceDir/_gen"
  maxAge = "720h"

[assets]
  dir = ":resourceDir/_gen"
  maxAge = "720h"
```

### 圖片優化

**imaging.toml:**

```toml
resampleFilter = "CatmullRom"
quality = 75
hint = "photo"
anchor = "Smart"
bgColor = "#ffffff"

[exif]
  includeFields = ".*"
  excludeFields = ""
  disableDate = false
  disableLatLong = false
```

### 壓縮設定

**minify.toml:**

```toml
disableCSS = false
disableHTML = false
disableJS = false
disableJSON = false
disableSVG = false
disableXML = false

[tdewolff.html]
  keepEndTags = true
  keepQuotes = false
  keepWhitespace = false

[tdewolff.css]
  precision = 0
  keepCSS2 = true

[tdewolff.js]
  keepVarNames = false
  precision = 0
```

## 最佳實踐

### 專案組織

1. **內容優先**: 根據內容結構組織目錄
2. **語義化命名**: 使用有意義的目錄和文件名
3. **分離關注點**: 配置、內容、佈局分離
4. **模組化設計**: 使用 partial 模板和 shortcodes

### 性能優化

1. **圖片優化**: 使用 Hugo 圖片處理功能
2. **資源合併**: 使用資源管道合併 CSS/JS
3. **緩存策略**: 合理配置緩存時間
4. **延遲載入**: 實現圖片延遲載入

### 開發工作流

1. **環境分離**: 使用不同環境配置
2. **版本控制**: Git 忽略 `public/` 和 `resources/`
3. **持續集成**: 自動化構建和部署
4. **測試策略**: 內容驗證和連結檢查

### 安全考量

1. **輸入驗證**: 驗證外部數據來源
2. **權限控制**: 限制執行權限
3. **內容清理**: 清理危險的 HTML 內容
4. **HTTPS 強制**: 強制使用 HTTPS

## 安全設定

**security.toml:**

```toml
enableInlineShortcodes = false

[exec]
  allow = ['^(dart-)?sass(-embedded)?$', '^go$', '^npx$', '^postcss$']
  osEnv = ['(?i)^((HTTPS?|NO)_PROXY|PATH(EXT)?|APPDATA|TE?MP|TERM|GO\\w+|(XDG_CONFIG_)?HOME|USERPROFILE|SSH_AUTH_SOCK|DISPLAY|LANG|SYSTEMDRIVE)$']

[funcs]
  getenv = ['^HUGO_', '^CI$']

[http]
  methods = ['(?i)GET|POST']
  urls = ['.*']
```

## 常用命令

### 開發命令

```bash
# 開發服務器
hugo server -D --watch

# 生產構建
hugo --environment=production

# 建立新內容
hugo new posts/my-post.md

# 建立新區段
hugo new posts/_index.md
```

### 模組命令

```bash
# 初始化模組
hugo mod init github.com/user/site

# 下載依賴
hugo mod download

# 更新模組
hugo mod get -u

# 清理緩存
hugo mod clean
```

## 疑難排解

### 常見問題

1. **模板未找到**: 檢查模板路徑和檔名
2. **資源處理失敗**: 檢查資源路徑和配置
3. **模組載入失敗**: 檢查網路連接和模組路徑
4. **構建緩慢**: 檢查緩存設定和資源處理

### 調試技巧

1. **啟用詳細輸出**: `hugo --verbose`
2. **檢查配置**: `hugo config`
3. **查看網站信息**: `{{ printf "%#v" .Site }}`
4. **檢查頁面變數**: `{{ printf "%#v" . }}`

## 參考資料

- [Hugo 官方文檔](https://gohugo.io/documentation/)
- [Hugo 模板指南](https://gohugo.io/templates/)
- [Hugo 模組系統](https://gohugo.io/hugo-modules/)
- [Hugo Pipes](https://gohugo.io/hugo-pipes/)
- [Hugo 配置](https://gohugo.io/getting-started/configuration/)
- [Hugo 內容管理](https://gohugo.io/content-management/)

---

> 本文檔基於 Hugo v0.147.9 官方文件整理，提供完整的 Hugo 架構標準參考。建議定期查看 Hugo 官方文檔以獲取最新功能和最佳實踐。
