export type User = { username: string; password: string; roles?: string[] };

export interface LoginResponse {
  username: string;
  token: string;
  roles: Array<string>;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  password: string;
  email: string;
}

export interface RegisterResponse {
  userName: string;
  roleNames: string[]; 
  email: string;
}

export interface Recipe {
  id: number;
  name: string;
  description: string;
  preparation_time: number;
  servings: number;
}

export interface Product {
  rema_id: number;
  name: string;
  price: number;
}

export interface RecipeProduct {
  recipe_id: number;
  products_rema_id: number;
  quantity: number;
}

export interface MealPlan {
  id: number;
  user_username: string;
  recipe_id: number;
  day_of_week: string;
}
