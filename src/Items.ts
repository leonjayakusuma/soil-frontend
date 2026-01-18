import { parse as csvParse } from "papaparse";
import { Item } from "@/types";

interface CSVRowType extends Omit<Item, "tags"> {
    tags: string;
}

const NUM_SPECIALS = 8;

// https://usecsv.com/community/top-javascript-csv-parsers
// fast-csv uses nodejs streams so it gave me errors, so instead using papaparse

export function getAllTags(): string[] {
    return [
        "prepared",
        "drinks",
        "spreads",
        "grains",
        "cereal",
        "veggie",
        "dairy",
        "meal",
        "vegan",
        "meat",
        "fruit",
        "poultry",
        "condiments",
        "fish",
    ];
}

export async function getCSVData<T>(fileName: string): Promise<T[]> {
    let result: T[] = [];

    try {
        const res = await fetch(fileName);
        if (!res.ok) {
            throw new Error(`CSV fetching error: ${res}`);
        }
        const data = await res.text();

        result = csvParse<T>(data, {
            skipEmptyLines: "greedy",
            header: true,
        }).data;
    } catch (err) {
        console.error(err);
    }

    return result;
}

// https://stackoverflow.com/a/19270021
function getRandomArr(arr: any[], n: number) {
    const result = new Array(n);
    let len = arr.length;
    const taken = new Array(len);

    if (n > len) {
        console.error("getRandomArr: more elements taken than available");
    }

    while (n--) {
        const x = Math.floor(Math.random() * len);
        result[n] = arr[x in taken ? taken[x] : x];
        taken[x] = --len in taken ? taken[len] : len;
    }

    return result;
}
