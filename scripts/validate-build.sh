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
echo "� 檢查硬編碼連結..."
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
