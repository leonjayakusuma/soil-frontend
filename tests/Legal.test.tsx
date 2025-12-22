import {
    render,
    screen
} from '@testing-library/react';
// import ShoppingCart from '../src/components/ShoppingCart/ShoppingCart';
import { Legal } from '@/components/Footer';
// import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';

import {
    describe,
    it,
    expect
} from "vitest";

describe('Legal', () => {
    it('renders Legal component', async () => {
        render(<Legal />);
        // await userEvent.click(screen.getByText('Add to Cart'));
        expect(screen.getAllByRole('link')[0]).toHaveTextContent('Credits');
        // Add your assertions here
    });

    // Add more tests as needed
});