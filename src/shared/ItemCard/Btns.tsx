import { Box, Button, IconButton } from "@mui/material";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import { CartItem, Item } from "@shared/types";
import { getSOILInfo } from "@/SoilInfo";
import { useCart } from "@/App";
import { useNavigate } from "react-router-dom";
import { addItemToCart } from "@/api";
import { usePopup } from "../Popup";
import { getFinalPrice } from "./Price";

/**
This component handles the button actions for an item. It includes functions for adding 
items to the cart and updating the quantity and subtotal of existing items in the cart.
 */
export function Btns({
    isHovered,
    transitionDuration,
    item,
    size = "small"
}: {
    isHovered: boolean;
    transitionDuration: number;
    item: Item;
    size?: "small" | "large";
}) {
    const navigate = useNavigate();
    const popup = usePopup()!;
    const [cartItems, setCartItems] = useCart();
    // const [, setCartItems] = useCart();
    function handleClickCart() {
        const tempCartItems = structuredClone(cartItems);
        const existingItem = cartItems.find(
            (cartItem) => cartItem.item.id === item.id,
        ) as CartItem;

        if (existingItem && existingItem.quantity < 255) {
            existingItem.quantity++;
            existingItem.subTotal =
                existingItem.quantity *
                getFinalPrice(existingItem.item.price, existingItem.item.discount);
            // cartItemAdded = existingItem;
            tempCartItems[
                tempCartItems.findIndex(
                    (tempCartItem) => existingItem.item.id === tempCartItem.item.id,
                )
            ] = existingItem;
        } else {
            const newCartItem: CartItem = {
                item: {
                    id: item.id,
                    title: item.title,
                    price: item.price,
                    discount: item.discount,
                    imgUrl: item.imgUrl,
                },
                quantity: 1,
                subTotal: item.price,
            };
            tempCartItems.push(newCartItem);
        }



        const loggedIn = getSOILInfo().userInfo;
        if (loggedIn) {
            if (existingItem && existingItem.quantity >= 255) {
                popup("You can only buy 255 of the same item at a time.");
            } else {
                addItemToCart(item.id)
                    .then((res) => {
                        if (!res.data) {
                            popup("Error adding item to cart");
                            throw new Error("Error adding item to cart");
                        }

                        setCartItems(tempCartItems);
                        popup(`Item ${item.title} added to cart`);
                    })
                    .catch((error) => {
                        console.error(error);
                    });
            }
            // setCartItems(tempCartItems);
        } else {
            popup(`Please login to buy items.`);
        }
    }

    const sizeStyles = {
        small: {
            gap: 1,
            maxHeight: "50px",
            buttonFontSize: "16px",
            iconSize: "small" as const,
            buyText: "Buy"
        },
        large: {
            gap: 1.5,
            maxHeight: "60px",
            buttonFontSize: "20px",
            iconSize: "medium" as const,
            buyText: "Buy Now"
        },
    };

    const styles = sizeStyles[size];

    return (
        <Box
            display="flex"
            justifyContent="center"
            gap={styles.gap}
            maxHeight={isHovered ? styles.maxHeight : 0}
            overflow="hidden"
            sx={{
                opacity: isHovered ? 1 : 0,
                transition: `max-height ${transitionDuration}s ease-out`,
            }}
        >
            <Button
                aria-label="buy"
                size={size}
                // variant="contained"
                sx={{ fontSize: styles.buttonFontSize, "&:hover": { border: size === "small" ? "1.5px solid green" : "3px solid green" } }}
                onClick={() => {
                    navigate("/checkout?id=" + item.id);
                }}
                color="primary"
            >
                {styles.buyText}
            </Button>
            <IconButton
                size={size}
                aria-label="add to cart"
                onClick={handleClickCart}
                sx={{ 
                    "&:hover": { border: "1.5px solid green"},
                    borderRadius: "50%",
                    width: size === "small" ? "40px" : "48px",
                    height: size === "small" ? "40px" : "48px",
                    minWidth: size === "small" ? "40px" : "48px",
                    padding: 0,
                }}
            >
                <AddShoppingCartIcon fontSize={styles.iconSize} />
            </IconButton>
        </Box>
    );
}
