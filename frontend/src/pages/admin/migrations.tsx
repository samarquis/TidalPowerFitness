import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

interface MigrationResult {
    filename: string;
    success: boolean;
    error?: string;
    executedAt?: Date;
}

interface MigrationStatus {
    pending: string[];
    completed: MigrationResult[];
    failed: MigrationResult[];
}

export default function Migrations() {
    const router = useRouter();
    const [status, setStatus] = useState<MigrationStatus | null>(null);
    const [loading, setLoading] = useState(false);
    const [running, setRunning] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    useEffect(() => {
        checkMigrationStatus();
    }, []);

    const checkMigrationStatus = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/migrate/status`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch migration status');
            }

            const data = await response.json();
            setStatus(data.data);
        } catch (error: any) {
            setMessage({ type: 'error', text: error.message || 'Failed to load migration status' });
        } finally {
            setLoading(false);
        }
    };

    const runMigrations = async () => {
        if (!confirm('Are you sure you want to run database migrations? This will modify the production database.')) {
            return;
        }

        setRunning(true);
        setMessage(null);

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/migrate`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            const data = await response.json();

            if (data.success) {
                setMessage({ type: 'success', text: data.message });
                // Refresh status
                await checkMigrationStatus();
            } else {
                setMessage({ type: 'error', text: data.message || 'Migration failed' });
            }
        } catch (error: any) {
            setMessage({ type: 'error', text: error.message || 'Failed to run migrations' });
        } finally {
            setRunning(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-teal-900 to-gray-900 text-white p-8">
            <div className="max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-4xl font-bold text-gradient">Database Migrations</h1>
                    <button
                        onClick={() => router.push('/admin')}
                        className="btn-secondary"
                    >
                        ← Back to Admin
                    </button>
                </div>

                {message && (
                    <div className={`p-4 rounded-lg mb-6 ${message.type === 'success'
                            ? 'bg-green-500/20 border border-green-500/50 text-green-100'
                            : 'bg-red-500/20 border border-red-500/50 text-red-100'
                        }`}>
                        {message.text}
                    </div>
                )}

                <div className="glass rounded-xl p-6 mb-6">
                    <h2 className="text-2xl font-semibold mb-6">Migration Status</h2>

                    {loading ? (
                        <p className="text-gray-300">Loading migration status...</p>
                    ) : status ? (
                        <>
                            <div className="mb-6">
                                <h3 className="text-xl font-medium mb-3 text-teal-300">
                                    ✅ Completed Migrations ({status.completed.length})
                                </h3>
                                {status.completed.length > 0 ? (
                                    <ul className="space-y-2">
                                        {status.completed.map((migration, index) => (
                                            <li key={index} className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                                                <span className="font-mono text-sm">{migration.filename}</span>
                                                <span className="text-green-400 font-semibold">✓ Applied</span>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="text-gray-400 italic">No migrations have been applied yet.</p>
                                )}
                            </div>

                            <div className="mb-6">
                                <h3 className="text-xl font-medium mb-3 text-yellow-300">
                                    ⏳ Pending Migrations ({status.pending.length})
                                </h3>
                                {status.pending.length > 0 ? (
                                    <ul className="space-y-2">
                                        {status.pending.map((migration, index) => (
                                            <li key={index} className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                                                <span className="font-mono text-sm">{migration}</span>
                                                <span className="text-yellow-400 font-semibold">Pending</span>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="text-gray-400 italic">All migrations are up to date! 🎉</p>
                                )}
                            </div>

                            {status.failed.length > 0 && (
                                <div className="mb-6">
                                    <h3 className="text-xl font-medium mb-3 text-red-300">
                                        ❌ Failed Migrations ({status.failed.length})
                                    </h3>
                                    <ul className="space-y-2">
                                        {status.failed.map((migration, index) => (
                                            <li key={index} className="p-3 bg-red-500/10 rounded-lg border border-red-500/30">
                                                <div className="flex justify-between items-center mb-2">
                                                    <span className="font-mono text-sm">{migration.filename}</span>
                                                    <span className="text-red-400 font-semibold">Failed</span>
                                                </div>
                                                {migration.error && (
                                                    <p className="text-sm text-red-300 mt-2">{migration.error}</p>
                                                )}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            <div className="flex gap-4 mt-6">
                                <button
                                    onClick={runMigrations}
                                    disabled={running || status.pending.length === 0}
                                    className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {running ? 'Running Migrations...' : 'Run Pending Migrations'}
                                </button>
                                <button
                                    onClick={checkMigrationStatus}
                                    disabled={loading || running}
                                    className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Refresh Status
                                </button>
                            </div>
                        </>
                    ) : (
                        <p className="text-red-300">Failed to load migration status.</p>
                    )}
                </div>

                <div className="glass rounded-xl p-6">
                    <h3 className="text-xl font-semibold mb-4 text-teal-300">ℹ️ About Database Migrations</h3>
                    <p className="mb-4 text-gray-300">
                        Database migrations update your database schema to support new features.
                        The pending migrations will add:
                    </p>
                    <ul className="space-y-2 mb-4 text-gray-300">
                        <li className="flex items-start">
                            <span className="mr-2">•</span>
                            <div>
                                <strong className="text-white">003_add_body_parts.sql</strong> - Body parts hierarchy for exercises
                            </div>
                        </li>
                        <li className="flex items-start">
                            <span className="mr-2">•</span>
                            <div>
                                <strong className="text-white">004_add_packages_and_credits.sql</strong> - Membership packages and credit system
                            </div>
                        </li>
                        <li className="flex items-start">
                            <span className="mr-2">•</span>
                            <div>
                                <strong className="text-white">005_create_class_participants.sql</strong> - Class booking and participant tracking
                            </div>
                        </li>
                    </ul>
                    <p className="text-sm text-gray-400">
                        <strong>Note:</strong> All migrations are designed to be safe and idempotent (can be run multiple times).
                    </p>
                </div>
            </div>
        </div>
    );
}
