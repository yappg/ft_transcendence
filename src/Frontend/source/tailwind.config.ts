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
        // 'white-crd': 'var(--white-color-card)',
      },
      backgroundColor: {},
      colors: {
        'white-crd': 'var(--white-color-card)',
        secondary: 'var(--secondary-color)',
        primary: 'var(--primary-color)',
        'secondary-dark': 'var(--secondary-color-dark)',
        'primary-dark': 'var(--primary-color-dark)',
      },
      fontFamily: {
        // coustard: ['Coustard', 'serif'],
        dayson: ['Days On', 'serif'],
      },
    },
  },
  variants: {
    extend: {
      textColor: ['dark'],
    },
  },
  plugins: [],
  darkMode: 'class',
};

export default config;
