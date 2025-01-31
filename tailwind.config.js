/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "black-primary": "#191919",
        "black-secondary": "#292828",
        "green-primary": "#1d6d55",
      },
    },
  },
  plugins: [],
};

