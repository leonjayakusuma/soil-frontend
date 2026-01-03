import Auth, { DirectionType, directions } from "@/components/Auth";
import signUpBg from "@/assets/plants1.jpg";
import { Button, Stack, Typography, Link } from "@mui/material";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import CloseIcon from "@mui/icons-material/Close";
import { emailAndNameExists } from "@/api";
import { usePopup } from "@/shared/Popup";
import { useState } from "react";

type NameAndEmailProps = {
    name: string;
    setName: React.Dispatch<React.SetStateAction<string>>;
    email: string;
    setEmail: React.Dispatch<React.SetStateAction<string>>;
    paginate: (newDirection: DirectionType) => void;
};

/**
This component handles the name and email fields in the authentication process. It includes 
form fields for name and email, and a function to navigate to the next authentication step.
 */
export function NameAndEmail({
    name,
    setName,
    email,
    setEmail,
    paginate,
}: NameAndEmailProps) {
    const navigate = useNavigate();
    const [nameErrorTxt, setNameErrorTxt] = useState(" ");
    const [emailErrorTxt, setEmailErrorTxt] = useState(" ");
    const authFieldProps = [
        {
            value: name,
            setValue: setName,
            errorTxt: nameErrorTxt,
            setErrorTxt: setNameErrorTxt,
            label: "Name",
            type: "text",
            onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
                const input = e.target.value;
                if (input.length > 15) {
                    setNameErrorTxt(
                        "Name is can be a maximum of 15 characters",
                    );
                } else {
                    setName(e.target.value);
                }
            },
        },
        {
            value: email,
            setValue: setEmail,
            errorTxt: emailErrorTxt,
            setErrorTxt: setEmailErrorTxt,
            label: "Email",
            type: "email",
            onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
                const input = e.target.value;
                if (input.length > 254) {
                    setEmailErrorTxt(
                        "Email is can be a maximum of 254 characters",
                    );
                } else {
                    setEmail(e.target.value);
                }
            },
        },
    ];

    const popup = usePopup()!;

    function handleSubmit(e: React.SyntheticEvent) {
        e.preventDefault();
        emailAndNameExists(email, name).then((response) => {
            if (!response.data || response.isError) {
                popup(`Error ${response.status} - ${response.msg}`);
            } else {
                if (response.data.email && response.data.name) {
                    popup("Name and email already exists");
                } else if (response.data.name) {
                    popup("Name already exists");
                } else if (response.data.email) {
                    popup("Email already exists");
                } else {
                    paginate(directions.next);
                }
            }
        });
        paginate(directions.next);
    }

    return (
        <Auth
            bgSrc={signUpBg}
            useEffectFunc={() => {}}
            dependancyArr={[]}
            handleSubmit={handleSubmit}
            title="Get started!"
            authFieldProps={authFieldProps}
            submitText="Next"
        >
            <Stack direction="row" alignItems="center" flexDirection="column">
                <Typography>
                    Already have an account?&nbsp;
                    <Link component={RouterLink} to="/login">
                        Log in
                    </Link>
                </Typography>
            </Stack>
        </Auth>
    );
}
