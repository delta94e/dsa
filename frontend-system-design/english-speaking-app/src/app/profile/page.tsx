'use client';

import { useEffect, useState, useCallback } from 'react';
import {
  Container,
  Title,
  Text,
  Paper,
  Group,
  Stack,
  SimpleGrid,
  Avatar,
  Badge,
  Button,
  Box,
  Card,
  Loader,
  Center,
  ThemeIcon,
} from '@mantine/core';
import {
  IconArrowLeft,
  IconCalendarCheck,
  IconTrophy,
  IconFlame,
  IconTarget,
} from '@tabler/icons-react';
import Link from 'next/link';
import { XpBar, CheckInModal, LevelUpModal, QuestCard } from '@/features/xp-system';
import { PrivateRoute } from '@/features/auth';
import { useAuthStore } from '@/stores/authStore';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002';

interface UserProgressData {
  userId: string;
  level: number;
  currentXp: number;
  totalXp: number;
  streak: number;
  lastCheckIn?: string;
  levelInfo?: { name: string; badge: string };
  nextLevelInfo?: { xpRequired: number; totalXp: number };
  xpToNextLevel: number;
}

interface QuestData {
  id: string;
  name: string;
  description: string;
  type: 'daily' | 'weekly' | 'achievement';
  xpReward: number;
  icon: string;
  condition: { type: string; target: number };
  progress: number;
  completed: boolean;
}

