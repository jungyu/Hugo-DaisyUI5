# Hugo 專案建構階段 6：Hugo 配置系統

> **專案狀態**: ✅ 已完成  
> **技術棧**: Hugo v0.147.9 + TailwindCSS v4.1.11 + DaisyUI v5.0.43 + Alpine.js v3.14.9

本階段專注於建立和配置 Hugo 配置檔案，包括網站參數、選單、多語言支援和其他必要的配置項目。

## 階段目標

- 建立 Hugo 配置檔案結構
- 設定網站基本參數
- 配置選單系統
- 實作多語言支援
- 優化建構設定

## 前置條件

✅ 已完成 [階段 5：前端技術整合](./Build-5-Frontend-Integration.md)  
✅ Tailwind CSS 和 DaisyUI 已正確整合

## 步驟詳解

### 1. 建立配置目錄結構

Hugo 0.147.9 支援配置目錄結構，讓我們可以將配置拆分為多個檔案以便於管理。

**CLI 指令:**

```bash
# 確保在 hugo-twda-v5 目錄中執行以下指令
# cd hugo-twda-v5  # 如果尚未切換到此目錄

# 建立配置目錄結構
mkdir -p config/_default
```

### 2. 建立基礎配置檔案

**CLI 指令:**

```bash
# 建立基礎配置檔案
cat > config/_default/config.toml << 'EOF'
# Hugo v0.147.9 基礎配置
baseURL = "https://example.com/"
languageCode = "zh-tw"
title = "Hugo-DaisyUI5 專案"
theme = "twda_v5"

# 內容與發佈設定
defaultContentLanguage = "zh-tw"
hasCJKLanguage = true
enableEmoji = true
enableRobotsTXT = true
disableKinds = ["taxonomy", "term"]

# 主要內容章節
mainSections = ["blogs", "posts"]

# 建構設定
[build]
  writeStats = true

# 模組配置
[module]
  [module.hugoVersion]
    extended = true
    min = "0.140.0"

# 分頁設定 (Hugo v0.128.0+ 新語法)
[pagination]
  pagerSize = 10
  path = "page"

# 標記設定
[markup]
  [markup.goldmark]
    [markup.goldmark.renderer]
      unsafe = true
  [markup.highlight]
    style = "github"
    lineNos = false
    codeFences = true

# 社交與 SEO (基本設定，詳細配置在 params.toml)
[author]
  name = "Aaron Chen"
  email = "developer@example.com"
EOF

# 建立參數配置檔案
cat > config/_default/params.toml << 'EOF'
# 網站參數配置

# 網站基本資訊
description = "基於 Hugo v0.147.9 + TailwindCSS v4.1.11 + DaisyUI v5.0.43 的現代靜態網站"
author = "Aaron Chen"
copyright = "© 2024 Hugo-DaisyUI5 專案"

# 社交媒體連結
[social]
  github = "https://github.com/yourusername/Hugo-DaisyUI5"
  twitter = "https://twitter.com/yourusername"

# SEO 相關設定
[seo]
  enableSitemap = true
  enableRobotsTXT = true
  canonicalURL = true

# 佈局與顯示設定
[layout]
  enableTOC = true  # 啟用目錄
  tocDepth = 3      # 目錄深度
  enableBreadcrumb = true  # 啟用麵包屑導航

# 主題配置
[theme]
  defaultTheme = "light" # 'light', 'dark', or 'system'
  enableThemeToggle = true
  accentColor = "#147df3"
  
# 網站功能選項
[features]
  enableSearch = true  # 啟用網站搜尋
  enableDarkMode = true  # 啟用深色模式
  enableCodeCopy = true  # 啟用程式碼複製按鈕
  codeHighlightTheme = "github-dark" # 程式碼高亮主題
  
# 首頁功能配置
[homepage]
  newsletter = true
  
  # 特色功能
  [[homepage.features]]
    icon = "🚀"
    title = "高效能"
    description = "使用 Hugo 靜態網站產生器，提供極速載入體驗"
  
  [[homepage.features]]
    icon = "🎨"
    title = "現代設計"
    description = "採用 TailwindCSS + DaisyUI，打造美觀且響應式的介面"
  
  [[homepage.features]]
    icon = "⚡"
    title = "易於使用"
    description = "簡潔的架構設計，讓內容創作和網站維護變得輕鬆"

# 頁腳配置
[footer]
  powered_by = true
EOF

# 建立選單配置檔案
cat > config/_default/menus.toml << 'EOF'
# 主選單
[[main]]
  name = "首頁"
  url = "/"
  weight = 10

[[main]]
  name = "關於"
  url = "/about/"
  weight = 20

[[main]]
  name = "文章"
  url = "/blogs/"
  weight = 30

[[main]]
  name = "專案"
  url = "/projects/"
  weight = 40

[[main]]
  name = "聯絡"
  url = "/contact/"
  weight = 50

# 頁尾選單
[[footer]]
  name = "隱私政策"
  url = "/privacy/"
  weight = 10

[[footer]]
  name = "條款與條件"
  url = "/terms/"
  weight = 20

[[footer]]
  name = "聯絡我們"
  url = "/contact/"
  weight = 30
EOF

### 3. 配置多語言支援

**CLI 指令:**

```bash
# 建立語言配置檔案
cat > config/_default/languages.toml << 'EOF'
# 主要語言 (繁體中文)
[zh-tw]
  languageName = "繁體中文"
  weight = 1
