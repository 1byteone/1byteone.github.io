import type { Config } from "tailwindcss"

const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
    "./pages/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        "term-black": "var(--term-black, #0B0B0F)",
        "term-darker": "var(--term-darker, #121217)",
        "term-dark": "var(--term-dark, #191A20)",
        "term-cyan": "var(--term-cyan, #A7B8FF)",
        "term-cyan-bright": "var(--term-cyan-bright, #CCD4FF)",
        "term-blue": "var(--term-blue, #7C90F1)",
        "term-white": "var(--term-white, #F3EADB)",
        "term-gray": "var(--term-gray, #918A80)",
        "term-green": "var(--term-green, #8FD4A7)",
        "term-amber": "var(--term-amber, #EFC5A2)",
        "term-line": "var(--term-line, #2A2A31)",
      },
      fontFamily: {
        mono: ["var(--font-ui-mono)", "IBM Plex Mono", "JetBrains Mono", "Menlo", "Monaco", "Courier New", "monospace"],
        serif: ["var(--font-reading-serif)", "Source Serif 4", "Georgia", "serif"],
      },
      keyframes: {
        noise: {
          "0%, 100%": { opacity: "0.9" },
          "50%": { opacity: "1" },
        },
        blink: {
          "50%": { opacity: "0" },
        },
      },
      animation: {
        noise: "noise 0.2s infinite",
        blink: "blink 1s step-end infinite",
      },
      typography: {
        invert: {
          css: {
            "--tw-prose-body": "#e6dfd3",
            "--tw-prose-headings": "#f3eadb",
            "--tw-prose-lead": "#918a80",
            "--tw-prose-links": "#a7b8ff",
            "--tw-prose-bold": "#f3eadb",
            "--tw-prose-counters": "#918a80",
            "--tw-prose-bullets": "#a7b8ff",
            "--tw-prose-hr": "#2a2a31",
            "--tw-prose-quotes": "#f3eadb",
            "--tw-prose-quote-borders": "#efc5a2",
            "--tw-prose-captions": "#918a80",
            "--tw-prose-code": "#efc5a2",
            "--tw-prose-pre-code": "#e6dfd3",
            "--tw-prose-pre-bg": "#121217",
            "--tw-prose-th-borders": "#2a2a31",
            "--tw-prose-td-borders": "#2a2a31",
          },
        },
      },
    },
  },
  plugins: [require("@tailwindcss/typography"), require("tailwindcss-animate")],
}

export default config
