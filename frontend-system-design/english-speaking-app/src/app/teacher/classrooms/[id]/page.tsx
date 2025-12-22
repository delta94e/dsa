'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import {
  Container,
  Title,
  Text,
  Paper,
  Table,
  Button,
  Group,
  Badge,
  Stack,
  Loader,
  Center,
  Alert,
  Box,
  ActionIcon,
  Tooltip,
  CopyButton,
  TextInput,
  Tabs,
  ThemeIcon,
  Card,
  SimpleGrid,
} from '@mantine/core';
import {
  IconArrowLeft,
  IconCheck,
  IconX,
  IconAlertCircle,
  IconRefresh,
  IconCopy,
  IconUsers,
  IconClock,
  IconLink,
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
  isActive: boolean;
}

interface Enrollment {
  id: string;
  classroomId: string;
  studentId: string;
  status: 'pending' | 'approved' | 'rejected';
  appliedAt: string;
  approvedAt?: string;
}

export default function ClassroomDetailPage() {
  const params = useParams();
  const classroomId = params.id as string;

  const [classroom, setClassroom] = useState<Classroom | null>(null);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // TODO: Get from auth
  const teacherId = 'demo-teacher-id';

  const fetchData = async () => {
    setLoading(true);
    try {
      const [classroomRes, enrollmentsRes] = await Promise.all([
        fetch(`${API_URL}/classrooms/${classroomId}`),
        fetch(`${API_URL}/classrooms/${classroomId}/enrollments`),
      ]);

      if (!classroomRes.ok) throw new Error('Classroom not found');

      const classroomData = await classroomRes.json();
      const enrollmentsData = await enrollmentsRes.json();

      setClassroom(classroomData);
      setEnrollments(enrollmentsData);
    } catch (err) {
      setError('Không thể tải thông tin lớp học');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [classroomId]);

  const approveStudent = async (studentId: string) => {
    setActionLoading(studentId);
    try {
      await fetch(`${API_URL}/classrooms/${classroomId}/approve-student/${studentId}`, {
        method: 'POST',
      });
      await fetchData();
    } catch (err) {
      setError('Không thể phê duyệt học sinh');
    } finally {
      setActionLoading(null);
    }
  };

  const rejectStudent = async (studentId: string) => {
    setActionLoading(studentId);
    try {
      await fetch(`${API_URL}/classrooms/${classroomId}/reject-student/${studentId}`, {
        method: 'POST',
      });
      await fetchData();
    } catch (err) {
      setError('Không thể từ chối học sinh');
    } finally {
      setActionLoading(null);
    }
  };

  const regenerateInvite = async () => {
    try {
      const response = await fetch(
        `${API_URL}/classrooms/${classroomId}/regenerate-invite?teacherId=${teacherId}`,
        { method: 'POST' }
      );
      if (!response.ok) throw new Error('Failed');
      await fetchData();
    } catch (err) {
      setError('Không thể tạo link mới');
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge color="yellow">Chờ duyệt</Badge>;
      case 'approved':
        return <Badge color="green">Đã duyệt</Badge>;
      case 'rejected':
        return <Badge color="red">Từ chối</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const inviteLink = classroom
    ? `http://localhost:3001/join/${classroom.inviteCode}`
    : '';

  const isExpired = classroom
    ? new Date(classroom.inviteExpiry) < new Date()
    : false;

  const pendingCount = enrollments.filter((e) => e.status === 'pending').length;
  const approvedCount = enrollments.filter((e) => e.status === 'approved').length;

  if (loading) {
    return (
      <Center style={{ minHeight: '100vh' }}>
        <Loader size="lg" />
      </Center>
    );
  }

  if (!classroom) {
    return (
      <Container size="md" py="xl">
        <Alert icon={<IconAlertCircle size={16} />} color="red">
          Không tìm thấy lớp học
        </Alert>
        <Link href="/teacher">
          <Button mt="md" variant="light" leftSection={<IconArrowLeft size={16} />}>
            Về Dashboard
          </Button>
        </Link>
      </Container>
    );
  }

  return (
    <Box style={{ minHeight: '100vh', background: '#f8f9fa' }}>
      <Container size="xl" py="xl">
        <Group mb="xl" justify="space-between">
          <Group>
            <Link href="/teacher">
              <Button variant="subtle" leftSection={<IconArrowLeft size={16} />}>
                Dashboard
              </Button>
            </Link>
            <div>
              <Title order={2}>{classroom.name}</Title>
              <Text c="dimmed" size="sm">
                {classroom.subject} • Khối {classroom.grade} • {classroom.school}
              </Text>
            </div>
          </Group>
          <Button
            leftSection={<IconRefresh size={16} />}
            variant="light"
            onClick={fetchData}
          >
            Làm mới
          </Button>
        </Group>

        {error && (
          <Alert
            icon={<IconAlertCircle size={16} />}
            color="red"
            mb="md"
            withCloseButton
            onClose={() => setError(null)}
          >
            {error}
          </Alert>
        )}

        {/* Stats */}
        <SimpleGrid cols={{ base: 1, sm: 3 }} mb="xl">
          <Card shadow="sm" radius="md" withBorder>
            <Group>
              <ThemeIcon size="xl" radius="md" color="blue">
                <IconUsers size={24} />
              </ThemeIcon>
              <div>
                <Text c="dimmed" size="sm">Học sinh</Text>
                <Text size="xl" fw={700}>
                  {approvedCount}/{classroom.maxStudents}
                </Text>
              </div>
            </Group>
          </Card>
          <Card shadow="sm" radius="md" withBorder>
            <Group>
              <ThemeIcon size="xl" radius="md" color="yellow">
                <IconClock size={24} />
              </ThemeIcon>
              <div>
                <Text c="dimmed" size="sm">Chờ duyệt</Text>
                <Text size="xl" fw={700}>{pendingCount}</Text>
              </div>
            </Group>
          </Card>
          <Card shadow="sm" radius="md" withBorder>
            <Group>
              <ThemeIcon size="xl" radius="md" color={isExpired ? 'red' : 'green'}>
                <IconLink size={24} />
              </ThemeIcon>
              <div>
                <Text c="dimmed" size="sm">Link mời</Text>
                <Text size="xl" fw={700}>
                  {isExpired ? 'Hết hạn' : 'Còn hạn'}
                </Text>
              </div>
            </Group>
          </Card>
        </SimpleGrid>

        {/* Invite Link */}
        <Paper shadow="sm" p="md" radius="md" mb="xl" withBorder>
          <Text fw={600} mb="sm">Link mời học sinh</Text>
          <Group>
            <TextInput
              value={inviteLink}
              readOnly
              style={{ flex: 1 }}
              rightSection={
                <CopyButton value={inviteLink}>
                  {({ copied, copy }) => (
                    <Tooltip label={copied ? 'Đã sao chép!' : 'Sao chép'}>
                      <ActionIcon color={copied ? 'green' : 'gray'} onClick={copy}>
                        {copied ? <IconCheck size={16} /> : <IconCopy size={16} />}
                      </ActionIcon>
                    </Tooltip>
                  )}
                </CopyButton>
              }
            />
            <Button
              variant="light"
              leftSection={<IconRefresh size={16} />}
              onClick={regenerateInvite}
            >
              Tạo link mới
            </Button>
          </Group>
          <Text size="xs" c={isExpired ? 'red' : 'dimmed'} mt="xs">
            {isExpired
              ? '⚠️ Link đã hết hạn. Tạo link mới để tiếp tục mời học sinh.'
              : `Hết hạn: ${new Date(classroom.inviteExpiry).toLocaleDateString('vi-VN')}`}
          </Text>
        </Paper>

        {/* Enrollments */}
        <Paper shadow="sm" radius="md" withBorder>
          <Tabs defaultValue="pending">
            <Tabs.List>
              <Tabs.Tab value="pending" leftSection={<IconClock size={14} />}>
                Chờ duyệt ({pendingCount})
              </Tabs.Tab>
              <Tabs.Tab value="approved" leftSection={<IconCheck size={14} />}>
                Đã duyệt ({approvedCount})
              </Tabs.Tab>
              <Tabs.Tab value="all" leftSection={<IconUsers size={14} />}>
                Tất cả ({enrollments.length})
              </Tabs.Tab>
            </Tabs.List>

            <Tabs.Panel value="pending" p="md">
              {enrollments.filter((e) => e.status === 'pending').length === 0 ? (
                <Text c="dimmed" ta="center" py="xl">
                  Không có học sinh nào đang chờ duyệt
                </Text>
              ) : (
                <Table>
                  <Table.Thead>
                    <Table.Tr>
                      <Table.Th>ID Học sinh</Table.Th>
                      <Table.Th>Ngày đăng ký</Table.Th>
                      <Table.Th>Trạng thái</Table.Th>
                      <Table.Th>Hành động</Table.Th>
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>
                    {enrollments
                      .filter((e) => e.status === 'pending')
                      .map((e) => (
                        <Table.Tr key={e.id}>
                          <Table.Td>{e.studentId.slice(0, 8)}...</Table.Td>
                          <Table.Td>
                            {new Date(e.appliedAt).toLocaleDateString('vi-VN')}
                          </Table.Td>
                          <Table.Td>{getStatusBadge(e.status)}</Table.Td>
                          <Table.Td>
                            <Group gap="xs">
                              <Tooltip label="Phê duyệt">
                                <ActionIcon
                                  color="green"
                                  variant="filled"
                                  loading={actionLoading === e.studentId}
                                  onClick={() => approveStudent(e.studentId)}
                                >
                                  <IconCheck size={16} />
                                </ActionIcon>
                              </Tooltip>
                              <Tooltip label="Từ chối">
                                <ActionIcon
                                  color="red"
                                  variant="filled"
                                  loading={actionLoading === e.studentId}
                                  onClick={() => rejectStudent(e.studentId)}
                                >
                                  <IconX size={16} />
                                </ActionIcon>
                              </Tooltip>
                            </Group>
                          </Table.Td>
                        </Table.Tr>
                      ))}
                  </Table.Tbody>
                </Table>
              )}
            </Tabs.Panel>

            <Tabs.Panel value="approved" p="md">
              {enrollments.filter((e) => e.status === 'approved').length === 0 ? (
                <Text c="dimmed" ta="center" py="xl">
                  Chưa có học sinh nào được duyệt
                </Text>
              ) : (
                <Table>
                  <Table.Thead>
                    <Table.Tr>
                      <Table.Th>ID Học sinh</Table.Th>
                      <Table.Th>Ngày duyệt</Table.Th>
                      <Table.Th>Trạng thái</Table.Th>
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>
                    {enrollments
                      .filter((e) => e.status === 'approved')
                      .map((e) => (
                        <Table.Tr key={e.id}>
                          <Table.Td>{e.studentId.slice(0, 8)}...</Table.Td>
                          <Table.Td>
                            {e.approvedAt
                              ? new Date(e.approvedAt).toLocaleDateString('vi-VN')
                              : '-'}
                          </Table.Td>
                          <Table.Td>{getStatusBadge(e.status)}</Table.Td>
                        </Table.Tr>
                      ))}
                  </Table.Tbody>
                </Table>
              )}
            </Tabs.Panel>

            <Tabs.Panel value="all" p="md">
              {enrollments.length === 0 ? (
                <Text c="dimmed" ta="center" py="xl">
                  Chưa có học sinh nào đăng ký
                </Text>
              ) : (
                <Table>
                  <Table.Thead>
                    <Table.Tr>
                      <Table.Th>ID Học sinh</Table.Th>
                      <Table.Th>Ngày đăng ký</Table.Th>
                      <Table.Th>Trạng thái</Table.Th>
                      <Table.Th>Hành động</Table.Th>
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>
                    {enrollments.map((e) => (
                      <Table.Tr key={e.id}>
                        <Table.Td>{e.studentId.slice(0, 8)}...</Table.Td>
                        <Table.Td>
                          {new Date(e.appliedAt).toLocaleDateString('vi-VN')}
                        </Table.Td>
                        <Table.Td>{getStatusBadge(e.status)}</Table.Td>
                        <Table.Td>
                          {e.status === 'pending' && (
                            <Group gap="xs">
                              <Tooltip label="Phê duyệt">
                                <ActionIcon
                                  color="green"
                                  variant="filled"
                                  loading={actionLoading === e.studentId}
                                  onClick={() => approveStudent(e.studentId)}
                                >
                                  <IconCheck size={16} />
                                </ActionIcon>
                              </Tooltip>
                              <Tooltip label="Từ chối">
                                <ActionIcon
                                  color="red"
                                  variant="filled"
                                  loading={actionLoading === e.studentId}
                                  onClick={() => rejectStudent(e.studentId)}
                                >
                                  <IconX size={16} />
                                </ActionIcon>
                              </Tooltip>
                            </Group>
                          )}
                        </Table.Td>
                      </Table.Tr>
                    ))}
                  </Table.Tbody>
                </Table>
              )}
            </Tabs.Panel>
          </Tabs>
        </Paper>
      </Container>
    </Box>
  );
}
