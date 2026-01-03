import { createTheme, ThemeProvider } from "@mui/material/styles"; // ALWAYS KEEP THIS AT THE TOP

import { LogIn, SignUp } from "@/components/Auth";
import { green, grey } from "@mui/material/colors";
import Navbar from "@/components/Navbar";
import ProfilePage from "@/components/Profile";
import ForgotPswd from "@/components/Auth/ForgotPswd";
import Home from "@/components/Home";
import Shop from "@/components/Shop";
import ShoppingCartPage from "@/components/ShoppingCart";
import CheckoutPage from "@/components/ShoppingCart/Checkout";
import Personalinfo from "@/components/Personalinfo";
import Planner from "@/components/Planner";
import Credits from "@/components/Credits";
import ItemPage from "@/components/ItemPage";
import UserPage from "./components/UserPage";
import { ReactLenis } from "@studio-freight/react-lenis";
import { ProfileChangePswd } from "@/components/Profile";
import { PopupProvider } from "@/shared/Popup";

import { AnimatePresence } from "motion/react";
import { motion } from "motion/react";
import {
    BrowserRouter,
    Routes,
    Route,
    useLocation,
    // Link as RouterLink,
} from "react-router-dom";
import {
    useEffect,
    useState,
    createContext,
    useContext,
} from "react";
import { getSOILInfo } from "@/SoilInfo";
import { getUserCart } from "./api";
import { CartItem } from "@shared/types";
import { getFinalPrice } from "@/shared/ItemCard";
import TestPage from "./TestPage";

declare module "@mui/material/styles/createPalette" {
    // https://stackoverflow.com/a/67015020
    interface PaletteColor extends ColorPartial { }
    
    interface Palette {
        accent: PaletteColor;
    }
    
    interface PaletteOptions {
        accent?: PaletteColorOptions;
    }
}

declare module "@mui/material/styles" {
    // https://mui.com/material-ui/customization/theming/#custom-variables
    interface Theme {
        fontSize: (factor: number) => string;
    }
    interface ThemeOptions {
        fontSize?: (factor: number) => string;
    }
}

export const theme = createTheme({
    palette: {
        primary: green,
        secondary: grey,
        accent: {
            main: "#228B22", // Forest green for buy buttons
            light: "#32CD32",
            dark: "#006400",
            contrastText: "#ffffff",
        },
    },
    typography: {
        fontFamily: "Poppins, sans-serif",
    },
    shape: {
        borderRadius: 10,
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    color: "rgba(255, 255, 255, 0.87)",
                    "& .MuiTypography-root": {
                        color: "rgba(255, 255, 255, 0.87)",
                    },
                },
                textPrimary: {
                    // Style for text variant with primary color (buy buttons in ItemCard)
                    color: green[600],
                    fontWeight: 600,
                    "&:hover": {
                        backgroundColor: green[50],
                        border: "1.5px solid",
                        borderColor: green[600],
                        // borderRadius: 1,
                    },
                },
            },
        },
    },
    spacing: (factor: number) => `calc(var(--spacing-unit) * ${factor})`,
    fontSize: (factor: number) => `calc(var(--font-size-unit) * ${factor})`,
});

function onAppStart() {
    // App initialization
}

// Needed for when login is checked for dynamic changes
// Signup and login doesn't use this and instead checks it every time it's mounted
// This is a design choice as most signup pages don't auto redirect when loggin in from another tab

type CartContextType = [
    CartItem[],
    React.Dispatch<React.SetStateAction<CartItem[]>>,
];

type CartContextTypeWithRefresh = [
    CartItem[],
    React.Dispatch<React.SetStateAction<CartItem[]>>,
    () => Promise<void>, // refreshCart function
];

export const CartContext = createContext<CartContextTypeWithRefresh | null>(null);

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error("useCart must be used within a CartProvider");
    }
    return context;
};

