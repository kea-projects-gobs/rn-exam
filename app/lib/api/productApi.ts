import { API_URL } from "./settings";
import { Product } from "../types/types";
import { makeOptions, handleHttpErrors } from "./utils/fetchUtils";

const PRODUCTS_URL = `${API_URL}/products`;

export const productApi = {
    async getProductById(id: number): Promise<Product> {
        const options = await makeOptions("GET", null, true);
        const res = await fetch(`${PRODUCTS_URL}/${id}`, options);
        return handleHttpErrors(res);
    },

    async getMultipleProducts(ids: string[]): Promise<Record<string, Product>> {
        // Create an array of promises, one for each product fetch
        const productPromises = ids.map(id => this.getProductById(Number(id)));
        
        // Wait for all product fetches to complete in parallel
        const products = await Promise.all(productPromises);
        
        // Convert array of products into an object keyed by product ID
        return products.reduce((acc, product) => {
          acc[product.id] = product;
          return acc;
        }, {} as Record<string, Product>);
      }
};