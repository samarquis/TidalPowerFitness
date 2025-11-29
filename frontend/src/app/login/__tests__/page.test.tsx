import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import LoginPage from '../page';
import { AuthProvider } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api';

// Mock next/navigation
jest.mock('next/navigation', () => ({
    useRouter: jest.fn(),
}));

// Mock the apiClient to include getProfile
jest.mock('@/lib/api', () => ({
    apiClient: {
        login: jest.fn(),
        getProfile: jest.fn(),
        setToken: jest.fn(), // Also mock setToken as it's used in AuthContext
    }
}));

const mockedUseRouter = useRouter as jest.Mock;
const mockedApiClient = apiClient as jest.Mocked<typeof apiClient>;

describe('LoginPage Integration', () => {
    let push: jest.Mock;

    beforeEach(() => {
        push = jest.fn();
        mockedUseRouter.mockReturnValue({ push });
        mockedApiClient.login.mockClear();
        mockedApiClient.getProfile.mockClear();
        // Provide a default mock for getProfile to avoid console errors
        mockedApiClient.getProfile.mockResolvedValue({ error: 'Not authenticated' });
    });

    it('should call the login function and redirect on successful login', async () => {
        mockedApiClient.login.mockResolvedValue({
            data: {
                token: 'fake-token',
                user: { id: '1', email: 'test@example.com', roles: ['client'] },
            },
        });

        render(
            <AuthProvider>
                <LoginPage />
            </AuthProvider>
        );

        // Fill out the form
        fireEvent.change(screen.getByLabelText(/email/i), {
            target: { value: 'test@example.com' },
        });
        fireEvent.change(screen.getByLabelText(/password/i), {
            target: { value: 'password123' },
        });

        // Submit the form
        fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

        // Wait for promises to resolve
        await waitFor(() => {
            expect(mockedApiClient.login).toHaveBeenCalledWith('test@example.com', 'password123');
        });

        await waitFor(() => {
            // Check for redirect
            expect(push).toHaveBeenCalledWith('/trainers');
        });
    });

    it('should display an error message on failed login', async () => {
        mockedApiClient.login.mockResolvedValue({
            error: 'Invalid credentials',
        });

        render(
            <AuthProvider>
                <LoginPage />
            </AuthProvider>
        );

        // Fill out the form and submit
        fireEvent.change(screen.getByLabelText(/email/i), {
            target: { value: 'wrong@example.com' },
        });
        fireEvent.change(screen.getByLabelText(/password/i), {
            target: { value: 'wrongpassword' },
        });
        fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

        // Wait for the error message to appear
        await waitFor(() => {
            expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
        });

        // Ensure redirect was not called
        expect(push).not.toHaveBeenCalled();
    });
});
