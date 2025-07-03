# Hugo 專案建構階段 13：常見問題與疑難排解

> **專案狀態**: ✅ 完成  
> **技術棧**: Hugo v0.147.9 + TailwindCSS v4.1.11 + DaisyUI v5.0.43 + Alpine.js v3.14.9

本階段專注於解決 Hugo 專案中常見的問題與疑難排解，幫助您順利完成專案建構並克服可能遇到的技術挑戰。我們將探討 DaisyUI v5 整合、配置語法、圖片處理和前端整合等常見問題，提供全面且實用的解決方案。

## 階段目標

- 解決 DaisyUI v5 整合與主題切換問題
- 修正 TOML/YAML 配置語法錯誤
- 處理圖片轉換與優化問題
- 提供專案完成後的進階擴展建議
- 總結整個專案建構流程並解決常見問題

## 前置條件

✅ 已完成 [階段 12：測試和驗證](./Build-12-Testing-Validation.md)  
✅ 已建立並測試了測試流程和驗證工具

## 步驟詳解

### 1. DaisyUI v5 整合與主題系統問題

在整合 DaisyUI v5 時，您可能會遇到一些特定的問題，尤其是與主題系統、元件樣式和 Alpine.js 交互相關的問題。以下是常見問題的全面解決方案。

#### 1.1 主題載入與切換問題

**問題**: DaisyUI v5 元件已載入但樣式不正確或主題切換不起作用。

**解決方案**:

1. 確保在 HTML 中正確設置主題屬性：

```html
<html data-theme="light"> <!-- 確保有正確的主題設定 -->
```

2. 檢查 Tailwind 配置文件中的 DaisyUI 設定：

```js
// tailwind.config.js
module.exports = {
  // ...
  plugins: [require("daisyui")], // 確保正確引入 DaisyUI v5
  daisyui: {
    themes: ["light", "dark", "forest", "ocean", "cherry"], // 確保主題列表正確
    darkTheme: "dark", // 指定暗色主題
  },
};
```

3. 驗證 PostCSS 配置中包含了 DaisyUI 插件：

```js
// postcss.config.mjs
export default {
  plugins: {
    'tailwindcss/nesting': {},
    '@tailwindcss/postcss': {},  // TailwindCSS v4 使用此格式
    autoprefixer: {},
    'postcss-import': {},
  }
}
```

4. 正確使用 DaisyUI v5 的內建主題控制器：

```html
<!-- 簡單的主題切換 -->
<input type="checkbox" class="theme-controller" value="dark" />

<!-- 結合 Alpine.js 的主題切換 -->
<div x-data="darkMode">
  <input 
    type="checkbox" 
    class="theme-controller sr-only" 
    value="dark" 
    x-bind:checked="dark" 
    @change="toggle()" 
  />
  <button class="btn" @click="toggle()">
    <span x-show="!dark">🌙</span>
    <span x-show="dark">☀️</span>
  </button>
</div>
```

#### 1.2 進階主題切換問題

**問題**: 在實現跨瀏覽器主題切換或結合用戶偏好和系統設置時遇到的複雜問題。

**解決方案**:

以下是一個同時支援 DaisyUI v5 主題控制器、Alpine.js 和系統偏好的完整解決方案：

**全面整合解決方案 (header.html)**

