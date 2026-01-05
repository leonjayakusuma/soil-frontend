import { Item, ProfileInfo, UserPageInfo } from "@shared/types";
import { tryCatchHandler, tryCatchHandlerAuth } from ".";
import { PersonalInfo } from "@shared/types";
import { getSOILInfo } from "@/SoilInfo";
import { CartItem } from "@/types/domain";


export type UserInfo = {
    name: string;
    email: string;
    pswd: string;
    // dateJoined: string;
    personalInfo?: PersonalInfo;
    // cart: CartItem[];
};

export enum ForgotPswdErrorCodes {
    SUCCESS,
    INVALID_CODE_OR_USER_DELETED,
    CODE_EXPIRED,
    SERVER_ERROR,
}

export async function getProfileInfo() {
    const accessToken = getSOILInfo().userInfo?.accessToken ?? "";
    if (!accessToken) {
        return {
            data: undefined,
            msg: "Not logged in - access token missing",
            isError: true,
            status: 401,
        };
    }

    return tryCatchHandlerAuth<{ accessToken: string }, ProfileInfo>(
        "/api/protected/profileInfo",
        { accessToken },
        "POST",
    );
}

export async function updateBasicUserInfo(name: string, email: string) {
    const accessToken = getSOILInfo().userInfo?.accessToken ?? "";
    if (!accessToken) {
        return {
            data: undefined,
            msg: "Not logged in - access token missing",
            isError: true,
            status: 401,
        };
    }

    return tryCatchHandlerAuth<
        { name: string; email: string; accessToken: string },
        unknown
    >(
        "/api/protected/updateBasicUserInfo",
        {
            name,
            email,
            accessToken,
        },
        "POST",
    );
}

export function isFollowingUser(userId: number) {
    return tryCatchHandlerAuth<{ userId: number }, boolean>(
        "/api/isFollowing",
        {
            userId,
        },
    );
}

export function followUser(userId: number) {
    return tryCatchHandlerAuth<{ userIdToFollow: number }, unknown>(
        "/api/follow",
        {
            userIdToFollow: userId,
        },
    );
}

export function unfollowUser(userId: number) {
    return tryCatchHandlerAuth<{ userIdToRemove: number }, unknown>(
        "/api/unfollow",
        {
            userIdToRemove: userId,
        },
    );
}

export function getUserPageInfo(userId: number) {
    return tryCatchHandler<unknown, UserPageInfo>(
        `/api/userPageInfo?userId=${userId}`,
        undefined,
        "GET",
    );
}

export function createUser({
    email,
    name,
    pswd: password,
}: Omit<UserInfo, "dateJoined" | "cart">) {
    return tryCatchHandler<
        {
            email: string;
            name: string;
            password: string;
        },
        {
            id: number;
            accessToken: string;
            refreshToken: string;
        }
    >("/api/signup", { email, name, password });
}

export function logInUser(email: string, pswd: string) {
    return tryCatchHandler<
        {
            email: string;
            password: string;
        },
        {
            id: number;
            name: string;
            accessToken: string;
            refreshToken: string;
        }
    >("/api/login", { email, password: pswd });
}

export async function logOutUser() {
    const accessToken = getSOILInfo().userInfo?.accessToken ?? "";
    
    // Clear localStorage first (optimistic logout)
    localStorage.clear();
    
    // Try to logout on server (but don't fail if it doesn't work)
    if (accessToken) {
        try {
            const result = await tryCatchHandlerAuth<
                {
                    accessToken: string;
                },
                boolean
            >("/api/protected/logout", { accessToken }, "POST");
            
            // Return success if server logout worked, or if it failed but we cleared local storage
            return result.data === true || !result.isError;
        } catch (error) {
            // Ignore server logout errors - we've already cleared local storage
            // Return true since we successfully cleared local storage
            return true;
        }
    }
    
    // No access token, but we cleared local storage, so logout is successful
    return true;
}

export function deleteLoggedInUser() {
    const successful = tryCatchHandlerAuth<
        {
            accessToken: string;
        },
        boolean
    >("/api/deleteUser"); // TODO: if success log out the user
    return successful;
}

