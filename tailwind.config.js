/** @type {import('tailwindcss').Config} */
module.exports = {
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
        padding: '2rem',
        screens: {
          '2xl': '1400px'
        }
      },
      extend: {
        colors: {
          border: 'rgb(var(--border) / <alpha-value>)',
          input: 'rgb(var(--border) / <alpha-value>)',
          ring: 'rgb(var(--primary) / <alpha-value>)',
          background: 'rgb(var(--bg) / <alpha-value>)',
          foreground: 'rgb(var(--text) / <alpha-value>)',
          heading: 'rgb(var(--text) / <alpha-value>)',
          body: 'rgb(var(--muted) / <alpha-value>)',
          highlight: 'rgb(var(--highlight) / <alpha-value>)',
          primary: {
            DEFAULT: 'rgb(var(--primary) / <alpha-value>)',
            foreground: 'rgb(var(--card) / <alpha-value>)',
            hover: 'rgb(var(--primary-hover) / <alpha-value>)'
          },
          secondary: {
            DEFAULT: 'rgb(var(--bg-secondary) / <alpha-value>)',
            foreground: 'rgb(var(--text) / <alpha-value>)'
          },
          destructive: {
            DEFAULT: 'hsl(var(--destructive))',
            foreground: 'hsl(var(--destructive-foreground))'
          },
          muted: {
            DEFAULT: 'rgb(var(--bg-secondary) / <alpha-value>)',
            foreground: 'rgb(var(--muted) / <alpha-value>)'
          },
          accent: {
            DEFAULT: 'rgb(var(--primary) / <alpha-value>)',
            foreground: 'rgb(var(--card) / <alpha-value>)'
          },
          popover: {
            DEFAULT: 'rgb(var(--card) / <alpha-value>)',
            foreground: 'rgb(var(--text) / <alpha-value>)'
          },
          card: {
            DEFAULT: 'rgb(var(--card) / <alpha-value>)',
            foreground: 'rgb(var(--text) / <alpha-value>)'
          },
          chart: {
            '1': 'hsl(var(--chart-1))',
            '2': 'hsl(var(--chart-2))',
            '3': 'hsl(var(--chart-3))',
            '4': 'hsl(var(--chart-4))',
            '5': 'hsl(var(--chart-5))'
          },
          sidebar: {
            DEFAULT: 'hsl(var(--sidebar-background))',
            foreground: 'hsl(var(--sidebar-foreground))',
            primary: 'hsl(var(--sidebar-primary))',
            'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
            accent: 'hsl(var(--sidebar-accent))',
            'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
            border: 'hsl(var(--sidebar-border))',
            ring: 'hsl(var(--sidebar-ring))'
          }
        },
        borderRadius: {
          lg: 'var(--radius)',
          md: 'calc(var(--radius) - 2px)',
          sm: 'calc(var(--radius) - 4px)'
        },
        keyframes: {
          'accordion-down': {
            from: {
              height: '0'
            },
            to: {
              height: 'var(--radix-accordion-content-height)'
            }
          },
          'accordion-up': {
            from: {
              height: 'var(--radix-accordion-content-height)'
            },
            to: {
              height: '0'
            }
          }
        },
        animation: {
          'accordion-down': 'accordion-down 0.2s ease-out',
          'accordion-up': 'accordion-up 0.2s ease-out'
        }
      }
    },
    plugins: [require("tailwindcss-animate")],
  }
