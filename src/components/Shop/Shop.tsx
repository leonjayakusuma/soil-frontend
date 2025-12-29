import ParallaxPage from "@/shared/ParallaxPage";
import { Stack, Typography } from "@mui/material";
import plant1 from "@/assets/plants1.jpg";
import { Item } from "@shared/types";
import ItemCard, { getFinalPrice } from "@/shared/ItemCard";
import Footer from "@/components/Footer";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
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
    const [items, setItems] = useState<Item[]>([]);
    const [response, setResponse] = useState<Res<Item[]> | undefined>();

    const location = useLocation();

    useEffect(() => {
        // Check for cached items first
        const cachedItems = getSOILInfo().items;

        if (cachedItems && cachedItems.length > 0) {
            console.log("[Shop] Using cached items, skipping API request:", cachedItems.length);
            setResponse({
                data: cachedItems,
                msg: "Loaded from cache",
                isError: false,
                status: 200,
            });
            // Don't make API request if we have cached items
            return;
        }

        // Only fetch if no cached items exist
        console.log("[Shop] No cache found, fetching all items...");

        // Abort controller for cleanup
        const abortController = new AbortController();
        let isMounted = true;
        const startTime = Date.now();

        getAllItems()
            .then((res) => {
                if (!isMounted || abortController.signal.aborted) {
                    console.log("[Shop] Request cancelled (component unmounted)");
                    return;
                }

                const fetchTime = Date.now() - startTime;
                console.log("[Shop] API Response:", {
                    hasData: !!res.data,
                    dataLength: res.data?.length ?? 0,
                    isError: res.isError,
                    status: res.status,
                    msg: res.msg,
                    networkError: res.networkError,
                    fetchTime: `${fetchTime}ms`,
                });

                setResponse(res);

                if (res.data && res.data.length > 0) {
                    setSOILItem("items", res.data);
                } else {
                    console.warn("[Shop] ⚠️ No items received from API");
                    if (res.isError) {
                        console.error("[Shop] API Error:", res.msg);
                    }
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

    useEffect(() => {
        const { q, sort, filters } = getParsedMenuOptions(location.search);
        let tempItems = [...(response?.data ?? [])];

        console.log("[Shop] Filtering items:", {
            originalCount: tempItems.length,
            query: q,
            sort,
            filters,
        });

        if (tempItems.length > 0) {
            const beforeQuery = tempItems.length;
            tempItems = applyQuery(tempItems, q);
            const afterQuery = tempItems.length;

            tempItems = applySort(tempItems, sort);

            const beforeFilters = tempItems.length;
            tempItems = applyFilters(tempItems, filters);
            const afterFilters = tempItems.length;

            console.log("[Shop] Filtering results:", {
                original: beforeQuery,
                afterQuery,
                afterFilters,
                queryRemoved: beforeQuery - afterQuery,
                filtersRemoved: beforeFilters - afterFilters,
            });

            if (afterFilters === 0 && beforeFilters > 0) {
                console.warn("[Shop] ⚠️ All items filtered out! Check filter settings:", filters);
            }
        } else {
            console.warn("[Shop] No items to filter - response.data is empty");
        }

        setItems(tempItems);
    }, [location.search, response?.data]);

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
                <Typography variant="h2" textAlign="center" mb="100px">
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
                    <Stack
                        direction="row"
                        flexWrap="wrap"
                        rowGap={2}
                        justifyContent="center"
                    >
                        {items.map((item: Item) => (
                            <ItemCard key={item.id} {...item}></ItemCard>
                        ))}
                    </Stack>
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
            console.error("sortFunc: expected number. Got: " + typeof value);
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
            console.error("checkMinMax: number expected. Got: " + typeof value);
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
            console.debug(`[Shop] Item "${item.title}" has no tags - allowing it`);
            return true; // Show items without tags
        }

        // Check case-insensitive tag matching
        const itemTagsLower = item.tags.map(t => t.toLowerCase().trim());
        const filterTagsLower = tags.map(t => t.toLowerCase().trim());
        const itemTags = itemTagsLower.filter((tag) => filterTagsLower.includes(tag));
        const hasMatchingTag = !!itemTags.length;

        // Log if item has no matching tags (for debugging)
        if (!hasMatchingTag) {
            console.warn(`[Shop] ⚠️ Item "${item.title}" tags [${item.tags.join(", ")}] don't match filter tags. Filter has: [${tags.slice(0, 5).join(", ")}${tags.length > 5 ? "..." : ""}]`);
            // Temporarily allow items with non-matching tags to see all items
            // TODO: Fix tag matching or update getAllTags() to include all possible tags
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

        // Log first few items that fail filtering (for debugging)
        const itemIndex = items.indexOf(item);
        if (!passes && itemIndex < 3) {
            console.warn(`[Shop] Item ${itemIndex} filtered out:`, {
                title: item.title,
                price: item.price,
                reviewRating: item.reviewRating,
                reviewCount: item.reviewCount,
                discount: item.discount,
                tags: item.tags,
                filterTags: filters.tags,
                checks: {
                    priceOk,
                    ratingOk,
                    countOk,
                    discountOk,
                    tagsOk,
                    priceRange: filters.price,
                    ratingRange: filters.reviewRating,
                    countRange: filters.reviewCount,
                    discountRange: filters.discount,
                },
            });
        }

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
