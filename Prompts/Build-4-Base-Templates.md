# Build-4-Base-Templates.md

> Hugo + TailwindCSS + DaisyUI 建構指南 - 階段四：基礎 HTML 模板
>
> 基於 Hugo v0.147.9 官方標準，整合 TailwindCSS v4.1.11、DaisyUI v5.0.43、Alpine.js v3.14.9

## 階段四：創建基礎 HTML 模板

本階段將為 twda_v5 主題創建基礎 HTML 模板，包括主要布局模板、常用的局部模板以及組件模板。這些模板將為後續整合 TailwindCSS 和 DaisyUI 提供基礎。

### 4.1 創建基礎布局模板

**CLI 指令:**

```bash
# 創建基礎模板 (baseof.html)
cat > themes/twda_v5/layouts/_default/baseof.html << 'EOF'
<!DOCTYPE html>
<html lang="{{ site.LanguageCode | default "zh-TW" }}" data-theme="dracula">
<head>
    {{- partial "head.html" . -}}
</head>
<body class="min-h-screen bg-base-100 text-base-content">
    <!-- 頁面開始標記 (輔助調試) -->
    <!-- TWDA v5 主題 - {{ now.Format "2006-01-02" }} -->
    
    <!-- 頁面頂部 (導航) -->
    {{- partial "header.html" . -}}
    
    <!-- 頁面主要內容 -->
    <main id="content" class="container mx-auto px-4 py-8">
        {{- block "main" . }}{{- end }}
    </main>
    
    <!-- 頁面底部 -->
    {{- partial "footer.html" . -}}
    
    <!-- 腳本載入 -->
    {{- partial "scripts.html" . -}}
</body>
</html>
EOF

# 創建單頁模板 (single.html)
cat > themes/twda_v5/layouts/_default/single.html << 'EOF'
{{ define "main" }}
<article class="prose lg:prose-lg mx-auto my-8 dark:prose-invert">
    <h1 class="text-3xl font-bold mb-6">{{ .Title }}</h1>
    
    {{ if .Params.description }}
    <div class="text-lg text-base-content/80 mb-8">{{ .Params.description }}</div>
    {{ end }}
    
    {{ if not .Params.hideMetadata }}
    <div class="flex items-center gap-4 text-sm text-base-content/70 mb-8">
        {{ if not .Date.IsZero }}
        <time datetime="{{ .Date.Format "2006-01-02T15:04:05Z07:00" }}">
            {{ .Date.Format "2006-01-02" }}
        </time>
        {{ end }}
        
        {{ if .Params.tags }}
        <div class="flex gap-2 flex-wrap">
            {{ range .Params.tags }}
            <a href="{{ "/tags/" | relLangURL }}{{ . | urlize }}" class="badge badge-outline">{{ . }}</a>
            {{ end }}
        </div>
        {{ end }}
    </div>
    {{ end }}
    
    {{ if .Params.toc }}
    <div class="card bg-base-200 p-4 mb-8">
        <h2 class="text-lg font-semibold mb-2">目錄</h2>
        {{ .TableOfContents }}
    </div>
    {{ end }}
    
    <div class="content">
        {{ .Content }}
    </div>
</article>
{{ end }}
EOF

# 創建列表模板 (list.html)
cat > themes/twda_v5/layouts/_default/list.html << 'EOF'
{{ define "main" }}
<div class="container mx-auto px-4">
    <header class="mb-10">
        <h1 class="text-3xl font-bold">{{ .Title }}</h1>
        {{ if .Description }}
        <p class="text-lg text-base-content/80 mt-2">{{ .Description }}</p>
        {{ end }}
    </header>
    
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {{ range .Pages }}
        <div class="card bg-base-200 shadow-md hover:shadow-lg transition-shadow duration-300">
            <div class="card-body">
                <h2 class="card-title">{{ .Title }}</h2>
                
                {{ if .Params.description }}
                <p class="text-base-content/80">{{ .Params.description }}</p>
                {{ else }}
                <p class="text-base-content/80">{{ .Summary }}</p>
                {{ end }}
                
                <div class="flex items-center gap-2 text-sm text-base-content/70">
                    {{ if not .Date.IsZero }}
                    <time datetime="{{ .Date.Format "2006-01-02T15:04:05Z07:00" }}">
                        {{ .Date.Format "2006-01-02" }}
                    </time>
                    {{ end }}
                </div>
                
                <div class="card-actions justify-end mt-4">
                    <a href="{{ .RelPermalink }}" class="btn btn-primary btn-sm">
                        閱讀更多
                    </a>
                </div>
            </div>
        </div>
        {{ end }}
    </div>
    
    {{ template "_internal/pagination.html" . }}
</div>
{{ end }}
EOF

# 創建首頁模板 (index.html)
cat > themes/twda_v5/layouts/index.html << 'EOF'
{{ define "main" }}
<div class="hero min-h-[60vh] bg-base-200 rounded-xl">
    <div class="hero-content text-center">
        <div class="max-w-md">
            <h1 class="text-5xl font-bold">{{ .Title }}</h1>
            {{ if .Description }}
            <p class="py-6">{{ .Description }}</p>
            {{ end }}
            <div class="mt-4">
                <a href="/blogs/" class="btn btn-primary">瀏覽文章</a>
            </div>
        </div>
    </div>
</div>

<div class="container mx-auto py-16">
    <h2 class="text-3xl font-bold mb-8">最新文章</h2>
    
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {{ range first 6 (where .Site.RegularPages "Type" "blogs") }}
        <div class="card bg-base-200 shadow-md hover:shadow-lg transition-shadow duration-300">
            <div class="card-body">
                <h3 class="card-title">{{ .Title }}</h3>
                
                {{ if .Params.description }}
                <p class="text-base-content/80">{{ .Params.description }}</p>
                {{ else }}
                <p class="text-base-content/80">{{ .Summary }}</p>
                {{ end }}
                
                <div class="flex items-center gap-2 text-sm text-base-content/70">
                    {{ if not .Date.IsZero }}
                    <time datetime="{{ .Date.Format "2006-01-02T15:04:05Z07:00" }}">
                        {{ .Date.Format "2006-01-02" }}
                    </time>
                    {{ end }}
                </div>
                
                <div class="card-actions justify-end mt-4">
                    <a href="{{ .RelPermalink }}" class="btn btn-primary btn-sm">
                        閱讀更多
                    </a>
                </div>
            </div>
        </div>
        {{ end }}
    </div>
    
    <div class="text-center mt-12">
        <a href="/blogs/" class="btn btn-outline">查看所有文章</a>
    </div>
</div>

{{ .Content }}
{{ end }}
EOF

# 創建 404 頁面模板 (404.html)
cat > themes/twda_v5/layouts/404.html << 'EOF'
{{ define "main" }}
<div class="hero min-h-[70vh] bg-base-200 rounded-xl">
    <div class="hero-content text-center">
        <div class="max-w-md">
            <h1 class="text-5xl font-bold mb-8">404</h1>
            <p class="text-2xl mb-8">找不到頁面</p>
            <p class="mb-8">您要查找的頁面不存在或已被移動。</p>
            <a href="/" class="btn btn-primary">返回首頁</a>
        </div>
    </div>
</div>
{{ end }}
EOF
```

