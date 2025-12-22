import { tryCatchHandler, tryCatchHandlerAuth } from ".";
import { Item, Recipe, Review } from "@shared/types";

export function getSpecials() {
    return tryCatchHandler<unknown, Item[]>("/api/specials", undefined, "GET");
}

export function getItem(itemId: number) {
    return tryCatchHandler<unknown, Item>(
        `/api/item?itemId=${itemId}`,
        undefined,
        "GET",
    );
}

export function getAllItems() {
    return tryCatchHandler<unknown, Item[]>("/api/allItems", undefined, "GET");
}

export function getItemReviews(itemId: number) {
    return tryCatchHandler<unknown, Review[]>(
        "/api/itemReviews",
        { itemId },
        "POST",
    );
}
type PlainReview = Omit<
    Review,
    "id" | "userId" | "userName" | "dateCreated" | "isDeleted" | "isFlagged"
>;
export function createReview(plainReview: PlainReview) {
    return tryCatchHandlerAuth<
        PlainReview,
        { id: number; userId: number; name: string }
    >("/api/createReview", plainReview, "POST");
}

export function editReview(
    reviewId: number,
    reviewTxt: string,
    rating: number,
) {
    return tryCatchHandlerAuth<
        {
            reviewId: number;
            reviewTxt: string;
            rating: number;
        },
        unknown
    >("/api/editReview", { reviewId, reviewTxt, rating });
}

export function deleteReview(reviewId: number) {
    return tryCatchHandlerAuth<{ reviewId: number }, unknown>(
        "/api/deleteReview",
        {
            reviewId,
        },
    );
}

export function getAllRecipes() {
    return tryCatchHandler<unknown, Recipe[]>("/api/recipes", undefined, "GET");
}
