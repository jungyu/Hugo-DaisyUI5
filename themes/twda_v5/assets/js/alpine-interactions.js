// Alpine.js 互動功能模組
// 進階用戶體驗功能

// 分享功能模組
Alpine.data('shareSystem', () => ({
    platforms: {
        twitter: {
            name: 'Twitter',
            icon: 'twitter',
            url: 'https://twitter.com/intent/tweet?text={title}&url={url}'
        },
        facebook: {
            name: 'Facebook',
            icon: 'facebook',
            url: 'https://www.facebook.com/sharer/sharer.php?u={url}'
        },
        linkedin: {
            name: 'LinkedIn',
            icon: 'linkedin',
            url: 'https://www.linkedin.com/sharing/share-offsite/?url={url}'
        },
        telegram: {
            name: 'Telegram',
            icon: 'telegram',
            url: 'https://t.me/share/url?url={url}&text={title}'
        }
    },
    
    share(platform) {
        const title = encodeURIComponent(document.title)
        const url = encodeURIComponent(window.location.href)
        
        const shareUrl = this.platforms[platform].url
            .replace('{title}', title)
            .replace('{url}', url)
        
        window.open(shareUrl, '_blank', 'width=600,height=400')
    },
    
    async copyLink() {
        try {
            await navigator.clipboard.writeText(window.location.href)
            
            // 顯示複製成功提示
            this.$dispatch('toast', {
                type: 'success',
                message: '連結已複製到剪貼板'
            })
        } catch (error) {
            console.error('複製連結失敗:', error)
        }
    },
    
    async nativeShare() {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: document.title,
                    url: window.location.href
                })
            } catch (error) {
                console.error('原生分享失敗:', error)
            }
        }
    }
}))

// 通知/Toast 系統
Alpine.data('toastSystem', () => ({
    toasts: [],
    
    init() {
        // 監聽 toast 事件
        this.$watch('toasts', () => {
            // 自動移除舊的 toast
            this.toasts.forEach((toast, index) => {
                if (toast.autoRemove) {
                    setTimeout(() => {
                        this.remove(index)
                    }, toast.duration || 3000)
                }
            })
        })
        
        // 全域事件監聽
        window.addEventListener('toast', (e) => {
            this.show(e.detail)
        })
    },
    
    show(options) {
        const toast = {
            id: Date.now(),
            type: options.type || 'info',
            message: options.message || '',
            duration: options.duration || 3000,
            autoRemove: options.autoRemove !== false
        }
        
        this.toasts.push(toast)
        
        if (toast.autoRemove) {
            setTimeout(() => {
                this.removeById(toast.id)
            }, toast.duration)
        }
    },
    
    remove(index) {
        this.toasts.splice(index, 1)
    },
    
    removeById(id) {
        const index = this.toasts.findIndex(toast => toast.id === id)
        if (index > -1) {
            this.remove(index)
        }
    },
    
    clear() {
        this.toasts = []
    }
}))

// 模態框系統
Alpine.data('modalSystem', () => ({
    isOpen: false,
    title: '',
    content: '',
    type: 'default',
    
    open(options = {}) {
        this.title = options.title || ''
        this.content = options.content || ''
        this.type = options.type || 'default'
        this.isOpen = true
        
        // 防止背景滾動
        document.body.style.overflow = 'hidden'
    },
    
    close() {
        this.isOpen = false
        document.body.style.overflow = ''
        
        // 清空內容
        this.$nextTick(() => {
            this.title = ''
            this.content = ''
            this.type = 'default'
        })
    },
    
    confirm(message, callback) {
        this.open({
            title: '確認',
            content: message,
            type: 'confirm'
        })
        
        this.onConfirm = callback
    },
    
    handleConfirm() {
        if (this.onConfirm) {
            this.onConfirm()
        }
        this.close()
    }
}))

