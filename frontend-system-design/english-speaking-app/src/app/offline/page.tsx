'use client';

// ═══════════════════════════════════════════════════════════════
// Offline Lessons Page
// Manage downloaded lessons for offline access
// ═══════════════════════════════════════════════════════════════

import {
  Container,
  Title,
  Text,
  Stack,
  Group,
  Badge,
  Tabs,
  Loader,
  Center,
  Alert,
  SegmentedControl,
} from '@mantine/core';
import {
  IconDownload,
  IconCloudOff,
  IconBooks,
  IconAlertCircle,
} from '@tabler/icons-react';
import { useState } from 'react';
import { useOfflineStorage } from '@/shared/hooks/useOfflineStorage';
import { useOnlineStatus } from '@/shared/hooks/useOnlineStatus';
import { OfflineLessonCard } from '@/features/offline/OfflineLessonCard';
import { AI_TOPICS, LEVELS, type Level } from '@/types';
import styles from '@/features/offline/Offline.module.css';

export default function OfflineLessonsPage() {
  const {
    cachedLessons,
    isLoading,
    isDownloading,
    downloadProgress,
    error,
    downloadLesson,
    removeLesson,
    isLessonCached,
    storageUsed,
    lessonCount,
  } = useOfflineStorage();

  const { isOnline } = useOnlineStatus();
  const [selectedLevel, setSelectedLevel] = useState<Level>('A1');
  const [activeTab, setActiveTab] = useState<string | null>('browse');

  // Handle download
  const handleDownload = async (topicId: string) => {
    const topic = AI_TOPICS.find(t => t.id === topicId);
    if (topic) {
      await downloadLesson(topic, selectedLevel);
    }
  };

  // Handle remove
  const handleRemove = async (lessonId: string) => {
    await removeLesson(lessonId);
  };

  if (isLoading) {
    return (
      <Center h="50vh">
        <Stack align="center" gap="md">
          <Loader size="lg" color="violet" />
          <Text c="dimmed">Loading offline lessons...</Text>
        </Stack>
      </Center>
    );
  }

  return (
    <Container className={styles.container}>
      <Stack gap="xl">
        {/* Header */}
        <div className={styles.header}>
          <div>
            <Group gap="sm">
              <IconCloudOff size={28} stroke={1.5} />
              <Title order={2}>Offline Lessons</Title>
            </Group>
            <Text c="dimmed" size="sm" mt="xs">
              Download lessons to practice without internet
            </Text>
          </div>
          <div className={styles.storageInfo}>
            <Badge color="violet" variant="light" size="lg">
              {lessonCount} lessons
            </Badge>
            <Badge color="gray" variant="light" size="lg">
              {storageUsed}
            </Badge>
          </div>
        </div>

        {/* Offline Warning */}
        {!isOnline && (
          <Alert
            icon={<IconAlertCircle size={16} />}
            color="orange"
            title="You're offline"
          >
            You can only access downloaded lessons while offline.
          </Alert>
        )}

        {/* Error Alert */}
        {error && (
          <Alert
            icon={<IconAlertCircle size={16} />}
            color="red"
            title="Error"
            withCloseButton
          >
            {error}
          </Alert>
        )}

        {/* Tabs */}
        <Tabs value={activeTab} onChange={setActiveTab}>
          <Tabs.List>
            <Tabs.Tab value="browse" leftSection={<IconBooks size={16} />}>
              Browse Topics
            </Tabs.Tab>
            <Tabs.Tab
              value="downloaded"
              leftSection={<IconDownload size={16} />}
              rightSection={
                lessonCount > 0 && (
                  <Badge size="xs" color="violet" variant="filled">
                    {lessonCount}
                  </Badge>
                )
              }
            >
              Downloaded
            </Tabs.Tab>
          </Tabs.List>

          {/* Browse Topics Tab */}
          <Tabs.Panel value="browse" pt="md">
            <Stack gap="md">
              {/* Level Selector */}
              <SegmentedControl
                value={selectedLevel}
                onChange={(value) => setSelectedLevel(value as Level)}
                data={LEVELS.map(l => ({ value: l.code, label: `${l.code} - ${l.name}` }))}
                color="violet"
                fullWidth
              />

              {/* Topic Grid */}
              <div className={styles.lessonGrid}>
                {AI_TOPICS.map((topic) => (
                  <OfflineLessonCard
                    key={`${topic.id}-${selectedLevel}`}
                    topic={topic}
                    level={selectedLevel}
                    isCached={isLessonCached(topic.id, selectedLevel)}
                    isDownloading={isDownloading}
                    downloadProgress={downloadProgress}
                    onDownload={() => handleDownload(topic.id)}
                    onRemove={() => handleRemove(`${topic.id}-${selectedLevel}`)}
                  />
                ))}
              </div>
            </Stack>
          </Tabs.Panel>

          {/* Downloaded Tab */}
          <Tabs.Panel value="downloaded" pt="md">
            {cachedLessons.length === 0 ? (
              <div className={styles.emptyState}>
                <div className={styles.emptyIcon}>📥</div>
                <Title order={3} c="dimmed">
                  No lessons downloaded yet
                </Title>
                <Text c="dimmed" size="sm" mt="xs">
                  Browse topics and download lessons for offline access
                </Text>
              </div>
            ) : (
              <div className={styles.lessonGrid}>
                {cachedLessons.map((lesson) => (
                  <OfflineLessonCard
                    key={lesson.id}
                    topic={lesson.topic}
                    level={lesson.level}
                    isCached={true}
                    isDownloading={false}
                    downloadProgress={0}
                    sizeBytes={lesson.sizeBytes}
                    lastAccessedAt={lesson.lastAccessedAt}
                    onDownload={() => {}}
                    onRemove={() => handleRemove(lesson.id)}
                    onPlay={() => {
                      // TODO: Navigate to lesson practice page
                      console.log('Play lesson:', lesson.id);
                    }}
                  />
                ))}
              </div>
            )}
          </Tabs.Panel>
        </Tabs>
      </Stack>
    </Container>
  );
}
