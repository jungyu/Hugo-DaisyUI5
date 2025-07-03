# Hugo 專案建構階段 11：建構優化與 SEO

> **專案狀態**: ✅ 進行中  
> **技術棧**: Hugo v0.147.9 + TailwindCSS v4.1.11 + DaisyUI v5.0.43 + Alpine.js v3.14.9

本階段專注於網站的建構優化與 SEO 設定，確保網站在搜尋引擎中的可見性和效能表現，同時優化整體建構流程。

## 階段目標

- 配置 Hugo 圖片最佳化處理
- 設置 SEO 相關 Meta 標籤和結構化數據
- 創建生產環境建構與檢查腳本
- 優化網站載入速度和使用者體驗

## 前置條件

✅ 已完成 [階段 10：專案展示與範例](./Build-10-Project-Showcase.md)  
✅ 已建立基本網站內容和主題展示

## 步驟詳解

### 1. Hugo 圖片最佳化配置

#### 1.1 圖片處理配置

Hugo Extended 版本提供了強大的圖片處理功能，可以生成現代格式（WebP/AVIF）和多尺寸響應式圖片。

**CLI 指令:**

```bash
# 創建 Hugo 圖片處理配置 (支援 WebP/AVIF 現代格式)
cat > config/_default/imaging.toml << 'EOF'
# Hugo v0.147.9 圖片處理配置
[imaging]
  # 圖片處理品質設定
  quality = 90
  
  # 圖片重採樣濾波器 (Lanczos: 高品質但較慢, Box: 快速但品質較低)
  resampleFilter = "lanczos"
  
  # 錨點設定 (用於裁切)
  anchor = "smart"
  
  # 背景顏色 (透明圖片轉換為不支援透明格式時使用)
  bgColor = "#ffffff"

[exif]
  disableDate = true
  disableLatLong = true
  includeFields = ""
  excludeFields = ""
EOF

# 創建參數配置 (包含圖片處理擴展設定)
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

#### 1.2 圖片處理 Shortcode 和 Partial

為了更好地管理和組織圖片處理功能，我們將創建專用的 Shortcode 和 Partial：

##### 1.2.1 基礎圖片處理 Shortcode

```bash
# 創建圖片處理 Shortcode 目錄
mkdir -p themes/twda_v5/layouts/shortcodes

# 創建自適應圖片 Shortcode
cat > themes/twda_v5/layouts/shortcodes/adaptive-image.html << 'EOF'
{{ $src := .Get "src" }}
{{ $alt := .Get "alt" | default "" }}
{{ $class := .Get "class" | default "" }}
{{ $caption := .Get "caption" | default "" }}
{{ $lazy := .Get "lazy" | default "true" }}

{{ $image := resources.Get $src }}
{{ if $image }}
  {{ $tiny := $image.Resize "20x jpg q20" }}
  {{ $small := $image.Resize "600x webp q85" }}
  {{ $medium := $image.Resize "1200x webp q85" }}
  {{ $large := $image.Resize "1800x webp q85" }}
  {{ $original := $image.Resize "2400x webp q90" }}
  
  <figure class="{{ $class }}">
    <div class="relative overflow-hidden">
      <!-- 模糊載入預覽 -->
      <img
        src="{{ $tiny.RelPermalink }}"
        class="w-full h-auto filter blur-xl absolute inset-0 object-cover"
        aria-hidden="true"
      />
      
      <!-- 主要自適應圖片 -->
      <img
        {{ if eq $lazy "true" }}loading="lazy"{{ end }}
        src="{{ $small.RelPermalink }}"
        srcset="
          {{ $small.RelPermalink }} 600w,
          {{ $medium.RelPermalink }} 1200w,
          {{ $large.RelPermalink }} 1800w,
          {{ $original.RelPermalink }} 2400w
        "
        sizes="(max-width: 600px) 100vw, (max-width: 1200px) 85vw, 75vw"
        alt="{{ $alt }}"
        width="{{ $image.Width }}"
        height="{{ $image.Height }}"
        class="w-full h-auto relative z-10"
      />
    </div>
    
    {{ if $caption }}
      <figcaption class="text-sm text-center mt-2 text-base-content/70">{{ $caption | markdownify }}</figcaption>
    {{ end }}
  </figure>
{{ else }}
  <div class="p-4 bg-error text-error-content rounded">圖片檔案無法載入: {{ $src }}</div>
{{ end }}
EOF
```

##### 1.2.2 進階圖片處理 Partial

如需更進階的圖片處理功能，我們可以創建專用的 Partial 用於整合到其他模板中：

```bash
# 創建 helpers 目錄
mkdir -p themes/twda_v5/layouts/partials/helpers

