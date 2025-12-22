'use client';

import { useEffect, useState } from 'react';
import {
  Container,
  Title,
  Text,
  Paper,
  Button,
  Group,
  Stack,
  SimpleGrid,
  Card,
  Badge,
  Loader,
  Center,
  Alert,
  Box,
  ThemeIcon,
} from '@mantine/core';
import {
  IconArrowLeft,
  IconPlus,
  IconUsers,
  IconSchool,
  IconClock,
  IconAlertCircle,
} from '@tabler/icons-react';
import Link from 'next/link';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002';

interface Classroom {
  id: string;
  name: string;
  subject: string;
  grade: string;
  school: string;
  inviteCode: string;
  inviteExpiry: string;
  maxStudents: number;
  studentCount: number;
  isActive: boolean;
  createdAt: string;
}

export default function TeacherDashboardPage() {
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // TODO: Get actual teacher ID from auth
  const teacherId = 'demo-teacher-id';

  useEffect(() => {
    const fetchClassrooms = async () => {
      try {
        const response = await fetch(`${API_URL}/classrooms/teacher/${teacherId}`);
        if (!response.ok) throw new Error('Failed to fetch');
        const data = await response.json();
        setClassrooms(data);
      } catch (err) {
        // Demo data when no classrooms exist
        setClassrooms([]);
      } finally {
        setLoading(false);
      }
    };

    fetchClassrooms();
  }, [teacherId]);

  const isExpired = (expiry: string) => new Date(expiry) < new Date();

  return (
    <Box style={{ minHeight: '100vh', background: '#f8f9fa' }}>
      <Container size="xl" py="xl">
        <Group mb="xl" justify="space-between">
          <Group>
            <Link href="/">
              <Button variant="subtle" leftSection={<IconArrowLeft size={16} />}>
                Trang Chủ
              </Button>
            </Link>
            <Title order={2}>Teacher Dashboard</Title>
          </Group>
          <Link href="/teacher/classrooms/new">
            <Button leftSection={<IconPlus size={16} />}>
              Tạo Lớp Học
            </Button>
          </Link>
        </Group>

        {error && (
          <Alert icon={<IconAlertCircle size={16} />} color="red" mb="md">
            {error}
          </Alert>
        )}

        {/* Stats */}
        <SimpleGrid cols={{ base: 1, sm: 3 }} mb="xl">
          <Paper p="md" radius="md" withBorder>
            <Group>
              <ThemeIcon size="xl" radius="md" color="blue">
                <IconSchool size={24} />
              </ThemeIcon>
              <div>
                <Text c="dimmed" size="sm">Lớp học</Text>
                <Text size="xl" fw={700}>{classrooms.length}</Text>
              </div>
            </Group>
          </Paper>
          <Paper p="md" radius="md" withBorder>
            <Group>
              <ThemeIcon size="xl" radius="md" color="green">
                <IconUsers size={24} />
              </ThemeIcon>
              <div>
                <Text c="dimmed" size="sm">Học sinh</Text>
                <Text size="xl" fw={700}>
                  {classrooms.reduce((acc, c) => acc + c.studentCount, 0)}
                </Text>
              </div>
            </Group>
          </Paper>
          <Paper p="md" radius="md" withBorder>
            <Group>
              <ThemeIcon size="xl" radius="md" color="orange">
                <IconClock size={24} />
              </ThemeIcon>
              <div>
                <Text c="dimmed" size="sm">Đang hoạt động</Text>
                <Text size="xl" fw={700}>
                  {classrooms.filter((c) => c.isActive).length}
                </Text>
              </div>
            </Group>
          </Paper>
        </SimpleGrid>

        {/* Classrooms */}
        <Title order={3} mb="md">Lớp Học Của Bạn</Title>

        {loading ? (
          <Center py={50}>
            <Loader size="lg" />
          </Center>
        ) : classrooms.length === 0 ? (
          <Paper p="xl" radius="md" ta="center" withBorder>
            <Stack align="center" gap="md">
              <ThemeIcon size={60} radius="xl" color="gray" variant="light">
                <IconSchool size={30} />
              </ThemeIcon>
              <Text c="dimmed">Bạn chưa tạo lớp học nào</Text>
              <Link href="/teacher/classrooms/new">
                <Button leftSection={<IconPlus size={16} />}>
                  Tạo Lớp Học Đầu Tiên
                </Button>
              </Link>
            </Stack>
          </Paper>
        ) : (
          <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }}>
            {classrooms.map((classroom) => (
              <Card key={classroom.id} shadow="sm" radius="md" withBorder>
                <Group justify="space-between" mb="xs">
                  <Text fw={600}>{classroom.name}</Text>
                  <Badge color={classroom.isActive ? 'green' : 'gray'}>
                    {classroom.isActive ? 'Hoạt động' : 'Đã đóng'}
                  </Badge>
                </Group>
                <Text size="sm" c="dimmed" mb="md">
                  {classroom.subject} • Khối {classroom.grade}
                </Text>
                <Group gap="xs" mb="md">
                  <Badge variant="light" leftSection={<IconUsers size={12} />}>
                    {classroom.studentCount}/{classroom.maxStudents} học sinh
                  </Badge>
                  {isExpired(classroom.inviteExpiry) && (
                    <Badge color="red" variant="light">
                      Link hết hạn
                    </Badge>
                  )}
                </Group>
                <Link href={`/teacher/classrooms/${classroom.id}`}>
                  <Button variant="light" fullWidth>
                    Quản lý
                  </Button>
                </Link>
              </Card>
            ))}
          </SimpleGrid>
        )}
      </Container>
    </Box>
  );
}
