import Auth from "@/components/Auth";
import { Button, Link, Stack, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import signUpBg from "@/assets/plants1.jpg";
// import { logInErrorCodes, logInUser } from "@/Auth";
import { logInUser } from "@/api";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import CloseIcon from "@mui/icons-material/Close";
import { getSOILInfo, setSOILItem } from "@/SoilInfo";
import { usePopup } from "@/shared/Popup";

/**
 * The LogIn component is a functional component that handles user login.
 *  It imports several hooks and functions from various modules, 
 * including the logInUser function from the API, the useNavigate hook from react-router-dom,
 *  the getSOILInfo and setSOILItem functions from SoilInfo, and the usePopup hook from shared/Popup.
 *  The component uses the useState hook to manage the state of the email, password, and their respective error texts.
 *  It also uses the useEffect hook, presumably to perform some action when the component mounts or updates,
 *  but the useEffect callback function is not shown in this excerpt.
 *  The component also checks if the user is already logged in by calling the getSOILInfo
 *  function and checking the userInfo property.
 */
export function LogIn() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [pswd, setPswd] = useState("");

    // Can't be the same thing because AuthField requires them to be unique
    const [emailErrorTxt, setEmailErrorTxt] = useState(" ");
    const [pswdErrorTxt, setPswdErrorTxt] = useState(" ");

    const isLoggedIn = !!getSOILInfo().userInfo;

    const popup = usePopup()!;

    useEffect(() => {
        if (isLoggedIn) {
            navigate("/");
        }
    }, [isLoggedIn]);

    function handleSubmit(e: React.SyntheticEvent) {
        e.preventDefault();
        logInUser(email, pswd).then((response) => {
            if (!response.data || response.isError) {
                setEmailErrorTxt(response.msg);
                setPswdErrorTxt(response.msg);
            } else {
                setSOILItem("userInfo", {
                    ...response.data,
                    userId: response.data.id,
                });
                const displayName =
                    (response.data as { name?: string }).name ?? email;
                popup(`Welcome ${displayName}`);
                navigate("/");
            }
        });
    }

    const authFieldProps = [
        {
            value: email,
            setValue: setEmail,
            label: "Email",
            type: "email",
            errorTxt: emailErrorTxt,
            setErrorTxt: setEmailErrorTxt,
        },
        {
            value: pswd,
            setValue: setPswd,
            label: "Password",
            type: "password",
            errorTxt: pswdErrorTxt,
            setErrorTxt: setPswdErrorTxt,
        },
    ];

    return (
        <Auth
            bgSrc={signUpBg}
            useEffectFunc={() => { }}
            dependancyArr={[email, pswd]}
            handleSubmit={handleSubmit}
            title="Welcome back!"
            authFieldProps={authFieldProps}
            submitText="Log in"
            cancelBtn={
                <Button
                    variant="contained"
                    color="inherit"
                    sx={{
                        color: "rgb(100, 100, 100)",
                    }}
                    onClick={() => {
                        navigate("/");
                    }}
                >
                    <CloseIcon sx={{ paddingRight: "5px" }} />
                    Cancel
                </Button>
            }
        >
            <Stack direction="row" alignItems="center" flexDirection="column">
                <Typography>
                    <Link component={RouterLink} to="/forgotPswd">
                        Forgot Password?
                    </Link>
                </Typography>
                <Typography>
                    Don't have an account?&nbsp;
                    <Link component={RouterLink} to="/signup">
                        Sign up
                    </Link>
                </Typography>
            </Stack>
        </Auth>
    );
}
