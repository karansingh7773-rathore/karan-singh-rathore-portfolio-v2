/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      typography: {
        DEFAULT: {
          css: {
            color: '#cbd5e1', // slate-300
            h1: { color: '#ffffff' },
            h2: { color: '#ffffff' },
            h3: { color: '#ffffff' },
            h4: { color: '#ffffff' },
            strong: { color: '#ffffff' },
            a: { color: '#60a5fa' }, // blue-400
            'ul > li::before': { backgroundColor: '#cbd5e1' },
            hr: { borderColor: '#334155' }, // slate-700
            blockquote: {
              color: '#94a3b8', // slate-400
              borderLeftColor: '#334155', // slate-700
            },
            code: { color: '#e2e8f0' }, // slate-200
            pre: { backgroundColor: '#1e293b' }, // slate-800
          },
        },
      },
    },
  },
  
  
  // Add the line below
  plugins: [require('@tailwindcss/typography')],
}
