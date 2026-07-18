import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // ORION X Brand Palette
        orion: {
          black: "#0A0A0F",
          navy: "#1A1A2E",
          teal: "#00D4AA",
          violet: "#6C63FF",
          coral: "#FF6B6B",
          amber: "#FFB347",
        },
        surface: {
          DEFAULT: "#12121C",
          elevated: "#1E1E32",
          card: "#16162A",
        },
        border: {
          subtle: "#2A2A44",
          DEFAULT: "#3A3A5C",
        },
        text: {
          primary: "#FFFFFF",
          secondary: "#B0B0C8",
          tertiary: "#6B6B85",
        },
      },
      fontFamily: {
        display: ["var(--font-inter)", "Inter", "system-ui", "sans-serif"],
        body: ["var(--font-inter)", "Inter", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "JetBrains Mono", "monospace"],
      },
      fontSize: {
        "display-lg": ["96px", { lineHeight: "1", letterSpacing: "-0.03em" }],
        "display-md": ["64px", { lineHeight: "1.05", letterSpacing: "-0.02em" }],
        "heading-xl": ["48px", { lineHeight: "1.1", letterSpacing: "-0.02em" }],
        "heading-lg": ["32px", { lineHeight: "1.2", letterSpacing: "-0.01em" }],
        "heading-md": ["24px", { lineHeight: "1.3", letterSpacing: "-0.01em" }],
        "heading-sm": ["20px", { lineHeight: "1.4" }],
        "body-lg": ["16px", { lineHeight: "1.6" }],
        "body-md": ["14px", { lineHeight: "1.6" }],
        "body-sm": ["12px", { lineHeight: "1.5" }],
      },
      borderRadius: {
        card: "12px",
        "card-sm": "8px",
        button: "8px",
        input: "8px",
      },
      boxShadow: {
        card: "0 4px 24px rgba(0, 0, 0, 0.3)",
        "card-hover": "0 8px 40px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(0, 212, 170, 0.15)",
        glow: "0 0 20px rgba(0, 212, 170, 0.15)",
        "glow-violet": "0 0 20px rgba(108, 99, 255, 0.15)",
        button: "0 2px 8px rgba(0, 212, 170, 0.25)",
      },
      animation: {
        "pulse-glow": "pulseGlow 2s ease-in-out infinite",
        "slide-up": "slideUp 0.3s ease-out",
        "slide-right": "slideRight 0.4s ease-out",
        "fade-in": "fadeIn 0.3s ease-out",
        shimmer: "shimmer 1.5s infinite linear",
        "scale-in": "scaleIn 0.2s ease-out",
      },
      keyframes: {
        pulseGlow: {
          "0%, 100%": { boxShadow: "0 0 10px rgba(0, 212, 170, 0.1)" },
          "50%": { boxShadow: "0 0 25px rgba(0, 212, 170, 0.3)" },
        },
        slideUp: {
          from: { opacity: "0", transform: "translateY(10px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        slideRight: {
          from: { opacity: "0", transform: "translateX(-10px)" },
          to: { opacity: "1", transform: "translateX(0)" },
        },
        fadeIn: {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        scaleIn: {
          from: { opacity: "0", transform: "scale(0.95)" },
          to: { opacity: "1", transform: "scale(1)" },
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "ai-glow": "linear-gradient(135deg, rgba(0,212,170,0.1) 0%, rgba(108,99,255,0.1) 100%)",
      },
    },
  },
  plugins: [],
};

export default config;
