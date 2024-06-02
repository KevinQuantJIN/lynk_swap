import fastify from 'fastify';
import router from './router';
import { startListen } from './task/listener';
import JSONbig from 'json-bigint';
import cors from '@fastify/cors';

const server = fastify({
  // Logger only for production
  logger: !!(process.env.NODE_ENV !== 'development'),
});

server.register(cors, {
  origin: '*',
});

server.addHook('preSerialization', (_request, _reply, payload: string, done) => {
  try {
    const newPayload = JSONbig.parse(JSONbig.stringify(payload));

    done(null, newPayload);
  } catch (err) {
    done(err);
  }
});

// Middleware: Router
server.register(router);

server.addHook('onReady', () => {
  startListen();
});

export default server;
