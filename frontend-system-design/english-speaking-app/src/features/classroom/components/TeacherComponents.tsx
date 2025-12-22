'use client';

import {
  Table,
  Badge,
  Group,
  Text,
  ActionIcon,
  Tooltip,
  Paper,
} from '@mantine/core';
import { IconCheck, IconX } from '@tabler/icons-react';
import type { Teacher, TeacherStatus } from '../hooks/useTeachers';

// ═══════════════════════════════════════════════════════════════
// Status Badge Component
// ═══════════════════════════════════════════════════════════════
interface StatusBadgeProps {
  status: TeacherStatus;
}

const STATUS_CONFIG: Record<TeacherStatus, { color: string; label: string }> = {
  pending: { color: 'yellow', label: 'Chờ duyệt' },
  approved: { color: 'green', label: 'Đã duyệt' },
  rejected: { color: 'red', label: 'Từ chối' },
};

export function StatusBadge({ status }: StatusBadgeProps) {
  const config = STATUS_CONFIG[status] || { color: 'gray', label: status };
  return <Badge color={config.color}>{config.label}</Badge>;
}

// ═══════════════════════════════════════════════════════════════
// Subjects Display Component
// ═══════════════════════════════════════════════════════════════
interface SubjectsDisplayProps {
  subjects: string[];
  maxVisible?: number;
}

export function SubjectsDisplay({ subjects, maxVisible = 2 }: SubjectsDisplayProps) {
  const visible = subjects.slice(0, maxVisible);
  const remaining = subjects.length - maxVisible;

  return (
    <Group gap={4}>
      {visible.map((s) => (
        <Badge key={s} size="sm" variant="light">
          {s}
        </Badge>
      ))}
      {remaining > 0 && (
        <Badge size="sm" variant="outline">
          +{remaining}
        </Badge>
      )}
    </Group>
  );
}

// ═══════════════════════════════════════════════════════════════
// Action Buttons Component
// ═══════════════════════════════════════════════════════════════
interface ActionButtonsProps {
  userId: string;
  isLoading: boolean;
  onApprove: (userId: string) => void;
  onReject: (userId: string) => void;
}

export function ActionButtons({ userId, isLoading, onApprove, onReject }: ActionButtonsProps) {
  return (
    <Group gap="xs">
      <Tooltip label="Phê duyệt">
        <ActionIcon
          color="green"
          variant="filled"
          loading={isLoading}
          onClick={() => onApprove(userId)}
        >
          <IconCheck size={16} />
        </ActionIcon>
      </Tooltip>
      <Tooltip label="Từ chối">
        <ActionIcon
          color="red"
          variant="filled"
          loading={isLoading}
          onClick={() => onReject(userId)}
        >
          <IconX size={16} />
        </ActionIcon>
      </Tooltip>
    </Group>
  );
}

// ═══════════════════════════════════════════════════════════════
// Teachers Table Component
// ═══════════════════════════════════════════════════════════════
interface TeachersTableProps {
  teachers: Teacher[];
  actionLoading: string | null;
  onApprove: (userId: string) => void;
  onReject: (userId: string) => void;
}

export function TeachersTable({
  teachers,
  actionLoading,
  onApprove,
  onReject,
}: TeachersTableProps) {
  if (teachers.length === 0) {
    return (
      <Paper p="xl" radius="md" ta="center">
        <Text c="dimmed">Chưa có giáo viên nào đăng ký</Text>
      </Paper>
    );
  }

  return (
    <Paper shadow="sm" radius="md" withBorder>
      <Table striped highlightOnHover>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Họ tên</Table.Th>
            <Table.Th>Email</Table.Th>
            <Table.Th>Trường</Table.Th>
            <Table.Th>Môn dạy</Table.Th>
            <Table.Th>Khối</Table.Th>
            <Table.Th>SĐT</Table.Th>
            <Table.Th>Trạng thái</Table.Th>
            <Table.Th>Hành động</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {teachers.map((t) => (
            <Table.Tr key={t.user.id}>
              <Table.Td fw={500}>{t.user.name}</Table.Td>
              <Table.Td>{t.user.email}</Table.Td>
              <Table.Td>{t.teacher.school}</Table.Td>
              <Table.Td>
                <SubjectsDisplay subjects={t.teacher.subjects} />
              </Table.Td>
              <Table.Td>
                <Text size="sm">{t.teacher.grades.join(', ')}</Text>
              </Table.Td>
              <Table.Td>{t.teacher.phoneNumber}</Table.Td>
              <Table.Td>
                <StatusBadge status={t.teacher.status} />
              </Table.Td>
              <Table.Td>
                {t.teacher.status === 'pending' && (
                  <ActionButtons
                    userId={t.user.id}
                    isLoading={actionLoading === t.user.id}
                    onApprove={onApprove}
                    onReject={onReject}
                  />
                )}
              </Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
    </Paper>
  );
}
