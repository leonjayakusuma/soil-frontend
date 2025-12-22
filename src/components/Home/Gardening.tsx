import ParallaxPage from "@/shared/ParallaxPage";
import gardening from "@/assets/gardening.jpg";
import waterdrop from "@/assets/waterdrop.png";
import sun from "@/assets/sun.png";
import soil from "@/assets/soil.png";
import pest from "@/assets/pest.png";
import season from "@/assets/season.png";
import prune from "@/assets/prune.png";
import { Box, Stack, Typography } from "@mui/material";

type TipType = {
    img: string;
    name: string;
    desc: string;
    perc?: string;
};

/**
 * The Gardening component is a functional component that displays a list of gardening tips.
 *  Each tip is represented by an object of type TipType, 
 * which includes an image, a name, a description, and an optional percentage string.
 *  The component imports several assets for the tips and uses Material-UI components for layout and typography.
 *  The tips are stored in a local array and are presumably rendered in the component's return statement,
 *  which is not shown in this excerpt.
 */
/** Displays all the gardening tips */
export function Gardening() {
    const tips: TipType[] = [
        {
            img: sun,
            name: "Sun Savvy",
            desc: "Research on the species of plant and the amount of sunlight it needs. Some plants need lesser sunlight.",
        },
        {
            img: waterdrop,
            name: "Water Wisely",
            desc: "Look up how much water is needed for that specific plant species. Too much of anything is good for nothing.",
        },
        {
            img: soil,
            name: "Soil Secrets",
            desc: "Don't overdose on fertlisers, and try to use organic compost more.",
            perc: "30%",
        },
        {
            img: pest,
            name: "Pest Patrol",
            desc: "Covering fruits with a polythene bag can not only keep pests away but can also be beneficial for the fruit as it traps in moisture needed.",
        },
        {
            img: season,
            name: "Seasonal Strategies",
            desc: "Make necessary adjustments to your gardening depending on the season.",
        },
        {
            img: prune,
            name: "Pruning Pro-tips",
            desc: "Pruning can help your plants not invade the space of other plants.",
        },
    ];

    return (
        <ParallaxPage img={gardening}>
            <Stack justifyContent={"center"} alignItems={"center"} pt={"100px"}>
                <Typography
                    variant="h2"
                    fontWeight={500}
                    mb={"60px"}
                    textAlign="center"
                >
                    Gardening Tips
                </Typography>
            </Stack>

            <Stack
                direction="row"
                flexWrap="wrap"
                rowGap={2}
                justifyContent="center"
            >
                {tips.map((tip) => (
                    <Tip key={tip.name} {...tip} />
                ))}
            </Stack>
        </ParallaxPage>
    );
}

function Tip({ img, name, desc, perc }: TipType) {
    const SIZE = 300;
    return (
        <Box
            sx={{
                borderRadius: "50%",
                overflow: "hidden",
                width: `${SIZE}px`,
                height: `${SIZE}px`,
                "@media (max-width: 425px)": {
                    margin: 2,
                },
                "@media (max-width: 375px)": {
                    width: `${SIZE - 25}px`,
                    height: `${SIZE - 25}px`,
                },
                transition: "transform 0.3s ease, box-shadow 0.3s ease",
                boxShadow: "0px 0px 25px 15px rgba(0,0,0,0.5)",
                border: "2px solid white",
                "&:hover": {
                    transform: "scale(1.1)",
                    boxShadow: "0px 8px 16px rgba(0, 0, 0, 0.5)",
                },
                position: "relative",
                margin: 5,
                backgroundColor: "primary.main",
                backgroundImage: `url(${img})`,
                backgroundPosition: "center",
                backgroundSize: `${perc ?? "50%"} auto`,
                backgroundRepeat: "no-repeat",
            }}
        >
            <Box
                sx={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: "rgba(0, 0, 0, 0.75)",
                    opacity: 0,
                    transition:
                        "opacity 0.3s ease, visibility 0.3s ease, border 0.3s ease",
                    "&:hover": {
                        opacity: 1,
                    },
                }}
            >
                <Typography
                    variant="h6"
                    textTransform="uppercase"
                    sx={{
                        color: "white",
                        marginBottom: 1,
                        zIndex: 1000,
                    }}
                >
                    {name}
                </Typography>
                <Typography
                    variant="body2"
                    sx={{ color: "white", textAlign: "center", padding: 1 }}
                >
                    {desc}
                </Typography>
            </Box>
        </Box>
    );
}