```html
<header x-data="{ 
  dark: localStorage.getItem('theme') === 'dark' || (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches),
  toggle() {
    this.dark = !this.dark;
    localStorage.setItem('theme', this.dark ? 'dark' : 'light');
    document.documentElement.setAttribute('data-theme', this.dark ? 'dark' : 'light');
  },
  init() {
    document.documentElement.setAttribute('data-theme', this.dark ? 'dark' : 'light');
    
    // 監聽系統偏好變更
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
      if (!localStorage.getItem('theme')) { // 只有在用戶沒有手動設置主題時響應
        this.dark = e.matches;
        document.documentElement.setAttribute('data-theme', this.dark ? 'dark' : 'light');
      }
    });
    
    // 同步 DaisyUI theme-controller 元素
    this.$nextTick(() => {
      const controllers = document.querySelectorAll('.theme-controller');
      controllers.forEach(ctrl => {
        if (ctrl.value === (this.dark ? 'dark' : 'light')) {
          ctrl.checked = true;
        }
        ctrl.addEventListener('change', () => {
          if (ctrl.value === 'dark' && !this.dark) {
            this.toggle();
          } else if (ctrl.value === 'light' && this.dark) {
            this.toggle();
          }
        });
      });
    });
  }
}">
  <div class="navbar bg-base-100 shadow-md">
    <!-- Logo 和網站標題 -->
    <div class="flex-1">
      <a href="/" class="btn btn-ghost normal-case text-xl">{{ .Site.Title }}</a>
    </div>
    
    <!-- 主題切換按鈕 -->
    <div class="flex-none">
      <!-- 移動設備上的簡單切換 -->
      <button @click="toggle()" class="btn btn-ghost lg:hidden">
        <span x-show="!dark">🌙</span>
        <span x-show="dark">☀️</span>
      </button>
      
      <!-- 桌面版下拉主題選擇器 -->
      <div class="dropdown dropdown-end hidden lg:block">
        <label tabindex="0" class="btn btn-ghost m-1">
          <span x-show="!dark">🌙</span>
          <span x-show="dark">☀️</span>
          主題
        </label>
        <ul tabindex="0" class="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
          <li><input type="radio" name="theme-dropdown" class="theme-controller w-full btn btn-sm btn-block btn-ghost justify-start" aria-label="淺色" value="light"/></li>
          <li><input type="radio" name="theme-dropdown" class="theme-controller w-full btn btn-sm btn-block btn-ghost justify-start" aria-label="深色" value="dark"/></li>
          <li><input type="radio" name="theme-dropdown" class="theme-controller w-full btn btn-sm btn-block btn-ghost justify-start" aria-label="森林" value="forest"/></li>
          <li><input type="radio" name="theme-dropdown" class="theme-controller w-full btn btn-sm btn-block btn-ghost justify-start" aria-label="海洋" value="ocean"/></li>
          <li><input type="radio" name="theme-dropdown" class="theme-controller w-full btn btn-sm btn-block btn-ghost justify-start" aria-label="櫻桃" value="cherry"/></li>
        </ul>
      </div>
      
      <!-- 其他導航項目 -->
      <div class="menu menu-horizontal px-1">
        {{ range .Site.Menus.main }}
          <a href="{{ .URL }}" class="btn btn-ghost">{{ .Name }}</a>
        {{ end }}
      </div>
    </div>
  </div>
</header>
```

**實現全站主題切換器 Alpine 組件**

在 `themes/twda_v5/assets/js/components/themeSystem.js` 創建一個強化版本的主題系統:

```javascript
document.addEventListener('alpine:init', () => {
  Alpine.data('themeSystem', () => ({
    themes: ['light', 'dark', 'forest', 'ocean', 'cherry'],
    currentTheme: localStorage.getItem('theme') || 'system',
    
    init() {
      this.applyTheme();
      
      // 監聽系統偏好變更
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
        if (this.currentTheme === 'system') {
          this.applyTheme();
        }
      });
      
      // 同步所有 theme-controller 元素
      this.$nextTick(() => {
        document.querySelectorAll('.theme-controller').forEach(ctrl => {
          if (ctrl.value === this.currentTheme) {
            ctrl.checked = true;
          }
          
          ctrl.addEventListener('change', () => {
            this.currentTheme = ctrl.value;
            this.saveTheme();
            this.applyTheme();
          });
        });
      });
    },
    
    setTheme(theme) {
      this.currentTheme = theme;
      this.saveTheme();
      this.applyTheme();
    },
    
    saveTheme() {
      localStorage.setItem('theme', this.currentTheme);
    },
    
    getSystemTheme() {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    },
    
    applyTheme() {
      const theme = this.currentTheme === 'system' ? this.getSystemTheme() : this.currentTheme;
      document.documentElement.setAttribute('data-theme', theme);
      
      // 更新所有 theme-controller 元素狀態
      document.querySelectorAll('.theme-controller').forEach(ctrl => {
        if (ctrl.value === this.currentTheme) {
          ctrl.checked = true;
        }
      });
    }
  }));
});
```

