import { Typography } from "@mui/material";
import { useEffect, useRef, useState } from "react";

/**
 * The ReviewTxt component is a functional component that takes a review text and a boolean indicating whether the review is deleted as props.
 *  It uses React's useState hook to manage the state of whether the review text is expanded or should be truncated.
 *  It also uses the useRef hook to reference the text element. 
 * The component provides a function to toggle the expanded state of the review text.
 *  It sets a maximum height in pixels for the review text and a maximum character limit if the text is truncated.
 *  If the review is deleted, the review text is replaced with a deletion message.
 */
export function ReviewTxt({
    reviewTxt,
    isDeleted,
}: {
    reviewTxt: string;
    isDeleted: boolean;
}) {
    const [isExpanded, setIsExpanded] = useState(false);
    const [shouldTruncate, setShouldTruncate] = useState(false);
    const textRef = useRef<HTMLSpanElement>(null);

    const toggleExpand = () => setIsExpanded((isExpanded) => !isExpanded);

    const maxHeightInPx = 300;
    const maxCharLimitIfTruncated = 200;

    reviewTxt = isDeleted
        ? "[**** This review has been deleted by the admin ****]"
        : reviewTxt;

    useEffect(() => {
        const textElement = textRef.current;
        if (textElement) {
            const isOverflowing = textElement.offsetHeight > maxHeightInPx;
            setShouldTruncate(isOverflowing);
        }
    }, [reviewTxt]);

    const displayText =
        isExpanded || !shouldTruncate
            ? reviewTxt
            : `${reviewTxt.substring(0, maxCharLimitIfTruncated)}...`;

    if (isDeleted) {
        return (
            <Typography
                variant="h5"
                sx={{
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                }}
            >
                {displayText}
            </Typography>
        );
    } 5
    return (
        <>
            <span
                ref={textRef}
                style={{
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                }}
            >
                {displayText}
            </span>
            {shouldTruncate && (
                <button
                    onClick={toggleExpand}
                    style={{ marginLeft: "10px", color: "black" }}
                >
                    {isExpanded ? "See Less" : "See More"}
                </button>
            )}
        </>
    );
}
