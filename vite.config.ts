import { defineConfig, loadEnv, ViteDevServer } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import type { IncomingMessage, ServerResponse } from "http";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load ALL env vars (not just VITE_ ones) so the API middleware can use them
  const env = loadEnv(mode, process.cwd(), '');

  return {
    server: {
      host: "::",
      port: 8080,
    },
    plugins: [
      react(),
      mode === 'development' && componentTagger(),
      // ── Local API middleware (mirrors Netlify Function in dev) ──
      {
        name: 'fraudshield-api',
        configureServer(server: ViteDevServer) {
          // Inject env vars for the analyze function
          Object.keys(env).forEach((k) => {
            if (!process.env[k]) process.env[k] = env[k];
          });

          server.middlewares.use('/api/analyze', async (req: IncomingMessage, res: ServerResponse) => {
            // CORS preflight
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
            res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');

            if (req.method === 'OPTIONS') {
              res.statusCode = 204;
              res.end();
              return;
            }

            if (req.method !== 'POST') {
              res.statusCode = 405;
              res.end('Method Not Allowed');
              return;
            }

            // Read body
            let body = '';
            req.on('data', (chunk: Buffer) => (body += chunk.toString()));
            req.on('end', async () => {
              try {
                const data = JSON.parse(body);
                if (!data.url) {
                  res.statusCode = 400;
                  res.setHeader('Content-Type', 'application/json');
                  res.end(JSON.stringify({ error: 'URL is required' }));
                  return;
                }

                // Dynamically import the shared analysis logic
                const funcPath = `file:///${path.resolve(__dirname, 'netlify/functions/analyze.js').replace(/\\/g, '/')}`;
                const { analyzeUrl } = await import(/* @vite-ignore */ funcPath);
                const result = await analyzeUrl(data);

                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify(result));
              } catch (err: unknown) {
                console.error('[API /api/analyze]', err);
                res.statusCode = 500;
                res.setHeader('Content-Type', 'application/json');
                const message = err instanceof Error ? err.message : 'Internal server error';
                res.end(JSON.stringify({ error: message }));
              }
            });
          });
        },
      },
    ].filter(Boolean),
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  };
});

