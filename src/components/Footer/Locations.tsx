import { Typography, Link, Stack } from "@mui/material";

/**
 * The Locations component is a functional component that displays the locations in the footer.
 *  It imports Typography, Link, and Stack components from Material-UI. 
 * The component defines an array of location strings and returns a fragment. 
 * Inside the fragment, it maps over the locations array and for each location,
 *  it returns a Stack component with a dash and a Link component. 
 * The Link component has a href attribute that points to the Google Maps search results for the location.
 *  The location string is passed to the Google Maps search query after replacing all spaces with plus signs.
 *  The Link component contains a Typography component that displays the location string.
 */
/** Displays the locations for the footer */
export function Locations() {
    const locations = [
        "1234 Random Rd, Melbourne VIC 3000",
        "5678 Other st, Melbourne VIC 3000",
    ];

    return (
        <>
            {locations.map((loc, idx) => (
                <Stack direction="row" key={idx}>
                    -&nbsp;
                    <Link
                        href={`https://www.google.com/maps?q=${loc.replace(/\s/g, "+")}`}
                        color="inherit"
                        underline="hover"
                        target="_blank"
                    >
                        <Typography fontWeight={200} gutterBottom>
                            {loc}
                        </Typography>
                    </Link>
                </Stack>
            ))}
        </>
    );
}
