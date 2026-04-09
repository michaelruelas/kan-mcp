import { KanApiError } from './errors.js';

export class KanClient {
  private readonly apiKey: string;
  private readonly baseUrl = 'https://kan.bn/api/v1';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async request<T>(path: string, options?: RequestInit): Promise<T> {
    const url = `${this.baseUrl}${path}`;
    const headers: Record<string, string> = {
      'Authorization': `Bearer ${this.apiKey}`,
      'Content-Type': 'application/json',
    };

    const response = await fetch(url, {
      ...options,
      headers: {
        ...headers,
        ...options?.headers,
      },
    });

    if (!response.ok) {
      throw KanApiError.fromHttpStatus(response.status, response.statusText);
    }

    return response.json() as T;
  }
}
