import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      screens: {
        'xs': '320px',
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1440px',
        '2xl': '1536px',
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: "#8B5CF6", // Violet
        secondary: "#10B981", // Emerald
        accent: "#F472B6", // Pink
      },
    },
  },
  plugins: [],
};
export default config;
