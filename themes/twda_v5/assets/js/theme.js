// TWDA v5 主題 JavaScript
// 基於 Alpine.js v3.14.9 的現代化互動功能

import Alpine from 'alpinejs';

// 主題切換功能
Alpine.data('themeToggle', () => ({
  theme: 'dracula',
  
  init() {
    // 從 localStorage 載入儲存的主題
    this.theme = localStorage.getItem('theme') || 'dracula';
    this.applyTheme();
    
    // 監聽系統主題變化
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addEventListener('change', (e) => {
      if (!localStorage.getItem('theme')) {
        this.theme = e.matches ? 'dracula' : 'cmyk';
        this.applyTheme();
      }
    });
  },
  
  toggle() {
    this.theme = this.theme === 'dracula' ? 'cmyk' : 'dracula';
    this.applyTheme();
    localStorage.setItem('theme', this.theme);
  },
  
  applyTheme() {
    document.documentElement.setAttribute('data-theme', this.theme);
  }
}));

// 導航選單
Alpine.data('navigation', () => ({
  isOpen: false,
  
  toggle() {
    this.isOpen = !this.isOpen;
  },
  
  close() {
    this.isOpen = false;
  }
}));

// 搜尋功能
Alpine.data('search', () => ({
  isOpen: false,
  query: '',
  results: [],
  loading: false,
  
  open() {
    this.isOpen = true;
    this.$nextTick(() => {
      this.$refs.searchInput.focus();
    });
  },
  
  close() {
    this.isOpen = false;
    this.query = '';
    this.results = [];
  },
  
  async search() {
    if (this.query.length < 2) {
      this.results = [];
      return;
    }
    
    this.loading = true;
    
    try {
      // 這裡可以整合 Hugo 的搜尋索引
      const response = await fetch(`/search.json`);
      const data = await response.json();
      
      // 簡單的搜尋邏輯
      this.results = data.filter(item => 
        item.title.toLowerCase().includes(this.query.toLowerCase()) ||
        item.content.toLowerCase().includes(this.query.toLowerCase()) ||
        (item.tags && item.tags.some(tag => 
          tag.toLowerCase().includes(this.query.toLowerCase())
        ))
      ).slice(0, 5);
    } catch (error) {
      console.error('搜尋錯誤:', error);
      this.results = [];
    } finally {
      this.loading = false;
    }
  }
}));

// 回到頂部按鈕
Alpine.data('backToTop', () => ({
  show: false,
  
  init() {
    window.addEventListener('scroll', () => {
      this.show = window.scrollY > 300;
    });
  },
  
  scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }
}));

// 圖片懶載入
Alpine.data('lazyImage', () => ({
  loaded: false,
  error: false,
  
  load() {
    this.loaded = true;
  },
  
  onError() {
    this.error = true;
  }
}));

// 複製程式碼功能
Alpine.data('codeBlock', () => ({
  copied: false,
  
  async copy(text) {
    try {
      await navigator.clipboard.writeText(text);
      this.copied = true;
      setTimeout(() => {
        this.copied = false;
      }, 2000);
    } catch (error) {
      console.error('複製失敗:', error);
    }
  }
}));

// 文章目錄
Alpine.data('tableOfContents', () => ({
  activeId: '',
  
  init() {
    // 監聽滾動事件，高亮當前章節
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.activeId = entry.target.id;
        }
      });
    }, {
      rootMargin: '-20% 0% -80% 0%'
    });
    
    // 觀察所有標題
    document.querySelectorAll('h1, h2, h3, h4, h5, h6').forEach(heading => {
      if (heading.id) {
        observer.observe(heading);
      }
    });
  },
  
  scrollTo(id) {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  }
}));

// 讀取進度條
Alpine.data('readingProgress', () => ({
  progress: 0,
  
  init() {
    window.addEventListener('scroll', () => {
      const article = document.querySelector('article');
      if (!article) return;
      
      const articleTop = article.offsetTop;
      const articleHeight = article.offsetHeight;
      const windowHeight = window.innerHeight;
      const scrollTop = window.scrollY;
      
      const start = articleTop - windowHeight / 2;
      const end = articleTop + articleHeight - windowHeight / 2;
      
      if (scrollTop < start) {
        this.progress = 0;
      } else if (scrollTop > end) {
        this.progress = 100;
      } else {
        this.progress = ((scrollTop - start) / (end - start)) * 100;
      }
    });
  }
}));

// 初始化 Alpine.js
window.Alpine = Alpine;
Alpine.start();

// 全域功能
window.toggleTheme = function() {
  const currentTheme = document.documentElement.getAttribute('data-theme');
  const newTheme = currentTheme === 'dracula' ? 'cmyk' : 'dracula';
  document.documentElement.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);
};

// DOM 載入完成後的初始化
document.addEventListener('DOMContentLoaded', function() {
  // 外部連結處理
  document.querySelectorAll('a[href^="http"]').forEach(link => {
    if (!link.getAttribute('target')) {
      link.setAttribute('target', '_blank');
      link.setAttribute('rel', 'noopener noreferrer');
    }
  });
  
  // 程式碼區塊增強
  document.querySelectorAll('pre code').forEach(block => {
    const pre = block.parentElement;
    const wrapper = document.createElement('div');
    wrapper.className = 'code-block-wrapper relative';
    
    // 複製按鈕
    const copyBtn = document.createElement('button');
    copyBtn.className = 'btn btn-sm btn-ghost absolute top-2 right-2 opacity-70 hover:opacity-100';
    copyBtn.innerHTML = `
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
      </svg>
    `;
    
    copyBtn.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(block.textContent);
        copyBtn.innerHTML = `
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
          </svg>
        `;
        setTimeout(() => {
          copyBtn.innerHTML = `
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
            </svg>
          `;
        }, 2000);
      } catch (error) {
        console.error('複製失敗:', error);
      }
    });
    
    pre.parentNode.insertBefore(wrapper, pre);
    wrapper.appendChild(pre);
    wrapper.appendChild(copyBtn);
  });
  
  console.log('TWDA v5 主題已載入完成');
  console.log('技術棧: Hugo v0.147.9 + TailwindCSS v4.1.11 + DaisyUI v5.0.43 + Alpine.js v3.14.9');
});
