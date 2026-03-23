module.exports = {
  darkMode: 'class',
  content: ['./pages/**/*.{js,jsx}', './components/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: { DEFAULT: '#059669', light: '#10B981', lighter: '#D1FAE5', bg: '#F0FDF4' }
      },
      fontFamily: { sans: ['DM Sans', 'sans-serif'], display: ['Syne', 'sans-serif'] },
      boxShadow: { brand: '0 4px 20px rgba(16,185,129,0.25)' }
    }
  },
  plugins: []
};
