import { APP_BASE_HREF } from '@angular/common';
import { CommonEngine } from '@angular/ssr/node';
import express from 'express';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';
import bootstrap from './src/main.server';
import { SERVER_REQUEST } from './src/app/infrastructure/ssr/request.token';

export function app(): express.Express {

  const server = express();

  server.set('trust proxy', 1);
  const serverDistFolder = dirname(fileURLToPath(import.meta.url));
  const browserDistFolder = resolve(serverDistFolder, '../browser');
  const indexHtml = join(serverDistFolder, 'index.server.html');
  
  // Single source of truth: the public host comes from .env (APP_HOST).
  // Dev/docker-internal hosts stay allowed; add the machine's IP via APP_HOST instead of editing here.
  const allowedHosts: string[] = ['localhost', '127.0.0.1', 'frontend', process.env['APP_HOST']]
    .filter((host): host is string => Boolean(host));

  const commonEngine = new CommonEngine({
    allowedHosts
  });

  server.set('view engine', 'html');
  server.set('views', browserDistFolder);
  
  // Example Express Rest API endpoints
  // server.get('/api/**', (req, res) => { });
  // Serve static files from /browser
  server.get('*.*', express.static(browserDistFolder, {
    maxAge: '1y'
  }));
  
  // All regular routes use the Angular engine
  server.get('*', (req, res, next) => {
    console.log('🔵 SSR RENDER TRIGGERED for:', req.originalUrl);
    const { protocol, originalUrl, baseUrl, headers } = req;

    commonEngine
      .render({
        bootstrap,
        documentFilePath: indexHtml,
        url: `${protocol}://${headers.host}${originalUrl}`,
        publicPath: browserDistFolder,
        providers: [{ provide: APP_BASE_HREF, useValue: baseUrl }, { provide: SERVER_REQUEST, useValue: req }],

      })
      .then((html) => res.send(html))
      .catch((err) => next(err));
  });

  return server;
}

function run(): void {

  const port = process.env['PORT'] || 4000;

  // Start up the Node server
  const server = app();
  server.listen(port, () => {
    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

run();
