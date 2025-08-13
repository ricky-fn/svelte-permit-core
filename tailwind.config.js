const colors = require('tailwindcss/colors')

module.exports = {
  theme: {
    fontFamily: {
      sans: ['Graphik', 'sans-serif'],
      serif: ['Merriweather', 'serif'],
    },
    extend: {
      colors: {
        primary: '#4361ee',
        'primary-dark': '#3f37c9',
        secondary: '#4cc9f0',
        danger: '#f72585',
        success: '#4ade80',
        warning: '#f59e0b',
        dark: '#1e293b',
        light: '#f8fafc',
      },
    }
  },
  variants: {
    extend: {}
  }
}