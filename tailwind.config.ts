// tailwind.config.ts
// Tailwind v4: theme tokens live in @theme{} in globals.css — not here.
// This file only tells Tailwind where to scan for class names.
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
};

export default config;
