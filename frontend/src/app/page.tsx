'use client';

import { useAuth } from '@/contexts/AuthContext';
import LandingPage from '@/components/LandingPage';
import UserDashboard from '@/components/dashboard/UserDashboard';
import ErrorBoundary from '@/components/ErrorBoundary';

export default function HomePage() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-4"></div>
      </div>
    );
  }

  return isAuthenticated ? (
    <ErrorBoundary>
      <UserDashboard />
    </ErrorBoundary>
  ) : (
    <LandingPage />
  );
}
