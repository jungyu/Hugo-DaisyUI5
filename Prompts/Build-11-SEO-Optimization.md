# Hugo + TailwindCSS + DaisyUI 專案 - 第11階段：建構優化與 SEO

> 本文檔是 Hugo + TailwindCSS + DaisyUI v5 專案建構指南的第11階段，專注於建構優化與 SEO 設定。
>
> 基於 Hugo v0.147.9 官方架構標準，整合 TailwindCSS v4.1.11、DaisyUI v5.0.43、Alpine.js v3.14.9 的現代化靜態網站建構方案。

## 前情回顧

在進入第11階段前，您應該已經完成：

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

現在，我們將專注於網站的建構優化與 SEO 設定，確保網站在搜尋引擎中的可見性和效能表現。

## 目錄

1. [Hugo 圖片最佳化配置](#1-hugo-圖片最佳化配置)
   - [圖片處理配置](#11-圖片處理配置)
   - [配置文件結構最佳實踐](#12-配置文件結構最佳實踐)
2. [生產環境建構腳本](#2-生產環境建構腳本)
   - [建構腳本設置](#21-建構腳本設置)
   - [SEO 與效能檢查腳本](#22-seo-與效能檢查腳本)
3. [下一階段預告](#下一階段預告)
4. [階段導航](#階段導航)

---

## 1. Hugo 圖片最佳化配置

### 1.1 圖片處理配置

Hugo Extended 版本提供了強大的圖片處理功能，可以生成現代格式（WebP/AVIF）和多尺寸響應式圖片。

**CLI 指令:**

```bash
# 創建 Hugo 圖片處理配置 (支援 WebP/AVIF 現代格式)
cat > config/_default/imaging.toml << 'EOF'
# Hugo v0.147.9 圖片處理配置
# 支援 WebP/AVIF 現代格式與多尺寸響應式圖片

[imaging]
  # 圖片處理品質設定
  quality = 85
  
  # 圖片重採樣濾波器 (Lanczos: 高品質但較慢, Box: 快速但品質較低)
  resampleFilter = "Lanczos"
  
  # 錨點設定 (用於裁切)
  anchor = "Smart"
  
  # 背景顏色 (透明圖片轉換為不支援透明格式時使用)
  bgColor = "#ffffff"
  
  # EXIF 方向處理
  exif = "IncludeFields"

# 響應式圖片尺寸配置 (用於 Hugo 圖片處理管道)
[params.images]
  # 標準響應式斷點
  sizes = [
    { width = 480, suffix = "xs" },
    { width = 768, suffix = "sm" },
    { width = 1024, suffix = "md" },
    { width = 1366, suffix = "lg" },
    { width = 1920, suffix = "xl" }
  ]
  
  # 現代格式優先級
  formats = ["avif", "webp", "jpg"]
  
  # 品質設定 (按格式)
  quality = {
    avif = 80,
    webp = 85,
    jpg = 90,
    png = 95
  }
  
  # 載入策略
  loading = "lazy"
  decoding = "async"
  
  # 圖片最佳化選項
  optimize = true
  progressive = true
  stripMetadata = true
EOF
```

現在我們需要創建一個圖片處理的 Shortcode，以便在內容中輕鬆使用這些優化：

```bash
# 創建圖片處理 Shortcode (支援現代格式)
mkdir -p themes/twda_v5/layouts/shortcodes

cat > themes/twda_v5/layouts/shortcodes/picture.html << 'EOF'
{{/* 
    現代圖片 Shortcode - 支援 WebP/AVIF + 響應式
    使用方式: {{< picture src="image.jpg" alt="描述" class="圖片CSS類別" >}}
*/}}

{{- $src := .Get "src" -}}
{{- $alt := .Get "alt" | default "" -}}
{{- $class := .Get "class" | default "" -}}
{{- $loading := .Get "loading" | default "lazy" -}}
{{- $sizes := .Get "sizes" | default "(min-width: 1024px) 1024px, (min-width: 768px) 768px, 100vw" -}}

{{- with resources.Get $src -}}
  {{- $original := . -}}
  
  <picture class="{{ $class }}">
    {{/* AVIF 格式 (最現代，檔案最小) */}}
    {{- if hugo.IsExtended -}}
      {{- range $size := site.Params.images.sizes -}}
        {{- $resized := $original.Resize (printf "%dx q%d avif" $size.width (site.Params.images.quality.avif | default 80)) -}}
        <source media="(max-width: {{ $size.width }}px)" 
                srcset="{{ $resized.RelPermalink }}" 
                type="image/avif">
      {{- end -}}
      {{- $avif := $original.Resize (printf "q%d avif" (site.Params.images.quality.avif | default 80)) -}}
      <source srcset="{{ $avif.RelPermalink }}" type="image/avif">
    {{- end -}}
    
    {{/* WebP 格式 (廣泛支援) */}}
    {{- range $size := site.Params.images.sizes -}}
      {{- $resized := $original.Resize (printf "%dx q%d webp" $size.width (site.Params.images.quality.webp | default 85)) -}}
      <source media="(max-width: {{ $size.width }}px)" 
              srcset="{{ $resized.RelPermalink }}" 
              type="image/webp">
    {{- end -}}
    {{- $webp := $original.Resize (printf "q%d webp" (site.Params.images.quality.webp | default 85)) -}}
    <source srcset="{{ $webp.RelPermalink }}" type="image/webp">
    
    {{/* 原始格式作為後備 */}}
    {{- $fallback := $original.Resize (printf "q%d" (site.Params.images.quality.jpg | default 90)) -}}
    <img src="{{ $fallback.RelPermalink }}" 
         alt="{{ $alt }}" 
         loading="{{ $loading }}"
         decoding="async"
         sizes="{{ $sizes }}"
         {{- if $class }} class="{{ $class }}"{{ end }}>
  </picture>
{{- else -}}
  <img src="{{ $src }}" alt="{{ $alt }}" loading="{{ $loading }}"{{ if $class }} class="{{ $class }}"{{ end }}>
{{- end -}}
EOF
```

此外，我們還需要創建自動圖片最佳化的 Partial：

```bash
# 創建自動圖片最佳化 Partial
cat > themes/twda_v5/layouts/partials/helpers/optimize-image.html << 'EOF'
{{/* 
    自動圖片最佳化 Partial
    參數: .src (必須), .alt, .class, .loading, .sizes
*/}}

{{- $src := .src -}}
{{- $alt := .alt | default "" -}}
{{- $class := .class | default "" -}}
{{- $loading := .loading | default "lazy" -}}
{{- $sizes := .sizes | default "(min-width: 1024px) 1024px, (min-width: 768px) 768px, 100vw" -}}

{{- with resources.Get $src -}}
  {{- $original := . -}}
  {{- $isAnimated := in (slice "gif") $original.MediaType.SubType -}}
  
  {{- if $isAnimated -}}
    {{/* 動畫 GIF 保持原格式 */}}
    <img src="{{ $original.RelPermalink }}" 
         alt="{{ $alt }}" 
         loading="{{ $loading }}"
         {{- if $class }} class="{{ $class }}"{{ end }}>
  {{- else -}}
    {{/* 使用 picture 元素進行格式最佳化 */}}
    {{- partial "helpers/picture-element" (dict 
        "image" $original 
        "alt" $alt 
        "class" $class 
        "loading" $loading 
        "sizes" $sizes) -}}
  {{- end -}}
{{- else -}}
  {{/* 外部圖片或不存在的圖片 */}}
  <img src="{{ $src }}" alt="{{ $alt }}" loading="{{ $loading }}"{{ if $class }} class="{{ $class }}"{{ end }}>
{{- end -}}
EOF

# 創建 Picture 元素 Partial
cat > themes/twda_v5/layouts/partials/helpers/picture-element.html << 'EOF'
{{/* Picture 元素生成器 */}}
{{- $image := .image -}}
{{- $alt := .alt | default "" -}}
{{- $class := .class | default "" -}}
{{- $loading := .loading | default "lazy" -}}
{{- $sizes := .sizes | default "(min-width: 1024px) 1024px, (min-width: 768px) 768px, 100vw" -}}

<picture{{ if $class }} class="{{ $class }}"{{ end }}>
  {{/* AVIF 格式 (Hugo Extended 版本才支援) */}}
  {{- if hugo.IsExtended -}}
    {{- $avif := $image.Resize (printf "q%d avif" (site.Params.images.quality.avif | default 80)) -}}
    <source srcset="{{ $avif.RelPermalink }}" type="image/avif">
  {{- end -}}
  
  {{/* WebP 格式 */}}
  {{- $webp := $image.Resize (printf "q%d webp" (site.Params.images.quality.webp | default 85)) -}}
  <source srcset="{{ $webp.RelPermalink }}" type="image/webp">
  
  {{/* 原始格式後備 */}}
  {{- $fallback := $image.Resize (printf "q%d" (site.Params.images.quality.jpg | default 90)) -}}
  <img src="{{ $fallback.RelPermalink }}" 
       alt="{{ $alt }}" 
       loading="{{ $loading }}"
       decoding="async"
       sizes="{{ $sizes }}">
</picture>
EOF
```

### 1.2 配置文件結構最佳實踐

在實際操作中，我們發現 Hugo 的配置文件結構需要遵循一些最佳實踐：

**注意事項:**

1. **配置文件分離**：
   - `imaging.toml` 應僅包含 `[imaging]` 部分
   - 圖片相關的其他參數應放在 `params.toml` 中的 `[images]` 部分

2. **正確的 TOML 語法**：
   - 避免在數組和表格間的語法混淆
   - 確保縮進和嵌套結構正確

**正確的配置文件結構:**

```bash
# 創建 imaging.toml (只包含 [imaging] 部分)
cat > config/_default/imaging.toml << 'EOF'
# Hugo v0.147.9 圖片處理配置

[imaging]
  # 圖片處理品質設定
  quality = 85
  
  # 圖片重採樣濾波器 (Lanczos: 高品質但較慢, Box: 快速但品質較低)
  resampleFilter = "Lanczos"
  
  # 錨點設定 (用於裁切)
  anchor = "Smart"
  
  # 背景顏色 (透明圖片轉換為不支援透明格式時使用)
  bgColor = "#ffffff"
  
  # EXIF 方向處理
  exif = "IncludeFields"
EOF

# 創建 params.toml (包含圖片相關參數)
cat > config/_default/params.toml << 'EOF'
# 響應式圖片配置
[images]
# 標準響應式斷點
sizes = [
  { width = 480, suffix = "xs" },
  { width = 768, suffix = "sm" },
  { width = 1024, suffix = "md" },
  { width = 1366, suffix = "lg" },
  { width = 1920, suffix = "xl" }
]

# 現代格式優先級
formats = ["avif", "webp", "jpg"]

# 品質設定
[images.quality]
avif = 80
webp = 85
jpg = 90
png = 95

# 載入策略
loading = "lazy"
decoding = "async"

# 圖片最佳化選項
optimize = true
progressive = true
stripMetadata = true
EOF
```

**重要提示:** Hugo 的配置文件需要嚴格遵循 TOML 語法規則，尤其是在處理嵌套結構和數組時。不正確的語法會導致建構失敗，錯誤消息可能會指向特定的行號和語法問題。

## 2. 生產環境建構腳本

### 2.1 建構腳本設置

為了確保生產環境的建構過程順利且優化，我們需要一個完整的建構腳本：

```bash
# 創建生產環境建構腳本
cat > scripts/build.sh << 'EOF'
#!/bin/bash

# 生產環境建構腳本 (Hugo v0.147.9 + TailwindCSS v4.1.11 + DaisyUI v5.0.43)
echo "🚀 開始建構 Hugo-DaisyUI5 專案..."

# 清理舊檔案
echo "🧹 清理舊檔案..."
rm -rf public resources .hugo_build.lock

# 安裝依賴
echo "📦 安裝依賴..."
yarn install --frozen-lockfile

# Hugo 建構 (生產環境，使用 Hugo Pipes 資源處理)
echo "🏗️ Hugo 建構 (ESBuild + PostCSS + 圖片最佳化)..."
HUGO_ENVIRONMENT=production hugo --gc --minify --logLevel info

# 檢查建構結果
if [ -d "public" ]; then
  echo "✅ 建構成功！"
  echo "📊 建構統計:"
  find public -type f -name "*.html" | wc -l | xargs echo "  HTML 檔案:"
  find public -type f -name "*.css" | wc -l | xargs echo "  CSS 檔案:"
  find public -type f -name "*.js" | wc -l | xargs echo "  JS 檔案:"
  echo "  圖片檔案分析:"
  find public -type f -name "*.webp" | wc -l | xargs echo "    WebP 檔案:"
  find public -type f -name "*.avif" | wc -l | xargs echo "    AVIF 檔案:"
  find public -type f -name "*.jpg" -o -name "*.jpeg" | wc -l | xargs echo "    JPEG 檔案:"
  find public -type f -name "*.png" | wc -l | xargs echo "    PNG 檔案:"
  find public -type f -name "*.svg" | wc -l | xargs echo "    SVG 檔案:"
  du -sh public | cut -f1 | xargs echo "  總大小:"
else
  echo "❌ 建構失敗！"
  exit 1
fi
EOF

chmod +x scripts/build.sh
```

### 2.2 SEO 與效能檢查腳本

SEO 與效能檢查是確保網站可被搜尋引擎有效索引的關鍵：

```bash
# 創建 SEO 與效能檢查腳本
cat > scripts/seo-check.sh << 'EOF'
#!/bin/bash

# SEO 與效能檢查腳本
echo "🔍 SEO 與效能檢查..."

# 檢查必要的 SEO 檔案
if [ -f "public/sitemap.xml" ]; then
  echo "✅ sitemap.xml 存在"
else
  echo "❌ sitemap.xml 缺失"
fi

if [ -f "public/robots.txt" ]; then
  echo "✅ robots.txt 存在"
else
  echo "❌ robots.txt 缺失"
fi

# 檢查 RSS 訂閱
if [ -f "public/index.xml" ]; then
  echo "✅ RSS 訂閱存在"
else
  echo "❌ RSS 訂閱缺失"
fi

# 檢查 JSON Feed
if [ -f "public/index.json" ]; then
  echo "✅ JSON Feed 存在"
else
  echo "❌ JSON Feed 缺失"
fi

echo "📈 效能檢查完成"
EOF

chmod +x scripts/seo-check.sh
```

**AI Prompt:**

```text
請協助我設置生產環境建構與 SEO 優化，基於 Hugo v0.147.9 官方架構標準：

建構優化：
- 自動清理舊檔案 (public, resources, .hugo_build.lock)
- 依賴安裝檢查 (yarn frozen-lockfile)
- Hugo 生產建構 (--gc --minify --logLevel info)
- 建構結果統計 (包含 WebP/AVIF 圖片)

SEO 檢查：
- sitemap.xml 生成 (Hugo 自動)
- robots.txt 配置 (enableRobotsTXT)
- RSS 訂閱 (index.xml)
- JSON Feed (index.json) 
- Open Graph 標籤
- Twitter Card 標籤
- 結構化數據 (JSON-LD)

Hugo Pipes 資源處理：
- ESBuild JavaScript 打包和最小化
- PostCSS CSS 處理和最小化  
- 圖片優化處理 (WebP, AVIF)
- 指紋識別和版本控制

請說明如何確保 SEO 最佳化與網站效能，遵循 Hugo 官方最佳實踐。
```

## 驗證清單

在進入下一階段之前，請確認您已完成以下項目：

- [ ] 設置了 Hugo 圖片處理配置，包括支援 WebP/AVIF 格式
- [ ] 創建了現代圖片處理的 Shortcode 和 Partial
- [ ] 分離了配置文件以符合 TOML 語法最佳實踐
- [ ] 創建並測試了生產環境建構腳本
- [ ] 設置了 SEO 與效能檢查腳本

## 下一階段預告

在下一階段（第12階段），我們將專注於測試和驗證流程，確保專案在各種環境中都能正確運作。我們將建立本地測試流程和建構驗證腳本，以捕捉並解決潛在問題。

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
- **第11階段：建構優化與 SEO**（當前階段）
- [第12階段：測試和驗證](./Build-12-Testing-Validation.md)
- [第13階段：常見問題與疑難排解](./Build-13-Common-Issues.md)
