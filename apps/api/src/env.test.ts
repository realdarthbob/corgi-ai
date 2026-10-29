import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parseEnv } from '@/env.ts';

test('parseEnv applies defaults when vars are unset', () => {
  assert.deepEqual(parseEnv({}), { PORT: 3000, HOST: '0.0.0.0' });
});

test('parseEnv reads PORT and HOST', () => {
  assert.deepEqual(parseEnv({ PORT: '4000', HOST: '127.0.0.1' }), {
    PORT: 4000,
    HOST: '127.0.0.1'
  });
});

test('parseEnv rejects an invalid PORT', () => {
  assert.throws(() => parseEnv({ PORT: 'abc' }));
  assert.throws(() => parseEnv({ PORT: '70000' }));
});
