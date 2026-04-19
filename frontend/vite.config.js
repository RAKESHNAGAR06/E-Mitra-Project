import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'


// https://vite.dev/config/
export default defineConfig({
  // Tailwind before @vitejs/plugin-react — avoids Rolldown/CSS pipeline issues on CI (e.g. Vercel).
  plugins: [tailwindcss(), react()],
})
