# Hugo 專案建構階段 6：Hugo 配置系統

> **專案狀態**: ✅ 進行中  
> **技術棧**: Hugo v0.147.9 + TailwindCSS v4.1.11 + DaisyUI v5.0.43 + Alpine.js v3.14.9

本階段專注於建立和配置 Hugo 配置檔案，包括網站參數、菜單、多語言支援和其他必要的配置項目。

## 階段目標

- 建立 Hugo 配置檔案結構
- 設定網站基本參數
- 配置菜單系統
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
# 建立配置目錄結構
mkdir -p config/_default
```

### 2. 建立基礎配置檔案

**CLI 指令:**

```bash
# 建立基礎配置檔案
cat > config/_default/config.toml << 'EOF'
# Hugo 基本配置
baseURL = "https://example.com/"
languageCode = "zh-tw"
title = "Hugo-DaisyUI5 專案"

# 配置主題
theme = "twda_v5"
disableKinds = ["taxonomy", "term"]

# 建構設定
[build]
  writeStats = true
  
# 菜單配置 (移至 menus.toml)

# 模組配置
[module]
  # 啟用 Go 模組
  [module.hugoVersion]
    extended = true
    min = "0.140.0"
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
  
# 顯示選項
[display]
  dateFormat = "2006/01/02"
EOF

# 建立菜單配置檔案
cat > config/_default/menus.toml << 'EOF'
# 主菜單
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
  url = "/posts/"
  weight = 30

[[main]]
  name = "專案"
  url = "/projects/"
  weight = 40

[[main]]
  name = "聯絡"
  url = "/contact/"
  weight = 50

# 頁尾菜單
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
```

### 3. 配置多語言支援

**CLI 指令:**

```bash
# 建立語言配置檔案
cat > config/_default/languages.toml << 'EOF'
# 主要語言 (繁體中文)
[zh-tw]
  languageName = "繁體中文"
  contentDir = "content/zh-tw"
  weight = 1
  
  [zh-tw.params]
    description = "基於 Hugo v0.147.9 + TailwindCSS v4.1.11 + DaisyUI v5.0.43 的現代靜態網站"
  
  # 中文菜單覆蓋
  [zh-tw.menu]
    [[zh-tw.menu.main]]
      name = "首頁"
      url = "/"
      weight = 10
    [[zh-tw.menu.main]]
      name = "關於"
      url = "/about/"
      weight = 20
    [[zh-tw.menu.main]]
      name = "文章"
      url = "/posts/"
      weight = 30

# 次要語言 (英文)
[en]
  languageName = "English"
  contentDir = "content/en"
  weight = 2
  
  [en.params]
    description = "Modern static website based on Hugo v0.147.9 + TailwindCSS v4.1.11 + DaisyUI v5.0.43"
  
  # 英文菜單
  [en.menu]
    [[en.menu.main]]
      name = "Home"
      url = "/"
      weight = 10
    [[en.menu.main]]
      name = "About"
      url = "/about/"
      weight = 20
    [[en.menu.main]]
      name = "Blog"
      url = "/posts/"
      weight = 30
EOF
```

### 4. 優化建構設定

**CLI 指令:**

```bash
# 建立輸出格式配置檔案
cat > config/_default/outputs.toml << 'EOF'
# 輸出格式配置
[home]
  HTML = true
  RSS = true
  JSON = true # 用於搜尋功能
  
[page]
  HTML = true
  
[section]
  HTML = true
  RSS = true
EOF

# 建立建構和發佈設定
cat > config/production/config.toml << 'EOF'
# 生產環境特定配置
baseURL = "https://your-production-domain.com/"
enableRobotsTXT = true
minify = true

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
pages = "/:filename/"
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
[imaging.exif]
  disableDate = true
  disableLatLong = true
  includeFields = ""
  excludeFields = ""
EOF
```

## 驗證與檢查

完成 Hugo 配置系統後，請確認以下事項：

- [ ] 配置檔案結構正確設置
- [ ] 網站基本參數已正確配置
- [ ] 菜單系統已設置且可用
- [ ] 多語言支援已配置（如適用）
- [ ] 建構設定已針對不同環境優化
- [ ] 執行 `hugo server` 命令時沒有配置相關錯誤

## AI Prompt 協助

> 請幫我檢查我的 Hugo 專案配置系統是否有問題。我使用了目錄式配置結構，包括 config/_default/config.toml、params.toml、menus.toml、languages.toml 等檔案。特別是多語言配置部分和 URL 永久連結設定是否有任何潛在問題。

## 下一階段

✅ [階段 7：Alpine.js 整合](./Build-7-Alpinejs-Integration.md) - 整合 Alpine.js 為網站添加互動功能，實現無需額外 JavaScript 框架的動態行為。

---

📚 **相關資源:**
- [Hugo 配置文件](https://gohugo.io/getting-started/configuration/)
- [Hugo 多語言支援](https://gohugo.io/content-management/multilingual/)
- [Hugo 菜單系統](https://gohugo.io/content-management/menus/)
- [Hugo 環境變數](https://gohugo.io/getting-started/configuration/#configure-with-environment-variables)
