/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        inter: ["Inter Variable", "Inter", "sans-serif"],
        poppins: ["Poppins", "sans-serif"],
      },
      colors: {
        dark: {
          900: "#0a0e1a",
          800: "#111827",
          700: "#1f2937",
        },
        primary: {
          900: "#1e1b4b",
          800: "#312e81",
          700: "#4338ca",
          600: "#6366f1",
          500: "#818cf8",
        },
        accent: {
          500: "#ec4899",
          600: "#db2777",
        },
      },
      animation: {
        "fade-in": "fadeIn 0.8s cubic-bezier(0.4, 0, 0.2, 1)",
        float: "float 6s ease-in-out infinite",
        glow: "glow 2s ease-in-out infinite alternate",
        "pulse-glow": "pulse-glow 2s infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        glow: {
          "0%": { boxShadow: "0 0 20px rgba(99, 102, 241, 0.3)" },
          "100%": { boxShadow: "0 0 40px rgba(99, 102, 241, 0.6)" },
        },
        "pulse-glow": {
          "0%, 100%": { boxShadow: "0 0 20px rgba(236, 72, 153, 0.4)" },
          "50%": { boxShadow: "0 0 40px rgba(236, 72, 153, 0.8)" },
        },
      },
      boxShadow: {
        glow: "0 0 30px rgba(99, 102, 241, 0.4)",
        "glow-lg": "0 0 50px rgba(99, 102, 241, 0.6)",
        neumo:
          "10px 10px 20px rgba(0,0,0,0.3), -10px -10px 20px rgba(255,255,255,0.05)",
      },
    },
  },
  plugins: [],
};
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      screens: {
        xs: "375px",
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
      },
    },
  },
  plugins: [],
};
