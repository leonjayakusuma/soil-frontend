import { Ctx, Container } from "@/components/Personalinfo";
import { PersonalInfo } from "@shared/types";
import { useState, useContext } from "react";
import NumericInput from "@/shared/NumericInput";

type NumKeyTypes = {
    [K in keyof PersonalInfo]: PersonalInfo[K] extends number ? K : never;
}[keyof PersonalInfo];

/**
This component handles the numeric input fields in the personal information form for the user's planner. 
It includes a NumericInput component for user input and state management for the field value.

The component receives several props including name, label, min, max, and endTxt. name is the name of 
the field. label is an optional string to be displayed as the label of the field. min and max are the 
minimum and maximum values for the field. endTxt is an optional string to be displayed at the end of the field.

The component uses the Ctx context to access the state of the planner information and a function to handle 
changes to the planner information. The useState hook is used to manage the state of the field value.
 */
export function NumInput({
    name,
    label = name,
    min,
    max,
    endTxt,
}: {
    name: NumKeyTypes;
    label?: string;
    min: number;
    max: number;
    endTxt?: string;
}) {
    const [plannerInfo, handleChange] = useContext(Ctx)!;

    const [val, setVal] = useState(plannerInfo[name]);

    return (
        <Container name={label}>
            <NumericInput
                inc={() => incDec(1)}
                dec={() => incDec(-1)}
                min={min}
                max={max}
                endTxt={endTxt}
                value={isNaN(val) ? "" : val}
                onChange={(e) => setVal(parseInt(e.target.value))}
                onBlur={() => {
                    if (isNaN(val)) {
                        setVal(plannerInfo[name]);
                    } else {
                        const num = clamp(min, max, val);
                        setVal(num);
                        handleChange(name, num);
                    }
                }}
            />
        </Container>
    );

    function incDec(num: number) {
        setVal((prev) => {
            prev = isNaN(prev) ? plannerInfo[name] : prev; // Just to be safe, even though onBlur kicks in when the user clicks the arrow and blurs out
            const newNum = clamp(min, max, prev + num);
            handleChange(name, newNum);
            return newNum;
        });
    }
}

function clamp(min: number, max: number, num: number) {
    return Math.min(max, Math.max(min, num));
}