export async function checkOldPswd(oldPassword: string) {
    return tryCatchHandlerAuth<{ oldPassword: string }, boolean>(
        "/api/checkOldPswd",
        { oldPassword },
    );
}

export async function changePassword(oldPassword: string, newPassword: string) {
    return tryCatchHandlerAuth<
        {
            oldPassword: string;
            newPassword: string;
        },
        boolean
    >("/api/changePassword", { oldPassword, newPassword });
}

export async function getPersonalInfo() {
    const accessToken = getSOILInfo().userInfo?.accessToken ?? "";
    if (!accessToken) {
        return {
            data: undefined,
            msg: "Not logged in - access token missing",
            isError: true,
            status: 401,
        };
    }

    return tryCatchHandlerAuth<{ accessToken: string }, PersonalInfo>(
        "/api/protected/personalInfo",
        { accessToken },
        "POST",
    );
}

export async function updatePersonalInfo(personalInfo: PersonalInfo) {
    const accessToken = getSOILInfo().userInfo?.accessToken ?? "";
    if (!accessToken) {
        return {
            data: undefined,
            msg: "Not logged in - access token missing",
            isError: true,
            status: 401,
        };
    }

    return tryCatchHandlerAuth<
        PersonalInfo & { isMale: boolean; accessToken: string },
        unknown
    >(
        "/api/protected/updatePersonalInfo",
        {
            ...personalInfo,
            isMale: personalInfo.sex === "male",
            accessToken,
        },
        "POST",
    );
}

export async function addItemToCart(itemId: number) {
    const accessToken = getSOILInfo().userInfo?.accessToken ?? "";
    if (!accessToken) {
        return {
            data: undefined,
            msg: "Not logged in - access token missing",
            isError: true,
            status: 401,
        };
    }

    return tryCatchHandlerAuth<
        { itemId: number; accessToken: string },
        boolean
    >(
        "/api/protected/addItemToCart",
        { itemId, accessToken },
        "POST",
    );
}

export async function getUserCart() {
    const accessToken = getSOILInfo().userInfo?.accessToken ?? "";
    if (!accessToken) {
        return {
            data: undefined,
            msg: "Not logged in - access token missing",
            isError: true,
            status: 401,
        };
    }

    return tryCatchHandlerAuth<{ accessToken: string }, CartItem[]>(
        "/api/protected/cart",
        { accessToken },
        "POST",
    );
}

export async function updateItemQuantityFromCart(
    itemId: number,
    quantity: number,
) {
    const accessToken = getSOILInfo().userInfo?.accessToken ?? "";
    if (!accessToken) {
        return {
            data: undefined,
            msg: "Not logged in - access token missing",
            isError: true,
            status: 401,
        };
    }

    return tryCatchHandlerAuth<
        { itemId: number; quantity: number; accessToken: string },
        boolean
    >(
        "/api/protected/updateItemQuantityFromCart",
        { itemId, quantity, accessToken },
        "POST",
    );
}

export async function deleteItemFromCart(itemId: number) {
    const accessToken = getSOILInfo().userInfo?.accessToken ?? "";
    if (!accessToken) {
        return {
            data: undefined,
            msg: "Not logged in - access token missing",
            isError: true,
            status: 401,
        };
    }

    return tryCatchHandlerAuth<
        { itemId: number; accessToken: string },
        boolean
    >(
        "/api/protected/deleteItemFromCart",
        { itemId, accessToken },
        "POST",
    );
}

export async function clearCart() {
    return tryCatchHandlerAuth<unknown, boolean>("/api/clearCart");
}

export async function getForgotPswdCode(email: string) {
    return tryCatchHandler<{ email: string }, string>(
        "/api/getForgotPswdCode",
        { email },
    );
}

export async function forgotPswd(code: string) {
    return tryCatchHandler<{ code: string }, string>("/api/forgotPswd", {
        code,
    });
}

export async function emailAndNameExists(email: string, name: string) {
    return tryCatchHandler<
        { email: string; name: string },
        { email: boolean; name: boolean }
    >("/api/emailAndNameExists", { email, name });
}
