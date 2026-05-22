import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)"],
        brand: ["var(--font-brand)"]
      },
      colors: {
        ink: "#111827",
        ember: "#f08a4f",
        flare: "#f6c768",
        steel: "#cbd5e1",
        field: "#111722",
        signal: "#5bd6b2",
        night: "#07090d",
        panel: "#0d1118",
        line: "#252d3a"
      },
      boxShadow: {
        panel: "0 1px 2px rgba(0, 0, 0, 0.18)"
      }
    }
  },
  plugins: []
};

export default config;