EOF
```

**注意**: 為確保配置穩定性，此處使用簡化的單語言配置。如需完整多語言支援，可在基本功能測試完成後，擴展為以下完整配置：

```toml
# 完整多語言配置範例（可選）
[zh-tw]
  languageName = "繁體中文"
  contentDir = "content/zh-tw"
  weight = 1
  
  [zh-tw.params]
    description = "基於 Hugo v0.147.9 + TailwindCSS v4.1.11 + DaisyUI v5.0.43 的現代靜態網站"

[en]
  languageName = "English"
  contentDir = "content/en"
  weight = 2
  
  [en.params]
    description = "Modern static website based on Hugo v0.147.9 + TailwindCSS v4.1.11 + DaisyUI v5.0.43"
```

### 4. 優化建構設定

**CLI 指令:**

```bash
# 建立輸出格式配置檔案
cat > config/_default/outputs.toml << 'EOF'
# 輸出格式配置
home = ["HTML", "RSS", "JSON"]
page = ["HTML"]
section = ["HTML", "RSS"]
EOF

# 建立建構和發佈設定
cat > config/production/config.toml << 'EOF'
# 生產環境特定配置
baseURL = "https://your-production-domain.com/"
enableRobotsTXT = true

[build]
  writeStats = true
  
[minify]
  disableJS = false
  disableCSS = false
  disableHTML = false
  disableSVG = false
  disableXML = false
  minifyOutput = true
  
[params]
  # 生產環境參數覆蓋
  env = "production"
  googleAnalytics = "UA-XXXXXXXXX-X" # 替換為您的 GA ID
EOF
```

### 5. 配置 URL 模式

**CLI 指令:**

```bash
# 建立 URL 配置檔案
cat > config/_default/permalinks.toml << 'EOF'
# 永久連結配置
posts = "/posts/:year/:month/:slug/"
blogs = "/blogs/:year/:month/:slug/"
pages = "/:contentbasename/"  # 使用 :contentbasename 而非 :filename
EOF
```

### 6. 配置圖片處理

**CLI 指令:**

```bash
# 建立圖片處理配置
cat > config/_default/imaging.toml << 'EOF'
# Hugo 圖片處理配置
resampleFilter = "lanczos"
quality = 90
anchor = "smart"
bgColor = "#ffffff"

# 預設圖片處理設定
[exif]
  disableDate = true
  disableLatLong = true
  includeFields = ""
  excludeFields = ""