**解決 SSR 與 CSR 閃爍問題**

在 `head.html` 中添加防止主題閃爍的腳本:

```html
<!-- 防止主題閃爍的腳本 (放在 head 頂部) -->
<script>
  (function() {
    // 取得用戶偏好
    var savedTheme = localStorage.getItem('theme');
    var systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // 決定要使用的主題
    var theme = savedTheme || (systemPrefersDark ? 'dark' : 'light');
    
    // 立即應用主題，避免閃爍
    document.documentElement.setAttribute('data-theme', theme);
  })();
</script>
```

### 2. 配置文件語法錯誤

Hugo 支援多種配置格式，包括 TOML、YAML 和 JSON。由於配置文件的複雜性，語法錯誤是一個常見的問題來源。

#### 2.1 TOML 語法錯誤

**問題**: TOML 語法錯誤會導致建構失敗，常見錯誤訊息包括：

```plaintext
toml: line XX: expected key separator '=', but got '{'
```

或

```plaintext
toml: line XX: expected value but found '.'
```

**解決方案**:

1. **TOML 語法基礎**:

```toml
# 正確的 TOML 語法

# 簡單鍵值對
title = "Hugo-DaisyUI5"

# 表格
[params]
  author = "開發者"

# 陣列
formats = ["avif", "webp", "jpg"]

# 巢狀表格
[params.images]
  progressive = true
  
  [params.images.quality]
    avif = 80
    webp = 85
```

2. **配置檔案分離**:

將相關配置拆分到多個檔案中，降低複雜度：

```
config/
  _default/
    config.toml     # 核心設定
    menus.toml      # 選單設定
    params.toml     # 參數設定
    imaging.toml    # 圖片設定
```

3. **使用驗證工具**:

```bash
# 使用在線工具 https://www.toml-lint.com/
# 或安裝命令行工具
npm install -g @iarna/toml

# 驗證 TOML 文件
cat config/_default/params.toml | toml-validate
```

#### 2.2 YAML 配置問題

**問題**: 在使用 YAML 配置時，縮進和列表格式錯誤是常見問題。

**解決方案**:

1. **確保正確縮進**:

```yaml
# 正確的 YAML 縮進
params:
  images:
    quality:
      avif: 80
      webp: 85
```

2. **使用在線驗證工具**:

