'use client';

import {
  Card,
  Group,
  Text,
  Progress,
  Badge,
  ThemeIcon,
  Box,
} from '@mantine/core';
import { IconCheck } from '@tabler/icons-react';

interface QuestCardProps {
  id: string;
  name: string;
  description: string;
  type: 'daily' | 'weekly' | 'achievement';
  xpReward: number;
  icon: string;
  progress: number;
  target: number;
  completed: boolean;
}

export function QuestCard({
  name,
  description,
  type,
  xpReward,
  icon,
  progress,
  target,
  completed,
}: QuestCardProps) {
  const percentage = Math.min((progress / target) * 100, 100);

  const typeColors: Record<string, string> = {
    daily: 'blue',
    weekly: 'violet',
    achievement: 'yellow',
  };

  const typeLabels: Record<string, string> = {
    daily: 'Hàng ngày',
    weekly: 'Hàng tuần',
    achievement: 'Thành tựu',
  };

  return (
    <Card
      shadow="sm"
      radius="md"
      withBorder
      style={{
        opacity: completed ? 0.7 : 1,
        background: completed
          ? 'linear-gradient(135deg, rgba(102,126,234,0.1) 0%, rgba(118,75,162,0.1) 100%)'
          : undefined,
      }}
    >
      <Group justify="space-between" mb="xs">
        <Group gap="sm">
          <Text size="xl">{icon}</Text>
          <div>
            <Text fw={600} size="sm">
              {name}
            </Text>
            <Text size="xs" c="dimmed">
              {description}
            </Text>
          </div>
        </Group>
        {completed ? (
          <ThemeIcon color="green" size="lg" radius="xl">
            <IconCheck size={18} />
          </ThemeIcon>
        ) : (
          <Badge color="violet" variant="light">
            +{xpReward} XP
          </Badge>
        )}
      </Group>

      <Group justify="space-between" mb={4}>
        <Badge size="xs" color={typeColors[type]} variant="outline">
          {typeLabels[type]}
        </Badge>
        <Text size="xs" c="dimmed">
          {progress}/{target}
        </Text>
      </Group>

      <Progress
        value={percentage}
        size="sm"
        radius="xl"
        color={completed ? 'green' : 'violet'}
        striped={!completed}
        animated={!completed && progress > 0}
      />
    </Card>
  );
}

export default QuestCard;
