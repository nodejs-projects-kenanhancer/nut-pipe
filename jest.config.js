module.exports = {
    testEnvironment: 'node',
    transform: { "^.+\\.(t|j)s$": "ts-jest" },
    testMatch: ['<rootDir>/tests/**/*.test.(t|j)s'],
    collectCoverageFrom: ['<rootDir>/src/index.js'],
    modulePaths: ['<rootDir>'],
    moduleFileExtensions: ["js", "json", "ts"],
    coverageDirectory: './coverage',
    testPathIgnorePatterns: ['/node_modules/', '/dist/']
};