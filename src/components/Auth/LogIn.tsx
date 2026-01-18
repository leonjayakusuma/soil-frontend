import Auth from "@/components/Auth";
import {Link, Stack, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import signUpBg from "@/assets/plants1.jpg";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import { getSOILInfo } from "@/SoilInfo";
import { usePopup } from "@/shared/Popup";
import { useAuthStore } from "@/store/authStore";

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
    const login = useAuthStore((state) => state.login);

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

    async function handleSubmit(e: React.SyntheticEvent) {
        e.preventDefault();
        const result = await login(email, pswd);
        if (result.success) {
            popup(result.message || "Login successful");
            navigate("/");
        } else {
            popup(result.message || "Login failed");
            setEmailErrorTxt(result.message || "Login failed");
            setPswdErrorTxt(result.message || "Login failed");
        }
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
        >
            <LoginFooter />
        </Auth>
    );
}
function LoginFooter() {
    return (
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
    );
}

