import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        studio: {
          950: "#050505",
          900: "#0a0a0a",
          850: "#121212",
          800: "#181818",
          700: "#242424",
          600: "#383838",
          400: "#888888",
          300: "#b5b5b5",
          200: "#dcdcdc",
          100: "#f0f0f0",
          50: "#fbfbfb",
        },
        chrome: {
          foil: "#e2e8f0",
          silver: "#cbd5e1",
          iridescent: "#a5b4fc",
          platinum: "#e2e8f0",
        },
      },
      fontFamily: {
        // Primary: Manrope — headings & large display text
        sans: ["var(--font-manrope)", "Manrope", "Helvetica Neue", "Arial", "sans-serif"],
        manrope: ["var(--font-manrope)", "Manrope", "Helvetica Neue", "Arial", "sans-serif"],
        // Secondary: Helvetica — body/base text (system)
        body: ["Helvetica Neue", "Helvetica", "Arial", "sans-serif"],
        helvetica: ["Helvetica Neue", "Helvetica", "Arial", "sans-serif"],
        // Tertiary: Cormorant Garamond — cursive editorial/accent
        cursive: ["var(--font-cormorant)", "Cormorant Garamond", "Georgia", "serif"],
        cormorant: ["var(--font-cormorant)", "Cormorant Garamond", "Georgia", "serif"],
        mono: ["JetBrains Mono", "Courier New", "monospace"],
        // Alias for backwards compatibility
        display: ["var(--font-manrope)", "Manrope", "sans-serif"],
      },
      animation: {
        'marquee': 'marquee 25s linear infinite',
        'marquee-reverse': 'marquee-reverse 25s linear infinite',
        'float-slow': 'float 6s ease-in-out infinite',
        'float-reverse': 'float-reverse 7s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 4s ease-in-out infinite',
        'spin-slow': 'spin 20s linear infinite',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        'marquee-reverse': {
          '0%': { transform: 'translateX(-50%)' },
          '100%': { transform: 'translateX(0%)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(-15px) rotate(3deg)' },
        },
        'float-reverse': {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(15px) rotate(-3deg)' },
        },
        'pulse-glow': {
          '0%, 100%': { opacity: '0.4', filter: 'brightness(1)' },
          '50%': { opacity: '0.8', filter: 'brightness(1.3)' },
        },
      },
      letterSpacing: {
        'ultra-wide': '0.3em',
        'tight-heading': '-0.04em',
      },
    },
  },
  plugins: [],
};
export default config;
