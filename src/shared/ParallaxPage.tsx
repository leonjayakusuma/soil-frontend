import { Box, SxProps, Theme } from "@mui/material";
import { Parallax } from "react-parallax";

/**
This component handles the rendering of a parallax page. It includes a Parallax component 
from 'react-parallax' for the parallax effect, and a Box component for the video background.

The component receives several props including img, vid, sx, and children. img is the 
background image for the parallax effect. vid is the video for the video background. 
sx is the styles for the component. children are any child components passed to the component.
 */
// https://codesandbox.io/p/sandbox/wedding-react-jb3hy
export default function ParallaxPage({
    img,
    vid,
    sx,
    children,
}: {
    img?: string;
    vid?: string;
    sx?: SxProps<Theme>;
    children: React.ReactNode;
}) {
    return (
        <Parallax
            strength={200}
            bgImage={img}
            bgImageStyle={{
                objectFit: "cover",
            }}
        >
            {vid && (
                // https://codesandbox.io/p/sandbox/parallax-video-background-xowd0
                <Box
                    sx={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        overflow: "hidden",
                        zIndex: -1,
                        "&::after": {
                            content: `""`,
                            position: "absolute",
                            top: 0,
                            left: 0,
                            width: "100%",
                            height: "100%",
                            backgroundColor: "rgba(0, 0, 0, 0.6)", // Black tint
                            backdropFilter: "blur(5px)",
                        },
                    }}
                >
                    <Box
                        component="video"
                        muted
                        autoPlay
                        loop
                        sx={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                        }}
                    >
                        <Box component="source" type="video/mp4" src={vid} />
                        Your browser doesn't support the HTML video tag
                    </Box>
                </Box>
            )}
            <Box sx={{ ...sx, minHeight: "100vh", width: "100vw" }}>
                {children}
            </Box>
        </Parallax>
    );
}
