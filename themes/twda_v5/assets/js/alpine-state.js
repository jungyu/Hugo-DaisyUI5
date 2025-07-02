// Alpine.js 狀態管理與持久化模組
// 全域狀態管理、用戶偏好設定、數據持久化

// 全域狀態管理器
Alpine.store('app', {
    // 應用狀態
    initialized: false,
    version: '5.0.0',
    
    // 用戶偏好設定
    preferences: Alpine.$persist({
        theme: 'dracula',
        language: 'zh-tw',
        fontSize: 'medium',
        reduceMotion: false,
        highContrast: false,
        compactMode: false
    }).as('user-preferences'),
    
    // 功能開關
    features: {
        search: true,
        comments: true,
        analytics: false,
        darkMode: true,
        shareButtons: true,
        backToTop: true,
        readingProgress: true,
        tableOfContents: true
    },
    
    // 統計數據
    stats: Alpine.$persist({
        visits: 0,
        pageViews: 0,
        timeSpent: 0,
        lastVisit: null
    }).as('user-stats'),
    
    // 初始化
    init() {
        if (this.initialized) return
        
        this.updateStats()
        this.applyPreferences()
        this.initialized = true
        
        console.log('全域狀態管理器已初始化')
    },
    
    // 更新統計
    updateStats() {
        this.stats.visits++
        this.stats.pageViews++
        this.stats.lastVisit = new Date().toISOString()
    },
    
    // 應用用戶偏好設定
    applyPreferences() {
        document.documentElement.setAttribute('data-theme', this.preferences.theme)
        document.documentElement.setAttribute('data-font-size', this.preferences.fontSize)
        
        if (this.preferences.reduceMotion) {
            document.documentElement.style.setProperty('--animation-duration', '0s')
        }
        
        if (this.preferences.highContrast) {
            document.documentElement.classList.add('high-contrast')
        }
        
        if (this.preferences.compactMode) {
            document.documentElement.classList.add('compact-mode')
        }
    },
    
    // 設定主題
    setTheme(theme) {
        this.preferences.theme = theme
        document.documentElement.setAttribute('data-theme', theme)
    },
    
    // 設定語言
    setLanguage(language) {
        this.preferences.language = language
        // 觸發語言變更事件
        window.dispatchEvent(new CustomEvent('languageChanged', {
            detail: { language }
        }))
    },
    
    // 設定字體大小
    setFontSize(size) {
        this.preferences.fontSize = size
        document.documentElement.setAttribute('data-font-size', size)
    },
    
    // 切換功能
    toggleFeature(feature) {
        this.features[feature] = !this.features[feature]
    },
    
    // 重置偏好設定
    resetPreferences() {
        this.preferences = {
            theme: 'dracula',
            language: 'zh-tw',
            fontSize: 'medium',
            reduceMotion: false,
            highContrast: false,
            compactMode: false
        }
        this.applyPreferences()
    }
})

// 快取管理器
Alpine.store('cache', {
    storage: new Map(),
    maxAge: 30 * 60 * 1000, // 30 分鐘
    
    set(key, value, maxAge = this.maxAge) {
        this.storage.set(key, {
            value,
            timestamp: Date.now(),
            maxAge
        })
    },
    
    get(key) {
        const item = this.storage.get(key)
        if (!item) return null
        
        if (Date.now() - item.timestamp > item.maxAge) {
            this.storage.delete(key)
            return null
        }
        
        return item.value
    },
    
    has(key) {
        return this.get(key) !== null
    },
    
    delete(key) {
        this.storage.delete(key)
    },
    
    clear() {
        this.storage.clear()
    },
    
    // 清理過期項目
    cleanup() {
        const now = Date.now()
        for (const [key, item] of this.storage.entries()) {
            if (now - item.timestamp > item.maxAge) {
                this.storage.delete(key)
            }
        }
    }
})

// 用戶設定管理
Alpine.data('userSettings', () => ({
    isOpen: false,
    activeTab: 'general',
    
    tabs: {
        general: '一般設定',
        appearance: '外觀設定',
        privacy: '隱私設定',
        accessibility: '無障礙設定'
    },
    
    get preferences() {
        return this.$store.app.preferences
    },
    
    get features() {
        return this.$store.app.features
    },
    
    open(tab = 'general') {
        this.activeTab = tab
        this.isOpen = true
        document.body.style.overflow = 'hidden'
    },
    
    close() {
        this.isOpen = false
        document.body.style.overflow = ''
    },
    
    switchTab(tab) {
        this.activeTab = tab
    },
    
    updatePreference(key, value) {
        this.$store.app.preferences[key] = value
        this.$store.app.applyPreferences()
    },
    
    toggleFeature(feature) {
        this.$store.app.toggleFeature(feature)
    },
    
    resetSettings() {
        if (confirm('確定要重置所有設定嗎？')) {
            this.$store.app.resetPreferences()
        }
    }
}))

