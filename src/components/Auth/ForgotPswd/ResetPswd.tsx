import { Pswds, CB, DirectionType, directions } from "@/components/Auth";
import { Button, Link } from "@mui/material";
// import { updatePswd } from "@/Auth";
import { useNavigate } from "react-router-dom";
import ArrowBack from "@mui/icons-material/ArrowBack";
import { usePopup } from "@/shared/Popup";
import { changePassword } from "@/api";
// import { useEffect, useState } from "react";

type ResetPswdProps = {
    email: string;
    name: string;
    oldPassword: string;
    paginate: (newDirection: DirectionType) => void;
};

/**
 * The ResetPswd component is a functional component that handles password reset.
 *  It imports several components, hooks, and functions from various modules, 
 * including the Pswds and CB components and the DirectionType and directions objects from the Auth module,
 *  the Button and Link components from Material-UI, the useNavigate hook from react-router-dom,
 *  the ArrowBack icon from Material-UI, the usePopup hook from shared/Popup, and the changePassword function from the API.
 *  The component defines a type, ResetPswdProps, for its props, which include email, name, oldPassword, and a paginate function.
 *  The ResetPswd component uses the useNavigate and usePopup hooks to navigate to different pages and display popups, respectively.
 */
export function ResetPswd({ email, name, oldPassword, paginate }: ResetPswdProps) {
    const navigate = useNavigate();
    const popup = usePopup()!;

    function onPswdChange(newPassword: string) {
        // const success = updatePswd(email, pswd);
        console.log({ oldPassword, newPassword });
        changePassword(oldPassword, newPassword).then(
            (data) => {
                console.log()
                if (!data.data) {
                    popup("Something went wrong updating password");
                    throw new Error(data.msg);
                }
                const password_success_string = "Password changing successful. Note: The new password can be the same as the old password. We don't check it as it would be unnecessary overhead";
                popup(password_success_string);
                navigate("/login");
            }
        ).catch((error) => {
            console.error(error);
        });
    }

    return (
        <Pswds
            name={name}
            email={email}
            submitText="Change Password"
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
                    onClick={() => paginate(directions.back)}
                >
                    <ArrowBack sx={{ paddingRight: "5px" }} />
                    Go back
                </Button>
            }
            onSuccessfulSignUpSubmit={onPswdChange}
        >
            <CB aria="Accept terms and conditions">
                I agree to the <Link href="#">terms and conditions</Link>
            </CB>
        </Pswds>
    );
}
