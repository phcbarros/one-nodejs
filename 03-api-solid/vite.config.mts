import {defineConfig} from 'vitest/config'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  // Plugin na raiz para afetar todos os projetos
  plugins: [tsconfigPaths()],
  test: {
    // Se você tiver apenas um grupo de testes,
    // talvez nem precise de 'projects'. Mas se precisar:
    projects: [
      {
        extends: true,
        test: {
          name: 'unit',
          include: ['src/use-cases/**/*.spec.ts'],
          environment: 'node',
          // Forçamos o Vitest a olhar para a raiz para resolver os módulos
          root: './',
        },
      },
      {
        extends: true,
        test: {
          name: 'e2e',
          include: ['src/http/controllers/**/*.spec.ts'],
          environment: './prisma/vitest-environment/prisma-test-environment.ts',
          // Forçamos o Vitest a olhar para a raiz para resolver os módulos
          root: './',
        },
      },
    ],
  },
})
