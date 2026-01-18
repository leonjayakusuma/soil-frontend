import {
    render,
    screen
} from '@testing-library/react';
import ShoppingCart from '../src/components/ShoppingCart/ShoppingCart';
// import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
// import {CartContext.Provider} from '@/App';
import { useCartStore } from '@/store';

import {
    describe,
    it,
    expect,
} from "vitest";

// const CustomTestShoppingCart = 
const mockCartItems = [
    {
        item: {
            id: 1,
            title: 'Test Product 1',
            price: 100,
            discount: 0
        },
        quantity: 1
    }
];

describe('ShoppingCart', () => {
    it('renders ShoppingCart component', async () => {
        useCartStore.setState({
            items: mockCartItems as any,
        });

        await render(
            <BrowserRouter>
                <ShoppingCart />
            </BrowserRouter>

        );
        // await userEvent.click(screen.getByText('Add to Cart'));
        expect(screen.getAllByRole('heading')[0]).toHaveTextContent('Shopping Cart');
        // Add your assertions here
    });

    // Add more tests as needed
});