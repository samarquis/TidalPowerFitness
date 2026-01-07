'use client';

import { useAuth } from '@/contexts/AuthContext';
import LandingPage from '@/components/LandingPage';
import UserDashboard from '@/components/dashboard/UserDashboard';
import ErrorBoundary from '@/components/ErrorBoundary';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function HomePage() {
  const { isAuthenticated, loading, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Intelligent Redirect: Send Admins and Trainers to their control centers automatically
    if (isAuthenticated && !loading && user) {
      if (user.roles?.includes('admin')) {
        router.push('/admin');
      } else if (user.roles?.includes('trainer')) {
        router.push('/trainer');
      }
    }
  }, [isAuthenticated, loading, user, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-400"></div>
      </div>
    );
  }

  // If authenticated but not admin/trainer, show the client UserDashboard
  // If not authenticated, show the landing page
  return isAuthenticated ? (
    <ErrorBoundary>
      <UserDashboard />
    </ErrorBoundary>
  ) : (
    <LandingPage />
  );
}
