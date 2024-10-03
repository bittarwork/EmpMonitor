// tailwind.config.js
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        customPurple: '#7f5af0',
        customIndigo: '#6246ea',
      },
      spacing: {
        '128': '32rem',
      },
    },
  },
  plugins: [],
}
