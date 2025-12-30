import ParallaxPage from "@/shared/ParallaxPage";
import plants1 from "@/assets/plants1.jpg";
import ItemCard from "@/shared/ItemCard";
import Stack from "@mui/material/Stack";
import { Typography } from "@mui/material";
import { getSOILInfo } from "@/SoilInfo";
import { useEffect, useMemo, useState } from "react";
import { getSpecials } from "@/api";
import { Item } from "@shared/types";

/**
 * The Specials component is a functional component that displays all the special items.
 * It takes a scrollRef prop, which is a reference to a scrollable div.
 * The component uses React's useState and useEffect hooks to manage the state of the specialsArray and to fetch the special items when the component mounts.
 * It uses the getSpecials API function to fetch the data.
 * If there's no data in the response, it throws an error with the message from the response.
 * The component also imports several assets and components, including an image, the ItemCard component, Material-UI components, and the getSOILInfo function.
 */
/** Displays all the specials */
export function Specials({
    scrollRef,
}: {
    scrollRef: React.RefObject<HTMLDivElement>;
}) {
    const [specialsArray, setSpecialsArray] = useState<Item[]>([]);

    useEffect(() => {
        getSpecials()
            .then((data) => {
                if (!data.data) {
                    throw new Error(data.msg);
                }
                setSpecialsArray(data.data);
            })
            .catch((error) => console.error(error));
    }, []);

    return (
        <ParallaxPage img={plants1}>
            <Stack
                justifyContent={"center"}
                alignItems={"center"}
                py={"100px"}
                ref={scrollRef}
            >
                <Typography
                    variant="h2"
                    component={"h1"}
                    fontWeight={500}
                    mb={"60px"}
                >
                    Specials
                </Typography>
                <Stack
                    direction="row"
                    flexWrap="wrap"
                    rowGap={2}
                    justifyContent="center"
                >
                    {specialsArray.map((item) => (
                        <ItemCard key={item.id} {...item} />
                    ))}
                </Stack>
            </Stack>
        </ParallaxPage>
    );
}
