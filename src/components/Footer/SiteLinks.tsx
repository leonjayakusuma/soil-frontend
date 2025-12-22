import { Link, Typography } from "@mui/material";

/**
 * The SiteLinks component is a functional component that displays all the site links in the footer.
 * It imports Link and Typography components from Material-UI. 
 * The component defines an array of link objects, each with a name and href property.
 * The name property is the text that will be displayed for the link,
 * and the href property is the URL that the link will navigate to. 
 * The component presumably returns a JSX element that maps over the links array and
 * renders a Link component for each link object, but the return statement is not shown in this excerpt.
 */
/** Displays all the links for the footer */
export function SiteLinks() {
    const links = [
        { name: "Home", href: "/" },
        { name: "Plan your meal", href: "/planyourmeal" },
        { name: "Shop", href: "/shop" },
        { name: "Cart", href: "/cart" },
        { name: "Profile", href: "/profile" },
        { name: "Log In", href: "/login" },
        { name: "Sign Up", href: "/signup" },
        { name: "Forgot Password", href: "/forgotPswd" },
        { name: "Cart", href: "/cart" },
        { name: "Checkout", href: "/checkout" },
        { name: "Personal Information", href: "/personalInfo" },
        { name: "Credits", href: "/credits" },
        { name: "Plan your meal", href: "/planyourmeal" },
        { name: "Change password", href: "/changePswd" },
    ];

    return (
        <>
            {links.map(({ name, href }, idx) => (
                <Link
                    key={idx}
                    href={href}
                    color="inherit"
                    underline="hover"
                    target="_blank"
                >
                    <Typography fontWeight={200}>{name}</Typography>
                </Link>
            ))}
        </>
    );
}
