// Domain models - used across multiple modules

export type Tokens = {
    accessToken: string;
    refreshToken: string;
};

export interface Item {
    id: number;
    title: string;
    price: number;
    tags: string[];
    discount: number;
    desc: string;
    reviewRating: number;
    reviewCount: number;
    isSpecial: boolean;
    imgUrl?: string;
}

export interface CartItem {
    item: Item;
    quantity: number;
    subTotal: number;  // Keep this version (from shared/types.ts)
}

export interface Review {
    id: number;
    userId: number;
    userName: string;
    dateCreated: string;
    isDeleted: boolean;
    isFlagged: boolean;
    itemId: number;
    rating: number;
    reviewTxt: string;
}

export type UserReview = Review;

export interface Recipe {
    id: number;
    name: string;
    description?: string;
    imgUrl?: string;
    [key: string]: unknown;
}