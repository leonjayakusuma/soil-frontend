import Center from "@/shared/Center";
import { Box, Link, Typography } from "@mui/material";

// Didn't bother styling much as this is only the credits page for legal reasons
export default function Credits() {
    const fileNameLinks = [
        [
            "gardening by John Boga",
            "https://unsplash.com/photos/greyscale-photo-of-gardening-tools-hYbWJvCHVRo",
        ],
        [
            "bg vid (part 1) by Kindel Media",
            "https://www.pexels.com/video/a-close-up-video-of-vegetables-on-the-farm-7456696/",
        ],
        [
            "bg vid (part 2) by Roman Odintsov",
            "https://www.pexels.com/video/tomatoes-plantation-6520474/",
        ],
        [
            "bg vid (part 3) by Zen Chung",
            "https://www.pexels.com/video/women-checking-the-newly-harvested-eggplants-5527769/",
        ],

        [
            "water drop by drejzina248867",
            "https://www.vecteezy.com/vector-art/2297984-water-drop-international-water-power-plant-life-giving-moisture-cartoon-style",
        ],
        [
            "sun by goff.brian",
            "https://www.vecteezy.com/vector-art/551126-sun-icon",
        ],
        [
            "soil1 by studiogstock",
            "https://www.vecteezy.com/vector-art/3807679-ground-in-sack",
        ],
        [
            "soil by studiogstock",
            "https://www.vecteezy.com/vector-art/16870754-compost-vector-icon-design",
        ],
        [
            "pest by max.icons",
            "https://www.flaticon.com/free-icon/pests_1886956",
        ],
        [
            "season by freepik",
            "https://www.flaticon.com/free-icon/season_2964502?term=season&page=1&position=2&origin=search&related_id=2964502",
        ],
        [
            "prune by smashicons",
            "https://www.flaticon.com/free-icon/pruning-shears_2296453?term=prune&page=1&position=2&origin=search&related_id=2296453",
        ],
    ];

    const itempics = [
        "https://unsplash.com/photos/shallow-focus-photography-of-brown-eggs-Hj53USePB1E",
        "https://unsplash.com/photos/raw-chicken-meat-on-brown-wooden-chopping-board-9zLa37VNL38",
        "https://unsplash.com/photos/a-person-holding-a-piece-of-bread-with-cottage-cheese-on-it-HVa4BCkBl-A",
        "https://unsplash.com/photos/grilled-fish-cooked-vegetables-and-fork-on-plate-bpPTlXWTOvg",
        "https://unsplash.com/photos/a-school-of-fishes-eJlYVMkyPXI",
        "https://unsplash.com/photos/closeup-photo-of-red-pepper-and-herbs-M3M7D7LZ_n0",
        "https://unsplash.com/photos/assorted-fruits-zeFy-oCUhV8",
        "https://unsplash.com/photos/orange-mushy-dish-in-bow-e75FKtu30fQ",
        "https://unsplash.com/photos/brown-wooden-chopping-board-with-black-beans-and-brown-dried-leaves-uaHShoIDGeo",
        "https://unsplash.com/photos/a-wooden-bowl-filled-with-sugar-on-top-of-a-wooden-table-u_Mwofs_zu0",
        "https://unsplash.com/photos/sliced-bread-on-white-table-KDxZBfEJ6fA",
        "https://unsplash.com/photos/sliced-breads-on-white-surface-WHJTaLqonkU",
        "https://unsplash.com/photos/mason-jar-filled-with-smoothie-S1HuosAnX-Y",
        "https://unsplash.com/photos/two-black-and-white-dairy-cows-looking-on-white-bottles-ru4jyDiLHsI",
        "https://unsplash.com/photos/white-sheep-on-green-grass-field-during-daytime-WpDvF_Ckxzg",
        "https://unsplash.com/photos/selective-focus-photography-of-white-goat-jAMcUbsTvWE",
        "https://unsplash.com/photos/rice-in-bowl-xmuIgjuQG0M",
        "https://unsplash.com/photos/a-glass-bowl-filled-with-rice-on-top-of-a-white-table-wGDGlVxEE20",
        "https://unsplash.com/photos/sliced-lemon-in-white-ceramic-cup-pege1BFGPPc",
        "https://unsplash.com/photos/brown-and-white-ceramic-bowl-GuJ8KO4LywI",
        "https://unsplash.com/photos/green-fruits-on-black-surface-gwxcddjTbw4",
        "https://unsplash.com/photos/sliced-papaya-on-green-banana-leaf-Ooj1c6fhdFM",
        "https://unsplash.com/photos/half-peeled-banana-fruit-0v_1TPz1uXw",
        "https://unsplash.com/photos/watermelon-close-up-photography-aFUHu9WNO3Q",
        "https://unsplash.com/photos/one-red-apple-CoqJGsFVJtM",
        "https://unsplash.com/photos/closeup-photography-of-red-cherry-CR28Ot0ckaE",
        "https://unsplash.com/photos/green-apple-fruit-on-pink-surface-oo3kSFZ7uHk",
        "https://unsplash.com/photos/green-leaf-vegetable-_zV74zUnwmc",
        "https://unsplash.com/photos/cauliflower-vegetable-macro-photography-D8ZrftlvNDE",
        "https://unsplash.com/photos/green-leaf-vegetable-on-white-surface-7iRMOXXxH7c",
        "https://unsplash.com/photos/green-leafy-vegetables-4jpNPu7IW8k",
        "https://unsplash.com/photos/green-and-white-flower-bouquet-4fTaeH37eH0",
        "https://unsplash.com/photos/red-tomatoes-on-brown-wooden-table-eb26eV-ys_k",
        "https://unsplash.com/photos/orange-carrots-on-green-grass-GHRT9j21m2M",
        "https://unsplash.com/photos/green-round-fruits-in-close-up-photography-Sgnhru4-z78",
        "https://unsplash.com/photos/green-and-brown-plant-on-black-textile-pbdj5YkTTRk",
        "https://unsplash.com/photos/a-peanut-butter-and-jelly-sandwich-on-a-cutting-board-zG_Mm1XS25I",
        "https://unsplash.com/photos/sauce-on-bowl-SWyfzICySco",
        "https://unsplash.com/photos/a-jar-of-jam-sitting-on-top-of-a-wooden-cutting-board-H-k2TvVj3g0",
        "https://unsplash.com/photos/brown-coffee-beans-beside-white-ceramic-mug-h9Iq22JJlGk",
        "https://unsplash.com/photos/a-cup-of-tea-with-a-green-leaf-in-it-avqy2o8s2DA",
        "https://unsplash.com/photos/cooked-food-on-tray-sosOqjx31Go",
        "https://unsplash.com/photos/rice-with-meat-and-vegetable-dish-zxPLJJz2o_c",
        "https://unsplash.com/photos/sliced-cheese-on-clear-glass-plate-094mP_CBdpM",
        "https://unsplash.com/photos/yellow-cheese-on-green-and-white-ceramic-plate-nnRdjlAhShI",
    ];

    return (
        <Center>
            <Box
                mt={5}
                sx={{
                    fontSize: "30px",
                    padding: "50px",
                }}
            >
                <Typography variant="h3" mt={2}>
                    To get the homepage fruits picture the following 3 websites
                    were used
                </Typography>
                <Link
                    href="https://www.vecteezy.com/photo/35819558-ai-generated-shopping-bag-in-the-open-with-fruits-and-vegetables"
                    target="_blank"
                >
                    Taken from vecteezy
                </Link>
                <Link href="https://www.remove.bg/" target="_blank">
                    Background removed using remove.bg
                </Link>
                <Link href="https://www.waifu2x.net/" target="_blank">
                    waifu2x was used to upscale it
                </Link>
                {fileNameLinks.map(([title, link]) => (
                    <>
                        <Link key={title} href={link} target="_blank">
                            {title}
                        </Link>
                        <br />
                    </>
                ))}
                <br />
                <Typography variant="h3">
                    All item's pics based on id:
                </Typography>
                {itempics.map((link, idx) => (
                    <>
                        <Link key={idx} href={link} target="_blank">
                            {idx + 1}
                        </Link>
                        <br />
                    </>
                ))}

                <Typography variant="h3" mt={2}>
                    All recipes and recipe pictures were taken from the
                    following website:
                </Typography>
                <Link
                    href="https://www.eatingwell.com/gallery/7827780/400-calorie-high-protein-dinner-recipes/"
                    target="_blank"
                >
                    EatingWell
                </Link>
            </Box>
        </Center>
    );
}
