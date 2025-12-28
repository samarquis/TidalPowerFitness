import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import LoginPage from '../page';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter, useSearchParams } from 'next/navigation';

// Mocks
jest.mock('@/contexts/AuthContext');
jest.mock('next/navigation', () => ({
    useRouter: jest.fn(),
    useSearchParams: jest.fn(),
}));

describe('LoginPage', () => {
    const mockLogin = jest.fn();
    const mockRouterPush = jest.fn();
    const mockUseRouter = useRouter as jest.Mock;
    const mockUseSearchParams = useSearchParams as jest.Mock;
    const mockUseAuth = useAuth as jest.Mock;

    beforeEach(() => {
        mockUseAuth.mockReturnValue({ login: mockLogin });
        mockUseRouter.mockReturnValue({ push: mockRouterPush });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should redirect to the path from the query parameter on successful login', async () => {
        mockUseSearchParams.mockReturnValue(new URLSearchParams('?redirect=/test-path'));
        mockLogin.mockResolvedValue({ success: true });

        render(<LoginPage />);

        fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'test@example.com' } });
        fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'password123' } });
        fireEvent.click(screen.getByRole('button', { name: /Sign In/i }));

        await waitFor(() => {
            expect(mockRouterPush).toHaveBeenCalledWith('/test-path');
        });
    });

    it('should redirect to the root path if no redirect query parameter is present', async () => {
        mockUseSearchParams.mockReturnValue(new URLSearchParams());
        mockLogin.mockResolvedValue({ success: true });

        render(<LoginPage />);

        fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'test@example.com' } });
        fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'password123' } });
        fireEvent.click(screen.getByRole('button', { name: /Sign In/i }));

        await waitFor(() => {
            expect(mockRouterPush).toHaveBeenCalledWith('/');
        });
    });

    it('should display an error message on failed login', async () => {
        mockUseSearchParams.mockReturnValue(new URLSearchParams());
        mockLogin.mockResolvedValue({ success: false, error: 'Invalid credentials' });

        render(<LoginPage />);

        fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'test@example.com' } });
        fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'password123' } });
        fireEvent.click(screen.getByRole('button', { name: /Sign In/i }));

        await waitFor(() => {
            expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
        });
    });
});