# Hugo 開發環境完整安裝指南

> 基於 Hugo v0.147.9+ Extended 版本的跨平台開發環境安裝指南，支援 macOS、Ubuntu/Debian 與 Windows 系統。

本文檔提供詳細的分步安裝指令，幫助開發者在不同作業系統上建立 Hugo + TailwindCSS + DaisyUI 開發環境。

## 🎯 環境需求清單

在開始安裝前，請確認您需要以下軟體：

- **Node.js**: v18.0.0 或更高版本 (建議 v20.17.0+)
- **Hugo**: v0.147.9 或更高版本 (必須是 Extended 版本)
- **Yarn**: v4.6.0 或更高版本 (包管理器)
- **Go**: v1.21.0 或更高版本 (Hugo 模組支援)
- **Git**: 版本控制 (建議最新版本)

## 📋 安裝前檢查

執行以下指令檢查當前環境狀態：

```bash
# 檢查作業系統資訊
uname -a

# 檢查是否已安裝相關軟體
node --version 2>/dev/null || echo "Node.js 未安裝"
hugo version 2>/dev/null || echo "Hugo 未安裝"
yarn --version 2>/dev/null || echo "Yarn 未安裝"
go version 2>/dev/null || echo "Go 未安裝"
git --version 2>/dev/null || echo "Git 未安裝"
```

---

## 🍎 macOS 安裝指南

### 方法一：使用 Homebrew（推薦）

```bash
# 1. 安裝或更新 Homebrew
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# 2. 更新 Homebrew
brew update

# 3. 安裝 Node.js
brew install node

# 4. 安裝 Hugo Extended 版本
brew install hugo

# 5. 安裝 Go
brew install go

# 6. 安裝 Git (通常已預裝)
brew install git

# 7. 安裝 Yarn v4.6.0
npm install -g yarn
yarn set version 4.6.0
```

### 方法二：使用 MacPorts

```bash
# 1. 確保 MacPorts 已安裝並更新
sudo port selfupdate

# 2. 安裝軟體包
sudo port install nodejs18 +universal
sudo port install hugo +extended
sudo port install go
sudo port install git

# 3. 安裝 Yarn
npm install -g yarn
yarn set version 4.6.0
```

### macOS 驗證指令

```bash
# 驗證安裝結果
echo "=== macOS 環境驗證 ==="
echo "Node.js: $(node --version)"
echo "Hugo: $(hugo version | grep -o 'hugo v[0-9.]*[+extended]*')"
echo "Yarn: $(yarn --version)"
echo "Go: $(go version | grep -o 'go[0-9.]*')"
echo "Git: $(git --version)"

# 驗證 Hugo Extended 版本
hugo version | grep -i extended && echo "✅ Hugo Extended 版本正確" || echo "❌ 請安裝 Hugo Extended 版本"
```

---

## 🐧 Ubuntu/Debian 安裝指南

### 方法一：使用 APT + 官方來源（推薦）

```bash
# 1. 更新系統包列表
sudo apt update && sudo apt upgrade -y

# 2. 安裝必要的依賴
sudo apt install -y curl wget gnupg lsb-release

# 3. 安裝 Node.js (使用 NodeSource 官方 PPA)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# 4. 安裝 Hugo Extended (使用官方 GitHub Releases)
HUGO_VERSION="0.147.9"
wget -O hugo.deb "https://github.com/gohugoio/hugo/releases/download/v${HUGO_VERSION}/hugo_extended_${HUGO_VERSION}_linux-amd64.deb"
sudo dpkg -i hugo.deb
rm hugo.deb

# 5. 安裝 Go
sudo apt install -y golang-go

# 6. 安裝 Git
sudo apt install -y git

# 7. 安裝 Yarn v4.6.0
npm install -g yarn
yarn set version 4.6.0
```

### 方法二：使用 Snap

```bash
# 1. 確保 snapd 已安裝
sudo apt update
sudo apt install -y snapd

# 2. 安裝軟體包
sudo snap install node --classic
sudo snap install hugo --channel=extended
sudo snap install go --classic

# 3. 安裝 Yarn
npm install -g yarn
yarn set version 4.6.0
```

### Ubuntu/Debian 驗證指令

```bash
# 驗證安裝結果
echo "=== Ubuntu/Debian 環境驗證 ==="
echo "Node.js: $(node --version)"
echo "Hugo: $(hugo version | grep -o 'hugo v[0-9.]*[+extended]*')"
echo "Yarn: $(yarn --version)"
echo "Go: $(go version | grep -o 'go[0-9.]*')"
echo "Git: $(git --version)"

# 檢查 Hugo Extended 版本
hugo version | grep -i extended && echo "✅ Hugo Extended 版本正確" || echo "❌ 請重新安裝 Hugo Extended 版本"
```

