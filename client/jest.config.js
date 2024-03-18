module.exports = {
  preset: 'jest-preset-angular',
  roots: ['src'],
  setupFilesAfterEnv: ['./src/setup-jest.ts'],
  moduleNameMapper: {
    '^d3-(.*)$': '<rootDir>/node_modules/d3-$1/dist/d3-$1.min.js',
  },
  coveragePathIgnorePatterns: ['/node_modules/', 'html$'],
};
