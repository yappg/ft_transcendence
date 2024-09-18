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
      },
      colors: {
        'my-red': 'var(--myred)',
      },
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
        coustard: ['Coustard', 'serif'],
      },
    },
  },
  variants: {},
  plugins: [],
};
export default config;
