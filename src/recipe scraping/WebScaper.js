// Scraped from this website - https://www.eatingwell.com/gallery/7827780/400-calorie-high-protein-dinner-recipes/
// All credits goes to that website
// Scraped data was stored in rawjsondata.json

(async function () {
    const aTags = document.querySelectorAll(
        ".mntl-sc-block-universal-featured-link__link.mntl-text-link.button--contained-standard.type--squirrel",
    );

    const links = Array.from(aTags).map((a) => a.href);

    const data = await Promise.all(
        links.map(async (link) => {
            const page = await fetch(link);
            const text = await page.text();
            const doc = new DOMParser().parseFromString(text, "text/html");
            return parseDoc(doc, link);
        }),
    );

    console.log(JSON.stringify(data));
})();

function parseDoc(document, link) {
    const name = document.querySelector(
        ".article-heading.type--lion",
    ).textContent;
    const { calories, carbs, fat, protein } = getNutritionalInfo(document);
    const ingredients = getIngredients(document);
    const instructions = getInstructions(document);

    return {
        name,
        calories,
        carbs,
        fat,
        protein,
        ingredients,
        instructions,
        link,
    };
}

function getIngredients(document) {
    const ingredientsLiEls = Array.from(
        document.querySelector(".mntl-structured-ingredients__list").children,
    );

    return ingredientsLiEls
        .map((li) => li.textContent.replaceAll("\n", "").trim())
        .join(". ");
}

function getInstructions(document) {
    const stepsLiEls = document.querySelector("#recipe__steps-content_1-0")
        .children[0].children;

    return Array.from(stepsLiEls)
        .map((li) => li.textContent.replaceAll("\n", "").trim())
        .join(". ");
}

function getNutritionalInfo(document) {
    const allInfoElements = document.querySelector(
        ".mntl-nutrition-facts-summary__table-body",
    ).children;

    const calories = allInfoElements[0].children[0].textContent;
    const fat = allInfoElements[1].children[0].textContent.trim().slice(0, -1); // Get rid of the `g`
    const carbs = allInfoElements[2].children[0].textContent
        .trim()
        .slice(0, -1); // Get rid of the `g`
    const protein = allInfoElements[3].children[0].textContent
        .trim()
        .slice(0, -1); // Get rid of the `g`

    return { calories, fat, carbs, protein };
}
