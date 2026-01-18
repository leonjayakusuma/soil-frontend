import { Box, Button, IconButton } from "@mui/material";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import { Item } from "@/types";
import { useCartStore } from "@/store";
import { useNavigate } from "react-router-dom";
import { usePopup } from "../Popup";

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
    const addItem = useCartStore((state) => state.addItem);

    async function handleClickCart() {
        const result = await addItem(item);
        if (result.success) {
            popup(result.message || `Item ${item.title} added to cart`);
        } else {
            popup(result.message || "Failed to add item to cart");
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
                variant="text"
                onClick={() => {
                    navigate("/checkout?id=" + item.id);
                }}
                color="primary"
                sx={{ 
                    fontSize: styles.buttonFontSize,
                    "&:hover": { border: size === "small" ? "1.5px solid green" : "3px solid green"},
                    borderRadius: 1,
                }}
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
