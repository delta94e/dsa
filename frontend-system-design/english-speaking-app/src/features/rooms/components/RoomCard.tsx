'use client';

import { Card, Badge, Group, Text, Avatar, Button, Box } from '@mantine/core';
import { IconUsers, IconMicrophone } from '@tabler/icons-react';
import { Room, LEVEL_COLORS } from '@/types';
import Link from 'next/link';

interface RoomCardProps {
  room: Room;
}

export function RoomCard({ room }: RoomCardProps) {
  return (
    <Card shadow="sm" padding="lg" style={{ height: '100%' }}>
      <Group justify="space-between" mb="xs">
        <Text fw={600} size="lg" lineClamp={1}>
          {room.name}
        </Text>
        <Badge color={LEVEL_COLORS[room.level]} variant="light" size="lg">
          {room.level}
        </Badge>
      </Group>

      <Text size="sm" c="dimmed" mb="md" lineClamp={2}>
        {room.topic}
      </Text>

      {room.tags.length > 0 && (
        <Group gap="xs" mb="md">
          {room.tags.slice(0, 3).map((tag) => (
            <Badge key={tag} variant="outline" size="sm" color="gray">
              {tag}
            </Badge>
          ))}
        </Group>
      )}

      <Group gap="xs" mb="lg">
        <Avatar.Group spacing="sm">
          {room.participants.slice(0, 4).map((p) => (
            <Avatar
              key={p.id}
              src={p.avatarUrl}
              alt={p.name}
              radius="xl"
              size="sm"
              style={{
                border: p.isSpeaking ? '2px solid var(--mantine-color-green-5)' : 'none',
              }}
            />
          ))}
          {room.participantCount > 4 && (
            <Avatar radius="xl" size="sm" color="gray">
              +{room.participantCount - 4}
            </Avatar>
          )}
        </Avatar.Group>
        <Text size="sm" c="dimmed">
          <IconUsers size={14} style={{ verticalAlign: 'middle', marginRight: 4 }} />
          {room.participantCount}/{room.maxParticipants}
        </Text>
      </Group>

      <Link href={`/rooms/${room.id}`} style={{ textDecoration: 'none' }}>
        <Button fullWidth leftSection={<IconMicrophone size={18} />}>
          Join Room
        </Button>
      </Link>
    </Card>
  );
}
