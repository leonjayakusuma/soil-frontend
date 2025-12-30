import { useCart } from "@/App";
import {
    Button,
    Card,
    CardActions,
    CardContent,
    Divider,
    Stack,
    Typography,
} from "@mui/material";
import {
    // useLocation,
    useNavigate
} from "react-router-dom";
import queryString from "query-string";
import {
    // useMemo,
    useState
} from "react";
// import { getSOILInfo } from "@/SoilInfo";
import { getFinalPrice } from "@/shared/ItemCard";
import { getItem } from "@/api";
import {
    // CartItem,
    Item
} from "@shared/types";
import { useEffect } from "react";
// import { getAllItems } from "@/api";

/**
 * CartTotalCard Component
 *
 * This component displays the total cost of the items in the cart. It calculates the subtotal by
 * iterating over the cart items and multiplying the price and quantity of each item. A flat
 * shipping fee is added to the subtotal to calculate the total cost.
 *
 * The component receives a prop 'hasAction' which determines if the 'Proceed to Checkout' button
 * is displayed. When the button is clicked, the user is navigated to the '/checkout' route.
 *
 * The component uses the useCart custom hook to access the state of the cart items and the
 * useNavigate hook from 'react-router-dom' to programmatically navigate to different routes.
 */
export function CartTotalCard({ hasAction = false }: { hasAction?: boolean }) {
    const [localCartItems] = useCart();

    // const allItems = useMemo(() => {
    //     // getAllItems()
    //     console.log("All Items: ", getSOILInfo().items);
    //     return getSOILInfo().items
    // }, []);

    // const location = useLocation();

    const [item, setItem] = useState<Item | null>(null);

    useEffect(() => {
        const params = queryString.parse(window.location.search);

        const itemId = parseInt((params.id ?? "") as string); // Because it won't be an array, if it is it would be NaN so no issue
        if (itemId) {
            getItem(itemId).then((res) => {
                if (!res.data) {
                    throw new Error("Error: cannot fetch item data")
                }
                setItem(res.data);
            }).catch((error) => {
                console.error(error);
            })
        }

    }, []);

    // const item = useMemo(() => {
    //     const params = queryString.parse(window.location.search);

    //     const itemId = parseInt((params.id ?? "") as string); // Because it won't be an array, if it is it would be NaN so no issue
    //     // console.log(itemId);
    //     // const itemFound = allItems.find((item) => item.id === itemId);
    //     let itemFound: Item;
    //     getItem(itemId).then((res) => {
    //         if (!res.data) {
    //             throw new Error("Error: cannot fetch item data")
    //             // itemFound = res.data;
    //         }
    //         itemFound = res.data;
    //     }).catch((error) => {
    //         console.error(error);
    //     })
    //     // console.log(itemFound);
    //     return itemFound;
    // }, [location.search]);

    let cartItems = localCartItems;

    if (item) {

        cartItems = [
            {
                item,
                quantity: 1,
                subTotal: getFinalPrice(item.price, item.discount),
            },
        ];
    }

    const subtotal = cartItems
        .reduce(
            (acc, item) =>
                acc + getFinalPrice(item.item.price, item.item.discount) * item.quantity,
            0,
        )
        .toFixed(2);
    const shipping = 10;
    const total =
        Math.round((shipping + parseFloat(subtotal) + Number.EPSILON) * 100) /
        100;
    const navigate = useNavigate();
    const handleClick = () => {
        navigate("/checkout");
    };

    return (
        <Card
            sx={{
                width: "30%",
                padding: "5px",
                height: "300px",
                "@media(max-width: 550px)": {
                    width: "70%",
                    height: "250px",
                },
            }}
            raised
        >
            <CardContent>
                <Stack rowGap={0.5}>
                    <Typography variant="h5" component={"h2"}>
                        Cart totals
                    </Typography>
                    <Divider sx={{ borderBottomWidth: 2 }} />
                    <Stack
                        direction={"row"}
                        display={"flex"}
                        justifyContent={"space-between"}
                    >
                        <Typography variant="body1" component={"h2"}>
                            Subtotal
                        </Typography>
                        <Typography variant="body1" component={"h2"}>
                            A$ {subtotal}
                        </Typography>
                    </Stack>

                    <Divider sx={{ borderBottomWidth: 2 }} />
                    <Stack
                        direction={"row"}
                        display={"flex"}
                        justifyContent={"space-between"}
                    >
                        <Typography variant="body1" component={"h2"}>
                            Shipping
                        </Typography>
                        <Typography variant="body1" component={"h2"}>
                            A$ {shipping}
                        </Typography>
                    </Stack>

                    <Divider sx={{ borderBottomWidth: 2 }} />
                    <Stack
                        direction="row"
                        display={"flex"}
                        justifyContent={"space-between"}
                    >
                        <Typography variant="body1" component={"h2"}>
                            Total
                        </Typography>
                        <Typography variant="body1" component={"h2"}>
                            A$ {total}
                        </Typography>
                    </Stack>
                </Stack>
            </CardContent>
            {hasAction && (
                <CardActions>
                    <Button
                        type="button"
                        variant="contained"
                        onClick={handleClick}
                    >
                        Proceed to checkout
                    </Button>
                </CardActions>
            )}
        </Card>
    );
}
