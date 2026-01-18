import { Recipe } from "@/types";

export type DayMeal = {
    breakfast: Recipe;
    lunch: Recipe;
    dinner: Recipe;
};

export enum mealDurations {
    daily = 1,
    weekly = 7,
}


