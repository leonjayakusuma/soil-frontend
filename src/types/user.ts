// User-related types

import { UserReview } from './domain';

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