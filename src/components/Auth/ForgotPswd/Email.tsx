import Auth, {
    AuthFieldPropsType,
    DirectionType,
    directions,
} from "@/components/Auth";
import signUpBg from "@/assets/plants1.jpg";
import { Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import CloseIcon from "@mui/icons-material/Close";
import { getForgotPswdCode } from "@/api";

/* Gets the user's email and alerts them of the generated code. This is used because an emailing service is not provided and we don't have an SMTP server */
type EmailProps = {
    authFieldProps: AuthFieldPropsType[];
    paginate: (newDirection: DirectionType) => void;
};
export function Email({ authFieldProps, paginate }: EmailProps) {
    const navigate = useNavigate();
    const { value: email, setErrorTxt } = authFieldProps[0];

    function handleSubmit(e: React.SyntheticEvent) {
        e.preventDefault();
        getForgotPswdCode(email).then((response) => {
            if (!response.data || response.isError) {
                setErrorTxt!(response.msg);
            } else {
                prompt(
                    `Since we have no emailing service this is used. IT EXPIRES IN 5 MINUTES!. Press Cntrl+C to copy the code:`,
                    response.data,
                );
                paginate(directions.next);
            }
        });
    }

    return (
        <Auth
            bgSrc={signUpBg}
            useEffectFunc={() => {}}
            dependancyArr={[]}
            handleSubmit={handleSubmit}
            title="Get password reset code"
            authFieldProps={authFieldProps}
            submitText="Get code"
        >
            <Typography mb="30px">
                Please enter your email address to send the password reset code
            </Typography>
        </Auth>
    );
}
