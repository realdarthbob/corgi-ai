import type { FastifyInstance } from 'fastify';
import { healthRoutes } from '@/routes/health.ts';

export async function initApi(app: FastifyInstance) {
  app.get('/', async () => {
    return { status: 'Corgi AI server is running smoothly!' };
  });

  await app.register(healthRoutes, { prefix: '/api/v1/health' });
}
