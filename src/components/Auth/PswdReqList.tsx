import { List, ListItem, ListItemIcon, ListItemText } from "@mui/material";
import { Done, Close } from "@mui/icons-material";
import { createContext, useContext } from "react";
import { theme } from "@/App";
import { getPswdValidities } from "@shared/utils";

const Ctx = createContext<PswdReqsType | null>(null);

/**
 * The PswdReqList component is a functional component that takes a pswdReqs object as a prop and
 *  displays a list of password requirements.
 * It imports several components from Material-UI, including List, ListItem, ListItemIcon, and ListItemText,
 *  as well as the theme from the App component and the getPswdValidities function from shared/utils.
 * The component creates a context, Ctx, with a default value of null.
 * The component returns a List component with no padding.
 * Inside the List, it provides the pswdReqs object to the Ctx context and maps over the keys of the pswdReqs object.
 * For each key, it returns a PswdReq component with the key as a prop.
 */
export function PswdReqList({ pswdReqs }: { pswdReqs: PswdReqsType }) {
    const pswdReqsKeys = Object.keys(pswdReqs) as (keyof PswdReqsType)[];

    return (
        <List sx={{ padding: 0 }}>
            <Ctx.Provider value={pswdReqs}>
                {pswdReqsKeys.map((pswdReqKey: keyof PswdReqsType) => {
                    return <PswdReq pswdReq={pswdReqKey} key={pswdReqKey} />;
                })}
            </Ctx.Provider>
        </List>
    );
}

function PswdReq({ pswdReq }: { pswdReq: keyof PswdReqsType }) {
    const pswdReqs = useContext(Ctx) as PswdReqsType; // Because it will never be null as I'm providing a value

    const color = pswdReqs[pswdReq].value ? "green" : "red";

    const filter = pswdReqs[pswdReq].highlight
        ? "drop-shadow(0 0 5px red) drop-shadow(0 0 10px red) drop-shadow(0 0 15px red)"
        : "none";

    return (
        <ListItem
            sx={{
                padding: 0,
                transition: "filter 1s ease-in",
                color,
                filter,
            }}
        >
            <ListItemIcon
                sx={{
                    color,
                    minWidth: 0,
                    marginRight: theme.spacing(0.7),
                    "& svg": {
                        width: theme.spacing(1.5),
                    },
                }}
            >
                {pswdReqs[pswdReq].value ? <Done /> : <Close />}
            </ListItemIcon>
            <ListItemText>{pswdReqs[pswdReq].text}</ListItemText>
        </ListItem>
    );
}

export const initialPswdReqs = {
    pswdLen: {
        text: "Password length must be at least 8 characters",
        value: false,
        highlight: false,
    },
    nameOrEmail: {
        text: "Cannot contain name or email address",
        value: false,
        highlight: false,
    },

    ul: {
        text: "Uppercase Letters",
        value: false,
        highlight: false,
    },
    ll: {
        text: "Lowercase Letters",
        value: false,
        highlight: false,
    },
    nums: {
        text: "Numbers",
        value: false,
        highlight: false,
    },
    specChars: {
        text: "Special characters",
        value: false,
        highlight: false,
    },
    pswdsMatch: {
        text: "Confirm password and the password should match",
        value: false,
        highlight: false,
    },
};

export function defaultUseEffect(
    setPswdReqs: (value: React.SetStateAction<PswdReqsType>) => void,
    name: string,
    email: string,
    pswd: string,
    confirmPswd: string,
) {
    const validities = getExtendedPswdValidities(
        name,
        email,
        pswd,
        confirmPswd,
    );
    for (const [condition, validity] of Object.entries(validities)) {
        changePswdReqValue(condition as keyof PswdReqsType, validity);
    }
    function changePswdReqValue(condition: keyof PswdReqsType, value: boolean) {
        // useReducer() seems overkill for this
        setPswdReqs((prevState) => ({
            ...prevState,
            [condition]: {
                ...prevState[condition],
                value,
            },
        }));
    }
}

export function changePswdReqsHighlighting(
    pswdReqs: Array<keyof PswdReqsType>,
    setPswdReqs: (value: React.SetStateAction<PswdReqsType>) => void,
) {
    for (const pswdReq of pswdReqs) {
        changePswdReqHighlighting(pswdReq, true);
        setTimeout(
            () =>
                changePswdReqHighlighting(pswdReq as keyof PswdReqsType, false),
            1000,
        );
    }

    function changePswdReqHighlighting(
        condition: keyof PswdReqsType,
        highlight: boolean,
    ) {
        setPswdReqs((prevState) => ({
            ...prevState,
            [condition]: {
                ...prevState[condition],
                highlight,
            },
        }));
    }
}

export function getExtendedPswdValidities(
    name: string,
    email: string,
    pswd: string,
    confirmPswd: string,
): { [P in keyof PswdReqsType]: boolean } {
    const { pswdLen, nameOrEmail, ul, ll, nums, specChars } = getPswdValidities(
        name,
        email,
        pswd,
    );
    const pswdsMatch = pswd !== "" && pswd === confirmPswd;

    return {
        pswdLen,
        nameOrEmail,
        ul,
        ll,
        nums,
        specChars,
        pswdsMatch,
    };
}

export type PswdReqType = {
    text: string;
    value: boolean;
    highlight: boolean;
};
export type PswdReqsType = {
    pswdLen: PswdReqType;
    nameOrEmail: PswdReqType;
    ul: PswdReqType;
    ll: PswdReqType;
    nums: PswdReqType;
    specChars: PswdReqType;
    pswdsMatch: PswdReqType;
};
