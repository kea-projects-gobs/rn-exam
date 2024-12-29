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
  preparationTime: number;
  servings: number;
  imageUrl: string;
  instructions: string[];
  ingredients: Record<number, number>;
}

export interface Product {
  id: number;
  name: string;
  price: number;
}

export interface MealPlan {
  id: number;
  username: string;
  recipeId: number;
  recipeName: string;
  dayOfWeek: string;
}

export interface MealPlanRequest {
  username: string;
  recipeId: number;
  dayOfWeek: string;
}

export interface ShoppingListItem {
  productId: number;
  name: string;
  price: number;
  quantity: number;
  totalPrice: number;
}