export default function App() {
    // https://github.com/darkroomengineering/lenis/tree/main/packages/react-lenis

    const [cartItems, setCartItems] = useState<CartItem[]>([]);

    // Function to fetch cart items
    const fetchCartItems = async () => {
        const userInfo = getSOILInfo().userInfo;
        if (userInfo) {
            try {
                const res = await getUserCart();
                if (res.data) {
                    // Transform API cart items to include subTotal
                    const cartItemsWithSubTotal: CartItem[] = res.data.map((item) => ({
                        ...item,
                        subTotal: getFinalPrice(item.item.price, item.item.discount) * item.quantity,
                    }));
                    setCartItems(cartItemsWithSubTotal);
                } else {
                    // If no cart data, set empty array
                    setCartItems([]);
                }
            } catch (error) {
                // Silently handle errors (user might not be logged in or API might not be available)
                console.error("Error fetching cart:", error);
                setCartItems([]);
            }
        } else {
            // User not logged in, set empty cart
            setCartItems([]);
        }
    };

    // Fetch cart on mount and listen for refresh events
    useEffect(() => {
        // Fetch cart on mount
        fetchCartItems();

        // Listen for custom event to refresh cart (triggered after login/logout)
        const handleRefreshCart = () => {
            fetchCartItems();
        };

        window.addEventListener("refreshCart", handleRefreshCart);
        return () => window.removeEventListener("refreshCart", handleRefreshCart);
    }, []);

    // TODO: check if needed
    // useEffect(() => {
    //     location.reload();
    // }, [logInState.isLoggedIn]);

    // In case another website changes relevant local storage
    useEffect(() => {
        onAppStart();
        function onLocStorageChange(e: StorageEvent) {
            // Prevent same website changes from reverting
            if (new URL(e.url).host === window.location.host) {
                return;
            }

            alert("The localStorage was changed by another tab"); // No need to use popup library here as the thread should be paused before continuing

            // If .clear() was called
            if (e.key === null) {
                onAppStart();
                location.reload(); // Refresh page
            } else if (e.key === "SOIL" && e.oldValue !== null) {
                localStorage.setItem(e.key, e.oldValue);
            }
        }

        window.addEventListener("storage", onLocStorageChange);
        return () => {
            window.removeEventListener("storage", onLocStorageChange);
        };
    }, []);

    return (
        <ReactLenis root>
            <ThemeProvider theme={theme}>
                <BrowserRouter>
                    <CartContext.Provider value={[cartItems, setCartItems, fetchCartItems]}>
                        <PopupProvider>
                            <Navbar />
                            <AnimatedRoutes />
                        </PopupProvider>
                    </CartContext.Provider>
                </BrowserRouter>
            </ThemeProvider>
        </ReactLenis>
    );
}

function GetMotionDiv({ element }: { element: JSX.Element }) {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
        >
            {element}
        </motion.div>
    );
}

// https://youtu.be/FdrEjwymzdY
function AnimatedRoutes() {
    const location = useLocation();
    return (
        <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
                <Route path="/" element={<GetMotionDiv element={<Home />} />} />
                <Route
                    path="/signup"
                    element={<GetMotionDiv element={<SignUp />} />}
                />
                <Route
                    path="/login"
                    element={<GetMotionDiv element={<LogIn />} />}
                />
                <Route
                    path="/forgotPswd"
                    element={<GetMotionDiv element={<ForgotPswd />} />}
                />
                <Route
                    path="/profile"
                    element={<GetMotionDiv element={<ProfilePage />} />}
                />
                <Route
                    path="/shop"
                    element={<GetMotionDiv element={<Shop />} />}
                />
                <Route
                    path="/cart"
                    element={<GetMotionDiv element={<ShoppingCartPage />} />}
                />
                <Route
                    path="/checkout"
                    element={<GetMotionDiv element={<CheckoutPage />} />}
                />
                <Route
                    path="/personalInfo"
                    element={<GetMotionDiv element={<Personalinfo />} />}
                />
                <Route
                    path="/credits"
                    element={<GetMotionDiv element={<Credits />} />}
                />
                <Route
                    path="/planyourmeal"
                    element={<GetMotionDiv element={<Planner />} />}
                />
                <Route
                    path="/changePswd"
                    element={<GetMotionDiv element={<ProfileChangePswd />} />}
                />
                <Route
                    path="/item"
                    element={<GetMotionDiv element={<ItemPage />} />}
                />
                <Route
                    path="/user"
                    element={<GetMotionDiv element={<UserPage />} />}
                />
                <Route
                    path="/test"
                    element={<GetMotionDiv element={<TestPage />} />}
                />
            </Routes>
        </AnimatePresence>
    );
}
