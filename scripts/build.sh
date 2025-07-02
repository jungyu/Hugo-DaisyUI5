#!/bin/bash

# 生產環境建構腳本 (Hugo v0.147.9 + TailwindCSS v4.1.11 + DaisyUI v5.0.43)
echo "🚀 開始建構 Hugo-DaisyUI5 專案..."

# 清理舊檔案
echo "🧹 清理舊檔案..."
rm -rf public resources .hugo_build.lock

# 安裝依賴
echo "📦 安裝依賴..."
yarn install

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