# 創建圖片處理 Partial
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
    <picture{{ if $class }} class="{{ $class }}"{{ end }}>
      {{/* WebP 格式 */}}
      {{- $webp := $original.Resize (printf "q%d webp" (site.Params.images.quality.webp | default 85)) -}}
      <source srcset="{{ $webp.RelPermalink }}" type="image/webp">
      
      {{/* 原始格式後備 */}}
      {{- $fallback := $original.Resize (printf "q%d" (site.Params.images.quality.jpg | default 90)) -}}
      <img src="{{ $fallback.RelPermalink }}" 
           alt="{{ $alt }}" 
           loading="{{ $loading }}"
           decoding="async"
           sizes="{{ $sizes }}">
    </picture>
  {{- end -}}
{{- else -}}
  {{/* 外部圖片或不存在的圖片 */}}
  <img src="{{ $src }}" alt="{{ $alt }}" loading="{{ $loading }}"{{ if $class }} class="{{ $class }}"{{ end }}>
{{- end -}}
EOF
```

**重要提示:** 使用 Hugo 的圖片處理功能需要安裝 Hugo Extended 版本，該版本包含了圖片處理所需的依賴庫。確保你的配置文件遵循正確的 TOML 或 YAML 語法，以避免建構錯誤。

### 2. SEO 最佳化配置

#### 2.1 基礎 SEO 設定

Hugo 提供了多種方式來優化網站的 SEO。讓我們創建一個完整的 SEO Partial，包含所有必要的 Meta 標籤：

```bash
# 創建 SEO Partial
cat > themes/twda_v5/layouts/partials/head/seo.html << 'EOF'
{{/* 基本 SEO 標籤 */}}
<title>{{ if .IsHome }}{{ site.Title }}{{ else }}{{ .Title }} | {{ site.Title }}{{ end }}</title>
<meta name="description" content="{{ with .Description }}{{ . }}{{ else }}{{ with site.Params.description }}{{ . }}{{ end }}{{ end }}">
<link rel="canonical" href="{{ .Permalink }}">

{{/* Open Graph 標籤 */}}
<meta property="og:locale" content="{{ site.LanguageCode | default "zh-tw" }}">
<meta property="og:type" content="{{ if .IsPage }}article{{ else }}website{{ end }}">
<meta property="og:title" content="{{ if .IsHome }}{{ site.Title }}{{ else }}{{ .Title }} | {{ site.Title }}{{ end }}">
<meta property="og:description" content="{{ with .Description }}{{ . }}{{ else }}{{ with site.Params.description }}{{ . }}{{ end }}{{ end }}">
<meta property="og:url" content="{{ .Permalink }}">
<meta property="og:site_name" content="{{ site.Title }}">
{{ if .IsPage }}
<meta property="article:published_time" content="{{ .PublishDate.Format "2006-01-02T15:04:05-07:00" | safeHTML }}">
<meta property="article:modified_time" content="{{ .Lastmod.Format "2006-01-02T15:04:05-07:00" | safeHTML }}">
{{ end }}

{{/* Twitter Card 標籤 */}}
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="{{ if .IsHome }}{{ site.Title }}{{ else }}{{ .Title }} | {{ site.Title }}{{ end }}">
<meta name="twitter:description" content="{{ with .Description }}{{ . }}{{ else }}{{ with site.Params.description }}{{ . }}{{ end }}{{ end }}">

