import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'teal-4': 'rgb(20 184 166)',
        'teal-6': 'rgb(13 148 136)',
        'alabaster': 'var(--alabaster-grey)',
        'pacific-cyan': 'var(--pacific-cyan)',
        'dark-teal': 'var(--dark-teal)',
        'cerulean': 'var(--cerulean)',
        'turquoise-surf': 'var(--turquoise-surf)',
      },
      backgroundImage: {
        'brand-gradient': 'linear-gradient(90deg, var(--pacific-cyan), var(--turquoise-surf))',
      },
    },
  },
  plugins: [],
};

export default config;
