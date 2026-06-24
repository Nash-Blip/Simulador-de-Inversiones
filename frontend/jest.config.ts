import nextJest from 'next/jest.js'

// Proporciona la ruta a tu aplicación Next.js para cargar las variables de entorno y next.config.js
const createJestConfig = nextJest({
  dir: './',
})

// Configuraciones personalizadas de Jest
const customJestConfig = {
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1', 
  },
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'], // o .ts si lo creaste en TypeScript
}

export default createJestConfig(customJestConfig)