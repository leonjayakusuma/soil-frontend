import ParallaxPage from "@/shared/ParallaxPage";
import { Stack, Typography, Button } from "@mui/material";
import plant1 from "@/assets/plants1.jpg";
import { Item } from "@/types";
import ItemCard, { getFinalPrice } from "@/shared/ItemCard";
import Footer from "@/components/Footer";
import { useLocation } from "react-router-dom";
import { useEffect, useState, useMemo } from "react";
import queryString from "query-string";
import {
    MenuOptions,
    Sort,
    Filters,
    MinMax,
    sortProperty,
    orderOptions,
    defaultFilters,
    defaultSort,
} from "@/components/Shop";
import LoadingPage from "@/shared/LoadingPage";
import { Res, getAllItems } from "@/api";
import ErrorPage from "@/shared/ErrorPage";
import { setSOILItem, getSOILInfo } from "@/SoilInfo";

/**
This component handles the shop page of the application. It includes state management for 
the items in the shop, and uses the useLocation hook to get the current location's search 
string. It also parses the search string into query, sort, and filters parameters, and 
updates the items state based on these parameters.
 */
export default function Shop() {
    const [response, setResponse] = useState<Res<Item[]> | undefined>();
    const [itemsToShow, setItemsToShow] = useState<number>(12); // Initial number of items to display
    const ITEMS_PER_PAGE = 12; // Number of items to load per "Load More" click

    const location = useLocation();

    useEffect(() => {
        // Check for cached items first
        const cachedItems = getSOILInfo().items;

        if (cachedItems && cachedItems.length > 0) {
            setResponse({
                data: cachedItems,
                msg: "Loaded from cache",
                isError: false,
                status: 200,
            });
            // Don't make API request if we have cached items
            return;
        }

        // Abort controller for cleanup
        const abortController = new AbortController();
        let isMounted = true;
        const startTime = Date.now();

        getAllItems()
            .then((res) => {
                if (!isMounted || abortController.signal.aborted) {
                    return;
                }

                setResponse(res);

                if (res.data && res.data.length > 0) {
                    setSOILItem("items", res.data);
                } else if (res.isError) {
                    console.error("[Shop] Failed to fetch items:", res.msg);
                }
            })
            .catch((error) => {
                if (!isMounted || abortController.signal.aborted) {
                    return;
                }
                console.error("[Shop] Failed to fetch items:", error);
                setResponse({
                    data: undefined,
                    msg: "Failed to fetch items",
                    isError: true,
                    status: 500,
                    networkError: true,
                });
            });

        return () => {
            isMounted = false;
            abortController.abort();
        };
    }, []);

    // Compute filtered and sorted items using useMemo instead of useEffect
    const items = useMemo(() => {
        const { q, sort, filters } = getParsedMenuOptions(location.search);
        let tempItems = [...(response?.data ?? [])];

        if (tempItems.length > 0) {
            tempItems = applyQuery(tempItems, q);
            tempItems = applySort(tempItems, sort);
            tempItems = applyFilters(tempItems, filters);
        }

        return tempItems;
    }, [location.search, response?.data]);

    // Reset items to show when filters/search change
    useEffect(() => {
        setItemsToShow(ITEMS_PER_PAGE);
    }, [location.search]);

    if (!response) {
        return <LoadingPage />;
    }

    if (!response.data || response.isError) {
        // Just to be safe even though response.error will be true if response.data is undefined
        return <ErrorPage status={response.status} error={response.msg} />;
    }

    return (
        <ParallaxPage img={plant1}>
            <Stack
                direction="column"
                alignItems="center"
                sx={{ paddingTop: "100px" }}
            >
                <Typography variant="h2" textAlign="center" mb="100px" color="white">
                    Buy Fresh Foods, Catalogue Updated Daily
                </Typography>
                {items.length === 0 ? (
                    <Typography
                        variant="h3"
                        width="100% "
                        textAlign="center"
                        mb="100px"
                    >
                        {/* TODO: make better  */}
                        No search results found
                    </Typography>
                ) : (
                    <>
                        <Stack
                            direction="row"
                            flexWrap="wrap"
                            justifyContent="center"
                        >
                            {items.slice(0, itemsToShow).map((item: Item, index: number) => {
                                // Calculate local index for the current batch (resets for each Load More)
                                const previousBatchCount = Math.max(0, itemsToShow - ITEMS_PER_PAGE);
                                const localIndex = index >= previousBatchCount ? index - previousBatchCount : index;
                                return <ItemCard key={item.id} {...item} index={localIndex}></ItemCard>;
                            })}
                        </Stack>
                        {itemsToShow < items.length && (
                            <Button
                                variant="outlined"
                                onClick={() => setItemsToShow(prev => prev + ITEMS_PER_PAGE)}
                                sx={{
                                    mt: 4,
                                    mb: 4,
                                    px: 1.5,
                                    py: 0.7,
                                    fontSize: "16px",
                                    fontWeight: 600,
                                    color: "white",
                                    backgroundColor: "transparent",
                                    borderColor: "primary.main",
                                    borderWidth: "3px",
                                    "&:hover": {
                                        backgroundColor: "rgba(255, 255, 255, 0.15)",
                                        // borderColor: "white",
                                        transform: "scale(1.05)",
                                        borderWidth: "3px",
                                    },
                                }}
                            >
                                Load More
                            </Button>
                        )}
                    </>
                )}
            </Stack>
            <Footer />
        </ParallaxPage>
    );
}

