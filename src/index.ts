import Fastify from 'fastify';
import { initApi } from '@/api.ts';

const app = Fastify({
  logger: true
});

const start = async () => {
  try {
    await initApi(app);
    await app.listen({ port: 3000, host: '0.0.0.0' });
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

void start();
