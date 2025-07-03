# Hugo 專案建構階段 12：測試和驗證

> **專案狀態**: ✅ 進行中  
> **技術棧**: Hugo v0.147.9 + TailwindCSS v4.1.11 + DaisyUI v5.0.43 + Alpine.js v3.14.9

本階段專注於測試和驗證流程，確3. **在開發時禁用 HTTP 緩存**:

   ```bash
   hugo server --noHTTPCache
   ```

4. **瀏覽器強制刷新快捷鍵**:
   - Chrome/Edge: `Ctrl+Shift+R` (Windows/Linux) 或 `Cmd+Shift+R` (Mac)
   - Firefox: `Ctrl+Shift+R`
   - Safari: `Cmd+Option+R` 專案能夠在各種環境中正確運行，並且符合最佳實踐標準。我們將建立可靠的測試流程和驗證工具，以提高網站質量和穩定性。

## 階段目標

- 建立完整的本地測試流程
- 創建自動化建構驗證腳本
- 識別並解決常見測試與驗證問題
- 確保所有功能在不同環境中一致運作

## 前置條件

✅ 已完成 [階段 11：建構優化與 SEO](./Build-11-SEO-Optimization.md)  
✅ 已優化網站建構並實施 SEO 最佳實踐

## 步驟詳解

### 1. 本地測試流程

在部署到生產環境前，完整的本地測試流程是確保網站質量的關鍵。我們將創建一個系統化的測試流程，以驗證所有功能正常運作。

#### 1.1 完整本地測試腳本

以下是一個全面的測試腳本，可幫助我們在部署前系統地測試整個專案：

**CLI 指令:**

```bash
# 創建測試腳本目錄
mkdir -p scripts

# 創建本地測試腳本
cat > scripts/test-local.sh << 'EOF'
#!/bin/bash
# 本地完整測試流程腳本

echo "🧪 開始本地建構與驗證測試..."

# 1. 檢查 Hugo 版本
echo "📋 檢查 Hugo 版本..."
hugo version
if hugo version | grep -q "extended"; then
  echo "✅ 使用 Hugo Extended 版本 (支援 AVIF/WebP 圖片格式)"
else
  echo "⚠️ 使用 Hugo 標準版本 (僅支援基本圖片處理)"
fi

# 2. 清理環境
echo "🧹 清理舊檔案..."
rm -rf public resources .hugo_build.lock

# 3. 檢查依賴
echo "📦 檢查 Node.js 依賴..."
yarn install --check-files || echo "⚠️ 依賴檢查失敗，請執行 yarn install"

# 4. 生產環境建構
echo "🏗️ 執行生產建構..."
HUGO_ENVIRONMENT=production hugo --gc --minify --logLevel info

# 5. 基本檢查
echo "� 建構統計:"
find public -type f -name "*.html" | wc -l | xargs echo "  HTML 檔案:"
find public -type f -name "*.css" | wc -l | xargs echo "  CSS 檔案:"
find public -type f -name "*.js" | wc -l | xargs echo "  JS 檔案:"
echo "  圖片檔案分析:"
find public -type f -name "*.webp" | wc -l | xargs echo "    WebP 檔案:"
find public -type f -name "*.avif" | wc -l | xargs echo "    AVIF 檔案:"
find public -type f -name "*.jpg" -o -name "*.jpeg" -o -name "*.png" | wc -l | xargs echo "    原始圖片檔案:"

# 6. 檢查關鍵檔案
echo "🔍 檢查關鍵檔案..."
[ -f "public/index.html" ] && echo "✓ 首頁存在" || echo "❌ 首頁缺失"
[ -f "public/sitemap.xml" ] && echo "✓ Sitemap 存在" || echo "❌ Sitemap 缺失"
[ -f "public/robots.txt" ] && echo "✓ robots.txt 存在" || echo "❌ robots.txt 缺失"
[ -f "public/index.xml" ] && echo "✓ RSS Feed 存在" || echo "❌ RSS Feed 缺失"

# 7. 啟動本地服務器進行測試
echo "🌐 啟動本地服務器測試..."
echo "請訪問: http://localhost:1313"
echo "按 Ctrl+C 停止服務器..."
hugo server --environment production --disableFastRender --port 1313
EOF

chmod +x scripts/test-local.sh
```

