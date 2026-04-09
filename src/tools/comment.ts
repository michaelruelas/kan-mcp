import { KanClient } from '../client';
import { Comment, ToolResult, ROUTES } from '../types';
import { success, error, assertString } from '../utils';
import { toMcpError } from '../errors';

interface Tool<TInput = unknown, TOutput = unknown> {
  name: string;
  description: string;
  inputSchema: {
    type: 'object';
    properties: Record<string, unknown>;
    required: string[];
  };
  handler: (client: KanClient, input: TInput) => Promise<ToolResult<TOutput>>;
}

interface CommentAddInput {
  cardPublicId: string;
  content: string;
}

interface CommentUpdateInput {
  publicId: string;
  content: string;
}

interface CommentDeleteInput {
  publicId: string;
}

export const commentAddTool: Tool<CommentAddInput, Comment> = {
  name: 'comment.add',
  description: 'Add a comment to a card',
  inputSchema: {
    type: 'object',
    properties: {
      cardPublicId: { type: 'string' },
      content: { type: 'string' },
    },
    required: ['cardPublicId', 'content'],
  },
  handler: async (client: KanClient, input: CommentAddInput): Promise<ToolResult<Comment>> => {
    try {
      assertString(input.cardPublicId, 'cardPublicId');
      assertString(input.content, 'content');
      const body: Record<string, unknown> = {
        cardPublicId: input.cardPublicId,
        content: input.content,
      };
      const data = await client.request<Comment>(ROUTES.COMMENTS, {
        method: 'POST',
        body: JSON.stringify(body),
      });
      return success(data);
    } catch (err) {
      return error(toMcpError(err).message);
    }
  },
};

export const commentUpdateTool: Tool<CommentUpdateInput, Comment> = {
  name: 'comment.update',
  description: 'Update a comment',
  inputSchema: {
    type: 'object',
    properties: {
      publicId: { type: 'string' },
      content: { type: 'string' },
    },
    required: ['publicId', 'content'],
  },
  handler: async (client: KanClient, input: CommentUpdateInput): Promise<ToolResult<Comment>> => {
    try {
      assertString(input.publicId, 'publicId');
      assertString(input.content, 'content');
      const body: Record<string, unknown> = {
        content: input.content,
      };
      const data = await client.request<Comment>(`${ROUTES.COMMENTS}/${input.publicId}`, {
        method: 'PATCH',
        body: JSON.stringify(body),
      });
      return success(data);
    } catch (err) {
      return error(toMcpError(err).message);
    }
  },
};

export const commentDeleteTool: Tool<CommentDeleteInput, { success: boolean }> = {
  name: 'comment.delete',
  description: 'Delete a comment',
  inputSchema: {
    type: 'object',
    properties: {
      publicId: { type: 'string' },
    },
    required: ['publicId'],
  },
  handler: async (client: KanClient, input: CommentDeleteInput): Promise<ToolResult<{ success: boolean }>> => {
    try {
      assertString(input.publicId, 'publicId');
      await client.request(`${ROUTES.COMMENTS}/${input.publicId}`, {
        method: 'DELETE',
      });
      return success({ success: true });
    } catch (err) {
      return error(toMcpError(err).message);
    }
  },
};
