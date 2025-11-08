export interface User {
  id: string;
  email: string;
  name: string;
  password: string;
  role: 'USER' | 'ADMIN';
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateUserData {
  email: string;
  name: string;
  password?: string;
  role?: 'USER' | 'ADMIN';
  googleId?: string;
}

export interface UpdateUserData {
  email?: string;
  name?: string;
  password?: string;
  role?: 'USER' | 'ADMIN';
}
