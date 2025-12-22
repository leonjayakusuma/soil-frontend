// import { deleteUserCode, getUserCode } from "@/Auth";
import signUpBg from "@/assets/plants1.jpg";
import { Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Auth, { DirectionType, directions } from "@/components/Auth";
import {
    clearInterval,
    clearTimeout,
    setInterval,
    setTimeout,
} from "worker-timers"; // needed to work in unfocused windows
import { useEffect, useState } from "react";
import ArrowBack from "@mui/icons-material/ArrowBack";
import { forgotPswd } from "@/api";
import { usePopup } from "@/shared/Popup";

/* For the user to enter the code they received */

type CodeProps = {
    email: string;
    paginate: (newDirection: DirectionType) => void;
};
export function Code({ email, paginate }: CodeProps) {
    const navigate = useNavigate();

    const [code, setCode] = useState("");
    const [codeErrorTxt, setCodeErrorTxt] = useState(" ");

    const initialTime = 5 * 60; // 5 mins

    const [duration, setDuration] = useState(initialTime);

    const popup = usePopup()!;

    function handleSubmit(e: React.SyntheticEvent) {
        e.preventDefault();

        forgotPswd(code).then((response) => {
            if (!response.data || response.isError) {
                if (response.status === 403) {
                    popup("Code expired");
                    navigate("/login");
                } else {
                    setCodeErrorTxt(response.msg);
                }
            } else {
                prompt(
                    `Since we have no emailing service, we are using this. Password reset successfully. You can use this to reset your password in the profile page after logging in with it. Press Cntrl+C to copy`,
                    response.data,
                );
                navigate("/login");
            }
        });
    }

    useEffect(() => {
        const timerInterval = setInterval(() => {
            setDuration((prevDuration) => prevDuration - 1);
        }, 1000);

        return () => clearInterval(timerInterval);
    }, []);

    // useEffect(() => {
    //     // https://stackoverflow.com/questions/76113306/alert-within-useeffect-gets-thrown-before-rerender-of-component
    //     const id = setTimeout(() => {
    //         alert("Code expired");
    //         navigate("/");
    //     }, initialTime * 1000);

    //     return () => clearTimeout(id);
    // }, []);

    useEffect(() => {
        // Not <= 0, because if so the alert appears twice
        if (duration === 0) {
            // https://stackoverflow.com/questions/76113306/alert-within-useeffect-gets-thrown-before-rerender-of-component
            const id = setTimeout(() => {
                popup("Code expired");
                navigate("/");
            }, 0);

            return () => clearTimeout(id);
        }
    }, [duration]);

    function getFormattedTimeString() {
        const minutes = Math.max(0, Math.floor(duration / 60));
        const seconds = Math.max(0, duration % 60)
            .toString()
            .padStart(2, "0");
        return `${minutes}:${seconds}`;
    }

    const authFieldProps = [
        {
            value: code,
            setValue: setCode,
            label: "Code",
            type: "password",
            errorTxt: codeErrorTxt,
            setErrorTxt: setCodeErrorTxt,
        },
    ];

    return (
        <Auth
            bgSrc={signUpBg}
            useEffectFunc={() => { }}
            dependancyArr={[]}
            handleSubmit={handleSubmit}
            title="Get password reset code"
            authFieldProps={authFieldProps}
            submitText="Next"
            cancelBtn={
                <Button
                    variant="contained"
                    color="inherit"
                    sx={{
                        color: "rgb(100, 100, 100)",
                        // "&:hover": {
                        //     color: "black",
                        //     backgroundColor: "darkgray",
                        // },
                    }}
                    onClick={() => {
                        // deleteUserCode(email);
                        paginate(directions.back);
                    }}
                >
                    <ArrowBack sx={{ paddingRight: "5px" }} />
                    Go back
                </Button>
            }
        >
            <Typography
                variant="h5"
                component="div"
                fontFamily="monospace"
                mb="20px"
            >
                Code expiration duration: {getFormattedTimeString()}
            </Typography>
            <Typography mb="30px">
                Please enter your email address to send the password reset code
            </Typography>
        </Auth>
    );
}
