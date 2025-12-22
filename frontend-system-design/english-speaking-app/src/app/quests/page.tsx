'use client';

import { useEffect, useState, useCallback } from 'react';
import {
  Container,
  Title,
  Text,
  Paper,
  Group,
  SimpleGrid,
  Tabs,
  Button,
  Box,
  Badge,
  Loader,
  Center,
  Progress,
} from '@mantine/core';
import {
  IconArrowLeft,
  IconSun,
  IconCalendar,
  IconTrophy,
} from '@tabler/icons-react';
import Link from 'next/link';
import { QuestCard } from '@/features/xp-system';
import { PrivateRoute } from '@/features/auth';
import { useAuthStore } from '@/stores/authStore';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002';

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

export default function QuestsPage() {
  const { user } = useAuthStore();
  const [quests, setQuests] = useState<QuestData[]>([]);
  const [loading, setLoading] = useState(true);

  const userId = user?.id || 'demo-user';

  const fetchQuests = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/quests/user/${userId}`);
      if (res.ok) {
        const data = await res.json();
        setQuests(data);
      }
    } catch (err) {
      console.error('Failed to fetch quests:', err);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchQuests();
  }, [fetchQuests]);

  const dailyQuests = quests.filter((q) => q.type === 'daily');
  const weeklyQuests = quests.filter((q) => q.type === 'weekly');
  const achievements = quests.filter((q) => q.type === 'achievement');

  const dailyCompleted = dailyQuests.filter((q) => q.completed).length;
  const weeklyCompleted = weeklyQuests.filter((q) => q.completed).length;
  const achievementsCompleted = achievements.filter((q) => q.completed).length;

  const dailyXp = dailyQuests.reduce((acc, q) => acc + (q.completed ? q.xpReward : 0), 0);
  const weeklyXp = weeklyQuests.reduce((acc, q) => acc + (q.completed ? q.xpReward : 0), 0);

  if (loading) {
    return (
      <Center style={{ minHeight: '100vh' }}>
        <Loader size="lg" />
      </Center>
    );
  }

  return (
    <PrivateRoute>
      <Box style={{ minHeight: '100vh', background: '#f8f9fa' }}>
        <Container size="lg" py="xl">
          <Group mb="xl" justify="space-between">
            <Group>
              <Link href="/profile">
                <Button variant="subtle" leftSection={<IconArrowLeft size={16} />}>
                  Profile
                </Button>
              </Link>
              <Title order={2}>Nhiệm Vụ</Title>
            </Group>
          </Group>

          {/* Summary Cards */}
          <SimpleGrid cols={{ base: 1, sm: 3 }} mb="xl">
            <Paper p="md" radius="md" withBorder>
              <Group justify="space-between" mb="xs">
                <Group gap="xs">
                  <IconSun size={20} color="var(--mantine-color-blue-6)" />
                  <Text fw={600}>Hàng ngày</Text>
                </Group>
                <Badge color="blue">{dailyCompleted}/{dailyQuests.length}</Badge>
              </Group>
              <Progress
                value={(dailyCompleted / dailyQuests.length) * 100 || 0}
                size="sm"
                radius="xl"
                color="blue"
              />
              <Text size="xs" c="dimmed" mt="xs">
                +{dailyXp} XP hôm nay
              </Text>
            </Paper>

            <Paper p="md" radius="md" withBorder>
              <Group justify="space-between" mb="xs">
                <Group gap="xs">
                  <IconCalendar size={20} color="var(--mantine-color-violet-6)" />
                  <Text fw={600}>Hàng tuần</Text>
                </Group>
                <Badge color="violet">{weeklyCompleted}/{weeklyQuests.length}</Badge>
              </Group>
              <Progress
                value={(weeklyCompleted / weeklyQuests.length) * 100 || 0}
                size="sm"
                radius="xl"
                color="violet"
              />
              <Text size="xs" c="dimmed" mt="xs">
                +{weeklyXp} XP tuần này
              </Text>
            </Paper>

            <Paper p="md" radius="md" withBorder>
              <Group justify="space-between" mb="xs">
                <Group gap="xs">
                  <IconTrophy size={20} color="var(--mantine-color-yellow-6)" />
                  <Text fw={600}>Thành tựu</Text>
                </Group>
                <Badge color="yellow">{achievementsCompleted}/{achievements.length}</Badge>
              </Group>
              <Progress
                value={(achievementsCompleted / achievements.length) * 100 || 0}
                size="sm"
                radius="xl"
                color="yellow"
              />
              <Text size="xs" c="dimmed" mt="xs">
                Mãi mãi
              </Text>
            </Paper>
          </SimpleGrid>

          {/* Quests Tabs */}
          <Paper shadow="sm" radius="md" withBorder>
            <Tabs defaultValue="daily">
              <Tabs.List>
                <Tabs.Tab value="daily" leftSection={<IconSun size={14} />}>
                  Hàng ngày ({dailyQuests.length})
                </Tabs.Tab>
                <Tabs.Tab value="weekly" leftSection={<IconCalendar size={14} />}>
                  Hàng tuần ({weeklyQuests.length})
                </Tabs.Tab>
                <Tabs.Tab value="achievements" leftSection={<IconTrophy size={14} />}>
                  Thành tựu ({achievements.length})
                </Tabs.Tab>
              </Tabs.List>

              <Tabs.Panel value="daily" p="md">
                {dailyQuests.length === 0 ? (
                  <Text c="dimmed" ta="center" py="xl">
                    Không có nhiệm vụ hàng ngày
                  </Text>
                ) : (
                  <SimpleGrid cols={{ base: 1, sm: 2 }}>
                    {dailyQuests.map((quest) => (
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
                )}
              </Tabs.Panel>

              <Tabs.Panel value="weekly" p="md">
                {weeklyQuests.length === 0 ? (
                  <Text c="dimmed" ta="center" py="xl">
                    Không có nhiệm vụ hàng tuần
                  </Text>
                ) : (
                  <SimpleGrid cols={{ base: 1, sm: 2 }}>
                    {weeklyQuests.map((quest) => (
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
                )}
              </Tabs.Panel>

              <Tabs.Panel value="achievements" p="md">
                {achievements.length === 0 ? (
                  <Text c="dimmed" ta="center" py="xl">
                    Không có thành tựu
                  </Text>
                ) : (
                  <SimpleGrid cols={{ base: 1, sm: 2 }}>
                    {achievements.map((quest) => (
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
                )}
              </Tabs.Panel>
            </Tabs>
          </Paper>
        </Container>
      </Box>
    </PrivateRoute>
  );
}
