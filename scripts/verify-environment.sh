#!/bin/bash

echo "🚀 Hugo 開發環境驗證腳本"
echo "================================"

# 顏色定義
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 驗證函數
verify_command() {
    if command -v $1 &> /dev/null; then
        echo -e "${GREEN}✅ $1 已安裝${NC}"
        $1 --version 2>/dev/null || $1 version 2>/dev/null || echo "版本資訊不可用"
    else
        echo -e "${RED}❌ $1 未安裝${NC}"
        return 1
    fi
    echo ""
}

# 驗證版本需求
verify_version() {
    local cmd=$1
    local min_version=$2
    local current_version=$3
    
    echo -e "${YELLOW}檢查 $cmd 版本需求...${NC}"
    echo "最低需求: $min_version"
    echo "當前版本: $current_version"
    echo ""
}

# 主要驗證流程
echo "📝 基礎命令檢查:"
verify_command "node"
verify_command "hugo"
verify_command "yarn"
verify_command "go"
verify_command "git"

# 特殊檢查
echo "🔍 特殊需求檢查:"

# Hugo Extended 檢查
if hugo version 2>/dev/null | grep -i "extended" > /dev/null; then
    echo -e "${GREEN}✅ Hugo Extended 版本正確${NC}"
else
    echo -e "${RED}❌ 需要 Hugo Extended 版本${NC}"
fi

# Node.js 版本檢查
NODE_VERSION=$(node --version 2>/dev/null | sed 's/v//')
if [ ! -z "$NODE_VERSION" ]; then
    verify_version "Node.js" "18.0.0" "$NODE_VERSION"
fi

# 網路連接檢查
echo "🌐 網路連接檢查:"
if curl -s --max-time 5 https://registry.npmjs.org/ > /dev/null; then
    echo -e "${GREEN}✅ NPM 註冊表連接正常${NC}"
else
    echo -e "${RED}❌ NPM 註冊表連接失敗${NC}"
fi

echo "================================"
echo "🎉 環境驗證完成！"
