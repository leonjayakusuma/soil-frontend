import { useState } from "react";
import { Email, Code } from "@/components/Auth/ForgotPswd";
import {
    AuthFieldPropsType,
    DirectionType,
    directions,
    Animator,
} from "@/components/Auth";

const forgotPswdSteps = {
    email: 0,
    code: 1,
} as const;

type ForgotPswdStepType =
    (typeof forgotPswdSteps)[keyof typeof forgotPswdSteps];

/* Takes care of resetting the password in case it's forgotten. It uses the steps to keep track of the phase in which the user is, and uses reuseable components in Auth to display the necessaray information */
/**
 * The ForgotPswd component is a functional component that handles the password reset process when a user forgets their password.
 *  It imports the Animator component from the Auth module and uses the useState hook from React to manage the state of the email,
 *  email error text, forgot password step, and direction. 
 * The component defines an object, forgotPswdSteps, with two properties: email and code,
 *  which are used to track the current step in the password reset process. 
 * The ForgotPswdStepType type is defined as the type of the keys of the forgotPswdSteps object.
 *  The component initializes the forgotPswdStep state to the email step and the direction state to the next direction.
 */

export default function ForgotPswd() {
    const [email, setEmail] = useState("");

    const [emailErrorTxt, setEmailErrorTxt] = useState(" ");

    const [forgotPswdStep, setForgotPswdStep] = useState<ForgotPswdStepType>(
        forgotPswdSteps.email,
    );

    const [direction, setDirection] = useState<DirectionType>(directions.next);

    // https://codesandbox.io/p/sandbox/pqvx3?file=%2Fsrc%2Findex.tsx
    function paginate(newDirection: DirectionType) {
        setForgotPswdStep(
            (currStep) => (currStep + newDirection) as ForgotPswdStepType,
        );
        setDirection(newDirection);
    }

    // https://codesandbox.io/p/sandbox/pqvx3?file=%2Fsrc%2Findex.tsx
    return (
        <Animator keyVal={forgotPswdStep} direction={direction}>
            <ForgotPswdStepComponent
                emailFieldProps={[
                    {
                        value: email,
                        setValue: setEmail,
                        label: "Email",
                        type: "email",
                        errorTxt: emailErrorTxt,
                        setErrorTxt: setEmailErrorTxt,
                    },
                ]}
                forgotPswdStep={forgotPswdStep}
                paginate={paginate}
            />
        </Animator>
    );
}

function ForgotPswdStepComponent({
    emailFieldProps,
    forgotPswdStep,
    paginate,
}: {
    emailFieldProps: AuthFieldPropsType[];
    forgotPswdStep: ForgotPswdStepType;
    paginate: (newDirection: DirectionType) => void;
}) {
    const email = emailFieldProps[0].value;

    // Using `useContext` here would be unnecessary imo as it's just 1 or 2 variables
    switch (forgotPswdStep) {
        case forgotPswdSteps.email:
            return (
                <Email authFieldProps={emailFieldProps} paginate={paginate} />
            );
        case forgotPswdSteps.code:
            return <Code email={email} paginate={paginate} />;
        default:
            console.error("Unknown step");
    }
    return <></>;
}
