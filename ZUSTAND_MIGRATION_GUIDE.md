# Zustand Migration Guide

This guide walks you through migrating from Context API + localStorage + custom events to Zustand.

## ✅ Step 1: Install Zustand (DONE)
```bash
npm install zustand
```

## ✅ Step 2: Create Stores (DONE)
Stores have been created:
- `src/store/cartStore.ts` - Cart state management
- `src/store/authStore.ts` - Auth state management  
- `src/store/index.ts` - Central exports

## 📋 Step 3: Update Components Using Cart

### Files to Update (12 files):
1. `src/shared/ItemCard/Btns.tsx`
2. `src/components/Profile/ProfileReadMode.tsx`
3. `src/components/ShoppingCart/DataGridComponent.tsx`
4. `src/components/Profile/Profile.tsx`
5. `src/components/ShoppingCart/CartTotalCard.tsx`
6. `src/components/ShoppingCart/Checkout/PaymentDetails.tsx`
7. `src/components/Navbar/DesktopMenu.tsx`
8. `src/components/Navbar/MobileMenu.tsx`
9. `src/components/ShoppingCart/ShoppingCart.tsx`
10. `tests/ShoppingCart.test.tsx`
11. `tests/DataGridComponent.test.tsx`
12. `src/App.tsx` (remove CartContext)

### Migration Pattern:

**Before:**
```typescript
import { useCart } from '@/App';

const [cartItems, setCartItems, fetchCart] = useCart();
```

**After:**
```typescript
import { useCartStore } from '@/store';

const { items, addItem, fetchCart, updateQuantity, deleteItem } = useCartStore();
// Or if you only need items:
const items = useCartStore(state => state.items);
```

## 📋 Step 4: Update Btns.tsx (Example)

**Before:**
```typescript
const [cartItems, setCartItems] = useCart();

function handleClickCart() {
    // ... complex logic ...
    setCartItems(tempCartItems);
}
```

**After:**
```typescript
import { useCartStore } from '@/store';
import { usePopup } from '../Popup';

const { addItem } = useCartStore();
const popup = usePopup()!;

async function handleClickCart() {
    const result = await addItem(item);
    if (result.success) {
        popup(result.message!);
    } else {
        popup(result.message || 'Failed to add item');
    }
}
```

## 📋 Step 5: Update App.tsx

**Remove:**
- `CartContext` creation
- `useCart` hook
- `CartContext.Provider`
- `fetchCartItems` function
- `useEffect` for cart fetching
- `window.addEventListener("refreshCart")`

**Add:**
```typescript
import { useAuthStore, useCartStore } from '@/store';
import { useEffect } from 'react';

export default function App() {
    const initializeAuth = useAuthStore(state => state.initialize);
    const fetchCart = useCartStore(state => state.fetchCart);

    useEffect(() => {
        // Initialize auth and fetch cart on mount
        initializeAuth();
    }, [initializeAuth]);

    // Remove CartContext.Provider wrapper
    return (
        <ReactLenis root>
            <ThemeProvider theme={theme}>
                <BrowserRouter>
                    <PopupProvider>
                        <Navbar />
                        <AnimatedRoutes />
                    </PopupProvider>
                </BrowserRouter>
            </ThemeProvider>
        </ReactLenis>
    );
}
```

## 📋 Step 6: Update Login Component

**Before:**
```typescript
setSOILItem("userInfo", {...});
window.dispatchEvent(new Event("refreshCart"));
```

**After:**
```typescript
import { useAuthStore } from '@/store';

const login = useAuthStore(state => state.login);

async function handleSubmit(e: React.SyntheticEvent) {
    e.preventDefault();
    const result = await login(email, pswd);
    if (result.success) {
        popup(result.message!);
        navigate("/");
    } else {
        setEmailErrorTxt(result.message || 'Login failed');
        setPswdErrorTxt(result.message || 'Login failed');
    }
}
```

## 📋 Step 7: Update Logout (if exists)

**Before:**
```typescript
setSOILItem("userInfo", undefined);
window.dispatchEvent(new Event("refreshCart"));
```

**After:**
```typescript
import { useAuthStore } from '@/store';

const logout = useAuthStore(state => state.logout);

function handleLogout() {
    logout();
    navigate("/");
}
```

## 📋 Step 8: Replace Custom Events

**Find and replace:**
- `window.dispatchEvent(new Event("refreshCart"))` → `useCartStore.getState().fetchCart()`
- `window.addEventListener("refreshCart", ...)` → Remove (use Zustand subscriptions instead)

## 📋 Step 9: Update Components That Check Auth

**Before:**
```typescript
const isLoggedIn = !!getSOILInfo().userInfo;
```

**After:**
```typescript
import { useAuthStore } from '@/store';

const isAuthenticated = useAuthStore(state => state.isAuthenticated);
// Or
const userInfo = useAuthStore(state => state.userInfo);
const isLoggedIn = !!userInfo;
```

## 📋 Step 10: Testing Checklist

- [ ] Cart items load on app start
- [ ] Add item to cart works
- [ ] Update quantity works
- [ ] Remove item works
- [ ] Cart persists after login
- [ ] Cart clears after logout
- [ ] Login works and fetches cart
- [ ] Logout works and clears cart
- [ ] No console errors
- [ ] All 12 components using cart work correctly

## 🧹 Step 11: Cleanup

After migration is complete and tested:

1. Delete `CartContext` from `App.tsx`
2. Delete `useCart` hook from `App.tsx`
3. Remove unused imports
4. Remove custom event listeners
5. Update tests to use Zustand stores

## 📝 Notes

- Zustand automatically handles re-renders when state changes
- No need for Context Providers
- Stores can be used outside React components if needed
- TypeScript types are automatically inferred
- Stores are much easier to test

## 🚀 Quick Reference

### Cart Store API:
```typescript
const {
    items,           // CartItem[]
    isLoading,       // boolean
    error,           // string | null
    fetchCart,       // () => Promise<void>
    addItem,         // (item: Item) => Promise<{success, message}>
    updateQuantity,  // (itemId: number, quantity: number) => Promise<void>
    deleteItem,      // (itemId: number) => Promise<void>
    clearCart,       // () => void
} = useCartStore();
```

### Auth Store API:
```typescript
const {
    userInfo,        // UserInfo | null
    isAuthenticated, // boolean
    login,           // (email: string, password: string) => Promise<{success, message}>
    logout,          // () => void
    initialize,      // () => void
} = useAuthStore();
```

