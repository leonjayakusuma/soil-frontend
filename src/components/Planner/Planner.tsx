import { getSOILInfo } from "@/SoilInfo";
import { Typography, Link, Button, Stack } from "@mui/material";
import {
    useContext,
    useEffect,
    useLayoutEffect,
    useMemo,
    useState,
} from "react";
import { useNavigate } from "react-router-dom";
import { Link as RouterLink } from "react-router-dom";
import { MealDuration, MealDisplay } from "@/components/Planner";
import { PersonalInfo } from "@shared/types";
import { Recipe } from "@shared/types";
import { usePopup } from "@/shared/Popup";
import { Res, getAllRecipes, getPersonalInfo } from "@/api";
import LoadingPage from "@/shared/LoadingPage";
import ErrorPage from "@/shared/ErrorPage";
import { defaultPersonalInfo } from "../Personalinfo";

export type DayMeal = {
    breakfast: Recipe;
    lunch: Recipe;
    dinner: Recipe;
};

// type WeekMeal = {
//     day1: MealInfo;
//     day2: MealInfo;
//     day3: MealInfo;
//     day4: MealInfo;
//     day5: MealInfo;
//     day6: MealInfo;
//     day7: MealInfo;
// }; // Using this instead of an array for clarity

export enum mealDurations {
    daily = 1,
    weekly = 7,
}

/** Showcases the meal plan and the settings to generate a meal plan */
export default function Planner() {
    const isLoggedIn = !!getSOILInfo().userInfo;
    const navigate = useNavigate();
    const popup = usePopup()!;

    const [personalInfoRes, setPersonalInfoRes] = useState<
        Res<PersonalInfo> | undefined
    >();

    const [recipeRes, setRecipeRes] = useState<Res<Recipe[]> | undefined>();

    const [duration, setDuration] = useState(mealDurations.daily);

    const [meals, setMeals] = useState<DayMeal[]>([]);

    useLayoutEffect(() => {
        if (!isLoggedIn) {
            navigate("/login");
        }
    }, [navigate, isLoggedIn]);

    useEffect(() => {
        getPersonalInfo().then((response) => {
            if (!response.data) {
                popup("Please fill in your personal information first");
                navigate("/personalInfo");
            } else {
                setPersonalInfoRes(response);
            }
        }); // The function itself catches errors
        getAllRecipes().then(setRecipeRes);
    }, [isLoggedIn]);

    useLayoutEffect(() => {
        if (!isLoggedIn) {
            navigate("/login");
        }
    }, [navigate, isLoggedIn]);

    if (!personalInfoRes || !recipeRes) {
        return <LoadingPage />;
    }

    if (!personalInfoRes.data || personalInfoRes.isError) {
        // Just to be safe even though response.error will be true if response.data is undefined
        return (
            <ErrorPage
                status={personalInfoRes.status}
                error={personalInfoRes.msg}
            />
        );
    }

    if (!recipeRes.data || recipeRes.isError) {
        return <ErrorPage status={recipeRes.status} error={recipeRes.msg} />;
    }

    return (
        <Stack>
            <Stack alignItems="center" mt="150px" fontSize={"20px"}>
                <Typography fontSize={"30px"} textAlign={"center"}>
                    Click on generate to generate a meal plan based on your
                    personal information
                </Typography>
                <Typography fontSize={"20px"} textAlign={"center"}>
                    To edit your personal information, you can access it through
                    the profile page or click{" "}
                    <Link component={RouterLink} to="/personalInfo">
                        here
                    </Link>
                </Typography>
                <br />
                <MealDuration duration={duration} setDuration={setDuration} />
                <br />
                <Button
                    variant="contained"
                    sx={{
                        px: 2,
                        mb: 1,
                    }}
                    onClick={() => handleGenerate()}
                >
                    Generate
                </Button>
                <MealDisplay meals={meals} />
            </Stack>
        </Stack>
    );

    function handleGenerate() {
        const allMeals: DayMeal[] = [];

        for (let i = 0; i < duration; ++i) {
            const generatedMeal = generateDayMeal(
                personalInfoRes!.data ?? defaultPersonalInfo,
                recipeRes!.data!,
            );
            if (
                generatedMeal.breakfast &&
                generatedMeal.lunch &&
                generatedMeal.dinner
            ) {
                allMeals.push(
                    generateDayMeal(
                        personalInfoRes!.data ?? defaultPersonalInfo,
                        recipeRes!.data!,
                    ),
                );
            }
        }

        setMeals(allMeals);
    }
}

function generateDayMeal(
    {
        sex,
        weight,
        height,
        age,
        activityLevel,
        healthGoal: healthGoals,
    }: PersonalInfo,
    allRecipes: Recipe[],
): DayMeal {
    // https://www.diabetes.co.uk/bmr-calculator.html#:~:text=Once%20you've%20calculated%20your,BMR%20*%201.375%20%3D%20Total%20Calorie%20Need
    const BMR = getBMR(sex, weight, height, age);
    const totCaloriesPerDay = getCalorieIntakePerDay(BMR, activityLevel);
    // https://www.mayoclinichealthsystem.org/hometown-health/speaking-of-health/are-you-getting-too-much-protein#:~:text=The%20recommended%20dietary%20allowance%20to,grams%20of%20protein%20per%20day.
    // https://www.ncbi.nlm.nih.gov/pmc/articles/PMC6680710/#:~:text=Advanced%20bodybuilders%20should%20be%20more,pre%2D%20and%20post%2Dtraining.
    const proteinNeeded = weight * (healthGoals === "muscle gain" ? 2 : 1.1);
    // https://blog.nasm.org/how-many-grams-of-fat-per-day-to-lose-weight#:~:text=According%20to%20the%20Dietary%20Guidelines,34%2D68g%20fat%20per%20day.
    const fatNeeded = weight * (healthGoals === "weight loss" ? 0.5 : 1);

    const recipes = getAllValidRecipes(allRecipes);

    return {
        breakfast: recipes[Math.floor(Math.random() * recipes.length)],
        lunch: recipes[Math.floor(Math.random() * recipes.length)],
        dinner: recipes[Math.floor(Math.random() * recipes.length)],
    };

    function getBMR(
        sex: "male" | "female",
        weight: number,
        height: number,
        age: number,
    ) {
        const constants =
            sex === "male"
                ? [66.47, 13.75, 5.003, 6.755]
                : [655.1, 9.563, 1.85, 4.676];

        return (
            constants[0] +
            constants[1] * weight +
            constants[2] * height -
            constants[3] * age
        );
    }

    function getCalorieIntakePerDay(
        BMR: number,
        activityLevel: "low" | "med" | "high",
    ) {
        switch (activityLevel) {
            case "low":
                return BMR * 1.2;
            case "med":
                return BMR * 1.55;
            case "high":
                return BMR * 1.9;
            default:
                console.error("Invalid activity level");
                return 0;
        }
    }

    function getAllValidRecipes(recipes: Recipe[]): Recipe[] {
        // console.log("Before ", recipes);
        // let res = recipes.filter((reciper) => reciper.calories <= totCaloriesPerDay / 3);
        // console.log("After calorie filter: ", res);
        // res = res.filter((recipe) => recipe.protein <= proteinNeeded / 3);
        // console.log("After protein filter: ", res);
        // res = res.filter((recipe) => recipe.fat <= fatNeeded / 3);
        // console.log("After fat filter: ", res);
        // return res;
        return recipes.filter(
            (recipe) =>
                recipe.calories <= totCaloriesPerDay / 3 &&
                recipe.protein <= proteinNeeded / 3 &&
                recipe.fat <= fatNeeded / 3,
        );
    }
}