### 4.2 創建 Partials 模板

**CLI 指令:**

```bash
# 創建頭部模板 (head.html)
cat > themes/twda_v5/layouts/partials/head.html << 'EOF'
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>{{ if .IsHome }}{{ .Site.Title }}{{ else }}{{ .Title }} | {{ .Site.Title }}{{ end }}</title>

<!-- 元資料 -->
<meta name="description" content="{{ with .Description }}{{ . }}{{ else }}{{ with .Summary }}{{ . }}{{ else }}{{ .Site.Params.description }}{{ end }}{{ end }}">
<meta name="author" content="{{ .Site.Params.author }}">

<!-- 標準 favicon -->
<link rel="icon" type="image/x-icon" href="{{ "favicon.ico" | relURL }}">

<!-- 預留 CSS 載入位置 (將在後續階段實作) -->
<!-- 在階段八 (CSS 框架整合) 將被替換為實際的 CSS 處理 -->
<style>
  /* 臨時基礎樣式，避免頁面完全無樣式 */
  :root {
    --font-sans: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  }
  
  body {
    font-family: var(--font-sans);
    line-height: 1.6;
    margin: 0;
    padding: 0;
    color: #333;
    background-color: #f8f9fa;
  }
  
  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 15px;
  }
  
  a {
    color: #0d6efd;
    text-decoration: none;
  }
</style>

<!-- 預先載入 Alpine.js (從 CDN，將在後續替換為本地版本) -->
<script defer src="https://cdn.jsdelivr.net/npm/alpinejs@3.14.9/dist/cdn.min.js"></script>

<!-- 主題系統預載腳本 (避免閃爍) -->
<script>
  // 從 localStorage 讀取儲存的主題
  const savedTheme = localStorage.getItem('theme') || 'dracula';
  document.documentElement.setAttribute('data-theme', savedTheme);
</script>

<!-- SEO 標籤 (基礎版本，後續階段會擴充) -->
{{- partial "seo/basic-seo.html" . -}}
EOF

# 創建頂部模板 (header.html)
cat > themes/twda_v5/layouts/partials/header.html << 'EOF'
<header class="bg-base-200 shadow-md">
    <div class="navbar container mx-auto">
        <div class="navbar-start">
            <div class="dropdown">
                <label tabindex="0" class="btn btn-ghost lg:hidden">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h8m-8 6h16" />
                    </svg>
                </label>
                <ul tabindex="0" class="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
                    {{ range .Site.Menus.main }}
                    <li><a href="{{ .URL }}">{{ .Name }}</a></li>
                    {{ end }}
                </ul>
            </div>
            <a href="/" class="btn btn-ghost normal-case text-xl">{{ .Site.Title }}</a>
        </div>
        <div class="navbar-center hidden lg:flex">
            <ul class="menu menu-horizontal px-1">
                {{ range .Site.Menus.main }}
                <li><a href="{{ .URL }}">{{ .Name }}</a></li>
                {{ end }}
            </ul>
        </div>
        <div class="navbar-end">
            <!-- 主題切換按鈕 (基礎版本) -->
            <button onclick="toggleTheme()" class="btn btn-ghost btn-circle">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
            </button>
        </div>
    </div>
</header>
EOF

# 創建底部模板 (footer.html)
cat > themes/twda_v5/layouts/partials/footer.html << 'EOF'
<footer class="footer p-10 bg-base-200 text-base-content">
    <div>
        <span class="footer-title">網站</span> 
        <a href="/" class="link link-hover">首頁</a>
        <a href="/blogs/" class="link link-hover">文章</a>
    </div> 
    <div>
        <span class="footer-title">技術棧</span> 
        <a href="https://gohugo.io/" target="_blank" rel="noopener" class="link link-hover">Hugo v0.147.9</a>
        <a href="https://tailwindcss.com/" target="_blank" rel="noopener" class="link link-hover">TailwindCSS v4.1.11</a>
        <a href="https://daisyui.com/" target="_blank" rel="noopener" class="link link-hover">DaisyUI v5.0.43</a>
        <a href="https://alpinejs.dev/" target="_blank" rel="noopener" class="link link-hover">Alpine.js v3.14.9</a>
    </div> 
    <div>
        <span class="footer-title">法律</span> 
        <a href="/privacy/" class="link link-hover">隱私政策</a>
        <a href="/terms/" class="link link-hover">使用條款</a>
    </div>
</footer>
<footer class="footer px-10 py-4 border-t bg-base-200 text-base-content border-base-300">
    <div class="items-center grid-flow-col">
        <p>© {{ now.Format "2006" }} {{ .Site.Title }} - 使用 <a href="https://github.com/username/twda_v5" target="_blank" rel="noopener" class="link">TWDA v5</a> 主題</p>
    </div> 
    <div class="md:place-self-center md:justify-self-end">
        <div class="grid grid-flow-col gap-4">
            {{ with .Site.Params.social }}
                {{ with .github }}<a href="{{ . }}" target="_blank" rel="noopener"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" class="fill-current"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg></a>{{ end }}
                {{ with .twitter }}<a href="{{ . }}" target="_blank" rel="noopener"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" class="fill-current"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"></path></svg></a>{{ end }}
            {{ end }}
        </div>
    </div>
</footer>
EOF

# 創建腳本載入模板 (scripts.html)
cat > themes/twda_v5/layouts/partials/scripts.html << 'EOF'
<!-- 載入主題 JavaScript (將在後續階段實作) -->
<!-- 在階段七 (Alpine.js 整合) 將被替換為實際的 JS 處理 -->

<!-- 臨時主題切換腳本 -->
<script>
function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dracula' ? 'cmyk' : 'dracula';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    
    console.log('主題已切換至:', newTheme);
}
</script>
EOF

# 創建 SEO 基礎模板
mkdir -p themes/twda_v5/layouts/partials/seo
cat > themes/twda_v5/layouts/partials/seo/basic-seo.html << 'EOF'
<!-- 基礎 SEO 標籤 -->

<!-- 標準 SEO 標籤 -->
<meta name="robots" content="{{ with .Params.robots }}{{ . }}{{ else }}index, follow{{ end }}">
<link rel="canonical" href="{{ .Permalink }}">

<!-- Open Graph / Facebook -->
{{ if .Site.Params.seo.enableOpenGraph | default true }}
<meta property="og:type" content="{{ if .IsPage }}article{{ else }}website{{ end }}">
<meta property="og:title" content="{{ if .IsHome }}{{ .Site.Title }}{{ else }}{{ .Title }} | {{ .Site.Title }}{{ end }}">
<meta property="og:description" content="{{ with .Description }}{{ . }}{{ else }}{{ with .Summary }}{{ . }}{{ else }}{{ .Site.Params.description }}{{ end }}{{ end }}">
<meta property="og:url" content="{{ .Permalink }}">
<meta property="og:site_name" content="{{ .Site.Title }}">
{{ end }}

<!-- Twitter -->
{{ if .Site.Params.seo.enableTwitterCard | default true }}
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="{{ if .IsHome }}{{ .Site.Title }}{{ else }}{{ .Title }} | {{ .Site.Title }}{{ end }}">
<meta name="twitter:description" content="{{ with .Description }}{{ . }}{{ else }}{{ with .Summary }}{{ . }}{{ else }}{{ .Site.Params.description }}{{ end }}{{ end }}">
{{ end }}
EOF
```

