import { test } from 'node:test';
import assert from 'node:assert/strict';
import Fastify from 'fastify';
import { initApi } from '@/api.ts';

async function buildApp() {
  const app = Fastify();
  await initApi(app);
  return app;
}

test('GET /api/v1/health returns 200 ok', async (t) => {
  const app = await buildApp();
  t.after(() => app.close());

  const res = await app.inject({ method: 'GET', url: '/api/v1/health' });

  assert.equal(res.statusCode, 200);
  assert.deepEqual(res.json(), { status: 'ok' });
});

test('GET / returns running status', async (t) => {
  const app = await buildApp();
  t.after(() => app.close());

  const res = await app.inject({ method: 'GET', url: '/' });

  assert.equal(res.statusCode, 200);
  assert.deepEqual(res.json(), { status: 'Corgi AI server is running smoothly!' });
});

test('unknown route returns 404', async (t) => {
  const app = await buildApp();
  t.after(() => app.close());

  const res = await app.inject({ method: 'GET', url: '/api/v1/nope' });

  assert.equal(res.statusCode, 404);
});
