import { Request, Response } from 'express';
import Cart from '../models/Cart';
import { AuthenticatedRequest } from '../types/auth'; // Added import

class CartController {
    // Get cart with items
    async getCart(req: AuthenticatedRequest, res: Response): Promise<void> {
        try {
            if (!req.user) {
                res.status(401).json({ error: 'Unauthorized' });
                return;
            }

            const cart = await Cart.getCartWithItems(req.user.id);
            const total = await Cart.getCartTotal(req.user.id);
            const itemCount = await Cart.getCartItemCount(req.user.id);

            res.json({
                items: cart?.items || [],
                total_cents: total,
                item_count: itemCount
            });
        } catch (error) {
            console.error('Error fetching cart:', error);
            res.status(500).json({ error: 'Failed to fetch cart' });
        }
    }

    // Add item to cart
    async addItem(req: AuthenticatedRequest, res: Response): Promise<void> {
        try {
            if (!req.user) {
                res.status(401).json({ error: 'Unauthorized' });
                return;
            }

            const { package_id, quantity = 1 } = req.body;

            if (!package_id) {
                res.status(400).json({ error: 'Package ID is required' });
                return;
            }

            if (quantity < 1) {
                res.status(400).json({ error: 'Quantity must be at least 1' });
                return;
            }

            const item = await Cart.addItem(req.user.id, package_id, quantity);
            const itemCount = await Cart.getCartItemCount(req.user.id);

            res.status(201).json({
                item,
                item_count: itemCount,
                message: 'Item added to cart'
            });
        } catch (error) {
            console.error('Error adding item to cart:', error);
            res.status(500).json({ error: 'Failed to add item to cart' });
        }
    }

    // Update item quantity
    async updateItem(req: AuthenticatedRequest, res: Response): Promise<void> {
        try {
            if (!req.user) {
                res.status(401).json({ error: 'Unauthorized' });
                return;
            }

            const { id } = req.params;
            const { quantity } = req.body;

            if (!quantity || quantity < 1) {
                res.status(400).json({ error: 'Valid quantity is required' });
                return;
            }

            const item = await Cart.updateItemQuantity(req.user.id, id, quantity);

            if (!item) {
                res.status(404).json({ error: 'Cart item not found' });
                return;
            }

            res.json({ item, message: 'Cart item updated' });
        } catch (error) {
            console.error('Error updating cart item:', error);
            res.status(500).json({ error: 'Failed to update cart item' });
        }
    }

    // Remove item from cart
    async removeItem(req: AuthenticatedRequest, res: Response): Promise<void> {
        try {
            if (!req.user) {
                res.status(401).json({ error: 'Unauthorized' });
                return;
            }

            const { id } = req.params;
            const success = await Cart.removeItem(req.user.id, id);

            if (!success) {
                res.status(404).json({ error: 'Cart item not found' });
                return;
            }

            const itemCount = await Cart.getCartItemCount(req.user.id);

            res.json({
                message: 'Item removed from cart',
                item_count: itemCount
            });
        } catch (error) {
            console.error('Error removing cart item:', error);
            res.status(500).json({ error: 'Failed to remove cart item' });
        }
    }

    // Clear cart
    async clearCart(req: AuthenticatedRequest, res: Response): Promise<void> {
        try {
            if (!req.user) {
                res.status(401).json({ error: 'Unauthorized' });
                return;
            }

            await Cart.clearCart(req.user.id);

            res.json({ message: 'Cart cleared' });
        } catch (error) {
            console.error('Error clearing cart:', error);
            res.status(500).json({ error: 'Failed to clear cart' });
        }
    }
}

export default new CartController();
