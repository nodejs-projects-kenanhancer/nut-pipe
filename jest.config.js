module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    rootDir: ".",
    modulePaths: ['<rootDir>'],
    transform: { "^.+\\.(t|j)s$": "ts-jest" },
    testMatch: ['<rootDir>/tests/**/*.test.(t|j)s'],
    collectCoverageFrom: ['<rootDir>/src/index.js'],
    moduleFileExtensions: ["js", "json", "ts"],
    coverageDirectory: './coverage',
    coverageReporters: ["json", "lcov", "text", "cobertura"],
    testPathIgnorePatterns: ['/node_modules/', '/dist/', '/coverage/', '/.github/'],
    verbose: true,
    globals: {
        'ts-jest': {
            diagnostics: true
        }
    },
    transformIgnorePatterns: [
        "<rootDir>/node_modules/",
        "<rootDir>/tests/nut-pipe-azure.test.ts"
      ]
};