可以使用 [YAML Validator](https://yamlvalidator.com/) 來檢查 YAML 語法。

### 3. 圖片處理問題

Hugo 的圖片處理功能強大但也可能引起一些問題，尤其是在處理現代格式和優化時。

#### 3.1 圖片處理與最佳化問題

**問題**: 圖片處理中可能遇到的常見錯誤：

- `ERROR process resources: failed to resize...`
- 特定圖片格式無法處理或不生成
- AVIF/WebP 轉換失敗
- 記憶體不足或處理緩慢

**診斷步驟**:

```bash
# 檢查 Hugo 版本是否為 Extended 版本
hugo version  # 應該包含 "extended" 字樣

# 檢查生成的圖片格式數量
find public/ -name "*.webp" | wc -l
find public/ -name "*.avif" | wc -l

# 檢查圖片處理配置
cat config/_default/imaging.toml
```

**解決方案**:

1. **確保使用 Hugo Extended 版本與正確的配置**

確保 Hugo Extended 版本已正確安裝：

```bash
# 檢查 Hugo 版本
hugo version

# 安裝 Extended 版本 (如需要)
brew install hugo  # macOS (默認安裝 Extended 版本)
```

並驗證 `config/_default/imaging.toml` 配置文件：

```toml
# 圖片處理配置
quality = 90
resampleFilter = "lanczos"

[exif]
  # 移除 EXIF 數據以減小檔案大小
  disableDate = true
  disableLatLong = true
  includeFields = ""
  excludeFields = ""

[imaging.webp]
  # WebP 特定配置
  quality = 85

[imaging.avif]
  # AVIF 特定配置，僅在 Hugo Extended 版本可用
  quality = 80
```

2. **優化 picture shortcode**

確保 shortcode 處理所有圖片格式並有合理的後備方案：

```html
<!-- layouts/shortcodes/picture.html -->
{{- $src := (.Get "src") -}}
{{- $alt := (.Get "alt") | default "" -}}
{{- $class := (.Get "class") | default "img-fluid" -}}
{{- $loading := (.Get "loading") | default "lazy" -}}
{{- $original := .Page.Resources.GetMatch $src -}}

<picture class="{{ $class }}-wrapper">
  {{- if and (hugo.IsExtended) $original -}}
    {{- $avif := $original.Resize (printf "q%d avif" (site.Params.images.quality.avif | default 80)) -}}
    <source srcset="{{ $avif.RelPermalink }}" type="image/avif">
  {{- end -}}
  
  {{- if $original -}}
    {{- $webp := $original.Resize (printf "q%d webp" (site.Params.images.quality.webp | default 85)) -}}
    <source srcset="{{ $webp.RelPermalink }}" type="image/webp">
    
    {{- $fallback := $original.Resize (printf "q%d" (site.Params.images.quality.jpg | default 90)) -}}
    <img 
      src="{{ $fallback.RelPermalink }}" 
      alt="{{ $alt }}" 
      class="{{ $class }}" 
      loading="{{ $loading }}" 
      width="{{ $original.Width }}" 
      height="{{ $original.Height }}"
    >
  {{- else -}}
    <img 
      src="/images/placeholder.svg" 
      alt="{{ $alt }}" 
      class="{{ $class }} placeholder" 
      loading="{{ $loading }}"
    >
  {{- end -}}
</picture>
```

3. **效能與記憶體優化**

對於處理大量或大型圖片時的效能優化：

```bash
# 限制並行處理任務數
HUGO_RESOURCES_PROCESS_LIMIT=5 hugo

# 增加 Hugo 可用記憶體 (對於大型專案)
HUGO_MEMORY_LIMIT=1024 hugo

# 在建構前優化原始圖片
find content/ -name "*.jpg" -exec jpegoptim --max=85 {} \;
find content/ -name "*.png" -exec optipng -o5 {} \;
```

4. **系統依賴與外部處理**

確保所需的系統依賴已安裝：

```bash
# macOS
brew install imagemagick libvips

# Ubuntu/Debian
sudo apt-get install imagemagick libvips-tools

# 驗證安裝
convert -version  # ImageMagick
vips --version    # libvips
```

5. **使用外部圖片 CDN 分流**

對於大型專案，考慮結合外部圖片 CDN：

```html
<!-- 結合 Cloudinary 等圖片 CDN -->
<img 
  src="https://res.cloudinary.com/yourname/image/upload/q_auto,f_auto/v1/your-site/{{ $imagePath }}" 
  alt="{{ $alt }}"
  loading="lazy"
  width="{{ $width }}"
  height="{{ $height }}"
>
```

### 4. Hugo 進階設定問題

#### 4.1 多語言支援問題

**問題**: 在設定 Hugo 多語言網站時可能遇到的路徑、翻譯和切換問題。

**解決方案**:

**正確的多語言配置**

在 `config/_default/languages.toml` 中正確設定多語言支援:

```toml
[en]
  languageCode = "en-US"
  languageName = "English"
  contentDir = "content/en"
  weight = 1

[zh-tw]
  languageCode = "zh-TW"
  languageName = "繁體中文"
  contentDir = "content/zh-tw"
  weight = 2
```

**語言切換器實現**

創建一個 `partials/language-switcher.html`:

```html
{{ if .Site.IsMultiLingual }}
<div class="dropdown dropdown-end">
  <label tabindex="0" class="btn btn-ghost m-1">
    {{ .Language.LanguageName }}
    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
    </svg>
  </label>
  <ul tabindex="0" class="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
    {{ range .Site.Languages }}
    {{ if ne $.Site.Language .}}
    <li><a href="{{ $.Permalink | absLangURL }}">{{ .LanguageName }}</a></li>
    {{ end }}
    {{ end }}
  </ul>
</div>
{{ end }}
```

**多語言內容翻譯**

使用翻譯字符串在 `i18n/en.toml` 和 `i18n/zh-tw.toml` 中:

```toml
# i18n/en.toml
[home]
other = "Home"

[about]
other = "About"

# i18n/zh-tw.toml
[home]
other = "首頁"

[about]
other = "關於"
```

然後在模板中使用:

```html
<a href="/">{{ i18n "home" }}</a>
```

#### 4.2 PWA 與離線支援

**問題**: 實現 PWA (漸進式網頁應用) 功能時遇到的常見問題。

**解決方案**:

**添加必要的 PWA 配置文件**

首先創建 `static/manifest.json`:

```json
{
  "name": "Hugo-DaisyUI5",
  "short_name": "Hugo-DaisyUI5",
  "description": "Hugo 與 DaisyUI v5 整合",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#5bbad5",
  "icons": [
    {
      "src": "/images/icons/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/images/icons/icon-512x512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

**創建 Service Worker**

創建 `static/sw.js`:

```javascript
const CACHE_VERSION = 'v1';

const filesToCache = [
  '/',
  '/index.html',
  '/404.html',
  '/css/main.css',
  '/js/app.js',
  '/images/logo.svg'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_VERSION)
      .then(cache => cache.addAll(filesToCache))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});
