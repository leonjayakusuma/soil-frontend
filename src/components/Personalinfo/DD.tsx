import { Ctx, Container } from "@/components/Personalinfo";
import {
    FormControl,
    MenuItem,
    Select,
    SelectChangeEvent,
} from "@mui/material";
import { useContext } from "react";
import { PersonalInfo } from "@/types";

/**
This component handles the dropdown selection fields in the personal information form for the user's planner. 
It includes a FormControl and Select component for user interaction and state management for the selected value.

The component receives several props including name, width, values, and propertyName. name is the name of the 
field. width is the width of the field. values are the options for the dropdown. propertyName is the property 
of the PlannerInfo type that the field corresponds to.
 
The component uses the Ctx context to access the state of the planner information and a function to handle 
changes to the planner information. The handleChange function is used to set the state of the selected value 
when an option is selected in the dropdown.
 */
export function DD({
    name,
    width,
    values,
    propertyName,
}: {
    name: string;
    width: string;
    values: string[];
    propertyName: keyof PersonalInfo;
}) {
    const [plannerInfo, handleChange] = useContext(Ctx)!;

    return (
        <Container name={name} noStack={true}>
            <FormControl variant="outlined" sx={{ flexGrow: 1, width }}>
                <Select
                    value={plannerInfo[propertyName] as string}
                    onChange={(e: SelectChangeEvent) => {
                        handleChange(
                            propertyName,
                            e.target.value as PersonalInfo[typeof propertyName],
                        );
                    }}
                    sx={{
                        ".MuiSelect-icon": {
                            color: "white", // DD icon color
                        },
                        "&:before": {
                            borderBottom: "1px solid white !important",
                        },
                    }}
                >
                    {values.map((val) => (
                        <MenuItem value={val} key={val}>
                            {val.charAt(0).toUpperCase() + val.slice(1)}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        </Container>
    );
}
