import { NavBarStyles } from "@/components/Navbar/Navbar";
import {
    Filters,
    MenuOptions,
    MinMax,
    orderOptions,
    sortProperty as sortPropertyEnum,
    NumericInput,
    Tags,
} from "@/components/Shop";
import {
    Box,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    SelectChangeEvent,
    Stack,
    IconButton,
    Typography,
    SxProps,
    Theme,
    Checkbox,
    FormGroup,
} from "@mui/material";
import { CSSProperties } from "@mui/system/CSSProperties";
import { useEffect, useState } from "react";
import SortIcon from "@mui/icons-material/Sort";
import FormControlLabel from "@mui/material/FormControlLabel";

/**
This component handles the search options for the shop. It includes a FormControl for 
selecting the sort order, a FormGroup for selecting the tags, and an IconButton for 
toggling the visibility of the search options.

The component receives several props including styles, options, and setOptions. styles 
is an object containing the styles for the component. options is an object containing 
the current search options. setOptions is a function to set the state of the search options.
 */
export function SearchOptions({
    styles,
    options,
    setOptions,
}: {
    styles: NavBarStyles;
    options: Omit<MenuOptions, "q">;
    setOptions: React.Dispatch<React.SetStateAction<Omit<MenuOptions, "q">>>;
}) {
    function setSortProperty(newSortProperty: sortPropertyEnum) {
        setOptions((options) => ({
            ...options,
            sort: { sort: newSortProperty, order: options.sort.order },
        }));
    }

    function setSortOrder(newOrder: orderOptions) {
        setOptions((options) => ({
            ...options,
            sort: { sort: options.sort.sort, order: newOrder },
        }));
    }

    function setFilterTags(newTags: string[]) {
        setOptions((options) => ({
            ...options,
            filters: {
                ...options.filters,
                tags: newTags,
            },
        }));
    }

    function setShowSpecials(newValue: boolean) {
        setOptions((options) => ({
            ...options,
            filters: {
                ...options.filters,
                specials: newValue,
            },
        }));
    }

    function setShowFreerange(newValue: boolean) {
        setOptions((options) => ({
            ...options,
            filters: {
                ...options.filters,
                freerange: newValue,
            },
        }));
    }

    type FilterMinMaxProperty = Omit<
        keyof Filters,
        "tags" | "specials" | "freerange"
    >;
    function setMinMaxes(
        filterPropertyName: FilterMinMaxProperty,
        minMax: MinMax,
    ) {
        setOptions((options) => ({
            ...options,
            filters: {
                ...options.filters,
                [filterPropertyName as string]: minMax,
            },
        }));
    }

    type FilterComponentInfo = {
        title: string;
        property: FilterMinMaxProperty;
        endTxt?: string;
        maximum?: number;
    };
    const filterComponentInfos: FilterComponentInfo[] = [
        { title: "Price", property: "price", endTxt: "AUD" },
        {
            title: "Review Rating",
            property: "reviewRating",
            endTxt: "★",
            maximum: 5,
        },
        { title: "Review Count", property: "reviewCount" },
        { title: "Discount", property: "discount", endTxt: "%", maximum: 100 },
    ];

    return (
        <Box
            sx={{
                ...styles.boxStyle,
                display: "block",
                m: 0,
                mt: (styles.boxStyle as CSSProperties).margin,
                width: "630px",
                "@media (max-width: 640px)": {
                    width: "420px",
                },
                "@media (max-width: 430px)": {
                    width: "320px",
                },
            }}
            color="white"
        >
            <Sort
                property={options.sort.sort}
                setProperty={setSortProperty}
                order={options.sort.order}
                setOrder={setSortOrder}
            />

            {filterComponentInfos.map(
                ({ title, property, endTxt, maximum }) => (
                    <FilterMinMax
                        key={property as string}
                        title={title}
                        setMinMax={(minMax) => {
                            setMinMaxes(property, minMax);
                        }}
                        endTxt={endTxt}
                        maximum={maximum}
                    />
                ),
            )}
            <Tags tags={options.filters.tags} setTags={setFilterTags} />

            <FormGroup row sx={{ ml: 0.3 }}>
                <FormControlLabel
                    control={
                        <Checkbox
                            onChange={(e) => {
                                setShowSpecials(e.target.checked);
                            }}
                        />
                    }
                    label="Show only specials"
                />
                <FormControlLabel
                    control={
                        <Checkbox
                            onChange={(e) => {
                                setShowFreerange(e.target.checked);
                            }}
                        />
                    }
                    label="Show only freerange"
                />
            </FormGroup>
        </Box>
    );
}

