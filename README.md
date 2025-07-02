# Hugo + TailwindCSS + DaisyUI 專案建構指南

> 基於 Hugo 官方標準的完整建構指南，結合現代化前端技術棧
> 快速建構：使用 Visual Studio Code 編輯器，並透過 AI 助手協助完成 Prompts/ 文件每個階段。(例：GitHub Copilot、MCP等)

## 🎯 專案概覽

本專案提供完整的步驟指南，幫助開發者從零開始建立現代化的 Hugo 靜態網站，整合最新的前端技術：

- **Hugo v0.147.9** Extended - 靜態網站生成器
- **TailwindCSS v4.1.11** - 原子化 CSS 框架  
- **DaisyUI v5.0.43** - 基於 Tailwind 的 UI 組件庫
- **Alpine.js v3.14.9** - 輕量級 JavaScript 框架
- **Yarn v4.6.0** - 現代包管理器

## 📁 文檔結構

```
建構參照/
├── Hugo-Structure.md       # Hugo 官方架構標準
├── Project-Config.md       # 專案技術配置規格
├── Project-Structure.md    # 專案目錄結構
└── Cloud-Hosting.md        # 雲端部署配置

Prompts/
├── Build-1-Environment-Setup.md    # 環境準備與驗證 (第1階段) 🆕
├── Build-2-Hugo-Initialization.md  # Hugo 專案初始化 (第2階段) 🆕
├── Build-3-Theme-Architecture.md   # 主題架構建立 (第3階段) 🆕
├── Build-4-Base-Templates.md       # 基礎 HTML 模板 (第4階段) 🆕
├── Build-5-Frontend-Integration.md # 前端技術整合 (第5階段) 🆕
├── Build-6-Hugo-Configuration.md   # Hugo 配置系統 (第6階段) 🆕
├── Build-7-Alpinejs-Integration.md # Alpine.js 整合 (第7階段) 🆕
├── Build-8-CSS-Framework-Integration.md # CSS 框架整合 (第8階段) 🆕
├── Build-9-Hugo-Resource-Processing.md # 資源處理 (第9階段) 🆕
├── Build-10-Project-Showcase.md    # 專案展示與範例 (第10階段) 🆕
├── Build-11-SEO-Optimization.md    # 建構優化與 SEO (第11階段) 🆕
├── Build-12-Testing-Validation.md  # 測試和驗證 (第12階段) 🆕
├── Build-13-Common-Issues.md       # 常見問題與疑難排解 (第13階段) 🆕
├── Deploy-Firebase.md              # Firebase 部署指南
├── Deploy-Github.md                # GitHub Pages 部署指南
├── Deploy-Nginx.md                 # Nginx 部署指南
├── Theme-Toggle-Fix.md             # 主題切換功能修正指南
└── [其他專項指南...]               # 前端特性、安全性、SEO 等
```

## 🚀 快速開始

### 1. 環境準備與驗證 (第1階段) 📋

閱讀 [`Build-1-Environment-Setup.md`](./Prompts/Build-1-Environment-Setup.md) 確保您的開發環境已正確設置。

### 2. Hugo 專案初始化 (第2階段) 🏗️

繼續閱讀 [`Build-2-Hugo-Initialization.md`](./Prompts/Build-2-Hugo-Initialization.md) 完成 Hugo 專案的建立。

### 3. 主題架構建立 (第3階段) 🎨

參考 [`Build-3-Theme-Architecture.md`](./Prompts/Build-3-Theme-Architecture.md) 建立完整的主題架構。

### 4. 前端技術整合 (第4-8階段) ⚡

完成前端技術的整合，包括：

- [`Build-4-Base-Templates.md`](./Prompts/Build-4-Base-Templates.md) - 基礎 HTML 模板
- [`Build-5-Frontend-Integration.md`](./Prompts/Build-5-Frontend-Integration.md) - 前端技術整合
- [`Build-7-Alpinejs-Integration.md`](./Prompts/Build-7-Alpinejs-Integration.md) - Alpine.js 整合
- [`Build-8-CSS-Framework-Integration.md`](./Prompts/Build-8-CSS-Framework-Integration.md) - CSS 框架整合

### 5. 主題切換功能 🌓

**最新更新 (2025年7月3日)**: Alpine.js 主題切換功能的完整實現與修正：

