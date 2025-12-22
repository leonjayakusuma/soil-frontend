import { useState } from "react";
import NumberInput from "@/shared/NumericInput"; // Exporting as a different name so it won't conflict

/**
This component handles a numeric input field with a range. It includes state management 
for the previous and current values of the field. The component receives several props 
including startTxt, endTxt, min, startVal, max, defaultVal, and setNum. startTxt and endTxt 
are optional strings to be displayed at the start and end of the input field. min and max 
are the minimum and maximum values for the input field. defaultVal is the default value 
of the input field. setNum is a function to set the state of the number value.
 */
export function NumericInput({
    startTxt = "",
    endTxt = "",
    min = -Number.MAX_SAFE_INTEGER,
    startVal = min,
    max = Number.MAX_SAFE_INTEGER,
    defaultVal,
    setNum,
}: {
    startTxt?: string;
    endTxt?: string;
    min?: number;
    startVal?: number;
    max?: number;
    defaultVal?: number;
    setNum:
        | React.Dispatch<React.SetStateAction<number | undefined>>
        | ((num: number | undefined) => void);
}) {
    type ValType = number | undefined;
    const [prevVal, setPrevVal] = useState<ValType>();
    const [val, setVal] = useState<ValType>(defaultVal);

    function incDec(mul: number) {
        let num = (val ?? startVal - 1 * mul) + 1 * mul;

        num = Math.min(Math.max(num, min), max);

        setVal(num);
        setNum(num);
    }

    function onBlur() {
        if (val === undefined || isNaN(val)) {
            // Happens when user deletes everything
            setVal(defaultVal);
            setNum(defaultVal);
        } else if (val >= min && val <= max) {
            setNum(val);
        } else {
            setVal(prevVal);
        }
    }

    return (
        <NumberInput
            inc={() => incDec(1)}
            dec={() => incDec(-1)}
            startTxt={startTxt}
            endTxt={endTxt}
            value={val ?? ""}
            onFocus={() => {
                setPrevVal(val);
            }}
            onChange={(e) => {
                setVal(parseInt(e.target.value));
            }}
            onBlur={onBlur}
        />
    );
}
