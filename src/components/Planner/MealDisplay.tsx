import { Recipe } from "@/types";
import { DayMeal } from "@/components/Planner";
import {
    Pagination,
    Stack,
    Card,
    CardMedia,
    CardContent,
    Typography,
    Box,
    Link,
} from "@mui/material";
import { useState } from "react";

/** Displays the meals for that specific day */
export function MealDisplay({ meals }: { meals: DayMeal[] }) {
    const numPages = meals.length;
    // const numPages = 7; // TODO: Change to real value

    const [currPage, setCurrPage] = useState(0);

    if (numPages === 0) {
        return <Typography>No meals to display based on settings</Typography>;
    }

    return (
        <>
            <Stack spacing={2}>
                <Pagination
                    count={numPages}
                    variant="outlined"
                    shape="rounded"
                    page={currPage + 1}
                    onChange={(_, newPage) => {
                        setCurrPage(newPage - 1); // Since 0 index
                    }}
                    sx={{
                        "& .MuiPaginationItem-root": {
                            color: "white",
                        },
                    }}
                />
            </Stack>
            <DayMealsDisplay dayMeal={meals[currPage]} />
        </>
    );
}

function DayMealsDisplay({ dayMeal }: { dayMeal: DayMeal }) {
    const mealNames: (keyof DayMeal)[] = ["breakfast", "lunch", "dinner"];

    return (
        <Box
            width="800px"
            sx={{
                "@media (max-width: 800px)": {
                    width: "100%",
                },
            }}
        >
            {mealNames.map((mealName) => (
                <DayMealDisplay
                    key={mealName}
                    name={mealName.charAt(0).toUpperCase() + mealName.slice(1)}
                    mealInfo={dayMeal[mealName]}
                />
            ))}
        </Box>
    );
}

function DayMealDisplay({
    name,
    mealInfo,
}: {
    name: string;
    mealInfo: Recipe;
}) {
    return (
        <Card
            sx={{
                width: "100%",
                my: "30px",
                boxShadow: "0px 0px 15px 5px rgba(0,0,0,0.5)",
                transition: "box-shadow 0.3s ease",
                "&:hover": {
                    boxShadow: "0px 0px 50px 20px rgba(0,0,0,0.5)",
                },
                padding: "20px",
            }}
        >
            <Typography
                variant="h2"
                fontFamily={`"Open Sans", sans-serif`}
                fontWeight={800}
                textAlign={"center"}
                padding={"10px"}
                sx={{
                    "@media (max-width: 350px)": {
                        fontSize: "50px",
                    },
                }}
            >
                {name}
            </Typography>

            <Typography variant="h4" fontWeight={500} padding={"10px"}>
                {mealInfo.name}
            </Typography>
            <CardMedia
                component="img"
                image={`/src/assets/recipepics/${mealInfo.id}.webp`}
                alt={`Image of ${name}`}
                sx={{
                    width: "100%",
                    aspectRatio: "1/1",
                    borderRadius: "10px",
                }}
            />
            <CardContent>
                <Typography mt={"10px"}>
                    <strong>Calories:</strong> {mealInfo.calories}
                </Typography>
                <Typography fontWeight={700} mt={"10px"}>
                    Ingredients:
                </Typography>
                <ul>
                    {mealInfo.ingredients.map((ingredient, index) => (
                        <li key={index}>&nbsp;- {ingredient}</li>
                    ))}
                </ul>
                <Typography fontWeight={700} mt={"20px"}>
                    Instructions:
                </Typography>
                <ol>
                    {mealInfo.instructions.map((instruction, index) => (
                        <li key={index}>&nbsp;{"- " + instruction}</li>
                    ))}
                </ol>
                {mealInfo.link && (
                    <Link
                        mt={"20px"}
                        href={mealInfo.link}
                        target="_blank"
                        rel="noreferer"
                    >
                        More Details
                    </Link>
                )}
            </CardContent>
        </Card>
    );
}
