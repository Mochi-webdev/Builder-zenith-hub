import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
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
        // Anime-themed colors
        anime: {
          electric: "hsl(var(--anime-electric))",
          "electric-foreground": "hsl(var(--anime-electric-foreground))",
          fire: "hsl(var(--anime-fire))",
          "fire-foreground": "hsl(var(--anime-fire-foreground))",
          water: "hsl(var(--anime-water))",
          "water-foreground": "hsl(var(--anime-water-foreground))",
          shadow: "hsl(var(--anime-shadow))",
          "shadow-foreground": "hsl(var(--anime-shadow-foreground))",
          light: "hsl(var(--anime-light))",
          "light-foreground": "hsl(var(--anime-light-foreground))",
          energy: "hsl(var(--anime-energy))",
          "energy-foreground": "hsl(var(--anime-energy-foreground))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        anime: ["Inter", "Orbitron", "Exo 2", "sans-serif"],
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
        "pulse-glow": {
          "0%, 100%": {
            boxShadow: "0 0 20px rgba(59, 130, 246, 0.5)",
          },
          "50%": {
            boxShadow: "0 0 30px rgba(59, 130, 246, 0.8)",
          },
        },
        "energy-flow": {
          "0%": {
            transform: "translateX(-100%)",
          },
          "100%": {
            transform: "translateX(200%)",
          },
        },
        "character-hover": {
          "0%, 100%": {
            transform: "translateY(0px) scale(1)",
          },
          "50%": {
            transform: "translateY(-5px) scale(1.05)",
          },
        },
        "battle-shake": {
          "0%, 100%": {
            transform: "translateX(0)",
          },
          "10%, 30%, 50%, 70%, 90%": {
            transform: "translateX(-2px)",
          },
          "20%, 40%, 60%, 80%": {
            transform: "translateX(2px)",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "pulse-glow": "pulse-glow 2s infinite",
        "energy-flow": "energy-flow 3s infinite",
        "character-hover": "character-hover 2s ease-in-out infinite",
        "battle-shake": "battle-shake 0.5s ease-in-out",
      },
      backgroundImage: {
        "gradient-anime": "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        "gradient-fire": "linear-gradient(135deg, #ff6b6b 0%, #ffa500 100%)",
        "gradient-water": "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
        "gradient-electric":
          "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
        "gradient-shadow": "linear-gradient(135deg, #2c3e50 0%, #4a6741 100%)",
        "gradient-energy": "linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
