import { defineConfig } from 'vitest/config'; // <-- Импортируем отсюда!
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
  },
});
