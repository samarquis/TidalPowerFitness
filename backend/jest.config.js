/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  setupFiles: ['<rootDir>/jest.setup-env.js', '<rootDir>/jest.setup-db-tests.js'],
  transform: {
    '^.+\\.ts$': 'ts-jest',
    '^.+\\.js$': 'ts-jest', 
  },
  transformIgnorePatterns: [
    'node_modules/(?!uuid)', 
  ],
};
