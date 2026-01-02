'use client';

import { useState } from 'react';
import { Box, Container, Title, Text, Stack, SimpleGrid, SegmentedControl, Group } from '@mantine/core';
import { motion } from 'framer-motion';

import {
    ProductGallery,
    ProductPage,
    RoomPreviewGallery,
    DotIndicator,
} from '@/shared/components/ui/ProductGallery';

const productImages = [
    'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800',
    'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800',
    'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800',
    'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=800',
    'https://images.unsplash.com/photo-1594223274512-ad4803739b7c?w=800',
];

const roomImages = [
    { url: 'https://images.unsplash.com/photo-1543269865-cbf427effbad?w=800', caption: 'Thảo luận nhóm' },
    { url: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800', caption: 'Speaking practice' },
    { url: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800', caption: 'Business meeting' },
    { url: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=800', caption: 'Conference' },
];

export default function GalleryDemoPage() {
    const [demoMode, setDemoMode] = useState<'product' | 'room' | 'indicators'>('indicators');
    const [indicatorIndex, setIndicatorIndex] = useState(0);

    if (demoMode === 'product') {
        return (
            <ProductPage
                images={productImages}
                details={{
                    title: 'SOFT MINI CROSSBODY BAG WITH KISS LOCK',
                    price: '699.000₫',
                    description: 'Mini crossbody bag available in various colours. Featuring two compartments. Handles and detachable crossbody shoulder strap. Lined interior. Clasp with two metal pieces.',
                    specs: 'Height x Length x Width: 14 x 21.5 x 4.5 cm',
                    badges: ['New Arrival', 'Trending'],
                }}
                onAddToCart={() => alert('Added to cart!')}
                onFavorite={() => alert('Added to favorites!')}
            />
        );
    }

    if (demoMode === 'room') {
        return (
            <RoomPreviewGallery
                images={roomImages}
                roomName="Daily Conversation"
                roomTopic="Nói chuyện về cuộc sống hàng ngày"
                participantCount={5}
                maxParticipants={8}
                level="B1"
                onJoin={() => alert('Joining room!')}
            />
        );
    }

    // Indicators demo
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
                            Inspired by Zara Product Gallery
                        </Text>
                        <Title order={2} mb="md" style={{ color: 'white' }}>
                            Product Gallery Demo
                        </Title>
                        <Text style={{ color: 'rgba(255,255,255,0.7)' }} maw={600} mx="auto" mb="lg">
                            Vertical snap scroll với animated dot indicator.
                            Bottom sheet hiển thị chi tiết sản phẩm.
                        </Text>
                        
                        <SegmentedControl
                            value={demoMode}
                            onChange={(v) => setDemoMode(v as typeof demoMode)}
                            data={[
                                { label: '🔘 Indicators', value: 'indicators' },
                                { label: '👜 Product', value: 'product' },
                                { label: '🎙️ Room', value: 'room' },
                            ]}
                            style={{ background: 'rgba(255,255,255,0.1)' }}
                        />
                    </Box>
                </motion.div>

                <Stack gap="xl">
                    {/* Dot Indicator Demo */}
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
                                🔘 Animated Dot Indicator
                            </Text>
                            
                            <SimpleGrid cols={{ base: 1, md: 2 }} spacing="xl">
                                {/* Vertical */}
                                <Box ta="center">
                                    <Text size="sm" c="dimmed" mb="md">Vertical</Text>
                                    <Group justify="center" gap="xl">
                                        <DotIndicator
                                            count={5}
                                            activeIndex={indicatorIndex}
                                            direction="vertical"
                                        />
                                        <DotIndicator
                                            count={5}
                                            activeIndex={indicatorIndex}
                                            direction="vertical"
                                            dotColor="rgba(255,255,255,0.2)"
                                            activeColor="#667eea"
                                        />
                                        <DotIndicator
                                            count={5}
                                            activeIndex={indicatorIndex}
                                            direction="vertical"
                                            dotColor="rgba(255,255,255,0.2)"
                                            activeColor="#4ade80"
                                        />
                                    </Group>
                                </Box>

                                {/* Horizontal */}
                                <Box ta="center">
                                    <Text size="sm" c="dimmed" mb="md">Horizontal</Text>
                                    <Stack align="center" gap="lg">
                                        <DotIndicator
                                            count={5}
                                            activeIndex={indicatorIndex}
                                            direction="horizontal"
                                        />
                                        <DotIndicator
                                            count={5}
                                            activeIndex={indicatorIndex}
                                            direction="horizontal"
                                            dotColor="rgba(255,255,255,0.2)"
                                            activeColor="#f97316"
                                        />
                                    </Stack>
                                </Box>
                            </SimpleGrid>

                            {/* Controls */}
                            <Group justify="center" mt="xl">
                                {[0, 1, 2, 3, 4].map((i) => (
                                    <Box
                                        key={i}
                                        onClick={() => setIndicatorIndex(i)}
                                        style={{
                                            width: 40,
                                            height: 40,
                                            borderRadius: 8,
                                            background: indicatorIndex === i 
                                                ? 'linear-gradient(135deg, #667eea, #764ba2)' 
                                                : 'rgba(255,255,255,0.1)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            cursor: 'pointer',
                                        }}
                                    >
                                        <Text fw={600} c="white" size="sm">
                                            {i + 1}
                                        </Text>
                                    </Box>
                                ))}
                            </Group>
                        </Box>
                    </motion.div>

                    {/* Gallery Preview */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <Box
                            style={{
                                background: 'rgba(255, 255, 255, 0.05)',
                                backdropFilter: 'blur(20px)',
                                borderRadius: 20,
                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                overflow: 'hidden',
                            }}
                        >
                            <Text size="sm" p="lg" pb={0} style={{ color: 'rgba(255,255,255,0.5)' }}>
                                📸 Gallery Preview (Scroll to navigate)
                            </Text>
                            <ProductGallery
                                images={productImages}
                                height={400}
                                showIndicator={true}
                            />
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
                                Animation Features
                            </Text>
                            <SimpleGrid cols={{ base: 2, sm: 3 }} spacing="md">
                                {[
                                    { icon: '📸', title: 'Snap Scroll', desc: 'CSS scroll-snap-type' },
                                    { icon: '🔘', title: 'Ring Indicator', desc: 'Animated ring follows dot' },
                                    { icon: '📋', title: 'Bottom Sheet', desc: 'Details panel với snap' },
                                    { icon: '🔗', title: 'Scroll-linked', desc: 'Indicator theo scroll' },
                                    { icon: '🌊', title: 'Spring Physics', desc: 'Smooth transitions' },
                                    { icon: '🎙️', title: 'Room Variant', desc: 'Gallery cho phòng học' },
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
