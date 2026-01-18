import Box from "@mui/material/Box";
import {
    DataGrid,
    GridActionsCellItem,
    GridColDef,
    GridRowId,
} from "@mui/x-data-grid";
import DeleteIcon from "@mui/icons-material/Delete";
import { getFinalPrice } from "@/shared/ItemCard";
import { CartItem } from "@shared/types";
import { useCallback } from "react";
import { useCartStore } from "@/store";

/**
This component displays a data grid of cart items. It uses the DataGrid component from 
'@mui/x-data-grid'. Each row in the grid represents an item in the cart.

The component uses the useCart custom hook to access and update the state of the cart items.

The handleDeleteClick function is used to remove an item from the cart. It filters out the 
item with the given id from the cart items and updates the state.

The processRowUpdate function is used to update a row in the data grid.
 */
export function DataGridComponent() {
    const cartItems = useCartStore((s) => s.items);
    const deleteItem = useCartStore((s) => s.deleteItem);
    const updateQuantity = useCartStore((s) => s.updateQuantity);

    const handleDeleteClick = useCallback(
        (id: GridRowId) => async () => {
            await deleteItem(id as number);
        },
        [deleteItem],
    );

    const processRowUpdate = useCallback(
        async (newRow: CartItem) => {
            const nextQuantity = Number(newRow.quantity);
            if (!Number.isFinite(nextQuantity) || nextQuantity < 1) {
                throw new Error("Quantity must be >= 1");
            }

            await updateQuantity(newRow.item.id, nextQuantity);

            return {
                ...newRow,
                quantity: nextQuantity,
                subTotal:
                    getFinalPrice(newRow.item.price, newRow.item.discount) *
                    nextQuantity,
            };
        },
        [updateQuantity],
    );

    const columns: GridColDef<CartItem>[] = [
        {
            field: "id",
            headerName: "ID",
            valueGetter: (_, row) => row.item.id,
        },
        {
            field: "title",
            headerName: "Product",
            valueGetter: (_, row) => row.item.title,
        },
        {
            field: "price",
            headerName: "Price",
            valueGetter: (_, row) => row.item.price,
        },
        {
            field: "quantity",
            headerName: "Quantity",
            type: "number",
            editable: true
        },
        {
            field: "subTotal",
            headerName: "Subtotal",
            type: "number",
            valueGetter: (_, row) => {
                return getFinalPrice(row.item.price, row.item.discount) * row.quantity;
            },
        },
        {
            field: "actions",
            type: "actions",
            headerName: "Actions",
            cellClassName: "actions",
            getActions: ({ id }) => {
                return [
                    <GridActionsCellItem
                        icon={<DeleteIcon />}
                        label="Delete"
                        sx={{
                            color: "red",
                        }}
                        onClick={handleDeleteClick(id)}
                    />,
                ];
            },
        },
    ];

    return (
        <Box
            sx={{
                height: 400,
                width: "65%",
                "@media(max-width: 550px)": {
                    width: "100%",
                },
            }}
        >
            <DataGrid
                getRowId={(row) => row.item.id}
                getRowHeight={() => "auto"}
                sx={{ background: "white" }}
                rows={cartItems}
                columns={columns}
                processRowUpdate={processRowUpdate}
                initialState={{
                    pagination: {
                        paginationModel: {
                            pageSize: 5,
                        },
                    },
                }}
                pageSizeOptions={[5]}
                rowHeight={100}
                checkboxSelection
                disableRowSelectionOnClick
                autosizeOptions={{
                    columns: ["name", "status", "createdBy"],
                    includeOutliers: true,
                    includeHeaders: false,
                }}
            />
        </Box>
    );
}
