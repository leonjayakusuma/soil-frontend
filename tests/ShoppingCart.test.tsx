import {
    render,
    screen
} from '@testing-library/react';
import ShoppingCart from '../src/components/ShoppingCart/ShoppingCart';
// import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { CartContext } from '@/App';
import { BrowserRouter } from 'react-router-dom';
// import {CartContext.Provider} from '@/App';

import {
    describe,
    it,
    expect,
    vitest
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

const mockSetCartItems = vitest.fn();

describe('ShoppingCart', () => {
    it('renders ShoppingCart component', async () => {
        await render(
            <BrowserRouter>
                <CartContext.Provider value={[mockCartItems, mockSetCartItems]}>
                    <ShoppingCart />
                </CartContext.Provider>
            </BrowserRouter>

        );
        // await userEvent.click(screen.getByText('Add to Cart'));
        expect(screen.getAllByRole('heading')[0]).toHaveTextContent('Shopping Cart');
        // Add your assertions here
    });

    // Add more tests as needed
});