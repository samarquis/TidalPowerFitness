import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import PackageCard from '../PackageCard';
import { useAuth } from '@/contexts/AuthContext';

// Mock the AuthContext
jest.mock('@/contexts/AuthContext');

const mockedUseAuth = useAuth as jest.Mock;

describe('PackageCard Component', () => {
    const mockPackage = {
        id: 1,
        name: 'Starter Pack',
        description: 'A great way to get started.',
        price: 50,
        credit_amount: 5,
    };

    beforeEach(() => {
        // Provide a default mock implementation for useAuth
        mockedUseAuth.mockReturnValue({
            isAuthenticated: true,
            token: 'fake-token',
        });
    });

    it('renders the package details correctly', () => {
        render(<PackageCard pkg={mockPackage} />);

        // Check that all the details are in the document
        expect(screen.getByText('Starter Pack')).toBeInTheDocument();
        expect(screen.getByText('$50')).toBeInTheDocument();
        expect(screen.getByText('A great way to get started.')).toBeInTheDocument();
        expect(screen.getByText('5 Credits')).toBeInTheDocument();
    });

    it('renders the "Buy Now" button', () => {
        render(<PackageCard pkg={mockPackage} />);
        
        const buyButton = screen.getByRole('button', { name: /buy now/i });
        expect(buyButton).toBeInTheDocument();
        expect(buyButton).not.toBeDisabled();
    });
});
