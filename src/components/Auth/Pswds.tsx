import Auth, {
    PswdReqList,
    PswdReqsType,
    initialPswdReqs,
    getExtendedPswdValidities,
    defaultUseEffect,
    changePswdReqsHighlighting,
} from "@/components/Auth";
import { useState } from "react";
import signUpBg from "@/assets/plants1.jpg";

export type PswdProps = {
    name: string;
    email: string;
    submitText: string;
    children: React.ReactNode;
    cancelBtn: React.ReactNode;
    onSuccessfulSignUpSubmit?: (pswd: string) => void;
    handleSubmit?: (e: React.SyntheticEvent) => void;
};

/**
 * The Pswds component is a functional component that handles password-related operations.
 *  It imports several hooks, functions, and types from the Auth component, 
 * including PswdReqList, PswdReqsType, initialPswdReqs, getExtendedPswdValidities, defaultUseEffect,
 *  and changePswdReqsHighlighting. It also imports the useState hook from React and an image from the assets directory.
 *  The component defines a type, PswdProps, for its props, which include name, email, submitText, children,
 *  cancelBtn, onSuccessfulSignUpSubmit, and handleSubmit. 
 * The actual implementation of the Pswds component is not shown in this excerpt.
 */
export function Pswds({
    name,
    email,
    submitText,
    children,
    cancelBtn,
    onSuccessfulSignUpSubmit,
    handleSubmit,
}: PswdProps) {
    const [pswdReqs, setPswdReqs] = useState<PswdReqsType>(initialPswdReqs);

    const [pswd, setPswd] = useState("");
    const [confirmPswd, setConfirmPswd] = useState("");

    const [pswdErrorTxt, setPswdErrorTxt] = useState(" ");
    const [confirmPswdErrorTxt, setConfirmPswdErrorTxt] = useState(" ");

    const dependancyArr: [string, string, string, string] = [
        name,
        email,
        pswd,
        confirmPswd,
    ];

    if (handleSubmit === undefined) {
        handleSubmit = (e: React.SyntheticEvent) => {
            e.preventDefault();

            const validities = getExtendedPswdValidities(...dependancyArr);

            const falseValidityPswdReqs = Object.keys(validities).filter(
                (key) => !validities[key as keyof typeof validities],
            ) as Array<keyof PswdReqsType>;

            changePswdReqsHighlighting(falseValidityPswdReqs, setPswdReqs);

            if (
                falseValidityPswdReqs.length === 0 &&
                onSuccessfulSignUpSubmit !== undefined
            ) {
                onSuccessfulSignUpSubmit(pswd);
            }
        };
    }

    const authFieldProps = [
        {
            value: pswd,
            setValue: setPswd,
            errorTxt: pswdErrorTxt,
            setErrorTxt: setPswdErrorTxt,
            label: "Password",
            type: "password",
            onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
                const input = e.target.value;
                if (input.length > 100) {
                    setPswdErrorTxt(
                        "Password can be a maximum of 100 characters",
                    );
                } else {
                    setPswd(e.target.value);
                }
            },
        },
        {
            value: confirmPswd,
            setValue: setConfirmPswd,
            errorTxt: confirmPswdErrorTxt,
            setErrorTxt: setConfirmPswdErrorTxt,
            label: "Confirm Password",
            type: "password",
            onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
                const input = e.target.value;
                if (input.length > 100) {
                    setConfirmPswdErrorTxt(
                        "Password can be a maximum of 100 characters",
                    );
                } else {
                    setConfirmPswd(e.target.value);
                }
            },
        },
    ];

    return (
        <Auth
            bgSrc={signUpBg}
            useEffectFunc={() => {
                defaultUseEffect(setPswdReqs, ...dependancyArr);
            }}
            dependancyArr={dependancyArr}
            handleSubmit={handleSubmit}
            title="Enter a strong password"
            authFieldProps={authFieldProps}
            cancelBtn={cancelBtn}
            submitText={submitText}
        >
            <PswdReqList pswdReqs={pswdReqs} />
            {children}
        </Auth>
    );
}
