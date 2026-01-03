import { Typography, Stack, Box, Rating, Divider } from "@mui/material";

/**

This component displays the discount and rating of an item. It receives discount, reviewRating, 
and reviewCount as props and displays them in a styled Stack component.
 */
export function ItemMetrics({
    // discount,
    reviewRating,
    reviewCount,
}: {
    // discount: number;
    reviewRating: number;
    reviewCount: number;
}) {
    return (
        <Stack
            direction="row"
            color="white"
            fontSize={17}
            gap={0.5}
        >
            <ItemRatings reviewRating={reviewRating} />
            <Divider orientation="vertical" flexItem sx={{ borderColor: "rgba(0, 0, 0, 0.2)" }} />  
            <RatingCount reviewCount={reviewCount} />
            <Divider orientation="vertical" flexItem sx={{ borderColor: "rgba(0, 0, 0, 0.2)" }} />
            <ItemSales sales={100} />
        </Stack>
    );
}

const RatingCount = ({ reviewCount }: { reviewCount: number }) => (
    <Typography sx={{ color: "black" }}>
        {reviewCount} ratings
    </Typography>
);

const ItemRatings = ({ reviewRating}: { reviewRating: number }) => (
    <Stack direction="row" alignItems="center">
        {/* Display star amount and number of people who voted for it */}
        <Typography sx={{ color: "black", textDecoration: "underline" }}>
            {reviewRating}
        </Typography>
        <Rating
            name="half-rating-read"
            defaultValue={reviewRating}
            precision={0.25}
            readOnly
            sx={{ display: "flex", alignItems: "center" }} />
    </Stack>
);

function ItemSales({ sales }: { sales: number }) {
    return <Stack direction="row" alignItems="center">
        <Typography sx={{ color: "black" }}>
            {sales} sold
        </Typography>
    </Stack>;
}

