'use client';

import {
    Container,
    Title,
    Text,
    Button,
    Paper,
    Stack,
    Group,
    Divider,
    Center,
    Box,
    Badge,
    Loader,
} from '@mantine/core';
import { IconBrandGoogle, IconMicrophone, IconUsers, IconRobot } from '@tabler/icons-react';
import Link from 'next/link';
import { useAuthStore } from '@/stores/authStore';
import { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

function LoginContent() {
    const { login, isAuthenticated, checkAuth } = useAuthStore();
    const router = useRouter();
    const searchParams = useSearchParams();

    useEffect(() => {
        // Check if already authenticated
        checkAuth().then(() => {
            if (useAuthStore.getState().isAuthenticated) {
                router.push('/');
            }
        });
    }, [checkAuth, router]);

    // Handle login success redirect
    useEffect(() => {
        if (searchParams.get('login') === 'success') {
            checkAuth();
            router.push('/');
        }
    }, [searchParams, checkAuth, router]);

    if (isAuthenticated) {
        return null; // Redirecting...
    }

    return (
        <Box
            style={{
                minHeight: '100vh',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }}
        >
            <Container size="xs">
                <Paper shadow="xl" p="xl" radius="lg" style={{ background: 'white' }}>
                    <Stack gap="xl">
                        {/* Logo & Title */}
                        <Center>
                            <Stack align="center" gap="xs">
                                <Text size="3rem">🎤</Text>
                                <Title order={1} style={{ color: '#667eea' }}>
                                    SpeakUp
                                </Title>
                                <Text c="dimmed" ta="center">
                                    Practice English Speaking with Real People & AI
                                </Text>
                            </Stack>
                        </Center>

                        <Divider />

                        {/* Features */}
                        <Stack gap="sm">
                            <Group gap="sm">
                                <IconUsers size={20} color="#667eea" />
                                <Text size="sm">Join voice rooms with learners worldwide</Text>
                            </Group>
                            <Group gap="sm">
                                <IconRobot size={20} color="#667eea" />
                                <Text size="sm">Practice with AI conversation partner</Text>
                            </Group>
                            <Group gap="sm">
                                <IconMicrophone size={20} color="#667eea" />
                                <Text size="sm">Real-time voice chat with reactions</Text>
                            </Group>
                        </Stack>

                        <Divider />

                        {/* Login Button */}
                        <Button
                            size="lg"
                            radius="md"
                            leftSection={<IconBrandGoogle size={20} />}
                            onClick={login}
                            variant="gradient"
                            gradient={{ from: '#4285f4', to: '#34a853' }}
                            fullWidth
                        >
                            Sign in with Google
                        </Button>

                        <Text size="xs" c="dimmed" ta="center">
                            By signing in, you agree to our Terms of Service and Privacy Policy
                        </Text>

                        {/* Continue as Guest */}
                        <Divider label="or" labelPosition="center" />

                        <Link href="/" style={{ textDecoration: 'none' }}>
                            <Button variant="subtle" color="gray" fullWidth>
                                Continue as Guest
                            </Button>
                        </Link>
                    </Stack>
                </Paper>

                {/* Demo Badge */}
                <Center mt="md">
                    <Badge color="white" variant="light" size="lg">
                        🚀 Demo Mode - No real data stored
                    </Badge>
                </Center>
            </Container>
        </Box>
    );
}

// Loading fallback for Suspense
function LoginLoading() {
    return (
        <Box
            style={{
                minHeight: '100vh',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }}
        >
            <Loader color="white" size="lg" />
        </Box>
    );
}

// Wrap with Suspense to support useSearchParams
export default function LoginPage() {
    return (
        <Suspense fallback={<LoginLoading />}>
            <LoginContent />
        </Suspense>
    );
}
