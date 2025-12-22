import { Box, IconButton, SxProps, TextField, Theme } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import SortIcon from "@mui/icons-material/Sort";
import { useEffect, useRef, useState } from "react";
import ClearIcon from "@mui/icons-material/Clear";
import queryString from "query-string";
import { usePopper } from "react-popper";
import { NavBarStyles } from "@/components/Navbar";
import { useLocation, useNavigate } from "react-router-dom";
import { getParsedMenuOptions, SearchOptions } from "@/components/Shop";
import { getAllTags } from "@/Items";

export enum sortProperty {
    none = -1,
    price,
    reviewRating,
    reviewCount,
    discount,
}

export enum orderOptions {
    asc,
    desc,
}

export type Sort = {
    sort: sortProperty;
    order: orderOptions;
};

export type MinMax = {
    min: number;
    max: number;
};

export type Filters = {
    price: MinMax;
    reviewRating: MinMax;
    reviewCount: MinMax;
    discount: MinMax;
    tags: string[];
    specials: boolean;
    freerange: boolean;
};

/* q -> string
sort -> DD, next to it asc and desc button
filter reviewRating -> min, max
filter reviewCount -> min, max
filter discount -> min, max
filter tags -> Have all the tags shown, click x will remove it
filter specials -> CB default checked */
export type MenuOptions = {
    q: string;
    sort: Sort;
    filters: Filters;
};

export const defaultFilters: Filters = {
    price: { min: 0, max: Number.MAX_SAFE_INTEGER },
    reviewRating: { min: 0, max: 5 },
    reviewCount: { min: 0, max: Number.MAX_SAFE_INTEGER },
    discount: { min: 0, max: 100 },
    tags: getAllTags(),
    specials: false,
    freerange: false,
};

export const defaultSort: Sort = {
    sort: sortProperty.none,
    order: orderOptions.asc,
};

export type ParsedMenuOptions = {
    [property in keyof MenuOptions]: string;
};

/**
This component handles the search functionality of the application. It includes an IconButton 
for focusing the search input field, a TextField for user input, and another IconButton for 
clearing the search query.

The component uses a ref (searchRef) to access the TextField and focus it when the search 
IconButton is clicked. The state of the search query is managed using the useState hook. 
The setQuery function is used to clear the search query when the clear IconButton is clicked.
 */
export function SearchBar({
    sx,
    navStyles,
}: {
    sx: SxProps<Theme>;
    navStyles: NavBarStyles;
}) {
    sx = {
        ...sx,
        "@media (max-width: 500px)": {
            gap: 0,
        },
    };

    const [query, setQuery] = useState("");

    const navigate = useNavigate();
    const location = useLocation();

    // URLSearchParams() isn't supported by all browsers -> https://caniuse.com/urlsearchparams
    // Therefore I will use queryString() for parsing etc

    const [otherMenuOptions, setOtherMenuOptions] = useState<
        Omit<MenuOptions, "q">
    >({ sort: defaultSort, filters: defaultFilters }); // Default values are only here for type safety, it would be overwritten by the values by the useEffect below

    // If the URL already has any parameters, extract them into otherMenuOptions and query so that it shows up in the popup
    useEffect(() => {
        const { q, sort, filters } = getParsedMenuOptions(location.search);

        setQuery(q);
        setOtherMenuOptions({ sort, filters });
    }, []);

    // Change the URL everytime the MenuOptions change
    useEffect(() => {
        const parsedOtherMenuOptions: Omit<ParsedMenuOptions, "q"> = {
            sort: "",
            filters: "", // No need to use defaultFilters because next line anyways extracts the filters
        };
        for (const [key, value] of Object.entries(otherMenuOptions)) {
            parsedOtherMenuOptions[key as keyof Omit<ParsedMenuOptions, "q">] =
                JSON.stringify(value);
        }

        const parsedMenuOptions: ParsedMenuOptions = {
            q: query,
            ...parsedOtherMenuOptions,
        };

        const parsedParams = queryString.stringify(parsedMenuOptions);
        if (
            Object.keys(parsedMenuOptions).length <= 1 &&
            parsedMenuOptions.q === ""
        ) {
            // history.replaceState({}, "", "/shop"); // Eventhough replaceState is more performant, it doesn't trigger a re-render
            navigate("/shop", { replace: true });
        } else {
            // history.replaceState({}, "", "?" + parsedParams);
            navigate("?" + parsedParams, { replace: true });
        }
    }, [query, otherMenuOptions]);

    const searchRef = useRef<HTMLInputElement | null>(null);

    /* Popover BS */
    const [isOpen, setIsOpen] = useState(false);
    const referenceElement = useRef(null);
    const [popperElement, setPopperElement] = useState(null);
    const { styles, attributes } = usePopper(
        referenceElement.current,
        popperElement,
        {
            placement: "bottom-end",
            modifiers: [
                {
                    name: "offset",
                    options: {
                        // offset: [0, 10],
                    },
                },
            ],
            strategy: "fixed",
        },
    );
    /* Popover BS over */

    return (
        <Box
            ref={referenceElement}
            sx={{
                ...sx,
                display: "flex",
            }}
            zIndex={2}
        >
            <IconButton
                color="inherit"
                sx={navStyles.iconBtnStyle}
                onClick={() => {
                    if (searchRef.current) {
                        searchRef.current.focus();
                    }
                }}
            >
                <SearchIcon />
            </IconButton>

            <TextField
                inputRef={searchRef}
                autoComplete="off"
                placeholder="Type here"
                fullWidth
                variant="outlined"
                size="small"
                InputProps={{
                    sx: {
                        backgroundColor: "#fff", // Background color for input area
                    },
                    endAdornment: (
                        <IconButton
                            onClick={() => setQuery("")}
                            edge="end"
                            sx={{ color: "gray" }}
                        >
                            <ClearIcon />
                        </IconButton>
                    ),
                }}
                value={query}
                onChange={(e) => {
                    setQuery(e.target.value);
                }}
            />
            <Popover
                isOpen={isOpen}
                popup={
                    <Box
                        ref={setPopperElement}
                        style={styles.popper}
                        {...attributes.popper}
                    >
                        <SearchOptions
                            styles={navStyles}
                            options={otherMenuOptions}
                            setOptions={setOtherMenuOptions}
                        />
                    </Box>
                }
            >
                <IconButton
                    color="inherit"
                    onClick={() => setIsOpen(!isOpen)}
                    sx={navStyles.iconBtnStyle}
                >
                    <SortIcon />
                </IconButton>
            </Popover>
        </Box>
    );
}

// https://blog.logrocket.com/5-best-popover-libraries-react/
function Popover({
    isOpen,
    popup,
    children,
}: {
    isOpen: boolean;
    popup: React.ReactNode;
    children: React.ReactNode;
}) {
    return (
        <Box>
            {children}
            {isOpen && popup}
        </Box>
    );
}