#### 1.2 常見測試問題解決方案

測試過程中可能會遇到一些常見問題，以下是識別和解決這些問題的方法：

##### 1.2.1 本地測試與生產環境差異

**問題**: 本地測試環境與生產環境的差異可能導致部署後出現意外問題。

**解決方案**: 使用生產環境配置進行測試：

```bash
# 完整模擬生產環境的本地測試
hugo server --environment production --renderToDisk --disableFastRender --baseURL "http://localhost:1313"
```

這些參數的作用：

- `--environment production`: 使用生產環境配置
- `--renderToDisk`: 將檔案實際寫入磁盤，而不只是記憶體中的模擬
- `--disableFastRender`: 禁用快速渲染，確保完整重建所有頁面

##### 1.2.2 圖片處理效能問題

**問題**: 圖片處理是資源密集型操作，大量圖片可能導致本地開發緩慢。

**解決方案**: 分階段處理和緩存優化：

```bash
# 建立圖片處理緩存
hugo --environment development

# 進行開發時使用 --noHTTPCache 避免瀏覽器緩存問題
hugo server --noHTTPCache --disableLiveReload
```

**監控圖片處理狀態**:

```bash
# 檢查已處理的圖片
ls -la resources/_gen/images/
```

##### 1.2.3 緩存相關問題

**問題**: Hugo 和瀏覽器緩存可能導致變更不立即可見。

**解決方案**:

1. **清除 Hugo 緩存**:
   ```bash
   # 清除 Hugo 緩存
   hugo mod clean --all
   rm -rf resources
   ```

2. **在開發時禁用 HTTP 緩存**:
   ```bash
   hugo server --noHTTPCache
   ```

3. **瀏覽器強制刷新快捷鍵**:
   - Chrome/Edge: `Ctrl+Shift+R` (Windows/Linux) 或 `Cmd+Shift+R` (Mac)
   - Firefox: `Ctrl+Shift+R`
   - Safari: `Cmd+Option+R`

### 2. 建構驗證流程

全面的建構驗證確保網站可以正確部署到生產環境，並符合質量標準。我們將建立一個自動化的驗證流程，檢查常見問題並提供修復建議。

#### 2.1 常見建構問題與解決方法

在建構過程中可能會遇到的一些常見問題及其解決方法：

##### 2.1.1 硬編碼的 URL 問題

**問題**: 硬編碼的 URL（如 localhost）會導致生產環境中的連結錯誤。

**診斷**:

```bash
# 檢查硬編碼的 localhost 連結
grep -r "localhost" public/ --include="*.html"
```

**解決方案**:

在 Hugo 模板中使用相對路徑或配置的 BaseURL：

```html
<!-- ❌ 不要使用 -->
<a href="http://localhost:1313/about">關於</a>

<!-- ✅ 應該使用 -->
<a href="{{ "about" | relURL }}">關於</a>
<!-- 或 -->
<a href="{{ .Site.BaseURL }}/about">關於</a>
```

##### 2.1.2 圖片格式與處理問題

**問題**: 圖片格式轉換失敗或圖片優化效果不佳。

**診斷**:

```bash
# 檢查是否生成了現代格式圖片
find public/ -name "*.webp" | wc -l
find public/ -name "*.avif" | wc -l
```

**解決方案**:

1. 確保使用 Hugo Extended 版本
2. 檢查 imaging.toml 配置
3. 為所有圖片提供後備格式

```go
{{/* 在 shortcode 或 partial 中 */}}
{{ if hugo.IsExtended }}
  {{/* AVIF/WebP 處理 */}}
{{ else }}
  {{/* 提供後備格式 */}}
{{ end }}
```

#### 2.2 自動化建構驗證腳本

以下是一個全面的建構驗證腳本，可以自動檢測常見問題並提供修復建議：

