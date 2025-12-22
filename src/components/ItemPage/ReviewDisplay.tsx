import { useEffect, useMemo, useState } from "react";
import {
    Button,
    TextField,
    Paper,
    List,
    ListItem,
    ListItemText,
    ListItemAvatar,
    Avatar,
    Rating,
    Stack,
    Link,
    Typography,
    Pagination,
    IconButton,
    Box,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import { Review } from "@shared/types";
import LoadingPage from "@/shared/LoadingPage";
import { getSOILInfo } from "@/SoilInfo";
import { Link as RouterLink } from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import { ReviewTxt } from ".";
import { usePopup } from "@/shared/Popup";
import { editReview, deleteReview as deleteReviewAPI } from "@/api";

/**
 * The ReviewDisplay component is a functional component that takes in an array of reviews,
 *  a function to update the reviews, and a priority review ID as props. It uses various imports such as Material-UI icons,
 *  a custom hook for managing popups, and API functions for editing and deleting reviews.
 *  This component is responsible for displaying each review in the reviews array and
 *  providing functionality for editing and deleting reviews.
 */
export function ReviewDisplay({
    reviews,
    setReviews,
    priorityReviewId,
}: {
    reviews?: Review[];
    setReviews: (reviews: Review[]) => void;
    priorityReviewId: number;
}) {
    const [page, setPage] = useState(1);
    const [jumpPage, setJumpPage] = useState(1);
    const [priorityReviewEl, setPriorityReviewEl] =
        useState<HTMLDivElement | null>(null);
    const [editingReviewId, setEditingReviewId] = useState<number>(-1);
    const [editedReviewText, setEditedReviewText] = useState<string>("");
    const [editedRating, setEditedRating] = useState<number>(-1);
    const popup = usePopup()!;

    const userId = useMemo(() => getSOILInfo().userInfo?.userId ?? -1, []);

    useEffect(() => {
        if (priorityReviewEl) {
            priorityReviewEl.scrollIntoView({
                behavior: "smooth",
            });
        }
    }, [priorityReviewEl]);

    const reviewsPerPage = 10;
    const count = Math.ceil((reviews?.length ?? 0) / reviewsPerPage);

    const { prioritizedReviews, priorityReviewIndex } = useMemo(() => {
        let priorityReviewIndex = -1;
        let prioritizedReviews = reviews ? [...reviews] : [];

        if (reviews) {
            if (userId >= -1) {
                // For each review which has the userId, move it to the start of the array
                prioritizedReviews = prioritizedReviews.sort((a, b) => {
                    if (a.userId === userId) {
                        return -1;
                    }
                    if (b.userId === userId) {
                        return 1;
                    }
                    return 0;
                });
            }
            if (priorityReviewId >= 1) {
                // Go through the reviews and put the review with the priorityReviewId right at the start of the array
                priorityReviewIndex = reviews.findIndex(
                    (review) => review.id === priorityReviewId,
                );

                if (priorityReviewIndex !== -1) {
                    const priorityReview = reviews[priorityReviewIndex];
                    prioritizedReviews.splice(priorityReviewIndex, 1);
                    prioritizedReviews.unshift(priorityReview);
                }
            }
        }

        return { prioritizedReviews, priorityReviewIndex };
    }, [reviews, priorityReviewId]);

    const displayedReviews = useMemo(() => {
        return prioritizedReviews.slice(
            (page - 1) * reviewsPerPage,
            page * reviewsPerPage,
        );
    }, [prioritizedReviews, page, reviewsPerPage]);

    if (reviews === undefined) {
        return <LoadingPage height="100%" />;
    }

    if (reviews.length === 0) {
        return (
            <Paper sx={{ p: 2, m: 2, textAlign: "center", width: "100%" }}>
                No reviews yet. Be the first to review this item!
            </Paper>
        );
    }

    return (
        <>
            <List sx={{ mt: 2 }}>
                {displayedReviews.map((review, index) => (
                    <Paper
                        sx={{
                            my: 1,
                            p: 1,
                            backgroundColor:
                                index === 0 &&
                                    priorityReviewIndex !== -1 &&
                                    page === 1
                                    ? "lightgreen"
                                    : review.userId === userId
                                        ? "grey"
                                        : "white",
                        }}
                        key={index}
                        ref={
                            index === 0 &&
                                priorityReviewIndex !== -1 &&
                                page === 1
                                ? (el) => setPriorityReviewEl(el)
                                : null
                        }
                    >
                        <ListItem
                            key={index}
                            alignItems="flex-start"
                            sx={{ display: "flex", alignItems: "center" }}
                        >
                            {editingReviewId === review.id &&
                                !review.isDeleted ? (
                                <Box width={"100%"}>
                                    <Stack
                                        direction={"row"}
                                        justifyContent={"space-between"}
                                        alignItems={"center"}
                                        sx={{
                                            "@media (max-width: 500px)": {
                                                flexDirection: "column",
                                                alignItems: "flex-start",
                                                gap: "10px",
                                            },
                                        }}
                                        mb={1}
                                    >
                                        <Link
                                            component={RouterLink}
                                            to={`/user?userId=${review.userId}`}
                                            style={{
                                                textDecoration: "none",
                                                color: "inherit",
                                            }}
                                            target="_blank"
                                            sx={{
                                                textDecoration: "none",
                                                color: "inherit",
                                                fontWeight: "bold",
                                                whiteSpace: "nowrap",
                                                overflow: "hidden",
                                                textOverflow: "ellipsis",
                                                maxWidth: "15ch",
                                            }}
                                        >
                                            <Stack
                                                direction="row"
                                                alignItems="center"
                                            >
                                                <ListItemAvatar>
                                                    <Avatar>
                                                        <PersonIcon />
                                                    </Avatar>
                                                </ListItemAvatar>
                                                {review.userName}
                                            </Stack>
                                        </Link>
                                        <Rating
                                            value={
                                                editedRating >= 0
                                                    ? editedRating
                                                    : review.rating
                                            }
                                            onChange={(_, newValue) =>
                                                setEditedRating(
                                                    newValue ?? review.rating,
                                                )
                                            }
                                            size="large"
                                            sx={{
                                                verticalAlign: "text-bottom",
                                            }}
                                        />
                                    </Stack>
                                    <TextField
                                        fullWidth
                                        multiline
                                        rows={4}
                                        variant="outlined"
                                        value={editedReviewText}
                                        onChange={(e) =>
                                            setEditedReviewText(e.target.value)
                                        }
                                        sx={{ mb: 2 }}
                                    />
                                    <Stack
                                        direction="row"
                                        spacing={1}
                                        justifyContent="flex-end"
                                    >
                                        <IconButton
                                            onClick={() => cancelEdit()}
                                        >
                                            <CloseIcon />
                                        </IconButton>
                                        <IconButton
                                            onClick={() =>
                                                confirmEdit(review.id)
                                            }
                                        >
                                            <CheckIcon />
                                        </IconButton>
                                    </Stack>
                                </Box>
                            ) : (
                                <ListItemText
                                    primary={
                                        <Stack
                                            direction={"row"}
                                            justifyContent={"space-between"}
                                            alignItems={"center"}
                                            sx={{
                                                "@media (max-width: 500px)": {
                                                    flexDirection: "column",
                                                    alignItems: "flex-start",
                                                    gap: "10px",
                                                },
                                            }}
                                            mb={1}
                                        >
                                            <Link
                                                component={RouterLink}
                                                to={`/user?userId=${review.userId}`}
                                                style={{
                                                    textDecoration: "none",
                                                    color: "inherit",
                                                }}
                                                target="_blank"
                                                sx={{
                                                    textDecoration: "none",
                                                    color: "inherit",
                                                    fontWeight: "bold",
                                                    whiteSpace: "nowrap",
                                                    overflow: "hidden",
                                                    textOverflow: "ellipsis",
                                                    maxWidth: "15ch",
                                                }}
                                            >
                                                <Stack
                                                    direction="row"
                                                    alignItems="center"
                                                >
                                                    <ListItemAvatar>
                                                        <Avatar>
                                                            <PersonIcon />
                                                        </Avatar>
                                                    </ListItemAvatar>
                                                    {review.userName}
                                                </Stack>
                                            </Link>
                                            <Rating
                                                value={review.rating}
                                                readOnly
                                                size="large"
                                                sx={{
                                                    verticalAlign:
                                                        "text-bottom",
                                                }}
                                            />
                                        </Stack>
                                    }
                                    secondary={
                                        <ReviewTxt
                                            reviewTxt={review.reviewTxt ?? ""}
                                            isDeleted={review.isDeleted}
                                        />
                                    }
                                    sx={{ marginLeft: 1 }}
                                />
                            )}
                        </ListItem>
                        <Stack
                            direction={"row"}
                            justifyContent={"space-between"}
                            alignItems={"center"}
                            ml={1}
                        >
                            <Typography
                                variant="body1"
                                display="block"
                                color={"black"}
                            >
                                {new Date(
                                    review.dateCreated,
                                ).toLocaleDateString("en-GB", {
                                    day: "2-digit",
                                    month: "long",
                                    year: "numeric",
                                })}
                            </Typography>
                            {review.userId === userId &&
                                !review.isDeleted &&
                                editingReviewId !== review.id && (
                                    <Stack
                                        direction="row"
                                        spacing={1}
                                        justifyContent={"flex-end"}
                                    >
                                        <IconButton
                                            onClick={() => startEdit(review)}
                                        >
                                            <EditIcon />
                                        </IconButton>
                                        <IconButton
                                            onClick={() =>
                                                deleteReview(review.id)
                                            }
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                    </Stack>
                                )}
                        </Stack>
                    </Paper>
                ))}
            </List>
            <Paper sx={{ my: 1, p: 1 }}>
                <Pagination
                    count={count}
                    page={page}
                    onChange={(_, newPage) => setPage(newPage)}
                    sx={{ display: "flex", justifyContent: "center", mb: 1 }}
                />
                <Stack direction="row" spacing={2} justifyContent="center">
                    <TextField
                        label="Go to page"
                        value={jumpPage}
                        onChange={(e) => {
                            const parsedValue = parseInt(e.target.value, 10);
                            if (
                                !isNaN(parsedValue) &&
                                parsedValue > 0 &&
                                parsedValue <= count
                            ) {
                                setJumpPage(parsedValue);
                            }
                        }}
                        type="number"
                        sx={{ width: "120px" }}
                    />
                    <Button
                        onClick={() => setPage(jumpPage)}
                        variant="outlined"
                    >
                        Jump
                    </Button>
                </Stack>
            </Paper>
        </>
    );

    function startEdit(review: Review) {
        setEditingReviewId(review.id);
        setEditedReviewText(review.reviewTxt ?? "");
        setEditedRating(review.rating);
    }

    function cancelEdit() {
        setEditingReviewId(-1);
        setEditedReviewText("");
        setEditedRating(5);
    }

    function confirmEdit(reviewId: number) {
        editReview(reviewId, editedReviewText, editedRating).then(
            (response) => {
                if (response.isError) {
                    popup(
                        `Error ${response.status}: Error editing review - ${response.msg}`,
                    );
                } else {
                    const updatedReviews = (reviews ?? []).map((review) =>
                        review.id === reviewId
                            ? {
                                ...review,
                                reviewTxt: editedReviewText,
                                rating: editedRating,
                            }
                            : review,
                    );
                    if (updatedReviews) {
                        setReviews(updatedReviews);
                    }
                    cancelEdit();
                    popup("Review edited successfully");
                }
            },
        );
    }

    function deleteReview(reviewId: number) {
        deleteReviewAPI(reviewId).then((response) => {
            if (response.isError) {
                popup(
                    `Error ${response.status}: Error deleting review - ${response.msg}`,
                );
            } else {
                const updatedReviews = reviews?.filter(
                    (review) => review.id !== reviewId,
                );
                if (updatedReviews) {
                    setReviews(updatedReviews);
                }
                popup("Review deleted successfully");
            }
        });
    }
}
