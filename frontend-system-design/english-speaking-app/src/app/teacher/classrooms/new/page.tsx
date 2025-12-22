'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Container,
  Title,
  Text,
  Paper,
  TextInput,
  NumberInput,
  Select,
  Button,
  Group,
  Stack,
  Alert,
  Box,
  CopyButton,
  ActionIcon,
  Tooltip,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconArrowLeft, IconPlus, IconAlertCircle, IconCopy, IconCheck } from '@tabler/icons-react';
import Link from 'next/link';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002';

const SUBJECTS = [
  { value: 'english', label: 'Tiếng Anh' },
  { value: 'math', label: 'Toán' },
  { value: 'physics', label: 'Vật Lý' },
  { value: 'chemistry', label: 'Hóa Học' },
  { value: 'biology', label: 'Sinh Học' },
];

const GRADES = [
  { value: '6', label: 'Khối 6' },
  { value: '7', label: 'Khối 7' },
  { value: '8', label: 'Khối 8' },
  { value: '9', label: 'Khối 9' },
  { value: '10', label: 'Khối 10' },
  { value: '11', label: 'Khối 11' },
  { value: '12', label: 'Khối 12' },
];

interface FormValues {
  name: string;
  subject: string;
  grade: string;
  school: string;
  maxStudents: number;
}

interface CreatedClassroom {
  classroom: {
    id: string;
    name: string;
    inviteCode: string;
    inviteExpiry: string;
  };
  inviteLink: string;
}

export default function CreateClassroomPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [created, setCreated] = useState<CreatedClassroom | null>(null);

  // TODO: Get from auth
  const teacherId = 'demo-teacher-id';

  const form = useForm<FormValues>({
    initialValues: {
      name: '',
      subject: '',
      grade: '',
      school: '',
      maxStudents: 50,
    },
    validate: {
      name: (value) => (value.length < 3 ? 'Tên lớp phải có ít nhất 3 ký tự' : null),
      subject: (value) => (!value ? 'Chọn môn học' : null),
      grade: (value) => (!value ? 'Chọn khối' : null),
      school: (value) => (value.length < 3 ? 'Tên trường phải có ít nhất 3 ký tự' : null),
    },
  });

  const handleSubmit = async (values: FormValues) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_URL}/classrooms?teacherId=${teacherId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });

      if (!response.ok) throw new Error('Failed to create');

      const data = await response.json();
      setCreated(data);
    } catch (err) {
      setError('Tạo lớp học thất bại. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  if (created) {
    return (
      <Box style={{ minHeight: '100vh', background: '#f8f9fa' }}>
        <Container size="sm" py="xl">
          <Paper shadow="sm" p="xl" radius="lg" mt={50}>
            <Stack align="center" gap="md">
              <Box
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <IconCheck size={40} color="white" />
              </Box>
              <Title order={2} ta="center">
                Lớp Học Đã Được Tạo!
              </Title>
              <Text c="dimmed" ta="center">
                {created.classroom.name}
              </Text>

              <Paper p="md" radius="md" bg="gray.0" w="100%">
                <Text size="sm" c="dimmed" mb="xs">
                  Link mời học sinh:
                </Text>
                <Group gap="xs">
                  <TextInput
                    value={created.inviteLink}
                    readOnly
                    style={{ flex: 1 }}
                  />
                  <CopyButton value={created.inviteLink}>
                    {({ copied, copy }) => (
                      <Tooltip label={copied ? 'Đã sao chép!' : 'Sao chép'}>
                        <ActionIcon
                          color={copied ? 'green' : 'blue'}
                          onClick={copy}
                          size="lg"
                        >
                          {copied ? <IconCheck size={16} /> : <IconCopy size={16} />}
                        </ActionIcon>
                      </Tooltip>
                    )}
                  </CopyButton>
                </Group>
                <Text size="xs" c="dimmed" mt="xs">
                  Link hết hạn sau 7 ngày
                </Text>
              </Paper>

              <Group>
                <Link href="/teacher">
                  <Button variant="light">
                    Về Dashboard
                  </Button>
                </Link>
                <Link href={`/teacher/classrooms/${created.classroom.id}`}>
                  <Button>
                    Quản Lý Lớp
                  </Button>
                </Link>
              </Group>
            </Stack>
          </Paper>
        </Container>
      </Box>
    );
  }

  return (
    <Box style={{ minHeight: '100vh', background: '#f8f9fa' }}>
      <Container size="sm" py="xl">
        <Group mb="xl">
          <Link href="/teacher">
            <Button variant="subtle" leftSection={<IconArrowLeft size={16} />}>
              Dashboard
            </Button>
          </Link>
        </Group>

        <Paper shadow="sm" p="xl" radius="lg">
          <Title order={2} mb="xs">
            Tạo Lớp Học Mới
          </Title>
          <Text c="dimmed" mb="xl">
            Tạo lớp học và nhận link mời học sinh
          </Text>

          {error && (
            <Alert icon={<IconAlertCircle size={16} />} color="red" mb="md">
              {error}
            </Alert>
          )}

          <form onSubmit={form.onSubmit(handleSubmit)}>
            <Stack gap="md">
              <TextInput
                label="Tên Lớp"
                placeholder="VD: Lớp 9A1 - Tiếng Anh"
                required
                {...form.getInputProps('name')}
              />

              <Select
                label="Môn Học"
                placeholder="Chọn môn học"
                data={SUBJECTS}
                required
                {...form.getInputProps('subject')}
              />

              <Select
                label="Khối"
                placeholder="Chọn khối"
                data={GRADES}
                required
                {...form.getInputProps('grade')}
              />

              <TextInput
                label="Trường"
                placeholder="THCS/THPT ABC"
                required
                {...form.getInputProps('school')}
              />

              <NumberInput
                label="Số Học Sinh Tối Đa"
                min={10}
                max={100}
                {...form.getInputProps('maxStudents')}
              />

              <Button
                type="submit"
                size="lg"
                loading={loading}
                leftSection={<IconPlus size={18} />}
                mt="md"
              >
                Tạo Lớp Học
              </Button>
            </Stack>
          </form>
        </Paper>
      </Container>
    </Box>
  );
}