{{/* 圖片相關 SEO */}}
{{ with $.Params.image }}
  {{ $image := resources.Get . }}
  {{ if $image }}
    {{ $thumbnail := $image.Fill "1200x630" }}
    <meta property="og:image" content="{{ $thumbnail.Permalink }}">
    <meta property="og:image:width" content="{{ $thumbnail.Width }}">
    <meta property="og:image:height" content="{{ $thumbnail.Height }}">
    <meta name="twitter:image" content="{{ $thumbnail.Permalink }}">
  {{ else }}
    {{/* 使用默認圖片或站點標誌 */}}
    {{ with site.Params.defaultImage }}
      <meta property="og:image" content="{{ . | absURL }}">
      <meta name="twitter:image" content="{{ . | absURL }}">
    {{ end }}
  {{ end }}
{{ else }}
  {{/* 使用默認圖片或站點標誌 */}}
  {{ with site.Params.defaultImage }}
    <meta property="og:image" content="{{ . | absURL }}">
    <meta name="twitter:image" content="{{ . | absURL }}">
  {{ end }}
{{ end }}

{{/* Schema.org JSON-LD 結構化數據 */}}
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  {{ if .IsHome }}
  "@type": "WebSite",
  "name": "{{ site.Title }}",
  "url": "{{ site.BaseURL }}",
  "description": "{{ site.Params.description }}",
  "potentialAction": {
    "@type": "SearchAction",
    "target": "{{ site.BaseURL }}search/?q={search_term_string}",
    "query-input": "required name=search_term_string"
  }
  {{ else if .IsPage }}
  "@type": "Article",
  "mainEntityOfPage": {
    "@type": "WebPage",
    "@id": "{{ .Permalink }}"
  },
  "headline": "{{ .Title }}",
  "description": "{{ with .Description }}{{ . }}{{ else }}{{ with site.Params.description }}{{ . }}{{ end }}{{ end }}",
  "datePublished": "{{ .PublishDate.Format "2006-01-02T15:04:05-07:00" | safeHTML }}",
  "dateModified": "{{ .Lastmod.Format "2006-01-02T15:04:05-07:00" | safeHTML }}",
  {{ with site.Params.author }}
  "author": {
    "@type": "Person",
    "name": "{{ . }}"
  },
  {{ end }}
  "publisher": {
    "@type": "Organization",
    "name": "{{ site.Title }}",
    "logo": {
      "@type": "ImageObject",
      "url": "{{ site.Params.logo | absURL }}"
    }
  }
  {{ end }}
}
</script>
EOF
```

現在在 `head.html` 中引用這個 SEO Partial：

```bash
# 修改 head.html 以引用 SEO Partial
cat > themes/twda_v5/layouts/partials/head.html << 'EOF'
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  
  <!-- SEO Meta 標籤 -->
  {{ partial "head/seo.html" . }}
  
  <!-- 關鍵 CSS 內聯 -->
  {{ partial "critical-css.html" . }}
  
  <!-- 使用 Hugo Pipes 處理 CSS -->
  {{ $commonStyles := resources.Get "css/app.css" | resources.PostCSS }}
  
  {{ if hugo.IsProduction }}
    <!-- 生產環境: 最小化 + 指紋碼 -->
    {{ $commonStyles = $commonStyles | minify | fingerprint "sha512" }}
    <link rel="preload" href="{{ $commonStyles.RelPermalink }}" as="style">
    <link rel="stylesheet" href="{{ $commonStyles.RelPermalink }}" integrity="{{ $commonStyles.Data.Integrity }}" crossorigin="anonymous" media="print" onload="this.media='all'">
    <noscript><link rel="stylesheet" href="{{ $commonStyles.RelPermalink }}" integrity="{{ $commonStyles.Data.Integrity }}" crossorigin="anonymous"></noscript>
  {{ else }}
    <!-- 開發環境 -->
    <link rel="stylesheet" href="{{ $commonStyles.RelPermalink }}">
  {{ end }}
  
  <!-- Alpine.js -->
  <script defer src="https://cdn.jsdelivr.net/npm/alpinejs@3.14.9/dist/cdn.min.js"></script>
  
  <!-- 頁面特定樣式 -->
  {{ block "head_styles" . }}{{ end }}
  
  <!-- 頁面特定腳本 -->
  {{ block "head_scripts" . }}{{ end }}
  
  <!-- 網站驗證 -->
  {{ with site.Params.googleSiteVerification }}
  <meta name="google-site-verification" content="{{ . }}">
  {{ end }}
  
  <!-- 網站圖標 -->
  <link rel="icon" type="image/x-icon" href="/favicon.ico">
  <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
  <link rel="apple-touch-icon" href="/apple-touch-icon.png">
