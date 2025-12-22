import { Button, IconButton, Menu, MenuItem, Typography } from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { Box } from "@mui/material";
import { useState, useContext } from "react";
import MenuIcon from "@mui/icons-material/Menu";
import { MenuCtx, NavbarCtx, BtnIcon } from "@/components/Navbar";
import { Link as RouterLink } from "react-router-dom";
import { theme, useCart } from "@/App";
import { CSSProperties } from "@mui/system/CSSProperties";
import CloseIcon from "@mui/icons-material/Close";
// import { getSOILInfo } from "@/SoilInfo";

/**
 * MobileMenu Component
 *
 * This component renders the mobile version of the navigation menu. It includes a menu icon
 * button that opens a dropdown menu with links to different routes and icons for shopping cart
 * and user account.
 *
 * The component receives two props: isLoggedIn, which is a boolean indicating whether the user
 * is logged in, and fixed, which is an optional boolean indicating whether the menu is fixed.
 *
 * The state of the anchor element for the dropdown menu is managed using the useState hook.
 * The handleClick function is used to set the anchor element when the menu icon button is clicked.
 *
 * The component uses the NavbarCtx context to access the styles for the navigation bar, and
 * the useCart hook to access the state of the cart items.
 */
export function MobileMenu({
    isLoggedIn,
    fixed = false,
}: {
    isLoggedIn: boolean;
    fixed?: boolean;
}) {
    // https://mui.com/material-ui/react-menu/#basic-menu
    const styles = useContext(NavbarCtx)!;

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const boxStyleColor = (styles.boxStyle as CSSProperties).color;

    let finalSx = { ...styles.boxStyle, gridAutoFlow: "row" };
    if (fixed) {
        finalSx = {
            ...finalSx,
            position: "fixed",
        };
    }

    const [cartItems] = useCart();
    const cartItemsCount = cartItems.length;

    return (
        <MenuCtx.Provider value={handleClose}>
            {/* DO not remove the zIndex, needed for navbar not to be affected by page transition animations */}
            <Box
                right={0}
                sx={finalSx}
                zIndex={1301} // https://stackoverflow.com/a/75741326/19612884
            >
                <IconButton
                    color="inherit"
                    sx={styles.iconBtnStyle}
                    onClick={open ? handleClose : handleClick}
                    aria-controls={open ? "basic-menu" : undefined}
                    aria-haspopup="true"
                    aria-expanded={open ? "true" : undefined}
                >
                    {open ? <CloseIcon /> : <MenuIcon />}
                </IconButton>
                <Menu
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleClose}
                    MenuListProps={{
                        "aria-labelledby": "basic-button",
                    }}
                    sx={{
                        "& .MuiPaper-root": {
                            color: boxStyleColor, // https://stackoverflow.com/questions/70270611/how-to-change-the-color-of-menu-in-material-ui-v5
                            backgroundColor: theme.palette.primary[900],
                            right: 0,
                            marginX: theme.spacing(0.5),
                            marginTop: theme.spacing(1),
                        },
                        zIndex: 1302,
                    }}
                >
                    <MenuBtn text="Plan your meal" to="/planyourmeal" />
                    <MenuBtn text="Shop now" to="/shop" />
                    {isLoggedIn ? (
                        <MenuItem
                            sx={{
                                display: "flex",
                                justifyContent: "space-evenly",
                            }}
                        >
                            <BtnIcon
                                icon={<AccountCircleIcon fontSize="large" />}
                                to="/profile"
                            />
                            <Box position={"relative"}>
                                <Typography
                                    position={"absolute"}
                                    top={-2}
                                    right={-3}
                                >
                                    {cartItemsCount}
                                </Typography>
                                <BtnIcon
                                    icon={<ShoppingCartIcon />}
                                    to="/cart"
                                />
                            </Box>
                        </MenuItem>
                    ) : (
                        // https://stackoverflow.com/a/77042454
                        [
                            <MenuBtn key="login" text="Log in" to="/login" />,
                            <MenuBtn
                                key="signup"
                                text="Sign up"
                                to="/signup"
                            />,
                        ]
                    )}
                </Menu>
            </Box>
        </MenuCtx.Provider>
    );
}

function MenuBtn({ text, to }: { text: string; to: string }) {
    const styles = useContext(NavbarCtx)!;
    const handleClose = useContext(MenuCtx)!;

    const hoverStyle = (styles.btnStyle as { "&:hover": CSSProperties })[
        "&:hover"
    ];

    return (
        <MenuItem
            onClick={handleClose}
            component={RouterLink}
            to={to}
            sx={{
                display: "flex",
                justifyContent: "space-evenly",
                "&:hover": {
                    ".MuiButton-root": hoverStyle,
                },
            }}
        >
            <Button color="inherit">{text}</Button>
        </MenuItem>
    );
}
