import { Chip, Stack, Typography } from "@mui/material";
import { mealDurations } from "@/components/Planner";

export function MealDuration({
    duration,
    setDuration,
}: {
    duration: mealDurations;
    setDuration: React.Dispatch<React.SetStateAction<mealDurations>>;
}) {
    return (
        <>
            <Typography>Meal Duration:</Typography>
            <Stack direction="row">
                <MealChip
                    duration={mealDurations.daily}
                    chosen={duration === mealDurations.daily}
                    handleChange={() => setDuration(mealDurations.daily)}
                />
                <MealChip
                    duration={mealDurations.weekly}
                    chosen={duration === mealDurations.weekly}
                    handleChange={() => setDuration(mealDurations.weekly)}
                />
            </Stack>
        </>
    );
}

function MealChip({
    duration,
    chosen,
    handleChange,
}: {
    duration: mealDurations;
    chosen: boolean;
    handleChange: () => void;
}) {
    const corner1 =
        duration === mealDurations.daily
            ? "borderTopRightRadius"
            : "borderTopLeftRadius";

    const corner2 =
        duration === mealDurations.daily
            ? "borderBottomRightRadius"
            : "borderBottomLeftRadius";

    const name = mealDurations[duration];

    return (
        <Chip
            sx={{
                flexGrow: 1,
                [corner1]: 0,
                [corner2]: 0,
                fontSize: "15px",
                color: "white",
            }}
            label={name.charAt(0).toUpperCase() + name.slice(1)}
            component="button"
            value={duration}
            onClick={handleChange}
            clickable
            color={chosen ? "primary" : "default"}
            variant={chosen ? "filled" : "outlined"}
        />
    );
}
