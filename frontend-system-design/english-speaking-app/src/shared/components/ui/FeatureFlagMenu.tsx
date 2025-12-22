'use client';

import { useEffect, useState, useMemo } from 'react';
import {
    Modal,
    Button,
    Switch,
    Text,
    Group,
    Stack,
    Paper,
    Badge,
    Slider,
    Loader,
    Alert,
    Divider,
    ActionIcon,
    Tooltip,
    Menu,
} from '@mantine/core';
import {
    IconSettings,
    IconFlask,
    IconAlertCircle,
    IconCheck,
    IconX,
} from '@tabler/icons-react';
import { useFeatureFlagStore, FeatureFlag } from '@/stores/featureFlagStore';
import type { FeatureFlagsMap, FlagId } from '@/lib/featureFlags';

interface ConfirmationModalProps {
    opened: boolean;
    onClose: () => void;
    onConfirm: () => void;
    flag: FeatureFlag | null;
    action: 'enable' | 'disable';
    isLoading: boolean;
}

function ConfirmationModal({ opened, onClose, onConfirm, flag, action, isLoading }: ConfirmationModalProps) {
    return (
        <Modal
            opened={opened}
            onClose={onClose}
            title={
                <Group gap="xs">
                    <IconAlertCircle size={20} color={action === 'enable' ? 'green' : 'orange'} />
                    <Text fw={600}>Confirm Feature Toggle</Text>
                </Group>
            }
            centered
        >
            <Stack gap="md">
                <Text>
                    Are you sure you want to <strong>{action}</strong> the feature{' '}
                    <Badge variant="light">{flag?.name}</Badge>?
                </Text>
                
                {flag?.description && (
                    <Paper p="sm" bg="gray.0" radius="sm">
                        <Text size="sm" c="dimmed">{flag.description}</Text>
                    </Paper>
                )}

                {flag?.percentage && flag.percentage < 100 && (
                    <Alert color="blue" variant="light">
                        <Text size="sm">
                            This feature is in A/B testing mode and will only affect{' '}
                            <strong>{flag.percentage}%</strong> of users.
                        </Text>
                    </Alert>
                )}

                <Group justify="flex-end" mt="md">
                    <Button variant="subtle" onClick={onClose} disabled={isLoading}>
                        Cancel
                    </Button>
                    <Button
                        color={action === 'enable' ? 'green' : 'orange'}
                        onClick={onConfirm}
                        loading={isLoading}
                        leftSection={action === 'enable' ? <IconCheck size={16} /> : <IconX size={16} />}
                    >
                        {action === 'enable' ? 'Enable' : 'Disable'}
                    </Button>
                </Group>
            </Stack>
        </Modal>
    );
}

interface FeatureFlagMenuProps {
    triggerButton?: React.ReactNode;
}

export function FeatureFlagMenu({ triggerButton }: FeatureFlagMenuProps) {
    const [opened, setOpened] = useState(false);
    const [confirmModal, setConfirmModal] = useState<{
        opened: boolean;
        flag: FeatureFlag | null;
        action: 'enable' | 'disable';
    }>({ opened: false, flag: null, action: 'enable' });
    const [isToggling, setIsToggling] = useState(false);

    const { flags, isLoading, error, fetchFlags, toggleFlag, updateFlag } = useFeatureFlagStore();

    useEffect(() => {
        if (opened && flags.length === 0) {
            fetchFlags();
        }
    }, [opened, fetchFlags, flags.length]);

    const handleToggleClick = (flag: FeatureFlag) => {
        setConfirmModal({
            opened: true,
            flag,
            action: flag.enabled ? 'disable' : 'enable',
        });
    };

    const handleConfirmToggle = async () => {
        if (!confirmModal.flag) return;
        
        setIsToggling(true);
        await toggleFlag(confirmModal.flag.id);
        setIsToggling(false);
        setConfirmModal({ opened: false, flag: null, action: 'enable' });
    };

    const handlePercentageChange = async (flagId: string, percentage: number) => {
        await updateFlag(flagId, { percentage });
    };

    return (
        <>
            {/* Feature Flag Panel Modal */}
            <Modal
                opened={opened}
                onClose={() => setOpened(false)}
                title={
                    <Group gap="xs">
                        <IconFlask size={20} />
                        <Text fw={600}>Feature Flags & A/B Testing</Text>
                    </Group>
                }
                size="lg"
                centered
            >
                <Stack gap="md">
                    {isLoading && (
                        <Group justify="center" py="xl">
                            <Loader size="md" />
                        </Group>
                    )}

                    {error && (
                        <Alert color="red" icon={<IconAlertCircle size={16} />}>
                            {error}
                        </Alert>
                    )}

                    {!isLoading && flags.length === 0 && (
                        <Text c="dimmed" ta="center" py="xl">
                            No feature flags configured
                        </Text>
                    )}

                    {flags.map((flag) => (
                        <Paper key={flag.id} p="md" withBorder radius="md">
                            <Group justify="space-between" mb="xs">
                                <Group gap="sm">
                                    <Text fw={500}>{flag.name}</Text>
                                    {flag.variants && flag.variants.length > 0 && (
                                        <Badge size="sm" variant="light" color="violet">
                                            A/B Test
                                        </Badge>
                                    )}
                                    {flag.percentage < 100 && (
                                        <Badge size="sm" variant="light" color="blue">
                                            {flag.percentage}% Rollout
                                        </Badge>
                                    )}
                                </Group>
                                <Switch
                                    checked={flag.enabled}
                                    onChange={() => handleToggleClick(flag)}
                                    color="green"
                                    size="md"
                                />
                            </Group>
                            
                            <Text size="sm" c="dimmed" mb="md">
                                {flag.description}
                            </Text>

                            {flag.enabled && (
                                <>
                                    <Divider my="xs" />
                                    <Group justify="space-between" align="center">
                                        <Text size="sm" fw={500}>
                                            Rollout Percentage
                                        </Text>
                                        <Text size="sm" c="dimmed">
                                            {flag.percentage}%
                                        </Text>
                                    </Group>
                                    <Slider
                                        value={flag.percentage}
                                        onChange={(value) => handlePercentageChange(flag.id, value)}
                                        min={0}
                                        max={100}
                                        step={5}
                                        marks={[
                                            { value: 0, label: '0%' },
                                            { value: 50, label: '50%' },
                                            { value: 100, label: '100%' },
                                        ]}
                                        mt="xs"
                                        mb="md"
                                    />
                                </>
                            )}

                            {flag.variants && flag.variants.length > 0 && flag.enabled && (
                                <>
                                    <Divider my="xs" label="Variants" labelPosition="left" />
                                    <Stack gap="xs">
                                        {flag.variants.map((variant) => (
                                            <Group key={variant.id} justify="space-between">
                                                <Text size="sm">{variant.name}</Text>
                                                <Badge variant="outline">{variant.weight}%</Badge>
                                            </Group>
                                        ))}
                                    </Stack>
                                </>
                            )}
                        </Paper>
                    ))}
                </Stack>
            </Modal>

            {/* Confirmation Modal */}
            <ConfirmationModal
                opened={confirmModal.opened}
                onClose={() => setConfirmModal({ opened: false, flag: null, action: 'enable' })}
                onConfirm={handleConfirmToggle}
                flag={confirmModal.flag}
                action={confirmModal.action}
                isLoading={isToggling}
            />

            {/* Trigger Button */}
            {triggerButton ? (
                <div onClick={() => setOpened(true)}>{triggerButton}</div>
            ) : (
                <Tooltip label="Feature Flags">
                    <ActionIcon
                        variant="subtle"
                        size="lg"
                        onClick={() => setOpened(true)}
                    >
                        <IconFlask size={20} />
                    </ActionIcon>
                </Tooltip>
            )}
        </>
    );
}

