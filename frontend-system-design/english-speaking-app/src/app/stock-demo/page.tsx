'use client';

import { Box, Container, Title, Text, Stack, SimpleGrid } from '@mantine/core';
import { motion } from 'framer-motion';

import { 
    SparkLine, 
    MarqueeTicker, 
    RoomStatsDashboard 
} from '@/shared/components/ui/StockDashboard';

// Generate random sparkline data
const generateSparklineData = (points = 20, trend: 'up' | 'down' | 'mixed' = 'mixed') => {
    const data: number[] = [];
    let value = 50 + Math.random() * 50;
    
    for (let i = 0; i < points; i++) {
        const change = (Math.random() - 0.5) * 10;
        if (trend === 'up') value += Math.abs(change) * 0.5;
        else if (trend === 'down') value -= Math.abs(change) * 0.5;
        else value += change;
        
        data.push(Math.max(10, value));
    }
    return data;
};

// Demo ticker items
const tickerItems = [
    {
        id: '1',
        symbol: 'CONV',
        name: 'Daily Conversation',
        image: 'https://api.dicebear.com/7.x/icons/svg?seed=1',
        currentValue: 5,
        change: 2.5,
        changePercent: 15,
        sparklineData: generateSparklineData(20, 'up'),
    },
    {
        id: '2',
        symbol: 'BUSI',
        name: 'Business English',
        image: 'https://api.dicebear.com/7.x/icons/svg?seed=2',
        currentValue: 3,
        change: -1.2,
        changePercent: -8,
        sparklineData: generateSparklineData(20, 'down'),
    },
    {
        id: '3',
        symbol: 'IELT',
        name: 'IELTS Speaking',
        image: 'https://api.dicebear.com/7.x/icons/svg?seed=3',
        currentValue: 4,
        change: 0.8,
        changePercent: 5,
        sparklineData: generateSparklineData(20, 'up'),
    },
    {
        id: '4',
        symbol: 'TRAV',
        name: 'Travel Topics',
        image: 'https://api.dicebear.com/7.x/icons/svg?seed=4',
        currentValue: 6,
        change: 1.5,
        changePercent: 10,
        sparklineData: generateSparklineData(20, 'up'),
    },
    {
        id: '5',
        symbol: 'TECH',
        name: 'Tech Discussion',
        image: 'https://api.dicebear.com/7.x/icons/svg?seed=5',
        currentValue: 2,
        change: -0.5,
        changePercent: -3,
        sparklineData: generateSparklineData(20, 'down'),
    },
    {
        id: '6',
        symbol: 'CULT',
        name: 'Culture Exchange',
        image: 'https://api.dicebear.com/7.x/icons/svg?seed=6',
        currentValue: 7,
        change: 3.2,
        changePercent: 20,
        sparklineData: generateSparklineData(20, 'up'),
    },
];

// Demo room stats
const roomStats = [
    {
        id: '1',
        name: 'Daily Conversation',
        topic: 'Nói chuyện về cuộc sống hàng ngày',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=room1',
        participantCount: 5,
        maxParticipants: 8,
        activeMinutes: 45,
        trend: 25,
        activityData: generateSparklineData(20, 'up'),
        isLive: true,
    },
    {
        id: '2',
        name: 'Business English',
        topic: 'Tiếng Anh giao tiếp công việc',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=room2',
        participantCount: 3,
        maxParticipants: 6,
        activeMinutes: 30,
        trend: -8,
        activityData: generateSparklineData(20, 'down'),
        isLive: true,
    },
    {
        id: '3',
        name: 'IELTS Speaking',
        topic: 'Luyện thi IELTS Speaking Part 2 & 3',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=room3',
        participantCount: 4,
        maxParticipants: 4,
        activeMinutes: 60,
        trend: 15,
        activityData: generateSparklineData(20, 'up'),
        isLive: true,
    },
    {
        id: '4',
        name: 'Travel & Adventure',
        topic: 'Chia sẻ kinh nghiệm du lịch',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=room4',
        participantCount: 6,
        maxParticipants: 10,
        activeMinutes: 25,
        trend: 5,
        activityData: generateSparklineData(20, 'mixed'),
        isLive: true,
    },
    {
        id: '5',
        name: 'Tech Talk',
        topic: 'Thảo luận về công nghệ mới',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=room5',
        participantCount: 2,
        maxParticipants: 6,
        activeMinutes: 15,
        trend: -12,
        activityData: generateSparklineData(20, 'down'),
        isLive: false,
    },
];

