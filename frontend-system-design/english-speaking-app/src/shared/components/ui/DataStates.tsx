'use client';

import { ReactNode } from 'react';
import { Center, Loader, Alert, Box, Text, Button } from '@mantine/core';
import { IconAlertCircle, IconPlus } from '@tabler/icons-react';
import Link from 'next/link';

// ═══════════════════════════════════════════════════════════════
// Loading State Component
// ═══════════════════════════════════════════════════════════════
interface LoadingStateProps {
  message?: string;
}

export function LoadingState({ message }: LoadingStateProps) {
  return (
    <Center py={80}>
      <Box ta="center">
        <Loader size="lg" />
        {message && <Text c="dimmed" mt="md">{message}</Text>}
      </Box>
    </Center>
  );
}

// ═══════════════════════════════════════════════════════════════
// Error State Component
// ═══════════════════════════════════════════════════════════════
interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
}

export function ErrorState({ 
  title = 'Error', 
  message, 
  onRetry 
}: ErrorStateProps) {
  return (
    <Alert
      icon={<IconAlertCircle size={16} />}
      title={title}
      color="red"
    >
      <Text size="sm">{message}</Text>
      {onRetry && (
        <Button variant="light" color="red" size="xs" mt="sm" onClick={onRetry}>
          Try Again
        </Button>
      )}
    </Alert>
  );
}

// ═══════════════════════════════════════════════════════════════
// Empty State Component
// ═══════════════════════════════════════════════════════════════
interface EmptyStateProps {
  title: string;
  description?: string;
  actionLabel?: string;
  actionHref?: string;
  icon?: ReactNode;
}

export function EmptyState({ 
  title, 
  description, 
  actionLabel, 
  actionHref,
  icon 
}: EmptyStateProps) {
  return (
    <Center py={80}>
      <Box ta="center">
        {icon && <Box mb="md">{icon}</Box>}
        <Text size="xl" fw={500} mb="sm">
          {title}
        </Text>
        {description && (
          <Text c="dimmed" mb="lg">
            {description}
          </Text>
        )}
        {actionLabel && actionHref && (
          <Link href={actionHref} style={{ textDecoration: 'none' }}>
            <Button leftSection={<IconPlus size={18} />}>
              {actionLabel}
            </Button>
          </Link>
        )}
      </Box>
    </Center>
  );
}