```bash
# 創建強化版建構驗證腳本
cat > scripts/validate-build.sh << 'EOF'
#!/bin/bash
# 強化版建構驗證腳本 - Hugo v0.147.9 + TailwindCSS v4.1.11 + DaisyUI v5.0.43

echo "🔍 開始執行建構完整性驗證..."

# 檢查建構目錄是否存在
if [ ! -d "public" ]; then
  echo "❌ public 目錄不存在，請先執行 'hugo' 或 './scripts/build.sh'"
  exit 1
fi

# 驗證重要文件存在
echo "📋 檢查關鍵檔案..."
missing_files=0

check_file() {
  if [ -f "$1" ]; then
    echo "✓ $2 已生成"
  else
    echo "❌ $2 缺失 - $3"
    missing_files=$((missing_files+1))
  fi
}

# 檢查核心檔案
check_file "public/index.html" "首頁" "檢查 content/_index.md 是否存在"
check_file "public/sitemap.xml" "網站地圖" "在 config.toml 中設置 enableRobotsTXT = true"
check_file "public/robots.txt" "Robots.txt" "在 config.toml 中設置 enableRobotsTXT = true"
check_file "public/index.xml" "RSS 訂閱" "檢查 outputs 配置中是否包含 RSS"

# 驗證現代圖片格式支援
echo "�️ 圖片格式驗證..."
if hugo version | grep -q "extended"; then
  echo "✓ 使用 Hugo Extended 版本"
  # 檢查是否有現代格式圖片生成
  webp_count=$(find public -name "*.webp" | wc -l)
  avif_count=$(find public -name "*.avif" | wc -l)
  
  if [ "$webp_count" -gt 0 ]; then
    echo "✓ WebP 圖片已生成: $webp_count 檔案"
  else
    echo "⚠️ 未發現 WebP 圖片，請檢查圖片處理配置"
  fi
  
  if [ "$avif_count" -gt 0 ]; then
    echo "✓ AVIF 圖片已生成: $avif_count 檔案"
  else
    echo "⚠️ 未發現 AVIF 圖片，請檢查 Hugo Extended 版本和配置"
  fi
else
  echo "⚠️ 使用 Hugo 標準版本 (部分圖片處理功能可能不可用)"
fi

# 檢查 SEO 元素
echo "🔍 SEO 元素檢查..."
grep -q "canonical" public/index.html && echo "✓ 包含 canonical 標籤" || echo "❌ 缺少 canonical 標籤"
grep -q "og:title" public/index.html && echo "✓ 包含 Open Graph 標籤" || echo "❌ 缺少 Open Graph 標籤"
grep -q "application/ld+json" public/index.html && echo "✓ 包含結構化數據" || echo "❌ 缺少結構化數據"

# 檢查硬編碼連結
echo "� 檢查硬編碼連結..."
hardcoded_localhost=$(grep -r "localhost" public/ --include="*.html" | wc -l)

if [ "$hardcoded_localhost" -gt 0 ]; then
  echo "⚠️ 發現 $hardcoded_localhost 處硬編碼的 localhost 連結"
  grep -r "localhost" public/ --include="*.html" | head -3
  echo "修復建議: 使用 {{ .Site.BaseURL }} 或 {{ \"path\" | relURL }}"
else
  echo "✓ 未發現硬編碼連結"
fi

# 檢查資源最小化
echo "📦 資源最小化檢查..."
non_minified_css=$(grep -l "  " public/**/*.css 2>/dev/null | wc -l)
non_minified_js=$(grep -l "  " public/**/*.js 2>/dev/null | wc -l)

if [ "$non_minified_css" -gt 0 ] || [ "$non_minified_js" -gt 0 ]; then
  echo "⚠️ 可能有未最小化的資源文件，建議在 config.toml 中設置 minify = true"
else
  echo "✓ 資源文件已最小化"
fi

# 檢查建構統計
echo "� 建構統計:"
find public -type f -name "*.html" | wc -l | xargs echo "  HTML 檔案:"
find public -type f -name "*.css" | wc -l | xargs echo "  CSS 檔案:"
find public -type f -name "*.js" | wc -l | xargs echo "  JS 檔案:"
du -sh public | cut -f1 | xargs echo "  總大小:"

# 結論
echo "� 驗證總結:"
if [ $missing_files -gt 0 ] || [ "$hardcoded_localhost" -gt 0 ]; then
  echo "⚠️ 發現潛在問題，建議修復後再部署"
  exit 1
else
  echo "✅ 建構驗證通過！可以部署到生產環境"
fi
EOF

chmod +x scripts/validate-build.sh
```

