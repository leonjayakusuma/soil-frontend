import { Typography, Stack, Box, Rating } from "@mui/material";

/**

This component displays the discount and rating of an item. It receives discount, reviewRating, 
and reviewCount as props and displays them in a styled Stack component.
 */
export function DiscountAndRating({
    discount,
    reviewRating,
    reviewCount,
}: {
    discount: number;
    reviewRating: number;
    reviewCount: number;
}) {
    return (
        <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            color="white"
            fontSize={17}
        >
            {/* <Box
                sx={{ backgroundColor: "#228B22" }}
                px={0.4}
                mt={0.1}
                fontWeight={500}
                letterSpacing={1}
                borderRadius={0.4}
                fontSize={10}
            >
                {`SAVE ${discount}%`}
            </Box> */}
            <Stack direction="row" alignItems="center">
                {/* Have star amoutn and number of people voted for it */}
                <Rating
                    name="half-rating-read"
                    defaultValue={reviewRating}
                    precision={0.25}
                    readOnly
                    sx={{ display: "flex", alignItems: "center" }}
                />
                <Typography sx={{ color: "black", ml: 0.3 }}>
                    {reviewCount}
                </Typography>
            </Stack>
        </Stack>
    );
}
