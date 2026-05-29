// tailwind.config.ts
// NOTE: Tailwind v4 does not read this file for theme tokens —
// those are now declared via @theme {} in globals.css.
// This file is kept only as a reference / if you ever downgrade to v3.
// You can safely DELETE this file from your project.

import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
};

export default config;
