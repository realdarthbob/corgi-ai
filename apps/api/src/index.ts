import Fastify from 'fastify';
import { initApi } from '@/api.ts';
import { env } from '@/env.ts';

const app = Fastify({
  logger: true
});

const start = async () => {
  try {
    await initApi(app);
    await app.listen({ port: env.PORT, host: env.HOST });
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

void start();
