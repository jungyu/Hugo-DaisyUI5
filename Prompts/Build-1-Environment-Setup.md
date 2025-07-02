# Build-1-Environment-Setup.md

> Hugo + TailwindCSS + DaisyUI 建構指南 - 階段一：環境準備與驗證
> 
> 基於 Hugo v0.147.9 官方標準，整合 TailwindCSS v4.1.11、DaisyUI v5.0.43、Alpine.js v3.14.9

## 階段一：環境準備與驗證

### 1.1 檢查必要環境

**CLI 指令:**

```bash
# 檢查 Node.js 版本 (需要 18.x 或更高)
node --version

# 檢查 Hugo 版本 (需要 v0.147.9 或更高，必須是 Extended 版本)
hugo version

# 檢查 Yarn 版本 (建議 v4.6.0+)
yarn --version

# 檢查 Go 版本 (Hugo 模組需要)
go version

# 如果沒有安裝 Hugo Extended 版本
# macOS:
brew install hugo

# Ubuntu/Debian:
sudo snap install hugo --channel=extended

# Windows (Chocolatey):
choco install hugo-extended
```

### 1.2 創建專案目錄

**CLI 指令:**

```bash
# 創建專案根目錄
mkdir Hugo-DaisyUI5
cd Hugo-DaisyUI5

# 驗證目錄結構
pwd
ls -la
```

### 1.3 環境驗證檢查清單

**檢查項目:**

- [ ] Node.js 18.x+ 已安裝
- [ ] Hugo Extended v0.147.9+ 已安裝  
- [ ] Yarn 4.6.0+ 已安裝
- [ ] Go 1.19+ 已安裝 (可選，Hugo 模組需要)
- [ ] 專案目錄已創建
- [ ] 具備寫入權限

**AI Prompt:**

```text
請協助我驗證 Hugo + TailwindCSS + DaisyUI 開發環境：

環境要求：
- Node.js 18.x+
- Hugo Extended v0.147.9+
- Yarn 4.6.0+
- Go 1.19+ (可選)

檢查項目：
1. 各工具版本是否符合需求
2. Hugo 是否為 Extended 版本
3. 專案目錄權限設置

如果發現問題，請提供詳細的解決方案。
```

---

**下一階段：** [Build-2-Hugo-Initialization.md](./Build-2-Hugo-Initialization.md)

**完整指南導航：**
- 階段一：環境準備與驗證 ← 當前
- 階段二：Hugo 專案初始化
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
