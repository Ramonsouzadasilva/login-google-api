export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  stock: number;
  categoryId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateProductData {
  name: string;
  description?: string;
  price: number;
  stock: number;
  categoryId: string;
}

export interface UpdateProductData {
  name?: string;
  description?: string;
  price?: number;
  stock?: number;
  categoryId?: string;
}
