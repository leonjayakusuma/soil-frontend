import Center from "@/shared/Center";
import { AuthForm, AuthFormPropsType } from "@/components/Auth";
import { Box, Paper, Stack } from "@mui/material";
import { theme } from "@/App";

/**
 * The Auth component is a reusable functional component that is used for various forms in the application.
 * It takes a background source (bgSrc) and restProps, which are of type AuthFormPropsType.
 * The component imports several components from Material-UI, including Box, Paper, and Stack,
 * as well as the theme from the App component. 
 * The component returns a Stack component with a custom style that sets the minimum height to 100vh using a CSS variable.
 * The direction of the Stack is set to "row" and the alignment of its items is set to "center".
 * The actual form and the background image are not shown in this excerpt.
 */
/** Reusable component for many forms */
export default function Auth({
    bgSrc,
    ...restProps
}: {
    bgSrc: string;
} & AuthFormPropsType) {
    return (
        <>
            <Stack
                sx={{
                    // Gotta use this goofy method because jsx doesn't allow duplicate poperties
                    "--height-fallback": "100svh",
                    minHeight: "var(--height-fallback, 100vh)",
                }}
                direction="row"
                alignItems="center"
                justifyContent="center"
            >
                <BgImage src={bgSrc} />
                <AuthBox {...restProps} />
            </Stack>
        </>
    );
}

// Using this to sort of give a filter instead of the conventional method
function BgImage({ src }: { src: string }) {
    return (
        <Box zIndex={-1}>
            <Box
                component="img"
                src={src}
                alt="background Image"
                sx={{
                    objectFit: "cover",
                }}
                position="fixed"
                top={0}
                left={0}
                height="100%"
                width="100%"
                fontSize={theme.fontSize(1.5)}
            ></Box>
            <Box
                sx={{
                    background: "rgba(255, 255, 255, 0.25)",
                }}
                position="fixed"
                top={0}
                left={0}
                height="100%"
                width="100%"
            ></Box>
        </Box>
    );
}

function AuthBox(props: AuthFormPropsType) {
    return (
        <Center>
            <Paper
                sx={{
                    boxShadow: "0px 0px 15px 10px rgba(0,0,0,0.5)",
                    borderRadius: "10px",
                    padding: 2,
                }}
            >
                <AuthForm {...props} />
            </Paper>
        </Center>
    );
}
