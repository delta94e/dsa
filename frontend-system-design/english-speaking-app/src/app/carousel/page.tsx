'use client';

import { Box, Container, Title, Text, Stack, SimpleGrid } from '@mantine/core';
import { motion } from 'framer-motion';

import { ExpandingCarousel, RoomExpandingCarousel, VerticalExpandingList } from '@/shared/components/ui/ExpandingCarousel';

// Demo data for destinations
const destinations = [
    {
        key: '1',
        title: 'Đà Lạt, Việt Nam',
        subtitle: '5 ngày',
        image: 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=800',
        color: '#228B22',
    },
    {
        key: '2',
        title: 'Tokyo, Japan',
        subtitle: '7 ngày',
        image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800',
        color: '#DC143C',
    },
    {
        key: '3',
        title: 'Seoul, Korea',
        subtitle: '4 ngày',
        image: 'https://images.unsplash.com/photo-1538485399081-7191377e8241?w=800',
        color: '#4169E1',
    },
    {
        key: '4',
        title: 'Singapore',
        subtitle: '3 ngày',
        image: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=800',
        color: '#FF4500',
    },
];

// Demo rooms
const rooms = [
    {
        id: '1',
        name: 'Daily Conversation',
        topic: 'Nói chuyện hàng ngày với chủ đề tự do',
        level: 'A1',
        participantCount: 4,
        maxParticipants: 8,
        image: 'https://images.unsplash.com/photo-1543269865-cbf427effbad?w=800',
        isLive: true,
    },
    {
        id: '2',
        name: 'Business English',
        topic: 'Tiếng Anh giao tiếp công việc',
        level: 'B2',
        participantCount: 3,
        maxParticipants: 6,
        image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800',
        isLive: true,
    },
    {
        id: '3',
        name: 'IELTS Speaking',
        topic: 'Luyện thi IELTS Speaking Part 2',
        level: 'C1',
        participantCount: 2,
        maxParticipants: 4,
        image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800',
        isLive: false,
    },
    {
        id: '4',
        name: 'Travel & Culture',
        topic: 'Du lịch và văn hóa các nước',
        level: 'B1',
        participantCount: 5,
        maxParticipants: 8,
        image: 'https://images.unsplash.com/photo-1488085061387-422e29b40080?w=800',
        isLive: true,
    },
];

export default function CarouselDemoPage() {
    return (
        <Box
            style={{
                minHeight: '100vh',
                background: 'linear-gradient(180deg, #0F0F1A 0%, #1A1A2E 50%, #16213E 100%)',
            }}
        >
            <Container size="xl" py={60}>
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
                            Inspired by React Native Moti
                        </Text>
                        <Title order={2} mb="md" style={{ color: 'white' }}>
                            Expanding Carousel Demo
                        </Title>
                        <Text style={{ color: 'rgba(255,255,255,0.7)' }} maw={600} mx="auto">
                            Nhấp vào các panel để xem animation flex expansion.
                            Panel được chọn sẽ mở rộng với smooth transition.
                        </Text>
                    </Box>
                </motion.div>

                <Stack gap="xl">
                    {/* Horizontal Carousel - Light Theme (Original) */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                    >
                        <Text fw={600} mb="md" style={{ color: 'white' }}>
                            🌍 Destinations Carousel (Light Theme)
                        </Text>
                        <ExpandingCarousel 
                            items={destinations}
                            height={350}
                            onSelect={(item) => console.log('Selected:', item.title)}
                        />
                    </motion.div>

                    {/* Room Carousel - Dark Theme */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <Text fw={600} mb="md" style={{ color: 'white' }}>
                            🎙️ Rooms Carousel (Dark Theme)
                        </Text>
                        <RoomExpandingCarousel 
                            rooms={rooms}
                            height={400}
                            onSelectRoom={(room) => console.log('Selected room:', room.name)}
                        />
                    </motion.div>

                    {/* Vertical List */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        <SimpleGrid cols={{ base: 1, md: 2 }} spacing="xl">
                            <Box>
                                <Text fw={600} mb="md" style={{ color: 'white' }}>
                                    📋 Vertical Expanding List
                                </Text>
                                <VerticalExpandingList 
                                    items={destinations}
                                    onSelect={(item) => console.log('Selected:', item.title)}
                                />
                            </Box>

                            <Box>
                                <Box
                                    p="xl"
                                    style={{
                                        background: 'rgba(255, 255, 255, 0.05)',
                                        backdropFilter: 'blur(20px)',
                                        borderRadius: 24,
                                        border: '1px solid rgba(255, 255, 255, 0.1)',
                                        height: '100%',
                                    }}
                                >
                                    <Text fw={600} mb="lg" style={{ color: 'white' }}>
                                        Animation Features
                                    </Text>
                                    <Stack gap="md">
                                        {[
                                            { icon: '📊', title: 'Flex Expansion', desc: 'Selected: flex 8, Others: flex 1' },
                                            { icon: '🔵', title: 'Color Indicator', desc: 'Circle changes color on selection' },
                                            { icon: '➡️', title: 'Text Animations', desc: 'FadeInRight / FadeOutLeft' },
                                            { icon: '⚡', title: 'Smooth Easing', desc: 'Cubic bezier [0.4, 0, 0.2, 1]' },
                                            { icon: '🖼️', title: 'Cover Images', desc: 'Full bleed background images' },
                                        ].map((feature, i) => (
                                            <motion.div
                                                key={feature.title}
                                                initial={{ opacity: 0, x: 20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: 0.4 + i * 0.1 }}
                                            >
                                                <Box
                                                    p="sm"
                                                    style={{
                                                        background: 'rgba(255,255,255,0.05)',
                                                        borderRadius: 12,
                                                    }}
                                                >
                                                    <Text span style={{ marginRight: 8 }}>{feature.icon}</Text>
                                                    <Text span fw={500} c="white">{feature.title}</Text>
                                                    <Text size="sm" c="dimmed" ml={28}>
                                                        {feature.desc}
                                                    </Text>
                                                </Box>
                                            </motion.div>
                                        ))}
                                    </Stack>
                                </Box>
                            </Box>
                        </SimpleGrid>
                    </motion.div>
                </Stack>
            </Container>
        </Box>
    );
}
