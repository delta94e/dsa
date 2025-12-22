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
  IconSchool,
  IconClock,
  IconAlertCircle,
  IconBook,
} from '@tabler/icons-react';
import Link from 'next/link';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002';

interface Classroom {
  id: string;
  name: string;
  subject: string;
  grade: string;
  school: string;
  teacherName?: string;
  studentCount: number;
  isActive: boolean;
}

export default function StudentDashboardPage() {
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // TODO: Get from auth
  const studentId = 'demo-student-id';

  useEffect(() => {
    const fetchClassrooms = async () => {
      try {
        const response = await fetch(`${API_URL}/classrooms/student/${studentId}`);
        if (!response.ok) throw new Error('Failed to fetch');
        const data = await response.json();
        setClassrooms(data);
      } catch (err) {
        setClassrooms([]);
      } finally {
        setLoading(false);
      }
    };

    fetchClassrooms();
  }, [studentId]);

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
            <Title order={2}>Student Dashboard</Title>
          </Group>
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
                <IconBook size={24} />
              </ThemeIcon>
              <div>
                <Text c="dimmed" size="sm">Môn học</Text>
                <Text size="xl" fw={700}>
                  {new Set(classrooms.map((c) => c.subject)).size}
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
              <Text c="dimmed">Bạn chưa tham gia lớp học nào</Text>
              <Text size="sm" c="dimmed">
                Liên hệ giáo viên để nhận link mời tham gia lớp
              </Text>
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
                <Text size="sm" mb="md">
                  🏫 {classroom.school}
                </Text>
                {classroom.teacherName && (
                  <Text size="sm" c="dimmed" mb="md">
                    👨‍🏫 {classroom.teacherName}
                  </Text>
                )}
                <Link href={`/classroom/${classroom.id}`}>
                  <Button variant="light" fullWidth>
                    Vào Lớp
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
