import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss() // <-- Tu plugin de Tailwind intacto
  ],
  resolve: {
    dedupe: ['react', 'react-dom'] // <-- Fuerza a Vite a usar una sola copia de React
  },
  optimizeDeps: {
    include: ['recharts'] // <-- Evita que Recharts pierda sus dependencias
  }
})
