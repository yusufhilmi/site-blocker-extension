/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {
      colors: {
        hab: {
          900: "#1F1F1F",
          600: "#6B6B6B",
          300: "#E6E6E6",
        },
      },
      fontFamily: {
        mono: ['"Roboto Mono"'],
      },
    },
  },
  plugins: [],
};
