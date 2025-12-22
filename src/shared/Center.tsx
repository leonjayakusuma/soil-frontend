import React from "react";
import { Box, SxProps, Theme } from "@mui/material";

/* <center></center> is deprecated in HTML5 */

type Props = {
    children?: React.ReactNode;
    sx?: SxProps<Theme>; // using Theme here so it takes the theme into account https://stackoverflow.com/a/74212776
};

/* Basic function to center the children */
export default function ({ children, sx }: Props) {
    const defaultSx = {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
    };

    const finalSx = {
        ...defaultSx,
        ...sx,
    };

    return <Box sx={finalSx}>{children}</Box>;
}
