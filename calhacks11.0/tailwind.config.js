/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // Adjust this to where your components are located
    "./public/index.html",
  ],
  theme: {
    extend: {
      animation: {
        shake: "shake 1s cubic-bezier(.36,.07,.19,.97) both",
        pulseone: "scale 0.5s 6s alternate",
        fall: "fall 2s forwards",
      },
      keyframes: {
        shake: {
          "10%, 90%": {
            transform: "translate3d(-1px, 0, 0)",
          },
          "20%, 80%": {
            transform: "translate3d(2px, 0, 0)",
          },
          "30%, 50%, 70%": {
            transform: "translate3d(-4px, 0, 0)",
          },
          "40%, 60%": {
            transform: "translate3d(4px, 0, 0)",
          },
        },
        scale: {
          "0%": { transform: "scale(1)" },
          "100%": { transform: "scale(1.02)" }, // Scale up slightly
        },
        fall: {
          "0%": { transform: "translateY(-100px)", opacity: "1" },
          "100%": { transform: "translateY(100vh)", opacity: "0" },
        },
      },
    },
  },
  plugins: [],
};
