import type {
  List,
  ListWithItems,
  Item,
  CreateListRequest,
  CreateItemRequest,
  UpdateItemRequest,
  ApiError,
} from '../types/api';
import { authService } from './auth.service';

const BASE_URL = import.meta.env.VITE_API_URL;
const AUTH_BASE_URL = import.meta.env.VITE_AUTH_BASE_URL;
const TIMEOUT = 10000;

class ApiClient {
  private async fetchWithTimeout(
    url: string,
    options: RequestInit = {},
    isRetry: boolean = false
  ): Promise<Response> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), TIMEOUT);

    try {
      const response = await fetch(url, {
        ...options,
        credentials: 'include',
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });

      clearTimeout(timeoutId);

      if (response.status === 401 && !isRetry) {
        // Essayer de refresher le token
        const refreshSuccess = await authService.refreshToken();
        
        if (refreshSuccess) {
          // Retry la requête originale avec le nouveau token
          return this.fetchWithTimeout(url, options, true);
        } else {
          // Le refresh a échoué, rediriger vers le login
          const returnTo = encodeURIComponent(window.location.href);
          window.location.href = `${AUTH_BASE_URL}/auth/login?returnTo=${returnTo}`;
          throw new Error('Non authentifié');
        }
      } else if (response.status === 401 && isRetry) {
        // Déjà essayé de refresher, rediriger vers le login
        const returnTo = encodeURIComponent(window.location.href);
        window.location.href = `${AUTH_BASE_URL}/auth/login?returnTo=${returnTo}`;
        throw new Error('Non authentifié');
      }

      return response;
    } catch (error) {
      clearTimeout(timeoutId);
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error('La requête a expiré. Veuillez réessayer.');
      }
      if (error instanceof Error && error.message === 'Non authentifié') {
        throw error;
      }
      throw new Error('Erreur réseau. Veuillez vérifier votre connexion.');
    }
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      let errorMessage = 'Une erreur est survenue.';

      try {
        const errorData: ApiError = await response.json();
        errorMessage = errorData.error || errorMessage;
      } catch {
        if (response.status === 404) {
          errorMessage = 'Ressource introuvable.';
        } else if (response.status === 400) {
          errorMessage = 'Requête invalide.';
        } else if (response.status >= 500) {
          errorMessage = 'Erreur serveur. Veuillez réessayer plus tard.';
        }
      }

      throw new Error(errorMessage);
    }

    return response.json();
  }

  async getLists(): Promise<List[]> {
    const response = await this.fetchWithTimeout(`${BASE_URL}/lists`);
    return this.handleResponse<List[]>(response);
  }

  async createList(data: CreateListRequest): Promise<List> {
    const response = await this.fetchWithTimeout(`${BASE_URL}/lists`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return this.handleResponse<List>(response);
  }

  async getList(listId: string): Promise<ListWithItems> {
    const response = await this.fetchWithTimeout(`${BASE_URL}/lists/${listId}`);
    return this.handleResponse<ListWithItems>(response);
  }

  async deleteList(listId: string): Promise<void> {
    const response = await this.fetchWithTimeout(`${BASE_URL}/lists/${listId}`, {
      method: 'DELETE',
    });
    await this.handleResponse(response);
  }

  async getItems(listId: string, limit = 20, skip = 0): Promise<Item[]> {
    const response = await this.fetchWithTimeout(
      `${BASE_URL}/lists/${listId}/items?limit=${limit}&skip=${skip}`
    );
    return this.handleResponse<Item[]>(response);
  }

  async createItem(listId: string, data: CreateItemRequest): Promise<Item> {
    const response = await this.fetchWithTimeout(
      `${BASE_URL}/lists/${listId}/items`,
      {
        method: 'POST',
        body: JSON.stringify(data),
      }
    );
    return this.handleResponse<Item>(response);
  }

  async updateItem(
    listId: string,
    itemId: string,
    data: UpdateItemRequest
  ): Promise<Item> {
    const response = await this.fetchWithTimeout(
      `${BASE_URL}/lists/${listId}/items/${itemId}`,
      {
        method: 'PATCH',
        body: JSON.stringify(data),
      }
    );
    return this.handleResponse<Item>(response);
  }

  async deleteItem(listId: string, itemId: string): Promise<void> {
    const response = await this.fetchWithTimeout(
      `${BASE_URL}/lists/${listId}/items/${itemId}`,
      {
        method: 'DELETE',
      }
    );
    await this.handleResponse(response);
  }
}

export const apiClient = new ApiClient();
