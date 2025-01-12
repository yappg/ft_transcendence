import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      animation: {
        "loop-scroll": "loop-scroll 50s linear infinite",
      },
      keyframes: {
        "loop-scroll": {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(-100%)" },
        },
      },
      backgroundImage: {
        "linear-gradient-dark": "var(--linear-gradient-dark)",
        "linear-gradient": "var(--linear-gradient)",
        secondary: "var(--secondary-color)",
        primary: "var(--primary-color)",
        "secondary-dark": "var(--secondary-color-dark)",
        "primary-dark": "var(--primary-color-dark)",
        "fire-red": "var(--fire-red)",
        "dark-teal": "var(--dark-teal)",
      },
      backgroundColor: {
        "black-crd": "var(--black-color-card)",
        "white-crd": "var(--white-color-card)",
      },
      colors: {
        "black-crd": "var(--black-color-card)",
        "white-crd": "var(--white-color-card)",
        secondary: "var(--secondary-color)",
        primary: "var(--primary-color)",
        "secondary-dark": "var(--secondary-color-dark)",
        "primary-dark": "var(--primary-color-dark)",
        aqua: "var(--aqua)",
        "fire-red": "var(--fire-red)",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))",
        },
      },
      fontFamily: {
        poppins: ["Poppins", "sans-serif"],
        dayson: ["Days On", "serif"],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  variants: {
    extend: {
      textColor: ["dark"],
    },
  },
  plugins: [
    require("tailwind-scrollbar-hide"),
    require("tailwindcss-animate"),
    require("@tailwindcss/aspect-ratio"),
  ],
  darkMode: "class",
};

export default config;
