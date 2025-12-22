import { Button, Link } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    NameAndEmail,
    CB,
    Pswds,
    Animator,
    DirectionType,
    directions,
} from "@/components/Auth";
import ArrowBack from "@mui/icons-material/ArrowBack";
import { usePopup } from "@/shared/Popup";
import { createUser } from "@/api";
import { getSOILInfo, setSOILItem } from "@/SoilInfo";

const signUpSteps = {
    nameAndEmail: 0,
    pswds: 1,
} as const;

type SignUpStepType = (typeof signUpSteps)[keyof typeof signUpSteps];

/**
 * The SignUp component is a functional component that handles user registration. 
 * It imports several components, hooks, and functions from various modules, 
 * including the Animator and DirectionType components and the directions object from the Auth module,
 *  the ArrowBack icon from Material-UI, the usePopup hook from shared/Popup,
 *  the createUser function from the API, and the getSOILInfo and setSOILItem functions from SoilInfo.
 *  The component defines an object, signUpSteps, with two properties: nameAndEmail and pswds, 
 * which are used to track the current step in the sign-up process. 
 * The SignUp component uses the useState hook to manage the state of the name and email fields.
 */

export function SignUp() {
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");

    const [signUpStep, setSignUpStep] = useState<SignUpStepType>(
        signUpSteps.nameAndEmail,
    );

    const [direction, setDirection] = useState<DirectionType>(directions.next);

    const isLoggedIn = !!getSOILInfo().userInfo;

    useEffect(() => {
        if (isLoggedIn) {
            navigate("/");
        }
    }, [isLoggedIn]);

    // https://codesandbox.io/p/sandbox/pqvx3?file=%2Fsrc%2Findex.tsx
    function paginate(newDirection: DirectionType) {
        setSignUpStep(
            (currStep) => (currStep + newDirection) as SignUpStepType,
        );
        setDirection(newDirection);
    }

    return (
        <Animator keyVal={signUpStep} direction={direction}>
            <SignUpStepComponent
                name={name}
                setName={setName}
                email={email}
                setEmail={setEmail}
                signUpStep={signUpStep}
                paginate={paginate}
            />
        </Animator>
    );
}

type SignUpStepComponentProps = {
    name: string;
    setName: React.Dispatch<React.SetStateAction<string>>;
    email: string;
    setEmail: React.Dispatch<React.SetStateAction<string>>;
    signUpStep: SignUpStepType;
    paginate: (newDirection: DirectionType) => void;
};
function SignUpStepComponent({
    signUpStep,
    paginate,
    ...restProps
}: SignUpStepComponentProps) {
    const navigate = useNavigate();

    const { name, email } = restProps;

    const popup = usePopup()!;

    function onSuccessfulSignUpSubmit(pswd: string) {
        createUser({
            email,
            name,
            pswd,
        }).then((response) => {
            if (!response.data || response.isError) {
                popup(
                    `Could not create account. Error ${response.status} - ${response.msg}`,
                );
            } else {
                setSOILItem("userInfo", {
                    ...response.data,
                    userId: response.data.id,
                });
                popup("Successfully signed up");
                navigate("/");
            }
        });
    }

    if (signUpStep === signUpSteps.nameAndEmail) {
        return <NameAndEmail {...restProps} paginate={paginate} />;
    }
    return (
        <Pswds
            name={name}
            email={email}
            submitText="Sign up"
            cancelBtn={
                <Button
                    variant="contained"
                    color="inherit"
                    sx={{
                        color: "rgb(100, 100, 100)",
                    }}
                    onClick={() => paginate(directions.back)}
                >
                    <ArrowBack sx={{ paddingRight: "5px" }} />
                    Go back
                </Button>
            }
            onSuccessfulSignUpSubmit={onSuccessfulSignUpSubmit}
        >
            <CB aria="Accept terms and conditions">
                I agree to the{" "}
                <Link href="/TNCs.pdf" target="_blank">
                    terms and conditions
                </Link>{" "}
                and{" "}
                <Link href="/PN.pdf" target="_blank">
                    privacy policy
                </Link>
            </CB>
        </Pswds>
    );
}
