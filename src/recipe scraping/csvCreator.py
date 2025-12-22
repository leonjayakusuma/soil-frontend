import json
from csv import DictWriter


def json_to_csv(json_string, csv_file):
    data = json.loads(json_string)

    fieldnames = [
        "name",
        "calories",
        "carbs",
        "fat",
        "protein",
        "ingredients",
        "instructions",
        "link",
    ]

    with open(csv_file, "w", newline="", encoding="utf-8") as csvfile:
        writer = DictWriter(csvfile, fieldnames=fieldnames)

        writer.writeheader()

        for item in data:
            writer.writerow(item)


def main():
    csv_file = "recipes.csv"
    with open("rawjsondata.json", "r", encoding="utf-8") as file:
        json_string = file.read()
        json_to_csv(json_string, csv_file)


if __name__ == "__main__":
    main()
