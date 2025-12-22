import { DirectionType, directions } from "@/components/Auth";
import { Box } from "@mui/material";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

/**
This component handles the animation of its children. It uses the AnimatePresence and motion 
components from 'framer-motion' to animate the children when they enter, exit, or have their 
position changed.

The component receives several props including keyVal, direction, and children. keyVal is the 
key for the motion component. direction is the direction of the animation. children are any 
child components passed to the component.

The component uses the useState hook to manage the state of whether the Box component has 
overflow. The setHasNoOverflow function is used to set the state of hasNoOverflow to true 
when the animation starts and to false when the animation completes.
 */
export function Animator({
    keyVal,
    direction,
    children,
}: {
    keyVal: any;
    direction: DirectionType;
    children: React.ReactNode;
}) {
    const [hasNoOverflow, setHasNoOverflow] = useState(false);

    const sx = hasNoOverflow ? { overflowX: "hidden" } : {};

    return (
        <Box sx={sx} position="relative" width="100vw" height="100vh">
            <AnimatePresence initial={false} custom={direction}>
                <motion.div
                    key={keyVal}
                    custom={direction}
                    variants={variants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    style={{
                        position: "absolute",
                        width: "100%",
                        height: "100%",
                    }}
                    onAnimationStart={() => {
                        setHasNoOverflow(true);
                    }}
                    onAnimationComplete={() => {
                        setHasNoOverflow(false);
                    }}
                >
                    {children}
                </motion.div>
            </AnimatePresence>
        </Box>
    );
}

const speedFactor = 4;
const duration = 0.5;

const variants = {
    enter: (direction: DirectionType) => {
        return {
            x: direction === directions.next ? "100vw" : "-100vw",
            transition: { type: "tween", duration, ease: "linear" },
        };
    },
    center: {
        zIndex: 1,
        x: 0,
        transition: { type: "tween", duration, ease: "linear" },
    },
    exit: (direction: DirectionType) => {
        return {
            zIndex: 0,
            x:
                direction === directions.back
                    ? `${100 / speedFactor}vw`
                    : `-${100 / speedFactor}vw`,
            transition: { type: "tween", duration, ease: "linear" },
        };
    },
};
