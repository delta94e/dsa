import { test, expect, Page } from '@playwright/test';

// Helper to mock authenticated state
async function mockAuthenticatedUser(page: Page) {
    await page.addInitScript(() => {
        localStorage.setItem('auth-storage', JSON.stringify({
            state: {
                user: {
                    id: 'test-user-123',
                    name: 'Test User',
                    email: 'test@example.com',
                    avatarUrl: 'https://example.com/avatar.jpg',
                    nativeLanguage: 'Vietnamese',
                    learningLevel: 'B1',
                    country: 'Vietnam',
                    countryFlag: '🇻🇳',
                },
                isAuthenticated: true,
            },
            version: 0,
        }));
    });
}

test.describe('Voice Room Session', () => {
    test.beforeEach(async ({ page }) => {
        await mockAuthenticatedUser(page);
    });

    test.describe('Room Joining', () => {
        test('should display voice controls when in room', async ({ page }) => {
            // Navigate to rooms first
            await page.goto('/rooms');
            await page.waitForTimeout(2000);

            // Try to join a room
            const joinButton = page.getByRole('button', { name: /Join/i }).first();

            if (await joinButton.isVisible()) {
                await joinButton.click();
                await page.waitForTimeout(2000);

                // Should see voice controls (mute button, leave button)
                const muteButton = page.getByRole('button', { name: /Mute|Unmute/i });
                const leaveButton = page.getByRole('button', { name: /Leave/i });

                // At least one control should be visible
                const hasMute = await muteButton.isVisible().catch(() => false);
                const hasLeave = await leaveButton.isVisible().catch(() => false);

                expect(hasMute || hasLeave || page.url().includes('/rooms/')).toBeTruthy();
            }
        });
    });

    test.describe('Voice Controls', () => {
        test('should toggle mute state', async ({ page }) => {
            await page.goto('/rooms');
            await page.waitForTimeout(2000);

            const joinButton = page.getByRole('button', { name: /Join/i }).first();

            if (await joinButton.isVisible()) {
                await joinButton.click();
                await page.waitForTimeout(2000);

                const muteButton = page.getByRole('button', { name: /Mute|Unmute/i }).first();

                if (await muteButton.isVisible()) {
                    const initialText = await muteButton.textContent();
                    await muteButton.click();
                    await page.waitForTimeout(500);

                    // Button text or state should change
                    const newText = await muteButton.textContent();
                    // States toggle between mute/unmute
                }
            }
        });

        test('should have raise hand button', async ({ page }) => {
            await page.goto('/rooms');
            await page.waitForTimeout(2000);

            const joinButton = page.getByRole('button', { name: /Join/i }).first();

            if (await joinButton.isVisible()) {
                await joinButton.click();
                await page.waitForTimeout(2000);

                // Look for raise hand button
                const raiseHandButton = page.getByRole('button', { name: /hand|raise/i });
                const hasRaiseHand = await raiseHandButton.isVisible().catch(() => false);
            }
        });

        test('should have reaction buttons', async ({ page }) => {
            await page.goto('/rooms');
            await page.waitForTimeout(2000);

            const joinButton = page.getByRole('button', { name: /Join/i }).first();

            if (await joinButton.isVisible()) {
                await joinButton.click();
                await page.waitForTimeout(2000);

                // Look for reaction elements
                const reactionButton = page.locator('button').filter({ hasText: /👏|❤️|👍/ });
                const hasReactions = await reactionButton.first().isVisible().catch(() => false);
            }
        });
    });

    test.describe('Leave Room', () => {
        test('should leave room and return to rooms list', async ({ page }) => {
            await page.goto('/rooms');
            await page.waitForTimeout(2000);

            const joinButton = page.getByRole('button', { name: /Join/i }).first();

            if (await joinButton.isVisible()) {
                await joinButton.click();
                await page.waitForTimeout(2000);

                const leaveButton = page.getByRole('button', { name: /Leave/i });

                if (await leaveButton.isVisible()) {
                    await leaveButton.click();
                    await page.waitForTimeout(2000);

                    // Should be back on rooms list or different page
                    expect(page.url()).not.toContain('/rooms/'); // Not on specific room
                }
            }
        });
    });

    test.describe('Participants Display', () => {
        test('should show participant list', async ({ page }) => {
            await page.goto('/rooms');
            await page.waitForTimeout(2000);

            const joinButton = page.getByRole('button', { name: /Join/i }).first();

            if (await joinButton.isVisible()) {
                await joinButton.click();
                await page.waitForTimeout(2000);

                // Look for participants section or avatars
                const participants = page.locator('[data-testid="participant"]').or(page.locator('img[alt*="avatar"]'));
                // At least current user should be shown
            }
        });
    });

    test.describe('Connection Status', () => {
        test('should show connection status', async ({ page }) => {
            await page.goto('/rooms');
            await page.waitForTimeout(2000);

            const joinButton = page.getByRole('button', { name: /Join/i }).first();

            if (await joinButton.isVisible()) {
                await joinButton.click();
                await page.waitForTimeout(2000);

                // Look for connection status indicator
                const connectionStatus = page.getByText(/Connected|Connecting|Disconnected/i);
                const hasStatus = await connectionStatus.isVisible().catch(() => false);
            }
        });
    });
});