#### 2.3 整合至 CI/CD 流程

建構驗證腳本可以整合到 CI/CD 流程中，確保每次部署前都進行全面檢查：

```yaml
# .github/workflows/hugo-deploy.yml 示例
name: Hugo Build and Deploy

on:
  push:
    branches:
      - main

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v3
      
      - name: Setup Hugo
        uses: peaceiris/actions-hugo@v2
        with:
          hugo-version: '0.147.9'
          extended: true
      
      - name: Build
        run: hugo --minify
      
      - name: Validate Build
        run: ./scripts/validate-build.sh
      
      - name: Deploy
        if: success()
        # 部署步驟...
```

### 3. 性能測試與優化

建構驗證後，進行性能測試也很重要。可以使用以下工具進行測試：

1. Google Lighthouse (內建於 Chrome DevTools)
2. WebPageTest ([webpagetest.org](https://www.webpagetest.org/))
3. PageSpeed Insights ([pagespeed.web.dev](https://pagespeed.web.dev/))

主要性能指標：

- 首次內容繪製 (FCP)
- 最大內容繪製 (LCP)
- 首次輸入延遲 (FID)
- 累積布局偏移 (CLS)
- 總阻塞時間 (TBT)

## 參考資源

- [Hugo 官方測試指南](https://gohugo.io/getting-started/usage/)
- [TailwindCSS v4 效能優化](https://tailwindcss.com/blog/tailwindcss-v4)
- [Web Vitals 性能指標](https://web.dev/vitals/)
- [Google Lighthouse 工具](https://developers.google.com/web/tools/lighthouse)
- [WebPageTest 性能測試](https://www.webpagetest.org/)

## 驗證清單

在進入下一階段之前，請確認您已完成以下項目：

- [ ] 創建並測試了本地測試腳本
- [ ] 了解並能夠解決常見的本地測試問題
- [ ] 設置了強化版建構驗證腳本
- [ ] 檢查並解決了硬編碼連結問題
- [ ] 驗證了圖片格式轉換功能
- [ ] 確保所有必要的 SEO 元素都正確生成
- [ ] 測試了網站在不同環境下的性能表現

## 下一階段預告

在下一階段（階段 13），我們將探討 Hugo + TailwindCSS + DaisyUI 專案中的常見問題與疑難排解方法。我們將深入討論如何解決 DaisyUI v5 相關問題、TOML/YAML 配置語法錯誤以及圖片處理錯誤等常見問題，幫助您更順暢地完成專案。

## 階段導航

- [階段 1：環境準備與驗證](./Build-1-Environment-Setup.md)
- [階段 2：Hugo 專案初始化](./Build-2-Hugo-Initialization.md)
- [階段 3：主題架構建立](./Build-3-Theme-Architecture.md)
- [階段 4：基礎 HTML 模板](./Build-4-Base-Templates.md)
- [階段 5：前端技術整合](./Build-5-Frontend-Integration.md)
- [階段 6：Hugo 配置系統](./Build-6-Hugo-Configuration.md)
- [階段 7：Alpine.js 整合](./Build-7-Alpinejs-Integration.md)
- [階段 8：CSS 框架整合與自定義元件](./Build-8-CSS-Framework-Integration.md)
- [階段 9：Hugo 資源處理](./Build-9-Hugo-Resource-Processing.md)
- [階段 10：專案展示與範例](./Build-10-Project-Showcase.md)
- [階段 11：建構優化與 SEO](./Build-11-SEO-Optimization.md)
- **階段 12：測試和驗證**（當前階段）
- [階段 13：常見問題與疑難排解](./Build-13-Common-Issues.md)