### 4.3 創建組件模板

**CLI 指令:**

```bash
# 創建卡片組件
mkdir -p themes/twda_v5/layouts/partials/components
cat > themes/twda_v5/layouts/partials/components/card.html << 'EOF'
{{/* 
    卡片組件
    用法: partial "components/card" (dict "title" "標題" "content" "內容" "url" "連結")
*/}}

<div class="card bg-base-200 shadow-lg hover:shadow-xl transition-shadow duration-300">
    <div class="card-body">
        <h3 class="card-title">{{ .title }}</h3>
        <p>{{ .content }}</p>
        {{ if .url }}
        <div class="card-actions justify-end">
            <a href="{{ .url }}" class="btn btn-primary">更多</a>
        </div>
        {{ end }}
    </div>
</div>
EOF

# 創建徽章組件
cat > themes/twda_v5/layouts/partials/components/badge.html << 'EOF'
{{/* 
    徽章組件
    用法: partial "components/badge" (dict "text" "徽章文字" "type" "primary|secondary|accent|info|success|warning|error")
*/}}

<span class="badge {{ with .type }}badge-{{ . }}{{ end }}">{{ .text }}</span>
EOF

# 創建分頁組件 (為了自定義樣式)
cat > themes/twda_v5/layouts/partials/components/pagination.html << 'EOF'
{{/* 
    分頁組件 (基於 DaisyUI)
    用法: partial "components/pagination" .
*/}}

{{ if gt .Paginator.TotalPages 1 }}
<div class="join flex justify-center my-8">
    {{ if .Paginator.HasPrev }}
    <a href="{{ .Paginator.Prev.URL }}" class="join-item btn">«</a>
    {{ else }}
    <span class="join-item btn btn-disabled">«</span>
    {{ end }}
    
    {{ $currentPageNumber := .Paginator.PageNumber }}
    {{ $totalPages := .Paginator.TotalPages }}
    
    {{ range .Paginator.Pagers }}
        {{ if eq .PageNumber $currentPageNumber }}
        <a class="join-item btn btn-active">{{ .PageNumber }}</a>
        {{ else }}
        <a href="{{ .URL }}" class="join-item btn">{{ .PageNumber }}</a>
        {{ end }}
    {{ end }}
    
    {{ if .Paginator.HasNext }}
    <a href="{{ .Paginator.Next.URL }}" class="join-item btn">»</a>
    {{ else }}
    <span class="join-item btn btn-disabled">»</span>
    {{ end }}
</div>
{{ end }}
EOF
```

