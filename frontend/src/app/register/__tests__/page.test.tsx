import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import RegisterPage from '../page';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

// Mocks
jest.mock('@/contexts/AuthContext');
jest.mock('next/navigation', () => ({
    useRouter: jest.fn(),
}));

describe('RegisterPage', () => {
    const mockRegister = jest.fn();
    const mockRouterPush = jest.fn();
    const mockUseRouter = useRouter as jest.Mock;
    const mockUseAuth = useAuth as jest.Mock;

    beforeEach(() => {
        mockUseAuth.mockReturnValue({ register: mockRegister });
        mockUseRouter.mockReturnValue({ push: mockRouterPush });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    const fillRequiredFields = () => {
        fireEvent.change(screen.getByLabelText(/^first name$/i), { target: { value: 'John' } });
        fireEvent.change(screen.getByLabelText(/^last name$/i), { target: { value: 'Doe' } });
        fireEvent.change(screen.getByLabelText(/^email$/i), { target: { value: 'john.doe@example.com' } });
    };

    it('should successfully register a user and redirect to the home page', async () => {
        mockRegister.mockResolvedValue({ success: true });

        render(<RegisterPage />);

        fillRequiredFields();
        fireEvent.change(screen.getByLabelText(/^password$/i), { target: { value: 'password123' } });
        fireEvent.change(screen.getByLabelText(/^confirm password$/i), { target: { value: 'password123' } });

        fireEvent.click(screen.getByRole('button', { name: /Create Account/i }));

        await waitFor(() => {
            expect(mockRegister).toHaveBeenCalledWith({
                first_name: 'John',
                last_name: 'Doe',
                email: 'john.doe@example.com',
                phone: '',
                password: 'password123',
                role: 'client',
            });
            expect(mockRouterPush).toHaveBeenCalledWith('/');
        });
    });

    it('should show an error if passwords do not match', async () => {
        render(<RegisterPage />);

        fillRequiredFields();
        fireEvent.change(screen.getByLabelText(/^password$/i), { target: { value: 'password123' } });
        fireEvent.change(screen.getByLabelText(/^confirm password$/i), { target: { value: 'password456' } });

        fireEvent.click(screen.getByRole('button', { name: /Create Account/i }));

        expect(await screen.findByText(/passwords do not match/i)).toBeInTheDocument();
    });

    it('should show an error for passwords less than 8 characters', async () => {
        render(<RegisterPage />);

        fillRequiredFields();
        fireEvent.change(screen.getByLabelText(/^password$/i), { target: { value: 'pass' } });
        fireEvent.change(screen.getByLabelText(/^confirm password$/i), { target: { value: 'pass' } });

        fireEvent.click(screen.getByRole('button', { name: /Create Account/i }));

        expect(await screen.findByText(/password must be at least 8 characters long/i)).toBeInTheDocument();
    });

    it('should show an error on registration failure', async () => {
        mockRegister.mockResolvedValue({ success: false, error: 'Email already in use' });

        render(<RegisterPage />);

        fillRequiredFields();
        fireEvent.change(screen.getByLabelText(/^password$/i), { target: { value: 'password123' } });
        fireEvent.change(screen.getByLabelText(/^confirm password$/i), { target: { value: 'password123' } });

        fireEvent.click(screen.getByRole('button', { name: /Create Account/i }));

        expect(await screen.findByText(/email already in use/i)).toBeInTheDocument();
    });
});
