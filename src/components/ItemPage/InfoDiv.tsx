import { Item } from "@shared/types";
import { Stack, Typography } from "@mui/material";
import {
    Tags,
    Special,
    FreeRange,
    Organic,
    DiscountAndRating,
    Price,
} from "@/shared/ItemCard";
import { useMemo } from "react";

/**
 * The InfoDiv component is a functional component that receives several props related to an item and renders information about that item.
 * 
 * Props:
 * - id: The unique identifier of the item.
 * - title: The title of the item.
 * - price: The price of the item.
 * - tags: An array of tags associated with the item.
 * - discount: The discount applied to the item, if any.
 * - desc: The description of the item.
 * - reviewRating: The average rating of the item based on reviews.
 * - reviewCount: The number of reviews for the item.
 * - isSpecial: A boolean indicating whether the item is marked as special.
 * 
 * This component uses several sub-components (Tags, Special, FreeRange, Organic, DiscountAndRating, Price) to display the item's information in a structured way.
 * The useMemo hook is imported but not used in the shown excerpt.
 */
export function InfoDiv({
    id,
    title,
    price,
    tags,
    discount,
    desc,
    reviewRating,
    reviewCount,
    isSpecial,
}: Item) {
    const isMeatOrPoultry = useMemo(
        () => tags.includes("meat") || tags.includes("poultry"),
        [tags],
    );

    return (
        <>
            <Stack
                direction="row"
                justifyContent="start"
                color="white"
                fontSize={13}
            >
                {isSpecial && <Special />}
                {isMeatOrPoultry && <FreeRange />}
                <Organic />
            </Stack>
            <Typography variant="h3" fontWeight={700} marginY={"10px"}>
                {title}
            </Typography>
            <Tags tags={tags} />
            <Typography fontSize={"20px"} marginY={"30px"}>
                {desc}
            </Typography>
            <Price price={price} discount={discount} />
            <DiscountAndRating
                discount={discount}
                reviewCount={reviewCount}
                reviewRating={reviewRating}
            />
        </>
    );
}
