import {
    Button,
    Link,
    List,
    ListItem,
    ListItemText,
    Pagination,
    Paper,
    Rating,
    Stack,
    TextField,
    Typography,
} from "@mui/material";
import { UserReview } from "@shared/types";
import { ReviewTxt } from "@/components/ItemPage";
import { useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import { theme } from "@/App";

export function UserReviews({ reviews }: { reviews: UserReview[] }) {
    const [page, setPage] = useState(1);
    const [jumpPage, setJumpPage] = useState(1);

    const reviewsPerPage = 10;
    const count = Math.ceil(reviews.length / reviewsPerPage);

    function handleChangePage(_: React.ChangeEvent<unknown>, newPage: number) {
        setPage(newPage);
    }

    const displayedReviews = reviews.slice(
        (page - 1) * reviewsPerPage,
        page * reviewsPerPage,
    );

    if (reviews.length === 0) {
        return (
            <Paper sx={{ my: 1, p: 1 }} elevation={10}>
                This user hasn't posted any reviews
            </Paper>
        );
    }

    return (
        <Paper
            sx={{ p: 2, mt: 2, backgroundColor: theme.palette.secondary[200] }}
        >
            <Typography variant="h4" textAlign={"center"}>
                Reviews posted
            </Typography>
            <List>
                {displayedReviews.map((review, index) => (
                    <Paper sx={{ my: 1, p: 1 }} key={index} elevation={10}>
                        <ListItem
                            key={index}
                            alignItems="flex-start"
                            sx={{ display: "flex", alignItems: "center" }}
                        >
                            <ListItemText
                                primary={
                                    <Stack
                                        direction={"row"}
                                        justifyContent={"space-between"}
                                        sx={{
                                            "@media (max-width: 500px)": {
                                                flexDirection: "column",
                                            },
                                        }}
                                    >
                                        <Link
                                            component={RouterLink}
                                            to={`/item?itemId=${review.itemId}&reviewId=${review.reviewId}`}
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
                                            {review.itemName}
                                        </Link>
                                        <Rating
                                            value={review.rating}
                                            readOnly
                                            size="large"
                                            sx={{
                                                ml: 1,
                                                verticalAlign: "text-bottom",
                                            }}
                                        />
                                    </Stack>
                                }
                                secondary={
                                    <>
                                        <ReviewTxt
                                            reviewTxt={review.reviewTxt ?? ""}
                                            isDeleted={review.isDeleted}
                                        />
                                        <Typography
                                            component={"span"}
                                            variant="body1"
                                            display="block"
                                            color={"black"}
                                            mt={1}
                                        >
                                            {new Date(
                                                review.dateCreated,
                                            ).toLocaleDateString("en-GB", {
                                                day: "2-digit",
                                                month: "long",
                                                year: "numeric",
                                            })}
                                        </Typography>
                                    </>
                                }
                                sx={{ marginLeft: 1 }}
                            />
                        </ListItem>
                    </Paper>
                ))}
            </List>
            <Paper sx={{ my: 1, p: 1 }}>
                <Pagination
                    count={count}
                    page={page}
                    onChange={handleChangePage}
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
        </Paper>
    );
}
