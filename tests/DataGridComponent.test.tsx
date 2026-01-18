import {
    render,
    screen,
    waitFor,
} from '@testing-library/react';
import { DataGridComponent } from '@/components/ShoppingCart';
import userEvent from '@testing-library/user-event';
import { deleteItemFromCart, updateItemQuantityFromCart } from "@/api/User";
import { getSOILInfo } from '@/SoilInfo';
import { useCartStore } from '@/store';

import {
    describe,
    it,
    expect,
    vi,
    afterEach
} from "vitest";


// console.log(deleteItemSpy);
let mockCartItems = [
    {
        item: {
            id: 1,
            title: 'item1',
            price: 10,
            discount: 0.1
        },
        quantity: 9,
        subTotal: 9,
    },
    {
        item: {
            id: 2,
            title: 'item2',
            price: 20,
            discount: 0.2
        },
        quantity: 2,
        subTotal: 36,
    },
];

const defaultMockCartItems = mockCartItems;

vi.mock('@/api/User', () => ({
    deleteItemFromCart: vi.fn((id: number) => Promise.resolve({
        message: "Item" + id + "has been deleted",
        data: true
    })),
    updateItemQuantityFromCart: vi.fn((itemId: number, quantity: number) => Promise.resolve({
        message: `Item quantity in item ${itemId} has been updated with quantity ${quantity}`,
        data: true
    }))
}));
vi.mock('@/SoilInfo', () => ({
    getSOILInfo: vi.fn(() => ({
        userInfo: { accessToken: 'test' }
    }))
}));


describe('Data Grid component', () => {
    afterEach(() => {
        vi.clearAllMocks();
        mockCartItems = defaultMockCartItems;
        useCartStore.setState({ items: [] as any });
    });
    it('renders data grid component', async () => {
        useCartStore.setState({ items: mockCartItems as any });
        render(
            <DataGridComponent />
        );
        // await userEvent.click(screen.getByText('Add to Cart'));
        // expect(screen.getAllByRole('gridcell')[0]).toHaveTextContent('Actions');
        expect(screen.getByText('Actions')).toBeInTheDocument();
        // Add your assertions here
    });

    it('has delete button', async () => {
        useCartStore.setState({ items: mockCartItems as any });
        render(
            <DataGridComponent />
        );
        // await userEvent.click(screen.getByText('Add to Cart'));
        expect(screen.getAllByLabelText('Delete')[0]).toBeInTheDocument();
        // Add your assertions here
    });

    it('has delete button working properly', async () => {
        useCartStore.setState({ items: mockCartItems as any });
        render(<DataGridComponent />);
        expect(screen.getByText('item1')).toBeInTheDocument();

        const user = userEvent.setup();
        expect(screen.getAllByLabelText('Delete')[0]).toBeInTheDocument();
        const delete_button = screen.getAllByLabelText('Delete')[0];
        await user.click(delete_button);

        expect(getSOILInfo).toHaveBeenCalled();
        expect(deleteItemFromCart).toHaveBeenCalled();

        await waitFor(() => {
            expect(screen.queryByText('item1')).not.toBeInTheDocument();
        });
    });

    it('has edit quantity button', async () => {
        useCartStore.setState({ items: mockCartItems as any });
        render(<DataGridComponent />);
        const user = userEvent.setup();
        const cell = screen.getByText("9");
        expect(cell).toBeInTheDocument();

        await user.dblClick(cell);
        const input = await screen.findByRole('spinbutton');
        await user.clear(input);
        await user.type(input, "3");
        await user.keyboard("{Enter}");

        await waitFor(() => {
            expect(updateItemQuantityFromCart).toHaveBeenCalled();
        });
    });

});