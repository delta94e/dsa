'use client';

import { Group, TextInput, SegmentedControl, Box, Text, Badge, ScrollArea } from '@mantine/core';
import { IconSearch } from '@tabler/icons-react';
import { Level, LEVELS, RoomFilters as RoomFiltersType } from '@/types';
import { motion } from 'framer-motion';

interface RoomFiltersProps {
    filters: RoomFiltersType;
    onChange: (filters: RoomFiltersType) => void;
}

export function RoomFilters({ filters, onChange }: RoomFiltersProps) {
    const levelOptions = [
        { label: 'Tất cả', value: 'all' },
        ...LEVELS.map((level) => ({
            label: level.code,
            value: level.code,
        })),
    ];

    return (
        <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
        >
            <Box
                mb="xl"
                p="md"
                style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    backdropFilter: 'blur(20px)',
                    borderRadius: 16,
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                }}
            >
                <Group gap="md" wrap="wrap">
                    {/* Search */}
                    <TextInput
                        placeholder="Tìm phòng..."
                        leftSection={<IconSearch size={18} color="rgba(255,255,255,0.5)" />}
                        value={filters.search || ''}
                        onChange={(e) => onChange({ ...filters, search: e.target.value })}
                        radius="xl"
                        style={{ flex: 1, minWidth: 250 }}
                        styles={{
                            input: {
                                background: 'rgba(255, 255, 255, 0.1)',
                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                color: 'white',
                                '&::placeholder': {
                                    color: 'rgba(255,255,255,0.5)',
                                },
                                '&:focus': {
                                    borderColor: '#667eea',
                                },
                            },
                        }}
                    />

                    {/* Level Filter */}
                    <ScrollArea scrollbarSize={0} style={{ maxWidth: 400 }}>
                        <Group gap={8} wrap="nowrap">
                            {levelOptions.map((option) => (
                                <motion.div
                                    key={option.value}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <Badge
                                        size="lg"
                                        variant={filters.level === option.value ? 'filled' : 'outline'}
                                        onClick={() => onChange({ ...filters, level: option.value as Level | 'all' })}
                                        style={{
                                            cursor: 'pointer',
                                            background: filters.level === option.value
                                                ? 'linear-gradient(135deg, #667eea, #764ba2)'
                                                : 'transparent',
                                            borderColor: filters.level === option.value
                                                ? 'transparent'
                                                : 'rgba(255,255,255,0.2)',
                                            color: 'white',
                                            boxShadow: filters.level === option.value
                                                ? '0 4px 12px rgba(102, 126, 234, 0.4)'
                                                : 'none',
                                        }}
                                    >
                                        {option.label}
                                    </Badge>
                                </motion.div>
                            ))}
                        </Group>
                    </ScrollArea>
                </Group>
            </Box>
        </motion.div>
    );
}

export default RoomFilters;
