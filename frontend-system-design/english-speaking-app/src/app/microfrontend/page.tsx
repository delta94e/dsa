'use client';

import { useState } from 'react';
import { Container, Title, Text, SimpleGrid, Paper, Group, Badge, Box, Alert, Code, Stack, Tabs, Divider } from '@mantine/core';
import { IconAlertCircle, IconFlame, IconPlug, IconBrandSvelte } from '@tabler/icons-react';
import dynamic from 'next/dynamic';

// Lit Components (dynamic import for SSR)
const RemoteLitProvider = dynamic(
    () => import('@/shared/components/RemoteLit').then(m => ({ default: m.RemoteLitProvider })),
    { ssr: false }
);
const LitWidgetWrapper = dynamic(
    () => import('@/shared/components/RemoteLit').then(m => ({ default: m.LitWidgetWrapper })),
    { ssr: false }
);
const LitCounterWrapper = dynamic(
    () => import('@/shared/components/RemoteLit').then(m => ({ default: m.LitCounterWrapper })),
    { ssr: false }
);

// Svelte Components (dynamic import for SSR)
const RemoteSvelteProvider = dynamic(
    () => import('@/shared/components/RemoteSvelte').then(m => ({ default: m.RemoteSvelteProvider })),
    { ssr: false }
);
const SvelteWidgetWrapper = dynamic(
    () => import('@/shared/components/RemoteSvelte').then(m => ({ default: m.SvelteWidgetWrapper })),
    { ssr: false }
);
const SvelteCounterWrapper = dynamic(
    () => import('@/shared/components/RemoteSvelte').then(m => ({ default: m.SvelteCounterWrapper })),
    { ssr: false }
);

export default function MicrofrontendDemoPage() {
    const [litCounterValue, setLitCounterValue] = useState<number | null>(null);
    const [svelteCounterValue, setSvelteCounterValue] = useState<number | null>(null);

    return (
        <RemoteLitProvider remoteUrl="http://localhost:3003/dist/lit-components.js">
            <RemoteSvelteProvider remoteUrl="http://localhost:3005/dist/svelte-components.js">
                <Container size="lg" py="xl">
                    <Group gap="sm" mb="xl">
                        <IconPlug size={32} stroke={1.5} />
                        <Title order={1}>Microfrontend Demo</Title>
                        <Badge variant="light" color="orange" size="lg">Lit</Badge>
                        <Badge variant="light" color="red" size="lg">Svelte</Badge>
                    </Group>

                    <Alert icon={<IconAlertCircle size={16} />} title="How it works" color="blue" mb="xl">
                        <Text size="sm">
                            These components are loaded from <strong>separate applications</strong> via Web Components.
                        </Text>
                        <Code block mt="sm">
{`# Terminal 1: Lit Remote
cd lit-remote && yarn dev

# Terminal 2: Svelte Remote
cd svelte-wc-remote && yarn dev

# Terminal 3: Next.js Host
cd english-speaking-app && yarn dev`}
                        </Code>
                    </Alert>

                    {/* Lit Section */}
                    <Title order={2} mb="md">
                        <Group gap="xs">
                            <IconFlame size={24} color="#f97316" />
                            Lit Web Components
                            <Badge color="orange">:3003</Badge>
                        </Group>
                    </Title>

                    <SimpleGrid cols={{ base: 1, md: 2 }} spacing="xl" mb="xl">
                        <Paper shadow="sm" radius="lg" p="xl" withBorder>
                            <Title order={4} mb="md">Lit Widget</Title>
                            <LitWidgetWrapper
                                title="Federated Widget"
                                description="This Lit component is rendered inside Next.js!"
                            />
                        </Paper>

                        <Paper shadow="sm" radius="lg" p="xl" withBorder>
                            <Title order={4} mb="md">Lit Counter</Title>
                            <Stack gap="md">
                                <LitCounterWrapper
                                    initialValue={10}
                                    step={5}
                                    onCountChanged={setLitCounterValue}
                                />
                                {litCounterValue !== null && (
                                    <Text size="sm" c="orange">React received: {litCounterValue}</Text>
                                )}
                            </Stack>
                        </Paper>
                    </SimpleGrid>

                    <Divider my="xl" />

                    {/* Svelte Section */}
                    <Title order={2} mb="md">
                        <Group gap="xs">
                            <IconBrandSvelte size={24} color="#ff3e00" />
                            Svelte Web Components
                            <Badge color="red">:3005</Badge>
                        </Group>
                    </Title>

                    <SimpleGrid cols={{ base: 1, md: 2 }} spacing="xl" mb="xl">
                        <Paper shadow="sm" radius="lg" p="xl" withBorder>
                            <Title order={4} mb="md">Svelte Widget</Title>
                            <SvelteWidgetWrapper
                                title="Svelte Widget"
                                description="This Svelte component is rendered inside Next.js!"
                            />
                        </Paper>

                        <Paper shadow="sm" radius="lg" p="xl" withBorder>
                            <Title order={4} mb="md">Svelte Counter</Title>
                            <Stack gap="md">
                                <SvelteCounterWrapper
                                    initialValue={0}
                                    step={1}
                                    onCountChanged={setSvelteCounterValue}
                                />
                                {svelteCounterValue !== null && (
                                    <Text size="sm" c="red">React received: {svelteCounterValue}</Text>
                                )}
                            </Stack>
                        </Paper>
                    </SimpleGrid>

                    <Paper shadow="sm" radius="lg" p="xl" bg="dark.7">
                        <Title order={3} c="white" mb="md">Architecture</Title>
                        <Code block style={{ background: 'transparent', color: '#a5d8ff' }}>
{`┌─────────────────────────────────────────────────────┐
│  Host (Next.js :3001)                               │
│  ┌───────────────────────────────────────────────┐  │
│  │ <lit-widget/>  <lit-counter/>    ← Lit :3003  │  │
│  │ <svelte-widget/> <svelte-counter/> ← Svelte   │  │
│  └───────────────────────────────────────────────┘  │
└──────────────────────────────│──────────────────────┘
                               ▼
          ┌────────────────────┼────────────────────┐
          ▼                                         ▼
┌──────────────────┐                    ┌──────────────────┐
│  Lit :3003       │                    │  Svelte :3005    │
│  28KB bundle     │                    │  18KB bundle     │
└──────────────────┘                    └──────────────────┘`}
                        </Code>
                    </Paper>
                </Container>
            </RemoteSvelteProvider>
        </RemoteLitProvider>
    );
}
