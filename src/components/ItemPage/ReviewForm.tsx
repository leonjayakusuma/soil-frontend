import { useState } from "react";
import {
    Box,
    Button,
    TextField,
    Rating,
    Stack,
    Link,
    Typography,
} from "@mui/material";
import { Review } from "@/types";
import { createReview } from "@/api";
import { usePopup } from "@/shared/Popup";
import { getSOILInfo } from "@/SoilInfo";
import { Link as RouterLink } from "react-router-dom";

/**
 * The ReviewForm component is a functional component that takes an item ID and a function to update reviews as props.
 *  It uses React's useState hook to manage the state of the review text, rating, and word count.
 *  It also uses a custom hook, usePopup, to manage popups.
 *  The component imports various elements from Material-UI, shared types, API functions, and a function to get soil information.
 *  The purpose of this component is to provide a form for users to create a new review for a specific item.
 */
export function ReviewForm({
    itemId,
    setReviews,
}: {
    itemId: number;
    setReviews: React.Dispatch<React.SetStateAction<Review[] | undefined>>;
}) {
    const [reviewTxt, setReviewTxt] = useState("");
    const [rating, setRating] = useState(5);
    const [wordCount, setWordCount] = useState(0);
    const popup = usePopup()!;

    const handleTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newText = event.target.value;
        const words = newText.match(/\b\w+\b/g) || [];
        if (newText.length <= 1000 && words.length <= 100) {
            setReviewTxt(newText);
            setWordCount(words.length);
        }
    };

    const handleReviewSubmit = async () => {
        const response = await createReview({
            itemId,
            rating,
            reviewTxt: reviewTxt,
        });

        const data = response.data;

        if (data === undefined || response.isError) {
            popup(`Error ${response.status}: ${response.msg}`);
        } else {
            setReviews((prevReviews) => [
                {
                    id: data.id,
                    userId: data.userId,
                    userName: data.name,
                    itemId,
                    rating,
                    reviewTxt,
                    dateCreated: new Date().toISOString(),
                    isDeleted: false,
                    isFlagged: false,
                },
                ...(prevReviews ?? []),
            ]);
            setReviewTxt("");
            setRating(5);
            popup("Review submitted successfully");
        }
    };

    const isLoggedIn = !!getSOILInfo().userInfo;

    // If not logged in return a message to login to post a review
    if (!isLoggedIn) {
        return (
            <Stack
                sx={{
                    p: 1,
                    backgroundColor: "white",
                    color: "black",
                    borderRadius: 2,
                }}
                direction={"row"}
                justifyContent={"center"}
                alignItems={"center"}
            >
                <Link component={RouterLink} to="/login">
                    Login
                </Link>
                &nbsp;to post a review
            </Stack>
        );
    }

    return (
        <Box
            sx={{
                p: 1,
                backgroundColor: "white",
                borderRadius: 2,
                "@media (max-width: 1600px)": {
                    width: "100%",
                },
            }}
        >
            <TextField
                fullWidth
                label="Your Review"
                value={reviewTxt}
                onChange={handleTextChange}
                multiline
                rows={4}
                variant="outlined"
            />
            <Typography
                variant="caption"
                display="block"
                gutterBottom
                color={"black"}
            >
                {wordCount} / 100 words : {reviewTxt.length} / 1000 characters
            </Typography>
            <Stack
                direction={"row"}
                justifyContent={"space-between"}
                alignItems={"center"}
            >
                <Rating
                    name="simple-controlled"
                    value={rating}
                    size="large"
                    precision={0.25}
                    onChange={(_, newValue) => {
                        setRating(newValue ?? rating);
                    }}
                />
                <Button variant="contained" onClick={handleReviewSubmit}>
                    Submit Review
                </Button>
            </Stack>
        </Box>
    );
}