export default function ProfilePage() {
  const { user } = useAuthStore();
  const [progress, setProgress] = useState<UserProgressData | null>(null);
  const [quests, setQuests] = useState<QuestData[]>([]);
  const [loading, setLoading] = useState(true);
  const [checkInOpen, setCheckInOpen] = useState(false);
  const [levelUpModal, setLevelUpModal] = useState<{
    show: boolean;
    level: number;
    name: string;
    badge: string;
  } | null>(null);

  const userId = user?.id || 'demo-user';

  const fetchData = useCallback(async () => {
    try {
      const [progressRes, questsRes] = await Promise.all([
        fetch(`${API_URL}/progress/${userId}`),
        fetch(`${API_URL}/quests/user/${userId}`),
      ]);

      if (progressRes.ok) {
        const progressData = await progressRes.json();
        setProgress(progressData);
      }

      if (questsRes.ok) {
        const questsData = await questsRes.json();
        setQuests(questsData);
      }
    } catch (err) {
      console.error('Failed to fetch data:', err);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleCheckIn = async () => {
    const res = await fetch(`${API_URL}/progress/${userId}/check-in`, {
      method: 'POST',
    });
    const data = await res.json();

    if (data.success) {
      await fetchData();
      return {
        success: true,
        xpGained: data.xpGained,
        streak: data.streak,
      };
    }
    return { success: false, xpGained: 0, streak: 0, error: data.message };
  };

  if (loading) {
    return (
      <Center style={{ minHeight: '100vh' }}>
        <Loader size="lg" />
      </Center>
    );
  }

  const completedQuests = quests.filter((q) => q.completed).length;
  const dailyQuests = quests.filter((q) => q.type === 'daily');
  const weeklyQuests = quests.filter((q) => q.type === 'weekly');
  const achievements = quests.filter((q) => q.type === 'achievement');

  return (
    <PrivateRoute>
      <Box style={{ minHeight: '100vh', background: '#f8f9fa' }}>
        <Container size="lg" py="xl">
          <Group mb="xl">
            <Link href="/">
              <Button variant="subtle" leftSection={<IconArrowLeft size={16} />}>
                Trang Chủ
              </Button>
            </Link>
          </Group>

          {/* Profile Header */}
          <Paper
            shadow="md"
            p="xl"
            radius="lg"
            mb="xl"
            style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            }}
          >
            <Group justify="space-between" align="flex-start">
              <Group>
                <Avatar
                  src={user?.avatarUrl}
                  size={80}
                  radius="xl"
                  style={{ border: '3px solid white' }}
                />
                <div>
                  <Text c="white" size="xl" fw={700}>
                    {user?.name || 'User'}
                  </Text>
                  <Group gap="xs" mt={4}>
                    <Text size="2xl">{progress?.levelInfo?.badge || '🌱'}</Text>
                    <Badge color="white" variant="light" size="lg">
                      Lv.{progress?.level || 1} {progress?.levelInfo?.name || 'Beginner'}
                    </Badge>
                  </Group>
                </div>
              </Group>
              <Button
                variant="white"
                color="violet"
                leftSection={<IconCalendarCheck size={18} />}
                onClick={() => setCheckInOpen(true)}
              >
                Điểm danh
              </Button>
            </Group>

            <Box mt="xl">
              {progress && (
                <XpBar
                  currentXp={progress.currentXp}
                  xpToNextLevel={progress.nextLevelInfo?.xpRequired || 0}
                  level={progress.level}
                  levelName={progress.levelInfo?.name || 'Beginner'}
                  badge={progress.levelInfo?.badge || '🌱'}
                  showLabel={false}
                />
              )}
              <Group justify="space-between" mt="xs">
                <Text c="white" size="sm" opacity={0.9}>
                  {progress?.currentXp?.toLocaleString() || 0} / {progress?.nextLevelInfo?.xpRequired?.toLocaleString() || 0} XP
                </Text>
                <Text c="white" size="sm" opacity={0.9}>
                  Tổng: {progress?.totalXp?.toLocaleString() || 0} XP
                </Text>
              </Group>
            </Box>
          </Paper>

          {/* Stats */}
          <SimpleGrid cols={{ base: 2, sm: 4 }} mb="xl">
            <Card shadow="sm" radius="md" withBorder>
              <Group>
                <ThemeIcon size="xl" radius="md" color="orange">
                  <IconFlame size={24} />
                </ThemeIcon>
                <div>
                  <Text size="xs" c="dimmed">Streak</Text>
                  <Text size="xl" fw={700}>{progress?.streak || 0} ngày</Text>
                </div>
              </Group>
            </Card>
            <Card shadow="sm" radius="md" withBorder>
              <Group>
                <ThemeIcon size="xl" radius="md" color="violet">
                  <IconTrophy size={24} />
                </ThemeIcon>
                <div>
                  <Text size="xs" c="dimmed">Level</Text>
                  <Text size="xl" fw={700}>{progress?.level || 1}</Text>
                </div>
              </Group>
            </Card>
            <Card shadow="sm" radius="md" withBorder>
              <Group>
                <ThemeIcon size="xl" radius="md" color="green">
                  <IconTarget size={24} />
                </ThemeIcon>
                <div>
                  <Text size="xs" c="dimmed">Quests</Text>
                  <Text size="xl" fw={700}>{completedQuests}/{quests.length}</Text>
                </div>
              </Group>
            </Card>
            <Card shadow="sm" radius="md" withBorder>
              <Group>
                <ThemeIcon size="xl" radius="md" color="blue">
                  <IconCalendarCheck size={24} />
                </ThemeIcon>
                <div>
                  <Text size="xs" c="dimmed">Total XP</Text>
                  <Text size="xl" fw={700}>{(progress?.totalXp || 0).toLocaleString()}</Text>
                </div>
              </Group>
            </Card>
          </SimpleGrid>

          {/* Quests Preview */}
          <Group justify="space-between" mb="md">
            <Title order={3}>Nhiệm vụ hôm nay</Title>
            <Link href="/quests">
              <Button variant="light">Xem tất cả</Button>
            </Link>
          </Group>

          <SimpleGrid cols={{ base: 1, sm: 2 }}>
            {dailyQuests.slice(0, 4).map((quest) => (
              <QuestCard
                key={quest.id}
                id={quest.id}
                name={quest.name}
                description={quest.description}
                type={quest.type}
                xpReward={quest.xpReward}
                icon={quest.icon}
                progress={quest.progress}
                target={quest.condition.target}
                completed={quest.completed}
              />
            ))}
          </SimpleGrid>

          {/* Modals */}
          <CheckInModal
            opened={checkInOpen}
            onClose={() => setCheckInOpen(false)}
            onCheckIn={handleCheckIn}
            currentStreak={progress?.streak || 0}
            lastCheckIn={progress?.lastCheckIn ? new Date(progress.lastCheckIn) : undefined}
          />

          {levelUpModal && (
            <LevelUpModal
              opened={levelUpModal.show}
              onClose={() => setLevelUpModal(null)}
              newLevel={levelUpModal.level}
              levelName={levelUpModal.name}
              badge={levelUpModal.badge}
            />
          )}
        </Container>
      </Box>
    </PrivateRoute>
  );
}
