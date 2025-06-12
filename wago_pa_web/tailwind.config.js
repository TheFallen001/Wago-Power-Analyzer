/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    
  ],
  theme: {
    extend: {
      colors: {
        primary: '#28a745', // green (used for buttons, highlights)
        secondary: '#6CBB3C', // lighter green (used for markers)
        accent: '#FF2400', // red (used for alarms, inactive)
        background: '#fff', // main background
        surface: '#f3f4f6', // light gray backgrounds
        border: '#e5e7eb', // border gray
        text: '#171717', // main text
        muted: '#6b7280', // muted text
      },
    },
  },
  plugins: [],
};
