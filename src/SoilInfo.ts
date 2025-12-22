// import { UserInfo, UserCode } from "@/Auth";
import { CartItemType } from "@/Items";
import { Item } from "@shared/types";
import { Tokens } from "@shared/types";

interface UnparsedItemType
    extends Omit<
        Item,
        "id" | "price" | "discount" | "reviewRating" | "reviewCount"
    > {
    id: string;
    price: string;
    discount: string;
    reviewRating: string;
    reviewCount: string;
}

type SOILUserInfo = {
    userId: number;
} & Tokens;

interface SoilInfo {
    // user?: UserInfo;
    // userCodes?: UserCode;
    // users: UserInfo[];
    items: Item[];
    cart: CartItemType[];

    // New properties
    userInfo?: SOILUserInfo;
}

interface UnparsedSoilInfo
    extends Omit<SoilInfo, "items" | "specials" | "recipes"> {
    items: UnparsedItemType[];
}

const emptySoilInfo: SoilInfo = {
    cart: [],
    items: [],
};

export function setSOILItem<T extends keyof SoilInfo>(
    key: T,
    value: SoilInfo[T],
) {
    const SOIL = getSOILInfo();
    SOIL[key] = value;

    localStorage.setItem("SOIL", JSON.stringify(SOIL));
}

export function getSOILInfo(): SoilInfo {
    const RawSoilInfo = getRawSoilInfo();

    const items: Item[] = [];
    // const items: Item[] = RawSoilInfo.items.map((item) => parseItemType(item));

    return { ...RawSoilInfo, items };
}

function getRawSoilInfo(): UnparsedSoilInfo {
    const SOILStr = localStorage.getItem("SOIL");
    return SOILStr !== null ? JSON.parse(SOILStr) : emptySoilInfo;
}
