'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  Container,
  Title,
  Text,
  Paper,
  TextInput,
  PasswordInput,
  Button,
  Group,
  Stack,
  Alert,
  Box,
  Loader,
  Center,
  ThemeIcon,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconArrowLeft, IconUserPlus, IconCheck, IconAlertCircle, IconSchool } from '@tabler/icons-react';
import Link from 'next/link';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002';

interface Classroom {
  id: string;
  name: string;
  subject: string;
  grade: string;
  school: string;
  teacherName?: string;
}

interface FormValues {
  email: string;
  name: string;
  grade: string;
  className: string;
  parentName: string;
  parentPhone: string;
  parentEmail: string;
  password: string;
  confirmPassword: string;
}

export default function StudentJoinPage() {
  const params = useParams();
  const router = useRouter();
  const inviteCode = params.inviteCode as string;

  const [classroom, setClassroom] = useState<Classroom | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<FormValues>({
    initialValues: {
      email: '',
      name: '',
      grade: '',
      className: '',
      parentName: '',
      parentPhone: '',
      parentEmail: '',
      password: '',
      confirmPassword: '',
    },
    validate: {
      email: (value) => (!value.includes('@') ? 'Email không hợp lệ' : null),
      name: (value) => (value.length < 2 ? 'Tên phải có ít nhất 2 ký tự' : null),
      className: (value) => (value.length < 2 ? 'Nhập lớp của bạn' : null),
      parentName: (value) => (value.length < 2 ? 'Nhập tên phụ huynh' : null),
      parentPhone: (value) => (value.length < 10 ? 'Số điện thoại không hợp lệ' : null),
      parentEmail: (value) => (!value.includes('@') ? 'Email không hợp lệ' : null),
      password: (value) => (value.length < 6 ? 'Mật khẩu phải có ít nhất 6 ký tự' : null),
      confirmPassword: (value, values) =>
        value !== values.password ? 'Mật khẩu không khớp' : null,
    },
  });

  useEffect(() => {
    const validateInvite = async () => {
      try {
        const response = await fetch(`${API_URL}/classrooms/invite/${inviteCode}`);
        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.message || 'Invalid invite');
        }
        const data = await response.json();
        setClassroom(data.classroom);
        form.setFieldValue('grade', data.classroom.grade);
      } catch (err: any) {
        setError(err.message || 'Link mời không hợp lệ hoặc đã hết hạn');
      } finally {
        setLoading(false);
      }
    };

    validateInvite();
  }, [inviteCode]);

  const handleSubmit = async (values: FormValues) => {
    setSubmitting(true);
    setError(null);

    try {
      // Register student
      const response = await fetch(`${API_URL}/students/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...values,
          school: classroom?.school,
          inviteCode,
        }),
      });

      if (!response.ok) throw new Error('Registration failed');

      const { user } = await response.json();

      // Apply to classroom
      await fetch(`${API_URL}/classrooms/${classroom?.id}/enroll`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentId: user.id }),
      });

      setSuccess(true);
    } catch (err) {
      setError('Đăng ký thất bại. Vui lòng thử lại.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Center style={{ minHeight: '100vh' }}>
        <Loader size="lg" />
      </Center>
    );
  }

  if (error && !classroom) {
    return (
      <Box style={{ minHeight: '100vh', background: '#f8f9fa' }}>
        <Container size="sm" py="xl">
          <Paper shadow="sm" p="xl" radius="lg" mt={100}>
            <Stack align="center" gap="md">
              <ThemeIcon size={60} radius="xl" color="red" variant="light">
                <IconAlertCircle size={30} />
              </ThemeIcon>
              <Title order={3} ta="center">
                Link Không Hợp Lệ
              </Title>
              <Text c="dimmed" ta="center">
                {error}
              </Text>
              <Link href="/">
                <Button variant="light">
                  Về Trang Chủ
                </Button>
              </Link>
            </Stack>
          </Paper>
        </Container>
      </Box>
    );
  }

  if (success) {
    return (
      <Box style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
        <Container size="sm" py="xl">
          <Paper shadow="xl" p="xl" radius="lg" mt={100}>
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
                Đăng Ký Thành Công!
              </Title>
              <Text c="dimmed" ta="center">
                Bạn đã đăng ký vào lớp <strong>{classroom?.name}</strong>.
                Vui lòng chờ giáo viên phê duyệt.
              </Text>
              <Link href="/login">
                <Button variant="light" mt="md">
                  Đăng Nhập
                </Button>
              </Link>
            </Stack>
          </Paper>
        </Container>
      </Box>
    );
  }

  return (
    <Box style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
      <Container size="sm" py="xl">
        <Group mb="xl">
          <Link href="/">
            <Button variant="white" leftSection={<IconArrowLeft size={16} />}>
              Trang Chủ
            </Button>
          </Link>
        </Group>

        {/* Classroom Info */}
        <Paper p="md" radius="md" mb="xl" style={{ background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)' }}>
          <Group>
            <ThemeIcon size="xl" radius="md" variant="white">
              <IconSchool size={24} />
            </ThemeIcon>
            <div>
              <Text c="white" fw={600}>{classroom?.name}</Text>
              <Text c="white" size="sm" opacity={0.8}>
                {classroom?.subject} • Khối {classroom?.grade} • {classroom?.school}
              </Text>
            </div>
          </Group>
        </Paper>

        <Paper shadow="xl" p="xl" radius="lg">
          <Stack align="center" mb="xl">
            <Title order={2}>Đăng Ký Học Sinh</Title>
            <Text c="dimmed" ta="center">
              Điền thông tin để tham gia lớp học
            </Text>
          </Stack>

          {error && (
            <Alert icon={<IconAlertCircle size={16} />} color="red" mb="md">
              {error}
            </Alert>
          )}

          <form onSubmit={form.onSubmit(handleSubmit)}>
            <Stack gap="md">
              <Title order={5}>Thông tin học sinh</Title>
              
              <TextInput
                label="Email"
                placeholder="student@gmail.com"
                required
                {...form.getInputProps('email')}
              />

              <TextInput
                label="Họ và Tên"
                placeholder="Nguyễn Văn A"
                required
                {...form.getInputProps('name')}
              />

              <Group grow>
                <TextInput
                  label="Khối"
                  value={classroom?.grade || ''}
                  disabled
                />
                <TextInput
                  label="Lớp"
                  placeholder="VD: 9A1"
                  required
                  {...form.getInputProps('className')}
                />
              </Group>

              <Title order={5} mt="md">Thông tin phụ huynh</Title>

              <TextInput
                label="Tên Phụ Huynh"
                placeholder="Nguyễn Văn B"
                required
                {...form.getInputProps('parentName')}
              />

              <Group grow>
                <TextInput
                  label="Số Điện Thoại Phụ Huynh"
                  placeholder="0901234567"
                  required
                  {...form.getInputProps('parentPhone')}
                />
                <TextInput
                  label="Email Phụ Huynh"
                  placeholder="parent@gmail.com"
                  required
                  {...form.getInputProps('parentEmail')}
                />
              </Group>

              <Title order={5} mt="md">Bảo mật</Title>

              <PasswordInput
                label="Mật Khẩu"
                placeholder="Ít nhất 6 ký tự"
                required
                {...form.getInputProps('password')}
              />

              <PasswordInput
                label="Xác Nhận Mật Khẩu"
                placeholder="Nhập lại mật khẩu"
                required
                {...form.getInputProps('confirmPassword')}
              />

              <Button
                type="submit"
                size="lg"
                loading={submitting}
                leftSection={<IconUserPlus size={18} />}
                mt="md"
                style={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                }}
              >
                Đăng Ký
              </Button>
            </Stack>
          </form>
        </Paper>
      </Container>
    </Box>
  );
}