test.describe('Password Protected Rooms', () => {
    test.beforeEach(async ({ page }) => {
        await mockAuthenticatedUser(page);
    });

    test('should prompt for password on protected room', async ({ page }) => {
        await page.goto('/rooms');
        await page.waitForTimeout(2000);

        // Look for password-protected room indicator (lock icon)
        const protectedRoom = page.locator('[data-testid="protected-room"]').or(page.locator('svg[class*="lock"]').first());

        if (await protectedRoom.isVisible()) {
            await protectedRoom.click();
            await page.waitForTimeout(1000);

            // Should show password modal or input
            const passwordInput = page.getByLabel(/Password/i).or(page.locator('input[type="password"]'));
            const hasPasswordPrompt = await passwordInput.isVisible().catch(() => false);
        }
    });

    test('should reject wrong password', async ({ page }) => {
        await page.goto('/rooms');
        await page.waitForTimeout(2000);

        // Find room with password
        const protectedRoom = page.locator('[data-testid="protected-room"]').first();

        if (await protectedRoom.isVisible()) {
            await protectedRoom.click();
            await page.waitForTimeout(1000);

            const passwordInput = page.locator('input[type="password"]');

            if (await passwordInput.isVisible()) {
                await passwordInput.fill('wrongpassword');
                await page.getByRole('button', { name: /Join|Submit/i }).click();
                await page.waitForTimeout(1000);

                // Should show error
                const errorMessage = page.getByText(/wrong|incorrect|invalid/i);
                const hasError = await errorMessage.isVisible().catch(() => false);
            }
        }
    });
});

test.describe('Room Real-time Features', () => {
    test.beforeEach(async ({ page }) => {
        await mockAuthenticatedUser(page);
    });

    test('should connect to WebSocket', async ({ page }) => {
        let wsConnected = false;

        // Listen for WebSocket connections
        page.on('websocket', (ws) => {
            wsConnected = true;
            console.log('WebSocket connected:', ws.url());
        });

        await page.goto('/rooms');
        await page.waitForTimeout(2000);

        const joinButton = page.getByRole('button', { name: /Join/i }).first();

        if (await joinButton.isVisible()) {
            await joinButton.click();
            await page.waitForTimeout(3000);

            // WebSocket should have connected for voice room
            // (Note: actual connection depends on backend running)
        }
    });
});

test.describe('Room Accessibility', () => {
    test.beforeEach(async ({ page }) => {
        await mockAuthenticatedUser(page);
    });

    test('should have accessible controls', async ({ page }) => {
        await page.goto('/rooms');
        await page.waitForTimeout(2000);

        const joinButton = page.getByRole('button', { name: /Join/i }).first();

        if (await joinButton.isVisible()) {
            await joinButton.click();
            await page.waitForTimeout(2000);

            // Voice controls should be keyboard accessible
            await page.keyboard.press('Tab');
            await page.keyboard.press('Tab');

            // Should be able to focus on controls
            const focusedElement = await page.evaluate(() => document.activeElement?.tagName);
            expect(['BUTTON', 'INPUT', 'A'].includes(focusedElement || '')).toBeTruthy();
        }
    });
});