// Hook for single feature flag
export function useFeatureFlag(flagId: string): { enabled: boolean; variant?: string } {
    const { userFlags, fetchUserFlags, isFeatureEnabled, getVariant } = useFeatureFlagStore();

    useEffect(() => {
        if (Object.keys(userFlags).length === 0) {
            fetchUserFlags();
        }
    }, [fetchUserFlags, userFlags]);

    return {
        enabled: isFeatureEnabled(flagId),
        variant: getVariant(flagId),
    };
}

// Hook for multiple feature flags at once
type FeatureFlagsResult<T extends string> = {
    [K in T]: { enabled: boolean; variant?: string };
};

export function useFeatureFlags<T extends string>(flagIds: T[]): FeatureFlagsResult<T> {
    const { userFlags, fetchUserFlags, isFeatureEnabled, getVariant } = useFeatureFlagStore();

    useEffect(() => {
        if (Object.keys(userFlags).length === 0) {
            fetchUserFlags();
        }
    }, [fetchUserFlags, userFlags]);

    const result = {} as FeatureFlagsResult<T>;
    for (const flagId of flagIds) {
        result[flagId] = {
            enabled: isFeatureEnabled(flagId),
            variant: getVariant(flagId),
        };
    }
    return result;
}

// 🚀 FULLY DYNAMIC with TypeScript Autocomplete!
// Usage: const flags = useFlags(); flags.ai_practice.enabled
// Hover over `flags.` to see all available flags!

// Default value for SSR - all flags enabled to prevent hydration mismatch
const DEFAULT_FLAG_VALUE = { enabled: true, variant: undefined };

export function useFlags(): FeatureFlagsMap {
    const { userFlags, fetchUserFlags, isFeatureEnabled, getVariant } = useFeatureFlagStore();
    const [isClient, setIsClient] = useState(false);

    // Always call all hooks first (React rules of hooks)
    useEffect(() => {
        setIsClient(true);
        if (Object.keys(userFlags).length === 0) {
            fetchUserFlags();
        }
    }, [fetchUserFlags, userFlags]);

    // Use useMemo to create stable proxy based on isClient state
    const flagsProxy = useMemo(() => {
        if (!isClient) {
            // During SSR or before hydration, return default values
            return new Proxy({} as FeatureFlagsMap, {
                get: () => DEFAULT_FLAG_VALUE,
            });
        }
        // After client mount, return actual flag values
        return new Proxy({} as FeatureFlagsMap, {
            get: (_, flagId: string) => ({
                enabled: isFeatureEnabled(flagId as FlagId),
                variant: getVariant(flagId as FlagId),
            }),
        });
    }, [isClient, isFeatureEnabled, getVariant]);

    return flagsProxy;
}

// Component for conditional feature rendering
interface FeatureProps {
    flag: string;
    children: React.ReactNode;
    fallback?: React.ReactNode;
}

export function Feature({ flag, children, fallback = null }: FeatureProps) {
    const { enabled } = useFeatureFlag(flag);
    return enabled ? <>{children}</> : <>{fallback}</>;
}

