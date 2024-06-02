import { FastifyInstance } from 'fastify';

import txsController from './controller/txsController';

export default async function router(fastify: FastifyInstance) {
  fastify.register(txsController, { prefix: '/api/v1/txs' });
}
