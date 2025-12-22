'use client';

import { Group, Chip, TextInput, Select } from '@mantine/core';
import { IconSearch } from '@tabler/icons-react';
import { Level, LEVELS, RoomFilters as RoomFiltersType } from '@/types';

interface RoomFiltersProps {
  filters: RoomFiltersType;
  onChange: (filters: RoomFiltersType) => void;
}

export function RoomFilters({ filters, onChange }: RoomFiltersProps) {
  return (
    <Group gap="lg" mb="xl">
      {/* Search */}
      <TextInput
        placeholder="Search rooms..."
        leftSection={<IconSearch size={16} />}
        value={filters.search || ''}
        onChange={(e) => onChange({ ...filters, search: e.target.value })}
        style={{ flex: 1, minWidth: 200 }}
      />

      {/* Level Filter */}
      <Chip.Group
        multiple={false}
        value={filters.level || 'all'}
        onChange={(value) => onChange({ ...filters, level: value as Level | 'all' })}
      >
        <Group gap="xs">
          <Chip value="all" variant="outline">
            All Levels
          </Chip>
          {LEVELS.map((level) => (
            <Chip key={level.code} value={level.code} color={level.color} variant="outline">
              {level.code}
            </Chip>
          ))}
        </Group>
      </Chip.Group>
    </Group>
  );
}
