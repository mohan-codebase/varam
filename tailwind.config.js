/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./*.html', './js/**/*.js'],
  theme: {
    extend: {
      colors: {
        brand: {
          yellow: '#EBBE41',
          'yellow-hover': '#D4A82E',
          'yellow-tint': '#FBF1D4',
          charcoal: '#3C3B39',
          text: '#2A2A28',
          muted: '#6B6A67',
          border: '#E5E2DC',
          tint: '#FAF8F3',
        },
      },
      fontFamily: {
        sans: ['Jost', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