- 📋 **修正指南**: [`Theme-Toggle-Fix.md`](./Prompts/Theme-Toggle-Fix.md)

### 6. 建構優化與測試 (第9-13階段) 🚀

完成專案的最後階段：

- [`Build-9-Hugo-Resource-Processing.md`](./Prompts/Build-9-Hugo-Resource-Processing.md) - 資源處理
- [`Build-10-Project-Showcase.md`](./Prompts/Build-10-Project-Showcase.md) - 專案展示與範例
- [`Build-11-SEO-Optimization.md`](./Prompts/Build-11-SEO-Optimization.md) - 建構優化與 SEO
- [`Build-12-Testing-Validation.md`](./Prompts/Build-12-Testing-Validation.md) - 測試和驗證
- [`Build-13-Common-Issues.md`](./Prompts/Build-13-Common-Issues.md) - 常見問題與疑難排解

### 7. 部署選項 🚢

根據您的需求選擇部署方式：

- [`Deploy-Firebase.md`](./Prompts/Deploy-Firebase.md) - Firebase Hosting 部署指南
- [`Deploy-Github.md`](./Prompts/Deploy-Github.md) - GitHub Pages 部署指南
- [`Deploy-Nginx.md`](./Prompts/Deploy-Nginx.md) - Nginx 服務器部署指南

## 📋 建構階段

我們的建構指南包含 13 個完整階段：

1. **環境準備與驗證** - 檢查必要軟體與版本
2. **Hugo 專案初始化** - 建立 Hugo 專案與模組系統
3. **主題架構建立** - 創建 twda_v5 主題結構
4. **基礎 HTML 模板** - 建立基本頁面模板
5. **前端技術整合** - 配置 Yarn + Node.js 環境
6. **Hugo 配置系統** - 設置完整的 Hugo 配置
7. **Alpine.js 整合** - JavaScript 互動功能
8. **CSS 框架整合** - Tailwind CSS v4 + DaisyUI v5
9. **Hugo 資源處理** - ESBuild + PostCSS 資源管道
10. **專案展示與範例** - 示範頁面與元件
11. **建構優化與 SEO** - 性能優化與搜索引擎優化
12. **測試和驗證** - 效能測試與品質檢查
13. **常見問題與疑難排解** - 解決方案與最佳實踐

## 🎨 特色功能

### 🌙 主題切換

- DaisyUI 雙主題：`dracula` (深色) / `cmyk` (淺色)
- Alpine.js 狀態持久化
- 平滑切換動畫

### 🔍 全站搜尋

- Fuse.js 模糊搜尋引擎
- 支援中文搜尋
- 即時搜尋結果

### 📊 數學與圖表

- KaTeX 數學公式渲染
- Mermaid 流程圖、時序圖
- Hugo Shortcodes 整合

### �� 響應式設計

- TailwindCSS 響應式工具
- DaisyUI 組件適配
- 行動裝置優化

## 🛠️ 開發環境要求

- **Node.js** 18.x+
- **Hugo** v0.147.9+ Extended
- **Yarn** v4.6.0+
- **Go** 1.19+ (Hugo 模組需要)

## 📚 AI 協作指南

每個建構階段都包含：

- **CLI 指令** - 可直接執行的命令
- **AI Prompt** - 與 AI 助手協作的詳細提示
- **配置說明** - 技術細節與最佳實踐
- **驗證清單** - 階段完成檢查項目

### 使用方式

1. 按順序執行各階段的 CLI 指令
2. 使用 AI Prompts 獲得個性化協助  
3. 根據專案需求調整配置參數
4. 參考驗證清單確認階段完成

## 🎯 適用場景

- 技術部落格與文檔網站
- 企業展示網站
- 個人作品集
- 開源專案文檔
- 學習筆記與知識庫

## 📝 授權

本專案採用 MIT 授權，歡迎自由使用與修改。

## 🤝 貢獻

歡迎提交 Issue 與 Pull Request 來改善這份指南！

---

**立即開始** →

按順序閱讀建構階段文件，從 [第1階段：環境準備與驗證](./Prompts/Build-1-Environment-Setup.md) 開始，逐步完成您的 Hugo + TailwindCSS + DaisyUI v5 專案！

> 💡 **提示**: 每個階段文件底部都有導航鏈接，方便您按順序進行或查找特定階段的指南。完整的 13 個階段文件已於 2025年7月3日 更新完成。
