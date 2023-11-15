const plugin = require('tailwindcss/plugin');
const defaultTheme = require('tailwindcss/defaultTheme');
const typographyPlugin = require('./tailwind.plugins/typography');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./components/**/*.{js,vue,ts}', './layouts/**/*.vue', './pages/**/*.vue', './plugins/**/*.{js,ts}'],
  theme: {
    colors: {
      transparent: 'transparent',
      white: '#ffffff',
      black: {
        DEFAULT: '#000000',
        warm: '#242424',
      },
      gray: {
        warm: '#f2efed',
        DEFAULT: '#777777',
        100: '#f8f7f6',
        200: '#f2efed',
        300: '#C2BFBE',
        400: '#CCCCCC',
        600: '#72706F',
        700: '#61605F',
        800: '#666666',
        900: '#999999',
      },
      orange: {
        100: '#FFE2D6',
        DEFAULT: '#FF4D00',
      },
      green: {
        100: '#DBEDE0',
        DEFAULT: '#008223',
        700: '#00CF30',
      },
      yellow: {
        DEFAULT: '#F4CB63',
      },
      blue: {
        DEFAULT: '#62C3F4',
      },
      red: {
        100: '#F9D7DD',
        DEFAULT: '#D80228',
      },
    },
    fontFamily: {
      sans: ['TWK Everett', ...defaultTheme.fontFamily.sans],
      offbit: ['OffBit', ...defaultTheme.fontFamily.sans],
      mono: defaultTheme.fontFamily.mono,
    },
    extend: {
      borderColor: {
        DEFAULT: '#C2BFBE',
      },
      spacing: {
        30: '7.5rem',
        35: '8.75rem',
        45: '11.25rem',
        50: '12.5rem',
        60: '15rem',
        70: '17.5rem',
      },
      boxShadow: {
        card: '16px 32px 128px -8px rgba(0, 0, 0, 0.07)',
        'large-card': '0px 15px 54px 0px rgba(0, 0, 0, 0.06)',
      },
      dropShadow: {
        button: '0 15px 34px rgba(0, 0, 0, 0.1)',
        'button-hov': '0 10px 34px rgba(0, 0, 0, 0.13)',
      },
      animation: {
        'spin-slow': 'spin 20s linear infinite',
      },
    },
    container: {
      center: true,
      padding: {
        DEFAULT: '1.5rem',
        lg: '2rem',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/aspect-ratio'),
    require('@headlessui/tailwindcss'),
    typographyPlugin,
    plugin(({ addComponents }) => {
      addComponents({
        '.label': {
          '@apply block caption text-gray-800': {},
        },
      });
    }),
  ],
};
