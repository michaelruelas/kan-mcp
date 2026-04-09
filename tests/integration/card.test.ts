import { describe, test, expect, beforeAll } from 'bun:test';
import { config } from 'dotenv';
import { KanClient } from '../../src/client';

config({ path: '.env' });

const TEST_API_KEY = process.env.KAN_API_KEY || 'test-api-key';
const TEST_BASE_URL = process.env.KAN_API_BASE_URL || 'https://kan.bn/api/v1';

describe('Card Integration Tests', () => {
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

  describe('card operations', () => {
    test('should access cards through list', async () => {
      if (!client || !workspaceId) {
        expect(true).toBe(true);
        return;
      }

      const boards = await client.request<any[]>(`/workspaces/${workspaceId}/boards`);
      
      if (boards.length === 0) {
        console.log('Skipping: No boards exist in workspace');
        expect(true).toBe(true);
        return;
      }

      const boardId = boards[0].publicId;
      const lists = await client.request<any[]>(`/boards/${boardId}/lists`);
      
      if (lists.length === 0) {
        console.log('Skipping: No lists exist in board');
        expect(true).toBe(true);
        return;
      }

      const listId = lists[0].publicId;
      const cards = await client.request<any[]>(`/lists/${listId}/cards`);
      expect(Array.isArray(cards)).toBe(true);
    });
  });
});
