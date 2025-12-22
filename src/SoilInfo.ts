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
    const raw = getRawSoilInfo();

    // If items are already in parsed form (SoilInfo), just return as-is
    if (!Array.isArray((raw as UnparsedSoilInfo).items)) {
        return raw as SoilInfo;
    }

    // Parse stored items (which are saved as UnparsedItemType) into strongly typed Item[]
    const items: Item[] = (raw as UnparsedSoilInfo).items.map((item) =>
        parseItemType(item),
    );

    return { ...(raw as SoilInfo), items };
}

function getRawSoilInfo(): UnparsedSoilInfo | SoilInfo {
    const SOILStr = localStorage.getItem("SOIL");
    return SOILStr !== null ? JSON.parse(SOILStr) : emptySoilInfo;
}

// Convert the loose/unparsed item shape from localStorage into a proper Item
function parseItemType(item: UnparsedItemType): Item {
    return {
        ...item,
        id: Number(item.id),
        price: Number(item.price),
        discount: Number(item.discount),
        reviewRating: Number(item.reviewRating),
        reviewCount: Number(item.reviewCount),
    };
}