---

## 🪟 Windows 安裝指南

### 方法一：使用 Chocolatey（推薦）

```powershell
# 1. 以管理員身份開啟 PowerShell

# 2. 安裝 Chocolatey (如果未安裝)
Set-ExecutionPolicy Bypass -Scope Process -Force
[System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072
iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))

# 3. 重新啟動 PowerShell 後執行以下指令

# 4. 安裝軟體包
choco install nodejs -y
choco install hugo-extended -y
choco install golang -y
choco install git -y

# 5. 安裝 Yarn v4.6.0
npm install -g yarn
yarn set version 4.6.0
```

### 方法二：使用 Scoop

```powershell
# 1. 安裝 Scoop (如果未安裝)
Set-ExecutionPolicy RemoteSigned -Scope CurrentUser
irm get.scoop.sh | iex

# 2. 添加必要的 bucket
scoop bucket add main
scoop bucket add extras

# 3. 安裝軟體包
scoop install nodejs
scoop install hugo-extended
scoop install go
scoop install git

# 4. 安裝 Yarn v4.6.0
npm install -g yarn
yarn set version 4.6.0
```

### 方法三：手動安裝

```powershell
# 1. Node.js
# 下載並安裝: https://nodejs.org/en/download/
# 選擇 LTS 版本 (v20.x)

# 2. Hugo Extended
# 下載: https://github.com/gohugoio/hugo/releases
# 選擇 hugo_extended_X.X.X_windows-amd64.zip
# 解壓縮並將 hugo.exe 放入 PATH 環境變數

# 3. Go
# 下載並安裝: https://golang.org/dl/
# 選擇 Windows installer

# 4. Git
# 下載並安裝: https://git-scm.com/download/win

# 5. 安裝 Yarn
npm install -g yarn
yarn set version 4.6.0
```

### Windows 驗證指令

```powershell
# 驗證安裝結果
Write-Host "=== Windows 環境驗證 ==="
Write-Host "Node.js: $(node --version)"
Write-Host "Hugo: $(hugo version)"
Write-Host "Yarn: $(yarn --version)"
Write-Host "Go: $(go version)"
Write-Host "Git: $(git --version)"

# 檢查 Hugo Extended 版本
if (hugo version | Select-String "extended") {
    Write-Host "✅ Hugo Extended 版本正確" -ForegroundColor Green
} else {
    Write-Host "❌ 請重新安裝 Hugo Extended 版本" -ForegroundColor Red
}
```

---

## 🔧 常見問題排除

### 問題 1: Hugo 不是 Extended 版本

**症狀**: `hugo version` 輸出不包含 "extended"

**解決方案**:
```bash
# macOS
brew uninstall hugo
brew install hugo

# Ubuntu/Debian - 手動下載 Extended 版本
wget -O hugo.deb "https://github.com/gohugoio/hugo/releases/download/v0.147.9/hugo_extended_0.147.9_linux-amd64.deb"
sudo dpkg -i hugo.deb

# Windows - 重新下載 hugo_extended 版本
```

### 問題 2: Node.js 版本過舊

**症狀**: `node --version` 顯示版本低於 v18

**解決方案**:
```bash
# macOS
brew upgrade node

# Ubuntu/Debian
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Windows
choco upgrade nodejs
```

### 問題 3: Yarn 安裝失敗

**症狀**: `yarn --version` 命令找不到

**解決方案**:
```bash
# 使用 npm 全域安裝
npm install -g yarn

# 檢查 npm 全域路徑
npm config get prefix

# 確保路徑在 PATH 環境變數中
echo $PATH | grep npm
```

### 問題 4: Go 環境變數問題

**症狀**: `go version` 找不到命令

**解決方案**:
```bash
# macOS/Linux - 添加到 .bashrc 或 .zshrc
export PATH=$PATH:/usr/local/go/bin
export GOPATH=$HOME/go
export PATH=$PATH:$GOPATH/bin

# Windows - 在系統環境變數中添加
# PATH: C:\Go\bin
# GOPATH: C:\Users\{username}\go
```

---

## 📋 完整環境驗證腳本

將以下腳本保存為 `verify-environment.sh` (Unix) 或 `verify-environment.ps1` (Windows):

### Unix/Linux/macOS 版本

