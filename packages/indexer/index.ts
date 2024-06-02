import { config } from 'dotenv';
config();

import app from './src/app';
import { startListen } from './src/task/listener';

const FASTIFY_HOST = process.env.FASTIFY_HOST || '0.0.0.0';
const FASTIFY_PORT = Number(process.env.FASTIFY_PORT) || 3006;

app.listen({ host: FASTIFY_HOST, port: FASTIFY_PORT }, (err) => {
  if (err) {
    app.log.error(err);
  }
});

console.log(`🚀  Fastify server running on ${FASTIFY_HOST}:${FASTIFY_PORT}`);
console.log(`Route index: /`);
