import {
    render,
    screen,
    waitFor,
    within
} from '@testing-library/react';
import { DataGridComponent } from '@/components/ShoppingCart';
import userEvent from '@testing-library/user-event';
import { deleteItemFromCart } from "@/api/User";
import { getSOILInfo } from '@/SoilInfo';

import {
    describe,
    it,
    expect,
    vi,
    afterEach
} from "vitest";

import { CartContext } from "@/App";


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

const mockSetCartItems = vi.fn((newCartItems) => {
    mockCartItems = newCartItems;
});

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
vi.mock('@/SOILInfo', () => ({
    getSOILInfo: vi.fn(() => ({
        userInfo: true
    }))
}));


describe('Data Grid component', () => {
    afterEach(() => {
        vi.clearAllMocks();
        mockCartItems = defaultMockCartItems;
    });
    it('renders data grid component', async () => {
        render(
            <CartContext.Provider value={[mockCartItems, mockSetCartItems]}>
                <DataGridComponent />
            </CartContext.Provider>

        );
        // await userEvent.click(screen.getByText('Add to Cart'));
        // expect(screen.getAllByRole('gridcell')[0]).toHaveTextContent('Actions');
        expect(screen.getByText('Actions')).toBeInTheDocument();
        // Add your assertions here
    });

    it('has delete button', async () => {
        render(
            <CartContext.Provider value={[mockCartItems, mockSetCartItems]}>
                <DataGridComponent />
            </CartContext.Provider>

        );
        // await userEvent.click(screen.getByText('Add to Cart'));
        expect(screen.getAllByLabelText('Delete')[0]).toBeInTheDocument();
        // Add your assertions here
    });

    it('has delete button working properly', async () => {
        const { rerender } = render(
            <CartContext.Provider value={[mockCartItems, mockSetCartItems]}>
                <DataGridComponent />
            </CartContext.Provider>

        );
        expect(screen.getByText('item1')).toBeInTheDocument();

        const user = userEvent.setup();
        expect(screen.getAllByLabelText('Delete')[0]).toBeInTheDocument();
        const delete_button = screen.getAllByLabelText('Delete')[0];
        await waitFor(() => user.click(delete_button));
        // console.log(container.container);
        // screen.debug(delete_button);
        // screen.debug(screen.getByText('item1'));

        const item1 = screen.getByText('item1');
        expect(item1).toBeInTheDocument();

        expect(getSOILInfo).toHaveBeenCalled();
        expect(deleteItemFromCart).toHaveBeenCalled();
        expect(mockSetCartItems).toHaveBeenCalled();

        // console.log(mockCartItems);
        // let all_rows = screen.getAllByRole('row').map((el) => el.textContent);
        // console.log(all_rows);

        rerender(
            <CartContext.Provider value={[mockCartItems, mockSetCartItems]}>
                <DataGridComponent />
            </CartContext.Provider>
        )

        // all_rows = screen.getAllByRole('row').map((el) => el.textContent);
        // console.log(all_rows);

        expect(item1).not.toBeInTheDocument();
    })

    it('has edit quantity button', async () => {
        const { rerender } = render(
            <CartContext.Provider value={[mockCartItems, mockSetCartItems]}>
                <DataGridComponent />
            </CartContext.Provider>
        );
        const user = userEvent.setup();
        const all_rows = screen.getAllByRole('row').map((el) => el.textContent);
        console.log(all_rows);
        // let edit_quantity_element = screen.getAllByRole('gridcell');
        let edit_quantity_element = screen.getByText("9");
        screen.debug(edit_quantity_element);
        expect(edit_quantity_element).toBeInTheDocument();
        user.dblClick(edit_quantity_element!);
        user.hover(edit_quantity_element!);
        await waitFor(() => expect(screen.getByText('9')).toBeInTheDocument(), {
            timeout: 2000
        });
        rerender(
            <CartContext.Provider value={[mockCartItems, mockSetCartItems]}>
                <DataGridComponent />
            </CartContext.Provider>
        )
        edit_quantity_element = screen.getByText("9")!;
        const descendant = within(edit_quantity_element).getByRole('input');
        screen.debug(edit_quantity_element!);
        // screen.debug(descendant);
        // const quantityInput = await edit_quantity_element?.querySelector('input[type="number"]');
        // expect(quantityInput).toBeInTheDocument();

        // all_rows = screen.getAllByRole('row').map((el) => el.textContent);
        // console.log(all_rows);
        // screen.debug();
    })

});