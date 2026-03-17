/** @type {import('tailwindcss').Config} */
module.exports = {
  prefix: 'fe-',
  important: '.form-engine-root',
  corePlugins: {
    preflight: false,
  },
  content: [
    './packages/core/src/**/*.{ts,tsx}',
    './packages/react/src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#e6f5ed',
          100: '#c2e6d0',
          200: '#99d4b1',
          300: '#6ec291',
          400: '#4db578',
          500: '#008542',
          600: '#006d36',
          700: '#005a2c',
          800: '#004422',
          900: '#003018',
        },
        error: {
          50: '#fef2f2',
          100: '#fee2e2',
          500: '#ef4444',
          600: '#dc2626',
          700: '#b91c1c',
        },
        success: {
          50: '#f0fdf4',
          500: '#22c55e',
          600: '#16a34a',
        },
      },
    },
  },
  plugins: [],
};