```bash
#!/bin/bash

echo "🚀 Hugo 開發環境驗證腳本"
echo "================================"

# 顏色定義
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 驗證函數
verify_command() {
    if command -v $1 &> /dev/null; then
        echo -e "${GREEN}✅ $1 已安裝${NC}"
        $1 --version 2>/dev/null || $1 version 2>/dev/null || echo "版本資訊不可用"
    else
        echo -e "${RED}❌ $1 未安裝${NC}"
        return 1
    fi
    echo ""
}

# 驗證版本需求
verify_version() {
    local cmd=$1
    local min_version=$2
    local current_version=$3
    
    echo -e "${YELLOW}檢查 $cmd 版本需求...${NC}"
    echo "最低需求: $min_version"
    echo "當前版本: $current_version"
    echo ""
}

# 主要驗證流程
echo "📝 基礎命令檢查:"
verify_command "node"
verify_command "hugo"
verify_command "yarn"
verify_command "go"
verify_command "git"

# 特殊檢查
echo "🔍 特殊需求檢查:"

# Hugo Extended 檢查
if hugo version 2>/dev/null | grep -i "extended" > /dev/null; then
    echo -e "${GREEN}✅ Hugo Extended 版本正確${NC}"
else
    echo -e "${RED}❌ 需要 Hugo Extended 版本${NC}"
fi

# Node.js 版本檢查
NODE_VERSION=$(node --version 2>/dev/null | sed 's/v//')
if [ ! -z "$NODE_VERSION" ]; then
    verify_version "Node.js" "18.0.0" "$NODE_VERSION"
fi

# 網路連接檢查
echo "🌐 網路連接檢查:"
if curl -s --max-time 5 https://registry.npmjs.org/ > /dev/null; then
    echo -e "${GREEN}✅ NPM 註冊表連接正常${NC}"
else
    echo -e "${RED}❌ NPM 註冊表連接失敗${NC}"
fi

echo "================================"
echo "🎉 環境驗證完成！"
```

### Windows PowerShell 版本

```powershell
#!/usr/bin/env pwsh

Write-Host "🚀 Hugo 開發環境驗證腳本" -ForegroundColor Cyan
Write-Host "================================"

# 驗證函數
function Verify-Command {
    param($CommandName)
    
    if (Get-Command $CommandName -ErrorAction SilentlyContinue) {
        Write-Host "✅ $CommandName 已安裝" -ForegroundColor Green
        try {
            & $CommandName --version 2>$null
        } catch {
            try {
                & $CommandName version 2>$null
            } catch {
                Write-Host "版本資訊不可用"
            }
        }
    } else {
        Write-Host "❌ $CommandName 未安裝" -ForegroundColor Red
        return $false
    }
    Write-Host ""
    return $true
}

# 主要驗證流程
Write-Host "📝 基礎命令檢查:"
Verify-Command "node"
Verify-Command "hugo"
Verify-Command "yarn"
Verify-Command "go"
Verify-Command "git"

# Hugo Extended 檢查
Write-Host "🔍 特殊需求檢查:"
$hugoVersion = hugo version 2>$null
if ($hugoVersion -match "extended") {
    Write-Host "✅ Hugo Extended 版本正確" -ForegroundColor Green
} else {
    Write-Host "❌ 需要 Hugo Extended 版本" -ForegroundColor Red
}

# 網路連接檢查
Write-Host "🌐 網路連接檢查:"
try {
    $response = Invoke-WebRequest -Uri "https://registry.npmjs.org/" -TimeoutSec 5 -ErrorAction Stop
    Write-Host "✅ NPM 註冊表連接正常" -ForegroundColor Green
} catch {
    Write-Host "❌ NPM 註冊表連接失敗" -ForegroundColor Red
}

Write-Host "================================"
Write-Host "🎉 環境驗證完成！" -ForegroundColor Cyan
```

## 📚 後續步驟

環境安裝完成後，請繼續：

1. **驗證環境**: 執行上述驗證腳本確保所有軟體正常運作
2. **Hugo 專案**: 參考 `Build-Prompts-1-Improved.md` 創建 Hugo 專案
3. **主題設定**: 整合 TailwindCSS + DaisyUI v5 主題
4. **開發workflow**: 設定 Git 版本控制與部署流程

## 🆘 獲得協助

如果在安裝過程中遇到問題，請：

1. 檢查對應作業系統的官方文檔
2. 確認網路連接正常
3. 查看系統權限設定
4. 參考常見問題排除章節

---

**版本資訊**: 本指南基於以下版本測試
- Node.js: v20.17.0
- Hugo: v0.147.9+extended  
- Yarn: v4.6.0
- Go: v1.24.4

**最後更新**: 2025年7月2日