```

**在 head.html 中註冊 Service Worker**

```html
<link rel="manifest" href="/manifest.json">
<script>
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js')
        .then(reg => console.log('Service Worker registered: ', reg))
        .catch(err => console.log('Service Worker registration failed: ', err));
    });
  }
</script>
```

### 5. 完成總結

### 5.1 項目特色和成果

經過十三個階段的開發，我們已經完成了基於 Hugo v0.147.9、TailwindCSS v4.1.11、DaisyUI v5.0.43 和 Alpine.js v3.14.9 的現代靜態網站專案。項目主要特色包括：

1. **完全遵循 Hugo 官方架構標準**
   - 模組化 Hugo 主題結構與組件化設計
   - 聯合檔案系統 (Union File System) 與自定義排版
   - 完整資源處理管道 (Hugo Pipes) 與緩存管理

2. **前沿的前端技術整合**
   - TailwindCSS v4 與原生 CSS 變數系統
   - DaisyUI v5 元件庫與多主題支援
   - Alpine.js v3 提供無侵入式互動功能
   - 純 CSS 與 JavaScript 增強的使用者體驗

3. **進階的圖片處理與最佳化**
   - 支援 WebP 與 AVIF 等現代圖片格式
   - 智能響應式圖片生成與 art direction
   - 完整的圖片後備方案與漸進式載入

4. **全面的效能優化與資源管理**
   - JavaScript 與 CSS 的最小化與緩存破壞
   - 資源延遲載入、預加載與預連接策略
   - 代碼分割與條件式載入策略

5. **SEO 與無障礙性**
   - 完整的結構化數據與 JSON-LD 支援
   - 符合 WCAG 2.1 AA 標準的無障礙設計
   - 自動生成 sitemap、RSS 與 robots.txt

### 5.2 進階擴展方向

1. **持續整合/持續部署 (CI/CD)**
   - GitHub Actions 自動建構與部署流程
   - 部署前自動化測試與品質檢查
   - 多環境 (開發、測試、生產) 部署策略
   
   ```yaml
   # .github/workflows/hugo-deploy.yml 範例
   name: Hugo Build and Deploy
   on:
     push:
       branches:
         - main
   jobs:
     build-deploy:
       runs-on: ubuntu-latest
       steps:
         - name: Checkout
           uses: actions/checkout@v3
         
         - name: Setup Hugo
           uses: peaceiris/actions-hugo@v2
           with:
             hugo-version: '0.147.9'
             extended: true
         
         - name: Install dependencies
           run: npm ci
         
         - name: Build
           run: hugo --minify
         
         - name: Deploy to Firebase
           uses: FirebaseExtended/action-hosting-deploy@v0
           with:
             repoToken: '${{ secrets.GITHUB_TOKEN }}'
             firebaseServiceAccount: '${{ secrets.FIREBASE_SERVICE_ACCOUNT }}'
             channelId: live
   ```

2. **效能監測與分析整合**
   - Lighthouse CI 自動化測試整合
   - Web Vitals 實時監控與報告
   - 關鍵效能指標 (Core Web Vitals) 追蹤

3. **全文搜尋與進階功能**
   - FlexSearch 或 Fuse.js 客戶端搜尋實現
   - 完整的 PWA 功能與離線支援
   - 完整的多語言與國際化支援
   - 整合評論系統 (如 Giscus 或 Disqus)

### 5.3 技術資源與最佳實踐

1. **官方文檔與資源**
   - [Hugo 文檔](https://gohugo.io/documentation/)
   - [TailwindCSS v4 文檔](https://tailwindcss.com/docs)
   - [DaisyUI v5 文檔](https://daisyui.com/docs/install/)
   - [Alpine.js 文檔](https://alpinejs.dev/start-here)

2. **社群支援與資源**
   - [Hugo 論壇](https://discourse.gohugo.io/)
   - [TailwindCSS Discord 社群](https://discord.gg/tailwindcss)
   - [Alpine.js 討論區](https://github.com/alpinejs/alpine/discussions)

3. **最佳實踐與工具**
   - [Hugo 模組最佳實踐](https://gohugo.io/hugo-modules/use-modules/)
   - [TailwindCSS 性能優化](https://tailwindcss.com/docs/optimizing-for-production)
   - [網頁效能檢測工具](https://web.dev/measure/)
   - [PWA 開發資源](https://web.dev/progressive-web-apps/)

### 5.4 專案文件導航

#### 核心配置檔案

- `config/_default/config.toml` - 主要配置
- `config/_default/imaging.toml` - 圖片處理配置
- `config/_default/params.toml` - 網站參數
- `config/_default/languages.toml` - 多語言配置
- `config/_default/menus.toml` - 選單配置

#### 關鍵模板檔案

- `themes/twda_v5/layouts/_default/baseof.html` - 基礎模板
- `themes/twda_v5/layouts/partials/head.html` - 頭部模板
- `themes/twda_v5/layouts/partials/header.html` - 標頭模板 (含主題切換)
- `themes/twda_v5/layouts/shortcodes/picture.html` - 圖片短代碼

#### 前端資源檔案

- `themes/twda_v5/assets/css/app.css` - 主要 CSS
- `themes/twda_v5/assets/js/app.js` - 主要 JavaScript
- `themes/twda_v5/assets/js/components/darkMode.js` - 主題切換組件
- `themes/twda_v5/assets/css/components/` - UI 元件樣式

#### 工作流程腳本

- `scripts/build.sh` - 生產環境建構腳本
- `scripts/test-local.sh` - 本地測試腳本
- `scripts/validate-build.sh` - 建構驗證腳本
- `scripts/seo-check.sh` - SEO 檢查腳本

## 驗證清單

恭喜！您現在已經完成了整個 Hugo + TailwindCSS v4 + DaisyUI v5 + Alpine.js v3 專案的建構。請檢查以下最終驗證項目：

- [ ] 整個專案可以成功建構且無錯誤
- [ ] 所有配置文件語法正確 (TOML/YAML/JSON)
- [ ] DaisyUI v5 主題系統和 Alpine.js 整合正常工作
- [ ] 圖片處理正確支援 WebP 和 AVIF 格式
- [ ] SEO 元素、結構化數據和 OG 標籤都正確生成
- [ ] 主題切換功能在多瀏覽器環境下測試通過
- [ ] 測試腳本和驗證腳本可以順利執行
- [ ] 所有 JavaScript 和 CSS 資源正確最小化和緩存破壞
- [ ] 無 JavaScript 錯誤或 CSS 視覺問題
- [ ] 所有頁面在行動裝置與桌面設備上顯示正確

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
- [第12階段：測試和驗證](./Build-12-Testing-Validation.md)
- **第13階段：常見問題與疑難排解**（當前階段）
