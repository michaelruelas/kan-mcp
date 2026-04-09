export type WorkspaceId = string & { readonly __brand: 'WorkspaceId' };
export type BoardId = string & { readonly __brand: 'BoardId' };
export type ListId = string & { readonly __brand: 'ListId' };
export type CardId = string & { readonly __brand: 'CardId' };
export type LabelId = string & { readonly __brand: 'LabelId' };
export type ChecklistId = string & { readonly __brand: 'ChecklistId' };
export type ChecklistItemId = string & { readonly __brand: 'ChecklistItemId' };
export type CommentId = string & { readonly __brand: 'CommentId' };
export type MemberId = string & { readonly __brand: 'MemberId' };
export type AttachmentId = string & { readonly __brand: 'AttachmentId' };

export const ROUTES = {
  WORKSPACES: '/workspaces',
  BOARDS: '/boards',
  LISTS: '/lists',
  CARDS: '/cards',
  LABELS: '/labels',
  CHECKLISTS: '/checklists',
  ATTACHMENTS: '/attachments',
  COMMENTS: '/comments',
} as const;

export const VISIBILITY = ['public', 'private'] as const;
export type Visibility = (typeof VISIBILITY)[number];

export const POSITION = ['start', 'end'] as const;
export type Position = (typeof POSITION)[number];

export const PRIORITY = ['urgent', 'high', 'medium', 'low'] as const;
export type Priority = (typeof PRIORITY)[number];

export const ROLE = ['admin', 'member', 'guest'] as const;
export type Role = (typeof ROLE)[number];

export type ApiSuccess<T> = { status: 'success'; data: T };
export type ApiError = { status: 'error'; code: string; message: string };
export type ApiResponse<T> = ApiSuccess<T> | ApiError;

export type ToolSuccess<T> = { ok: true; data: T };
export type ToolError = { ok: false; error: string };
export type ToolResult<T> = ToolSuccess<T> | ToolError;

export interface Workspace {
  publicId: string;
  name: string;
  slug: string;
  description?: string;
  showEmailsToMembers: boolean;
  weekStartDay: string;
  createdAt: string;
  updatedAt: string;
}

export interface Board {
  publicId: string;
  workspacePublicId: string;
  name: string;
  slug: string;
  visibility: Visibility;
  type: 'regular' | 'template';
  isArchived: boolean;
  favorite: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface List {
  publicId: string;
  boardPublicId: string;
  name: string;
  index: number;
  createdAt: string;
  updatedAt: string;
}

export interface Card {
  publicId: string;
  listPublicId: string;
  title: string;
  description?: string;
  index: number;
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Label {
  publicId: string;
  boardPublicId: string;
  name: string;
  colourCode: string;
  createdAt: string;
  updatedAt: string;
}

export interface Checklist {
  publicId: string;
  cardPublicId: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface ChecklistItem {
  publicId: string;
  checklistPublicId: string;
  title: string;
  completed: boolean;
  index: number;
  createdAt: string;
  updatedAt: string;
}

export interface Comment {
  publicId: string;
  cardPublicId: string;
  memberPublicId: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}
