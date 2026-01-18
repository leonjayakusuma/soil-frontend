import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { Box, Button, Typography } from "@mui/material";
import { useContext } from "react";
import { NavbarCtx, BtnIcon } from "@/components/Navbar";
import { Link as RouterLink } from "react-router-dom";
import { useCartStore } from "@/store";

/**
This component renders the desktop version of the navigation menu. It includes links to 
different routes and icons for shopping cart and user account.

The component receives two props: isLoggedIn, which is a boolean indicating whether the user 
is logged in, and fixed, which is an optional boolean indicating whether the menu is fixed.

The component uses the NavbarCtx context to access the styles for the navigation bar, and 
the useCart hook to access the state of the cart items. The itemsCount variable is used to 
store the number of items in the cart.

The finalSx variable is used to store the final styles for the Box component. If the menu 
is fixed, the position property is added to the styles.
 */
export function DesktopMenu({
    isLoggedIn,
    fixed = false,
}: {
    isLoggedIn: boolean;
    fixed?: boolean;
}) {
    const styles = useContext(NavbarCtx)!;
    const itemsCount = useCartStore((s) => s.items.length);

    let finalSx = styles.boxStyle;
    if (fixed) {
        finalSx = {
            ...finalSx,
            position: "fixed",
        };
    }
    return (
        // {/* DO not remove the zIndex, needed for navbar not to be affected by page transition animations */}
        <Box right={0} sx={finalSx} zIndex={11}>
            <Btn text="Plan your meal" to="/planyourmeal" />
            <Btn text="Shop now" to="/shop" />

            {isLoggedIn ? (
                <>
                    <Box position={"relative"}>
                        <Typography position={"absolute"} top={-2} right={-3}>
                            {itemsCount}
                        </Typography>
                        <BtnIcon icon={<ShoppingCartIcon />} to="/cart" />
                    </Box>
                    <BtnIcon icon={<AccountCircleIcon />} to="/profile" />
                </>
            ) : (
                <>
                    <Btn text="Log in" to="/login" />
                    <Btn text="Sign up" to="/signup" />
                </>
            )}
        </Box>
    );
}

export function Btn({ text, to }: { text: string; to: string }) {
    const styles = useContext(NavbarCtx)!;

    return (
        <Button
            color="inherit"
            sx={styles.btnStyle}
            component={RouterLink}
            to={to}
        >
            {text}
        </Button>
    );
}
