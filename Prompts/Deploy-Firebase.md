# Hugo + Firebase Hosting 部署指南

> 本文檔專門說明如何將基於 Hugo v0.147.9 + TailwindCSS v4.1.11 + DaisyUI v5.0.43 + Alpine.js v3.14.9 的現代化靜態網站部署到 Firebase Hosting。

## 前置要求

在開始部署前，請確保您已經完成：

- ✅ Hugo 專案建構完成 (參考 Build-Prompts-1.md、Build-Prompts-2.md)
- ✅ 本地開發環境正常運作
- ✅ 擁有 Google 帳號 (用於 Firebase)
- ✅ 已安裝 Node.js 18+ 和 Yarn v4.6.0+

## 目錄

1. [Firebase Hosting 基本配置](#1-firebase-hosting-基本配置)
   - [專案初始化](#11-專案初始化)
   - [配置檔案設定](#12-配置檔案設定)
   - [快取策略最佳化](#13-快取策略最佳化)
2. [建構與部署腳本](#2-建構與部署腳本)
   - [Package.json 腳本配置](#21-packagejson-腳本配置)
   - [生產環境建構](#22-生產環境建構)
   - [SEO 檢查腳本](#23-seo-檢查腳本)
3. [自動化部署 (GitHub Actions)](#3-自動化部署-github-actions)
   - [工作流程配置](#31-工作流程配置)
   - [環境變數設定](#32-環境變數設定)
   - [部署驗證](#33-部署驗證)
4. [測試與驗證](#4-測試與驗證)
   - [本地測試](#41-本地測試)
   - [部署後驗證](#42-部署後驗證)
5. [故障排除](#5-故障排除)

---

## 1. Firebase Hosting 基本配置

### 1.1 專案初始化

**CLI 指令:**

```bash
# 全域安裝 Firebase CLI (如果尚未安裝)
npm install -g firebase-tools

# 或透過專案依賴安裝
yarn add firebase-tools --dev

# 登入 Firebase
firebase login

# 初始化 Firebase 專案
firebase init hosting

# 選擇設定選項：
# ? What do you want to use as your public directory? public
# ? Configure as a single-page app (rewrite all urls to /index.html)? No
# ? Set up automatic builds and deploys with GitHub? (optional)
# ? File public/index.html already exists. Overwrite? No
```

**互動式設定說明:**

```text
選項說明：
1. Public directory: 選擇 "public" (Hugo 建構輸出目錄)
2. Single-page app: 選擇 "No" (靜態網站，非 SPA)  
3. GitHub 自動部署: 可選 "Yes" (稍後手動配置更精確)
4. 覆寫檔案: 選擇 "No" (保持現有檔案)
```

### 1.2 配置檔案設定

**CLI 指令:**

```bash
# 創建完整的 Firebase 配置 (支援現代圖片格式與最佳化快取)
cat > firebase.json << 'EOF'
{
  "hosting": {
    "public": "public",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**",
      "**/*.tmp",
      "**/*.log"
    ],
    "rewrites": [
      {
        "source": "**",
        "destination": "/404.html"
      }
    ],
    "headers": [
      {
        "source": "**/*.@(css|js)",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "public, max-age=31536000, immutable"
          },
          {
            "key": "X-Content-Type-Options",
            "value": "nosniff"
          }
        ]
      },
      {
        "source": "**/*.@(jpg|jpeg|gif|png|svg)",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "public, max-age=604800"
          },
          {
            "key": "X-Content-Type-Options", 
            "value": "nosniff"
          }
        ]
      },
      {
        "source": "**/*.@(webp|avif)",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "public, max-age=2592000, immutable"
          },
          {
            "key": "Vary",
            "value": "Accept"
          },
          {
            "key": "X-Content-Type-Options",
            "value": "nosniff"
          }
        ]
      },
      {
        "source": "**/*.@(woff|woff2|ttf|eot)",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "public, max-age=31536000, immutable"
          },
          {
            "key": "Access-Control-Allow-Origin",
            "value": "*"
          }
        ]
      },
      {
        "source": "**/*.@(xml|json)",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "public, max-age=3600"
          }
        ]
      },
      {
        "source": "/sw.js",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "no-cache"
          }
        ]
      }
    ],
    "cleanUrls": true,
    "trailingSlash": false
  }
}
EOF

# 創建 .firebaserc 專案配置
cat > .firebaserc << 'EOF'
{
  "projects": {
    "default": "your-project-id"
  }
}
EOF

echo "⚠️  請將 'your-project-id' 替換為您的實際 Firebase 專案 ID"
```

### 1.3 快取策略最佳化

**快取策略說明:**

| 資源類型 | 快取時間 | 策略說明 |
|---------|---------|---------|
| CSS/JS 檔案 | 1年 (immutable) | 版本控制，內容變更時檔名改變 |
| 現代圖片 (WebP/AVIF) | 30天 (immutable) | 現代格式，檔案最佳化 |
| 傳統圖片 (JPG/PNG/SVG) | 1週 | 相容性格式 |
| 字體檔案 | 1年 (immutable) | CORS 支援，長期快取 |
| XML/JSON 檔案 | 1小時 | SEO 檔案，適度快取 |
| Service Worker | 無快取 | PWA 支援，即時更新 |

**AI Prompt:**

```text
請協助我配置 Firebase Hosting 部署，需要：

Firebase 配置要求：
- 公開目錄: public (Hugo 建構輸出)
- 忽略檔案: firebase.json, 隱藏檔案, node_modules, 暫存檔
- 404 錯誤處理: 重定向到 /404.html
- Clean URLs: 啟用 (移除 .html 後綴)

現代化快取策略：
- CSS/JS 檔案: 1年不可變快取 + 安全標頭
- 現代圖片格式 (WebP/AVIF): 30天不可變 + Vary Accept
- 傳統圖片格式: 1週快取
- 字體檔案: 1年不可變 + CORS 支援
- SEO 檔案 (XML/JSON): 1小時快取
- Service Worker: 無快取 (即時更新)

安全性標頭：
- X-Content-Type-Options: nosniff
- Access-Control-Allow-Origin: * (字體檔案)
- Vary: Accept (現代圖片格式)

請說明 Firebase Hosting 的優勢與最佳實踐，特別是現代圖片格式的快取策略。
```

## 2. 建構與部署腳本

### 2.1 Package.json 腳本配置

**CLI 指令:**

```bash
# 更新 package.json，加入 Firebase 部署相關腳本
cat > package.json << 'EOF'
{
  "name": "hugo-daisyui5",
  "version": "1.0.0",
  "description": "Hugo v0.147.9 website with TailwindCSS v4.1.11 and DaisyUI v5.0.43",
  "scripts": {
    "start": "hugo server -D --bind 0.0.0.0 --port 1313 --disableFastRender",
    "dev": "hugo server -D --bind 0.0.0.0 --port 1313 --disableFastRender",
    "serve": "hugo server -D --bind 0.0.0.0 --port 1313",
    "build": "hugo --gc --minify --environment production",
    "build:dev": "hugo -D --gc --minify --environment development",
    "preview": "hugo server --environment production --bind 0.0.0.0",
    "clean": "rm -rf public resources .hugo_build.lock",
    "validate": "hugo --gc --minify --environment production --logLevel info",
    "firebase:init": "firebase init hosting",
    "firebase:deploy": "yarn build && firebase deploy --only hosting",
    "firebase:serve": "yarn build && firebase serve --only hosting",
    "firebase:preview": "firebase hosting:channel:deploy preview --expires 7d",
    "firebase:deploy:prod": "yarn validate && firebase deploy --only hosting --project default",
    "test:build": "yarn clean && yarn build && yarn firebase:serve"
  },
  "devDependencies": {
    "@alpinejs/intersect": "^3.14.9",
    "@alpinejs/persist": "^3.14.9",
    "@tailwindcss/typography": "^0.5.16",
    "alpinejs": "^3.14.9",
    "daisyui": "^5.0.43",
    "firebase-tools": "^13.20.2",
    "postcss": "^8.5.6",
    "postcss-cli": "^11.0.1",
    "postcss-preset-env": "^10.1.3",
    "tailwindcss": "^4.1.11",
    "theme-change": "^2.5.0"
  },
  "dependencies": {
    "date-fns": "^4.1.0",
    "fuse.js": "^7.0.0",
    "katex": "^0.16.20",
    "mark.js": "^8.11.1",
    "mermaid": "^11.4.1"
  },
  "keywords": ["hugo", "tailwindcss", "daisyui", "alpinejs", "firebase", "static-site", "twda_v5"],
  "author": "Your Name",
  "license": "MIT",
  "packageManager": "yarn@4.6.0"
}
EOF
```

**腳本說明:**

- `firebase:deploy` - 建構並部署到生產環境
- `firebase:serve` - 本地 Firebase 模擬器預覽
- `firebase:preview` - 部署到預覽頻道 (7天期限)
- `firebase:deploy:prod` - 驗證後部署到生產環境
- `test:build` - 完整建構測試流程

### 2.2 生產環境建構

**CLI 指令:**

```bash
# 創建生產環境建構腳本
mkdir -p scripts

cat > scripts/build.sh << 'EOF'
#!/bin/bash

# Hugo + Firebase 生產環境建構腳本
# 支援 Hugo v0.147.9 + TailwindCSS v4.1.11 + DaisyUI v5.0.43 + Alpine.js v3.14.9

set -e

echo "🚀 開始建構 Hugo-DaisyUI5 專案 (Firebase 部署)..."

# 檢查必要工具
echo "🔍 檢查建構環境..."
command -v hugo >/dev/null 2>&1 || { echo "❌ Hugo 未安裝"; exit 1; }
command -v yarn >/dev/null 2>&1 || { echo "❌ Yarn 未安裝"; exit 1; }
command -v firebase >/dev/null 2>&1 || { echo "❌ Firebase CLI 未安裝"; exit 1; }

# 檢查 Hugo 版本
HUGO_VERSION=$(hugo version | grep -o 'v[0-9]*\.[0-9]*\.[0-9]*' | head -1)
echo "📋 Hugo 版本: $HUGO_VERSION"

if hugo version | grep -q "extended"; then
  echo "✅ Hugo Extended 版本 (支援 AVIF/WebP)"
else
  echo "⚠️  Hugo 標準版本 (僅支援 WebP)"
fi

# 清理舊檔案
echo "🧹 清理舊檔案..."
rm -rf public resources .hugo_build.lock

# 安裝/更新依賴
echo "📦 安裝依賴..."
yarn install --frozen-lockfile

# Hugo 建構 (生產環境，使用 Hugo Pipes 資源處理)
echo "🏗️ Hugo 建構 (ESBuild + PostCSS + 圖片最佳化)..."
HUGO_ENVIRONMENT=production hugo --gc --minify --logLevel info

# 檢查建構結果
if [ -d "public" ]; then
  echo "✅ 建構成功！"
  echo "📊 建構統計:"
  
  # 基本檔案統計
  find public -type f -name "*.html" | wc -l | xargs echo "  HTML 檔案:"
  find public -type f -name "*.css" | wc -l | xargs echo "  CSS 檔案:"
  find public -type f -name "*.js" | wc -l | xargs echo "  JS 檔案:"
  
  # 圖片格式詳細統計
  echo "  圖片檔案分析:"
  WEBP_COUNT=$(find public -type f -name "*.webp" | wc -l)
  AVIF_COUNT=$(find public -type f -name "*.avif" | wc -l)
  JPEG_COUNT=$(find public -type f -name "*.jpg" -o -name "*.jpeg" | wc -l)
  PNG_COUNT=$(find public -type f -name "*.png" | wc -l)
  SVG_COUNT=$(find public -type f -name "*.svg" | wc -l)
  
  echo "    WebP 檔案: $WEBP_COUNT"
  echo "    AVIF 檔案: $AVIF_COUNT"
  echo "    JPEG 檔案: $JPEG_COUNT"
  echo "    PNG 檔案: $PNG_COUNT"
  echo "    SVG 檔案: $SVG_COUNT"
  
  # 總大小和現代格式比例
  TOTAL_SIZE=$(du -sh public | cut -f1)
  echo "  總大小: $TOTAL_SIZE"
  
  TOTAL_IMAGES=$((WEBP_COUNT + AVIF_COUNT + JPEG_COUNT + PNG_COUNT + SVG_COUNT))
  if [ $TOTAL_IMAGES -gt 0 ]; then
    MODERN_IMAGES=$((WEBP_COUNT + AVIF_COUNT))
    MODERN_PERCENTAGE=$((MODERN_IMAGES * 100 / TOTAL_IMAGES))
    echo "  現代格式比例: ${MODERN_PERCENTAGE}% (${MODERN_IMAGES}/${TOTAL_IMAGES})"
  fi
  
else
  echo "❌ 建構失敗！"
  exit 1
fi

echo "🎉 建構完成，準備部署到 Firebase Hosting..."
EOF

chmod +x scripts/build.sh
```

### 2.3 SEO 檢查腳本

**CLI 指令:**

```bash
# 創建 SEO 與效能檢查腳本
cat > scripts/seo-check.sh << 'EOF'
#!/bin/bash

# SEO 與效能檢查腳本 (Firebase 部署前驗證)

set -e

echo "🔍 SEO 與效能檢查..."

# 檢查建構目錄是否存在
if [ ! -d "public" ]; then
  echo "❌ public 目錄不存在，請先執行建構"
  exit 1
fi

# 檢查必要的 SEO 檔案
echo "📋 檢查 SEO 相關檔案..."

if [ -f "public/sitemap.xml" ]; then
  echo "✅ sitemap.xml 存在"
  SITEMAP_SIZE=$(wc -l < "public/sitemap.xml")
  echo "   包含 $SITEMAP_SIZE 行內容"
else
  echo "❌ sitemap.xml 缺失"
fi

if [ -f "public/robots.txt" ]; then
  echo "✅ robots.txt 存在"
  cat public/robots.txt | head -5
else
  echo "❌ robots.txt 缺失"
fi

# 檢查 RSS 訂閱
if [ -f "public/index.xml" ]; then
  echo "✅ RSS 訂閱存在 (index.xml)"
else
  echo "❌ RSS 訂閱缺失"
fi

# 檢查 JSON Feed
if [ -f "public/index.json" ]; then
  echo "✅ JSON Feed 存在"
else
  echo "❌ JSON Feed 缺失"
fi

# 檢查 404 頁面
if [ -f "public/404.html" ]; then
  echo "✅ 404 錯誤頁面存在"
else
  echo "❌ 404 錯誤頁面缺失"
fi

# 檢查首頁
if [ -f "public/index.html" ]; then
  echo "✅ 首頁存在"
  # 檢查關鍵 meta 標籤
  if grep -q "og:title" public/index.html; then
    echo "   ✅ Open Graph 標籤存在"
  else
    echo "   ⚠️  缺少 Open Graph 標籤"
  fi
  
  if grep -q "twitter:card" public/index.html; then
    echo "   ✅ Twitter Card 標籤存在"
  else
    echo "   ⚠️  缺少 Twitter Card 標籤"
  fi
else
  echo "❌ 首頁缺失"
fi

# 檢查圖片最佳化
echo "📊 圖片最佳化檢查..."
WEBP_COUNT=$(find public -name "*.webp" | wc -l)
AVIF_COUNT=$(find public -name "*.avif" | wc -l)

if [ $WEBP_COUNT -gt 0 ]; then
  echo "✅ WebP 圖片已生成 ($WEBP_COUNT 個)"
else
  echo "⚠️  未發現 WebP 圖片"
fi

if [ $AVIF_COUNT -gt 0 ]; then
  echo "✅ AVIF 圖片已生成 ($AVIF_COUNT 個)"
else
  echo "⚠️  未發現 AVIF 圖片 (需要 Hugo Extended)"
fi

echo "📈 SEO 檢查完成"

# 檢查 Firebase 配置
if [ -f "firebase.json" ]; then
  echo "✅ Firebase 配置檔案存在"
else
  echo "❌ Firebase 配置檔案缺失"
  exit 1
fi

if [ -f ".firebaserc" ]; then
  echo "✅ Firebase 專案配置存在"
else
  echo "⚠️  Firebase 專案配置缺失"
fi

echo "🎉 所有檢查完成，準備部署..."
EOF

chmod +x scripts/seo-check.sh
```

## 3. 自動化部署 (GitHub Actions)

### 3.1 工作流程配置

**CLI 指令:**

```bash
# 創建 GitHub Actions 工作流程目錄
mkdir -p .github/workflows

# 創建部署工作流程
cat > .github/workflows/deploy-firebase.yml << 'EOF'
name: Deploy to Firebase Hosting

on:
  push:
    branches: [ main, master ]
  pull_request:
    branches: [ main, master ]

env:
  NODE_VERSION: '18'
  HUGO_VERSION: '0.147.9'

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
    - name: 📥 Checkout 程式碼
      uses: actions/checkout@v4
      with:
        submodules: true
        fetch-depth: 0

    - name: 🛠️ 設置 Hugo Extended
      uses: peaceiris/actions-hugo@v2
      with:
        hugo-version: ${{ env.HUGO_VERSION }}
        extended: true

    - name: 📦 設置 Node.js
      uses: actions/setup-node@v4
      with:
        node-version: ${{ env.NODE_VERSION }}
        cache: 'yarn'

    - name: 📋 顯示環境資訊
      run: |
        echo "🔍 環境檢查:"
        echo "Node.js: $(node --version)"
        echo "Yarn: $(yarn --version)"
        echo "Hugo: $(hugo version)"
        if hugo version | grep -q "extended"; then
          echo "✅ Hugo Extended (支援 AVIF/WebP)"
        else
          echo "⚠️ Hugo 標準版本"
        fi

    - name: 📦 安裝依賴
      run: yarn install --frozen-lockfile

    - name: 🏗️ 建構網站 (含圖片最佳化)
      run: |
        echo "🏗️ Hugo 建構 (ESBuild + PostCSS + 圖片最佳化)..."
        HUGO_ENVIRONMENT=production hugo --gc --minify --logLevel info
        
        echo "📊 建構統計:"
        find public -name "*.html" | wc -l | xargs echo "  HTML 檔案:"
        find public -name "*.css" | wc -l | xargs echo "  CSS 檔案:"
        find public -name "*.js" | wc -l | xargs echo "  JS 檔案:"
        
        echo "📊 圖片格式統計:"
        find public -name "*.avif" | wc -l | xargs echo "  AVIF 檔案:"
        find public -name "*.webp" | wc -l | xargs echo "  WebP 檔案:"
        find public -name "*.jpg" -o -name "*.jpeg" | wc -l | xargs echo "  JPEG 檔案:"
        find public -name "*.png" | wc -l | xargs echo "  PNG 檔案:"
        find public -name "*.svg" | wc -l | xargs echo "  SVG 檔案:"
        
        du -sh public | cut -f1 | xargs echo "  總大小:"

    - name: 🔍 執行 SEO 檢查
      run: ./scripts/seo-check.sh

    - name: 🚀 部署到 Firebase Hosting (預覽)
      if: github.event_name == 'pull_request'
      uses: FirebaseExtended/action-hosting-deploy@v0
      with:
        repoToken: '${{ secrets.GITHUB_TOKEN }}'
        firebaseServiceAccount: '${{ secrets.FIREBASE_SERVICE_ACCOUNT }}'
        channelId: preview
        projectId: ${{ secrets.FIREBASE_PROJECT_ID }}

    - name: 🚀 部署到 Firebase Hosting (生產)
      if: github.ref == 'refs/heads/main' || github.ref == 'refs/heads/master'
      uses: FirebaseExtended/action-hosting-deploy@v0
      with:
        repoToken: '${{ secrets.GITHUB_TOKEN }}'
        firebaseServiceAccount: '${{ secrets.FIREBASE_SERVICE_ACCOUNT }}'
        channelId: live
        projectId: ${{ secrets.FIREBASE_PROJECT_ID }}

    - name: 📋 部署後驗證
      if: github.ref == 'refs/heads/main' || github.ref == 'refs/heads/master'
      run: |
        echo "🎉 部署完成！"
        echo "🌐 網站 URL: https://${{ secrets.FIREBASE_PROJECT_ID }}.web.app"
        echo "📱 Firebase Console: https://console.firebase.google.com/project/${{ secrets.FIREBASE_PROJECT_ID }}/hosting"
EOF
```

### 3.2 環境變數設定

**CLI 指令:**

```bash
# 創建環境變數範例檔案
cat > .env.example << 'EOF'
# Firebase 配置
FIREBASE_PROJECT_ID=your-firebase-project-id

# Hugo 環境變數
HUGO_ENVIRONMENT=production
HUGO_ENABLEGITINFO=true

# 第三方服務 API 金鑰 (可選)
GOOGLE_ANALYTICS_ID=GA-XXXXXXXXX
FACEBOOK_APP_ID=your-facebook-app-id
TWITTER_SITE=@username

# 部署相關
DEPLOY_BRANCH=main
PREVIEW_EXPIRES=7d
EOF

# 創建 GitHub Secrets 設定指南
cat > SETUP-SECRETS.md << 'EOF'
# GitHub Secrets 設定指南

## 必要的 Secrets

在 GitHub 儲存庫的 Settings > Secrets and variables > Actions 中設定以下 secrets：

### 1. FIREBASE_PROJECT_ID
- **值**: 您的 Firebase 專案 ID
- **說明**: 在 Firebase Console 中可以找到
- **範例**: `my-awesome-website-12345`

### 2. FIREBASE_SERVICE_ACCOUNT
- **值**: Firebase 服務帳戶 JSON 金鑰
- **說明**: 用於 GitHub Actions 自動部署
- **取得方式**:
  1. 前往 [Firebase Console](https://console.firebase.google.com/)
  2. 選擇您的專案
  3. 設定 > 專案設定 > 服務帳戶
  4. 產生新的私密金鑰
  5. 下載 JSON 檔案
  6. 將整個 JSON 內容貼到此 Secret

### 3. GITHUB_TOKEN (自動提供)
- **說明**: GitHub 自動提供，無需手動設定
- **用途**: 用於 Firebase GitHub 整合

## 設定步驟

1. **建立 Firebase 專案**:
   ```bash
   firebase projects:create your-project-id
   ```

2. **啟用 Hosting**:
   ```bash
   firebase use your-project-id
   firebase hosting:sites:create your-project-id
   ```

3. **產生服務帳戶金鑰**:
   - Firebase Console > 專案設定 > 服務帳戶
   - 點擊「產生新的私密金鑰」
   - 下載 JSON 檔案

4. **設定 GitHub Secrets**:
   - 將 JSON 檔案內容完整複製到 `FIREBASE_SERVICE_ACCOUNT`
   - 設定專案 ID 到 `FIREBASE_PROJECT_ID`

5. **測試部署**:
   ```bash
   git push origin main
   ```

## 安全注意事項

- 🔒 絕不在程式碼中暴露服務帳戶金鑰
- 🔒 定期輪換服務帳戶金鑰
- 🔒 限制服務帳戶權限 (僅 Hosting 相關)
- 🔒 監控部署日誌，確認無敏感資訊洩漏
EOF
```

### 3.3 部署驗證

**AI Prompt:**

```text
請協助我設置 GitHub Actions 自動化部署到 Firebase Hosting，基於 Hugo v0.147.9 官方架構標準：

工作流程要求：
- Hugo v0.147.9 Extended 版本 (支援 AVIF/WebP 圖片最佳化)
- Node.js 18+ 與 Yarn v4.6.0+ 現代化環境
- 自動安裝依賴與建構 (frozen-lockfile 確保一致性)
- 完整的 SEO 檢查與驗證流程

Firebase 部署策略：
- Pull Request: 自動部署到預覽頻道 (preview)
- Main/Master 分支: 自動部署到生產環境 (live)
- Firebase Service Account 認證 (安全性)
- 部署狀態回報與 URL 通知

Hugo Pipes 整合驗證：
- ESBuild JavaScript 處理確認
- PostCSS CSS 處理確認
- 圖片最佳化統計 (WebP, AVIF 檔案數量)
- 響應式圖片生成驗證 (多尺寸)
- 資源指紋識別確認

安全性與最佳實踐：
- GitHub Secrets 管理 (服務帳戶金鑰)
- 環境變數安全配置
- 最小權限原則 (僅 Hosting 權限)
- 部署日誌安全性檢查

請說明如何配置 GitHub Secrets 與 Firebase 認證，以及如何實現 Hugo 官方推薦的現代化 CI/CD 流程，特別是圖片最佳化的自動驗證。
```

## 4. 測試與驗證

### 4.1 本地測試

**CLI 指令:**

```bash
# 本地完整建構與部署測試
echo "🧪 開始本地建構與部署測試..."

# 1. 清理環境
echo "🧹 清理舊檔案..."
yarn clean

# 2. 安裝依賴
echo "📦 安裝最新依賴..."
yarn install

# 3. 建構專案
echo "🏗️ 執行生產建構..."
yarn build

# 4. SEO 檢查
echo "🔍 執行 SEO 檢查..."
./scripts/seo-check.sh

# 5. Firebase 本地測試
echo "🔥 啟動 Firebase 本地模擬器..."
echo "預覽 URL: http://localhost:5000"
echo "按 Ctrl+C 停止預覽"
firebase serve --only hosting

# 6. 檢查重要頁面
echo "📋 重要檔案檢查清單："
echo "✓ 檢查首頁載入"
echo "✓ 檢查 404 頁面"  
echo "✓ 檢查圖片載入 (WebP/AVIF)"
echo "✓ 檢查 CSS/JS 載入"
echo "✓ 檢查響應式設計"
echo "✓ 檢查深色/淺色主題切換"
```

### 4.2 部署後驗證

**CLI 指令:**

```bash
# 創建部署後驗證腳本
cat > scripts/post-deploy-check.sh << 'EOF'
#!/bin/bash

# 部署後驗證腳本

set -e

SITE_URL=${1:-"https://your-project-id.web.app"}

echo "🌐 驗證部署網站: $SITE_URL"

# 檢查網站是否可訪問
echo "🔍 檢查網站可訪問性..."
if curl -s --head "$SITE_URL" | head -n 1 | grep -q "200 OK"; then
  echo "✅ 網站可正常訪問"
else
  echo "❌ 網站無法訪問"
  exit 1
fi

# 檢查重要頁面
echo "📋 檢查重要頁面..."

# 首頁
if curl -s "$SITE_URL" | grep -q "<title>"; then
  echo "✅ 首頁正常載入"
else
  echo "❌ 首頁載入異常"
fi

# 404 頁面
if curl -s "$SITE_URL/non-existent-page" | grep -q "404"; then
  echo "✅ 404 頁面正常"
else
  echo "⚠️  404 頁面可能有問題"
fi

# Sitemap
if curl -s "$SITE_URL/sitemap.xml" | grep -q "<urlset"; then
  echo "✅ Sitemap 正常"
else
  echo "❌ Sitemap 有問題"
fi

# RSS Feed
if curl -s "$SITE_URL/index.xml" | grep -q "<rss"; then
  echo "✅ RSS Feed 正常"
else
  echo "❌ RSS Feed 有問題"
fi

# 檢查快取標頭 (隨機選擇一個 CSS 檔案)
echo "🚀 檢查快取策略..."
CSS_FILE=$(curl -s "$SITE_URL" | grep -o '[^"]*\.css' | head -1)
if [ -n "$CSS_FILE" ]; then
  CACHE_HEADER=$(curl -s --head "$SITE_URL/$CSS_FILE" | grep -i "cache-control")
  if echo "$CACHE_HEADER" | grep -q "max-age=31536000"; then
    echo "✅ CSS 快取策略正確"
  else
    echo "⚠️  CSS 快取策略可能有問題: $CACHE_HEADER"
  fi
fi

echo "🎉 部署驗證完成！"
echo "🌐 網站 URL: $SITE_URL"
EOF

chmod +x scripts/post-deploy-check.sh

# 使用說明
echo "使用方式: ./scripts/post-deploy-check.sh https://your-project-id.web.app"
```

## 5. 故障排除

### 常見問題與解決方案

#### 5.1 建構問題

**問題**: Hugo 建構失敗
```bash
# 檢查 Hugo 版本
hugo version

# 檢查 Hugo Extended 版本
hugo version | grep extended

# 重新安裝 Hugo Extended
# macOS (Homebrew)
brew install hugo

# Ubuntu/Debian
snap install hugo --channel=extended

# Windows (Chocolatey)
choco install hugo-extended
```

**問題**: 圖片最佳化失敗
```bash
# 檢查圖片檔案是否存在
find assets -name "*.jpg" -o -name "*.png" | head -5

# 檢查 Hugo Extended 支援
if hugo version | grep -q "extended"; then
  echo "支援 AVIF 處理"
else
  echo "僅支援 WebP 處理"
fi
```

#### 5.2 Firebase 部署問題

**問題**: Firebase 認證失敗
```bash
# 重新登入 Firebase
firebase logout
firebase login

# 檢查專案配置
firebase projects:list
firebase use --add
```

**問題**: 部署權限不足
```bash
# 檢查 Firebase 專案權限
firebase projects:list

# 檢查 Hosting 狀態
firebase hosting:sites:list
```

#### 5.3 GitHub Actions 問題

**問題**: Secrets 配置錯誤
- 檢查 `FIREBASE_SERVICE_ACCOUNT` 是否為完整 JSON
- 檢查 `FIREBASE_PROJECT_ID` 是否正確
- 檢查服務帳戶權限

**問題**: 建構時間過長
```yaml
# 在 workflow 中加入緩存優化
- name: Cache Hugo resources
  uses: actions/cache@v3
  with:
    path: resources
    key: ${{ runner.os }}-hugo-${{ hashFiles('config/**') }}
```

---

## 總結

這個 Firebase Hosting 部署指南提供了：

✅ **完整的配置指南** - 從初始化到生產部署
✅ **現代化快取策略** - 支援 WebP/AVIF 等現代圖片格式
✅ **自動化 CI/CD** - GitHub Actions 完整工作流程
✅ **詳細的驗證流程** - 建構前後的完整檢查
✅ **故障排除指南** - 常見問題的解決方案

現在您可以自信地將 Hugo 網站部署到 Firebase Hosting，享受全球 CDN 的速度與可靠性！

🌐 **Firebase Hosting 優勢**:
- 全球 CDN 自動分發
- 免費 SSL 憑證
- 自動壓縮與最佳化  
- 簡單的自訂網域設定
- 強大的快取控制
- 即時部署與回滾
