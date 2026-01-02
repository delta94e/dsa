'use client';

import { useState } from 'react';
import { Box, Container, Title, Text, Stack, SimpleGrid } from '@mantine/core';
import { motion } from 'framer-motion';
import { 
    IconHome, 
    IconUsers, 
    IconTrophy, 
    IconUser, 
    IconSettings,
    IconMessage,
    IconBell,
    IconSearch,
    IconHeart,
    IconBookmark,
    IconMicrophone,
} from '@tabler/icons-react';

import {
    AnimatedTabs,
    AnimatedTabsDark,
    AnimatedPillTabs,
    AnimatedBottomNav,
} from '@/shared/components/ui/AnimatedTabs';

const mainTabs = [
    { icon: IconHome, label: 'Trang chủ' },
    { icon: IconUsers, label: 'Phòng học' },
    { icon: IconTrophy, label: 'Nhiệm vụ' },
    { icon: IconUser, label: 'Cá nhân' },
];

const socialTabs = [
    { icon: IconHeart, label: 'Yêu thích' },
    { icon: IconBookmark, label: 'Đã lưu' },
    { icon: IconBell, label: 'Thông báo' },
    { icon: IconMessage, label: 'Tin nhắn' },
];

const actionTabs = [
    { icon: IconMicrophone, label: 'Nói' },
    { icon: IconSearch, label: 'Tìm kiếm' },
    { icon: IconSettings, label: 'Cài đặt' },
];

