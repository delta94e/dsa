'use client';

import { Button, Badge, Group, Alert } from '@mantine/core';
import { IconArrowLeft, IconAlertCircle, IconRefresh } from '@tabler/icons-react';
import Link from 'next/link';

import { PageLayout, PageHeader } from '@/shared/components/layout/PageLayout';
import { LoadingState } from '@/shared/components/ui/DataStates';
import { useTeachers } from '@/features/classroom/hooks/useTeachers';
import { TeachersTable } from '@/features/classroom/components/TeacherComponents';

// ═══════════════════════════════════════════════════════════════
// Header Actions
// ═══════════════════════════════════════════════════════════════
interface HeaderActionsProps {
  pendingCount: number;
  isLoading: boolean;
  onRefresh: () => void;
}

function HeaderActions({ pendingCount, isLoading, onRefresh }: HeaderActionsProps) {
  return (
    <>
      <Link href="/">
        <Button variant="subtle" leftSection={<IconArrowLeft size={16} />}>
          Trang Chủ
        </Button>
      </Link>
      {pendingCount > 0 && (
        <Badge color="red" size="lg">
          {pendingCount} chờ duyệt
        </Badge>
      )}
      <Button
        leftSection={<IconRefresh size={16} />}
        variant="light"
        onClick={onRefresh}
        loading={isLoading}
      >
        Làm mới
      </Button>
    </>
  );
}

// ═══════════════════════════════════════════════════════════════
// Teachers Content
// ═══════════════════════════════════════════════════════════════
function TeachersContent() {
  const {
    teachers,
    isLoading,
    error,
    actionLoading,
    pendingCount,
    refetch,
    approveTeacher,
    rejectTeacher,
    clearError,
  } = useTeachers();

  return (
    <>
      <PageHeader
        title="Quản Lý Giáo Viên"
        actions={
          <HeaderActions
            pendingCount={pendingCount}
            isLoading={isLoading}
            onRefresh={refetch}
          />
        }
      />

      {/* Error Alert */}
      {error && (
        <Alert
          icon={<IconAlertCircle size={16} />}
          color="red"
          mb="md"
          withCloseButton
          onClose={clearError}
        >
          {error}
        </Alert>
      )}

      {/* Content */}
      {isLoading ? (
        <LoadingState message="Đang tải danh sách giáo viên..." />
      ) : (
        <TeachersTable
          teachers={teachers}
          actionLoading={actionLoading}
          onApprove={approveTeacher}
          onReject={rejectTeacher}
        />
      )}
    </>
  );
}

// ═══════════════════════════════════════════════════════════════
// Main Page Component
// ═══════════════════════════════════════════════════════════════
export default function AdminTeachersPage() {
  return (
    <PageLayout>
      <TeachersContent />
    </PageLayout>
  );
}
