export interface List {
  _id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface Weight {
  value: number;
  unit: 'g' | 'kg' | 'ml' | 'l';
}

export interface Item {
  _id: string;
  listId: string;
  name: string;
  quantity: number | null;
  weight: Weight | null;
  notes: string | null;
  purchased: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ListWithItems extends List {
  items: Item[];
}

export interface CreateListRequest {
  name: string;
}

export interface CreateItemRequest {
  name: string;
  quantity?: number;
  weight?: Weight;
  notes?: string;
  purchased?: boolean;
}

export interface UpdateItemRequest {
  quantity?: number | null;
  weight?: Weight | null;
  purchased?: boolean;
}

export interface ApiError {
  error: string;
}

export interface Article {
  _id: string;
  name: string;
  usageCount: number;
  score?: number;
  createdAt: string;
  updatedAt: string;
}

export interface ArticleSearchResponse {
  articles: Article[];
  query?: string;
  total: number;
  type: 'search' | 'popular';
}
