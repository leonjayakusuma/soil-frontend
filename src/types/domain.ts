// Domain models - used across multiple modules

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

export type CartItemDetails = Pick<
    Item,
    "id" | "title" | "price" | "discount" | "imgUrl"
>;

export interface CartItem {
    item: CartItemDetails;
    quantity: number;
    subTotal: number;
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