EOF
```

### 7. 配置執行過程中的重要修正

在執行上述配置過程中，需要注意以下幾個重要問題和修正：

#### 7.1 永久連結語法更新

**問題**: Hugo v0.144.0+ 中 `:filename` 語法已被棄用  
**解決方案**: 將 `permalinks.toml` 中的 `:filename` 替換為 `:contentbasename`

```toml
# 正確的永久連結配置
posts = "/posts/:year/:month/:slug/"
blogs = "/blogs/:year/:month/:slug/"
pages = "/:contentbasename/"  # 使用 :contentbasename 而非 :filename
```

#### 7.2 輸出格式配置語法

**問題**: 輸出格式配置使用了錯誤的 TOML 語法  
**解決方案**: 使用陣列格式而非表格格式

```toml
# 正確的輸出格式配置
home = ["HTML", "RSS", "JSON"]
page = ["HTML"]
section = ["HTML", "RSS"]

# 錯誤的格式（會導致建構失敗）
# [home]
#   HTML = true
#   RSS = true
```

#### 7.3 生產環境配置衝突

**問題**: `minify = true` 與 `[minify]` 區塊配置衝突  
**解決方案**: 移除重複的 `minify = true` 配置，只保留 `[minify]` 區塊

```toml
# 正確的生產環境配置
baseURL = "https://your-production-domain.com/"
enableRobotsTXT = true

[minify]
  disableJS = false
  disableCSS = false
  # ... 其他 minify 設定
```

#### 7.4 多語言配置簡化

**問題**: 複雜的多語言配置可能與現有內容結構衝突  
**解決方案**: 先使用簡化的語言配置，確保基本功能正常

```toml
# 簡化的語言配置
[zh-tw]
  languageName = "繁體中文"
  weight = 1
```

#### 7.5 建構測試指令

**CLI 指令**:

```bash
# 測試基本建構
hugo

# 測試開發服務器
hugo server --buildDrafts --buildFuture --port 1313

# 檢查配置文件語法
hugo config
```

## 驗證與檢查

完成 Hugo 配置系統後，請確認以下事項：

- [x] 配置檔案結構正確設置
- [x] 網站基本參數已正確配置
- [x] 選單系統已設置且可用
- [x] 輸出格式配置正確（使用陣列語法）
- [x] 永久連結使用新語法（:contentbasename）
- [x] 生產環境配置無衝突
- [x] 執行 `hugo` 命令時沒有配置相關錯誤
- [x] 執行 `hugo server` 命令成功啟動開發服務器

### 配置檔案最終結構

```text
config/
├── _default/
│   ├── config.toml      # 基本配置
│   ├── params.toml      # 網站參數
│   ├── menus.toml       # 選單配置
│   ├── languages.toml   # 語言配置（簡化版）
│   ├── outputs.toml     # 輸出格式
│   ├── permalinks.toml  # 永久連結
│   └── imaging.toml     # 圖片處理
└── production/
    └── config.toml      # 生產環境覆蓋配置
```

## AI Prompt 協助

> 請幫我檢查我的 Hugo 專案配置系統是否有問題。我使用了目錄式配置結構，包括 config/_default/config.toml、params.toml、menus.toml、languages.toml 等檔案。特別需要注意永久連結語法更新（使用 :contentbasename）、輸出格式陣語法，以及避免 minify 配置衝突。

## 下一階段

✅ [階段 7：Alpine.js 整合](./Build-7-Alpinejs-Integration.md) - 整合 Alpine.js 為網站添加互動功能，實現無需額外 JavaScript 框架的動態行為。

---

📚 **相關資源:**

- [Hugo 配置文件](https://gohugo.io/getting-started/configuration/)
- [Hugo 多語言支援](https://gohugo.io/content-management/multilingual/)
- [Hugo 選單系統](https://gohugo.io/content-management/menus/)
- [Hugo 環境變數](https://gohugo.io/getting-started/configuration/#configure-with-environment-variables)
