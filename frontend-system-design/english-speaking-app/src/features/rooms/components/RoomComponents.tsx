'use client';

import { Badge, Group, Paper, Text, Title, Button, SimpleGrid } from '@mantine/core';
import { IconArrowLeft, IconWifi, IconWifiOff } from '@tabler/icons-react';
import Link from 'next/link';
import { LEVEL_COLORS, Level, RoomParticipant } from '@/types';
import { ParticipantCard } from './ParticipantCard';

// ═══════════════════════════════════════════════════════════════
// Connection Status Badge
// ═══════════════════════════════════════════════════════════════
interface ConnectionStatusProps {
  isConnected: boolean;
}

export function ConnectionStatus({ isConnected }: ConnectionStatusProps) {
  return (
    <Badge
      color={isConnected ? 'green' : 'red'}
      variant="light"
      leftSection={isConnected ? <IconWifi size={12} /> : <IconWifiOff size={12} />}
    >
      {isConnected ? 'Connected' : 'Connecting...'}
    </Badge>
  );
}

// ═══════════════════════════════════════════════════════════════
// Room Header Component
// ═══════════════════════════════════════════════════════════════
interface RoomHeaderProps {
  name: string;
  topic: string;
  level: Level;
  participantCount: number;
  maxParticipants: number;
  isConnected: boolean;
  backHref?: string;
}

export function RoomHeader({
  name,
  topic,
  level,
  participantCount,
  maxParticipants,
  isConnected,
  backHref = '/rooms',
}: RoomHeaderProps) {
  return (
    <Paper shadow="sm" p="lg" mb="lg" radius="lg">
      <Group justify="space-between">
        <div>
          <Group gap="sm" mb="xs">
            <Link href={backHref}>
              <Button variant="subtle" size="sm" leftSection={<IconArrowLeft size={14} />}>
                Back
              </Button>
            </Link>
            <ConnectionStatus isConnected={isConnected} />
          </Group>
          <Title order={2}>{name}</Title>
          <Text c="dimmed" mt="xs">{topic}</Text>
        </div>
        <div style={{ textAlign: 'right' }}>
          <Badge size="xl" color={LEVEL_COLORS[level]} mb="xs">
            {level}
          </Badge>
          <Text size="sm" c="dimmed">
            {participantCount}/{maxParticipants} participants
          </Text>
        </div>
      </Group>
    </Paper>
  );
}

// ═══════════════════════════════════════════════════════════════
// Current User Info Component
// ═══════════════════════════════════════════════════════════════
interface CurrentUserInfoProps {
  name: string;
  countryFlag: string;
  isMuted: boolean;
  isSpeaking: boolean;
  streamCount: number;
}

export function CurrentUserInfo({
  name,
  countryFlag,
  isMuted,
  isSpeaking,
  streamCount,
}: CurrentUserInfoProps) {
  return (
    <Paper shadow="sm" p="md" mb="lg" radius="lg" bg="blue.0">
      <Group>
        <Text size="sm">
          You: <strong>{countryFlag} {name}</strong>
        </Text>
        <Badge color={isMuted ? 'red' : 'green'} variant="light">
          {isMuted ? '🔇 Muted' : '🔊 Unmuted'}
        </Badge>
        {isSpeaking && (
          <Badge color="green" variant="filled" size="sm">
            🎤 Speaking
          </Badge>
        )}
        <Badge color="blue" variant="outline" size="sm">
          {streamCount} audio streams
        </Badge>
      </Group>
    </Paper>
  );
}

// ═══════════════════════════════════════════════════════════════
// Participants Grid Component
// ═══════════════════════════════════════════════════════════════
interface ParticipantsGridProps {
  participants: RoomParticipant[];
  hostId: string;
}

export function ParticipantsGrid({ participants, hostId }: ParticipantsGridProps) {
  return (
    <Paper shadow="sm" p="xl" radius="lg" mb="lg">
      <Title order={4} mb="lg">
        Participants ({participants.length})
      </Title>
      {participants.length === 0 ? (
        <Text c="dimmed" ta="center" py="xl">
          No participants yet. You&apos;re the first one!
        </Text>
      ) : (
        <SimpleGrid cols={{ base: 3, sm: 4, md: 6 }} spacing="xl">
          {participants.map((participant) => (
            <ParticipantCard
              key={participant.id}
              participant={participant}
              isHost={participant.id === hostId}
            />
          ))}
        </SimpleGrid>
      )}
    </Paper>
  );
}
