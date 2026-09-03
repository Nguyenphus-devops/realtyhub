/* tailwind.config.js */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      maxWidth: {
        '7xl': '1350px',
      },
      screens: {
        'xs': '375px',
      },
    },
  },
  plugins: [],
};