</head>
EOF
```

#### 2.2 SEO 配置與建構腳本

為了確保生產環境的建構過程包含所有 SEO 優化，我們需要一個完整的建構和檢查腳本：

```bash
# 創建 SEO 配置
cat > config/_default/sitemap.toml << 'EOF'
# Sitemap 設定
changefreq = "weekly"
filename = "sitemap.xml"
priority = 0.5
EOF

# 創建生產環境建構腳本
mkdir -p scripts
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

# 檢查 Schema.org 結構化數據
echo "正在檢查結構化數據..."
grep -r "application/ld+json" public/index.html > /dev/null
if [ $? -eq 0 ]; then
  echo "✅ Schema.org 結構化數據存在"
else
  echo "❌ Schema.org 結構化數據缺失"
fi

echo "📈 效能檢查完成"
EOF

chmod +x scripts/seo-check.sh
```

### 3. 建構優化最佳實踐

在進行生產環境建構時，有一些最佳實踐可以幫助我們獲得更好的效能和用戶體驗：

#### 3.1 資源最小化與指紋識別

Hugo Pipes 提供了強大的資源處理功能，可以進行最小化和指紋識別：

```go
{{ $style := resources.Get "css/app.css" | resources.PostCSS | minify | fingerprint "sha512" }}
<link rel="stylesheet" href="{{ $style.RelPermalink }}" integrity="{{ $style.Data.Integrity }}">

{{ $script := resources.Get "js/app.js" | js.Build | minify | fingerprint "sha512" }}
<script src="{{ $script.RelPermalink }}" integrity="{{ $script.Data.Integrity }}"></script>
```

#### 3.2 延遲載入技術

對於非關鍵資源，我們可以使用延遲載入技術來提高頁面載入速度：

```html
<!-- 延遲載入 CSS -->
<link rel="preload" href="/css/main.css" as="style" onload="this.onload=null;this.rel='stylesheet'">
<noscript><link rel="stylesheet" href="/css/main.css"></noscript>

<!-- 延遲載入圖片 -->
<img src="placeholder.jpg" data-src="actual-image.jpg" loading="lazy" class="lazyload">
```

#### 3.3 關鍵 CSS 內聯

對於首屏渲染的關鍵 CSS，我們可以將其內聯到 HTML 中，避免網絡請求延遲：

```bash
# 創建關鍵 CSS Partial
cat > themes/twda_v5/layouts/partials/critical-css.html << 'EOF'
<style>
/* 關鍵渲染路徑 CSS */
:root {
  color-scheme: light dark;
}
body {
  margin: 0;
  font-family: system-ui, sans-serif;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}
main {
  flex: 1;
}
img {
  max-width: 100%;
  height: auto;
}
</style>
EOF
```

## 驗證清單

在進入下一階段之前，請確認您已完成以下項目：

- [ ] 設置了 Hugo 圖片處理配置，支援 WebP/AVIF 格式
- [ ] 創建了自適應圖片的 Shortcode 和 Partial
- [ ] 設置了完整的 SEO Meta 標籤和結構化數據
- [ ] 確保配置文件結構符合 Hugo 最佳實踐
- [ ] 創建並測試了生產環境建構腳本
- [ ] 設置了 SEO 與效能檢查腳本
- [ ] 實施了資源最小化和指紋識別功能
- [ ] 使用延遲載入和關鍵 CSS 內聯技術

## 參考資源

- [Hugo SEO 最佳實踐](https://gohugo.io/templates/seo/)
- [Hugo 圖片處理](https://gohugo.io/content-management/image-processing/)
- [Web.dev 性能優化指南](https://web.dev/learn-web-vitals/)
- [Google 結構化數據測試工具](https://search.google.com/test/rich-results)
- [TailwindCSS v4 效能優化](https://tailwindcss.com/blog/tailwindcss-v4)

## 下一階段預告

在下一階段（第12階段），我們將專注於測試和驗證流程，確保專案在各種環境中都能正確運作。我們將建立本地測試流程和建構驗證腳本，以捕捉並解決潛在問題。

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
- **階段 11：建構優化與 SEO**（當前階段）
- [階段 12：測試和驗證](./Build-12-Testing-Validation.md)
- [階段 13：常見問題與疑難排解](./Build-13-Common-Issues.md)
