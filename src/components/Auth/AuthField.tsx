import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { FilledInputProps, IconButton, TextField } from "@mui/material";
import { useId, useLayoutEffect, useState } from "react";

export type AuthFieldPropsType = {
    value: string;
    setValue: React.Dispatch<React.SetStateAction<string>>;
    label: string;
    type: string;
    fullWidth?: boolean;
    errorTxt?: string;
    setErrorTxt?: React.Dispatch<React.SetStateAction<string>>;
    readOnly?: boolean;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

/**
This component handles the rendering of an authentication field. It includes a TextField 
for user input and state management for the field value, error text, and error state.

The component receives several props including setValue, errorTxt, setErrorTxt, type, 
readOnly, and otherProps. setValue and setErrorTxt are functions to set the state of 
the field value and error text. type is the type of the input field. readOnly is a boolean 
indicating whether the field is read-only. otherProps are any other props passed to the component.
 */
export function AuthField({
    setValue,
    errorTxt,
    setErrorTxt,
    type,
    readOnly,
    ...otherProps
}: AuthFieldPropsType) {
    const [localErrorTxt, setLocalErrorTxt] = useState(" ");
    const [error, setError] = useState(false);
    const [neededType, setNeededType] = useState(type);
    const id = useId();

    // Why do I need to do it like this? -> https://stackoverflow.com/a/61526397/19612884
    const correctErrorTxt = errorTxt ?? localErrorTxt;
    const correctSetErrorTxt = setErrorTxt ?? setLocalErrorTxt;
    const finalOnChange =
        otherProps.onChange ??
        ((e: React.ChangeEvent<HTMLInputElement>) => {
            setValue(e.target.value);
        });

    // useLayoutEffect because I want to change the error so it becomes red before the browser paints
    useLayoutEffect(() => {
        if (correctErrorTxt !== " ") {
            setError(true);
        } else {
            setError(false);
        }
    }, [correctErrorTxt]);

    const inputProps: Partial<FilledInputProps> = {
        onInvalid: (e: React.InvalidEvent<HTMLInputElement>) => {
            e.preventDefault();
            correctSetErrorTxt(e.target.validationMessage);
        },
        onFocus: () => {
            correctSetErrorTxt(" ");
        },
        readOnly,
    };

    if (type === "password") {
        inputProps.endAdornment = (
            <IconButton
                aria-label="toggle password visibility"
                onClick={() =>
                    setNeededType(
                        neededType === "password" ? "text" : "password",
                    )
                }
                edge="end"
            >
                {neededType === "text" ? <VisibilityOff /> : <Visibility />}
            </IconButton>
        );
    }

    return (
        <TextField
            id={id} // For label in MUI
            type={neededType}
            {...otherProps}
            onChange={finalOnChange}
            variant="outlined"
            required
            autoComplete="on"
            error={error}
            helperText={correctErrorTxt}
            InputProps={inputProps}
            sx={{
                width: "80%",
                alignSelf: "center",
            }}
        />
    );
}
