'use client';

import { useState } from 'react';
import { Box, Container, Title, Text, Stack, Button, Group, SegmentedControl } from '@mantine/core';
import { motion } from 'framer-motion';
import { IconRefresh } from '@tabler/icons-react';

import {
    AnimatedSentence,
    AnimatedSentenceSwitch,
    AnimatedCharacters,
    Typewriter,
    RotatingText,
    HighlightSentence,
} from '@/shared/components/ui/AnimatedText';

const sampleTexts = [
    'Nâng cao kỹ năng nói tiếng Anh',
    'Luyện tập mỗi ngày với AI',
    'Kết nối với người học toàn cầu',
    'Học tiếng Anh thật dễ dàng',
];

export default function TextAnimationDemoPage() {
    const [key, setKey] = useState(0);
    const [currentTextIndex, setCurrentTextIndex] = useState(0);

    const resetAnimations = () => {
        setKey(prev => prev + 1);
        setCurrentTextIndex(prev => (prev + 1) % sampleTexts.length);
    };

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
                            Inspired by Mustard Golf App
                        </Text>
                        <Title order={2} mb="md" style={{ color: 'white' }}>
                            Animated Text Demo
                        </Title>
                        <Text style={{ color: 'rgba(255,255,255,0.7)' }} maw={600} mx="auto" mb="lg">
                            Các animation text word-by-word với SlideInDown và spring physics.
                        </Text>
                        <Button
                            leftSection={<IconRefresh size={18} />}
                            onClick={resetAnimations}
                            variant="light"
                            color="grape"
                        >
                            Reset Animations
                        </Button>
                    </Box>
                </motion.div>

                <Stack gap="xl" key={key}>
                    {/* Animated Sentence */}
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
                                📝 AnimatedSentence - Word by Word Slide
                            </Text>
                            <AnimatedSentence
                                fontSize={36}
                                color="white"
                                fontWeight={700}
                                stagger={100}
                                onEnterFinish={(count) => console.log(`Completed ${count} words`)}
                            >
                                {sampleTexts[currentTextIndex]}
                            </AnimatedSentence>
                        </Box>
                    </motion.div>

                    {/* Animated Sentence Switch */}
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
                                🔄 RotatingText - Auto Cycling Texts
                            </Text>
                            <RotatingText
                                texts={sampleTexts}
                                interval={3000}
                                fontSize={32}
                                stagger={80}
                            />
                        </Box>
                    </motion.div>

                    {/* Highlight Sentence */}
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
                                ✨ HighlightSentence - Gradient Highlighted Words
                            </Text>
                            <HighlightSentence
                                fontSize={32}
                                highlightWords={['tiếng Anh', 'AI', 'Speaking']}
                                highlightColor="linear-gradient(135deg, #667eea, #764ba2)"
                            >
                                Luyện Speaking tiếng Anh với AI hàng ngày
                            </HighlightSentence>
                        </Box>
                    </motion.div>

                    {/* Character Animation */}
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
                                🔤 AnimatedCharacters - Character by Character
                            </Text>
                            <AnimatedCharacters
                                fontSize={28}
                                stagger={30}
                                color="#FA75BB"
                            >
                                Hello World!
                            </AnimatedCharacters>
                        </Box>
                    </motion.div>

                    {/* Typewriter */}
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
                            }}
                        >
                            <Text size="sm" mb="lg" style={{ color: 'rgba(255,255,255,0.5)' }}>
                                ⌨️ Typewriter - Classic Typing Effect
                            </Text>
                            <Typewriter
                                text="Chào mừng bạn đến với English Speaking App! Hãy bắt đầu học ngay..."
                                speed={50}
                                fontSize={24}
                                color="#4ade80"
                            />
                        </Box>
                    </motion.div>

                    {/* Animation Features */}
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
                                borderRadius: 24,
                                border: '1px solid rgba(255, 255, 255, 0.1)',
                            }}
                        >
                            <Text fw={600} size="lg" mb="lg" style={{ color: 'white' }}>
                                Animation Features
                            </Text>
                            <Group gap="md" wrap="wrap">
                                {[
                                    { icon: '⬆️', label: 'SlideInDown' },
                                    { icon: '🌊', label: 'Spring Physics' },
                                    { icon: '⏱️', label: 'Staggered Delay' },
                                    { icon: '✂️', label: 'Overflow Clip' },
                                    { icon: '🎯', label: 'Callbacks' },
                                    { icon: '🔄', label: 'AnimatePresence' },
                                ].map((feature) => (
                                    <Box
                                        key={feature.label}
                                        p="sm"
                                        style={{
                                            background: 'rgba(255,255,255,0.05)',
                                            borderRadius: 12,
                                        }}
                                    >
                                        <Text span style={{ marginRight: 8 }}>{feature.icon}</Text>
                                        <Text span c="white" size="sm">{feature.label}</Text>
                                    </Box>
                                ))}
                            </Group>
                        </Box>
                    </motion.div>
                </Stack>
            </Container>
        </Box>
    );
}
