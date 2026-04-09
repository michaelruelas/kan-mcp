import type { ToolResult } from './types';

export function isSuccess<T>(result: ToolResult<T>): result is { ok: true; data: T } {
  return result.ok === true;
}

export function isError<T>(result: ToolResult<T>): result is { ok: false; error: string } {
  return result.ok === false;
}

export function success<T>(data: T): ToolResult<T> {
  return { ok: true, data };
}

export function error(message: string): ToolResult<never> {
  return { ok: false, error: message };
}

export function assertString(value: unknown, fieldName: string): string {
  if (typeof value !== 'string') {
    throw new Error(`${fieldName} must be a string`);
  }
  return value;
}

export function assertNumber(value: unknown, fieldName: string): number {
  if (typeof value !== 'number') {
    throw new Error(`${fieldName} must be a number`);
  }
  return value;
}

export function assertOptionalString(value: unknown, fieldName: string): string | undefined {
  if (value === undefined || value === null) {
    return undefined;
  }
  if (typeof value !== 'string') {
    throw new Error(`${fieldName} must be a string or omitted`);
  }
  return value;
}

export function assertArray(value: unknown, fieldName: string): unknown[] {
  if (!Array.isArray(value)) {
    throw new Error(`${fieldName} must be an array`);
  }
  return value;
}
