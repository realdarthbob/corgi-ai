import type { FastifyInstance } from 'fastify';

export async function healthRoutes(app: FastifyInstance) {
  app.get('/', async (_request, reply) => {
    return reply.code(200).send({ status: 'ok' });
  });
}
