'use client';

import {
  Container,
  Title,
  Text,
  Button,
  Group,
  Stack,
  Card,
  SimpleGrid,
  Badge,
  ThemeIcon,
  Box,
} from '@mantine/core';
import {
  IconMicrophone,
  IconUsers,
  IconRobot,
  IconWorld,
  IconBrandGoogle,
  IconArrowRight,
} from '@tabler/icons-react';
import Link from 'next/link';
import { LEVELS } from '@/types';
import { UserMenu } from '@/shared/components/ui/UserMenu';
import { FeatureFlagMenu, useFlags } from '@/shared/components/ui/FeatureFlagMenu';

export default function HomePage() {
  // 🚀 Dynamic flags - access any flag without declaration!
  const flags = useFlags();

  return (
    <Box
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      }}
    >
      {/* Header with FeatureFlags and UserMenu */}
      <Box py="md" px="lg">
        <Group justify="flex-end" gap="sm">
          <FeatureFlagMenu />
          <UserMenu />
        </Group>
      </Box>

      <Container size="lg" py="xl">
        {/* Hero Section */}
        <Stack align="center" gap="xl" py={60}>
          <Badge size="lg" variant="white" color="dark">
            🌍 Join 10,000+ learners worldwide
          </Badge>

          <Title
            ta="center"
            style={{
              fontSize: 'clamp(2.5rem, 5vw, 4rem)',
              color: 'white',
              fontWeight: 800,
            }}
          >
            Practice English Speaking
            <br />
            <Text
              component="span"
              inherit
              style={{
                background: 'linear-gradient(90deg, #FFD700, #FFA500)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              With Real People & AI
            </Text>
          </Title>

          <Text
            size="xl"
            ta="center"
            maw={600}
            style={{ color: 'rgba(255,255,255,0.9)' }}
          >
            Join voice rooms to practice English with learners from around the world,
            or chat with our AI tutor anytime, anywhere.
          </Text>

          <Group mt="lg">
            <Link href="/rooms" style={{ textDecoration: 'none' }}>
              <Button
                size="xl"
                radius="xl"
                leftSection={<IconMicrophone size={20} />}
                style={{
                  background: 'white',
                  color: '#764ba2',
                  fontWeight: 600,
                }}
              >
                Browse Rooms
              </Button>
            </Link>
            {flags.ai_practice.enabled && (
              <Link href="/ai-practice" style={{ textDecoration: 'none' }}>
                <Button
                  size="xl"
                  radius="xl"
                  variant="outline"
                  leftSection={<IconRobot size={20} />}
                  style={{
                    borderColor: 'white',
                    color: 'white',
                    fontWeight: 600,
                  }}
                >
                  Practice with AI
                </Button>
              </Link>
            )}
          </Group>
        </Stack>

        {/* Features */}
        <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="lg" mt={60}>
          <Card shadow="md" padding="xl" radius="lg">
            <ThemeIcon size={50} radius="xl" color="green" mb="md">
              <IconWorld size={28} />
            </ThemeIcon>
            <Title order={3} mb="sm">
              Global Community
            </Title>
            <Text c="dimmed">
              Connect with English learners from over 50 countries in real-time voice rooms.
            </Text>
          </Card>

          <Card shadow="md" padding="xl" radius="lg">
            <ThemeIcon size={50} radius="xl" color="blue" mb="md">
              <IconRobot size={28} />
            </ThemeIcon>
            <Title order={3} mb="sm">
              AI Tutor 24/7
            </Title>
            <Text c="dimmed">
              Practice speaking anytime with our AI that adapts to your level and gives feedback.
            </Text>
          </Card>

          <Card shadow="md" padding="xl" radius="lg">
            <ThemeIcon size={50} radius="xl" color="orange" mb="md">
              <IconUsers size={28} />
            </ThemeIcon>
            <Title order={3} mb="sm">
              Level-Based Rooms
            </Title>
            <Text c="dimmed">
              Find rooms that match your skill level from A1 (Beginner) to C2 (Proficient).
            </Text>
          </Card>
        </SimpleGrid>

        {/* Level Badges */}
        <Box ta="center" mt={80}>
          <Title order={2} c="white" mb="lg">
            All CEFR Levels Supported
          </Title>
          <Group justify="center" gap="md">
            {LEVELS.map((level) => (
              <Badge
                key={level.code}
                size="xl"
                color={level.color}
                variant="filled"
                style={{ padding: '12px 24px' }}
              >
                {level.code} - {level.name}
              </Badge>
            ))}
          </Group>
        </Box>

        {/* CTA */}
        <Box ta="center" mt={80} pb={40}>
          <Link href="/rooms" style={{ textDecoration: 'none' }}>
            <Button
              size="xl"
              radius="xl"
              rightSection={<IconArrowRight size={20} />}
              style={{
                background: 'white',
                color: '#764ba2',
                fontWeight: 600,
              }}
            >
              Start Speaking Now
            </Button>
          </Link>
        </Box>
      </Container>
    </Box>
  );
}
