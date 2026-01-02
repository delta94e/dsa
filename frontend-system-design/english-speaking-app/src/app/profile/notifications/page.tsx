import { NotificationSettings } from '@/features/notifications';
import { Container, Title, Text, Stack } from '@mantine/core';

export const metadata = {
  title: 'Notification Settings | English Speaking App',
  description: 'Manage your push notification preferences',
};

export default function NotificationsPage() {
  return (
    <Container size="sm" py="xl">
      <Stack gap="lg">
        <div>
          <Title order={2}>Notification Settings</Title>
          <Text c="dimmed" size="sm">
            Configure how and when you want to receive learning reminders
          </Text>
        </div>

        <NotificationSettings />
      </Stack>
    </Container>
  );
}
