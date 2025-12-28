// backend/jest.setup-db-tests.js
// This file allows skipping database-dependent tests if RUN_DB_TESTS is not set to 'true'.

if (process.env.RUN_DB_TESTS !== 'true') {
    console.warn('Skipping database-dependent tests. Set RUN_DB_TESTS=true to enable them.');
    // Global hook to skip tests. This should ideally be handled within the test files themselves
    // or by custom environments, but for a quick global skip, this can work.
    // However, Jest doesn't have a direct global "skip all tests" hook like this in setupFiles.
    // The most reliable way is to modify test files or use a custom test environment.

    // For now, we'll log a warning. Actual skipping logic needs to be in tests.
    // This setupFile is mainly for setting up global variables or mocks.
    // We will rely on test files to check process.env.RUN_DB_TESTS.
}