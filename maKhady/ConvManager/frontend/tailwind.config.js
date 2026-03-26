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
          DEFAULT: "#4f46e5",
          hover: "#4338ca",
          light: "#eef2ff",
          dark: "#3730a3",
        },
        secondary: {
          DEFAULT: "#10b981",
          hover: "#059669",
          light: "#ecfdf5",
        },
        accent: {
          DEFAULT: "#f59e0b",
          hover: "#d97706",
          light: "#fffbeb",
        },
        surface: {
          50: "rgb(var(--bg-main) / <alpha-value>)",
          100: "rgb(var(--surface-alt) / <alpha-value>)",
          200: "rgb(var(--border) / <alpha-value>)",
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
        "outline-variant": "rgb(var(--border) / <alpha-value>)",
        "card-bg": "rgb(var(--surface) / <alpha-value>)",
        "primary-container": "#4f46e5",
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
