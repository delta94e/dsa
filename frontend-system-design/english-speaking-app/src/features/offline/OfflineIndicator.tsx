'use client';

// ═══════════════════════════════════════════════════════════════
// Offline Indicator Component
// Shows offline status and sync queue
// ═══════════════════════════════════════════════════════════════

import { Alert, Badge, Group, Text } from '@mantine/core';
import { IconWifi, IconWifiOff, IconRefresh } from '@tabler/icons-react';
import { useOnlineStatus } from '@/shared/hooks/useOnlineStatus';
import { useEffect, useState } from 'react';
import { getSyncQueue } from '@/lib/offlineService';
import styles from './Offline.module.css';

export function OfflineIndicator() {
  const { isOnline, wasOffline } = useOnlineStatus();
  const [syncCount, setSyncCount] = useState(0);

  useEffect(() => {
    const checkSyncQueue = async () => {
      try {
        const queue = await getSyncQueue();
        setSyncCount(queue.length);
      } catch (err) {
        console.error('Failed to check sync queue:', err);
      }
    };

    checkSyncQueue();
    
    // Re-check when coming back online
    if (wasOffline) {
      checkSyncQueue();
    }
  }, [wasOffline]);

  // Don't show if online and no pending syncs
  if (isOnline && syncCount === 0 && !wasOffline) {
    return null;
  }

  return (
    <div className={styles.offlineIndicator}>
      {!isOnline ? (
        <Alert
          icon={<IconWifiOff size={20} />}
          color="orange"
          variant="filled"
          radius="xl"
        >
          <Group gap="xs">
            <Text size="sm" fw={500}>
              You are offline
            </Text>
            {syncCount > 0 && (
              <Badge color="white" variant="light" size="sm">
                {syncCount} pending
              </Badge>
            )}
          </Group>
        </Alert>
      ) : wasOffline ? (
        <Alert
          icon={<IconRefresh size={20} />}
          color="green"
          variant="filled"
          radius="xl"
        >
          <Group gap="xs">
            <Text size="sm" fw={500}>
              Back online!
            </Text>
            {syncCount > 0 && (
              <Badge color="white" variant="light" size="sm" className={styles.syncBadge}>
                Syncing {syncCount}...
              </Badge>
            )}
          </Group>
        </Alert>
      ) : syncCount > 0 ? (
        <Alert
          icon={<IconRefresh size={20} />}
          color="blue"
          variant="light"
          radius="xl"
        >
          <Group gap="xs">
            <Text size="sm" fw={500}>
              {syncCount} items pending sync
            </Text>
          </Group>
        </Alert>
      ) : null}
    </div>
  );
}
