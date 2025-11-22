import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
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
      fontFamily: {
        'display': ['"Playfair Display"', 'Georgia', 'serif'], // For ebook headings
        'serif': ['Lora', 'Georgia', 'serif'], // For ebook body text
        'sans': ['Inter', 'system-ui', 'sans-serif'], // For UI elements
        'relative': ['Relative', 'system-ui', 'sans-serif'], // CalAI premium font
      },
      fontSize: {
        'ebook-body': ['18px', { lineHeight: '1.9', letterSpacing: '0.01em' }],
        'ebook-lead': ['20px', { lineHeight: '1.85', letterSpacing: '0.005em' }],
      },
      spacing: {
        '13': '3.25rem', // 52px for mobile nav
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
          glow: "hsl(var(--primary-glow))",
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
        success: {
          DEFAULT: "hsl(var(--success))",
          foreground: "hsl(var(--success-foreground))",
        },
        warning: {
          DEFAULT: "hsl(var(--warning))",
          foreground: "hsl(var(--warning-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        defiant: {
          DEFAULT: "hsl(var(--defiant))",
          foreground: "hsl(var(--defiant-foreground))",
        },
        intense: {
          DEFAULT: "hsl(var(--intense))",
          foreground: "hsl(var(--intense-foreground))",
        },
        distracted: {
          DEFAULT: "hsl(var(--distracted))",
          foreground: "hsl(var(--distracted-foreground))",
        },
        surface: {
          base: "hsl(var(--surface-base))",
          raised: "hsl(var(--surface-raised))",
          overlay: "hsl(var(--surface-overlay))",
          glass: "hsl(var(--surface-glass))",
        },
        text: {
          'high-contrast': "hsl(var(--text-high-contrast))",
          'medium-contrast': "hsl(var(--text-medium-contrast))",
        },
        // Cal AI inspired palette
        'calai': {
          50: 'hsl(220, 20%, 98%)',
          100: 'hsl(220, 15%, 95%)',
          200: 'hsl(220, 13%, 91%)',
          300: 'hsl(220, 11%, 82%)',
          400: 'hsl(220, 9%, 65%)',
          500: 'hsl(220, 8%, 46%)',
          600: 'hsl(220, 10%, 37%)',
          700: 'hsl(220, 12%, 28%)',
          800: 'hsl(220, 15%, 20%)',
          900: 'hsl(220, 20%, 14%)',
        },
      },
      backgroundImage: {
        'gradient-primary': 'var(--gradient-primary)',
        'gradient-accent': 'var(--gradient-accent)',
        'gradient-success': 'var(--gradient-success)',
        'gradient-warning': 'var(--gradient-warning)',
        'gradient-hero': 'var(--gradient-hero)',
        'gradient-mesh': 'var(--gradient-mesh)',
      },
      boxShadow: {
        'sm': 'var(--shadow-sm)',
        'md': 'var(--shadow-md)',
        'lg': 'var(--shadow-lg)',
        'xl': 'var(--shadow-xl)',
        'colored': 'var(--shadow-colored)',
        'glow': '0 0 40px -10px hsl(var(--primary) / 0.5)',
        'glow-lg': '0 0 60px -15px hsl(var(--primary) / 0.6)',
      },
      backdropBlur: {
        'glass': '12px',
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
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
        "shimmer": {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(100%)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "shimmer": "shimmer 1.5s infinite",
        "bounce-slow": "bounce 3s ease-in-out infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
