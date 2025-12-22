'use client';

import { Group, Avatar, Text, Button, Menu, UnstyledButton } from '@mantine/core';
import { IconLogout, IconUser, IconChevronDown } from '@tabler/icons-react';
import Link from 'next/link';
import { useAuthStore } from '@/stores/authStore';

export function UserMenu() {
    const { user, isAuthenticated, logout, isLoading } = useAuthStore();

    if (isLoading) {
        return null;
    }

    if (!isAuthenticated || !user) {
        return (
            <Link href="/login">
                <Button variant="light" size="sm">
                    Sign In
                </Button>
            </Link>
        );
    }

    return (
        <Menu shadow="md" width={200} position="bottom-end">
            <Menu.Target>
                <UnstyledButton>
                    <Group gap="xs">
                        <Avatar src={user.avatarUrl} alt={user.name} size="sm" radius="xl" />
                        <Text size="sm" fw={500} visibleFrom="sm">
                            {user.name}
                        </Text>
                        <IconChevronDown size={14} />
                    </Group>
                </UnstyledButton>
            </Menu.Target>

            <Menu.Dropdown>
                <Menu.Label>Account</Menu.Label>
                <Menu.Item leftSection={<IconUser size={14} />}>
                    {user.email}
                </Menu.Item>
                <Menu.Divider />
                <Menu.Item
                    color="red"
                    leftSection={<IconLogout size={14} />}
                    onClick={logout}
                >
                    Logout
                </Menu.Item>
            </Menu.Dropdown>
        </Menu>
    );
}
