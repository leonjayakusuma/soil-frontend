import { create } from 'zustand';
import { setSOILItem, getSOILInfo, SOILUserInfo } from '@/SoilInfo';
import { logInUser, logOutUser } from '@/api/User';
import { useCartStore } from './cartStore';

interface AuthStore {
    userInfo: SOILUserInfo | null;
    isAuthenticated: boolean;
    
    // Actions
    login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
    logout: () => Promise<{ success: boolean; message?: string }>;
    initialize: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>((set, get) => ({
    userInfo: null,
    isAuthenticated: false,

    initialize: async () => {
        const userInfo = getSOILInfo().userInfo;
        if (userInfo) {
            set({ 
                userInfo: userInfo, 
                isAuthenticated: true 
            });
            // Auto-fetch cart when user is logged in
            await useCartStore.getState().fetchCart();
        } else {
            set({ userInfo: null, isAuthenticated: false });
        }
    },

    login: async (email: string, password: string) => {
        try {
            const response = await logInUser(email, password);
            if (!response.data || response.isError) {
                return { success: false, message: response.msg };
            }

            const userInfo: SOILUserInfo = {
                ...response.data,
                userId: response.data.id,
            };

            // Update localStorage
            setSOILItem('userInfo', userInfo);

            // Update Zustand store
            set({ userInfo, isAuthenticated: true });

            // Fetch cart after login
            await useCartStore.getState().fetchCart();

            const displayName = response.data.name ?? email;
            return { success: true, message: `Welcome ${displayName}` };
        } catch (error) {
            console.error('Login error:', error);
            return { success: false, message: 'Login failed' };
        }
    },

    logout: async () => {
        const userInfo = get().userInfo;
        let serverLogoutSuccess = true;
        
        try {
            if (userInfo) {
                // logOutUser clears localStorage internally (via localStorage.clear()) and returns boolean
                serverLogoutSuccess = await logOutUser();
                if (!serverLogoutSuccess) {
                    console.warn('Server logout failed, but local logout proceeding');
                }
            } else {
                // No user info, just clear local storage manually
                setSOILItem('userInfo', undefined);
            }
        } catch (error) {
            // localStorage operations failed, but we'll still clear Zustand state
            console.error('Logout localStorage error (non-critical):', error);
        }
        
        // Clear Zustand stores (localStorage already cleared by logOutUser if userInfo existed)
        set({ userInfo: null, isAuthenticated: false });
        useCartStore.getState().clearCart();
        
        return { 
            success: true, 
            message: serverLogoutSuccess 
                ? 'Successfully logged out' 
                : 'Logged out locally (server logout may have failed)' 
        };
    },
}));

