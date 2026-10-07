export default {content: [
  './index.html',
  './src/**/*.{js,ts,jsx,tsx}'
],
  theme: {
    extend: {
      colors: {
        cream: '#F6F1E8',
        paper: '#FCFAF5',
        rule: '#E3DACB',
        ink: {
          DEFAULT: '#1A2130',
          soft: '#4B5366',
          faint: '#636A79',
        },
        copper: {
          DEFAULT: '#9A5226',
          light: '#D9A27A',
          wash: '#F0E4D6',
        },
      },
      fontFamily: {
        serif: ['Newsreader', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
};
