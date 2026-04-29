/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "rgb(var(--primary-rgb) / <alpha-value>)",
          hover: "rgb(var(--primary-rgb) / 0.9)",
          light: "rgb(var(--primary-rgb) / 0.1)",
          dark: "rgb(var(--primary-rgb) / 0.8)",
        },
        secondary: {
          DEFAULT: "#10b981",
          hover: "#059669",
          light: "#ecfdf5",
        },
        accent: {
          DEFAULT: "rgb(var(--accent-rgb) / <alpha-value>)",
          hover: "rgb(var(--accent-rgb) / 0.9)",
          light: "rgb(var(--accent-rgb) / 0.1)",
        },
        surface: {
          50: "rgb(var(--bg-main) / <alpha-value>)",
          100: "rgb(var(--surface-rgb) / <alpha-value>)",
          200: "rgb(var(--border-rgb) / <alpha-value>)",
          300: "#cbd5e1",
          400: "#94a3b8",
          500: "#64748b",
          600: "#475569",
          700: "#334155",
          800: "#1e293b",
          900: "rgb(var(--text-main) / <alpha-value>)",
          950: "#020617",
        },
        // Semantic aliases for easier migration
        "on-surface": "rgb(var(--text-main) / <alpha-value>)",
        "on-surface-variant": "#475569",
        "outline-variant": "rgb(var(--border-rgb) / <alpha-value>)",
        "card-bg": "rgb(var(--surface-rgb) / <alpha-value>)",
        "primary-container": "rgb(var(--primary-rgb) / <alpha-value>)",
        "on-primary": "#ffffff",
      },
      fontFamily: {
        sans: ["'Outfit'", "Inter", "system-ui", "sans-serif"],
        display: ["'Outfit'", "Inter", "sans-serif"],
        outfit: ["'Outfit'", "Inter", "sans-serif"],
      },
      borderRadius: {
        'none': '0',
        'sm': '0.125rem',
        DEFAULT: '0.5rem',
        'md': '0.375rem',
        'lg': '0.75rem',
        'xl': '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
        'full': '9999px',
      },
      boxShadow: {
        'premium': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'premium-hover': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.07)',
      },
      backdropBlur: {
        xs: '2px',
      }
    },
  },
  plugins: [],
}
