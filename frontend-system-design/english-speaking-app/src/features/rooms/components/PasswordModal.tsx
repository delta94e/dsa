'use client';

import { useState } from 'react';
import {
  Modal,
  TextInput,
  Button,
  Group,
  Text,
  Stack,
  Alert,
} from '@mantine/core';
import { IconLock, IconAlertCircle } from '@tabler/icons-react';

interface PasswordModalProps {
  opened: boolean;
  roomName?: string;
  error?: string;
  loading?: boolean;
  onSubmit: (password: string) => void;
  onClose: () => void;
}

export function PasswordModal({
  opened,
  roomName,
  error,
  loading,
  onSubmit,
  onClose,
}: PasswordModalProps) {
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password.trim()) {
      onSubmit(password);
    }
  };

  const handleClose = () => {
    setPassword('');
    onClose();
  };

  return (
    <Modal
      opened={opened}
      onClose={handleClose}
      title={
        <Group>
          <IconLock size={24} />
          <Text fw={600}>Room Password Required</Text>
        </Group>
      }
      centered
      size="sm"
    >
      <form onSubmit={handleSubmit}>
        <Stack gap="md">
          <Text size="sm" c="dimmed">
            {roomName ? (
              <>The room <strong>"{roomName}"</strong> is protected by a password.</>
            ) : (
              'This room is protected by a password.'
            )}
          </Text>

          {error && (
            <Alert icon={<IconAlertCircle size={16} />} color="red" variant="light">
              {error}
            </Alert>
          )}

          <TextInput
            type="password"
            placeholder="Enter room password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoFocus
            required
            error={error ? true : false}
          />

          <Group justify="flex-end">
            <Button variant="default" onClick={handleClose} disabled={loading}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={!password.trim()} 
              loading={loading}
              leftSection={<IconLock size={16} />}
            >
              Join Room
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
}
