'use client';

import { useEffect, useState, useCallback } from 'react';
import {
    Container,
    Title,
    Text,
    Group,
    SimpleGrid,
    Button,
    Box,
    Badge,
    Progress,
    Stack,
    SegmentedControl,
} from '@mantine/core';
import {
    IconArrowLeft,
    IconSun,
    IconCalendar,
    IconTrophy,
    IconFlame,
    IconStar,
    IconMicrophone,
} from '@tabler/icons-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { QuestCard } from '@/features/xp-system';
import { PrivateRoute } from '@/features/auth';
import { useAuthStore } from '@/stores/authStore';
import { LoadingState } from '@/shared/components/ui/DataStates';
import { UserMenu } from '@/shared/components/ui/UserMenu';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002';

interface QuestData {
    id: string;
    name: string;
    description: string;
    type: 'daily' | 'weekly' | 'achievement';
    xpReward: number;
    icon: string;
    condition: { type: string; target: number };
    progress: number;
    completed: boolean;
}

// Summary Card Component
function SummaryCard({
    icon,
    label,
    completed,
    total,
    xp,
    gradient,
    delay,
}: {
    icon: React.ReactNode;
    label: string;
    completed: number;
    total: number;
    xp?: number;
    gradient: string;
    delay: number;
}) {
    const percentage = total > 0 ? (completed / total) * 100 : 0;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay }}
            whileHover={{ y: -4, scale: 1.02 }}
        >
            <Box
                p="lg"
                style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    backdropFilter: 'blur(20px)',
                    borderRadius: 20,
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    position: 'relative',
                    overflow: 'hidden',
                }}
            >
                {/* Gradient accent */}
                <Box
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: 4,
                        background: gradient,
                    }}
                />

                <Group justify="space-between" mb="md">
                    <Group gap="sm">
                        <Box
                            style={{
                                width: 40,
                                height: 40,
                                borderRadius: 12,
                                background: gradient,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                boxShadow: `0 8px 24px ${gradient.includes('007AFF') ? 'rgba(0,122,255,0.3)' : gradient.includes('AF52DE') ? 'rgba(175,82,222,0.3)' : 'rgba(255,204,0,0.3)'}`,
                            }}
                        >
                            {icon}
                        </Box>
                        <Text fw={600} style={{ color: 'white' }}>
                            {label}
                        </Text>
                    </Group>
                    <Badge
                        size="lg"
                        variant="light"
                        style={{
                            background: 'rgba(255,255,255,0.1)',
                            color: 'white',
                        }}
                    >
                        {completed}/{total}
                    </Badge>
                </Group>

                <Progress
                    value={percentage}
                    size="md"
                    radius="xl"
                    style={{
                        background: 'rgba(255,255,255,0.1)',
                    }}
                    styles={{
                        section: {
                            background: gradient,
                        },
                    }}
                />

                {xp !== undefined && (
                    <Text size="sm" mt="sm" style={{ color: 'rgba(255,255,255,0.6)' }}>
                        +{xp} XP đã nhận
                    </Text>
                )}
            </Box>
        </motion.div>
    );
}

