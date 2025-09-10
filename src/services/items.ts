import { getApiBaseUrl } from '../lib/apiBaseUrl';
import type { Item, CreateItemRequest, UpdateItemRequest } from '../types/item';

const apiBaseUrl = getApiBaseUrl();

export const itemsService = {
  async getItems(): Promise<Item[]> {
    const response = await fetch(`${apiBaseUrl}/items`);
    if (!response.ok) {
      throw new Error('Erreur lors de la récupération des items');
    }
    return response.json();
  },

  async createItem(item: CreateItemRequest): Promise<Item> {
    const response = await fetch(`${apiBaseUrl}/items`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(item),
    });
    if (!response.ok) {
      throw new Error('Erreur lors de la création de l\'item');
    }
    return response.json();
  },

  async updateItem(itemId: string, item: UpdateItemRequest): Promise<Item> {
    const response = await fetch(`${apiBaseUrl}/items/${itemId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(item),
    });
    if (!response.ok) {
      throw new Error('Erreur lors de la modification de l\'item');
    }
    return response.json();
  },

  async deleteItem(itemId: string): Promise<void> {
    const response = await fetch(`${apiBaseUrl}/items/${itemId}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Erreur lors de la suppression de l\'item');
    }
  },
};