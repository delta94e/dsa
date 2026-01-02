'use client';

import { useState, useEffect } from 'react';
import { Box, Container, Title, Text, Stack, SimpleGrid, Button, Group, Slider } from '@mantine/core';
import { motion } from 'framer-motion';
import { IconPlus, IconMinus, IconRefresh, IconCoin } from '@tabler/icons-react';

import {
    AnimatedNumberInput,
    AnimatedCounterDisplay,
    XPCounter,
    TimerDisplay,
    CurrencyInput,
} from '@/shared/components/ui/AnimatedNumberInput';

export default function NumberInputDemoPage() {
    const [counter, setCounter] = useState(1234);
    const [xp, setXp] = useState(2450);
    const [prevXp, setPrevXp] = useState(2450);
    const [timer, setTimer] = useState(125);
    const [currency, setCurrency] = useState(0);
    const [sliderValue, setSliderValue] = useState(50000);

    // Timer countdown
    useEffect(() => {
        const interval = setInterval(() => {
            setTimer(prev => (prev > 0 ? prev - 1 : 125));
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    const addXP = (amount: number) => {
        setPrevXp(xp);
        setXp(prev => prev + amount);
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
                            Inspired by React Native Reanimated
                        </Text>
                        <Title order={2} mb="md" style={{ color: 'white' }}>
                            Animated Number Input Demo
                        </Title>
                        <Text style={{ color: 'rgba(255,255,255,0.7)' }} maw={600} mx="auto">
                            Số được animate với SlideInDown/SlideOutDown cho từng digit.
                            Có gradient overlay ở top và bottom.
                        </Text>
                    </Box>
                </motion.div>

                <Stack gap="xl">
                    {/* Counter Demo */}
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
                                🔢 Animated Counter Display
                            </Text>
                            
                            <Box mb="lg">
                                <AnimatedCounterDisplay
                                    value={counter}
                                    fontSize={64}
                                    color="white"
                                />
                            </Box>
                            
                            <Group justify="center" gap="md">
                                <Button
                                    leftSection={<IconMinus size={16} />}
                                    onClick={() => setCounter(prev => Math.max(0, prev - 100))}
                                    variant="light"
                                    color="red"
                                >
                                    -100
                                </Button>
                                <Button
                                    leftSection={<IconPlus size={16} />}
                                    onClick={() => setCounter(prev => prev + 100)}
                                    variant="light"
                                    color="green"
                                >
                                    +100
                                </Button>
                                <Button
                                    leftSection={<IconRefresh size={16} />}
                                    onClick={() => setCounter(1234)}
                                    variant="subtle"
                                    color="gray"
                                >
                                    Reset
                                </Button>
                            </Group>
                        </Box>
                    </motion.div>

                    {/* XP Counter Demo */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <Box
                            p="xl"
                            style={{
                                background: 'linear-gradient(135deg, rgba(255, 215, 0, 0.1), rgba(255, 165, 0, 0.1))',
                                borderRadius: 20,
                                border: '1px solid rgba(255, 215, 0, 0.2)',
                            }}
                        >
                            <Text size="sm" mb="lg" style={{ color: 'rgba(255,255,255,0.5)' }}>
                                ⭐ XP Counter with Delta Animation
                            </Text>
                            
                            <Box mb="lg" ta="center">
                                <XPCounter value={xp} previousValue={prevXp} />
                            </Box>
                            
                            <Group justify="center" gap="md">
                                <Button
                                    leftSection={<IconCoin size={16} />}
                                    onClick={() => addXP(50)}
                                    variant="gradient"
                                    gradient={{ from: 'orange', to: 'yellow' }}
                                >
                                    +50 XP
                                </Button>
                                <Button
                                    leftSection={<IconCoin size={16} />}
                                    onClick={() => addXP(100)}
                                    variant="gradient"
                                    gradient={{ from: 'orange', to: 'red' }}
                                >
                                    +100 XP
                                </Button>
                            </Group>
                        </Box>
                    </motion.div>

                    <SimpleGrid cols={{ base: 1, md: 2 }} spacing="xl">
                        {/* Timer Display */}
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
                                <Text size="sm" mb="lg" style={{ color: 'rgba(255,255,255,0.5)' }}>
                                    ⏱️ Timer Display
                                </Text>
                                
                                <Box ta="center">
                                    <TimerDisplay
                                        seconds={timer}
                                        fontSize={56}
                                        color="#4ade80"
                                    />
                                </Box>
                            </Box>
                        </motion.div>

                        {/* Slider Counter */}
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
                                <Text size="sm" mb="lg" style={{ color: 'rgba(255,255,255,0.5)' }}>
                                    🎚️ Slider Counter
                                </Text>
                                
                                <Box ta="center" mb="lg">
                                    <AnimatedCounterDisplay
                                        value={sliderValue}
                                        fontSize={48}
                                        color="#a855f7"
                                        prefix="$"
                                        formatter={new Intl.NumberFormat('en-US')}
                                    />
                                </Box>
                                
                                <Slider
                                    value={sliderValue}
                                    onChange={setSliderValue}
                                    min={0}
                                    max={100000}
                                    step={1000}
                                    color="grape"
                                    size="lg"
                                    styles={{
                                        track: { background: 'rgba(255,255,255,0.1)' },
                                    }}
                                />
                            </Box>
                        </motion.div>
                    </SimpleGrid>

                    {/* Currency Input */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                    >
                        <Box
                            p="xl"
                            style={{
                                background: '#1a1a2e',
                                borderRadius: 20,
                                border: '1px solid rgba(255, 255, 255, 0.1)',
                            }}
                        >
                            <Text size="sm" mb="lg" style={{ color: 'rgba(255,255,255,0.5)' }}>
                                💰 Currency Input (Editable - Click to type)
                            </Text>
                            
                            <CurrencyInput
                                value={currency}
                                onChange={setCurrency}
                                currency="USD"
                            />
                        </Box>
                    </motion.div>

                    {/* Features */}
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
                                    { icon: '🔢', label: 'Sliding Digits' },
                                    { icon: '💰', label: 'Number Formatting' },
                                    { icon: '🌫️', label: 'Gradient Overlays' },
                                    { icon: '🔄', label: 'Layout Animation' },
                                    { icon: '⭐', label: 'Delta Indicators' },
                                    { icon: '⏱️', label: 'Timer Support' },
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
