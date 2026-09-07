import { SELF } from 'cloudflare:test';
import { describe, expect, it } from 'vitest';

describe('worker fetch handler', () => {
  it('responds ok on /api/health', async () => {
    const res = await SELF.fetch('https://example.com/api/health');
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ ok: true, service: 'xultra-app-preview' });
  });

  it('returns 404 json for unknown /api/* routes', async () => {
    const res = await SELF.fetch('https://example.com/api/does-not-exist');
    expect(res.status).toBe(404);
    expect(await res.json()).toEqual({ ok: false, error: 'not_found' });
  });
});