// 圖片畫廊系統
Alpine.data('gallerySystem', () => ({
    isOpen: false,
    currentIndex: 0,
    images: [],
    
    init() {
        // 收集頁面中的圖片
        this.collectImages()
        
        // 鍵盤控制
        document.addEventListener('keydown', (e) => {
            if (!this.isOpen) return
            
            switch (e.key) {
                case 'Escape':
                    this.close()
                    break
                case 'ArrowLeft':
                    this.prev()
                    break
                case 'ArrowRight':
                    this.next()
                    break
            }
        })
    },
    
    collectImages() {
        const contentImages = document.querySelectorAll('article img, .gallery img')
        this.images = Array.from(contentImages).map(img => ({
            src: img.src,
            alt: img.alt || '',
            caption: img.dataset.caption || img.alt || ''
        }))
    },
    
    open(imageIndex) {
        this.currentIndex = imageIndex
        this.isOpen = true
        document.body.style.overflow = 'hidden'
    },
    
    close() {
        this.isOpen = false
        document.body.style.overflow = ''
    },
    
    next() {
        this.currentIndex = (this.currentIndex + 1) % this.images.length
    },
    
    prev() {
        this.currentIndex = this.currentIndex === 0 
            ? this.images.length - 1 
            : this.currentIndex - 1
    },
    
    get currentImage() {
        return this.images[this.currentIndex]
    }
}))

// 表單驗證系統
Alpine.data('formValidator', () => ({
    errors: {},
    touched: {},
    
    validate(field, value, rules) {
        this.touched[field] = true
        this.errors[field] = []
        
        rules.forEach(rule => {
            switch (rule.type) {
                case 'required':
                    if (!value || value.trim() === '') {
                        this.errors[field].push(rule.message || '此欄位為必填')
                    }
                    break
                    
                case 'email':
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
                    if (value && !emailRegex.test(value)) {
                        this.errors[field].push(rule.message || '請輸入有效的電子郵件地址')
                    }
                    break
                    
                case 'minLength':
                    if (value && value.length < rule.value) {
                        this.errors[field].push(rule.message || `最少需要 ${rule.value} 個字符`)
                    }
                    break
                    
                case 'maxLength':
                    if (value && value.length > rule.value) {
                        this.errors[field].push(rule.message || `最多 ${rule.value} 個字符`)
                    }
                    break
            }
        })
        
        return this.errors[field].length === 0
    },
    
    hasError(field) {
        return this.touched[field] && this.errors[field] && this.errors[field].length > 0
    },
    
    getError(field) {
        return this.hasError(field) ? this.errors[field][0] : ''
    },
    
    isValid() {
        return Object.keys(this.errors).every(field => 
            !this.errors[field] || this.errors[field].length === 0
        )
    },
    
    reset() {
        this.errors = {}
        this.touched = {}
    }
}))

// 載入狀態管理
Alpine.data('loadingState', () => ({
    isLoading: false,
    loadingText: '載入中...',
    
    start(text = '載入中...') {
        this.loadingText = text
        this.isLoading = true
    },
    
    stop() {
        this.isLoading = false
    },
    
    async wrap(promise, text = '處理中...') {
        this.start(text)
        try {
            const result = await promise
            return result
        } finally {
            this.stop()
        }
    }
}))

// 無限滾動系統
Alpine.data('infiniteScroll', () => ({
    loading: false,
    hasMore: true,
    page: 1,
    items: [],
    
    init() {
        // 監聽滾動到底部
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && this.hasMore && !this.loading) {
                    this.loadMore()
                }
            })
        })
        
        const trigger = this.$refs.trigger
        if (trigger) {
            observer.observe(trigger)
        }
    },
    
    async loadMore() {
        if (this.loading || !this.hasMore) return
        
        this.loading = true
        
        try {
            const response = await this.fetchData(this.page + 1)
            
            if (response.items && response.items.length > 0) {
                this.items.push(...response.items)
                this.page++
                this.hasMore = response.hasMore !== false
            } else {
                this.hasMore = false
            }
        } catch (error) {
            console.error('載入更多內容失敗:', error)
        } finally {
            this.loading = false
        }
    },
    
    async fetchData(page) {
        // 這個方法需要由具體實現覆蓋
        throw new Error('fetchData 方法需要被實現')
    }
}))

// 狀態持久化助手
Alpine.data('persistentState', (key, defaultValue = null) => ({
    value: Alpine.$persist(defaultValue).as(key),
    
    set(newValue) {
        this.value = newValue
    },
    
    get() {
        return this.value
    },
    
    clear() {
        this.value = defaultValue
    }
}))

console.log('Alpine.js 互動功能模組載入完成')