export default function StockDemoPage() {
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
                            Inspired by Apple Stocks / Crypto Apps
                        </Text>
                        <Title order={2} mb="md" style={{ color: 'white' }}>
                            Stock Dashboard Demo
                        </Title>
                        <Text style={{ color: 'rgba(255,255,255,0.7)' }} maw={600} mx="auto">
                            SparkLine charts, Marquee ticker, và Bottom Sheet animations.
                        </Text>
                    </Box>
                </motion.div>

                <Stack gap="xl">
                    {/* SparkLine Demo */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
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
                                📈 SparkLine Charts
                            </Text>
                            <SimpleGrid cols={{ base: 2, sm: 3, md: 6 }} spacing="lg">
                                {[
                                    { label: 'Trending Up', data: generateSparklineData(20, 'up'), color: 'rgb(76, 195, 138)' },
                                    { label: 'Trending Down', data: generateSparklineData(20, 'down'), color: 'rgb(255, 99, 105)' },
                                    { label: 'Mixed', data: generateSparklineData(20, 'mixed'), color: '#667eea' },
                                    { label: 'Purple', data: generateSparklineData(20, 'up'), color: '#a855f7' },
                                    { label: 'Orange', data: generateSparklineData(20, 'mixed'), color: '#f97316' },
                                    { label: 'Cyan', data: generateSparklineData(20, 'down'), color: '#22d3ee' },
                                ].map((item) => (
                                    <Box key={item.label} ta="center">
                                        <SparkLine
                                            data={item.data}
                                            color={item.color}
                                            width={100}
                                            height={50}
                                        />
                                        <Text size="xs" c="dimmed" mt="xs">
                                            {item.label}
                                        </Text>
                                    </Box>
                                ))}
                            </SimpleGrid>
                        </Box>
                    </motion.div>

                    {/* Marquee Ticker Demo */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <Box
                            p="xl"
                            style={{
                                background: '#000',
                                borderRadius: 20,
                                border: '1px solid rgba(255, 255, 255, 0.1)',
                            }}
                        >
                            <Text size="sm" mb="lg" style={{ color: 'rgba(255,255,255,0.5)' }}>
                                🎢 Marquee Ticker
                            </Text>
                            <MarqueeTicker items={tickerItems} speed={40} gap={50} />
                        </Box>
                    </motion.div>

                    {/* Features */}
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
                                borderRadius: 24,
                                border: '1px solid rgba(255, 255, 255, 0.1)',
                            }}
                        >
                            <Text fw={600} size="lg" mb="lg" style={{ color: 'white' }}>
                                Components & Features
                            </Text>
                            <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="md">
                                {[
                                    { icon: '📈', title: 'SparkLine', desc: 'SVG mini charts với gradient fill' },
                                    { icon: '🎢', title: 'MarqueeTicker', desc: 'Auto-scrolling ticker với sparklines' },
                                    { icon: '📋', title: 'BottomSheet', desc: 'Snap points với spring animation' },
                                    { icon: '💹', title: 'Trend Colors', desc: 'Red/Green cho price change' },
                                    { icon: '🔄', title: 'Animated Opacity', desc: 'Content fade based on sheet position' },
                                    { icon: '📊', title: 'RoomStatsDashboard', desc: 'Full dashboard variant cho rooms' },
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
                                        <Text span fw={500} c="white">{feature.title}</Text>
                                        <Text size="sm" c="dimmed" mt={4}>
                                            {feature.desc}
                                        </Text>
                                    </Box>
                                ))}
                            </SimpleGrid>
                        </Box>
                    </motion.div>

                    {/* Full Dashboard Preview Note */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                    >
                        <Box
                            p="xl"
                            ta="center"
                            style={{
                                background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.2), rgba(118, 75, 162, 0.2))',
                                borderRadius: 24,
                                border: '1px solid rgba(255, 255, 255, 0.1)',
                            }}
                        >
                            <Text size="lg" fw={600} c="white" mb="sm">
                                💡 Full Dashboard Demo
                            </Text>
                            <Text c="dimmed">
                                Để xem RoomStatsDashboard với BottomSheet đầy đủ, 
                                bạn có thể import và sử dụng component riêng trong một page full-screen.
                            </Text>
                        </Box>
                    </motion.div>
                </Stack>
            </Container>
        </Box>
    );
}
