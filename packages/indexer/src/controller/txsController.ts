import { PrismaClient } from '@prisma/client';
import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { Hex, checksumAddress } from 'viem';

interface MyRequestQuery {
  address: Hex;
}

interface MyRequest extends FastifyRequest {
  query: MyRequestQuery;
}

export default async function txsController(fastify: FastifyInstance) {
  // GET /api/v1/user
  fastify.get('/', async function (_request: MyRequest, reply: FastifyReply) {
    const { address } = _request.query;
    const prismaCliet = new PrismaClient();

    const data = await prismaCliet.swap.findMany({
      where: { userAddress: address.toLowerCase() },
      select: {
        deals: true,
        userAddress: true,
        fromTokenAddress: true,
        fromTokenAmount: true,
        fees: true,
        transactionHash: true,
      },
    });
    reply.send(data);
  });
}