function applyQuery(items: Item[], query: string): Item[] {
    if (query === "") {
        return items;
    }

    query = query.replaceAll("-", "").replaceAll(" ", "").toLowerCase();

    let freeRange: Item[] = [];

    const isFreeRange =
        query.includes("freerange") || "freerange".includes(query);

    if (isFreeRange) {
        // Find all the free-range before altering the items array
        // If there was a function which simultaneously removes and adds to isFreeRange, I would have used that
        // But this works. forEach might give weird results as I'm mutating the array itself by removing elements
        freeRange = getFreeRange(items);
    }

    items = items.filter((item) => {
        // Very basic search algo
        const title = item.title
            .replaceAll("-", "")
            .replaceAll(" ", "")
            .toLowerCase();
        return title.includes(query) || query.includes(title);
    });

    if (isFreeRange) {
        for (const freeRangeItem of freeRange) {
            // A set is really not necessary as items are <= 50, and I don't want to be one of em tabs using too much memory
            const exists = items.some((item) => item.id === freeRangeItem.id);

            if (!exists) {
                items.push(freeRangeItem);
            }
        }
    }

    return items;
}

function applySort(items: Item[], sort: Sort): Item[] {
    if (sort.sort === sortProperty.none) {
        return items;
    }

    const property = sortProperty[sort.sort] as keyof Item;

    const multiplier = sort.order == orderOptions.asc ? 1 : -1;

    items.sort(sortFunc);

    function getValue(item: Item): number {
        if (property === "price") {
            // Apply discount to get the final price
            return getFinalPrice(item.price, item.discount);
        }

        const value = item[property];

        if (typeof value !== "number") {
            return 0;
        }

        return value;
    }

    function sortFunc(item: Item, otherItem: Item): number {
        const itemVal = getValue(item);
        const otherVal = getValue(otherItem);

        return multiplier * (itemVal - otherVal);
    }

    return items; // technically no need to return since it mutates in place but since I do it for the others I do it here too
}

function applyFilters(items: Item[], filters: Filters): Item[] {
    if (filters.freerange) {
        // Show only freerange
        const freeRangeItemIds = getFreeRange(items).map(
            (freeRangeItem) => freeRangeItem.id,
        );
        items = items.filter((item) => freeRangeItemIds.includes(item.id));
    }

    if (filters.specials) {
        // Show only specials
        items = items.filter((item) => item.isSpecial);
    }

    items = items.filter(filterFunc);

    function checkMinMax(value: number, minMax: MinMax): boolean {
        const { min, max } = minMax;

        if (typeof value !== "number") {
        }

        return value >= min && value <= max;
    }

    function checkTags(item: Item, tags: string[]): boolean {
        // If no tags filter is set or empty array, allow all items
        if (!tags || tags.length === 0) {
            return true;
        }

        // If item has no tags, show it anyway (items might not have tags yet)
        if (!item.tags || item.tags.length === 0) {
            return true; // Show items without tags
        }

        // Check case-insensitive tag matching
        const itemTagsLower = item.tags.map(t => t.toLowerCase().trim());
        const filterTagsLower = tags.map(t => t.toLowerCase().trim());
        const itemTags = itemTagsLower.filter((tag) => filterTagsLower.includes(tag));
        const hasMatchingTag = !!itemTags.length;

        // Temporarily allow items with non-matching tags to see all items
        // TODO: Fix tag matching or update getAllTags() to include all possible tags
        if (!hasMatchingTag) {
            return true; // Temporarily show all items regardless of tag match
        }

        return hasMatchingTag;
    }

    function filterFunc(item: Item): boolean {
        // Gonna use boolean chaining so that when one fails, it doesn't bother checking the others
        const priceOk = checkMinMax(item["price"], filters.price);
        const ratingOk = checkMinMax(item["reviewRating"], filters.reviewRating);
        const countOk = checkMinMax(item["reviewCount"], filters.reviewCount);
        const discountOk = checkMinMax(item["discount"], filters.discount);
        const tagsOk = checkTags(item, filters.tags);

        const passes = priceOk && ratingOk && countOk && discountOk && tagsOk;


        return passes;
    }

    return items;
}

export function getParsedMenuOptions(search: string): MenuOptions {
    const params = queryString.parse(search);

    const q = (params.q ?? "") as string;

    if (params.sort) {
        var sort: Sort | undefined = JSON.parse(params.sort as string);
    }

    if (params.filters) {
        var filters: Filters | undefined = JSON.parse(params.filters as string);
    }

    return { q, sort: sort ?? defaultSort, filters: filters ?? defaultFilters };
}

function getFreeRange(items: Item[]) {
    return items.filter(
        (item) => item.tags.includes("meat") || item.tags.includes("poultry"),
    );
}
