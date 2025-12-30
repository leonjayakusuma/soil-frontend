import ParallaxPage from "@/shared/ParallaxPage";
import bg_vid from "@/assets/bg vid.mp4";
import homepagefruits2 from "@/assets/homepagefruits2.png";
import { Box, Button, Typography, useMediaQuery } from "@mui/material";

/**
 * The About component is a functional component that takes a reference to a specialsRef div as a prop.
 * It uses the useMediaQuery hook from Material-UI to determine if the screen width is less than 1500px,
 * and if so, sets the isColumn state to true. 
 * The component returns a ParallaxPage component with a background video and a Box component as its child.
 * The Box component is styled to display its children in a flex container,
 * with the direction of the flex items determined by the isColumn state. 
 * If isColumn is true, the flex items are stacked vertically; otherwise, they are arranged horizontally.
 */
export function About({
    specialsRef,
}: {
    specialsRef: React.RefObject<HTMLDivElement>;
}) {
    const isColumn = useMediaQuery("(max-width: 1500px)");

    return (
        <ParallaxPage
            vid={bg_vid}
            sx={{
                display: "flex",
            }}
        >
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                    flexGrow: 1,
                    margin: "100px",
                    "@media (max-width: 600px)": {
                        margin: "10px",
                        marginBottom: "50px",
                    },
                }}
            >
                <Box
                    width={"50%"}
                    display={"flex"}
                    sx={{
                        flexDirection: "column",
                        alignItems: "start",
                        "@media (max-width: 1500px)": {
                            width: "100%",
                            alignItems: "center",
                        },
                    }}
                >
                    <Typography
                        variant={isColumn ? "h1" : "h2"}
                        component={"h1"}
                        fontStyle="italic"
                        mb={"30px"}
                        sx={{
                            "@media (max-width: 1300px)": {
                                fontSize: "60px",
                            },
                            "@media (max-width: 800px)": {
                                marginTop: "60px",
                            },

                            "@media (max-width: 400px)": {
                                fontSize: "50px",
                            },
                        }}
                        textAlign={isColumn ? "center" : "start"}
                        fontWeight={500}
                    >
                        Sourced Organically, Inherently Local
                    </Typography>
                    {isColumn && <Img />}
                    <br />
                    <Typography
                        variant="h5"
                        fontStyle="italic"
                        marginY={"20px"}
                    >
                        That's what soil stands for. At SOIL we guarantee
                        organic food bought directly from local farmers. We
                        believe that the best food is the one that is grown
                        closest to you. We are committed to providing the best
                        quality food sourced from local Australian farms, as we
                        are proud to support local Austrlian farmers. We support
                        healthy cooking and eating so we provide you with
                        gardening tips so you can get started on your own
                        organic garden.
                    </Typography>
                    <Button
                        variant="contained"
                        onClick={handleScrollTo}
                        sx={{
                            mt: "50px",
                            transition: "transform 0.3s ease",
                            "&:hover": {
                                transform: "scale(1.1)",
                            },
                            padding: "20px",
                        }}
                    >
                        <Typography
                            variant="h5"
                            fontFamily={`"Open Sans", sans-serif`}
                            fontWeight={700}
                        >
                            Shop Specials
                        </Typography>
                    </Button>
                </Box>
                {!isColumn && <Img />}
            </Box>
        </ParallaxPage>
    );

    function handleScrollTo() {
        specialsRef.current?.scrollIntoView({
            behavior: "smooth",
        });
    }
}

function Img() {
    return (
        <Box
            sx={{
                flexGrow: 1,
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
            }}
        >
            <Box
                component={"img"}
                src={homepagefruits2}
                alt="organic food image"
                sx={{
                    width: "100%",
                    height: "auto",

                    "@media (max-width: 1500px)": {
                        width: "80%",
                    },
                }}
            />
        </Box>
    );
}
