// PostCSS 配置文件
// 用於處理 TailwindCSS 和其他 CSS 預處理器

module.exports = {
  plugins: {
    // TailwindCSS - 必須放在第一位
    tailwindcss: {},
    
    // Autoprefixer - 自動添加瀏覽器前綴
    autoprefixer: {
      overrideBrowserslist: [
        '> 1%',
        'last 2 versions',
        'not dead',
        'not ie 11'
      ]
    },
    
    // CSSnano - 生產環境壓縮 CSS (僅在生產環境啟用)
    ...(process.env.NODE_ENV === 'production' ? {
      cssnano: {
        preset: ['default', {
          discardComments: {
            removeAll: true
          },
          reduceIdents: false,
          zindex: false
        }]
      }
    } : {})
  }
};
