import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true, // permite usar describe/it/expect sem importar
    coverage: {
      provider: 'v8', // engine de coverage do Node
      reporter: ['text', 'html'], // mostra no terminal e gera HTML
      reportsDirectory: './coverage', // pasta do relatório
      all: true, // inclui arquivos não testados
      exclude: ['node_modules/', 'dist/', 'coverage/'], // exclui pastas
    },
  },
});
