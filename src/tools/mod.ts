import type { Tool } from './workspace';
import {
  workspaceListTool,
  workspaceCreateTool,
  workspaceGetByIdTool,
  workspaceGetBySlugTool,
  workspaceUpdateTool,
  workspaceDeleteTool,
  workspaceSearchTool,
  workspaceCheckSlugAvailabilityTool,
} from './workspace';
import {
  boardListTool,
  boardCreateTool,
  boardGetByIdTool,
  boardGetBySlugTool,
  boardUpdateTool,
  boardDeleteTool,
  boardCheckSlugAvailabilityTool,
} from './board';
import {
  listCreateTool,
  listUpdateTool,
  listDeleteTool,
} from './list';
import {
  cardCreateTool,
  cardGetByIdTool,
  cardUpdateTool,
  cardDeleteTool,
  cardAddLabelTool,
  cardRemoveLabelTool,
  cardAddMemberTool,
  cardRemoveMemberTool,
  cardListActivitiesTool,
} from './card';

export const tools: Tool[] = [
  workspaceListTool,
  workspaceCreateTool,
  workspaceGetByIdTool,
  workspaceGetBySlugTool,
  workspaceUpdateTool,
  workspaceDeleteTool,
  workspaceSearchTool,
  workspaceCheckSlugAvailabilityTool,
  boardListTool,
  boardCreateTool,
  boardGetByIdTool,
  boardGetBySlugTool,
  boardUpdateTool,
  boardDeleteTool,
  boardCheckSlugAvailabilityTool,
  listCreateTool,
  listUpdateTool,
  listDeleteTool,
  cardCreateTool,
  cardGetByIdTool,
  cardUpdateTool,
  cardDeleteTool,
  cardAddLabelTool,
  cardRemoveLabelTool,
  cardAddMemberTool,
  cardRemoveMemberTool,
  cardListActivitiesTool,
];

export type { Tool } from './workspace';
