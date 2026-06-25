import nextJest from 'next/jest.js'

// Proporciona la ruta a tu aplicación Next.js para cargar las variables de entorno y next.config.js
const createJestConfig = nextJest({
  dir: './',
})

// Configuraciones personalizadas de Jest
const customJestConfig = {
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  collectCoverageFrom: [
    'app/**/*.{ts,tsx}',
    'components/**/*.{ts,tsx}',
    'service/**/*.{ts,tsx}',
    '!**/*.d.ts',
    '!**/*.test.{ts,tsx}',
    '!**/layout.tsx',
  ],
}

export default createJestConfig(customJestConfig)