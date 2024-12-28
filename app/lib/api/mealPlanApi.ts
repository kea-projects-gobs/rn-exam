import { API_URL } from "./settings";
import { MealPlan, MealPlanRequest, ShoppingListItem } from "../types/types";
import { makeOptions, handleHttpErrors } from "./utils/fetchUtils";

const MEALPLAN_URL = `${API_URL}/mealplan`;

export const mealPlanApi = {
    async createMealPlan(mealPlans: MealPlanRequest[]): Promise<MealPlan[]> {
        const options = await makeOptions("POST", mealPlans, true);
        const res = await fetch(MEALPLAN_URL, options);
        return handleHttpErrors(res);
    },

    async getMealPlansByUser(username: string): Promise<MealPlan[]> {
        const options = await makeOptions("GET", null, true);
        const res = await fetch(`${MEALPLAN_URL}/user/${username}`, options);
        return handleHttpErrors(res);
    },

    async getShoppingList(username: string): Promise<ShoppingListItem[]> {
        const options = await makeOptions("GET", null, true);
        const res = await fetch(`${MEALPLAN_URL}/shopping-list/${username}`, options);
        return handleHttpErrors(res);
    },

    async deleteMealPlan(id: number): Promise<void> {
        const options = await makeOptions("DELETE", null, true);
        const res = await fetch(`${MEALPLAN_URL}/${id}`, options);
        return handleHttpErrors(res);
    }
};