export default function TabsDemoPage() {
    const [selectedMain, setSelectedMain] = useState(0);
    const [selectedDark, setSelectedDark] = useState(0);
    const [selectedPill, setSelectedPill] = useState(0);
    const [selectedBottom, setSelectedBottom] = useState(0);
    const [selectedGradient1, setSelectedGradient1] = useState(0);
    const [selectedGradient2, setSelectedGradient2] = useState(0);

    return (
        <Box
            style={{
                minHeight: '100vh',
                background: 'linear-gradient(180deg, #0F0F1A 0%, #1A1A2E 50%, #16213E 100%)',
            }}
        >
            <Container size="lg" py={60}>
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <Box
                        ta="center"
                        mb="xl"
                        p="xl"
                        style={{
                            background: 'rgba(255, 255, 255, 0.05)',
                            backdropFilter: 'blur(20px)',
                            borderRadius: 24,
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                        }}
                    >
                        <Text size="sm" mb="xs" style={{ color: 'rgba(255,255,255,0.5)' }}>
                            Inspired by @madebydaybreak
                        </Text>
                        <Title order={2} mb="md" style={{ color: 'white' }}>
                            Animated Tabs Demo
                        </Title>
                        <Text style={{ color: 'rgba(255,255,255,0.7)' }} maw={600} mx="auto">
                            Tabs expand để hiện label khi selected.
                            Layout animation với spring physics.
                        </Text>
                    </Box>
                </motion.div>

                <Stack gap="xl">
                    {/* Light Theme Tabs */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                    >
                        <Box
                            p="xl"
                            style={{
                                background: '#fff',
                                borderRadius: 20,
                            }}
                        >
                            <Text size="sm" mb="lg" c="dimmed">
                                💡 AnimatedTabs (Light Theme)
                            </Text>
                            <Box ta="center">
                                <AnimatedTabs
                                    data={mainTabs}
                                    selectedIndex={selectedMain}
                                    onChange={setSelectedMain}
                                />
                            </Box>
                        </Box>
                    </motion.div>

                    {/* Dark Theme Tabs */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <Box
                            p="xl"
                            style={{
                                background: 'rgba(255, 255, 255, 0.05)',
                                backdropFilter: 'blur(20px)',
                                borderRadius: 20,
                                border: '1px solid rgba(255, 255, 255, 0.1)',
                            }}
                        >
                            <Text size="sm" mb="lg" style={{ color: 'rgba(255,255,255,0.5)' }}>
                                🌙 AnimatedTabsDark (Gradient Background)
                            </Text>
                            <Stack gap="lg" align="center">
                                <AnimatedTabsDark
                                    data={socialTabs}
                                    selectedIndex={selectedDark}
                                    onChange={setSelectedDark}
                                    gradientColors={['#667eea', '#764ba2']}
                                />
                                <AnimatedTabsDark
                                    data={actionTabs}
                                    selectedIndex={selectedGradient1}
                                    onChange={setSelectedGradient1}
                                    gradientColors={['#f093fb', '#f5576c']}
                                />
                                <AnimatedTabsDark
                                    data={mainTabs}
                                    selectedIndex={selectedGradient2}
                                    onChange={setSelectedGradient2}
                                    gradientColors={['#4facfe', '#00f2fe']}
                                />
                            </Stack>
                        </Box>
                    </motion.div>

                    {/* Pill Tabs */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        <Box
                            p="xl"
                            style={{
                                background: 'rgba(255, 255, 255, 0.05)',
                                backdropFilter: 'blur(20px)',
                                borderRadius: 20,
                                border: '1px solid rgba(255, 255, 255, 0.1)',
                            }}
                        >
                            <Text size="sm" mb="lg" style={{ color: 'rgba(255,255,255,0.5)' }}>
                                💊 AnimatedPillTabs (Rounded)
                            </Text>
                            <Box ta="center">
                                <AnimatedPillTabs
                                    data={mainTabs}
                                    selectedIndex={selectedPill}
                                    onChange={setSelectedPill}
                                />
                            </Box>
                        </Box>
                    </motion.div>

                    {/* Bottom Navigation */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                    >
                        <Box
                            p="xl"
                            style={{
                                background: 'rgba(255, 255, 255, 0.05)',
                                backdropFilter: 'blur(20px)',
                                borderRadius: 20,
                                border: '1px solid rgba(255, 255, 255, 0.1)',
                            }}
                        >
                            <Text size="sm" mb="lg" style={{ color: 'rgba(255,255,255,0.5)' }}>
                                📱 AnimatedBottomNav (Mobile Navigation)
                            </Text>
                            <Box maw={400} mx="auto">
                                <AnimatedBottomNav
                                    data={mainTabs}
                                    selectedIndex={selectedBottom}
                                    onChange={setSelectedBottom}
                                />
                            </Box>
                        </Box>
                    </motion.div>

                    {/* Features */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                    >
                        <Box
                            p="xl"
                            style={{
                                background: 'rgba(255, 255, 255, 0.05)',
                                backdropFilter: 'blur(20px)',
                                borderRadius: 24,
                                border: '1px solid rgba(255, 255, 255, 0.1)',
                            }}
                        >
                            <Text fw={600} size="lg" mb="lg" style={{ color: 'white' }}>
                                Animation Features
                            </Text>
                            <SimpleGrid cols={{ base: 2, sm: 3 }} spacing="md">
                                {[
                                    { icon: '📌', title: 'Expanding Labels', desc: 'Label hiện khi selected' },
                                    { icon: '🔄', title: 'Layout Animation', desc: 'LayoutGroup smooth transition' },
                                    { icon: '🌊', title: 'Spring Physics', desc: 'damping: 80, stiffness: 200' },
                                    { icon: '✨', title: 'FadeIn/Out', desc: 'AnimatePresence cho labels' },
                                    { icon: '🎨', title: 'Color Animation', desc: 'Icon và background colors' },
                                    { icon: '💡', title: 'Multiple Variants', desc: 'Light, Dark, Pill, Bottom' },
                                ].map((feature) => (
                                    <Box
                                        key={feature.title}
                                        p="md"
                                        style={{
                                            background: 'rgba(255,255,255,0.05)',
                                            borderRadius: 12,
                                        }}
                                    >
                                        <Text span style={{ marginRight: 8 }}>{feature.icon}</Text>
                                        <Text span fw={500} c="white" size="sm">{feature.title}</Text>
                                        <Text size="xs" c="dimmed" mt={4}>
                                            {feature.desc}
                                        </Text>
                                    </Box>
                                ))}
                            </SimpleGrid>
                        </Box>
                    </motion.div>
                </Stack>
            </Container>
        </Box>
    );
}
