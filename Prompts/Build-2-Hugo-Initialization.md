# Build-2-Hugo-Initialization.md

> Hugo + TailwindCSS + DaisyUI 建構指南 - 階段二：Hugo 專案初始化
>
> 基於 Hugo v0.147.9 官方標準，整合 TailwindCSS v4.1.11、DaisyUI v5.0.43、Alpine.js v3.14.9

## 階段二：Hugo 專案初始化

### 2.1 初始化 Hugo 專案

**CLI 指令:**

```bash
# 創建並切換到 Hugo 專案目錄
mkdir -p hugo-twda-v5
cd hugo-twda-v5

# 初始化 Hugo 專案 (需要在 ./hugo-twda-v5 目錄內執行)
hugo new site . --force

# 確認初始結構
ls -la

# 預期目錄結構:
# archetypes/
# assets/
# content/
# data/
# i18n/
# layouts/
# static/
# themes/
# hugo.toml (或 config.toml)
```

### 2.2 初始化版本控制

**CLI 指令:**

```bash
# 確保在 hugo-twda-v5 目錄中執行以下指令
# cd hugo-twda-v5  # 如果尚未切換到此目錄

# 初始化 Git 倉庫
git init

# 創建 .gitignore
cat > .gitignore << 'EOF'
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

# Hugo 資源
resources/
.hugo_build.lock
EOF
```

### 2.3 創建初始內容結構

**CLI 指令:**

```bash
# 確保在 hugo-twda-v5 目錄中執行以下指令
# cd hugo-twda-v5  # 如果尚未切換到此目錄

# 創建內容目錄結構
mkdir -p content/blogs
mkdir -p content/pages

# 創建首頁內容
cat > content/_index.md << 'EOF'
---
title: "Hugo + TailwindCSS + DaisyUI 5"
description: "現代化靜態網站，基於 Hugo v0.147.9、TailwindCSS v4.1.11、DaisyUI v5.0.43"
date: 2025-07-02
---

# 歡迎來到 Hugo + TailwindCSS + DaisyUI 5

這是一個現代化的靜態網站，展示了 Hugo、TailwindCSS 和 DaisyUI 的完美整合。

## 技術特色

- **Hugo v0.147.9**: 快速的靜態網站生成器
- **TailwindCSS v4.1.11**: 實用優先的 CSS 框架
- **DaisyUI v5.0.43**: 美觀的組件庫
- **Alpine.js v3.14.9**: 輕量級 JavaScript 框架

## 功能亮點

- 🎨 現代化設計系統
- 🌙 深色/淺色主題切換
- 📱 完全響應式設計
- ⚡ 極快的載入速度
- 🔍 SEO 優化
EOF

# 創建部落格索引頁
cat > content/blogs/_index.md << 'EOF'
---
title: "技術文章"
description: "分享 Hugo、TailwindCSS、DaisyUI 等前端技術心得"
date: 2025-07-02
---

# 技術文章

這裡是我們的技術分享空間，涵蓋 Hugo、TailwindCSS、DaisyUI 等現代前端技術。
EOF

# 創建第一篇示例文章
cat > content/blogs/getting-started.md << 'EOF'
---
title: "開始使用 Hugo + TailwindCSS + DaisyUI"
description: "快速上手指南：如何建立現代化的 Hugo 靜態網站"
date: 2025-07-02
draft: false
tags: ["Hugo", "TailwindCSS", "DaisyUI", "教學"]
---

# 開始使用 Hugo + TailwindCSS + DaisyUI

本文將帶您快速了解如何使用 Hugo、TailwindCSS 和 DaisyUI 建立現代化的靜態網站。

## 為什麼選擇這個組合？

### Hugo
- 極快的建構速度
- 豐富的模板系統
- 強大的內容管理

### TailwindCSS
- 實用優先的設計哲學
- 高度可客製化
- 優秀的開發體驗

### DaisyUI
- 美觀的預設組件
- 豐富的主題選擇
- 與 TailwindCSS 完美整合

## 下一步

接下來我們將設置主題系統並整合前端技術棧。
EOF
```

