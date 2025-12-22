'use client';

import { ReactNode } from 'react';
import { Group, Title, Text, Box, Container } from '@mantine/core';

// ═══════════════════════════════════════════════════════════════
// Page Header Component
// ═══════════════════════════════════════════════════════════════
interface PageHeaderProps {
  title: string;
  description?: string;
  actions?: ReactNode;
}

export function PageHeader({ title, description, actions }: PageHeaderProps) {
  return (
    <Group justify="space-between" mb="xl">
      <div>
        <Title order={1}>{title}</Title>
        {description && <Text c="dimmed">{description}</Text>}
      </div>
      {actions && <Group>{actions}</Group>}
    </Group>
  );
}

// ═══════════════════════════════════════════════════════════════
// Page Layout Component  
// ═══════════════════════════════════════════════════════════════
interface PageLayoutProps {
  children: ReactNode;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  background?: string;
}

export function PageLayout({ 
  children, 
  size = 'xl',
  background = '#f8f9fa' 
}: PageLayoutProps) {
  return (
    <Box style={{ minHeight: '100vh', background }}>
      <Container size={size} py="xl">
        {children}
      </Container>
    </Box>
  );
}
