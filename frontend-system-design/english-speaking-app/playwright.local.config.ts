import { defineConfig, devices } from '@playwright/test';

// Local config - assumes dev server is already running
export default defineConfig({
    testDir: './e2e',
    fullyParallel: true,
    forbidOnly: false,
    retries: 0,
    workers: undefined,
    reporter: 'html',
    use: {
        baseURL: 'http://localhost:3001',
        trace: 'on-first-retry',
        screenshot: 'only-on-failure',
    },
    projects: [
        {
            name: 'chromium',
            use: { ...devices['Desktop Chrome'] },
        },
    ],
    // No webServer - expects dev server to be running
});
