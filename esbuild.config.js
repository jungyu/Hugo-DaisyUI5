// ESBuild 配置文件
// 用於處理 JavaScript 打包和最佳化

const esbuild = require('esbuild');
const path = require('path');

const isProduction = process.env.NODE_ENV === 'production';

// 基本配置
const config = {
  entryPoints: [
    'assets/js/main.js',
    'themes/twda_v5/assets/js/theme.js'
  ],
  bundle: true,
  outdir: 'static/js',
  format: 'iife',
  target: ['es2020'],
  platform: 'browser',
  sourcemap: !isProduction,
  minify: isProduction,
  treeShaking: true,
  splitting: false, // IIFE 格式不支援 splitting
  
  // 處理各種文件類型
  loader: {
    '.js': 'js',
    '.ts': 'ts',
    '.jsx': 'jsx',
    '.tsx': 'tsx',
    '.png': 'file',
    '.jpg': 'file',
    '.jpeg': 'file',
    '.gif': 'file',
    '.svg': 'file',
    '.webp': 'file',
    '.avif': 'file',
    '.woff': 'file',
    '.woff2': 'file',
    '.ttf': 'file',
    '.eot': 'file'
  },
  
  // 外部依賴 (從 CDN 載入)
  external: [
    'alpinejs'
  ],
  
  // 全域變數映射
  define: {
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
    'process.env.HUGO_ENVIRONMENT': JSON.stringify(process.env.HUGO_ENVIRONMENT || 'development')
  },
  
  // 插件
  plugins: [
    {
      name: 'hugo-esbuild',
      setup(build) {
        // 建構開始時的處理
        build.onStart(() => {
          console.log('[ESBuild] 開始打包 JavaScript...');
        });
        
        // 建構結束時的處理
        build.onEnd((result) => {
          if (result.errors.length > 0) {
            console.error('[ESBuild] 打包失敗:', result.errors);
          } else {
            console.log('[ESBuild] 打包完成!');
          }
        });
        
        // 解析 Hugo 資源路徑
        build.onResolve({ filter: /^hugo:/ }, (args) => {
          return {
            path: args.path.replace('hugo:', ''),
            namespace: 'hugo-resources'
          };
        });
        
        // 載入 Hugo 資源
        build.onLoad({ filter: /.*/, namespace: 'hugo-resources' }, (args) => {
          const resourcePath = path.join(process.cwd(), 'assets', args.path);
          return {
            path: resourcePath,
            loader: path.extname(args.path).slice(1) || 'js'
          };
        });
      }
    }
  ]
};

// 開發模式的額外配置
if (!isProduction) {
  config.banner = {
    js: '// Development Build - ' + new Date().toISOString()
  };
}

// 生產模式的額外配置
if (isProduction) {
  config.drop = ['console', 'debugger'];
  config.legalComments = 'none';
}

// 導出配置
module.exports = config;

// 如果直接執行此文件，進行打包
if (require.main === module) {
  const watchMode = process.argv.includes('--watch');
  
  if (watchMode) {
    // 監視模式
    esbuild.context(config).then(context => {
      context.watch();
      console.log('[ESBuild] 監視模式已啟動...');
    }).catch(() => process.exit(1));
  } else {
    // 單次打包
    esbuild.build(config).catch(() => process.exit(1));
  }
}
