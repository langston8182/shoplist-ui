export interface Item {
  _id: string;
  name: string;
  quantity: string;
  unit: string;
}

export interface CreateItemRequest {
  name: string;
  quantity: string;
  unit: string;
}

export interface UpdateItemRequest {
  name: string;
  quantity: string;
  unit: string;
}