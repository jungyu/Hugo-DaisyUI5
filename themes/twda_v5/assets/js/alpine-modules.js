// Alpine.js v3.14.9 核心功能模組
// 基於 Hugo + TailwindCSS + DaisyUI 架構

import Alpine from 'alpinejs'
import intersect from '@alpinejs/intersect'
import persist from '@alpinejs/persist'

// 註冊 Alpine.js 插件
Alpine.plugin(intersect)
Alpine.plugin(persist)

// 主題系統模組
Alpine.data('themeSystem', () => ({
    theme: Alpine.$persist('dracula').as('theme'),
    systemTheme: false,
    
    init() {
        // 初始化主題設定
        this.applyTheme()
        this.watchSystemTheme()
    },
    
    toggle() {
        this.theme = this.theme === 'dracula' ? 'cmyk' : 'dracula'
        this.applyTheme()
    },
    
    setTheme(newTheme) {
        this.theme = newTheme
        this.applyTheme()
    },
    
    applyTheme() {
        document.documentElement.setAttribute('data-theme', this.theme)
        
        // 觸發主題變更事件
        window.dispatchEvent(new CustomEvent('themeChanged', {
            detail: { theme: this.theme }
        }))
    },
    
    watchSystemTheme() {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
        
        const handleChange = (e) => {
            if (this.systemTheme) {
                this.theme = e.matches ? 'dracula' : 'cmyk'
                this.applyTheme()
            }
        }
        
        mediaQuery.addEventListener('change', handleChange)
    },
    
    enableSystemTheme() {
        this.systemTheme = true
        const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches
        this.theme = isDark ? 'dracula' : 'cmyk'
        this.applyTheme()
    }
}))

// 導航系統模組
Alpine.data('navigationSystem', () => ({
    isOpen: false,
    isMobile: Alpine.$persist(false).as('isMobile'),
    
    init() {
        this.checkMobile()
        window.addEventListener('resize', () => this.checkMobile())
        
        // 點擊外部關閉選單
        document.addEventListener('click', (e) => {
            if (!e.target.closest('[x-data*="navigationSystem"]')) {
                this.close()
            }
        })
    },
    
    toggle() {
        this.isOpen = !this.isOpen
        
        if (this.isOpen) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = ''
        }
    },
    
    open() {
        this.isOpen = true
        document.body.style.overflow = 'hidden'
    },
    
    close() {
        this.isOpen = false
        document.body.style.overflow = ''
    },
    
    checkMobile() {
        this.isMobile = window.innerWidth < 768
        if (!this.isMobile) {
            this.close()
        }
    }
}))

// 搜尋系統模組 (Fuse.js 整合)
Alpine.data('searchSystem', () => ({
    isOpen: false,
    query: '',
    results: [],
    loading: false,
    searchIndex: null,
    fuse: null,
    
    async init() {
        // 載入搜尋索引
        await this.loadSearchIndex()
        
        // 鍵盤快捷鍵
        document.addEventListener('keydown', (e) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault()
                this.open()
            }
            
            if (e.key === 'Escape' && this.isOpen) {
                this.close()
            }
        })
    },
    
    async loadSearchIndex() {
        try {
            const response = await fetch('/search.json')
            this.searchIndex = await response.json()
            
            // 初始化 Fuse.js (需要在 HTML 中引入)
            if (window.Fuse) {
                this.fuse = new Fuse(this.searchIndex, {
                    keys: [
                        { name: 'title', weight: 2.0 },
                        { name: 'content', weight: 1.0 },
                        { name: 'tags', weight: 1.5 },
                        { name: 'categories', weight: 1.5 }
                    ],
                    threshold: 0.3,
                    distance: 100,
                    minMatchCharLength: 2
                })
            }
        } catch (error) {
            console.error('載入搜尋索引失敗:', error)
        }
    },
    
    open() {
        this.isOpen = true
        this.$nextTick(() => {
            this.$refs.searchInput?.focus()
        })
    },
    
    close() {
        this.isOpen = false
        this.query = ''
        this.results = []
    },
    
    async search() {
        if (this.query.length < 2) {
            this.results = []
            return
        }
        
        this.loading = true
        
        try {
            if (this.fuse) {
                // 使用 Fuse.js 進行模糊搜尋
                const searchResults = this.fuse.search(this.query)
                this.results = searchResults.slice(0, 10).map(result => result.item)
            } else {
                // 備用簡單搜尋
                this.results = this.searchIndex.filter(item => 
                    item.title.toLowerCase().includes(this.query.toLowerCase()) ||
                    item.content.toLowerCase().includes(this.query.toLowerCase())
                ).slice(0, 10)
            }
        } catch (error) {
            console.error('搜尋錯誤:', error)
            this.results = []
        } finally {
            this.loading = false
        }
    },
    
    goToResult(url) {
        window.location.href = url
        this.close()
    }
}))

