import { Link, Stack, Typography } from "@mui/material";
import InstagramIcon from "@mui/icons-material/Instagram";
import FacebookIcon from "@mui/icons-material/Facebook";
import XIcon from "@mui/icons-material/X";

/**
 * The Contact component is a functional component that displays contact information and social media links.
 * It imports several components from Material-UI, including Link, Stack, Typography, and various icons.
 * The component defines an email and a phone number, and creates two arrays: contactLinks and socialLinks.
 * The contactLinks array contains objects with the name and href for the email and phone number,
 * while the socialLinks array contains objects with an icon and href for each social media platform.
 * The component presumably returns a JSX element that renders this information, 
 * but the return statement is not shown in this excerpt.
 */
/** Displays all the contact information for the footer */
export function Contact() {
    const email = "contact@soil.com.au";
    const phone = "(+61) 400 000 000";

    const contactLinks = [
        { name: email, href: `mailto:${email}` },
        { name: phone, href: `tel:${phone.replace(/[()\s]/g, "")}` },
    ];

    const socialLinks = [
        { icon: InstagramIcon, href: "https://www.instagram.com/" },
        { icon: FacebookIcon, href: "https://www.facebook.com/" },
        { icon: XIcon, href: "https://twitter.com/" },
    ];

    return (
        <>
            {contactLinks.map(({ name, href }, idx) => (
                <Link key={idx} href={href} color="inherit" underline="hover">
                    <Typography fontWeight={200} gutterBottom>
                        {name}
                    </Typography>
                </Link>
            ))}
            <Stack direction="row" gap={0.3} mt={0.5}>
                {socialLinks.map(({ icon: Icon, href }, idx) => (
                    <Link key={idx} href={href} color="inherit" target="_blank">
                        <Icon fontSize="large" />
                    </Link>
                ))}
            </Stack>
        </>
    );
}
