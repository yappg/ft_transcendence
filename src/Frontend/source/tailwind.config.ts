import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'linear-gradient-dark': 'var(--linear-gradient-dark)',
        'linear-gradient': 'var(--linear-gradient)',
        secondary: 'var(--secondary-color)',
        primary: 'var(--primary-color)',
        'secondary-dark': 'var(--secondary-color-dark)',
        'primary-dark': 'var(--primary-color-dark)',
        'fire-red': 'var(--fire-red)',
        'dark-teal': 'var(--dark-teal)',
      },
      backgroundColor: {},
      colors: {
        'black-crd': 'var(--black-color-card)',
        'white-crd': 'var(--white-color-card)',
        secondary: 'var(--secondary-color)',
        primary: 'var(--primary-color)',
        'secondary-dark': 'var(--secondary-color-dark)',
        'primary-dark': 'var(--primary-color-dark)',
        aqua: 'var(--aqua)',
        'fire-red': 'var(--fire-red)',
      },
      fontFamily: {
        coustard: ['Coustard', 'serif'],
        dayson: ['Days On', 'serif'],
      },
    },
  },
  variants: {
    extend: {
      textColor: ['dark'],
    },
  },
  plugins: [require('tailwind-scrollbar-hide')],
  darkMode: 'class',
};

export default config;
