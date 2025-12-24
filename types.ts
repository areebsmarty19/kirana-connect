export interface Store {
  id: string;
  name: string;
  deliveryTime: string;
  rating: number;
  image: string;
}

export interface Product {
  barcode: string;
  name: string;
  price: number;
  stock: number;
  storeId: string;
  image?: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  status: 'pending' | 'completed';
  createdAt: number;
  storeId: string;
}

export type UserRole = 'shopkeeper' | 'customer' | null;