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
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { Opacity } from "@mui/icons-material";

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
        alignSelf: "flex-start", // Prevent card from stretching when other cards expand
        "&:hover": {
            transform: "scale(1.05)",
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
            clone.style.height = "auto";
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

    return (
        <Link
            to={`/item?itemId=${id}`}
            style={{
                textDecoration: "none",
                color: "inherit",
            }}
            onClick={(e) => {
                // Don't navigate if clicking on a button
                const target = e.target as HTMLElement;
                if (target.closest('button')) {
                    e.preventDefault();
                }
            }}
        >
            <Card
                sx={{
                    ...sx,
                    cursor: "pointer",
                }}
                onMouseEnter={() => {
                    setIsHovered(true);
                }}
                onMouseLeave={() => {
                    setIsHovered(false);
                }}
                raised={isHovered}
                style={{ width: "188px" }}
                component={motion.div}
                initial={{opacity: 0}}
                animate={{opacity: 1}}
                transition={{duration: 1.5}}
            >
                <CardMedia
                    component="img"
                    sx={{
                        width: "188px",
                        height: "188px",
                    }}
                    image={imgUrl && imgUrl != '' ? imgUrl : `/itempics/${id}.jpg`}
                    alt={`${title} image`}
                />
                <CardContent sx={{ p: "10px" }} >
                    <Stack rowGap={0.4}>
                        <Typography
                            variant="h5"
                            textAlign="left"
                            fontSize={14}
                            sx={{
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                            }}
                        >
                            {title}
                        </Typography>
                        <Stack direction="row" justifyContent="space-between">
                            <Price price={price} discount={discount} />
                            <Box
                                sx={{ backgroundColor: "#228B22" }}
                                px={0.4}
                                mt={0.1}
                                fontWeight={500}
                                letterSpacing={1}
                                borderRadius={0.4}
                                fontSize={10}
                            >
                                {`SAVE ${discount}%`}
                            </Box>        
                        </Stack>
                        <Tags tags={tags} />
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
        </Link>
    );
}

export function Tags({ tags }: { tags: string[] }) {
    return (
        <Stack direction="row" flexWrap="wrap" color="white" fontSize={10} gap={0.1}>
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
            fontSize={10}
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
            fontWeight={400}
            borderRadius={0.4}
            fontSize={10}
        >
            {/* using html button instead of MUI because I want no extra styling */}
            <button onClick={handleClick}>{text.toLowerCase()}</button>
        </Box>
    );
}
