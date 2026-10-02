/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./js/**/*.{js,ts,jsx,tsx}",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        sogan: {
          50: "#fcf8f0", 100: "#f6ecd2", 200: "#edd8a4", 300: "#e1bd6f",
          400: "#d5a140", 500: "#b87c24", 600: "#945c1a", 700: "#724117",
          800: "#552e16", 900: "#3c1f11", 950: "#1e0d06",
        },
        prada: { light: "#fdf0cd", DEFAULT: "#d4af37", dark: "#9a7b1c" },
        keraton: "#0f141d",
        wulung: "#182030",
        ala: "#a8402f",
        becik: "#276749",
      },
      fontFamily: {
        cinzel: ['"Cinzel Decorative"', "serif"],
        fraunces: ['"Fraunces"', "serif"],
        marcellus: ['"Marcellus"', "serif"],
        mono: ['"JetBrains Mono"', "monospace"],
        sans: ['"Plus Jakarta Sans"', "sans-serif"],
        jawa: ['"Noto Sans Javanese"', "serif"],
      }
    }
  },
  plugins: [],
};
