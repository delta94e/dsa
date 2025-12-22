'use client';

import { Box, Progress, Group, Text, Tooltip, ThemeIcon } from '@mantine/core';

interface XpBarProps {
  currentXp: number;
  xpToNextLevel: number;
  level: number;
  levelName: string;
  badge: string;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function XpBar({
  currentXp,
  xpToNextLevel,
  level,
  levelName,
  badge,
  showLabel = true,
  size = 'md',
}: XpBarProps) {
  const percentage = xpToNextLevel > 0 ? (currentXp / xpToNextLevel) * 100 : 100;
  const progressSize = size === 'sm' ? 8 : size === 'md' ? 12 : 16;

  return (
    <Box>
      {showLabel && (
        <Group justify="space-between" mb={4}>
          <Group gap="xs">
            <Text size="lg">{badge}</Text>
            <Text fw={600} size="sm">
              Lv.{level} {levelName}
            </Text>
          </Group>
          <Text size="xs" c="dimmed">
            {currentXp.toLocaleString()} / {xpToNextLevel.toLocaleString()} XP
          </Text>
        </Group>
      )}
      <Tooltip
        label={`${currentXp.toLocaleString()} / ${xpToNextLevel.toLocaleString()} XP (${percentage.toFixed(1)}%)`}
        position="top"
      >
        <Progress
          value={percentage}
          size={progressSize}
          radius="xl"
          color="violet"
          striped
          animated={percentage > 0}
          style={{
            background: 'linear-gradient(90deg, rgba(102,126,234,0.2) 0%, rgba(118,75,162,0.2) 100%)',
          }}
        />
      </Tooltip>
    </Box>
  );
}

export default XpBar;
