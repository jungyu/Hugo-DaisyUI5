
# Hugo + TailwindCSS + DaisyUI 專案建構指南

> 基於 Hugo v0.147.9 官方標準的完整建構指南，結合現代化前端技術棧

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
├── Build-Prompts-1.md      # 基礎建構指南 (階段 1-4)
├── Build-Prompts-1-add.md  # 第一部分補充指南 (實際缺失項目)
├── Build-Prompts-2-1.md    # 進階建構指南 (階段 5-7) ✅ 已修正 Alpine.js
├── Build-Prompts-2-1-add.md # 第二部分補充指南 (額外操作)
├── Build-Prompts-2-1-theme-fix.md # Alpine.js 主題切換修正記錄 🆕
├── Theme-Toggle-Fix.md     # 主題切換功能修正指南 🔧
├── Build-Prompts-2.md      # 進階功能建構
├── Build-Prompts-3.md      # 部署與優化指南
└── [其他專項指南...]
```

## 🚀 快速開始

### 1. 基礎建構 (階段 1-4)
閱讀 [`Build-Prompts-1.md`](./Prompts/Build-Prompts-1.md) 獲得環境設置與基礎配置指令。

### 2. 基礎建構補充指南 ⭐
**重要**: 參考 [`Build-Prompts-1-add.md`](./Prompts/Build-Prompts-1-add.md) 了解實際建構過程中發現的缺失項目。

### 3. 進階建構 (階段 5-7)
繼續閱讀 [`Build-Prompts-2-1.md`](./Prompts/Build-Prompts-2-1.md) 完成 Hugo 主題配置與 Alpine.js 模組。

### 4. 進階建構補充指南 ⭐
**重要**: 參考 [`Build-Prompts-2-1-add.md`](./Prompts/Build-Prompts-2-1-add.md) 了解額外操作與實際差異。

### 5. 主題切換功能修正 🔧
**最新更新 (2025年7月2日)**: Alpine.js 主題切換功能已完成修正，移除 `Alpine.$persist` 依賴，改用 `localStorage` 手動管理狀態。

- 📋 **修正指南**: [`Theme-Toggle-Fix.md`](./Prompts/Theme-Toggle-Fix.md)
- 📝 **修正記錄**: [`Build-Prompts-2-1-theme-fix.md`](./Prompts/Build-Prompts-2-1-theme-fix.md)

### 6. 了解技術規格
參考 [`Project-Config.md`](./建構參照/Project-Config.md) 了解詳細的技術配置。

### 7. 理解專案結構
查看 [`Project-Structure.md`](./建構參照/Project-Structure.md) 了解目錄組織。

## 📋 建構階段

Build-Prompts.md 包含 12 個完整階段：

1. **環境準備與驗證** - 檢查必要軟體與版本
2. **Hugo 專案初始化** - 建立 Hugo 專案與模組系統
3. **主題架構建立** - 創建 twda_v5 主題結構
4. **前端技術棧整合** - 配置 Yarn + Node.js 環境
5. **Hugo 配置系統** - 設置完整的 Hugo 配置
6. **Tailwind CSS v4 + DaisyUI v5 整合** - 前端樣式框架
7. **Alpine.js v3.14.9 功能模組** - JavaScript 互動功能
8. **Hugo 資源處理** - ESBuild + PostCSS 資源管道
9. **內容組織與模板** - 內容結構與模板系統
10. **功能擴展與 Shortcodes** - 進階功能與擴展
11. **測試與優化** - 效能優化與品質檢查
12. **部署配置** - Firebase Hosting 部署

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

### 📱 響應式設計
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

### 使用方式

1. 按順序執行各階段的 CLI 指令
2. 使用 AI Prompts 獲得個性化協助  
3. 根據專案需求調整配置參數
4. 參考配置說明理解技術原理

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

1. 查看 [`Build-Prompts-1.md`](./Prompts/Build-Prompts-1.md) 基礎建構指南
2. 參考 [`Build-Prompts-1-add.md`](./Prompts/Build-Prompts-1-add.md) 第一部分補充指南
3. 查看 [`Build-Prompts-2-1.md`](./Prompts/Build-Prompts-2-1.md) 進階建構指南  
4. 參考 [`Build-Prompts-2-1-add.md`](./Prompts/Build-Prompts-2-1-add.md) 第二部分補充指南

> 💡 **建議**: 補充指南記錄了實際建構過程中發現的重要差異與額外操作，是成功建構專案的關鍵參考文檔。包含配置清理、語法修正、測試驗證等生產環境就緒的完整流程。
