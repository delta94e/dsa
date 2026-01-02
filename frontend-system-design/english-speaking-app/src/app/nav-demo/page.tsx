'use client';

import { Box, Container, Title, Text, SimpleGrid, Stack, Group } from '@mantine/core';
import { IconHome, IconDoor, IconTarget, IconUser, IconPlus, IconMicrophone, IconVideo } from '@tabler/icons-react';
import { motion } from 'framer-motion';

import { DiagonalNav, SlideNav, FABMenu } from '@/shared/components/ui/AnimatedNav';

export default function NavDemoPage() {
    return (
        <Box
            style={{
                minHeight: '100vh',
                background: 'linear-gradient(180deg, #0F0F1A 0%, #1A1A2E 50%, #16213E 100%)',
            }}
        >
            {/* Diagonal Nav - Fixed position */}
            <DiagonalNav />

            {/* Content */}
            <Container size="lg" py={120}>
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
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
                            Inspired by UI8 Dribbble
                        </Text>
                        <Title order={2} mb="md" style={{ color: 'white' }}>
                            Animated Navigation Demo
                        </Title>
                        <Text style={{ color: 'rgba(255,255,255,0.7)' }} maw={600} mx="auto">
                            Nhấp vào icon hamburger ở góc trên bên phải để xem animation diagonal stripes menu.
                            Menu có hiệu ứng morphing hamburger → X, staggered item animations, và logo scale.
                        </Text>
                    </Box>
                </motion.div>

                <SimpleGrid cols={{ base: 1, md: 2 }} spacing="xl">
                    {/* Feature Card 1 */}
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
                                height: '100%',
                            }}
                        >
                            <Stack gap="md">
                                <Box
                                    style={{
                                        width: 60,
                                        height: 60,
                                        borderRadius: 16,
                                        background: 'linear-gradient(135deg, #667eea, #764ba2)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}
                                >
                                    <Text style={{ fontSize: 28 }}>📐</Text>
                                </Box>
                                <Text fw={600} size="lg" style={{ color: 'white' }}>
                                    Diagonal Stripes
                                </Text>
                                <Text size="sm" style={{ color: 'rgba(255,255,255,0.6)' }}>
                                    Hai stripe animation chéo -35deg với height animation từ 0 đến 150vh.
                                    Tạo hiệu ứng reveal độc đáo.
                                </Text>
                            </Stack>
                        </Box>
                    </motion.div>

                    {/* Feature Card 2 */}
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
                                height: '100%',
                            }}
                        >
                            <Stack gap="md">
                                <Box
                                    style={{
                                        width: 60,
                                        height: 60,
                                        borderRadius: 16,
                                        background: 'linear-gradient(135deg, #f093fb, #f5576c)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}
                                >
                                    <Text style={{ fontSize: 28 }}>🍔</Text>
                                </Box>
                                <Text fw={600} size="lg" style={{ color: 'white' }}>
                                    Hamburger Morphing
                                </Text>
                                <Text size="sm" style={{ color: 'rgba(255,255,255,0.6)' }}>
                                    Icon hamburger (3 lines) transform thành X với rotation và translate animations.
                                    Mỗi line có animation riêng.
                                </Text>
                            </Stack>
                        </Box>
                    </motion.div>

                    {/* Feature Card 3 */}
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
                                borderRadius: 20,
                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                height: '100%',
                            }}
                        >
                            <Stack gap="md">
                                <Box
                                    style={{
                                        width: 60,
                                        height: 60,
                                        borderRadius: 16,
                                        background: 'linear-gradient(135deg, #4facfe, #00f2fe)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}
                                >
                                    <Text style={{ fontSize: 28 }}>✨</Text>
                                </Box>
                                <Text fw={600} size="lg" style={{ color: 'white' }}>
                                    Staggered Animations
                                </Text>
                                <Text size="sm" style={{ color: 'rgba(255,255,255,0.6)' }}>
                                    Menu items xuất hiện với delay staggered, mỗi item có spring animation riêng.
                                    Hover effects và scale.
                                </Text>
                            </Stack>
                        </Box>
                    </motion.div>

                    {/* Feature Card 4 */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                    >
                        <Box
                            p="xl"
                            style={{
                                background: 'rgba(255, 255, 255, 0.05)',
                                backdropFilter: 'blur(20px)',
                                borderRadius: 20,
                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                height: '100%',
                            }}
                        >
                            <Stack gap="md">
                                <Box
                                    style={{
                                        width: 60,
                                        height: 60,
                                        borderRadius: 16,
                                        background: 'linear-gradient(135deg, #fa709a, #fee140)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}
                                >
                                    <Text style={{ fontSize: 28 }}>🎯</Text>
                                </Box>
                                <Text fw={600} size="lg" style={{ color: 'white' }}>
                                    Parallel + Sequence
                                </Text>
                                <Text size="sm" style={{ color: 'rgba(255,255,255,0.6)' }}>
                                    Complex orchestration với stripe animations, content fade, và logo scale
                                    chạy đồng thời với delays khác nhau.
                                </Text>
                            </Stack>
                        </Box>
                    </motion.div>
                </SimpleGrid>

                {/* Additional Components Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                >
                    <Box
                        mt="xl"
                        p="xl"
                        style={{
                            background: 'rgba(255, 255, 255, 0.05)',
                            backdropFilter: 'blur(20px)',
                            borderRadius: 24,
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                        }}
                    >
                        <Text fw={600} size="lg" mb="md" style={{ color: 'white' }}>
                            Các Components Khác
                        </Text>
                        <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
                            <Box
                                p="md"
                                style={{
                                    background: 'rgba(255,255,255,0.05)',
                                    borderRadius: 12,
                                }}
                            >
                                <Text fw={500} style={{ color: 'white' }}>SlideNav</Text>
                                <Text size="sm" style={{ color: 'rgba(255,255,255,0.6)' }}>
                                    Side panel navigation với spring animation và glassmorphism.
                                </Text>
                            </Box>
                            <Box
                                p="md"
                                style={{
                                    background: 'rgba(255,255,255,0.05)',
                                    borderRadius: 12,
                                }}
                            >
                                <Text fw={500} style={{ color: 'white' }}>FABMenu</Text>
                                <Text size="sm" style={{ color: 'rgba(255,255,255,0.6)' }}>
                                    Floating Action Button với expandable menu items.
                                </Text>
                            </Box>
                        </SimpleGrid>
                    </Box>
                </motion.div>
            </Container>

            {/* FAB Menu */}
            <FABMenu
                items={[
                    {
                        icon: <IconMicrophone size={20} />,
                        label: 'Tạo phòng mới',
                        onClick: () => alert('Tạo phòng!'),
                        color: '#34C759',
                    },
                    {
                        icon: <IconVideo size={20} />,
                        label: 'Tham gia phòng',
                        onClick: () => alert('Tham gia!'),
                        color: '#FF9500',
                    },
                ]}
                mainIcon={<IconPlus size={24} />}
            />
        </Box>
    );
}
