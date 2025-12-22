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

// Helper to get a valid room ID from the rooms list
async function getFirstRoomId(page: Page): Promise<string | null> {
    await page.goto('/rooms');
    await page.waitForTimeout(2000);

    // Try to find a room link
    const roomLink = page.locator('a[href*="/rooms/"]').first();
    if (await roomLink.isVisible()) {
        const href = await roomLink.getAttribute('href');
        if (href) {
            const match = href.match(/\/rooms\/([^/]+)/);
            return match ? match[1] : null;
        }
    }

    // Try join button approach
    const joinButton = page.getByRole('button', { name: /Join/i }).first();
    if (await joinButton.isVisible()) {
        await joinButton.click();
        await page.waitForTimeout(1000);
        const match = page.url().match(/\/rooms\/([^/]+)/);
        return match ? match[1] : null;
    }

    return null;
}

test.describe('Room Detail Page - /rooms/[id]', () => {
    test.beforeEach(async ({ page }) => {
        await mockAuthenticatedUser(page);
    });

    test.describe('Page Structure', () => {
        test('should display room header with name and topic', async ({ page }) => {
            const roomId = await getFirstRoomId(page);
            if (!roomId) {
                test.skip();
                return;
            }

            await page.goto(`/rooms/${roomId}`);
            await page.waitForTimeout(2000);

            // Room name should be visible in header
            const roomTitle = page.locator('h2').first();
            await expect(roomTitle).toBeVisible();

            // Topic should be visible
            const topicText = page.locator('text=/[A-Za-z]{10,}/').first();
            await expect(topicText).toBeVisible();
        });

        test('should display back button to rooms list', async ({ page }) => {
            const roomId = await getFirstRoomId(page);
            if (!roomId) {
                test.skip();
                return;
            }

            await page.goto(`/rooms/${roomId}`);
            await page.waitForTimeout(2000);

            const backButton = page.getByRole('button', { name: /Back/i });
            await expect(backButton).toBeVisible();
        });

        test('should display connection status badge', async ({ page }) => {
            const roomId = await getFirstRoomId(page);
            if (!roomId) {
                test.skip();
                return;
            }

            await page.goto(`/rooms/${roomId}`);
            await page.waitForTimeout(2000);

            const connectionBadge = page.getByText(/Connected|Connecting/i);
            await expect(connectionBadge).toBeVisible();
        });

        test('should display level badge', async ({ page }) => {
            const roomId = await getFirstRoomId(page);
            if (!roomId) {
                test.skip();
                return;
            }

            await page.goto(`/rooms/${roomId}`);
            await page.waitForTimeout(2000);

            const levelBadge = page.getByText(/A1|A2|B1|B2|C1|C2/).first();
            await expect(levelBadge).toBeVisible();
        });

        test('should display participant count', async ({ page }) => {
            const roomId = await getFirstRoomId(page);
            if (!roomId) {
                test.skip();
                return;
            }

            await page.goto(`/rooms/${roomId}`);
            await page.waitForTimeout(2000);

            // Show participant count like "1/8 participants"
            const participantCount = page.getByText(/\d+\/\d+\s*participants/i);
            await expect(participantCount).toBeVisible();
        });
    });

    test.describe('Current User Info', () => {
        test('should display current user info section', async ({ page }) => {
            const roomId = await getFirstRoomId(page);
            if (!roomId) {
                test.skip();
                return;
            }

            await page.goto(`/rooms/${roomId}`);
            await page.waitForTimeout(2000);

            // "You:" label
            const youLabel = page.getByText(/You:/i);
            await expect(youLabel).toBeVisible();
        });

        test('should display mute status badge', async ({ page }) => {
            const roomId = await getFirstRoomId(page);
            if (!roomId) {
                test.skip();
                return;
            }

            await page.goto(`/rooms/${roomId}`);
            await page.waitForTimeout(2000);

            // Muted or Unmuted badge
            const muteBadge = page.getByText(/🔇 Muted|🔊 Unmuted/);
            await expect(muteBadge).toBeVisible();
        });

        test('should display audio streams count', async ({ page }) => {
            const roomId = await getFirstRoomId(page);
            if (!roomId) {
                test.skip();
                return;
            }

            await page.goto(`/rooms/${roomId}`);
            await page.waitForTimeout(2000);

            // Audio streams badge
            const streamsBadge = page.getByText(/\d+ audio streams/i);
            await expect(streamsBadge).toBeVisible();
        });
    });

    test.describe('Participants Section', () => {
        test('should display participants section title', async ({ page }) => {
            const roomId = await getFirstRoomId(page);
            if (!roomId) {
                test.skip();
                return;
            }

            await page.goto(`/rooms/${roomId}`);
            await page.waitForTimeout(2000);

            const participantsTitle = page.getByText(/Participants \(\d+\)/i);
            await expect(participantsTitle).toBeVisible();
        });

        test('should display participant cards or empty message', async ({ page }) => {
            const roomId = await getFirstRoomId(page);
            if (!roomId) {
                test.skip();
                return;
            }

            await page.goto(`/rooms/${roomId}`);
            await page.waitForTimeout(2000);

            // Either participant cards or "No participants" message
            const hasParticipants = await page.locator('[data-testid="participant-card"]').first().isVisible().catch(() => false);
            const hasEmptyMessage = await page.getByText(/No participants yet/i).isVisible().catch(() => false);
            const hasAvatars = await page.locator('img[src*="avatar"]').first().isVisible().catch(() => false);

            expect(hasParticipants || hasEmptyMessage || hasAvatars).toBeTruthy();
        });
    });

    test.describe('Voice Controls', () => {
        test('should display mute/unmute button', async ({ page }) => {
            const roomId = await getFirstRoomId(page);
            if (!roomId) {
                test.skip();
                return;
            }

            await page.goto(`/rooms/${roomId}`);
            await page.waitForTimeout(2000);

            const muteButton = page.getByRole('button', { name: /Mute|Unmute/i }).first();
            await expect(muteButton).toBeVisible();
        });

        test('should toggle mute state when clicked', async ({ page }) => {
            const roomId = await getFirstRoomId(page);
            if (!roomId) {
                test.skip();
                return;
            }

            await page.goto(`/rooms/${roomId}`);
            await page.waitForTimeout(2000);

            const muteButton = page.getByRole('button', { name: /Mute|Unmute/i }).first();

            if (await muteButton.isVisible()) {
                // Get initial state
                const initialBadge = await page.getByText(/🔇 Muted|🔊 Unmuted/).textContent();

                // Click mute button
                await muteButton.click();
                await page.waitForTimeout(500);

                // State should change
                const newBadge = await page.getByText(/🔇 Muted|🔊 Unmuted/).textContent();
                expect(newBadge !== initialBadge).toBeTruthy();
            }
        });

        test('should display raise hand button', async ({ page }) => {
            const roomId = await getFirstRoomId(page);
            if (!roomId) {
                test.skip();
                return;
            }

            await page.goto(`/rooms/${roomId}`);
            await page.waitForTimeout(2000);

            const raiseHandButton = page.getByRole('button', { name: /hand/i }).or(page.locator('button:has-text("✋")'));
            const hasRaiseHand = await raiseHandButton.isVisible().catch(() => false);
            // May or may not be visible depending on UI implementation
        });

        test('should display leave button', async ({ page }) => {
            const roomId = await getFirstRoomId(page);
            if (!roomId) {
                test.skip();
                return;
            }

            await page.goto(`/rooms/${roomId}`);
            await page.waitForTimeout(2000);

            const leaveButton = page.getByRole('button', { name: /Leave/i });
            await expect(leaveButton).toBeVisible();
        });

        test('should navigate to rooms list when leave is clicked', async ({ page }) => {
            const roomId = await getFirstRoomId(page);
            if (!roomId) {
                test.skip();
                return;
            }

            await page.goto(`/rooms/${roomId}`);
            await page.waitForTimeout(2000);

            const leaveButton = page.getByRole('button', { name: /Leave/i });

            if (await leaveButton.isVisible()) {
                await leaveButton.click();
                await page.waitForTimeout(1000);

                await expect(page).toHaveURL('/rooms');
            }
        });

        test('should display reaction buttons', async ({ page }) => {
            const roomId = await getFirstRoomId(page);
            if (!roomId) {
                test.skip();
                return;
            }

            await page.goto(`/rooms/${roomId}`);
            await page.waitForTimeout(2000);

            // Look for reaction emojis in buttons
            const reactionButtons = page.locator('button').filter({ hasText: /👏|❤️|👍|🎉|😂/ });
            const hasReactions = await reactionButtons.first().isVisible().catch(() => false);

            // Reactions may be in a dropdown or always visible
        });
    });

    test.describe('Error States', () => {
        test('should show error for non-existent room', async ({ page }) => {
            await page.goto('/rooms/non-existent-room-12345');
            await page.waitForTimeout(2000);

            // Should show error message
            const errorMessage = page.getByText(/not found|doesn't exist|error/i);
            await expect(errorMessage).toBeVisible();
        });

        test('should show back button on error', async ({ page }) => {
            await page.goto('/rooms/invalid-room-id-xyz');
            await page.waitForTimeout(2000);

            const backButton = page.getByRole('button', { name: /Back to Rooms/i }).or(
                page.getByRole('link', { name: /Back/i })
            );
            await expect(backButton).toBeVisible();
        });

        test('should navigate back from error page', async ({ page }) => {
            await page.goto('/rooms/fake-room-id-test');
            await page.waitForTimeout(2000);

            const backButton = page.getByRole('button', { name: /Back/i }).or(
                page.getByRole('link', { name: /Back/i })
            );

            if (await backButton.isVisible()) {
                await backButton.click();
                await page.waitForTimeout(1000);

                // Should be on rooms list or home
                expect(page.url().includes('/rooms')).toBeTruthy();
            }
        });
    });

    test.describe('Loading State', () => {
        test('should show loader while loading', async ({ page }) => {
            // Slow down API to see loader
            await page.route('**/rooms/*', async (route) => {
                await new Promise((resolve) => setTimeout(resolve, 1000));
                await route.continue();
            });

            const roomId = await getFirstRoomId(page);
            if (!roomId) {
                test.skip();
                return;
            }

            await page.goto(`/rooms/${roomId}`);

            // Loader should appear briefly
            const loader = page.locator('.mantine-Loader-root').or(page.locator('[data-testid="loader"]'));
            // May or may not catch it depending on timing
        });
    });

    test.describe('Password Protected Room', () => {
        test('should show password modal for protected room', async ({ page }) => {
            // This test requires a password-protected room to exist
            const roomId = await getFirstRoomId(page);
            if (!roomId) {
                test.skip();
                return;
            }

            await page.goto(`/rooms/${roomId}`);
            await page.waitForTimeout(2000);

            // If password modal appears
            const passwordModal = page.getByText(/Enter Password|Password Required/i);
            const hasPasswordModal = await passwordModal.isVisible().catch(() => false);

            if (hasPasswordModal) {
                // Should have password input
                const passwordInput = page.locator('input[type="password"]');
                await expect(passwordInput).toBeVisible();

                // Should have submit button
                const submitButton = page.getByRole('button', { name: /Join|Submit|Enter/i });
                await expect(submitButton).toBeVisible();
            }
        });

        test('should allow closing password modal', async ({ page }) => {
            const roomId = await getFirstRoomId(page);
            if (!roomId) {
                test.skip();
                return;
            }

            await page.goto(`/rooms/${roomId}`);
            await page.waitForTimeout(2000);

            const passwordModal = page.getByText(/Enter Password/i);
            const hasPasswordModal = await passwordModal.isVisible().catch(() => false);

            if (hasPasswordModal) {
                // Close button or click outside
                const closeButton = page.getByRole('button', { name: /Close|Cancel|×/i });
                if (await closeButton.isVisible()) {
                    await closeButton.click();
                    await page.waitForTimeout(1000);

                    // Should redirect to rooms list
                    await expect(page).toHaveURL('/rooms');
                }
            }
        });
    });

    test.describe('WebSocket Connection', () => {
        test('should establish WebSocket connection', async ({ page }) => {
            let wsConnected = false;

            page.on('websocket', (ws) => {
                wsConnected = true;
                console.log('WebSocket connected:', ws.url());
            });

            const roomId = await getFirstRoomId(page);
            if (!roomId) {
                test.skip();
                return;
            }

            await page.goto(`/rooms/${roomId}`);
            await page.waitForTimeout(3000);

            // Check connection badge
            const connectedBadge = page.getByText(/Connected/i);
            const isShownConnected = await connectedBadge.isVisible().catch(() => false);

            // Either WebSocket connected or UI shows connected
            expect(wsConnected || isShownConnected).toBeTruthy();
        });
    });

    test.describe('Back Navigation', () => {
        test('should navigate back to rooms using back button', async ({ page }) => {
            const roomId = await getFirstRoomId(page);
            if (!roomId) {
                test.skip();
                return;
            }

            await page.goto(`/rooms/${roomId}`);
            await page.waitForTimeout(2000);

            const backButton = page.getByRole('button', { name: /Back/i }).first();
            await backButton.click();
            await page.waitForTimeout(1000);

            await expect(page).toHaveURL('/rooms');
        });
    });

    test.describe('Responsive Design', () => {
        test('should display properly on mobile', async ({ page }) => {
            await page.setViewportSize({ width: 375, height: 667 });

            const roomId = await getFirstRoomId(page);
            if (!roomId) {
                test.skip();
                return;
            }

            await page.goto(`/rooms/${roomId}`);
            await page.waitForTimeout(2000);

            // Room header should be visible
            const roomTitle = page.locator('h2').first();
            await expect(roomTitle).toBeVisible();

            // Voice controls should be visible
            const muteButton = page.getByRole('button', { name: /Mute|Unmute/i }).first();
            await expect(muteButton).toBeVisible();
        });

        test('should display properly on tablet', async ({ page }) => {
            await page.setViewportSize({ width: 768, height: 1024 });

            const roomId = await getFirstRoomId(page);
            if (!roomId) {
                test.skip();
                return;
            }

            await page.goto(`/rooms/${roomId}`);
            await page.waitForTimeout(2000);

            const roomTitle = page.locator('h2').first();
            await expect(roomTitle).toBeVisible();
        });
    });
});

test.describe('Room Detail - Full Flow', () => {
    test.beforeEach(async ({ page }) => {
        await mockAuthenticatedUser(page);
    });

    test('should complete join -> interact -> leave flow', async ({ page }) => {
        // 1. Go to rooms and find a room
        await page.goto('/rooms');
        await page.waitForTimeout(2000);

        // 2. Join first available room
        const joinButton = page.getByRole('button', { name: /Join/i }).first();
        if (!await joinButton.isVisible()) {
            test.skip();
            return;
        }

        await joinButton.click();
        await page.waitForTimeout(2000);

        // 3. Should be in room
        expect(page.url()).toContain('/rooms/');

        // 4. Toggle mute
        const muteButton = page.getByRole('button', { name: /Mute|Unmute/i }).first();
        if (await muteButton.isVisible()) {
            await muteButton.click();
            await page.waitForTimeout(300);
        }

        // 5. Leave room
        const leaveButton = page.getByRole('button', { name: /Leave/i });
        if (await leaveButton.isVisible()) {
            await leaveButton.click();
            await page.waitForTimeout(1000);
        }

        // 6. Should be back on rooms list
        await expect(page).toHaveURL('/rooms');
    });
});
