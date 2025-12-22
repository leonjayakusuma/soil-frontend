import { Box, Grid, Stack, Typography } from "@mui/material";
import { Contact, Legal, Locations, SiteLinks } from "@/components/Footer";
import Center from "@/shared/Center";
import React from "react";

/**
 * The Footer component is a functional component that displays the footer of the application.
 *  It imports several components from Material-UI, including Box, Grid, Stack, and Typography, 
 * as well as several sub-components like Contact, Legal, Locations, and SiteLinks. 
 * The Footer component returns a Box component styled as a footer with a dark background and white text.
 *  Inside the Box, there's a Center component that wraps a Grid container. 
 * The Grid container includes a GridItemWrapper component and a FooterSection component 
 * with a heading of "Open Hours" and a FooterSectionText component that displays the open hours.
 */
export default function Footer() {
    return (
        <Box
            component="footer"
            py={3}
            sx={{ backgroundColor: "primary.dark", color: "white" }}
        >
            <Center>
                <Grid container spacing={1} marginX={3}>
                    <GridItemWrapper>
                        <FooterSection heading="Open Hours">
                            <FooterSectionText
                                texts={[
                                    "Weekdays: 9am - 5pm",
                                    "Weekends/Public holidays: 10am - 4pm",
                                ]}
                            />
                        </FooterSection>
                    </GridItemWrapper>

                    <GridItem heading="Locations" component={<Locations />} />
                    <GridItem heading="Site Links" component={<SiteLinks />} />
                    <GridItem heading="Contact" component={<Contact />} />
                </Grid>
            </Center>
            <Legal />
        </Box>
    );
}

function GridItem({
    heading,
    component,
}: {
    heading: string;
    component: JSX.Element;
}) {
    return (
        <GridItemWrapper>
            <FooterSection heading={heading}>{component}</FooterSection>
        </GridItemWrapper>
    );
}

function GridItemWrapper({ children }: { children: React.ReactNode }) {
    return (
        <Grid item xs={12} sm={6} md={3}>
            <Box margin={2}>{children}</Box>
        </Grid>
    );
}

function FooterSection({
    heading,
    children,
}: {
    heading: string;
    children: React.ReactNode;
}) {
    return (
        <>
            <Typography
                variant="h6"
                color="black"
                gutterBottom
                fontWeight={600}
            >
                {heading}
            </Typography>
            <Box ml={0.2}>{children}</Box>
        </>
    );
}

function FooterSectionText({ texts }: { texts: string[] }) {
    return (
        <>
            {texts.map((text, idx) => (
                <Stack direction="row" key={idx}>
                    -&nbsp;
                    <Typography color="inherit" gutterBottom fontWeight={200}>
                        {text}
                    </Typography>
                </Stack>
            ))}
        </>
    );
}
