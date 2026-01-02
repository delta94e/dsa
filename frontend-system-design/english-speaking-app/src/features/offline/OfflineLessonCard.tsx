'use client';

// ═══════════════════════════════════════════════════════════════
// Offline Lesson Card Component
// Displays a lesson with download/cached status
// ═══════════════════════════════════════════════════════════════

import {
  Card,
  Group,
  Text,
  Badge,
  Button,
  Progress,
  ActionIcon,
  Tooltip,
} from '@mantine/core';
import {
  IconDownload,
  IconCheck,
  IconTrash,
  IconPlayerPlay,
} from '@tabler/icons-react';
import type { AITopic, Level } from '@/types';
import { LEVEL_COLORS } from '@/types';
import styles from './Offline.module.css';

interface OfflineLessonCardProps {
  topic: AITopic;
  level: Level;
  isCached: boolean;
  isDownloading: boolean;
  downloadProgress: number;
  sizeBytes?: number;
  lastAccessedAt?: Date;
  onDownload: () => void;
  onRemove: () => void;
  onPlay?: () => void;
}

export function OfflineLessonCard({
  topic,
  level,
  isCached,
  isDownloading,
  downloadProgress,
  sizeBytes,
  lastAccessedAt,
  onDownload,
  onRemove,
  onPlay,
}: OfflineLessonCardProps) {
  const formatSize = (bytes?: number) => {
    if (!bytes) return '';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const formatDate = (date?: Date) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString();
  };

  return (
    <Card className={styles.lessonCard} withBorder p="md">
      <Group justify="space-between" align="flex-start">
        <div style={{ flex: 1 }}>
          <Group className={styles.lessonHeader}>
            <span className={styles.lessonIcon}>{topic.icon}</span>
            <div>
              <Text fw={600} size="lg">
                {topic.name}
              </Text>
              <Text size="sm" c="dimmed">
                {topic.description}
              </Text>
            </div>
          </Group>

          <Group className={styles.lessonMeta} mt="xs">
            <Badge color={LEVEL_COLORS[level]} variant="light">
              {level}
            </Badge>
            {isCached && (
              <Badge
                color="green"
                variant="filled"
                leftSection={<IconCheck size={12} />}
              >
                Available Offline
              </Badge>
            )}
            {sizeBytes && (
              <Badge color="gray" variant="light">
                {formatSize(sizeBytes)}
              </Badge>
            )}
          </Group>

          {lastAccessedAt && (
            <Text size="xs" c="dimmed" mt="xs">
              Last accessed: {formatDate(lastAccessedAt)}
            </Text>
          )}

          {isDownloading && (
            <Progress
              value={downloadProgress}
              color="violet"
              size="sm"
              radius="xl"
              className={styles.progressBar}
              animated
            />
          )}
        </div>

        <Group gap="xs">
          {isCached ? (
            <>
              {onPlay && (
                <Button
                  variant="filled"
                  color="violet"
                  leftSection={<IconPlayerPlay size={16} />}
                  onClick={onPlay}
                >
                  Practice
                </Button>
              )}
              <Tooltip label="Remove from offline">
                <ActionIcon
                  variant="light"
                  color="red"
                  size="lg"
                  onClick={onRemove}
                >
                  <IconTrash size={18} />
                </ActionIcon>
              </Tooltip>
            </>
          ) : (
            <Button
              variant="light"
              color="violet"
              leftSection={<IconDownload size={16} />}
              onClick={onDownload}
              loading={isDownloading}
              disabled={isDownloading}
              className={styles.downloadButton}
            >
              {isDownloading ? 'Downloading...' : 'Download'}
            </Button>
          )}
        </Group>
      </Group>
    </Card>
  );
}
