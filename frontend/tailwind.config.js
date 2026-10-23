/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        background: '#f8f9fb',
        foreground: '#1f2430',
        surface: '#ffffff',
        border: '#e5e7eb',
        primary: '#1e3a8a',
        accent: '#aa3bff',
        muted: '#6b7280',
        success: '#16a34a',
        danger: '#dc2626',
      },
      fontFamily: {
        sans: ['system-ui', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
