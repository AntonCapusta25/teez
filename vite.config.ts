import react from '@vitejs/plugin-react'
import { defineConfig, type Plugin } from 'vite'
import { handleSendEmail } from './api/send-email.ts'

function apiDevMiddleware(): Plugin {
  return {
    name: 'api-dev-middleware',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (req.url === '/api/send-email') {
          handleSendEmail(req, res);
        } else {
          next();
        }
      });
    },
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), apiDevMiddleware()],
})

