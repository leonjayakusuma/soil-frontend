import { AuthField, AuthFieldPropsType } from "@/components/Auth";
import { Box, Button, FormControl, Stack, Typography } from "@mui/material";
import { useEffect } from "react";
import { theme } from "@/App";

export type AuthFormPropsType = {
    useEffectFunc: () => void;
    dependancyArr: any[];
    submitText: string;
    handleSubmit: (e: React.SyntheticEvent) => void;
    title: string;
    authFieldProps: AuthFieldPropsType[];
    children?: React.ReactNode;
    errorTxt?: string;
    setErrorTxt?: React.Dispatch<React.SetStateAction<string>>;
};


/**
 * The AuthForm component is a functional component that handles the rendering of various forms in the application.
 * It takes several props including a useEffect function, a dependency array for the useEffect hook,
 * a handleSubmit function, a title, an array of authFieldProps, optional children, a cancel button,
 * submit text, and optional error text and its setter function. 
 * The component uses the useEffect hook with the provided useEffect function and dependency array.
 * The actual form rendering and error handling are not shown in this excerpt.
 */
export function AuthForm({
    useEffectFunc,
    dependancyArr,
    handleSubmit,
    title,
    authFieldProps,
    children,
    submitText,
}: AuthFormPropsType) {
    useEffect(useEffectFunc, dependancyArr);

    return (
        <Box component="form" onSubmit={handleSubmit}>
            <FormControl
                sx={{
                    width: {
                        xs: "85vw",
                        sm: theme.spacing(30),
                        md: theme.spacing(20),
                    },
                    "& span, & p": {
                        fontSize: theme.fontSize(0.73),
                    },
                }}
                title="" // To disable default browser hover tooltips
            >
                <Typography
                    variant="h4"
                    fontSize={theme.fontSize(1.55)}
                    fontWeight="500"
                    marginBottom="30px"
                    textAlign="center"
                >
                    {title}
                </Typography>
                {authFieldProps.map(
                    ({
                        value,
                        setValue,
                        label,
                        type,
                        errorTxt,
                        setErrorTxt,
                        onChange
                    }) => {
                        return (
                            <AuthField
                                key={label}
                                value={value}
                                setValue={setValue}
                                label={label}
                                type={type}
                                errorTxt={errorTxt}
                                setErrorTxt={setErrorTxt}
                                onChange={onChange}
                            />
                        );
                    },
                )}
                <Stack direction="row" justifyContent="center" mt={0.7} marginBottom="30px">
                    <Button
                        type="submit"
                        variant="contained"
                        sx={{
                            px: 2,
                            py: .5,
                            width: "80%"
                        }}
                    >
                        {submitText}
                    </Button>
                </Stack>
                {children}
            </FormControl>
        </Box>
    );
}