### 2.4 創建基礎配置

**CLI 指令:**

```bash
# 確保在 hugo-twda-v5 目錄中執行以下指令
# cd hugo-twda-v5  # 如果尚未切換到此目錄

# 創建配置目錄結構 (Hugo v0.147.9 推薦)
mkdir -p config/_default

# 移動或更新主配置文件
if [ -f "hugo.toml" ]; then
    mv hugo.toml config/_default/config.toml
elif [ -f "config.toml" ]; then
    mv config.toml config/_default/config.toml
fi

# 創建基礎配置文件
cat > config/_default/config.toml << 'EOF'
# Hugo v0.147.9 基礎配置
baseURL = 'http://localhost:1313'
languageCode = 'zh-TW'
title = 'Hugo-DaisyUI5'
theme = 'twda_v5'

# 內容與發佈設定
defaultContentLanguage = 'zh-tw'
hasCJKLanguage = true
enableEmoji = true
enableRobotsTXT = true

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

# 輸出格式
[outputs]
  home = ["HTML", "RSS", "JSON"]
  page = ["HTML"]
  section = ["HTML", "RSS"]

# 社交與 SEO
[author]
  name = "開發者"
  email = "developer@example.com"

# 導航選單 (將在 menus.toml 中詳細設定)
[[menus.main]]
  identifier = "home"
  name = "首頁"
  url = "/"
  weight = 10

[[menus.main]]
  identifier = "blogs"
  name = "技術文章"
  url = "/blogs/"
  weight = 20
EOF
```

### 2.5 驗證初始化

**CLI 指令:**

```bash
# 確保在 hugo-twda-v5 目錄中執行以下指令
# cd hugo-twda-v5  # 如果尚未切換到此目錄

# 測試 Hugo 是否能正確啟動
hugo server --bind 0.0.0.0 --port 1313 --logLevel info

# 預期輸出應包含：
# - Web Server is available at http://localhost:1313/
# - Press Ctrl+C to stop

# 檢查初始結構 (另開終端，記得切換到 hugo-twda-v5 目錄)
tree -I 'node_modules|public|resources' -a
```

### 2.6 初始化檢查清單

**檢查項目:**

- [ ] Hugo 專案已成功初始化
- [ ] 版本控制 (.git) 已設置
- [ ] .gitignore 文件已創建
- [ ] 基礎內容文件已創建
- [ ] 配置文件結構正確
- [ ] Hugo server 能正常啟動
- [ ] 可以訪問 <http://localhost:1313>

**AI Prompt:**

```text
請協助我驗證 Hugo 專案初始化是否正確：

初始化項目：
1. Hugo 專案結構是否完整
2. 配置文件格式是否正確
3. 內容文件是否可以正常渲染
4. 開發服務器是否能正常啟動

如發現問題請提供解決方案，特別注意：
- config.toml 語法正確性
- 內容文件 Front Matter 格式
- Hugo v0.147.9 兼容性問題
```

---

**上一階段：** [Build-1-Environment-Setup.md](./Build-1-Environment-Setup.md)
**下一階段：** [Build-3-Theme-Architecture.md](./Build-3-Theme-Architecture.md)

**完整指南導航：**

- 階段一：環境準備與驗證
- 階段二：Hugo 專案初始化 ← 當前
- 階段三：主題架構建立
- 階段四：基礎 HTML 模板
- 階段五：前端技術棧整合
- 階段六：Hugo 配置系統
- 階段七：Alpine.js 功能模組
- 階段八：TailwindCSS+DaisyUI 整合
- 階段九：資源處理系統
- 階段十：實際專案展示
- 階段十一：建構優化與 SEO
- 階段十二：測試和驗證
- 階段十三：常見問題與疑難排解
