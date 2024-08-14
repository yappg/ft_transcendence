import { draftMode } from 'next/headers';

/** @type {import('postcss-load-config').Config} */
const config = {
  theme: {
    extend: {
      dropShadow: {
        custom: '0 -2px 50px rgba(0, 0, 0, 1)',
      },
    },
  },
  plugins: {
    tailwindcss: {},
  },
};

export default config;
