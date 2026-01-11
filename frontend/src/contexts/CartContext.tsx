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
    const { isAuthenticated } = useAuth();
    const [cart, setCart] = useState<Cart | null>(null);
    const [loading, setLoading] = useState(false);

    const refreshCart = async () => {
        if (!isAuthenticated) {
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
    }, [isAuthenticated]);

    const addToCart = async (packageId: string, quantity: number = 1) => {
        if (!isAuthenticated) {
            return { success: false, error: 'Please log in to add items to cart' };
        }

        // We don't have the full package details here to do a perfect optimistic update,
        // but we can at least show a loading state or a temporary item.
        // For simplicity and accuracy with the backend, we'll keep the server sync for adding,
        // as the package name and price are needed from the DB.
        
        const response = await apiClient.addToCart(packageId, quantity);
        if (response.data) {
            await refreshCart();
            return { success: true };
        }
        return { success: false, error: response.error };
    };

    const removeFromCart = async (itemId: string) => {
        if (!cart) return { success: false, error: 'Cart not found' };

        // Optimistic update
        const previousCart = { ...cart };
        const updatedItems = cart.items.filter(item => item.id !== itemId);
        const removedItem = cart.items.find(item => item.id === itemId);
        
        const newTotal = cart.total_cents - (removedItem ? (removedItem.package_price_cents * removedItem.quantity) : 0);
        
        setCart({
            ...cart,
            items: updatedItems,
            item_count: cart.item_count - (removedItem ? removedItem.quantity : 0),
            total_cents: Math.max(0, newTotal)
        });

        const response = await apiClient.removeFromCart(itemId);
        if (response.data) {
            return { success: true };
        } else {
            // Revert on failure
            setCart(previousCart);
            return { success: false, error: response.error };
        }
    };

    const updateQuantity = async (itemId: string, quantity: number) => {
        if (!cart) return { success: false, error: 'Cart not found' };

        // Optimistic update
        const previousCart = { ...cart };
        const updatedItems = cart.items.map(item => {
            if (item.id === itemId) {
                return { ...item, quantity };
            }
            return item;
        });

        // Recalculate total
        const newTotal = updatedItems.reduce((sum, item) => sum + (item.package_price_cents * item.quantity), 0);
        const newCount = updatedItems.reduce((sum, item) => sum + item.quantity, 0);

        setCart({
            ...cart,
            items: updatedItems,
            item_count: newCount,
            total_cents: newTotal
        });

        const response = await apiClient.updateCartItem(itemId, quantity);
        if (response.data) {
            return { success: true };
        } else {
            // Revert on failure
            setCart(previousCart);
            return { success: false, error: response.error };
        }
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
