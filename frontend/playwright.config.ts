import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './test-results',
  webServer: {
    command: 'npm run dev',
    port: 3000,
  },
});
