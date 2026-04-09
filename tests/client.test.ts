import { describe, test, expect, beforeEach, afterEach } from 'bun:test';
import { KanClient } from '../src/client';
import { KanApiError } from '../src/errors';

const TEST_API_KEY = 'test-api-key';
const TEST_BASE_URL = 'https://kan.bn/api/v1';

let originalFetch: typeof fetch;

beforeEach(() => {
  originalFetch = globalThis.fetch;
});

afterEach(() => {
  globalThis.fetch = originalFetch;
});

describe('KanClient', () => {
  describe('request', () => {
    test('successful request returns parsed JSON', async () => {
      const client = new KanClient(TEST_API_KEY);
      const mockData = { id: '123', name: 'Test' };

      globalThis.fetch = async () =>
        new Response(JSON.stringify(mockData), {
          status: 200,
          ok: true,
        }) as Response;

      const result = await client.request<typeof mockData>('/test');

      expect(result).toEqual(mockData);
    });

    test('request with custom options passes correct method and body', async () => {
      const client = new KanClient(TEST_API_KEY);
      let receivedUrl = '';
      let receivedMethod = '';

      globalThis.fetch = async (url, init) => {
        receivedUrl = url as string;
        receivedMethod = init?.method ?? 'GET';
        return new Response(JSON.stringify({}), {
          status: 200,
          ok: true,
        }) as Response;
      };

      await client.request('/test', {
        method: 'POST',
        body: JSON.stringify({ foo: 'bar' }),
      });

      expect(receivedUrl).toBe(`${TEST_BASE_URL}/test`);
      expect(receivedMethod).toBe('POST');
    });

    test('throws KanApiError on 400 response', async () => {
      const client = new KanClient(TEST_API_KEY);

      globalThis.fetch = async () =>
        new Response(null, {
          status: 400,
          statusText: 'Bad Request',
          ok: false,
        }) as Response;

      await expect(client.request('/test')).rejects.toThrow(KanApiError);
      await expect(client.request('/test')).rejects.toMatchObject({
        status: 400,
        code: 'invalidInput',
      });
    });

    test('throws KanApiError on 401 response', async () => {
      const client = new KanClient(TEST_API_KEY);

      globalThis.fetch = async () =>
        new Response(null, {
          status: 401,
          statusText: 'Unauthorized',
          ok: false,
        }) as Response;

      await expect(client.request('/test')).rejects.toThrow(KanApiError);
      await expect(client.request('/test')).rejects.toMatchObject({
        status: 401,
        code: 'unauthorized',
      });
    });

    test('throws KanApiError on 403 response', async () => {
      const client = new KanClient(TEST_API_KEY);

      globalThis.fetch = async () =>
        new Response(null, {
          status: 403,
          statusText: 'Forbidden',
          ok: false,
        }) as Response;

      await expect(client.request('/test')).rejects.toThrow(KanApiError);
      await expect(client.request('/test')).rejects.toMatchObject({
        status: 403,
        code: 'forbidden',
      });
    });

    test('throws KanApiError on 404 response', async () => {
      const client = new KanClient(TEST_API_KEY);

      globalThis.fetch = async () =>
        new Response(null, {
          status: 404,
          statusText: 'Not Found',
          ok: false,
        }) as Response;

      await expect(client.request('/test')).rejects.toThrow(KanApiError);
      await expect(client.request('/test')).rejects.toMatchObject({
        status: 404,
        code: 'notFound',
      });
    });

    test('throws KanApiError on 500 response', async () => {
      const client = new KanClient(TEST_API_KEY);

      globalThis.fetch = async () =>
        new Response(null, {
          status: 500,
          statusText: 'Internal Server Error',
          ok: false,
        }) as Response;

      await expect(client.request('/test')).rejects.toThrow(KanApiError);
      await expect(client.request('/test')).rejects.toMatchObject({
        status: 500,
        code: 'internalError',
      });
    });

    test('throws KanApiError with unknownError for non-mapped status codes', async () => {
      const client = new KanClient(TEST_API_KEY);

      globalThis.fetch = async () =>
        new Response(null, {
          status: 418,
          statusText: "I'm a teapot",
          ok: false,
        }) as Response;

      await expect(client.request('/test')).rejects.toThrow(KanApiError);
      await expect(client.request('/test')).rejects.toMatchObject({
        status: 418,
        code: 'unknownError',
      });
    });
  });
});
