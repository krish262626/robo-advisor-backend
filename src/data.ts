// src/data.ts

export interface PortfolioStock {
  stock: string;
  weight: number;
  price?: number; // optional market price
}

export interface Order {
  orderId: number;
  itemId: string;
  type: string;
  userId?: string;
  stock: string;
  amount: number;
  shares: number;
  price: number;
  timestamp: string;
  status: string;
  idempotencyKey: string;
}

export let orders: Order[] = [];
export let decimalPrecision: number = 3; // default 3 decimals
let orderCounter = 1;

export function generateOrderId() {
  return orderCounter++;
}

export const idempotencyMap: Map<string, any> = new Map();

// Default stock price if partner doesn't provide
export const DEFAULT_PRICE = 100;
