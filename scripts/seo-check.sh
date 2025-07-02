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
