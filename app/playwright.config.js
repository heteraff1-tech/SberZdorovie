import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: true,
  timeout: 30_000,
  use: {
    baseURL: 'http://localhost:4173',
    viewport: { width: 1000, height: 1000 },
    trace: 'retain-on-failure',
    launchOptions: {
      executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH || undefined,
    },
  },
  webServer: {
    command: 'npm run preview -- --host 0.0.0.0 --port 4173 --strictPort',
    url: 'http://localhost:4173',
    reuseExistingServer: false,
  },
});
