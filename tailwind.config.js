/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        /* ====================================================
           EXISTING TOKENS (Preserved for backward compatibility)
           ==================================================== */
        'brand-darkGreen': '#0B4F2A',
        'brand-leafGreen': '#5A9E2F',
        'brand-red': '#DA251D',
        'brand-offwhite': '#F9F8F6',

        /* ====================================================
           NEW PREMIUM INTERNATIONAL DESIGN TOKENS
           ==================================================== */
        'brand-navy': '#0A2342',      // Deep Navy
        'brand-gold': '#C89B3C',      // Metallic Gold
        'brand-ivory': '#FAF9F6',     // Warm Off-White / Ivory
      },
      fontFamily: {
        // Primary body text: Clean modern sans-serif
        sans: ['Inter', 'sans-serif'],
        // Headings: Elegant serif/editorial style
        serif: ['"Playfair Display"', 'serif'],
      },
      boxShadow: {
        // Minimal, sophisticated shadows (avoiding excessive/heavy shadows)
        'premium': '0 4px 20px -2px rgba(10, 35, 66, 0.05)',
        'premium-hover': '0 8px 30px -4px rgba(10, 35, 66, 0.1)',
      },
      borderRadius: {
        // Restrained border radius to avoid "excessive rounded cards"
        'premium': '0.125rem', // 2px - very subtle softening of edges
      }
    },
  },
  plugins: [],
}