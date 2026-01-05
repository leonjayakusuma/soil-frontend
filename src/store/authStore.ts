import { create } from 'zustand';
import { setSOILItem, getSOILInfo } from '@/SoilInfo';
import { logInUser, logOutUser } from '@/api/User';
import { useCartStore } from './cartStore';

interface UserInfo {
    id: number;
    userId: number;
    name?: string;
    email: string;
    accessToken: string;
    refreshToken: string;
}

interface AuthStore {
    userInfo: UserInfo | null;
    isAuthenticated: boolean;
    
    // Actions
    login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
    logout: () => void;
    initialize: () => void;
}

export const useAuthStore = create<AuthStore>((set, get) => ({
    userInfo: null,
    isAuthenticated: false,

    initialize: () => {
        const userInfo = getSOILInfo().userInfo;
        if (userInfo) {
            set({ 
                userInfo: userInfo as UserInfo, 
                isAuthenticated: true 
            });
            // Auto-fetch cart when user is logged in
            useCartStore.getState().fetchCart();
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

            const userInfo: UserInfo = {
                ...response.data,
                userId: response.data.id,
                email: email, // Use email from login form since API doesn't return it
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
        try {
            const userInfo = get().userInfo;
            if (userInfo) {
                await logOutUser();
            }
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            // Clear localStorage
            setSOILItem('userInfo', undefined);
            
            // Clear Zustand stores
            set({ userInfo: null, isAuthenticated: false });
            useCartStore.getState().clearCart();
        }
    },
}));

