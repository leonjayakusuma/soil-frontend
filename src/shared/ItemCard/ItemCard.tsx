import { Item } from "@shared/types";
import {
    Card,
    CardMedia,
    CardContent,
    Typography,
    SxProps,
    Theme,
    Stack,
    Box,
} from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { Price, Btns, DiscountAndRating } from "@/shared/ItemCard";
import queryString from "query-string";
import {
    defaultSort,
    defaultFilters,
    MenuOptions,
    ParsedMenuOptions,
} from "@/components/Shop/SearchBar";
import { Link as RouterLink } from "react-router-dom";

/**
ItemCard Component

This component displays an individual item card in the shop. It includes item details like 
title, price, tags, discount, description, and reviews. It also handles hover state for the card.
 */
export default function ItemCard(item: Item) {
    const [isHovered, setIsHovered] = useState(false);

    const {
        id,
        title,
        price,
        tags,
        discount,
        desc: descFull,
        reviewRating,
        reviewCount,
        isSpecial,
        imgUrl
    } = item;

    const sx: SxProps<Theme> = {
        maxWidth: 345,
        transition: "transform 0.3s ease-in",
        m: 1,
        "&:hover": {
            transform: "scale(1.15)",
            zIndex: 10,
        },
    };

    const [desc, setDesc] = useState("");
    const [descHeight, setDescHeight] = useState(0);

    const duration = 25;
    const heightTransitionDuration = 0.3;

    const descRef = useRef<HTMLParagraphElement | null>(null);

    useEffect(() => {
        const el = descRef.current;

        const parentWidth = el?.parentElement?.offsetWidth;

        if (!el || !parentWidth) return;

        if (isHovered) {
            const clone = el.cloneNode(true) as HTMLElement;

            clone.style.visibility = "hidden";
            clone.style.position = "absolute";
            clone.style.width = `${parentWidth}px`;
            clone.style.height = "auto"; // https://stackoverflow.com/a/15943054
            clone.innerText = descFull || "";

            document.body.appendChild(clone);
            setDescHeight(clone.offsetHeight);
            document.body.removeChild(clone);

            const id = setInterval(() => {
                setDesc((prev) => {
                    const currentDesc = prev || "";
                    const fullDesc = descFull || "";
                    if (currentDesc.length < fullDesc.length) {
                        return currentDesc + fullDesc[currentDesc.length];
                    }
                    clearInterval(id);
                    return currentDesc;
                });
            }, duration);

            return () => clearInterval(id);
        } else if (desc !== "") {
            const id = setInterval(() => {
                setDesc((prev) => {
                    const currentDesc = prev || "";
                    if (currentDesc.length > 0) {
                        return currentDesc.substring(0, currentDesc.length - 1);
                    }
                    clearInterval(id);
                    return currentDesc;
                });
            }, duration / 2);

            const id2 = setTimeout(
                () => setDescHeight(0),
                heightTransitionDuration * 1000,
            );

            return () => {
                clearInterval(id);
                clearTimeout(id2);
                setDescHeight(0);
            };
        }
    }, [isHovered]);

    const isMeatOrPoultry = tags.includes("meat") || tags.includes("poultry");

    return (
        <Card
            sx={sx}
            onMouseEnter={() => {
                setIsHovered(true);
            }}
            onMouseLeave={() => {
                setIsHovered(false);
            }}
            raised={isHovered}
        >
            <CardMedia
                component="img"
                sx={{
                    width: "345px",
                    height: "250px",
                }}
                image={imgUrl && imgUrl != '' ? imgUrl : `/itempics/${id}.jpg`}
                alt={`${title} image`}
            />
            <CardContent sx={{ p: "25px" }}>
                <Stack rowGap={0.4}>
                    <Stack
                        direction="row"
                        justifyContent="end"
                        color="white"
                        fontSize={13}
                    >
                        {isSpecial && <Special />}
                        {isMeatOrPoultry && <FreeRange />}
                        <Organic />
                    </Stack>
                    {/* Using HTML button instead of MUI because I want no extra styling */}
                    <Typography
                        variant="h4"
                        overflow="hidden"
                        component={RouterLink}
                        to={`/item?itemId=${id}`}
                        textAlign="left"
                        marginY={"10px"}
                        sx={{
                            WebkitLineClamp: "2",
                            WebkitBoxDirection: "vertical",
                        }}
                    >
                        {title}
                    </Typography>
                    <Tags tags={tags} />
                    <Typography
                        ref={descRef}
                        variant="body2"
                        color="text.secondary"
                        id={id.toString()}
                        sx={{
                            transition: `height ${heightTransitionDuration}s ease-out`,
                        }}
                        height={descHeight}
                    >
                        {desc}
                    </Typography>
                    <Price price={price} discount={discount} />
                    <DiscountAndRating
                        discount={discount}
                        reviewCount={reviewCount}
                        reviewRating={reviewRating}
                    />
                    <Btns
                        isHovered={isHovered}
                        transitionDuration={heightTransitionDuration}
                        item={item}
                    />
                </Stack>
            </CardContent>
        </Card>
    );
}

export function Tags({ tags }: { tags: string[] }) {
    return (
        <Stack direction="row" color="white" fontSize={10}>
            {tags.map((tag) => (
                <Tag text={tag} key={tag} />
            ))}
        </Stack>
    );
}

export function Special() {
    return <InfoTag bgCol="#7393B3" text="special" />;
}

export function FreeRange() {
    return <InfoTag bgCol="#097969" text="free-range" />;
}

export function Organic() {
    return <InfoTag bgCol="#FFBF00" text="organic" />;
}

function InfoTag({ bgCol, text }: { bgCol: string; text: string }) {
    return (
        <Box
            sx={{ backgroundColor: bgCol }}
            px={0.2}
            ml={0.2}
            fontWeight={500}
            letterSpacing={1}
            borderRadius={0.5}
        >
            {text.toUpperCase()}
        </Box>
    );
}

function Tag({ text }: { text: string }) {
    function handleClick() {
        const defaultParams: Omit<MenuOptions, "q"> = {
            sort: defaultSort,
            filters: defaultFilters,
        };

        const params: Omit<MenuOptions, "q"> = {
            ...defaultParams,
            filters: {
                ...defaultParams.filters,
                tags: [text.toLowerCase()],
            },
        };

        const parsedParams: Omit<ParsedMenuOptions, "q"> = {
            sort: "",
            filters: "",
        };
        for (const [key, value] of Object.entries(params)) {
            parsedParams[key as keyof Omit<ParsedMenuOptions, "q">] =
                JSON.stringify(value);
        }

        const urlParams = queryString.stringify({ ...parsedParams, q: "" });


        window.open(`/shop?${urlParams}`, "_blank");
    }
    return (
        <Box
            sx={{ backgroundColor: "grey" }}
            px={0.2}
            ml={0.1}
            fontWeight={500}
            letterSpacing={1}
            borderRadius={0.4}
            fontSize={13}
        >
            {/* using html button instead of MUI because I want no extra styling */}
            <button onClick={handleClick}>{text.toLowerCase()}</button>
        </Box>
    );
}
