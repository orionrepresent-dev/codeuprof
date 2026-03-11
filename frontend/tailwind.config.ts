import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#020617", // Midnight Blue - Deep Space
        foreground: "#F8FAFC", // Slate 50
        gold: "#D4AF37", // Ouro Alquímico
        "deep-violet": "#4C1D95", // Violeta Escuro
        "mystic-purple": "#7C3AED", // Violeta de Transmutação
        "glass-border": "rgba(255, 255, 255, 0.1)",
        "glass-bg": "rgba(2, 6, 23, 0.6)",
      },
      fontFamily: {
        serif: ["Merriweather", "serif"], // or any other serif like Playfair Display
        sans: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
