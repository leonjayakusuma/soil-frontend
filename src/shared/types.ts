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

export type CartItemDetails = Pick<Item, "id" | "title" | "price" | "discount" | "imgUrl">;

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

export interface PersonalInfo {
    sex: "male" | "female";
    age: number;
    weight: number;
    weightGoal: number;
    weightGainPerWeek: number;
    height: number;
    bodyFatPerc: number;
    activityLevel: string;
    dietaryPreference: string;
    healthGoal: string;
}

export interface UserPageInfo {
    userId: number;
    name: string;
    reviews: UserReview[];
    [key: string]: unknown;
}

export interface ProfileInfo {
    name: string;
    email: string;
    dateJoined: string;
    // Allow additional properties from the API without losing type safety
    [key: string]: unknown;
}

