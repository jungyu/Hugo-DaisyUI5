# Hugo + TailwindCSS + DaisyUI 專案 - 第12階段：測試和驗證

> 本文檔是 Hugo + TailwindCSS + DaisyUI v5 專案建構指南的第12階段，專注於測試和驗證流程。
>
> 基於 Hugo v0.147.9 官方架構標準，整合 TailwindCSS v4.1.11、DaisyUI v5.0.43、Alpine.js v3.14.9 的現代化靜態網站建構方案。

## 前情回顧

在進入第12階段前，您應該已經完成：

- **第1階段**：環境準備與驗證
- **第2階段**：Hugo 專案初始化
- **第3階段**：主題架構建立
- **第4階段**：基礎 HTML 模板
- **第5階段**：前端技術整合
- **第6階段**：Hugo 配置系統
- **第7階段**：Alpine.js 整合
- **第8階段**：CSS 框架整合與自定義元件
- **第9階段**：Hugo 資源處理
- **第10階段**：專案展示與範例
- **第11階段**：建構優化與 SEO

現在，我們將專注於測試和驗證流程，確保我們的 Hugo + TailwindCSS + DaisyUI v5 專案能夠在各種環境中正確運行。

## 目錄

1. [本地測試流程](#1-本地測試流程)
   - [完整本地測試步驟](#11-完整本地測試步驟)
   - [常見測試問題解決方案](#12-常見測試問題解決方案)
2. [建構驗證](#2-建構驗證)
   - [解決常見建構驗證問題](#21-解決常見建構驗證問題)
   - [改進的建構驗證腳本](#22-改進的建構驗證腳本)
3. [下一階段預告](#下一階段預告)
4. [階段導航](#階段導航)

---

## 1. 本地測試流程

在部署到生產環境前，完整的本地測試流程是確保網站質量的關鍵。

### 1.1 完整本地測試步驟

讓我們創建一個全面的測試腳本，它將幫助我們在部署前系統地測試整個專案：

**CLI 指令:**

```bash
# 確保在 hugo-twda-v5 目錄中執行以下指令
# cd hugo-twda-v5  # 如果尚未切換到此目錄

# 創建本地測試腳本
cat > scripts/test-local.sh << 'EOF'
#!/bin/bash
# 本地完整測試流程腳本 (test-local.sh)

echo "🧪 開始本地建構與驗證測試..."

# 1. 檢查 Hugo 版本
echo "📋 檢查 Hugo 版本..."
hugo version
if hugo version | grep -q "extended"; then
  echo "✅ 使用 Hugo Extended 版本 (支援 AVIF 圖片格式)"
else
  echo "⚠️ 使用 Hugo 標準版本 (不支援 AVIF 圖片格式)"
fi

# 2. 清理環境
echo "🧹 清理舊檔案..."
rm -rf public resources .hugo_build.lock
hugo mod clean --all 2>/dev/null || true

# 3. 檢查依賴
echo "📦 檢查 Node.js 依賴..."
yarn check || echo "⚠️ 依賴檢查失敗，繼續進行..."

# 4. 生產環境建構
echo "🏗️ 執行生產建構..."
./scripts/build.sh

# 5. SEO 檢查
echo "🔍 執行 SEO 檢查..."
./scripts/seo-check.sh

# 6. 建構驗證
echo "✅ 執行建構驗證..."
./scripts/validate-build.sh

# 7. 啟動本地服務器進行最終測試
echo "🌐 啟動本地服務器測試..."
echo "請訪問: http://localhost:1313"
echo "按 Ctrl+C 停止服務器..."
hugo server --port 1313
EOF

chmod +x scripts/test-local.sh
```

### 1.2 常見測試問題解決方案

在測試過程中，您可能會遇到一些常見問題。以下是解決方案：

#### 1.2.1 本地測試與生產環境不一致

由於環境差異，本地測試可能無法完全模擬生產環境。

**解決方案:** 使用模擬生產環境的標誌：

```bash
hugo server --environment production --minify --disableFastRender
```

這將使 Hugo 以生產模式運行，包括壓縮資源和禁用快速渲染，更接近實際部署環境。

#### 1.2.2 圖片處理問題

圖片處理是資源密集型操作，在本地可能較慢或失敗。

**解決方案:** 使用漸進式方法：

```bash
# 先進行小規模測試
hugo server --environment production --renderToDisk --disableFastRender --baseURL "http://localhost:1313" --bind "0.0.0.0" --cleanDestinationDir

# 檢查生成的圖片
ls -la resources/_gen/images/
```

這樣可以先驗證小規模的圖片處理是否正常，然後再進行完整建構。

#### 1.2.3 CSS 與 JavaScript 緩存問題

瀏覽器緩存可能導致 CSS 和 JavaScript 更改不可見。

**解決方案:** 使用強制刷新和私密模式進行測試：

- Chrome/Edge: Ctrl+Shift+R (Windows/Linux) 或 Cmd+Shift+R (Mac)
- Firefox: Ctrl+Shift+R
- Safari: Cmd+Option+R

或者，在本地開發時使用禁用緩存的模式：

```bash
hugo server --noHTTPCache
```

## 2. 建構驗證

全面的建構驗證確保網站可以正確部署到生產環境。

### 2.1 解決常見建構驗證問題

#### 2.1.1 檢測到硬編碼的 localhost 連結

驗證腳本可能會報告 HTML 文件中的硬編碼 localhost 連結。

**解決方案:**

1. 使用 `grep` 精確定位問題：

```bash
grep -r "localhost" public/ --include="*.html"
```

1. 在 Hugo 模板中使用相對路徑或站點配置的 URL：

```html
<!-- 不要使用 -->
<a href="http://localhost:1313/about">關於</a>

<!-- 應該使用 -->
<a href="{{ "about" | relURL }}">關於</a>
<!-- 或 -->
<a href="{{ .Site.BaseURL }}/about">關於</a>
```

#### 2.1.2 圖片格式支援問題

即使使用 Hugo Extended 版本，也可能遇到 AVIF/WebP 轉換問題。

**解決方案:**

1. 檢查 Hugo 二進制文件是否真正支援 AVIF：

```bash
# 建立測試圖片
hugo new "test-avif.md"
echo '{{< picture src="images/test.jpg" alt="Test" >}}' > content/test-avif.md

# 檢查生成的 AVIF 文件
hugo --minify
find public/ -name "*.avif"
```

1. 如果無法生成 AVIF，確保在 `picture` shortcode 中提供後備選項。

### 2.2 改進的建構驗證腳本

讓我們創建一個更全面的建構驗證腳本：

```bash
# 創建強化版建構驗證腳本
cat > scripts/validate-build.sh << 'EOF'
#!/bin/bash
# 強化版建構驗證腳本

set -e

echo "🔍 強化版建構完整性驗證..."

# 檢查建構目錄是否存在
if [ ! -d "public" ]; then
  echo "❌ public 目錄不存在，請先執行建構"
  exit 1
fi

# 驗證重要文件存在
echo "📋 檢查重要檔案..."
missing_files=0

check_file() {
  if [ -f "$1" ]; then
    echo "✓ $2 已生成"
  else
    echo "❌ $2 缺失 - $3"
    missing_files=$((missing_files+1))
  fi
}

check_file "public/index.html" "首頁" "檢查 content/_index.md 是否存在"
check_file "public/blogs/index.html" "文章列表" "檢查 content/blogs/_index.md 是否存在"
check_file "public/sitemap.xml" "網站地圖" "在 config.toml 中設置 enableRobotsTXT = true"
check_file "public/index.xml" "RSS 訂閱" "檢查 outputs 配置中是否包含 RSS"
check_file "public/index.json" "JSON Feed" "檢查 outputs 配置中是否包含 JSON"

if [ $missing_files -gt 0 ]; then
  echo "⚠️ 發現 $missing_files 個缺失文件，建議修復後再部署"
fi

# 驗證現代圖片格式支援
echo "📊 圖片格式驗證..."
if command -v hugo >/dev/null 2>&1; then
  if hugo version | grep -q "extended"; then
    echo "✓ Hugo Extended 版本 (支援 AVIF/WebP)"
    # 檢查是否有現代格式圖片生成
    webp_count=$(find public -name "*.webp" | wc -l)
    avif_count=$(find public -name "*.avif" | wc -l)
    
    if [ "$webp_count" -gt 0 ]; then
      echo "✓ WebP 圖片已生成: $webp_count 檔案"
    else
      echo "⚠️ 未發現 WebP 圖片，檢查 picture shortcode 是否正確配置"
    fi
    
    if [ "$avif_count" -gt 0 ]; then
      echo "✓ AVIF 圖片已生成: $avif_count 檔案"
    else
      echo "⚠️ 未發現 AVIF 圖片，確認 Hugo Extended 版本是否支援 AVIF 轉換"
    fi
  else
    echo "⚠️ Hugo 標準版本 (僅支援 WebP)"
  fi
else
  echo "❌ Hugo 命令不可用，無法確認版本"
fi

# 檢查硬編碼連結
echo "🔍 檢查硬編碼連結..."
hardcoded_localhost=$(grep -r "localhost" public/ --include="*.html" | wc -l)

if [ "$hardcoded_localhost" -gt 0 ]; then
  echo "⚠️ 發現 $hardcoded_localhost 處硬編碼的 localhost 連結："
  grep -r "localhost" public/ --include="*.html" | head -5
  echo "修復建議: 使用 {{ .Site.BaseURL }} 或 {{ \"path\" | relURL }} 代替硬編碼連結"
else
  echo "✓ 未發現硬編碼的 localhost 連結"
fi

# 檢查總檔案大小
TOTAL_SIZE=$(du -sh public | cut -f1)
echo "📊 建構統計："
echo "  總大小: $TOTAL_SIZE"

# 深入檢查
echo "🔬 深入檢查..."

# 檢查 HTML 有效性
html_files=$(find public -name "*.html" | wc -l)
echo "  HTML 檔案: $html_files"

# 檢查 CSS/JS 最小化
css_files=$(find public -name "*.css" | wc -l)
js_files=$(find public -name "*.js" | wc -l)

css_minified=$(grep -L "}" public/**/*.css 2>/dev/null | wc -l)
js_minified=$(grep -L ";" public/**/*.js 2>/dev/null | wc -l)

echo "  CSS 檔案: $css_files (可能已最小化: $css_minified)"
echo "  JS 檔案: $js_files (可能已最小化: $js_minified)"

echo "🎉 建構驗證完成！"

# 提供最終建議
if [ $missing_files -gt 0 ] || [ "$hardcoded_localhost" -gt 0 ]; then
  echo "⚠️ 建議: 修復上述問題後再部署到生產環境"
  exit 1
else
  echo "✅ 建構驗證通過！可以部署到生產環境"
  exit 0
fi
EOF

chmod +x scripts/validate-build.sh
```

**AI Prompt:**

```text
我需要一個全面的本地測試和建構驗證流程，基於 Hugo v0.147.9 + TailwindCSS v4.1.11 + DaisyUI v5.0.43 專案：

測試流程需求：
1. 檢查 Hugo 環境 (是否 Extended 版本)
2. 清理舊檔案與緩存
3. 驗證依賴完整性
4. 生產環境建構測試
5. SEO 元素檢查
6. 圖片格式轉換驗證 (WebP/AVIF)
7. 啟動本地服務器測試

常見問題檢測：
1. 硬編碼的 localhost 連結
2. CSS/JS 緩存問題
3. 圖片處理錯誤
4. 資源載入順序問題
5. 缺失的重要檔案 (sitemap.xml, robots.txt)

請提供一個完整的測試腳本和建構驗證腳本，能夠系統地檢查以上所有問題。
```

## 驗證清單

在進入下一階段之前，請確認您已完成以下項目：

- [ ] 創建並測試了本地測試腳本
- [ ] 了解並能夠解決常見的本地測試問題
- [ ] 設置了強化版建構驗證腳本
- [ ] 檢查並解決了硬編碼連結問題
- [ ] 驗證了圖片格式轉換功能
- [ ] 確保所有必要的 SEO 文件都正確生成

## 下一階段預告

在下一階段（第13階段），我們將探討 Hugo + TailwindCSS + DaisyUI v5 專案中的常見問題與疑難排解方法。我們將深入討論如何解決 DaisyUI v5 路徑問題、TOML 語法錯誤以及圖片處理錯誤等常見問題，幫助您更順暢地完成專案。

## 階段導航

- [第1階段：環境準備與驗證](./Build-1-Environment-Setup.md)
- [第2階段：Hugo 專案初始化](./Build-2-Hugo-Initialization.md)
- [第3階段：主題架構建立](./Build-3-Theme-Architecture.md)
- [第4階段：基礎 HTML 模板](./Build-4-Base-Templates.md)
- [第5階段：前端技術整合](./Build-5-Frontend-Integration.md)
- [第6階段：Hugo 配置系統](./Build-6-Hugo-Configuration.md)
- [第7階段：Alpine.js 整合](./Build-7-Alpinejs-Integration.md)
- [第8階段：CSS 框架整合與自定義元件](./Build-8-CSS-Framework-Integration.md)
- [第9階段：Hugo 資源處理](./Build-9-Hugo-Resource-Processing.md)
- [第10階段：專案展示與範例](./Build-10-Project-Showcase.md)
- [第11階段：建構優化與 SEO](./Build-11-SEO-Optimization.md)
- **第12階段：測試和驗證**（當前階段）
- [第13階段：常見問題與疑難排解](./Build-13-Common-Issues.md)
