import { describe, test, expect, beforeEach, afterEach } from 'bun:test';
import { KanClient } from '../../src/client';
import { Comment } from '../../src/types';
import {
  commentAddTool,
  commentUpdateTool,
  commentDeleteTool,
} from '../../src/tools/comment';

const TEST_API_KEY = 'test-api-key';
let originalFetch: typeof fetch;

beforeEach(() => {
  originalFetch = globalThis.fetch;
});

afterEach(() => {
  globalThis.fetch = originalFetch;
});

const mockComment: Comment = {
  publicId: 'comment-1',
  cardPublicId: 'card-1',
  memberPublicId: 'member-1',
  content: 'Test comment',
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z',
};

describe('comment tools', () => {
  describe('comment.add', () => {
    test('adds a comment to a card', async () => {
      const client = new KanClient(TEST_API_KEY);
      const input = {
        cardPublicId: 'card-1',
        content: 'New comment',
      };

      let receivedUrl = '';
      let receivedMethod = '';
      let receivedBody = '';

      globalThis.fetch = async (url, init) => {
        receivedUrl = url as string;
        receivedMethod = init?.method ?? 'GET';
        receivedBody = init?.body as string;
        return new Response(JSON.stringify(mockComment), {
          status: 201,
          ok: true,
        }) as Response;
      };

      const result = await commentAddTool.handler(client, input);

      expect(receivedMethod).toBe('POST');
      expect(receivedUrl).toContain('/comments');
      expect(JSON.parse(receivedBody)).toEqual(input);
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.data).toEqual(mockComment);
      }
    });

    test('returns error when cardPublicId is missing', async () => {
      const client = new KanClient(TEST_API_KEY);

      const result = await commentAddTool.handler(client, {
        content: 'Test',
      } as any);

      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error).toContain('cardPublicId');
      }
    });

    test('returns error when content is missing', async () => {
      const client = new KanClient(TEST_API_KEY);

      const result = await commentAddTool.handler(client, {
        cardPublicId: 'card-1',
      } as any);

      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error).toContain('content');
      }
    });
  });

  describe('comment.update', () => {
    test('updates a comment', async () => {
      const client = new KanClient(TEST_API_KEY);
      const input = { publicId: 'comment-1', content: 'Updated comment' };
      const updatedComment = { ...mockComment, content: 'Updated comment' };

      let receivedUrl = '';
      let receivedMethod = '';
      let receivedBody = '';

      globalThis.fetch = async (url, init) => {
        receivedUrl = url as string;
        receivedMethod = init?.method ?? 'GET';
        receivedBody = init?.body as string;
        return new Response(JSON.stringify(updatedComment), {
          status: 200,
          ok: true,
        }) as Response;
      };

      const result = await commentUpdateTool.handler(client, input);

      expect(receivedMethod).toBe('PATCH');
      expect(receivedUrl).toContain('/comments/comment-1');
      expect(JSON.parse(receivedBody)).toEqual({ content: 'Updated comment' });
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.data.content).toBe('Updated comment');
      }
    });

    test('returns error when publicId is missing', async () => {
      const client = new KanClient(TEST_API_KEY);

      const result = await commentUpdateTool.handler(client, {
        content: 'Test',
      } as any);

      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error).toContain('publicId');
      }
    });

    test('returns error when content is missing', async () => {
      const client = new KanClient(TEST_API_KEY);

      const result = await commentUpdateTool.handler(client, {
        publicId: 'comment-1',
      } as any);

      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error).toContain('content');
      }
    });
  });

  describe('comment.delete', () => {
    test('deletes a comment', async () => {
      const client = new KanClient(TEST_API_KEY);
      const input = { publicId: 'comment-1' };

      let receivedUrl = '';
      let receivedMethod = '';

      globalThis.fetch = async (url, init) => {
        receivedUrl = url as string;
        receivedMethod = init?.method ?? 'GET';
        return new Response(JSON.stringify({ success: true }), {
          status: 200,
          ok: true,
        }) as Response;
      };

      const result = await commentDeleteTool.handler(client, input);

      expect(receivedMethod).toBe('DELETE');
      expect(receivedUrl).toContain('/comments/comment-1');
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.data).toEqual({ success: true });
      }
    });

    test('returns error when publicId is missing', async () => {
      const client = new KanClient(TEST_API_KEY);

      const result = await commentDeleteTool.handler(client, {} as any);

      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error).toContain('publicId');
      }
    });
  });
});
