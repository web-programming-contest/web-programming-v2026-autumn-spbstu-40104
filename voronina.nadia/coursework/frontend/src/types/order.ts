export type DeliveryType = 'pickup' | 'delivery';

export type PaymentType = 'card' | 'cash';

export interface OrderItemRequest {
  product_id: number;
  quantity: number;
}

export interface OrderRequest {
  items: OrderItemRequest[];

  phone: string;
  email: string | null;

  delivery: DeliveryType;
  address: string | null;

  payment: PaymentType;
  packaging: boolean;
}

export interface OrderItemResponse {
  product_id: number;
  name: string;
  price: number;
  quantity: number;
  total_price: number;
}

export interface Order {
  id: number;
  created_at: string;

  items: OrderItemResponse[];

  total_quantity: number;
  total_price: number;

  phone: string;
  email: string | null;

  delivery: DeliveryType;
  address: string | null;

  payment: PaymentType;
  packaging: boolean;
}
