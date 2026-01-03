import { Box, Container, Stack, Typography } from "@mui/material";
import { useState, useEffect } from "react";
import { BuyCard } from "./components/ItemPage/BuyCard";

/**
 * TestPage component - A boilerplate page for testing purposes
 * 
 * This component serves as a template for creating new pages in the application.
 * It includes common patterns like:
 * - State management with useState
 * - Side effects with useEffect
 * - Material-UI layout components
 * - Responsive design patterns
 */
export default function TestPage() {
    return (
        <Stack 
            width="100vw" 
            sx={{ minHeight: "100vh" }} 
            bgcolor="white" 
            color="black"

        >
            <Container sx={{ marginY: "100px" }}>
                <Typography variant="h2" textAlign="center" mb={4}>
                    Test Page
                </Typography>
                
                <BuyCard />
            </Container>
        </Stack>
    );
}