### 4.4 創建 Shortcodes

**CLI 指令:**

```bash
# 創建提醒 shortcode
cat > themes/twda_v5/layouts/shortcodes/alert.html << 'EOF'
{{/* 
    提醒框 Shortcode
    用法: {{< alert type="info" title="提示" >}}內容{{< /alert >}}
    type: info, success, warning, error (預設: info)
*/}}

{{ $type := .Get "type" | default "info" }}
{{ $title := .Get "title" | default "提示" }}

{{ $alertClass := "" }}
{{ $iconHTML := "" }}

{{ if eq $type "info" }}
    {{ $alertClass = "alert-info" }}
    {{ $iconHTML = "<svg xmlns=\"http://www.w3.org/2000/svg\" fill=\"none\" viewBox=\"0 0 24 24\" class=\"h-6 w-6 stroke-current\"><path stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\" d=\"M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z\"></path></svg>" }}
{{ else if eq $type "success" }}
    {{ $alertClass = "alert-success" }}
    {{ $iconHTML = "<svg xmlns=\"http://www.w3.org/2000/svg\" class=\"h-6 w-6 stroke-current\" fill=\"none\" viewBox=\"0 0 24 24\"><path stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\" d=\"M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z\" /></svg>" }}
{{ else if eq $type "warning" }}
    {{ $alertClass = "alert-warning" }}
    {{ $iconHTML = "<svg xmlns=\"http://www.w3.org/2000/svg\" class=\"h-6 w-6 stroke-current\" fill=\"none\" viewBox=\"0 0 24 24\"><path stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\" d=\"M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z\" /></svg>" }}
{{ else if eq $type "error" }}
    {{ $alertClass = "alert-error" }}
    {{ $iconHTML = "<svg xmlns=\"http://www.w3.org/2000/svg\" class=\"h-6 w-6 stroke-current\" fill=\"none\" viewBox=\"0 0 24 24\"><path stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\" d=\"M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z\" /></svg>" }}
{{ end }}

<div class="alert {{ $alertClass }} shadow-lg my-4">
  <div>
    {{ $iconHTML | safeHTML }}
    <div>
      <h3 class="font-bold">{{ $title }}</h3>
      <div class="text-sm">{{ .Inner | markdownify }}</div>
    </div>
  </div>
</div>
EOF

# 創建代碼片段 shortcode
cat > themes/twda_v5/layouts/shortcodes/code.html << 'EOF'
{{/* 
    代碼片段 Shortcode (語法高亮)
    用法: {{< code language="language" title="標題" >}}代碼{{< /code >}}
*/}}

{{ $language := .Get "language" | default "" }}
{{ $title := .Get "title" | default "" }}

<div class="mockup-code {{ with $title }}mb-0 rounded-b-none{{ end }}">
    {{ with $title }}
    <div class="bg-base-300 text-base-content px-4 py-2 text-sm font-bold rounded-t-lg">{{ . }}</div>
    {{ end }}
    {{ if $language }}
    {{ highlight .Inner $language "" }}
    {{ else }}
    <pre><code>{{ .Inner }}</code></pre>
    {{ end }}
</div>
EOF

# 創建圖標 shortcode
cat > themes/twda_v5/layouts/shortcodes/icon.html << 'EOF'
{{/* 
    圖標 Shortcode (Heroicons)
    用法: {{< icon name="academic-cap" class="w-6 h-6" >}}
*/}}

{{ $name := .Get "name" | default "question-mark-circle" }}
{{ $class := .Get "class" | default "w-6 h-6" }}

{{ $icons := dict 
    "academic-cap" "<svg xmlns=\"http://www.w3.org/2000/svg\" fill=\"none\" viewBox=\"0 0 24 24\" stroke-width=\"1.5\" stroke=\"currentColor\" class=\"{{ $class }}\"><path stroke-linecap=\"round\" stroke-linejoin=\"round\" d=\"M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5\" /></svg>"
    
    "check-circle" "<svg xmlns=\"http://www.w3.org/2000/svg\" fill=\"none\" viewBox=\"0 0 24 24\" stroke-width=\"1.5\" stroke=\"currentColor\" class=\"{{ $class }}\"><path stroke-linecap=\"round\" stroke-linejoin=\"round\" d=\"M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z\" /></svg>"
    
    "exclamation-circle" "<svg xmlns=\"http://www.w3.org/2000/svg\" fill=\"none\" viewBox=\"0 0 24 24\" stroke-width=\"1.5\" stroke=\"currentColor\" class=\"{{ $class }}\"><path stroke-linecap=\"round\" stroke-linejoin=\"round\" d=\"M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z\" /></svg>"
    
    "information-circle" "<svg xmlns=\"http://www.w3.org/2000/svg\" fill=\"none\" viewBox=\"0 0 24 24\" stroke-width=\"1.5\" stroke=\"currentColor\" class=\"{{ $class }}\"><path stroke-linecap=\"round\" stroke-linejoin=\"round\" d=\"M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z\" /></svg>"
    
    "question-mark-circle" "<svg xmlns=\"http://www.w3.org/2000/svg\" fill=\"none\" viewBox=\"0 0 24 24\" stroke-width=\"1.5\" stroke=\"currentColor\" class=\"{{ $class }}\"><path stroke-linecap=\"round\" stroke-linejoin=\"round\" d=\"M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z\" /></svg>"
}}

{{ with index $icons $name }}
    {{ . | safeHTML }}
{{ else }}
    {{ index $icons "question-mark-circle" | safeHTML }}
{{ end }}
EOF
```

