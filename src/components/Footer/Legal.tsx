import { Link, Typography } from "@mui/material";

/**
 * The Legal component is a functional component that displays legal information in the footer.
 * It imports Link and Typography components from Material-UI.
 *  The component returns a fragment containing three Typography components.
 *  The first Typography component contains a Link to the credits page,
 *  the second Typography component displays a copyright notice,
 *  and the third Typography component contains Links to the Terms & Conditions and Privacy Policy documents.
 *  All links open in a new tab and inherit their color from the parent Typography component.
 */
/** Displays all the legal information for the footer */
export function Legal() {
    return (
        <>
            <Typography color="inherit" textAlign="center" mt={2}>
                <Link href="/credits" target="_blank" color="inherit">
                    Credits
                </Link>
            </Typography>
            <Typography color="inherit" textAlign="center" mt={1}>
                © 2024 SOIL. All rights reserved.
            </Typography>
            <Typography color="inherit" textAlign="center" mt={1}>
                <Link href="/TNCs.pdf" target="_blank" color="inherit">
                    Terms & Conditions
                </Link>{" "}
                and{" "}
                <Link href="/PN.pdf" target="_blank" color="inherit">
                    Privacy Policy
                </Link>
            </Typography>
        </>
    );
}
