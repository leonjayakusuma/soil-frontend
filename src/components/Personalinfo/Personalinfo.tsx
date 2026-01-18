import { useState, createContext, useLayoutEffect, useEffect } from "react";
import { Box, Typography, Stack, Button } from "@mui/material";
import { getSOILInfo } from "@/SoilInfo";
import Center from "@/shared/Center";
import { useNavigate } from "react-router-dom";
import ManIcon from "@mui/icons-material/Man";
import WomanIcon from "@mui/icons-material/Woman";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import { NumInput, SexChip, DD } from "@/components/Personalinfo";
// import { UserInfo } from "@/Auth";
import ParallaxPage from "@/shared/ParallaxPage";
import plant1 from "@/assets/plants1.jpg";
import { usePopup } from "@/shared/Popup";
import { PersonalInfo } from "@/types";
import { Res, getPersonalInfo, updatePersonalInfo } from "@/api";
import LoadingPage from "@/shared/LoadingPage";
import ErrorPage from "@/shared/ErrorPage";

// TODO: Have unsaved changes thingy and ask if you still want to proceed

export const defaultPersonalInfo: PersonalInfo = {
    sex: "male",
    age: 20,
    weight: 50,
    weightGoal: 60,
    weightGainPerWeek: 1,
    height: 180,
    bodyFatPerc: 15,
    activityLevel: "low",
    dietaryPreference: "any",
    healthGoal: "health improvements",
};

export const Ctx = createContext<
    | [
          PersonalInfo,
          <T extends keyof PersonalInfo>(
              key: T,
              value: PersonalInfo[T],
          ) => void,
      ]
    | null
>(null);

const TEXT_PERC = 60;
const TEXT_WIDTH = TEXT_PERC + "%";
const INPUT_WIDTH = 100 - TEXT_PERC + "%";

/**
This component handles the personal information form for the user's planner. It includes 
state management for the planner information and uses the LogInCtx context to access the 
state of whether the user is logged in.

The component uses the useNavigate hook from 'react-router-dom' to navigate 
to different routes, and the useMemo hook to get the user's information from the server 
or local storage only when the isLoggedIn state changes.

The initialPlannerInfo variable is used to store the initial planner information. If the 
user is logged in and has planner information, it is used as the initial planner information. 
Otherwise, the defaultPlannerInfo constant is used.
 */
export default function Personalinfo() {
    const isLoggedIn = !!getSOILInfo().userInfo;
    const navigate = useNavigate();

    const [response, setResponse] = useState<Res<PersonalInfo> | undefined>();

    const popup = usePopup()!;

    useLayoutEffect(() => {
        if (!isLoggedIn) {
            navigate("/login");
        }
    }, [navigate, isLoggedIn]);

    useEffect(() => {
        getPersonalInfo().then((response) => {
            setResponse({
                ...response,
                data: response.data ?? defaultPersonalInfo,
            });
        }); // The function itself catches errors
    }, [isLoggedIn]);

    if (!response) {
        return <LoadingPage />;
    }

    if (!response.data || response.isError) {
        // Just to be safe even though response.error will be true if response.data is undefined
        return <ErrorPage status={response.status} error={response.msg} />;
    }

    return (
        <ParallaxPage img={plant1}>
            <Ctx.Provider value={[response.data, handleChange]}>
                <Center>
                    <Box
                        width="700px"
                        my={6}
                        // border={2}
                        boxShadow={"0px 0px 20px #AAA"}
                        borderRadius={2}
                        paddingY={2}
                        paddingX={3}
                        bgcolor={"white"}
                        color={"black"}
                        sx={{
                            "@media (max-width: 550px)": {
                                py: 3,
                            },
                        }}
                    >
                        <Typography
                            variant="h3"
                            fontFamily="monospace"
                            mb={2}
                            textAlign={"center"}
                            sx={{
                                "@media (max-width: 550px)": {
                                    fontSize: "2rem",
                                },
                            }}
                        >
                            Personal Information
                        </Typography>
                        <Sex />
                        <br />
                        <NumInputs />
                        <br />
                        <Dropdowns />
                        <br />
                        <hr />
                        <br />
                        <Center sx={{ mt: "20px" }}>
                            <Button
                                variant="contained"
                                color="inherit"
                                sx={{
                                    color: "rgb(100, 100, 100)",
                                    mx: 1,
                                    fontSize: "1.2rem",
                                }}
                                onClick={handleReset}
                            >
                                <RestartAltIcon sx={{ paddingRight: "5px" }} />
                                Reset
                            </Button>
                            <Button
                                type="submit"
                                variant="contained"
                                sx={{
                                    px: 1.5,
                                    mx: 1,
                                    fontSize: "1.2rem",
                                }}
                                onClick={handleSubmit}
                            >
                                Save
                            </Button>
                        </Center>
                    </Box>
                </Center>
            </Ctx.Provider>
        </ParallaxPage>
    );

    function handleChange<T extends keyof PersonalInfo>(
        key: T,
        value: PersonalInfo[T],
    ) {
        if (response?.data) {
            setResponse({
                ...response,
                data: { ...response.data, [key]: value },
            });
        }
    }

    function handleReset() {
        if (response) {
            setResponse({ ...response, data: defaultPersonalInfo });
        }
    }

    function handleSubmit() {
        if (response?.data) {
            updatePersonalInfo(response!.data!).then((response) => {
                popup(response.msg);
            });
        }
    }
}

