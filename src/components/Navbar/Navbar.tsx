import { Theme, IconButton, SxProps, Grid } from "@mui/material";
import { theme } from "@/App";
import HomeIcon from "@mui/icons-material/Home";
import { Box } from "@mui/material";
import { useContext, createContext } from "react";
import useMediaQuery from "@mui/material/useMediaQuery";
import { Link as RouterLink, useLocation } from "react-router-dom";
import { MobileMenu, DesktopMenu } from "@/components/Navbar";
import { SearchBar } from "@/components/Shop";
import { useAuthStore } from "@/store";

export type NavBarStyles = {
    boxStyle: SxProps<Theme>;
    btnStyle: SxProps<Theme>;
    iconBtnStyle: SxProps<Theme>;
};

export const NavbarCtx = createContext<NavBarStyles | null>(null);
export const MenuCtx = createContext<(() => void) | null>(null);

/**
This component renders the navigation bar of the application. It includes both mobile and 
desktop versions of the menu, which are rendered using the MobileMenu and DesktopMenu components.

The component uses the LogInCtx context to access the state of whether the user is logged in.

The useLocation hook from 'react-router-dom' is used to get the current path. The isShop 
variable is used to determine if the current path is '/shop'.

The NavBarStyles type is used to define the styles for the Box, Button, and IconButton 
components in the navigation bar. The NavbarCtx and MenuCtx contexts are used to provide 
these styles and a function to toggle the mobile menu to the child components.
 */
export default function NavBar() {
    const isLoggedIn = useAuthStore((s) => s.isAuthenticated);

    const path = useLocation().pathname;

    const isShop = path === "/shop";
    const isAuth =
        path === "/signup" || path === "/login" || path === "/forgotPswd";

    const smDown = useMediaQuery(theme.breakpoints.down("sm"));
    const lgDown = useMediaQuery(theme.breakpoints.down("lg"));
    const mobileL = smDown || (isShop && lgDown);

    const boxStyle: SxProps<Theme> = {
        backgroundColor: theme.palette.primary[900],
        color: "white",
        borderRadius: "10px",
        padding: 0.5,
        margin: 0.5,
        display: "grid",
        gridAutoFlow: "column",
        gap: 1,

        boxShadow: "0px 0px 15px 5px rgba(0,0,0,0.5)",
    };

    if (!isShop) {
        boxStyle.position = "absolute";
    }

    const btnStyle: SxProps<Theme> = {
        "&:hover": {
            backgroundColor: "#fff",
            color: "#000",
        },
    };

    const iconBtnStyle: SxProps<Theme> = {
        "&:hover": {
            backgroundColor: "rgba(0, 0, 0, 0.4)",
        },
    };
    const styles: NavBarStyles = {
        boxStyle,
        btnStyle,
        iconBtnStyle,
    };

    // https://mui.com/material-ui/integrations/routing/#react-router-examples
    if (isShop) {
        return (
            <NavbarCtx.Provider value={styles}>
                {/* DO not remove the zIndex, needed for navbar not to be affected by page transition animations */}
                <Grid container position="fixed" zIndex={1302}>
                    <Grid item>
                        <Box sx={boxStyle} zIndex={2}>
                            <IconButton
                                color="inherit"
                                sx={iconBtnStyle}
                                component={RouterLink}
                                to="/"
                            >
                                <HomeIcon />
                            </IconButton>
                        </Box>
                    </Grid>
                    {isShop && (
                        <Grid item xs={true}>
                            <SearchBar sx={boxStyle} navStyles={styles} />
                        </Grid>
                    )}
                    <Grid item>
                        {!isAuth &&
                            (mobileL ? (
                                <MobileMenu isLoggedIn={isLoggedIn} />
                            ) : (
                                <DesktopMenu isLoggedIn={isLoggedIn} />
                            ))}
                    </Grid>
                </Grid>
            </NavbarCtx.Provider>
        );
    }

    return (
        <NavbarCtx.Provider value={styles}>
            {/* DO not remove the zIndex, needed for navbar not to be affected by page transition animations */}
            <Box left={0} sx={{ ...boxStyle, position: "fixed" }} zIndex={11}>
                <IconButton
                    color="inherit"
                    sx={iconBtnStyle}
                    component={RouterLink}
                    to="/"
                >
                    <HomeIcon />
                </IconButton>
            </Box>
            {!isAuth &&
                (mobileL ? (
                    <MobileMenu isLoggedIn={isLoggedIn} fixed={true} />
                ) : (
                    <DesktopMenu isLoggedIn={isLoggedIn} fixed={true} />
                ))}
        </NavbarCtx.Provider>
    );
}

export function BtnIcon({ icon, to }: { icon: React.ReactNode; to: string }) {
    const styles = useContext(NavbarCtx)!;

    return (
        <IconButton
            color="inherit"
            sx={styles.iconBtnStyle}
            component={RouterLink}
            to={to}
        >
            {icon}
        </IconButton>
    );
}
