import ParallaxPage from "@/shared/ParallaxPage";
import plant1 from "@/assets/plants1.jpg";
import { Container, Stack, Typography } from "@mui/material";
import { CartTotalCard } from "@/components/ShoppingCart";
import { PaymentDetails } from "@/components/ShoppingCart/Checkout";

/**
This component renders the checkout page. It includes a parallax background image, 
a title, and two child components: PaymentDetails and CartTotalCard.

The PaymentDetails component is responsible for handling the payment information, 
while the CartTotalCard component displays the total cost of the items in the cart.

The components are arranged in a row using the Stack component from Material-UI.
 */
export default function Checkout() {
    return (
        <ParallaxPage img={plant1}>
            <Container sx={{ padding: "100px" }}>
                <Typography component="h1" variant="h2" mb="50px">
                    Checkout
                </Typography>
                <Stack direction={"row"} columnGap={2}>
                    <PaymentDetails />
                    <CartTotalCard />
                </Stack>
            </Container>
        </ParallaxPage>
    );
}
