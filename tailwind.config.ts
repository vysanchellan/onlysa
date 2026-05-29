import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ["var(--font-display)", "serif"],
        body: ["var(--font-body)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      colors: {
        bg: {
          DEFAULT: "#080808",
          secondary: "#111111",
          card: "#141414",
          elevated: "#1C1C1C",
        },
        accent: {
          red: "#E63946",
          orange: "#F4531C",
          blue: "#2563EB",
          purple: "#7C3AED",
          green: "#059669",
          teal: "#0D9488",
        },
        sa: {
          green: "#007A4D",
          red: "#DE3831",
        },
        text: {
          primary: "#F0EDE8",
          secondary: "#9A9590",
          muted: "#5A5652",
        },
        border: {
          DEFAULT: "#232323",
          subtle: "#1A1A1A",
        },
      },
      animation: {
        "fade-up": "fadeUp 0.6s ease forwards",
        "fade-in": "fadeIn 0.4s ease forwards",
        "pulse-glow": "pulseGlow 2s ease-in-out infinite",
        "slide-in": "slideIn 0.3s ease forwards",
        "shimmer": "shimmer 2s linear infinite",
      },
      keyframes: {
        fadeUp: {
          from: { opacity: "0", transform: "translateY(20px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        pulseGlow: {
          "0%, 100%": { boxShadow: "0 0 20px rgba(230, 57, 70, 0.3)" },
          "50%": { boxShadow: "0 0 40px rgba(230, 57, 70, 0.6)" },
        },
        slideIn: {
          from: { opacity: "0", transform: "translateX(-10px)" },
          to: { opacity: "1", transform: "translateX(0)" },
        },
        shimmer: {
          from: { backgroundPosition: "-200% 0" },
          to: { backgroundPosition: "200% 0" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
