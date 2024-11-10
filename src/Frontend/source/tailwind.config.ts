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
        'gradient-radial':
          'linear-gradient(125deg, rgba(34,33,33,0.2) 0%, rgba(127,166,192,0.2) 37%, rgba(193,56,44,0.2) 70%, rgba(136,132,132,0.2) 100%)',
        'gradient-linear-white':
          'linear-gradient(125deg, rgba(242,242,242,1) 0%, rgba(40,175,176,1) 100%);',
        custom: 'linear-gradient(125deg, rgba(19,25,29,1) 0%,rgba(19,25,29,1) 100%);',
        custom2: 'linear-gradient(125deg, rgba(0,0,0,0.2) 0%,rgba(0,0,0,0.2) 100%);',
      },
      backgroundColor: {},
      colors: {
        'my-red': 'var(--myred)',
        'my-red-90': 'rgb(193,56,44,0.9)',
      },
      fontFamily: {
        coustard: ['Coustard', 'serif'],
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
