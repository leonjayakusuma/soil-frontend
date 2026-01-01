import { useEffect, useState } from "react";
import { Box } from "@mui/material";
import { Review } from "@shared/types";
import { getItemReviews } from "@/api";
import { usePopup } from "@/shared/Popup";
import { ReviewDisplay, ReviewForm } from ".";

/**
 * The ReviewDiv component is a functional component that takes an item ID and a priority review ID as props.
 * It uses React's useState and useEffect hooks to manage the state of reviews and to fetch item reviews when
 * the component mounts. It also uses a custom hook, usePopup, to manage popups. 
 * The component includes two sub-components: ReviewDisplay and ReviewForm, 
 * which are responsible for displaying the list of reviews and the form to add a new review, respectively.
 * The component also handles error scenarios when fetching reviews, using the popup function to display error messages.
 */
export function ReviewDiv({
    itemId,
    priorityReviewId,
}: {
    itemId: number;
    priorityReviewId: number;
}) {
    const [reviews, setReviews] = useState<Review[] | undefined>();

    const popup = usePopup()!;

    useEffect(() => {
        getItemReviews(itemId).then((response) => {
            if (!response.data || response.isError) {
                popup(
                    `Error ${response.status}: Error fetching reviews - ${response.msg}`,
                );
                setReviews([]);
            } else {
                setReviews(response.data);
            }
        });
    }, []);

    // TODO: implement paginate too
    return (
        <Box width="100%">
            {/* <ReviewForm itemId={itemId} setReviews={setReviews} /> */}
            <ReviewDisplay
                reviews={reviews}
                setReviews={setReviews}
                priorityReviewId={priorityReviewId}
            />
        </Box>
    );
}
