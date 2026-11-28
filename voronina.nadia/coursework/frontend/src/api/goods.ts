import {request} from './client';
import type {Product} from '../types/product';

export function getGoods(): Promise<Product[]> {
  return request<Product[]>('/goods');
}

export function getProduct(id: number): Promise<Product> {
  return request<Product>(`/goods/${id}`);
}
