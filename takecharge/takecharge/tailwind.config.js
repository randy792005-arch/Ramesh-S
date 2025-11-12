/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    './pages/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
    './app/**/*.{js,jsx}',
    './src/**/*.{js,jsx}',
  ],
  prefix: "",
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
        border: "var(--color-border)", /* light gray */
        input: "var(--color-input)", /* pure white */
        ring: "var(--color-ring)", /* electric blue */
        background: "var(--color-background)", /* warm off-white */
        foreground: "var(--color-foreground)", /* near-black */
        primary: {
          DEFAULT: "var(--color-primary)", /* electric blue */
          foreground: "var(--color-primary-foreground)", /* white */
        },
        secondary: {
          DEFAULT: "var(--color-secondary)", /* eco green */
          foreground: "var(--color-secondary-foreground)", /* white */
        },
        destructive: {
          DEFAULT: "var(--color-destructive)", /* red */
          foreground: "var(--color-destructive-foreground)", /* white */
        },
        muted: {
          DEFAULT: "var(--color-muted)", /* light gray */
          foreground: "var(--color-muted-foreground)", /* medium gray */
        },
        accent: {
          DEFAULT: "var(--color-accent)", /* purple */
          foreground: "var(--color-accent-foreground)", /* white */
        },
        popover: {
          DEFAULT: "var(--color-popover)", /* pure white */
          foreground: "var(--color-popover-foreground)", /* near-black */
        },
        card: {
          DEFAULT: "var(--color-card)", /* pure white */
          foreground: "var(--color-card-foreground)", /* near-black */
        },
        success: {
          DEFAULT: "var(--color-success)", /* vibrant green */
          foreground: "var(--color-success-foreground)", /* white */
        },
        warning: {
          DEFAULT: "var(--color-warning)", /* amber */
          foreground: "var(--color-warning-foreground)", /* near-black */
        },
        error: {
          DEFAULT: "var(--color-error)", /* red */
          foreground: "var(--color-error-foreground)", /* white */
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      fontSize: {
        'adaptive-xs': 'clamp(0.75rem, 0.7rem + 0.25vw, 0.875rem)',
        'adaptive-sm': 'clamp(0.875rem, 0.8rem + 0.375vw, 1rem)',
        'adaptive-base': 'clamp(1rem, 0.9rem + 0.5vw, 1.125rem)',
        'adaptive-lg': 'clamp(1.125rem, 1rem + 0.625vw, 1.25rem)',
        'adaptive-xl': 'clamp(1.25rem, 1.1rem + 0.75vw, 1.5rem)',
        'adaptive-2xl': 'clamp(1.5rem, 1.3rem + 1vw, 1.875rem)',
        'adaptive-3xl': 'clamp(1.875rem, 1.6rem + 1.375vw, 2.25rem)',
      },
      boxShadow: {
        'elevation-1': '0 1px 3px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.06)',
        'elevation-2': '0 4px 6px rgba(0,0,0,0.1), 0 2px 4px rgba(0,0,0,0.06)',
        'elevation-3': '0 10px 15px rgba(0,0,0,0.1), 0 4px 6px rgba(0,0,0,0.05)',
        'elevation-4': '0 20px 25px rgba(0,0,0,0.1), 0 10px 10px rgba(0,0,0,0.04)',
      },
      animation: {
        'pulse-status': 'pulse-status 2s ease-in-out infinite',
        'shimmer': 'shimmer 1.5s ease-in-out infinite',
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
      minHeight: {
        'touch': '44px',
      },
      minWidth: {
        'touch': '44px',
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
  ],
}