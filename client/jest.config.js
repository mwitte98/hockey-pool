module.exports = {
  preset: 'jest-preset-angular',
  roots: [
    'src'
  ],
  setupFilesAfterEnv: [
    './src/setup-jest.ts'
  ]
}