### 4.5 創建其他必要模板

**CLI 指令:**

```bash
# 創建 JSON Feed 模板
cat > themes/twda_v5/layouts/index.json << 'EOF'
{
  "version": "https://jsonfeed.org/version/1.1",
  "title": {{ .Site.Title | jsonify }},
  "home_page_url": {{ .Site.BaseURL | jsonify }},
  "feed_url": {{ (printf "%s/index.json" .Site.BaseURL) | jsonify }},
  "description": {{ .Site.Params.description | jsonify }},
  "items": [
    {{ range $index, $entry := first 20 .Site.RegularPages }}
    {{ if $index }},{{ end }}
    {
      "id": {{ $entry.Permalink | jsonify }},
      "url": {{ $entry.Permalink | jsonify }},
      "title": {{ $entry.Title | jsonify }},
      "date_published": {{ $entry.Date.Format "2006-01-02T15:04:05-07:00" | jsonify }},
      "summary": {{ $entry.Summary | plainify | jsonify }},
      "content_html": {{ $entry.Content | jsonify }}
    }
    {{ end }}
  ]
}
EOF

# 創建 RSS 模板 (使用 Hugo 內建的)
# 注意：通常使用 Hugo 內置的 RSS 模板，但如果需要自定義，可以創建

# 創建 robots.txt 模板
cat > themes/twda_v5/layouts/robots.txt << 'EOF'
User-agent: *
{{ if eq (getenv "HUGO_ENV") "production" | or (eq .Site.Params.env "production") }}
Allow: /
{{ else }}
Disallow: /
{{ end }}

Sitemap: {{ "sitemap.xml" | absURL }}
EOF
```

