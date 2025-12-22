'use client';

import {
  Paper,
  Group,
  Badge,
  Text,
  Title,
  ThemeIcon,
  ActionIcon,
  Tooltip,
} from '@mantine/core';
import {
  IconWifi,
  IconWifiOff,
  IconUsers,
  IconSchool,
  IconMicrophone,
  IconMicrophoneOff,
} from '@tabler/icons-react';
import type { Classroom } from '../hooks/useClassroomSession';

// ═══════════════════════════════════════════════════════════════
// Classroom Header Component
// ═══════════════════════════════════════════════════════════════
interface ClassroomHeaderProps {
  classroom: Classroom;
  isTeacher: boolean;
  isConnected: boolean;
  participantCount: number;
}

export function ClassroomHeader({
  classroom,
  isTeacher,
  isConnected,
  participantCount,
}: ClassroomHeaderProps) {
  return (
    <Paper shadow="md" p="md" radius="md" mb="xl">
      <Group justify="space-between">
        <Group>
          <ThemeIcon size="xl" radius="md" color="violet">
            <IconSchool size={24} />
          </ThemeIcon>
          <div>
            <Group gap="xs">
              <Title order={3}>{classroom.name}</Title>
              {isTeacher && (
                <Badge color="violet" variant="filled">
                  Giáo viên
                </Badge>
              )}
            </Group>
            <Text size="sm" c="dimmed">
              {classroom.subject} • Khối {classroom.grade} • {classroom.school}
            </Text>
          </div>
        </Group>
        <Group>
          <Badge
            color={isConnected ? 'green' : 'red'}
            leftSection={isConnected ? <IconWifi size={12} /> : <IconWifiOff size={12} />}
          >
            {isConnected ? 'Đã kết nối' : 'Đang kết nối...'}
          </Badge>
          <Badge leftSection={<IconUsers size={12} />}>
            {participantCount} người
          </Badge>
        </Group>
      </Group>
    </Paper>
  );
}

// ═══════════════════════════════════════════════════════════════
// Teacher Controls Component
// ═══════════════════════════════════════════════════════════════
interface TeacherControlsProps {
  onMuteAll?: () => void;
  onUnmuteAll?: () => void;
}

export function TeacherControls({ onMuteAll, onUnmuteAll }: TeacherControlsProps) {
  return (
    <Paper
      shadow="md"
      p="md"
      radius="md"
      style={{
        position: 'fixed',
        top: 20,
        right: 20,
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)',
      }}
    >
      <Text fw={600} size="sm" mb="xs">
        Điều khiển giáo viên
      </Text>
      <Group gap="xs">
        <Tooltip label="Tắt mic tất cả (coming soon)">
          <ActionIcon size="lg" variant="light" color="orange" onClick={onMuteAll}>
            <IconMicrophoneOff size={18} />
          </ActionIcon>
        </Tooltip>
        <Tooltip label="Bật mic tất cả (coming soon)">
          <ActionIcon size="lg" variant="light" color="green" onClick={onUnmuteAll}>
            <IconMicrophone size={18} />
          </ActionIcon>
        </Tooltip>
      </Group>
    </Paper>
  );
}

// ═══════════════════════════════════════════════════════════════
// Floating Voice Controls Wrapper
// ═══════════════════════════════════════════════════════════════
interface FloatingControlsWrapperProps {
  children: React.ReactNode;
}

export function FloatingControlsWrapper({ children }: FloatingControlsWrapperProps) {
  return (
    <Paper
      shadow="xl"
      p="lg"
      radius="xl"
      style={{
        position: 'fixed',
        bottom: 20,
        left: '50%',
        transform: 'translateX(-50%)',
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)',
      }}
    >
      {children}
    </Paper>
  );
}
