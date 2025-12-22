// import {
//     getSOILInfo,
//     setSOILItem
// } from "@/SoilInfo";
import { Box, Button, Card, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import valid from "card-validator";
import { useCart } from "@/App";
import { clearCart } from "@/api";
import { usePopup } from "@/shared/Popup";

/**
This component is responsible for handling the payment information. It includes form fields for 
card number, CVV, card name, and expiration date. The card number input is formatted to display 
in groups of four digits for better readability.

The component uses the 'card-validator' library to validate the card number input.

The state of the cart items is managed using the useCart custom hook. The useNavigate hook from 
'react-router-dom' is used to programmatically navigate to different routes.
 */
export function PaymentDetails() {
    const popup = usePopup()!;
    const [, setCartItems] = useCart();
    const [cardNumberInput, setCardNumberInput] = useState("");
    const [cardNumber, setCardNumber] = useState("");
    const [cvv, setCvv] = useState("");
    const [cardName, setCardName] = useState("");
    const [expirationDate, setExpirationDate] = useState("");
    const navigate = useNavigate();

    const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const cardNumber = e.target.value.replace(/\D/g, "");
        const formattedCardNumber = cardNumber.replace(/(\d{4})(?=\d)/g, "$1 ");
        if (cardNumber.length > 16) {
            return;
        }
        setCardNumberInput(formattedCardNumber);
        setCardNumber(cardNumber);
    };

    const handleCVVChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const cvv = e.target.value.replace(/\D/g, "");
        if (cvv.length > 3) {
            return;
        }
        setCvv(cvv);
    };

    const handleExpirationDateChange = (
        e: React.ChangeEvent<HTMLInputElement>,
    ) => {
        const inputValue = e.target.value.replace(/\D/g, "");
        const formattedExpirationDate = inputValue.replace(
            /(\d{2})(?=\d)/g,
            "$1/",
        );
        if (inputValue.length <= 4) {
            setExpirationDate(formattedExpirationDate);
        }
    };

    const handleSubmit = () => {
        const filled = [cardNumberInput, cvv, cardName, expirationDate].every(
            (field) => field.length > 0,
        );
        const validExpirationDate =
            valid.expirationDate(expirationDate).isValid;
        const validCardNumber = valid.number(cardNumber, {
            luhnValidateUnionPay: true,
        }).isPotentiallyValid;
        const validCVV = valid.cvv(cvv).isPotentiallyValid;
        console.log(cardNumber);
        console.log(validCardNumber, validExpirationDate);
        if (filled) {
            if (validCardNumber && validExpirationDate && validCVV) {
                // const user = getSOILInfo().user;
                // if (user) user.cart = [];
                // setSOILItem("user", user);
                clearCart().then((response) => {
                    if (!response || !response.data) {
                        throw Error("Error when clearing cart")
                    }
                    setCartItems([]);
                    popup("Payment successful!");
                }).catch((error) => {
                    console.error(error)
                    popup("There is an error when clearing cart")
                });
                navigate("/shop");
            } else if (!validCardNumber) {
                popup("Invalid card number. Please use another card.");
            } else if (!validCVV) {
                popup("Invalid CVV. Please use another card.");
            } else if (!validExpirationDate) {
                popup("Your card has expired. Please use another card.");
            }
        } else {
            popup("Please fill the form.");
        }
    };
    return (
        <Card
            sx={{ bgcolor: "#fff", p: 1, mb: 2, maxWidth: "70%", flexGrow: 1 }}
        >
            <Typography variant="h4" component="h2" mb={1.5}>
                Credit / Debit Card
            </Typography>
            <Box display={"flex"} flexDirection={"column"} gap={1}>
                <Box display={"flex"} columnGap={"20px"}>
                    <TextField
                        sx={{ flexGrow: 1 }}
                        placeholder="0000 0000 0000 0000"
                        autoComplete="card-number"
                        label="Card number"
                        value={cardNumberInput}
                        onChange={handleCardNumberChange}
                        required
                    ></TextField>
                    <TextField
                        sx={{ maxWidth: "20%" }}
                        placeholder="123"
                        autoComplete="cvv"
                        label="CVV"
                        value={cvv}
                        onChange={handleCVVChange}
                        required
                    ></TextField>
                </Box>
                <Box
                    display={"flex"}
                    columnGap={"20px"}
                    justifyContent={"space-between"}
                >
                    <TextField
                        placeholder="John Smith"
                        autoComplete="card-name"
                        label="Card Name"
                        value={cardName}
                        onChange={(e) => setCardName(e.target.value)}
                        required
                    ></TextField>
                    <TextField
                        placeholder="MM/YY"
                        autoComplete="card-name"
                        label="Expiration date"
                        value={expirationDate}
                        onChange={handleExpirationDateChange}
                        required
                    ></TextField>
                </Box>
                <Button
                    variant="outlined"
                    sx={{
                        paddingY: "10px",
                        width: "30%",
                        alignSelf: "flex-end",
                        mt: "20px",
                    }}
                    onClick={handleSubmit}
                >
                    Pay now
                </Button>
            </Box>
        </Card>
    );
}
