import { create } from 'zustand';
import { CartItem, Item } from '@/types';
import { getUserCart, addItemToCart, updateItemQuantityFromCart, deleteItemFromCart } from '@/api/User';
import { getSOILInfo } from '@/SoilInfo';
import { getFinalPrice } from '@/shared/ItemCard/Price';

interface CartStore {
    items: CartItem[];
    isLoading: boolean;
    error: string | null;
    
    // Actions
    fetchCart: () => Promise<void>;
    addItem: (item: Item) => Promise<{ success: boolean; message?: string }>;
    updateQuantity: (itemId: number, quantity: number) => Promise<void>;
    deleteItem: (itemId: number) => Promise<void>;
    clearCart: () => void;
}

export const useCartStore = create<CartStore>((set, get) => ({
    items: [],
    isLoading: false,
    error: null,

    fetchCart: async () => {
        const userInfo = getSOILInfo().userInfo;
        if (!userInfo) {
            set({ items: [], error: null });
            return;
        }

        set({ isLoading: true, error: null });
        try {
            const res = await getUserCart();
            if (res.data) {
                // Transform API cart items to include subTotal
                const cartItemsWithSubTotal: CartItem[] = res.data.map((item) => ({
                    ...item,
                    subTotal: getFinalPrice(item.item.price, item.item.discount) * item.quantity,
                }));
                set({ items: cartItemsWithSubTotal, isLoading: false, error: null });
            } else {
                set({ items: [], isLoading: false, error: null });
            }
        } catch (error) {
            console.error('Error fetching cart:', error);
            set({ items: [], isLoading: false, error: 'Failed to fetch cart' });
        }
    },

    addItem: async (item: Item) => {
        const userInfo = getSOILInfo().userInfo;
        if (!userInfo) {
            return { success: false, message: 'Please login to buy items.' };
        }

        const { items } = get();
        const existingItem = items.find((cartItem) => cartItem.item.id === item.id);

        // Check quantity limit
        if (existingItem && existingItem.quantity >= 255) {
            return { success: false, message: 'You can only buy 255 of the same item at a time.' };
        }

        try {
            const res = await addItemToCart(item.id);
            if (!res.data) {
                return { success: false, message: 'Error adding item to cart' };
            }

            // Update local state - clone first, then find and modify the cloned item
            const tempCartItems = structuredClone(items);
            const clonedExistingItem = tempCartItems.find((ci) => ci.item.id === item.id);
            
            if (clonedExistingItem) {
                clonedExistingItem.quantity++;
                clonedExistingItem.subTotal =
                    clonedExistingItem.quantity *
                    getFinalPrice(clonedExistingItem.item.price, clonedExistingItem.item.discount);
            } else {
                const newCartItem: CartItem = {
                    item: {
                        id: item.id,
                        title: item.title,
                        price: item.price,
                        discount: item.discount,
                        imgUrl: item.imgUrl,
                    },
                    quantity: 1,
                    subTotal: getFinalPrice(item.price, item.discount),
                };
                tempCartItems.push(newCartItem);
            }

            set({ items: tempCartItems });
            return { success: true, message: `Item ${item.title} added to cart` };
        } catch (error) {
            console.error('Error adding item to cart:', error);
            return { success: false, message: 'Error adding item to cart' };
        }
    },

    updateQuantity: async (itemId: number, quantity: number) => {
        const userInfo = getSOILInfo().userInfo;
        if (!userInfo) {
            return;
        }

        try {
            const res = await updateItemQuantityFromCart(itemId, quantity);
            if (res.data) {
                const { items } = get();
                const updatedItems = items.map((cartItem) => {
                    if (cartItem.item.id === itemId) {
                        return {
                            ...cartItem,
                            quantity,
                            subTotal: getFinalPrice(cartItem.item.price, cartItem.item.discount) * quantity,
                        };
                    }
                    return cartItem;
                });
                set({ items: updatedItems });
            }
        } catch (error) {
            console.error('Error updating quantity:', error);
        }
    },

    deleteItem: async (itemId: number) => {
        const userInfo = getSOILInfo().userInfo;
        if (!userInfo) {
            return;
        }

        try {
            const res = await deleteItemFromCart(itemId);
            if (res.data) {
                const { items } = get();
                const updatedItems = items.filter((cartItem) => cartItem.item.id !== itemId);
                set({ items: updatedItems });
            }
        } catch (error) {
            console.error('Error deleting item:', error);
        }
    },

    clearCart: () => {
        set({ items: [], error: null });
    },
}));

