/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}', // Adjust this to where your components are located
    './public/index.html',
  ],
  theme: {
    extend: {
      keyframes: {
        fire: {
          '0%': { backgroundPosition: 'center 0px, center 0px, 50% 100%, center center' },
          '100%': { backgroundPosition: 'center -500px, center -650px, 50% 100%, center center' },
        },
      },
      animation: {
        fire: 'fire 1.75s linear infinite',
      },
      filter: {
        brightness: 'brightness(3.7)',
        blur: 'blur(7px)',
        contrast: 'contrast(6)',
      },
      boxShadow: {
        'fire-glow': 'inset 0 -40px 50px -60px #63bbc5',
      },
      backgroundImage: {
        glitter: 'url("https://assets.codepen.io/13471/silver-glitter-background.png")',
        'fire-glow': 'radial-gradient(ellipse at bottom, transparent 30%, black 60%)',
      },
      backgroundBlendMode: {
        fire: 'color-dodge',
      },
    },
  },
  plugins: [],
};