// 滾動追蹤模組
Alpine.data('scrollTracker', () => ({
    scrollY: 0,
    progress: 0,
    isVisible: false,
    
    init() {
        this.updateScroll()
        window.addEventListener('scroll', () => this.updateScroll())
    },
    
    updateScroll() {
        this.scrollY = window.scrollY
        this.isVisible = this.scrollY > 300
        
        // 計算閱讀進度
        const article = document.querySelector('article') || document.querySelector('main')
        if (article) {
            const articleTop = article.offsetTop
            const articleHeight = article.offsetHeight
            const windowHeight = window.innerHeight
            
            const start = articleTop - windowHeight / 2
            const end = articleTop + articleHeight - windowHeight / 2
            
            if (this.scrollY < start) {
                this.progress = 0
            } else if (this.scrollY > end) {
                this.progress = 100
            } else {
                this.progress = Math.round(((this.scrollY - start) / (end - start)) * 100)
            }
        }
    },
    
    scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        })
    },
    
    scrollToElement(selector) {
        const element = document.querySelector(selector)
        if (element) {
            element.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            })
        }
    }
}))

// 目錄 (TOC) 模組
Alpine.data('tableOfContents', () => ({
    activeId: '',
    headings: [],
    isOpen: false,
    
    init() {
        this.collectHeadings()
        this.setupIntersectionObserver()
    },
    
    collectHeadings() {
        this.headings = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6'))
            .filter(heading => heading.id)
            .map(heading => ({
                id: heading.id,
                text: heading.textContent,
                level: parseInt(heading.tagName.charAt(1))
            }))
    },
    
    setupIntersectionObserver() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.activeId = entry.target.id
                }
            })
        }, {
            rootMargin: '-20% 0% -80% 0%'
        })
        
        this.headings.forEach(heading => {
            const element = document.getElementById(heading.id)
            if (element) {
                observer.observe(element)
            }
        })
    },
    
    scrollToHeading(id) {
        const element = document.getElementById(id)
        if (element) {
            element.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            })
        }
        this.isOpen = false
    },
    
    toggle() {
        this.isOpen = !this.isOpen
    }
}))

// 程式碼區塊模組
Alpine.data('codeBlock', () => ({
    copied: false,
    language: 'text',
    
    init() {
        // 檢測程式語言
        const codeElement = this.$el.querySelector('code')
        if (codeElement) {
            const classes = codeElement.className.split(' ')
            const langClass = classes.find(cls => cls.startsWith('language-'))
            if (langClass) {
                this.language = langClass.replace('language-', '')
            }
        }
    },
    
    async copy() {
        const codeElement = this.$el.querySelector('code')
        if (!codeElement) return
        
        try {
            await navigator.clipboard.writeText(codeElement.textContent)
            this.copied = true
            
            setTimeout(() => {
                this.copied = false
            }, 2000)
        } catch (error) {
            console.error('複製失敗:', error)
        }
    }
}))

// 圖片懶載入模組
Alpine.data('lazyImage', () => ({
    loaded: false,
    error: false,
    src: '',
    
    init() {
        this.src = this.$el.dataset.src || this.$el.src
    },
    
    loadImage() {
        if (this.loaded || this.error) return
        
        const img = new Image()
        img.onload = () => {
            this.loaded = true
            this.$el.src = this.src
        }
        img.onerror = () => {
            this.error = true
        }
        img.src = this.src
    }
}))

// 啟動 Alpine.js
window.Alpine = Alpine
Alpine.start()

// 全域事件監聽
document.addEventListener('DOMContentLoaded', () => {
    console.log('Alpine.js v3.14.9 模組載入完成')
    console.log('Hugo + TailwindCSS + DaisyUI + Alpine.js 技術棧已就緒')
})
