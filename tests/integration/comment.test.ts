import { describe, test, expect, beforeAll } from 'bun:test';
import { config } from 'dotenv';
import { KanClient } from '../../src/client';

config({ path: '.env' });

const TEST_API_KEY = process.env.KAN_API_KEY || 'test-api-key';
const TEST_BASE_URL = process.env.KAN_API_BASE_URL || 'https://kan.bn/api/v1';

describe('Comment Integration Tests', () => {
  let client: KanClient;
  let workspaceId: string | null = null;

  beforeAll(async () => {
    if (!process.env.KAN_API_KEY) {
      console.log('KAN_API_KEY not set, skipping integration tests');
      return;
    }
    client = new KanClient(TEST_API_KEY, TEST_BASE_URL);

    const workspaces = await client.request<any[]>('/workspaces');
    workspaceId = workspaces[0]?.workspace?.publicId;
  });

  describe('comment operations', () => {
    test('should access comments through card', async () => {
      if (!client || !workspaceId) {
        expect(true).toBe(true);
        return;
      }

      const boards = await client.request<any[]>(`/workspaces/${workspaceId}/boards`);
      
      if (boards.length === 0) {
        console.log('Skipping: No boards exist');
        expect(true).toBe(true);
        return;
      }

      const boardId = boards[0].publicId;
      const lists = await client.request<any[]>(`/boards/${boardId}/lists`);
      
      if (lists.length === 0) {
        console.log('Skipping: No lists exist');
        expect(true).toBe(true);
        return;
      }

      const listId = lists[0].publicId;
      const cards = await client.request<any[]>(`/lists/${listId}/cards`);
      
      if (cards.length === 0) {
        console.log('Skipping: No cards exist');
        expect(true).toBe(true);
        return;
      }

      const cardId = cards[0].publicId;
      const comments = await client.request<any[]>(`/cards/${cardId}/comments`);
      expect(Array.isArray(comments)).toBe(true);
    });
  });
});
