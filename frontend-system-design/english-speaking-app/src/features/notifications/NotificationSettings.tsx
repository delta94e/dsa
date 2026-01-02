'use client';

import { usePushNotifications } from '@/shared/hooks/usePushNotifications';
import {
  Card,
  Switch,
  Text,
  Group,
  Stack,
  Badge,
  Button,
  Alert,
  Loader,
  ThemeIcon,
} from '@mantine/core';
import {
  IconBell,
  IconBellOff,
  IconCheck,
  IconX,
  IconAlertCircle,
  IconFlame,
  IconTrophy,
  IconUsers,
} from '@tabler/icons-react';
import { useState } from 'react';
import styles from './NotificationSettings.module.css';

interface NotificationPreferences {
  dailyReminders: boolean;
  streakReminders: boolean;
  achievements: boolean;
  roomInvites: boolean;
}

export function NotificationSettings() {
  const {
    isSupported,
    isSubscribed,
    isLoading,
    permission,
    error,
    subscribe,
    unsubscribe,
  } = usePushNotifications();

  const [preferences, setPreferences] = useState<NotificationPreferences>({
    dailyReminders: true,
    streakReminders: true,
    achievements: true,
    roomInvites: true,
  });

  const [isSaving, setIsSaving] = useState(false);

  // Handle main toggle
  const handleToggleNotifications = async () => {
    setIsSaving(true);
    try {
      if (isSubscribed) {
        await unsubscribe();
      } else {
        await subscribe();
      }
    } finally {
      setIsSaving(false);
    }
  };

  // Handle preference toggle
  const handlePreferenceChange = (key: keyof NotificationPreferences) => {
    setPreferences((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
    // TODO: Save preferences to server
  };

  // Render permission badge
  const getPermissionBadge = () => {
    switch (permission) {
      case 'granted':
        return (
          <Badge color="green" variant="light" leftSection={<IconCheck size={12} />}>
            Allowed
          </Badge>
        );
      case 'denied':
        return (
          <Badge color="red" variant="light" leftSection={<IconX size={12} />}>
            Blocked
          </Badge>
        );
      case 'default':
        return (
          <Badge color="yellow" variant="light">
            Not Set
          </Badge>
        );
      default:
        return (
          <Badge color="gray" variant="light">
            Unsupported
          </Badge>
        );
    }
  };

  // Not supported warning
  if (!isSupported) {
    return (
      <Card className={styles.card} withBorder>
        <Alert
          icon={<IconAlertCircle size={16} />}
          title="Notifications Not Supported"
          color="yellow"
        >
          Your browser doesn't support push notifications. Try using Chrome, Firefox, or Edge.
        </Alert>
      </Card>
    );
  }

  // Loading state
  if (isLoading && !isSaving) {
    return (
      <Card className={styles.card} withBorder>
        <Group justify="center" py="xl">
          <Loader size="md" />
          <Text>Loading notification settings...</Text>
        </Group>
      </Card>
    );
  }

  return (
    <Card className={styles.card} withBorder>
      <Stack gap="lg">
        {/* Header */}
        <Group justify="space-between">
          <Group>
            <ThemeIcon
              size="lg"
              radius="md"
              variant="gradient"
              gradient={{ from: 'indigo', to: 'violet' }}
            >
              {isSubscribed ? <IconBell size={20} /> : <IconBellOff size={20} />}
            </ThemeIcon>
            <div>
              <Text fw={600} size="lg">
                Push Notifications
              </Text>
              <Text size="sm" c="dimmed">
                Stay updated with learning reminders
              </Text>
            </div>
          </Group>
          {getPermissionBadge()}
        </Group>

        {/* Error Alert */}
        {error && (
          <Alert icon={<IconAlertCircle size={16} />} color="red" title="Error">
            {error}
          </Alert>
        )}

        {/* Permission Denied Alert */}
        {permission === 'denied' && (
          <Alert icon={<IconAlertCircle size={16} />} color="red" title="Notifications Blocked">
            You have blocked notifications. Please enable them in your browser settings to receive
            learning reminders.
          </Alert>
        )}

        {/* Main Toggle */}
        <Card className={styles.toggleCard} withBorder p="md">
          <Group justify="space-between">
            <div>
              <Text fw={500}>Enable Notifications</Text>
              <Text size="sm" c="dimmed">
                Receive push notifications on this device
              </Text>
            </div>
            <Switch
              checked={isSubscribed}
              onChange={handleToggleNotifications}
              disabled={isSaving || permission === 'denied'}
              size="lg"
              color="violet"
              thumbIcon={
                isSaving ? (
                  <Loader size={12} />
                ) : isSubscribed ? (
                  <IconCheck size={12} color="var(--mantine-color-violet-6)" />
                ) : (
                  <IconX size={12} color="var(--mantine-color-gray-6)" />
                )
              }
            />
          </Group>
        </Card>

        {/* Notification Preferences */}
        {isSubscribed && (
          <Stack gap="sm">
            <Text fw={500} size="sm" c="dimmed" tt="uppercase">
              Notification Types
            </Text>

            {/* Daily Reminders */}
            <Group justify="space-between" className={styles.preferenceItem}>
              <Group>
                <ThemeIcon size="md" variant="light" color="blue">
                  <IconBell size={16} />
                </ThemeIcon>
                <div>
                  <Text size="sm" fw={500}>
                    Daily Reminders
                  </Text>
                  <Text size="xs" c="dimmed">
                    Remind me to practice every day
                  </Text>
                </div>
              </Group>
              <Switch
                checked={preferences.dailyReminders}
                onChange={() => handlePreferenceChange('dailyReminders')}
                color="blue"
              />
            </Group>

            {/* Streak Reminders */}
            <Group justify="space-between" className={styles.preferenceItem}>
              <Group>
                <ThemeIcon size="md" variant="light" color="orange">
                  <IconFlame size={16} />
                </ThemeIcon>
                <div>
                  <Text size="sm" fw={500}>
                    Streak Reminders
                  </Text>
                  <Text size="xs" c="dimmed">
                    Alert me before losing my streak
                  </Text>
                </div>
              </Group>
              <Switch
                checked={preferences.streakReminders}
                onChange={() => handlePreferenceChange('streakReminders')}
                color="orange"
              />
            </Group>

            {/* Achievements */}
            <Group justify="space-between" className={styles.preferenceItem}>
              <Group>
                <ThemeIcon size="md" variant="light" color="yellow">
                  <IconTrophy size={16} />
                </ThemeIcon>
                <div>
                  <Text size="sm" fw={500}>
                    Achievements
                  </Text>
                  <Text size="xs" c="dimmed">
                    Celebrate my learning milestones
                  </Text>
                </div>
              </Group>
              <Switch
                checked={preferences.achievements}
                onChange={() => handlePreferenceChange('achievements')}
                color="yellow"
              />
            </Group>

            {/* Room Invites */}
            <Group justify="space-between" className={styles.preferenceItem}>
              <Group>
                <ThemeIcon size="md" variant="light" color="teal">
                  <IconUsers size={16} />
                </ThemeIcon>
                <div>
                  <Text size="sm" fw={500}>
                    Room Invites
                  </Text>
                  <Text size="xs" c="dimmed">
                    Notify me about speaking room invitations
                  </Text>
                </div>
              </Group>
              <Switch
                checked={preferences.roomInvites}
                onChange={() => handlePreferenceChange('roomInvites')}
                color="teal"
              />
            </Group>
          </Stack>
        )}

        {/* Test Notification Button (Dev only) */}
        {isSubscribed && process.env.NODE_ENV === 'development' && (
          <Button
            variant="light"
            color="violet"
            onClick={async () => {
              await fetch('/api/push/send', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  title: '📚 Test Notification',
                  body: 'Push notifications are working correctly!',
                  url: '/',
                }),
              });
            }}
          >
            Send Test Notification
          </Button>
        )}
      </Stack>
    </Card>
  );
}
