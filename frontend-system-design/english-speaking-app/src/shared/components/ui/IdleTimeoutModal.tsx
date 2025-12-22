'use client';

import { Modal, Text, Button, Group, Stack, Progress, Center } from '@mantine/core';
import { IconAlertCircle } from '@tabler/icons-react';
import { motion } from 'framer-motion';

interface IdleTimeoutModalProps {
    opened: boolean;
    remainingTime: number;
    warningTime: number;
    onContinue: () => void;
    onLogout: () => void;
}

export function IdleTimeoutModal({
    opened,
    remainingTime,
    warningTime,
    onContinue,
    onLogout,
}: IdleTimeoutModalProps) {
    const seconds = Math.ceil(remainingTime / 1000);
    const progress = (remainingTime / warningTime) * 100;

    return (
        <Modal
            opened={opened}
            onClose={onContinue}
            title={
                <Group gap="xs">
                    <IconAlertCircle size={24} color="orange" />
                    <Text fw={600}>Are you still there?</Text>
                </Group>
            }
            centered
            withCloseButton={false}
            closeOnClickOutside={false}
            closeOnEscape={false}
        >
            <Stack gap="lg">
                <Text c="dimmed" size="sm">
                    You&apos;ve been inactive for a while. For your security, you will be
                    logged out automatically.
                </Text>

                <Center>
                    <motion.div
                        initial={{ scale: 0.8 }}
                        animate={{ scale: [0.8, 1, 0.8] }}
                        transition={{ duration: 1, repeat: Infinity }}
                    >
                        <Text
                            size="3rem"
                            fw={700}
                            c={seconds <= 10 ? 'red' : 'orange'}
                            style={{ fontVariantNumeric: 'tabular-nums' }}
                        >
                            {seconds}s
                        </Text>
                    </motion.div>
                </Center>

                <Progress
                    value={progress}
                    color={progress < 30 ? 'red' : progress < 60 ? 'orange' : 'blue'}
                    size="lg"
                    radius="xl"
                    animated
                />

                <Group justify="center" gap="md">
                    <Button variant="light" color="gray" onClick={onLogout}>
                        Log Out Now
                    </Button>
                    <Button color="blue" onClick={onContinue} autoFocus>
                        Continue Session
                    </Button>
                </Group>
            </Stack>
        </Modal>
    );
}