// 收藏/書籤系統
Alpine.data('bookmarkSystem', () => ({
    bookmarks: Alpine.$persist([]).as('bookmarks'),
    
    isBookmarked(url) {
        return this.bookmarks.some(bookmark => bookmark.url === url)
    },
    
    toggle(url = window.location.href, title = document.title) {
        if (this.isBookmarked(url)) {
            this.remove(url)
        } else {
            this.add(url, title)
        }
    },
    
    add(url, title) {
        if (this.isBookmarked(url)) return
        
        this.bookmarks.push({
            url,
            title,
            addedAt: new Date().toISOString()
        })
        
        // 觸發通知
        window.dispatchEvent(new CustomEvent('toast', {
            detail: {
                type: 'success',
                message: '已加入書籤'
            }
        }))
    },
    
    remove(url) {
        const index = this.bookmarks.findIndex(bookmark => bookmark.url === url)
        if (index > -1) {
            this.bookmarks.splice(index, 1)
            
            // 觸發通知
            window.dispatchEvent(new CustomEvent('toast', {
                detail: {
                    type: 'info',
                    message: '已移除書籤'
                }
            }))
        }
    },
    
    clear() {
        if (confirm('確定要清空所有書籤嗎？')) {
            this.bookmarks = []
        }
    },
    
    export() {
        const data = JSON.stringify(this.bookmarks, null, 2)
        const blob = new Blob([data], { type: 'application/json' })
        const url = URL.createObjectURL(blob)
        
        const a = document.createElement('a')
        a.href = url
        a.download = 'bookmarks.json'
        a.click()
        
        URL.revokeObjectURL(url)
    }
}))

// 閱讀歷史系統
Alpine.data('readingHistory', () => ({
    history: Alpine.$persist([]).as('reading-history'),
    maxItems: 100,
    
    addToHistory(url = window.location.href, title = document.title) {
        // 移除已存在的記錄
        this.history = this.history.filter(item => item.url !== url)
        
        // 添加到開頭
        this.history.unshift({
            url,
            title,
            readAt: new Date().toISOString()
        })
        
        // 限制數量
        if (this.history.length > this.maxItems) {
            this.history = this.history.slice(0, this.maxItems)
        }
    },
    
    getRecent(count = 10) {
        return this.history.slice(0, count)
    },
    
    clear() {
        if (confirm('確定要清空閱讀歷史嗎？')) {
            this.history = []
        }
    },
    
    remove(url) {
        this.history = this.history.filter(item => item.url !== url)
    }
}))

// 搜尋歷史系統
Alpine.data('searchHistory', () => ({
    searches: Alpine.$persist([]).as('search-history'),
    maxItems: 50,
    
    addSearch(query) {
        if (!query || query.trim() === '') return
        
        query = query.trim()
        
        // 移除已存在的記錄
        this.searches = this.searches.filter(item => item.query !== query)
        
        // 添加到開頭
        this.searches.unshift({
            query,
            searchedAt: new Date().toISOString()
        })
        
        // 限制數量
        if (this.searches.length > this.maxItems) {
            this.searches = this.searches.slice(0, this.maxItems)
        }
    },
    
    getRecent(count = 10) {
        return this.searches.slice(0, count)
    },
    
    clear() {
        this.searches = []
    },
    
    remove(query) {
        this.searches = this.searches.filter(item => item.query !== query)
    },
    
    getSuggestions(input) {
        if (!input || input.trim() === '') return []
        
        return this.searches
            .filter(item => item.query.toLowerCase().includes(input.toLowerCase()))
            .slice(0, 5)
            .map(item => item.query)
    }
}))

// 效能監控系統
Alpine.data('performanceMonitor', () => ({
    metrics: {
        loadTime: 0,
        firstPaint: 0,
        firstContentfulPaint: 0,
        domContentLoaded: 0
    },
    
    init() {
        this.measurePerformance()
    },
    
    measurePerformance() {
        // 頁面載入時間
        window.addEventListener('load', () => {
            this.metrics.loadTime = performance.now()
        })
        
        // DOM 內容載入時間
        document.addEventListener('DOMContentLoaded', () => {
            this.metrics.domContentLoaded = performance.now()
        })
        
        // 獲取 Paint 時間
        if (window.PerformanceObserver) {
            const observer = new PerformanceObserver((list) => {
                list.getEntries().forEach((entry) => {
                    if (entry.name === 'first-paint') {
                        this.metrics.firstPaint = entry.startTime
                    } else if (entry.name === 'first-contentful-paint') {
                        this.metrics.firstContentfulPaint = entry.startTime
                    }
                })
            })
            
            observer.observe({ entryTypes: ['paint'] })
        }
    },
    
    getReport() {
        return {
            ...this.metrics,
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent,
            url: window.location.href
        }
    }
}))

// 離線狀態管理
Alpine.data('offlineManager', () => ({
    isOnline: navigator.onLine,
    
    init() {
        window.addEventListener('online', () => {
            this.isOnline = true
            this.onOnline()
        })
        
        window.addEventListener('offline', () => {
            this.isOnline = false
            this.onOffline()
        })
    },
    
    onOnline() {
        window.dispatchEvent(new CustomEvent('toast', {
            detail: {
                type: 'success',
                message: '網路連線已恢復'
            }
        }))
    },
    
    onOffline() {
        window.dispatchEvent(new CustomEvent('toast', {
            detail: {
                type: 'warning',
                message: '網路連線中斷，部分功能可能無法使用'
            }
        }))
    }
}))

// 初始化全域狀態
document.addEventListener('DOMContentLoaded', () => {
    Alpine.store('app').init()
    
    // 定期清理快取
    setInterval(() => {
        Alpine.store('cache').cleanup()
    }, 5 * 60 * 1000) // 每 5 分鐘清理一次
    
    console.log('狀態管理與持久化模組載入完成')
})
