import { Item } from "@/types";
import queryString from "query-string";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { ItemImage, InfoContainer, ReviewDiv } from ".";
import { Box, Container, Paper, Stack } from "@mui/material";
import ErrorPage from "@/shared/ErrorPage";
import { getItem, getItemReviews } from "@/api/Item";
import { Res } from "@/api";
import LoadingPage from "@/shared/LoadingPage";
import { Btns } from "@/shared/ItemCard/Btns";

/**
 * This is the ItemPage component. It's a functional component that displays detailed information about a specific item.
 * 
 * Imports:
 * - Item: A type representing an item.
 * - queryString: A library for parsing and stringifying URL query strings.
 * - useEffect, useState: React hooks for managing side effects and local state.
 * - useLocation: A React Router hook for accessing the current location object.
 * - ImgDiv, InfoDiv, ReviewDiv: Sub-components used to display different parts of the item's information.
 * - Box, Paper, Stack: Material-UI components for layout and styling.
 * - ErrorPage: A component displayed when there's an error.
 * - ParallaxPage: A component that provides a parallax scrolling effect.
 * - plant1: An image asset.
 * - getItem, getItemReviews: API functions for fetching item and review data.
 * - Res: A type representing an API response.
 * - LoadingPage: A component displayed while waiting for data to load.
 * 
 * State variables:
 * - response: The response from the API call to getItem. It's initially undefined.
 * - priorityReviewId: The id of the review that should be displayed first. It's initially -1, because all ids begin with 1.
 * 
 * The useEffect hook is used to fetch data when the component mounts, but the body of the effect is not shown in this excerpt.
 */
export default function ItemPage() {
    const location = useLocation();

    const [response, setResponse] = useState<Res<Item> | undefined>();
    const [priorityReviewId, setPriorityReviewId] = useState<number>(-1); // Because all ids begin with 1

    useEffect(() => {
        const { itemId, reviewId } = queryString.parse(location.search);
        // TODO: specify radix for all parseInts

        const numericItemId =
            typeof itemId === "string" ? parseInt(itemId, 10) : NaN; // GOod practice to specify radixitem

        const numericReviewId =
            typeof reviewId === "string" ? parseInt(reviewId, 10) : NaN; // GOod practice to specify radix

        if (!isNaN(numericReviewId)) {
            setPriorityReviewId(numericReviewId);
        }

        if (isNaN(numericItemId)) {
            setResponse({
                isError: true,
                msg: "id has to be number",
                status: 400,
            });
        } else {
            getItem(numericItemId).then((response) => setResponse(response)); // The function itself catches errors
        }
    }, [location.search]);

    if (!response) {
        return <LoadingPage />;
    }

    if (!response.data || response.isError) {
        // Just to be safe even though response.error will be true if response.data is undefined
        return <ErrorPage status={response.status} error={response.msg} />;
    }

    const imgPerc = 50;

    return (
        <Stack width="100vw" sx={{ minHeight: "100vh" }} bgcolor="white" color="black">
            <Container maxWidth="xl" sx={{ display: "flex", gap: 3, marginY: "100px" }}>
                <ItemImage data={response.data} />
                <InfoContainer imgPerc={imgPerc} data={response.data!} />
            </Container>
            {/* <Box width="100%" sx={{ px: { xs: 2, md: 3 }, pb: 3 }}> */}
            <ReviewDiv itemId={response.data.id} priorityReviewId={priorityReviewId} />
            {/* </Box> */}
        </Stack>
    );
}


