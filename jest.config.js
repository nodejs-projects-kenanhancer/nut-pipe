module.exports = {
    testEnvironment: 'node',
    testMatch: ['<rootDir>/tests/**/*.test.js'],
    collectCoverageFrom: ['<rootDir>/src/index.js'],
    modulePaths: ['<rootDir>'],
    coverageDirectory: './coverage',
    testPathIgnorePatterns: ['/node_modules/', '/dist/']
};