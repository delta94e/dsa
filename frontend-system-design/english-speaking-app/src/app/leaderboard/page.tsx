'use client';

import { useEffect, useState, useCallback } from 'react';
import {
  Container,
  Title,
  Text,
  Paper,
  Group,
  Table,
  Avatar,
  Badge,
  Button,
  Box,
  Loader,
  Center,
  ThemeIcon,
} from '@mantine/core';
import {
  IconArrowLeft,
  IconTrophy,
  IconMedal,
  IconCrown,
} from '@tabler/icons-react';
import Link from 'next/link';
import { PrivateRoute } from '@/features/auth';
import { useAuthStore } from '@/stores/authStore';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002';

interface LeaderboardEntry {
  userId: string;
  name?: string;
  avatarUrl?: string;
  totalXp: number;
  level: number;
  levelName?: string;
  badge?: string;
}

const LEVEL_INFO: Record<number, { name: string; badge: string }> = {
  1: { name: 'Beginner', badge: '🌱' },
  2: { name: 'Newbie', badge: '🌿' },
  3: { name: 'Learner', badge: '🍀' },
  4: { name: 'Explorer', badge: '🔍' },
  5: { name: 'Seeker', badge: '🧭' },
  10: { name: 'Achiever', badge: '⭐' },
  15: { name: 'Speaker', badge: '🎤' },
  20: { name: 'Master', badge: '🏆' },
  25: { name: 'Titan', badge: '⚡' },
  30: { name: 'Ultimate Master', badge: '👼' },
};

function getLevelInfo(level: number) {
  const levels = Object.keys(LEVEL_INFO).map(Number).sort((a, b) => b - a);
  for (const l of levels) {
    if (level >= l) {
      return LEVEL_INFO[l];
    }
  }
  return LEVEL_INFO[1];
}

export default function LeaderboardPage() {
  const { user } = useAuthStore();
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLeaderboard = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/progress/leaderboard`);
      if (res.ok) {
        const data = await res.json();
        // Add level info to each entry
        const enriched = data.map((entry: LeaderboardEntry) => ({
          ...entry,
          ...getLevelInfo(entry.level),
        }));
        setLeaderboard(enriched);
      }
    } catch (err) {
      console.error('Failed to fetch leaderboard:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLeaderboard();
  }, [fetchLeaderboard]);

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <IconCrown size={24} color="gold" />;
      case 2:
        return <IconMedal size={24} color="silver" />;
      case 3:
        return <IconMedal size={24} color="#cd7f32" />;
      default:
        return <Text fw={700} c="dimmed">{rank}</Text>;
    }
  };

  const getRankBg = (rank: number) => {
    switch (rank) {
      case 1:
        return 'linear-gradient(135deg, rgba(255,215,0,0.15) 0%, rgba(255,215,0,0.05) 100%)';
      case 2:
        return 'linear-gradient(135deg, rgba(192,192,192,0.15) 0%, rgba(192,192,192,0.05) 100%)';
      case 3:
        return 'linear-gradient(135deg, rgba(205,127,50,0.15) 0%, rgba(205,127,50,0.05) 100%)';
      default:
        return undefined;
    }
  };

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
        <Container size="md" py="xl">
          <Group mb="xl" justify="space-between">
            <Group>
              <Link href="/profile">
                <Button variant="subtle" leftSection={<IconArrowLeft size={16} />}>
                  Profile
                </Button>
              </Link>
              <Group gap="xs">
                <IconTrophy size={28} color="var(--mantine-color-yellow-6)" />
                <Title order={2}>Bảng Xếp Hạng</Title>
              </Group>
            </Group>
          </Group>

          {/* Leaderboard Table */}
          <Paper shadow="md" radius="md" withBorder>
            <Table highlightOnHover>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th style={{ width: 60 }}>Hạng</Table.Th>
                  <Table.Th>Người dùng</Table.Th>
                  <Table.Th style={{ width: 100, textAlign: 'center' }}>Level</Table.Th>
                  <Table.Th style={{ width: 120, textAlign: 'right' }}>XP</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {leaderboard.length === 0 ? (
                  <Table.Tr>
                    <Table.Td colSpan={4}>
                      <Text c="dimmed" ta="center" py="xl">
                        Chưa có dữ liệu xếp hạng
                      </Text>
                    </Table.Td>
                  </Table.Tr>
                ) : (
                  leaderboard.map((entry, index) => {
                    const rank = index + 1;
                    const isCurrentUser = entry.userId === user?.id;

                    return (
                      <Table.Tr
                        key={entry.userId}
                        style={{
                          background: isCurrentUser
                            ? 'rgba(102, 126, 234, 0.1)'
                            : getRankBg(rank),
                        }}
                      >
                        <Table.Td>
                          <Center>{getRankIcon(rank)}</Center>
                        </Table.Td>
                        <Table.Td>
                          <Group gap="sm">
                            <Avatar
                              src={entry.avatarUrl}
                              size="md"
                              radius="xl"
                            />
                            <div>
                              <Text fw={isCurrentUser ? 700 : 500} size="sm">
                                {entry.name || `User ${entry.userId.slice(0, 6)}`}
                                {isCurrentUser && (
                                  <Badge ml="xs" size="xs" color="violet">
                                    Bạn
                                  </Badge>
                                )}
                              </Text>
                            </div>
                          </Group>
                        </Table.Td>
                        <Table.Td>
                          <Center>
                            <Group gap={4}>
                              <Text size="lg">{entry.badge}</Text>
                              <Badge color="violet" variant="light">
                                Lv.{entry.level}
                              </Badge>
                            </Group>
                          </Center>
                        </Table.Td>
                        <Table.Td>
                          <Text fw={600} ta="right">
                            {entry.totalXp.toLocaleString()} XP
                          </Text>
                        </Table.Td>
                      </Table.Tr>
                    );
                  })
                )}
              </Table.Tbody>
            </Table>
          </Paper>

          {/* Info */}
          <Paper p="md" radius="md" mt="xl" withBorder bg="violet.0">
            <Group gap="xs">
              <ThemeIcon color="violet" size="lg" radius="xl">
                <IconTrophy size={18} />
              </ThemeIcon>
              <div>
                <Text fw={600} size="sm">
                  Làm sao để leo hạng?
                </Text>
                <Text size="xs" c="dimmed">
                  Điểm danh hàng ngày, hoàn thành nhiệm vụ, và tham gia voice room để kiếm XP!
                </Text>
              </div>
            </Group>
          </Paper>
        </Container>
      </Box>
    </PrivateRoute>
  );
}
