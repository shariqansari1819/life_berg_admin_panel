import { fontFamily } from "tailwindcss/defaultTheme";

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",  // Adjust the paths according to your React app structure
  ],
  theme: {
    extend: {
      fontFamily: {
        heading: ['Ubuntu', 'sans-serif'], // Replace with your heading font
        body: ['Ubuntu', 'sans-serif'],
      },
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        redBackground: 'red',
        orangeBackground: 'orange',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        light: {
          bg: '#ffffff',
          text: '#000000',
        },
        dark: {
          bg: '#1a202c',
          text: '#f7fafc',
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))'
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))'
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))'
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))'
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))'
        },
        sidebar: {
          DEFAULT: 'hsl(var(--side-background))',
          foreground: 'hsl(var(--side-foreground))'
        },
        sidebarhover: {
          DEFAULT: 'hsl(var(--side-list-hover))',
          foreground: 'hsl(var(--side-list-hover))'
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))'
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))'
        },
        selectContentBackground: 'hsl(var(--select-content-background-color))',
        whiteBackground: 'hsl(var(--white-background))'

      },
      borderRadius: {
        xl: `calc(var(--radius) + 4px)`,
        lg: `var(--radius)`,
        md: `calc(var(--radius) - 2px)`,
        sm: `calc(var(--radius) - 4px)`
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" }
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 }
        }
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out"
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
