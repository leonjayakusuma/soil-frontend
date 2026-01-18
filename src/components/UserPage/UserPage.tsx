import {
    Res,
    followUser,
    getUserPageInfo,
    isFollowingUser,
    unfollowUser,
} from "@/api";
import ErrorPage from "@/shared/ErrorPage";
import LoadingPage from "@/shared/LoadingPage";
import { usePopup } from "@/shared/Popup";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { Box, Button, Paper, Stack, Typography } from "@mui/material";
import { UserPageInfo } from "@/types";
import queryString from "query-string";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { UserReviews } from ".";
import { getSOILInfo } from "@/SoilInfo";
import ParallaxPage from "@/shared/ParallaxPage";
import plant1 from "@/assets/plants1.jpg";

export default function UserPage() {
    const location = useLocation();

    const isLoggedIn = !!getSOILInfo().userInfo;
    const loggedInUserId = getSOILInfo().userInfo?.userId ?? -1;

    const [response, setResponse] = useState<Res<UserPageInfo> | undefined>();
    const [isFollowingResponse, setIsFollowingResponse] = useState<
        Res<boolean> | undefined
    >(
        isLoggedIn
            ? undefined
            : {
                  isError: false,
                  msg: "Not logged in",
                  status: 200,
                  data: false,
              },
    );
    const [userPageId, setUserPageId] = useState<number | undefined>();

    const popup = usePopup()!;

    useEffect(() => {
        const { userId } = queryString.parse(location.search);

        const numericId =
            typeof userId === "string" ? parseInt(userId, 10) : NaN;

        if (isNaN(numericId)) {
            setResponse({
                isError: true,
                msg: "id has to be number",
                status: 400,
            });
        } else {
            setUserPageId(numericId);
            if (isLoggedIn) {
                isFollowingUser(numericId).then((response) =>
                    setIsFollowingResponse(response),
                );
            }
            getUserPageInfo(numericId).then((response) =>
                setResponse(response),
            );
        }
    }, [location.search]);

    if (!response || isFollowingResponse === undefined) {
        return <LoadingPage />;
    }

    if (!response.data || response.isError) {
        // Just to be safe even though response.error will be true if response.data is undefined
        return <ErrorPage status={response.status} error={response.msg} />;
    }

    if (isFollowingResponse.data === undefined || isFollowingResponse.isError) {
        return (
            <ErrorPage
                status={isFollowingResponse.status}
                error={isFollowingResponse.msg}
            />
        );
    }
    return (
        <ParallaxPage img={plant1}>
            <Stack
                alignItems={"center"}
                sx={{
                    marginY: "150px",
                }}
            >
                <Box
                    mx={5}
                    sx={{
                        "@media (max-width: 1000px)": {
                            marginX: 2,
                        },
                    }}
                >
                    <Paper
                        elevation={3}
                        sx={{
                            p: "30px",
                            width: "750px",
                            margin: "auto",
                            "@media (max-width: 750px)": {
                                width: "100%",
                            },
                        }}
                    >
                        <Stack
                            direction={"row"}
                            justifyContent={"space-around"}
                            alignItems={"center"}
                            sx={{
                                "@media (max-width: 750px)": {
                                    flexDirection: "column",
                                    "& > *": {
                                        marginBottom: "50px",
                                    },
                                },
                            }}
                        >
                            <Box>
                                <AccountCircleIcon
                                    fontSize="large"
                                    sx={{ fontSize: "250px" }}
                                />
                                <Typography
                                    variant="h4"
                                    fontWeight={"bold"}
                                    textAlign={"center"}
                                    textOverflow={"ellipsis"}
                                    maxWidth={"15ch"}
                                    overflow={"hidden"}
                                    sx={{
                                        "@media (max-width: 400px)": {
                                            maxWidth: "10ch",
                                        },
                                    }}
                                >
                                    {response.data.name}
                                </Typography>
                            </Box>
                            <Stats
                                numReviews={response.data.numReviews}
                                meanRating={response.data.meanRating}
                                dateJoined={response.data.dateJoined}
                            />
                            {loggedInUserId !== userPageId && (
                                <Button
                                    variant="contained"
                                    onClick={handleFollowAndUnfollow}
                                    size="large"
                                >
                                    {isFollowingResponse.data
                                        ? "Unfollow"
                                        : "Follow"}
                                </Button>
                            )}
                        </Stack>
                    </Paper>
                    <UserReviews reviews={response.data.reviews} />
                </Box>
            </Stack>
        </ParallaxPage>
    );

    function handleFollowAndUnfollow() {
        if (!isLoggedIn) {
            window.open("/login", "_blank");
            return;
        }

        const statusStr = isFollowingResponse?.data ? "unfollow" : "follow";
        const fn = isFollowingResponse?.data ? unfollowUser : followUser;
        fn(userPageId!).then((response) => {
            if (response.isError) {
                popup(
                    `Could not ${statusStr}: Error: ${response.status} - ${response.msg}`,
                );
            } else {
                popup(`Successfully ${statusStr}ed user`);
                setIsFollowingResponse(
                    (response) =>
                        response && {
                            ...response,
                            data: !response.data,
                        },
                );
            }
        });
    }
}

function Stats({
    numReviews,
    meanRating,
    dateJoined,
}: {
    numReviews: number;
    meanRating: number;
    dateJoined: string;
}) {
    return (
        <Stack spacing={1}>
            <Typography variant="h6" display={"block"}>
                {numReviews} reviews posted
            </Typography>
            <Typography variant="h6" display={"block"}>
                {meanRating} mean rating
            </Typography>
            <Typography variant="h6" display={"block"}>
                Joined{" "}
                {new Date(dateJoined).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                })}
                {/* https://stackoverflow.com/a/18648314 */}
            </Typography>
        </Stack>
    );
}
