import {
    TextField,
    InputBaseComponentProps,
    SxProps,
    Theme,
    TextFieldProps,
    Box,
    InputAdornment,
    Stack,
    Typography,
} from "@mui/material";
import { green, grey } from "@mui/material/colors";
import { createContext, useContext } from "react";

const DEFAULT_HEIGHT = "48px";

const Ctx = createContext<string>(DEFAULT_HEIGHT);

type NumericInputProps = TextFieldProps & {
    inc: () => void;
    dec: () => void;
    height?: string;
    startTxt?: string;
    endTxt?: string;
    width?: string | number;
    min?: number;
    max?: number;
};

/**
This component handles a numeric input field with increment and decrement functions.
It also includes optional properties for height, start and end text, width, and min and max values.
 */
export default function NumericInput({
    inc,
    dec,
    height = DEFAULT_HEIGHT,
    startTxt,
    endTxt,
    width = "100%",
    min,
    max,
    ...restProps
}: NumericInputProps) {
    const inputProps: InputBaseComponentProps = {
        ...(min !== undefined && { min }),
        ...(max !== undefined && { max }),
    };
    const finalInputSx = {
        borderRadius: 1,
        paddingRight: 0,
        backgroundColor: "white",
        height: height,
        width: `100%`,
        // https://stackoverflow.com/a/76703526
        "::-webkit-outer-spin-button, & input::-webkit-inner-spin-button": {
            display: "none",
        },
        "& input[type=number]": {
            MozAppearance: "textfield",
        },
        "& .MuiInputBase-input": {
            textOverflow: "ellipsis",
            padding: 0.4,
        },
        // transition: "background-color 0.1s ease",
        "&.Mui-focused": {
            backgroundColor: grey[300],

            "& fieldset": {
                border: "none !important",
            },
        },
        "& fieldset": {
            transition: "border-color 0.3s ease !important",
        },
        "&:hover": {
            "& fieldset": {
                border: "2px solid black !important",
            },
        },
    };

    return (
        <Ctx.Provider value={height}>
            <TextField
                type="number"
                sx={{
                    flexGrow: 1,
                    fontSize: "30px",
                }}
                inputProps={inputProps}
                InputProps={{
                    sx: finalInputSx,
                    startAdornment: <StartAdornment startTxt={startTxt} />,
                    endAdornment: (
                        <EndAdornment endTxt={endTxt} inc={inc} dec={dec} />
                    ),
                }}
                {...restProps}
            />
        </Ctx.Provider>
    );
}

function StartAdornment({ startTxt }: { startTxt?: string }) {
    return (
        <>
            {startTxt && (
                <InputAdornment position="start">
                    <Typography
                        sx={{
                            fontFamily: "sans-serif",
                            color: "grey",
                            userSelect: "none",
                        }}
                    >
                        {startTxt}
                    </Typography>
                </InputAdornment>
            )}
        </>
    );
}

function EndAdornment({
    endTxt,
    inc,
    dec,
}: {
    endTxt?: string;
    inc: () => void;
    dec: () => void;
}) {
    return (
        <>
            {endTxt && (
                <Typography
                    variant="body2"
                    sx={{
                        fontFamily: "sans-serif",
                        color: "darkgrey",
                        paddingRight: 0.2,
                        userSelect: "none",
                    }}
                >
                    {endTxt}
                </Typography>
            )}
            <Stack direction="column" gap={0.2} p={0.3}>
                <ArrowBtn
                    char="▴"
                    sx={{
                        borderTopLeftRadius: 3,
                        borderTopRightRadius: 3,
                    }}
                    arialabel="increment"
                    onClick={inc}
                />
                <ArrowBtn
                    char="▾"
                    sx={{
                        borderBottomLeftRadius: 3,
                        borderBottomRightRadius: 3,
                    }}
                    arialabel="decrement"
                    onClick={dec}
                />
            </Stack>
        </>
    );
}

function ArrowBtn({
    char,
    sx,
    arialabel,
    onClick,
}: {
    char: string;
    sx?: SxProps<Theme>;
    arialabel?: string;
    onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}) {
    const parentHeight = useContext(Ctx);
    const height = `calc(${parentHeight}/2.7)`;

    return (
        <Box
            sx={{
                ...sx,
                color: green[600],
                border: `1px solid ${grey[200]}`,
                transition: "color 0.5s ease, background-color 0.5s ease",
                backgroundColor: grey[100],
                "&:hover": {
                    color: "white",
                    backgroundColor: green[600],
                },
                userSelect: "none",
            }}
            onClick={onClick}
            display="flex"
            justifyContent="center"
            alignItems="center"
            width={height}
            height={height}
            component="button"
            aria-label={arialabel}
        >
            {char}
        </Box>
    );
}
