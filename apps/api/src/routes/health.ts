import type { FastifyInstance } from 'fastify';
import type { HealthResponse } from '@corgi-ai/shared';

export async function healthRoutes(app: FastifyInstance) {
  app.get('/', async (_request, reply) => {
    const body: HealthResponse = { status: 'ok' };
    return reply.code(200).send(body);
  });
}
