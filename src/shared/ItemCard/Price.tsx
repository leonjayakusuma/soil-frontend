import { Stack, Typography, Box } from "@mui/material";
import { useCallback, useLayoutEffect, useRef, useState } from "react";

/**
 This component displays the price of an item with a discount. It calculates and displays 
 a cut line over the original price when a discount is applied.
 */
export function Price({
    price,
    discount,
}: {
    price: number;
    discount: number;
}) {
    const [angle, setAngle] = useState(0);
    const [len, setLen] = useState(0);

    const cutLineThickness = 5;

    /* Working implementation */
    /**
     * Right now I use a setTimeout to ensure that the font is loaded to get the accurate width
     * Another possible solution would be using document.fonts.load
     * That method would involve me calculating the fontSize instead of letting the theme media query handle
     * TODO: maybe try thinking of using it
     * Needless to say, that would be the best solution
     * However, setting a timeout combined with a transition also gives a nice animation effect
     * Since it's simpler and also pretty, I will be using that
     **/
    const temp = useRef<HTMLSpanElement | null>(null);

    useLayoutEffect(() => {
        setTimeout(() => {
            const node = temp.current;
            if (node) {
                const { width: w, height: h } = node.getBoundingClientRect();
                setAngle((-Math.atan(h / w) * 180) / Math.PI);
                const neededTanAlpha = Math.max(w / h, h / w);
                const thicknessReduction =
                    2 * cutLineThickness * neededTanAlpha;
                setLen(Math.sqrt(w * w + h * h) - thicknessReduction); // Pythogoras theorum
            }
        }, 100);
    }, []);

    // https://legacy.reactjs.org/docs/hooks-faq.html?source=post_page-----eb7c15198780--------------------------------#how-can-i-measure-a-dom-node
    const measuredRef = useCallback<(node: HTMLSpanElement | null) => void>(
        (node) => {
            temp.current = node;
            // if (node) {
            //     const { width: w, height: h } = node.getBoundingClientRect();
            //     setAngle((-Math.atan(h / w) * 180) / Math.PI);
            //     console.log({ w, h });
            //     const neededTanAlpha = Math.max(w / h, h / w);
            //     const thicknessReduction =
            //         2 * cutLineThickness * neededTanAlpha;
            //     setLen(Math.sqrt(w * w + h * h) - thicknessReduction); // Pythogoras theorum
            // }
        },
        [],
    );

    return (
        <Stack direction="row" marginY={"10px"} alignItems={"center"}>
            <Typography variant="h5" fontWeight={600}>
                {`A$ ${getFinalPrice(price, discount)}`}
            </Typography>
            <Box
                position="relative"
                ml={"20px"}
                borderRadius={0.5}
                sx={{
                    backgroundColor: "#B22222",
                }}
                px={0.5}
                py={0.2}
            >
                <Typography ref={measuredRef} variant="h5" fontWeight={600} color={"white"}>
                    <hr
                        style={{
                            position: "absolute",
                            margin: 0,
                            top: "50%",
                            left: "50%",
                            width: `calc(${len}px`,
                            height: `${cutLineThickness}px`,
                            backgroundColor: "#B22222",
                            border: "none",
                            transition: "transform 1s ease-in-out",
                            transform: `translate(-50%, -50%) rotate(${angle}deg)`,
                        }}
                    />
                    {`A$ ${price}`}
                    {/* {`A$ ${(price + 5).toFixed(2)}`} */}
                </Typography>
            </Box>
        </Stack>
    );
}

export function getFinalPrice(price: number, discount: number) {
    return round2dp(price * (1 - discount / 100));
}

function round2dp(num: number) {
    // https://stackoverflow.com/a/11832950
    return Math.round((num + Number.EPSILON) * 100) / 100;
}
