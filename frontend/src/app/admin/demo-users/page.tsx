'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

interface DemoUser {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
  roles: string[];
  phone: string;
  created_at: string;
}

export default function DemoUsersPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [demoUsers, setDemoUsers] = useState<DemoUser[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [count, setCount] = useState(10);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    if (!loading && (!user || !user.roles?.includes('admin'))) {
      router.push('/');
    }
  }, [user, loading, router]);

  useEffect(() => {
    fetchDemoUsers();
  }, []);

  const fetchDemoUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/demo-users`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setDemoUsers(data.users || []);
      }
    } catch (error) {
      console.error('Error fetching demo users:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateDemoUsers = async () => {
    setIsCreating(true);
    setMessage(null);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/demo-users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ count })
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({
          type: 'success',
          text: `Successfully created ${data.users.length} demo users! Password: demo123`
        });
        await fetchDemoUsers();
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to create demo users' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Network error creating demo users' });
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeleteAllDemoUsers = async () => {
    if (!confirm('Are you sure you want to delete ALL demo users? This cannot be undone.')) {
      return;
    }

    setIsDeleting(true);
    setMessage(null);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/demo-users`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({
          type: 'success',
          text: `Successfully deleted ${data.deletedUsers.length} demo users`
        });
        await fetchDemoUsers();
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to delete demo users' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Network error deleting demo users' });
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading || isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-8">
        <div className="max-w-6xl mx-auto">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (!user || !user.roles?.includes('admin')) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Demo User Management</h1>

        <div className="bg-gray-800 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Create Demo Users</h2>
          <p className="text-gray-400 mb-4">
            Generate test users with realistic data. All demo users will use password: <code className="bg-gray-700 px-2 py-1 rounded">demo123</code>
          </p>

          <div className="flex items-center gap-4 mb-4">
            <label htmlFor="count" className="text-sm">
              Number of users to create:
            </label>
            <input
              id="count"
              type="number"
              min="1"
              max="26"
              value={count}
              onChange={(e) => setCount(parseInt(e.target.value) || 1)}
              className="bg-gray-700 border border-gray-600 rounded px-3 py-2 w-24"
            />
          </div>

          <div className="flex gap-4">
            <button
              onClick={handleCreateDemoUsers}
              disabled={isCreating}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 px-6 py-2 rounded font-medium"
            >
              {isCreating ? 'Creating...' : `Create ${count} Demo Users`}
            </button>

            {demoUsers.length > 0 && (
              <button
                onClick={handleDeleteAllDemoUsers}
                disabled={isDeleting}
                className="bg-red-600 hover:bg-red-700 disabled:bg-gray-600 px-6 py-2 rounded font-medium"
              >
                {isDeleting ? 'Deleting...' : 'Delete All Demo Users'}
              </button>
            )}
          </div>

          {message && (
            <div
              className={`mt-4 p-4 rounded ${
                message.type === 'success' ? 'bg-green-900/50 border border-green-700' : 'bg-red-900/50 border border-red-700'
              }`}
            >
              {message.text}
            </div>
          )}
        </div>

        <div className="bg-gray-800 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">
            Current Demo Users ({demoUsers.length})
          </h2>

          {demoUsers.length === 0 ? (
            <p className="text-gray-400">No demo users found. Create some to get started!</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="text-left py-3 px-4">Name</th>
                    <th className="text-left py-3 px-4">Email</th>
                    <th className="text-left py-3 px-4">Role</th>
                    <th className="text-left py-3 px-4">Phone</th>
                    <th className="text-left py-3 px-4">Created</th>
                  </tr>
                </thead>
                <tbody>
                  {demoUsers.map((user) => (
                    <tr key={user.id} className="border-b border-gray-700/50 hover:bg-gray-700/30">
                      <td className="py-3 px-4">
                        {user.first_name} {user.last_name}
                      </td>
                      <td className="py-3 px-4 font-mono text-sm">{user.email}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded text-xs ${
                          user.role === 'trainer' ? 'bg-purple-900/50 text-purple-200' : 'bg-blue-900/50 text-blue-200'
                        }`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="py-3 px-4">{user.phone}</td>
                      <td className="py-3 px-4 text-sm text-gray-400">
                        {new Date(user.created_at).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="mt-6 bg-yellow-900/30 border border-yellow-700/50 rounded-lg p-4">
          <h3 className="font-semibold text-yellow-200 mb-2">Note:</h3>
          <ul className="text-sm text-yellow-100 space-y-1">
            <li>• Demo users are marked with <code className="bg-gray-700 px-1">is_demo_mode_enabled = true</code></li>
            <li>• All demo users can log in with password: <code className="bg-gray-700 px-1">demo123</code></li>
            <li>• Trainers automatically get profiles with random specialties and certifications</li>
            <li>• Deleting demo users will remove them and all their associated data</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
