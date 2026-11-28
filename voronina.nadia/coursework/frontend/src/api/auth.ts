import {request} from './client';
import type {User, LoginRequest} from '../types/auth';

export function login(data: LoginRequest): Promise<User> {
  return request<User>('/login', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function logout(): Promise<{message: string}> {
  return request<{message: string}>('/logout', {
    method: 'POST',
  });
}

export function getCurrentUser(): Promise<User> {
  return request<User>('/me');
}