### 4.6 HTML 模板驗證

**CLI 指令:**

```bash
# 檢查模板文件
find themes/twda_v5/layouts -type f -name "*.html" | wc -l

# 啟動 Hugo 服務器以測試模板
hugo server --disableFastRender --bind 0.0.0.0 --port 1313

# 在瀏覽器中測試：
# - 首頁: http://localhost:1313/
# - 文章列表: http://localhost:1313/blogs/
# - 單篇文章: http://localhost:1313/blogs/getting-started/
# - 404頁面: http://localhost:1313/non-existent-page
```

### 4.7 HTML 模板檢查清單

**檢查項目:**

- [ ] 基礎模板 (baseof.html) 正確渲染
- [ ] 單頁模板 (single.html) 正確顯示內容
- [ ] 列表模板 (list.html) 正確顯示文章列表
- [ ] 首頁模板 (index.html) 具有適當的頂部區域和最新文章
- [ ] 404 頁面友好且提供返回首頁的鏈接
- [ ] 頭部 (head.html) 包含所有必要的元數據和 SEO 標籤
- [ ] 頂部導航 (header.html) 正確顯示選單項
- [ ] 底部 (footer.html) 顯示版權信息和相關鏈接
- [ ] 主題切換功能正常工作
- [ ] Shortcodes 可以正確渲染

