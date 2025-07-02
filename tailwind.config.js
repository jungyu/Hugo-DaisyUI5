// TailwindCSS v4.1.11 配置文件
// 基於 DaisyUI v5.0.43 的現代化配置

module.exports = {
  content: [
    './layouts/**/*.html',
    './themes/twda_v5/layouts/**/*.html',
    './content/**/*.md',
    './assets/js/**/*.js',
    './static/js/**/*.js'
  ],
  darkMode: ['class', '[data-theme="dracula"]'],
  theme: {
    extend: {
      fontFamily: {
        'sans': [
          'Inter',
          'Noto Sans TC',
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'Helvetica Neue',
          'Arial',
          'sans-serif'
        ],
        'serif': [
          'Noto Serif TC',
          'Georgia',
          'Times New Roman',
          'serif'
        ],
        'mono': [
          'JetBrains Mono',
          'Fira Code',
          'Consolas',
          'Monaco',
          'Courier New',
          'monospace'
        ]
      },
      colors: {
        // 自訂顏色，與 DaisyUI 整合
        'brand': {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e'
        }
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem'
      },
      maxWidth: {
        '8xl': '88rem',
        '9xl': '96rem'
      },
      typography: (theme) => ({
        DEFAULT: {
          css: {
            '--tw-prose-body': theme('colors.base-content'),
            '--tw-prose-headings': theme('colors.base-content'),
            '--tw-prose-lead': theme('colors.base-content'),
            '--tw-prose-links': theme('colors.primary'),
            '--tw-prose-bold': theme('colors.base-content'),
            '--tw-prose-counters': theme('colors.base-content'),
            '--tw-prose-bullets': theme('colors.base-content'),
            '--tw-prose-hr': theme('colors.base-300'),
            '--tw-prose-quotes': theme('colors.base-content'),
            '--tw-prose-quote-borders': theme('colors.base-300'),
            '--tw-prose-captions': theme('colors.base-content'),
            '--tw-prose-code': theme('colors.base-content'),
            '--tw-prose-pre-code': theme('colors.base-content'),
            '--tw-prose-pre-bg': theme('colors.base-200'),
            '--tw-prose-th-borders': theme('colors.base-300'),
            '--tw-prose-td-borders': theme('colors.base-200'),
            lineHeight: '1.75',
            fontSize: '1rem',
            maxWidth: 'none',
            code: {
              color: theme('colors.primary'),
              backgroundColor: theme('colors.base-200'),
              paddingLeft: '0.25rem',
              paddingRight: '0.25rem',
              paddingTop: '0.125rem',
              paddingBottom: '0.125rem',
              borderRadius: '0.25rem',
              fontWeight: '400'
            },
            'code::before': {
              content: '""'
            },
            'code::after': {
              content: '""'
            },
            pre: {
              backgroundColor: theme('colors.base-200'),
              color: theme('colors.base-content')
            }
          }
        }
      })
    }
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms'),
    require('@tailwindcss/aspect-ratio'),
    require('daisyui')
  ],
  daisyui: {
    themes: [
      'light',
      'dark',
      'cupcake',
      'bumblebee',
      'emerald',
      'corporate',
      'synthwave',
      'retro',
      'cyberpunk',
      'valentine',
      'halloween',
      'garden',
      'forest',
      'aqua',
      'lofi',
      'pastel',
      'fantasy',
      'wireframe',
      'black',
      'luxury',
      'dracula',
      'cmyk',
      'autumn',
      'business',
      'acid',
      'lemonade',
      'night',
      'coffee',
      'winter',
      'dim',
      'nord',
      'sunset'
    ],
    darkTheme: 'dracula',
    base: true,
    styled: true,
    utils: true,
    prefix: '',
    logs: true,
    themeRoot: ':root'
  }
};
