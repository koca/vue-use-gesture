// const defaultTheme = require('tailwindcss/defaultTheme')
const colors = require('windicss/colors')
const typography = require('windicss/plugin/typography')
module.exports = {
  darkMode: 'class',
  theme: {
    extend: {
      maxWidth: {
        '4.5xl': '60rem',
        '8xl': '90rem',
      },
      maxHeight: {
        sm: '30rem',
        'screen-18': `calc(100vh - 4.5rem)`,
      },
      colors: {
        'light-blue': colors.lightBlue,
        cyan: colors.cyan,
        orange: colors.amber,
      },
      backgroundOpacity: {
        15: '0.15',
      },

      typography: {
        DEFAULT: {
          css: {
            maxWidth: 'none',
            color: 'inherit',
            a: {
              // color: 'inherit',
              color: 'var(--text-link-primary)',
              opacity: 0.75,
              fontWeight: '600',
              textDecoration: 'underline',
              '&:hover': {
                opacity: 1,
                color: 'var(--hover-link-primary)',
              },
            },
            b: { color: 'inherit' },
            strong: { color: 'inherit' },
            em: { color: 'inherit' },
            h1: { color: 'inherit' },
            h2: { color: 'inherit' },
            h3: { color: 'inherit' },
            h4: { color: 'inherit' },
            code: { color: 'inherit' },
            pre: { fontSize: 'inherit' },
            blockquote: { color: 'inherit', marginLeft: '0px', fontStyle: 'normal' },
          },
        },
      },
    },
  },
  plugins: [typography()],
}
