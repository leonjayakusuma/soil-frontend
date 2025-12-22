import ParallaxPage from "@/shared/ParallaxPage";
import plant1 from "@/assets/plants1.jpg";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import { CartTotalCard, DataGridComponent } from "@/components/ShoppingCart";
import { useCart } from "@/App";

/**
This component renders the shopping cart page. It includes a parallax background image, 
a title, and two child components: DataGridComponent and CartTotalCard.

The DataGridComponent is responsible for displaying the cart items in a data grid, 
while the CartTotalCard component displays the total cost of the items in the cart.

The components are arranged in a column using the Stack component from Material-UI.

The state of the cart items is managed using the useCart custom hook. The cartItemsEmpty 
variable is used to determine if the cart is empty.
 */
export default function ShoppingCart() {
    const [cartItems] = useCart();
    const cartItemsEmpty = cartItems.length === 0;
    return (
        <ParallaxPage img={plant1}>
            <Container
                sx={{
                    paddingLeft: "100px",
                    paddingTop: "100px",
                    "@media(max-width: 550px)": {
                        paddingLeft: "30px",
                        paddingTop: "80px",
                    },
                }}
            >
                <Typography
                    variant="h2"
                    component="h1"
                    fontWeight={"500"}
                    mb={"60px"}
                    sx={{
                        "@media(max-width: 550px)": {
                            fontSize: "2.5rem",
                            textAlign: "center",
                        },
                    }}
                >
                    Shopping Cart
                </Typography>
                {cartItemsEmpty && (
                    <Typography variant="h3" width="100%" textAlign="center">
                        Your cart is empty
                    </Typography>
                )}
                {!cartItemsEmpty && (
                    <Stack
                        display={"flex"}
                        direction={"row"}
                        columnGap={"50px"}
                        sx={{
                            "@media(max-width: 550px)": {
                                flexDirection: "column",
                                rowGap: "50px",
                            },
                        }}
                    >
                        <DataGridComponent />
                        <CartTotalCard hasAction></CartTotalCard>
                    </Stack>
                )}
            </Container>
        </ParallaxPage>
    );
}