export function Container({
    name,
    noStack = false,
    children,
}: {
    name: string;
    noStack?: boolean;
    children: React.ReactNode;
}) {
    return (
        <Stack
            direction="row"
            alignItems="center"
            my={0.3}
            sx={{
                "@media (max-width: 550px)": {
                    flexDirection: "column",
                    my: 1,
                },
            }}
        >
            <Typography
                variant="h5"
                width={TEXT_WIDTH}
                fontFamily="monospace"
                fontSize={24}
                textTransform="uppercase"
                // textAlign={"center"}
                // alignSelf={"center"}
                sx={{
                    "@media (max-width: 550px)": {
                        textAlign: "center",
                        fontSize: 20,
                        mb: 1,
                    },
                }}
            >
                {name + ":"}
            </Typography>
            {noStack ? (
                children
            ) : (
                <Stack direction="row" alignItems="center" flexGrow={1}>
                    {children}
                </Stack>
            )}
        </Stack>
    );
}

function NumInputs() {
    return (
        <Stack
            sx={{
                rowGap: "7px",
                mb: "20px",
                mt: "20px",
                "@media (max-width: 550px)": {
                    mt: "0",
                    mb: "0",
                    rowGap: "0",
                },
            }}
        >
            <NumInput name="age" min={0} max={999} endTxt="years" />
            <NumInput name="weight" min={0} max={300} endTxt="kg" />
            <NumInput
                name="weightGoal"
                label="weight goal"
                min={0}
                max={999}
                endTxt="kg"
            />
            <NumInput
                name="weightGainPerWeek"
                label="weight gain per week"
                min={0}
                max={10}
                endTxt="kg/week"
            />

            <NumInput name="height" min={0} max={300} endTxt="cm" />
            <NumInput
                name="bodyFatPerc"
                label="body fat %"
                min={0}
                max={100}
                endTxt="%"
            />
        </Stack>
    );
}

function Dropdowns() {
    return (
        <Stack rowGap={"7px"}>
            <DD
                name="Activity Level"
                width={INPUT_WIDTH}
                values={["low", "medium", "high"]}
                propertyName="activityLevel"
            />
            <DD
                name="Dietary Preferences"
                width={INPUT_WIDTH}
                values={["any", "vegetarian", "vegan"]}
                propertyName="dietaryPreference"
            />
            <DD
                name="Health Goals"
                width={INPUT_WIDTH}
                values={["weight loss", "health improvements", "muscle gain"]}
                propertyName="healthGoal"
            />
        </Stack>
    );
}

function Sex() {
    return (
        <Container name="sex">
            <SexChip name="male" icon={<ManIcon />} />
            <SexChip name="female" icon={<WomanIcon />} />
        </Container>
    );
}
