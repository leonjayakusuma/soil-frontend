import { Item } from "@shared/types";
import { Box, Stack, Typography } from "@mui/material";
import {
    Tags,
    Special,
    FreeRange,
    Organic,
    ItemMetrics,
    Price,
    Btns,
} from "@/shared/ItemCard";
import { useMemo } from "react";
import NumberSpinner from "./NumberSpinner";

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

export function InfoContainer({ imgPerc, data }: { imgPerc: number, data: Item }) {
    return <Box
        width={{ xs: "100%", md: `${100 - imgPerc}%` }}
    >
        <InfoDiv {...data} />

        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <NumberSpinner label="Quantity" />
            <Btns isHovered={true} transitionDuration={0.3} item={data} />
        </Box>
    </Box>;
}


function InfoDiv({
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
            <Typography variant="h5" fontWeight={700} marginY={"10px"}>
                {title}
            </Typography>
            <ItemMetrics
                reviewCount={reviewCount}
                reviewRating={reviewRating}
            />
            {/* <Price price={price} discount={discount} /> */}
            <Typography variant="h5" fontWeight={700} marginY={"10px"}>A$ {price}</Typography>
            <Stack
                direction="row"
                justifyContent="start"
                color="white"
                fontSize={13}
                marginY={"10px"}
            >
                {isSpecial && <Special />}
                {isMeatOrPoultry && <FreeRange />}
                <Organic />
            </Stack>
            <Tags tags={tags} />
            <Typography fontSize={"20px"} marginY={"30px"}>
                {desc}
            </Typography>
            
        </>
    );
}
