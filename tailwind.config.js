/** @type {import('tailwindcss').Config} */

import tailwindcss from "@tailwindcss/vite";

export default {
  content: [
    "./src/**/*.{html,js,svelte,ts}",
    "./src/**/*.svelte"
  ],
  theme: {
    fontFamily: {
      sans: ['Graphik', 'sans-serif'],
      serif: ['Merriweather', 'serif'],
    }
  },
  plugins: [tailwindcss()]
}