import { theme } from "@/App";
import {
    Checkbox,
    ClickAwayListener,
    Stack,
    Tooltip,
    Typography,
} from "@mui/material";
import React, { useId, useState } from "react";

/**
 * The CB component is a functional component that takes children and an aria string as props.
 * It imports several components from Material-UI, including Checkbox, ClickAwayListener,
 * Stack, Tooltip, and Typography, as well as the theme from the App component.
 * The component uses the useState hook to manage the state of the open and color variables,
 * and the useId hook to generate a unique ID.
 * The component presumably returns a JSX element that includes a Checkbox and a Tooltip,
 * but the return statement is not shown in this excerpt.
 */
export function CB({
    children,
    aria,
}: {
    children: React.ReactNode;
    aria: string;
}) {
    const [open, setOpen] = useState(false);
    const [color, setColor] = useState("");
    const id = useId();

    /* References */
    // https://stackoverflow.com/a/62670194 and https://stackoverflow.com/a/71305123
    // https://stackoverflow.com/a/54606987

    return (
        <Stack direction="row" alignItems="center" mt="10px">
            <ClickAwayListener
                onClickAway={() => {
                    setOpen(false);
                }}
            >
                <Tooltip
                    title="Please check this box if you want to proceed"
                    arrow
                    open={open}
                    componentsProps={{
                        tooltip: {
                            sx: {
                                backgroundColor: color,
                                "& .MuiTooltip-arrow::before": {
                                    background: color,
                                },
                            },
                        },
                    }}
                >
                    <Checkbox
                        id={id} // For label in MUI
                        sx={{
                            width: 0,
                            marginRight: theme.spacing(0.7),
                            marginLeft: theme.spacing(0.4),
                        }}
                        required
                        inputProps={{
                            onInvalid: (
                                e: React.InvalidEvent<HTMLInputElement>,
                            ) => {
                                e.preventDefault();
                                setColor("#ff3e3e");
                                setOpen(true);
                            },
                            onMouseOver: (
                                e: React.MouseEvent<HTMLInputElement>,
                            ) => {
                                e.preventDefault();
                                setColor("");
                                setOpen(true);
                            },
                            onMouseOut: (
                                e: React.MouseEvent<HTMLInputElement>,
                            ) => {
                                e.preventDefault();
                                setOpen(false);
                            },
                            "aria-label": aria,
                        }}
                    />
                </Tooltip>
            </ClickAwayListener>
            <Typography>{children}</Typography>
        </Stack>
    );
}
