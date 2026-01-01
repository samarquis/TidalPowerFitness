import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import PackageCard from '../PackageCard';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';

// Mock the contexts and next/navigation
jest.mock('@/contexts/AuthContext');
jest.mock('@/contexts/CartContext');
jest.mock('next/navigation', () => ({
    useRouter: () => ({
        push: jest.fn(),
    }),
}));

const mockedUseAuth = useAuth as jest.Mock;
const mockedUseCart = useCart as jest.Mock;

describe('PackageCard Component', () => {
    const mockPackage = {
        id: '1',
        name: 'Starter Pack',
        description: 'A great way to get started.',
        price_cents: 5000,
        credit_count: 5,
        type: 'one_time' as const,
    };

    beforeEach(() => {
        mockedUseAuth.mockReturnValue({
            isAuthenticated: true,
        });
        mockedUseCart.mockReturnValue({
            addToCart: jest.fn(),
        });
    });

    it('renders the package details correctly', () => {
        render(<PackageCard pkg={mockPackage} />);

        // Check that all the details are in the document
        expect(screen.getByText('Starter Pack')).toBeInTheDocument();
        expect(screen.getByText('$50.00')).toBeInTheDocument();
        expect(screen.getByText('A great way to get started.')).toBeInTheDocument();
        expect(screen.getByText('5 Tokens')).toBeInTheDocument();
    });

    it('renders the "Add to Cart" button', () => {
        render(<PackageCard pkg={mockPackage} />);
        
        const buyButton = screen.getByRole('button', { name: /Add to Cart/i });
        expect(buyButton).toBeInTheDocument();
        expect(buyButton).not.toBeDisabled();
    });
});
