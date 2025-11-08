export type OrderStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'SHIPPED'
  | 'DELIVERED'
  | 'CANCELLED';

export interface Order {
  id: string;
  userId: string;
  status: OrderStatus;
  total: number;
  createdAt: Date;
  updatedAt: Date;
  orderItems: OrderItem[];
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  quantity: number;
  price: number;
}

export interface CreateOrderData {
  userId: string;
  items: {
    productId: string;
    quantity: number;
  }[];
}

export interface UpdateOrderData {
  status?: OrderStatus;
}
