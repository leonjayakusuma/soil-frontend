import Auth, { DirectionType, directions, Animator } from "@/components/Auth";
import signUpBg from "@/assets/plants1.jpg";
import {
    useEffect,
    useLayoutEffect,
    // useMemo,
    useState
} from "react";
import { ResetPswd } from "../Auth/ForgotPswd";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import { Button, Link, Typography } from "@mui/material";
import ArrowBack from "@mui/icons-material/ArrowBack";
import { getSOILInfo } from "@/SoilInfo";
// import { getUser } from "@/Auth";
import { checkOldPswd, getProfileInfo } from "@/api";
import { usePopup } from "@/shared/Popup";
// import { error } from "console";

const enum changePswdSteps {
    oldPswd,
    changePswd,
}

/**
This component is responsible for handling the user's password change. It includes form fields 

It utilises changePswdSteps enum to keep track of the current step in the password change process.

And it uses the reusable component called "ResetPswd" to handle the password reset process.

It also uses reusable components called "Auth" to handle basic authentication logic
 */
export function ProfileChangePswd() {
    const popup = usePopup()!;
    const [changePswdStep, setChangePswdStep] = useState<changePswdSteps>(
        changePswdSteps.oldPswd,
    );
    const isLoggedIn = !!getSOILInfo().userInfo;

    const navigate = useNavigate();

    const [direction, setDirection] = useState<DirectionType>(directions.next);
    const [oldPassword, setOldPassword] = useState("");

    useLayoutEffect(() => {
        const id = setTimeout(() => {
            console.log({ isLoggedIn });
            if (!isLoggedIn) {
                popup(
                    "You must be logged in to change your password. You got logged out. Please log in again.",
                );
                navigate("/login");
            }
        }, 0);

        return () => clearTimeout(id);
    }, [isLoggedIn]);

    if (!isLoggedIn) {
        // To stop errors in console from initial render
        return <></>;
    }

    return (
        <Animator keyVal={changePswdStep} direction={direction}>
            <ChangePswdStepComponent
                oldPassword={oldPassword}
                setOldPassword={setOldPassword}
                changePswdStep={changePswdStep}
                paginate={paginate}
            />
        </Animator>
    );

    // https://codesandbox.io/p/sandbox/pqvx3?file=%2Fsrc%2Findex.tsx
    function paginate(newDirection: DirectionType) {
        setChangePswdStep(
            (currStep) => (currStep + newDirection) as changePswdSteps,
        );
        setDirection(newDirection);
    }
}

function ChangePswdStepComponent({
    oldPassword,
    setOldPassword,
    changePswdStep,
    paginate,
}: {
    oldPassword: string;
    setOldPassword: React.Dispatch<React.SetStateAction<string>>;
    changePswdStep: changePswdSteps;
    paginate: (newDirection: DirectionType) => void;
}) {
    // const email = useMemo(() => {
    //     return getSOILInfo().user?.email;
    // }, []);
    // const username = useMemo(() => getUser(email ?? "")!.name, [email]);

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");

    useLayoutEffect(() => {
        getProfileInfo().then((data) => {
            if (!data.data) {
                throw new Error(data.msg);
            }
            setUsername(data.data.name);
            setEmail(data.data.email);
        }).catch((error) => {
            console.error(error);
        });
    }, []);

    useEffect(() => {
        console.log(oldPassword);
    }, [oldPassword])

    // if (!email) {
    //     return <></>; // Just to be safe even though isLoggedIn will be true if it reaches here
    // }

    switch (changePswdStep) {
        case changePswdSteps.oldPswd:
            return <EnterOldPswd
                paginate={paginate}
                oldPassword={oldPassword}
                setOldPassword={setOldPassword}
            />;
        case changePswdSteps.changePswd:
            return <ResetPswd email={email} name={username} oldPassword={oldPassword} paginate={paginate} />;
        default:
            console.error("Unknown step");
    }
}

function EnterOldPswd({
    paginate,
    oldPassword,
    setOldPassword
}: {
    paginate: (newDirection: DirectionType) => void;
    oldPassword: string;
    setOldPassword: React.Dispatch<React.SetStateAction<string>>;
}) {
    const navigate = useNavigate();

    const [oldPswdErrorTxt, setOldPswdErrorTxt] = useState(" ");


    const authFieldProps = [
        {
            value: oldPassword,
            setValue: setOldPassword,
            label: "Old Password",
            type: "password",
            errorTxt: oldPswdErrorTxt,
            setErrorTxt: setOldPswdErrorTxt,
        },
    ];

    // const correctOldPswd = useMemo(() => getSOILInfo().user?.pswd, []);

    // if (!correctOldPswd) {
    //     return <></>; // Just to be safe even though isLoggedIn will be true if it reaches here
    // }

    return (
        <Auth
            bgSrc={signUpBg}
            useEffectFunc={() => { }}
            dependancyArr={[]}
            handleSubmit={handleSubmit}
            title="Enter old password"
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
                        setOldPassword("");
                        navigate("/");
                    }}
                >
                    <ArrowBack sx={{ paddingRight: "5px" }} />
                    Go back
                </Button>
            }
        >
            <Typography>
                <Link component={RouterLink} to="/forgotPswd">
                    Forgot Password?
                </Link>
            </Typography>
        </Auth>
    );

    function handleSubmit(e: React.SyntheticEvent) {
        e.preventDefault();
        console.log(oldPassword);
        checkOldPswd(oldPassword).then((data) => {
            console.log(data);
            if (!data.data) {
                setOldPswdErrorTxt("Incorrect password");
                throw new Error(data.msg);
            }
            paginate(directions.next);

        }).catch((error) => {
            console.error(error);
        });
    }
}