export default function QuestsPage() {
    const { user } = useAuthStore();
    const [quests, setQuests] = useState<QuestData[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('daily');

    const userId = user?.id || 'demo-user';

    const fetchQuests = useCallback(async () => {
        try {
            const res = await fetch(`${API_URL}/quests/user/${userId}`);
            if (res.ok) {
                const data = await res.json();
                setQuests(data);
            }
        } catch (err) {
            console.error('Failed to fetch quests:', err);
        } finally {
            setLoading(false);
        }
    }, [userId]);

    useEffect(() => {
        fetchQuests();
    }, [fetchQuests]);

    const dailyQuests = quests.filter((q) => q.type === 'daily');
    const weeklyQuests = quests.filter((q) => q.type === 'weekly');
    const achievements = quests.filter((q) => q.type === 'achievement');

    const dailyCompleted = dailyQuests.filter((q) => q.completed).length;
    const weeklyCompleted = weeklyQuests.filter((q) => q.completed).length;
    const achievementsCompleted = achievements.filter((q) => q.completed).length;

    const dailyXp = dailyQuests.reduce((acc, q) => acc + (q.completed ? q.xpReward : 0), 0);
    const weeklyXp = weeklyQuests.reduce((acc, q) => acc + (q.completed ? q.xpReward : 0), 0);

    const getCurrentQuests = () => {
        switch (activeTab) {
            case 'daily':
                return dailyQuests;
            case 'weekly':
                return weeklyQuests;
            case 'achievements':
                return achievements;
            default:
                return dailyQuests;
        }
    };

    if (loading) {
        return (
            <Box
                style={{
                    minHeight: '100vh',
                    background: 'linear-gradient(180deg, #0F0F1A 0%, #1A1A2E 50%, #16213E 100%)',
                }}
            >
                <LoadingState message="Đang tải nhiệm vụ..." variant="dark" />
            </Box>
        );
    }

    return (
        <PrivateRoute>
            <Box
                style={{
                    minHeight: '100vh',
                    background: 'linear-gradient(180deg, #0F0F1A 0%, #1A1A2E 50%, #16213E 100%)',
                }}
            >
                {/* Header */}
                <motion.header
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{
                        position: 'sticky',
                        top: 0,
                        zIndex: 100,
                        background: 'rgba(15, 15, 26, 0.8)',
                        backdropFilter: 'blur(20px)',
                        borderBottom: '1px solid rgba(255,255,255,0.1)',
                    }}
                >
                    <Container size="lg">
                        <Group justify="space-between" h={70}>
                            <Group gap="md">
                                <Link href="/profile" style={{ textDecoration: 'none' }}>
                                    <motion.div whileHover={{ x: -4 }} whileTap={{ scale: 0.95 }}>
                                        <Button
                                            variant="subtle"
                                            leftSection={<IconArrowLeft size={16} />}
                                            style={{ color: 'rgba(255,255,255,0.7)' }}
                                        >
                                            Profile
                                        </Button>
                                    </motion.div>
                                </Link>
                                <Group gap="xs">
                                    <Box
                                        style={{
                                            width: 40,
                                            height: 40,
                                            borderRadius: 12,
                                            background: 'linear-gradient(135deg, #FF9500, #FF2D55)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                        }}
                                    >
                                        <IconStar size={22} color="white" />
                                    </Box>
                                    <Title order={3} style={{ color: 'white' }}>
                                        Nhiệm Vụ
                                    </Title>
                                </Group>
                            </Group>
                            <UserMenu />
                        </Group>
                    </Container>
                </motion.header>

                <Container size="lg" py="xl">
                    {/* Summary Cards */}
                    <SimpleGrid cols={{ base: 1, sm: 3 }} mb="xl">
                        <SummaryCard
                            icon={<IconSun size={22} color="white" />}
                            label="Hàng ngày"
                            completed={dailyCompleted}
                            total={dailyQuests.length}
                            xp={dailyXp}
                            gradient="linear-gradient(135deg, #007AFF, #5856D6)"
                            delay={0}
                        />
                        <SummaryCard
                            icon={<IconCalendar size={22} color="white" />}
                            label="Hàng tuần"
                            completed={weeklyCompleted}
                            total={weeklyQuests.length}
                            xp={weeklyXp}
                            gradient="linear-gradient(135deg, #AF52DE, #FF2D55)"
                            delay={0.1}
                        />
                        <SummaryCard
                            icon={<IconTrophy size={22} color="white" />}
                            label="Thành tựu"
                            completed={achievementsCompleted}
                            total={achievements.length}
                            gradient="linear-gradient(135deg, #FFCC00, #FF9500)"
                            delay={0.2}
                        />
                    </SimpleGrid>

                    {/* Tab Switcher */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        <Box
                            p="md"
                            mb="xl"
                            style={{
                                background: 'rgba(255, 255, 255, 0.05)',
                                backdropFilter: 'blur(20px)',
                                borderRadius: 20,
                                border: '1px solid rgba(255, 255, 255, 0.1)',
                            }}
                        >
                            <SegmentedControl
                                value={activeTab}
                                onChange={setActiveTab}
                                fullWidth
                                size="md"
                                radius="xl"
                                data={[
                                    {
                                        value: 'daily',
                                        label: (
                                            <Group gap={6} justify="center">
                                                <IconSun size={16} />
                                                <span>Hàng ngày ({dailyQuests.length})</span>
                                            </Group>
                                        ),
                                    },
                                    {
                                        value: 'weekly',
                                        label: (
                                            <Group gap={6} justify="center">
                                                <IconCalendar size={16} />
                                                <span>Hàng tuần ({weeklyQuests.length})</span>
                                            </Group>
                                        ),
                                    },
                                    {
                                        value: 'achievements',
                                        label: (
                                            <Group gap={6} justify="center">
                                                <IconTrophy size={16} />
                                                <span>Thành tựu ({achievements.length})</span>
                                            </Group>
                                        ),
                                    },
                                ]}
                                styles={{
                                    root: {
                                        background: 'rgba(255,255,255,0.05)',
                                        border: 'none',
                                    },
                                    indicator: {
                                        background: 'linear-gradient(135deg, #667eea, #764ba2)',
                                        boxShadow: '0 4px 12px rgba(102, 126, 234, 0.4)',
                                    },
                                    label: {
                                        color: 'rgba(255,255,255,0.7)',
                                        fontWeight: 500,
                                        '&[data-active]': {
                                            color: 'white',
                                        },
                                    },
                                }}
                            />
                        </Box>
                    </motion.div>

                    {/* Quest List */}
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3 }}
                        >
                            {getCurrentQuests().length === 0 ? (
                                <Box
                                    ta="center"
                                    py={80}
                                    style={{
                                        background: 'rgba(255, 255, 255, 0.05)',
                                        backdropFilter: 'blur(20px)',
                                        borderRadius: 20,
                                        border: '1px solid rgba(255, 255, 255, 0.1)',
                                    }}
                                >
                                    <motion.div
                                        animate={{ y: [0, -8, 0] }}
                                        transition={{ duration: 2, repeat: Infinity }}
                                    >
                                        <IconFlame size={48} color="#667eea" style={{ opacity: 0.5 }} />
                                    </motion.div>
                                    <Text size="lg" fw={500} mt="md" style={{ color: 'white' }}>
                                        Không có nhiệm vụ nào
                                    </Text>
                                    <Text size="sm" style={{ color: 'rgba(255,255,255,0.5)' }}>
                                        Hãy quay lại sau để kiểm tra nhiệm vụ mới
                                    </Text>
                                </Box>
                            ) : (
                                <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="lg">
                                    {getCurrentQuests().map((quest, index) => (
                                        <motion.div
                                            key={quest.id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.05 }}
                                        >
                                            <QuestCard
                                                id={quest.id}
                                                name={quest.name}
                                                description={quest.description}
                                                type={quest.type}
                                                xpReward={quest.xpReward}
                                                icon={quest.icon}
                                                progress={quest.progress}
                                                target={quest.condition.target}
                                                completed={quest.completed}
                                            />
                                        </motion.div>
                                    ))}
                                </SimpleGrid>
                            )}
                        </motion.div>
                    </AnimatePresence>
                </Container>
            </Box>
        </PrivateRoute>
    );
}
