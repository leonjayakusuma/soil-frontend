import { Stack, Typography } from "@mui/material";

/* Error page component which makes it easier to display error pages */
export default function ErrorPage({
    status,
    error,
}: {
    status: number;
    error: string;
}) {
    return (
        <Stack
            justifyContent={"center"}
            alignItems={"center"}
            width={"100vw"}
            height={"100vh"}
        >
            <Typography variant="h1">Error: {status}</Typography>
            <Typography variant="h1">{error}</Typography>
        </Stack>
    );
}
