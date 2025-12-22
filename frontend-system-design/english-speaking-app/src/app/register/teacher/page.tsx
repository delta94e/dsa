'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
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
  MultiSelect,
  Alert,
  Box,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconArrowLeft, IconUserPlus, IconCheck, IconAlertCircle } from '@tabler/icons-react';
import Link from 'next/link';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002';

// Available subjects
const SUBJECTS = [
  { value: 'english', label: 'Tiếng Anh' },
  { value: 'math', label: 'Toán' },
  { value: 'physics', label: 'Vật Lý' },
  { value: 'chemistry', label: 'Hóa Học' },
  { value: 'biology', label: 'Sinh Học' },
  { value: 'literature', label: 'Ngữ Văn' },
  { value: 'history', label: 'Lịch Sử' },
  { value: 'geography', label: 'Địa Lý' },
];

// Available grades
const GRADES = [
  { value: '1', label: 'Lớp 1' },
  { value: '2', label: 'Lớp 2' },
  { value: '3', label: 'Lớp 3' },
  { value: '4', label: 'Lớp 4' },
  { value: '5', label: 'Lớp 5' },
  { value: '6', label: 'Lớp 6' },
  { value: '7', label: 'Lớp 7' },
  { value: '8', label: 'Lớp 8' },
  { value: '9', label: 'Lớp 9' },
  { value: '10', label: 'Lớp 10' },
  { value: '11', label: 'Lớp 11' },
  { value: '12', label: 'Lớp 12' },
];

interface TeacherFormValues {
  email: string;
  name: string;
  school: string;
  subjects: string[];
  grades: string[];
  phoneNumber: string;
  password: string;
  confirmPassword: string;
}

export default function TeacherRegistrationPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<TeacherFormValues>({
    initialValues: {
      email: '',
      name: '',
      school: '',
      subjects: [],
      grades: [],
      phoneNumber: '',
      password: '',
      confirmPassword: '',
    },
    validate: {
      email: (value) => (!value.includes('@') ? 'Email không hợp lệ' : null),
      name: (value) => (value.length < 2 ? 'Tên phải có ít nhất 2 ký tự' : null),
      school: (value) => (value.length < 3 ? 'Tên trường phải có ít nhất 3 ký tự' : null),
      subjects: (value) => (value.length === 0 ? 'Chọn ít nhất 1 môn dạy' : null),
      grades: (value) => (value.length === 0 ? 'Chọn ít nhất 1 khối dạy' : null),
      phoneNumber: (value) => (value.length < 10 ? 'Số điện thoại không hợp lệ' : null),
      password: (value) => (value.length < 6 ? 'Mật khẩu phải có ít nhất 6 ký tự' : null),
      confirmPassword: (value, values) =>
        value !== values.password ? 'Mật khẩu không khớp' : null,
    },
  });

  const handleSubmit = async (values: TeacherFormValues) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_URL}/teachers/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: values.email,
          name: values.name,
          school: values.school,
          subjects: values.subjects,
          grades: values.grades,
          phoneNumber: values.phoneNumber,
          password: values.password,
        }),
      });

      if (!response.ok) {
        throw new Error('Registration failed');
      }

      setSuccess(true);
    } catch (err) {
      setError('Đăng ký thất bại. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

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
                Tài khoản của bạn đang chờ Admin phê duyệt.
                Bạn sẽ nhận được thông báo khi tài khoản được kích hoạt.
              </Text>
              <Link href="/login">
                <Button variant="light" mt="md">
                  Về Trang Đăng Nhập
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

        <Paper shadow="xl" p="xl" radius="lg">
          <Stack align="center" mb="xl">
            <Box
              style={{
                width: 60,
                height: 60,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <IconUserPlus size={30} color="white" />
            </Box>
            <Title order={2}>Đăng Ký Giáo Viên</Title>
            <Text c="dimmed" ta="center">
              Tạo tài khoản giáo viên để quản lý lớp học
            </Text>
          </Stack>

          {error && (
            <Alert icon={<IconAlertCircle size={16} />} color="red" mb="md">
              {error}
            </Alert>
          )}

          <form onSubmit={form.onSubmit(handleSubmit)}>
            <Stack gap="md">
              <TextInput
                label="Email"
                placeholder="teacher@school.edu.vn"
                required
                {...form.getInputProps('email')}
              />

              <TextInput
                label="Họ và Tên"
                placeholder="Nguyễn Văn A"
                required
                {...form.getInputProps('name')}
              />

              <TextInput
                label="Trường"
                placeholder="THCS/THPT ABC"
                required
                {...form.getInputProps('school')}
              />

              <MultiSelect
                label="Môn Dạy"
                placeholder="Chọn môn dạy"
                data={SUBJECTS}
                required
                searchable
                {...form.getInputProps('subjects')}
              />

              <MultiSelect
                label="Khối Dạy"
                placeholder="Chọn khối dạy"
                data={GRADES}
                required
                searchable
                {...form.getInputProps('grades')}
              />

              <TextInput
                label="Số Điện Thoại"
                placeholder="0901234567"
                required
                {...form.getInputProps('phoneNumber')}
              />

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
                loading={loading}
                leftSection={<IconUserPlus size={18} />}
                mt="md"
                style={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                }}
              >
                Đăng Ký
              </Button>

              <Text size="sm" c="dimmed" ta="center">
                Đã có tài khoản?{' '}
                <Link href="/login" style={{ color: '#667eea' }}>
                  Đăng nhập
                </Link>
              </Text>
            </Stack>
          </form>
        </Paper>
      </Container>
    </Box>
  );
}
