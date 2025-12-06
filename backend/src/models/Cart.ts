import { query } from '../config/db';

export interface CartItem {
    id: string;
    cart_id: string;
    package_id: string;
    quantity: number;
    package_name?: string;
    package_price_cents?: number;
    package_description?: string;
    created_at: Date;
    updated_at: Date;
}

export interface Cart {
    id: string;
    user_id: string;
    created_at: Date;
    updated_at: Date;
    items?: CartItem[];
}

class CartModel {
    // Get or create cart for user
    async getOrCreateCart(userId: string): Promise<Cart> {
        const result = await query(
            `INSERT INTO cart (user_id) 
             VALUES ($1) 
             ON CONFLICT (user_id) DO UPDATE SET user_id = $1
             RETURNING *`,
            [userId]
        );
        return result.rows[0];
    }

    // Get cart with items for user
    async getCartWithItems(userId: string): Promise<Cart | null> {
        const cartResult = await query(
            'SELECT * FROM cart WHERE user_id = $1',
            [userId]
        );

        if (cartResult.rows.length === 0) {
            return null;
        }

        const cart = cartResult.rows[0];

        const itemsResult = await query(
            `SELECT ci.*, p.name as package_name, p.price_cents as package_price_cents, 
                    p.description as package_description
             FROM cart_items ci
             JOIN packages p ON ci.package_id = p.id
             WHERE ci.cart_id = $1
             ORDER BY ci.created_at DESC`,
            [cart.id]
        );

        cart.items = itemsResult.rows;
        return cart;
    }

    // Add item to cart
    async addItem(userId: string, packageId: string, quantity: number = 1): Promise<CartItem> {
        const cart = await this.getOrCreateCart(userId);

        const result = await query(
            `INSERT INTO cart_items (cart_id, package_id, quantity)
             VALUES ($1, $2, $3)
             ON CONFLICT (cart_id, package_id) 
             DO UPDATE SET quantity = cart_items.quantity + $3, updated_at = CURRENT_TIMESTAMP
             RETURNING *`,
            [cart.id, packageId, quantity]
        );

        return result.rows[0];
    }

    // Update item quantity
    async updateItemQuantity(userId: string, itemId: string, quantity: number): Promise<CartItem | null> {
        const cart = await this.getOrCreateCart(userId);

        const result = await query(
            `UPDATE cart_items 
             SET quantity = $1, updated_at = CURRENT_TIMESTAMP
             WHERE id = $2 AND cart_id = $3
             RETURNING *`,
            [quantity, itemId, cart.id]
        );

        return result.rows.length > 0 ? result.rows[0] : null;
    }

    // Remove item from cart
    async removeItem(userId: string, itemId: string): Promise<boolean> {
        const cart = await this.getOrCreateCart(userId);

        const result = await query(
            'DELETE FROM cart_items WHERE id = $1 AND cart_id = $2',
            [itemId, cart.id]
        );

        return result.rowCount !== null && result.rowCount > 0;
    }

    // Clear cart
    async clearCart(userId: string): Promise<boolean> {
        const cart = await this.getOrCreateCart(userId);

        const result = await query(
            'DELETE FROM cart_items WHERE cart_id = $1',
            [cart.id]
        );

        return true;
    }

    // Get cart total
    async getCartTotal(userId: string): Promise<number> {
        const cart = await this.getCartWithItems(userId);

        if (!cart || !cart.items) {
            return 0;
        }

        return cart.items.reduce((total, item) => {
            return total + (item.package_price_cents || 0) * item.quantity;
        }, 0);
    }

    // Get cart item count
    async getCartItemCount(userId: string): Promise<number> {
        const cart = await this.getCartWithItems(userId);

        if (!cart || !cart.items) {
            return 0;
        }

        return cart.items.reduce((count, item) => count + item.quantity, 0);
    }
}

export default new CartModel();
