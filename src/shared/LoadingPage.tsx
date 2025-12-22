import { Stack, CircularProgress } from "@mui/material";

/* Loading page component which makes it easier to display loading pages */
export default function LoadingPage({ height = "100vh" }: { height?: string }) {
    return (
        <Stack justifyContent={"center"} alignItems={"center"} height={height}>
            <CircularProgress />
        </Stack>
    );
}
