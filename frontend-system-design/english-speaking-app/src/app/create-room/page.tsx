'use client';

import { useRouter } from 'next/navigation';
import {
  Container,
  Title,
  Text,
  Paper,
  TextInput,
  Textarea,
  Select,
  Button,
  Group,
  NumberInput,
  TagsInput,
  Box,
  Stack,
  PasswordInput,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconArrowLeft, IconPlus, IconLock } from '@tabler/icons-react';
import Link from 'next/link';
import { LEVELS, CreateRoomInput } from '@/types';
import { useCreateRoom } from '@/features/rooms/hooks/useRooms';
import { PrivateRoute } from '@/features/auth';

export default function CreateRoomPage() {
  const router = useRouter();
  const createRoom = useCreateRoom();

  const form = useForm<CreateRoomInput>({
    initialValues: {
      name: '',
      topic: '',
      level: 'B1',
      type: 'public',
      maxParticipants: 8,
      tags: [],
    },
    validate: {
      name: (value) => (value.length < 3 ? 'Name must be at least 3 characters' : null),
      topic: (value) => (value.length < 10 ? 'Topic must be at least 10 characters' : null),
    },
  });

  const handleSubmit = async (values: CreateRoomInput) => {
    try {
      const room = await createRoom.mutateAsync(values);
      router.push(`/rooms/${room.id}`);
    } catch (error) {
      console.error('Failed to create room:', error);
    }
  };

  return (
    <PrivateRoute>
    <Box style={{ minHeight: '100vh', background: '#f8f9fa' }}>
      <Container size="sm" py="xl">
        <Group mb="xl">
          <Link href="/rooms">
            <Button variant="subtle" leftSection={<IconArrowLeft size={16} />}>
              Back
            </Button>
          </Link>
        </Group>

        <Paper shadow="sm" p="xl" radius="lg">
          <Title order={2} mb="xs">
            Create a Room
          </Title>
          <Text c="dimmed" mb="xl">
            Set up your voice room for English practice
          </Text>

          <form onSubmit={form.onSubmit(handleSubmit)}>
            <Stack gap="md">
              <TextInput
                label="Room Name"
                placeholder="e.g., Travel Stories, Business English"
                required
                {...form.getInputProps('name')}
              />

              <Textarea
                label="Topic Description"
                placeholder="What will participants talk about in this room?"
                required
                minRows={3}
                {...form.getInputProps('topic')}
              />

              <Select
                label="Level"
                data={LEVELS.map((l) => ({
                  value: l.code,
                  label: `${l.code} - ${l.name}`,
                }))}
                required
                {...form.getInputProps('level')}
              />

              <Select
                label="Room Type"
                data={[
                  { value: 'public', label: 'Public - Anyone can join' },
                  { value: 'private', label: 'Private - Invite only' },
                ]}
                required
                {...form.getInputProps('type')}
              />

              <NumberInput
                label="Max Participants"
                min={2}
                max={12}
                {...form.getInputProps('maxParticipants')}
              />

              <TagsInput
                label="Tags"
                placeholder="Add tags and press Enter"
                maxTags={5}
                {...form.getInputProps('tags')}
              />

              <PasswordInput
                label="Room Password (Optional)"
                description="If set, users will need this password to join"
                placeholder="Leave empty for no password"
                leftSection={<IconLock size={16} />}
                {...form.getInputProps('password')}
              />

              <Button
                type="submit"
                size="lg"
                loading={createRoom.isPending}
                leftSection={<IconPlus size={18} />}
                mt="md"
              >
                Create Room
              </Button>
            </Stack>
          </form>
        </Paper>
      </Container>
    </Box>
    </PrivateRoute>
  );
}
