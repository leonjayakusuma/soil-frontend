import { useContext } from "react";
import { Ctx } from "@/components/Personalinfo";
import { Chip } from "@mui/material";

/**
This component handles the sex selection in the personal information form for the user's planner. 
It includes a Chip component for user interaction and state management for the selected sex.

The component receives two props: name and icon. name is the name of the sex ("male" or "female"). 
icon is the icon for the sex.

The component uses the Ctx context to access the state of the planner information and a function 
to handle changes to the planner information. The handleChange function is used to set the state 
of the selected sex when the Chip component is clicked.
 */
export function SexChip({
    name,
    icon,
}: {
    name: "male" | "female";
    icon: React.ReactElement<any, string | React.JSXElementConstructor<any>>;
}) {
    const [plannerInfo, handleChange] = useContext(Ctx)!;
    const corner1 =
        name === "male" ? "borderTopRightRadius" : "borderTopLeftRadius";
    const corner2 =
        name === "male" ? "borderBottomRightRadius" : "borderBottomLeftRadius";
    return (
        <Chip
            sx={{
                flexGrow: 1,
                [corner1]: 0,
                [corner2]: 0,
                fontSize: "1rem",
                height: "50px",
            }}
            icon={icon}
            label={name.charAt(0).toUpperCase() + name.slice(1)}
            component="button"
            value={name}
            onClick={() => handleChange("sex", name)}
            clickable
            color={plannerInfo.sex === name ? "primary" : "default"}
            variant={plannerInfo.sex === name ? "filled" : "outlined"}
        />
    );
}