**AI Prompt:**

```text
請協助我驗證 Hugo 網站的 HTML 模板系統：

檢查內容：
1. 基礎模板結構是否符合 Hugo 標準
2. 各種類型頁面的模板是否完整 (單頁、列表、首頁、404)
3. 局部模板組件是否可用 (頭部、頂部導航、底部)
4. Shortcodes 是否正確設置

模板特點：
- 使用 DaisyUI 組件庫
- 支援主題切換功能
- 響應式設計
- 支援 SEO 優化

如發現問題，請提供修正建議和示例代碼。
```

---

**上一階段：** [Build-3-Theme-Architecture.md](./Build-3-Theme-Architecture.md)
**下一階段：** [Build-5-Frontend-Stack.md](./Build-5-Frontend-Stack.md)

**完整指南導航：**

- 階段一：環境準備與驗證
- 階段二：Hugo 專案初始化
- 階段三：主題架構建立
- 階段四：基礎 HTML 模板 ← 當前
- 階段五：前端技術棧整合
- 階段六：Hugo 配置系統
- 階段七：Alpine.js 功能模組
- 階段八：TailwindCSS+DaisyUI 整合
- 階段九：資源處理系統
- 階段十：實際專案展示
- 階段十一：建構優化與 SEO
- 階段十二：測試和驗證
- 階段十三：常見問題與疑難排解
