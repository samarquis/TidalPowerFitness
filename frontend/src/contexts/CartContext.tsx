'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { apiClient } from '@/lib/api';

interface CartItem {
    id: string;
    package_id: string;
    quantity: number;
    package_name: string;
    package_price_cents: number;
    package_description: string;
}

interface Cart {
    items: CartItem[];
    total_cents: number;
    item_count: number;
}

interface CartContextType {
    cart: Cart | null;
    loading: boolean;
    addToCart: (packageId: string, quantity?: number) => Promise<{ success: boolean; error?: string }>;
    removeFromCart: (itemId: string) => Promise<{ success: boolean; error?: string }>;
    updateQuantity: (itemId: string, quantity: number) => Promise<{ success: boolean; error?: string }>;
    clearCart: () => Promise<{ success: boolean; error?: string }>;
    refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
    const { isAuthenticated, token } = useAuth();
    const [cart, setCart] = useState<Cart | null>(null);
    const [loading, setLoading] = useState(false);

    const refreshCart = async () => {
        if (!isAuthenticated || !token) {
            setCart(null);
            return;
        }

        try {
            setLoading(true);
            const response = await apiClient.getCart();
            if (response.data) {
                setCart(response.data);
            }
        } catch (error) {
            console.error('Error fetching cart:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        refreshCart();
    }, [isAuthenticated, token]);

    const addToCart = async (packageId: string, quantity: number = 1) => {
        if (!isAuthenticated) {
            return { success: false, error: 'Please log in to add items to cart' };
        }

        const response = await apiClient.addToCart(packageId, quantity);
        if (response.data) {
            await refreshCart();
            return { success: true };
        }
        return { success: false, error: response.error };
    };

    const removeFromCart = async (itemId: string) => {
        const response = await apiClient.removeFromCart(itemId);
        if (response.data) {
            await refreshCart();
            return { success: true };
        }
        return { success: false, error: response.error };
    };

    const updateQuantity = async (itemId: string, quantity: number) => {
        const response = await apiClient.updateCartItem(itemId, quantity);
        if (response.data) {
            await refreshCart();
            return { success: true };
        }
        return { success: false, error: response.error };
    };

    const clearCart = async () => {
        const response = await apiClient.clearCart();
        if (response.data) {
            await refreshCart();
            return { success: true };
        }
        return { success: false, error: response.error };
    };

    return (
        <CartContext.Provider
            value={{
                cart,
                loading,
                addToCart,
                removeFromCart,
                updateQuantity,
                clearCart,
                refreshCart,
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
}