function Sort({
    property,
    order,
    setProperty,
    setOrder,
}: {
    property: sortPropertyEnum;
    order: orderOptions;
    setProperty: (newSortProperty: sortPropertyEnum) => void;
    setOrder: (newOrder: orderOptions) => void;
}) {
    return (
        <Stack direction="row">
            <FormControl variant="filled" sx={{ width: "32%" }}>
                <InputLabel id="sort by label" sx={{ color: "white" }}>
                    Sort By
                </InputLabel>
                <Select
                    value={
                        property === sortPropertyEnum.none
                            ? ""
                            : property.toString()
                    }
                    onChange={(e: SelectChangeEvent) => {
                        setProperty(parseInt(e.target.value));
                    }}
                    labelId="sort by label"
                    MenuProps={{
                        sx: { zIndex: 1302 },
                    }}
                    sx={{
                        color: "white",
                        ".MuiSelect-icon": {
                            color: "white", // DD icon color
                        },
                        "&:before": {
                            borderBottom: "1px solid white !important",
                        },
                    }}
                >
                    <MenuItem value="">
                        <em>None</em>
                    </MenuItem>
                    <MenuItem value={sortPropertyEnum.price}>Price</MenuItem>
                    <MenuItem value={sortPropertyEnum.reviewRating}>
                        Review Rating
                    </MenuItem>
                    <MenuItem value={sortPropertyEnum.reviewCount}>
                        Review Count
                    </MenuItem>
                    <MenuItem value={sortPropertyEnum.discount}>
                        Discount
                    </MenuItem>
                </Select>
            </FormControl>

            <Stack
                direction="row"
                marginLeft={0.5}
                justifyContent="space-evenly"
                alignItems="center"
                // minWidth={DD_MIN_WIDTH / 2}
                width="100%"
            >
                <OrderBtn
                    txt="Asc"
                    arialabel="sort ascending"
                    isActive={order === orderOptions.asc}
                    onClick={() => {
                        setOrder(orderOptions.asc);
                    }}
                    icon={<SortIcon sx={{ transform: "scale(-1)" }} />}
                />
                <OrderBtn
                    txt="Desc"
                    arialabel="sort descending"
                    isActive={order === orderOptions.desc}
                    onClick={() => {
                        setOrder(orderOptions.desc);
                    }}
                    icon={<SortIcon />}
                />
            </Stack>
        </Stack>
    );
}

function OrderBtn({
    txt,
    arialabel,
    icon,
    onClick,
    isActive,
}: {
    txt: string;
    arialabel: string;
    icon: React.ReactNode;
    onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
    isActive: boolean;
}) {
    const hoverCol = isActive ? "#144718" : "inherit";

    const defaultSx: SxProps<Theme> = {
        borderRadius: 1,
        border: "1px solid white",
        transition: "border-color 0.5s ease",
        backgroundColor: hoverCol,
        ml: 0.5,
        "&:hover": {
            borderColor: "black",
            backgroundColor: hoverCol,
        },
        color: "white",
    };

    return (
        <IconButton aria-label={arialabel} sx={defaultSx} onClick={onClick}>
            <Typography textAlign="center">{txt}</Typography>
            {icon}
        </IconButton>
    );
}

function FilterMinMax({
    title,
    setMinMax,
    endTxt,
    minimum = 0,
    startVal = 0,
    maximum = Number.MAX_SAFE_INTEGER,
}: {
    title: string;
    setMinMax: (minMax: MinMax) => void;
    endTxt?: string;
    minimum?: number;
    startVal?: number;
    maximum?: number;
}) {
    const [min, setMin] = useState<number | undefined>();
    const [max, setMax] = useState<number | undefined>();

    useEffect(() => {
        const minMax: MinMax = {
            min: min ?? minimum,
            max: max ?? maximum,
        };

        setMinMax(minMax);
    }, [min, max]);

    return (
        <Stack direction="row" mt={0.5} alignItems="center" width={"100%"}>
            <Typography
                variant="h6"
                ml={0.3}
                width="32%"
                sx={{
                    "@media (max-width: 420px)": {
                        fontSize: "16px",
                    },
                }}
            >
                {title}:
            </Typography>
            <Stack direction="row" ml={0.5} gap={0.3} width={"100%"}>
                <NumericInput
                    startTxt="min"
                    endTxt={endTxt}
                    min={minimum}
                    startVal={startVal}
                    max={(max !== undefined ? max : maximum) - 1}
                    setNum={setMin}
                />
                <NumericInput
                    startTxt="max"
                    endTxt={endTxt}
                    min={(min !== undefined ? min : minimum) + 1}
                    startVal={startVal + 1}
                    max={maximum}
                    setNum={setMax}
                />
            </Stack>
        </Stack>
    );
}
