import { API_URL } from "./settings";
import { makeOptions, handleHttpErrors } from "./utils/fetchUtils";
import { Recipe } from "../types/types";

const RECIPES_URL = `${API_URL}/recipes`;

export const recipeApi = {
    async getAllRecipes(): Promise<Recipe[]> {
        const options = await makeOptions("GET", null, true);
        const res = await fetch(RECIPES_URL, options);
        return handleHttpErrors(res);
    },

    async getRecipeById(id: number): Promise<Recipe> {
        const options = await makeOptions("GET", null, true);
        const res = await fetch(`${RECIPES_URL}/${id}`, options);
        return handleHttpErrors(res);
    }
};