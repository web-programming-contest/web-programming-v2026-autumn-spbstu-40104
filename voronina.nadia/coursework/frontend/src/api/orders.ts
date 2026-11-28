import {request} from './client';
import type {Order, OrderRequest} from '../types/order';

export function createOrder(data: OrderRequest): Promise<Order> {
  return request<Order>('/orders', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function getOrders(): Promise<Order[]> {
  return request<Order[]>('/orders');
}
