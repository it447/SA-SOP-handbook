import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
    "./src/lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: "#162b3e",
        "navy-deep": "#0f1f2e",
        "navy-soft": "#1e3a50",
        cream: "#fef2de",
        "cream-dim": "#e8d9c0",
        orange: "#ff6432",
        "orange-dark": "#e8522a",
        teal: "#2dd4bf",
        danger: "#ffb39a",
        warn: "#fbbf24",
        ok: "#86efac",
      },
      fontFamily: {
        serif: ['"Playfair Display"', "serif"],
        sans: [
          '"DM Sans"',
          "-apple-system",
          "BlinkMacSystemFont",
          '"Segoe UI"',
          "Roboto",
          "sans-serif",
        ],
      },
    },
  },
  plugins: [],
};

export default config;
