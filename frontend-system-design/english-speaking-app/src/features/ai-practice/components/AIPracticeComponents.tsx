'use client';

import { useState } from 'react';
import {
  Paper,
  Stack,
  Group,
  Button,
  TextInput,
  Card,
  Badge,
  SimpleGrid,
  Avatar,
  ActionIcon,
  Box,
  Text,
  Title,
  Loader,
  Alert,
  Container,
} from '@mantine/core';
import {
  IconArrowLeft,
  IconMicrophone,
  IconMicrophoneOff,
  IconSend,
  IconVolume,
  IconAlertCircle,
} from '@tabler/icons-react';
import { Level, LEVELS, AI_TOPICS, LEVEL_COLORS, AIMessage } from '@/types';

// ═══════════════════════════════════════════════════════════════
// Feature Disabled Modal
// ═══════════════════════════════════════════════════════════════
interface FeatureDisabledModalProps {
  onGoHome: () => void;
}

export function FeatureDisabledModal({ onGoHome }: FeatureDisabledModalProps) {
  return (
    <Box
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: 'rgba(0, 0, 0, 0.7)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Paper p="xl" radius="lg" shadow="xl" style={{ maxWidth: 450, width: '90%', textAlign: 'center' }}>
        <Stack gap="lg" align="center">
          <Box
            style={{
              width: 80,
              height: 80,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #ff6b35 0%, #f7931e 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <IconAlertCircle size={40} color="white" />
          </Box>
          
          <Title order={2} c="dark">Feature Disabled</Title>
          
          <Text c="dimmed" size="md">
            <strong>AI Practice Mode</strong> has been disabled by an administrator.
          </Text>
          
          <Alert color="orange" variant="light" w="100%">
            <Text size="sm" fw={500}>
              Your session has ended. Please contact support if you believe this is an error.
            </Text>
          </Alert>
          
          <Button
            size="lg"
            fullWidth
            onClick={onGoHome}
            leftSection={<IconArrowLeft size={20} />}
            variant="gradient"
            gradient={{ from: 'blue', to: 'cyan' }}
          >
            Go to Home Page
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
}

// ═══════════════════════════════════════════════════════════════
// Level Selector
// ═══════════════════════════════════════════════════════════════
interface LevelSelectorProps {
  selectedLevel: Level;
  onSelect: (level: Level) => void;
}

export function LevelSelector({ selectedLevel, onSelect }: LevelSelectorProps) {
  return (
    <Paper shadow="sm" p="lg" radius="lg" mb="lg">
      <Title order={4} mb="md">Select Your Level</Title>
      <Group>
        {LEVELS.map((level) => (
          <Button
            key={level.code}
            variant={selectedLevel === level.code ? 'filled' : 'light'}
            color={level.color}
            onClick={() => onSelect(level.code)}
          >
            {level.code} - {level.name}
          </Button>
        ))}
      </Group>
    </Paper>
  );
}

// ═══════════════════════════════════════════════════════════════
// Topic Card
// ═══════════════════════════════════════════════════════════════
interface TopicCardProps {
  topic: typeof AI_TOPICS[number];
  isSelected: boolean;
  onSelect: () => void;
}

export function TopicCard({ topic, isSelected, onSelect }: TopicCardProps) {
  return (
    <Card
      shadow="sm"
      padding="lg"
      radius="md"
      withBorder
      style={{
        cursor: 'pointer',
        borderColor: isSelected ? 'var(--mantine-color-blue-5)' : undefined,
        borderWidth: isSelected ? 2 : 1,
      }}
      onClick={onSelect}
    >
      <Text size="xl" mb="xs">{topic.icon}</Text>
      <Text fw={500}>{topic.name}</Text>
      <Text size="sm" c="dimmed">{topic.description}</Text>
      <Badge size="sm" color={LEVEL_COLORS[topic.suggestedLevel]} mt="sm">
        Suggested: {topic.suggestedLevel}
      </Badge>
    </Card>
  );
}

// ═══════════════════════════════════════════════════════════════
// Topic Selector
// ═══════════════════════════════════════════════════════════════
interface TopicSelectorProps {
  selectedTopic: string | null;
  onSelect: (topicId: string) => void;
}

export function TopicSelector({ selectedTopic, onSelect }: TopicSelectorProps) {
  return (
    <Paper shadow="sm" p="lg" radius="lg" mb="lg">
      <Title order={4} mb="md">Choose a Topic</Title>
      <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="md">
        {AI_TOPICS.map((topic) => (
          <TopicCard
            key={topic.id}
            topic={topic}
            isSelected={selectedTopic === topic.id}
            onSelect={() => onSelect(topic.id)}
          />
        ))}
      </SimpleGrid>
    </Paper>
  );
}

// ═══════════════════════════════════════════════════════════════
// Chat Message
// ═══════════════════════════════════════════════════════════════
interface ChatMessageProps {
  message: AIMessage;
  onSpeak?: (text: string) => void;
}

export function ChatMessage({ message, onSpeak }: ChatMessageProps) {
  const isUser = message.role === 'user';
  const avatarColor = message.isError
    ? (message.errorType === 'blocked' ? 'red' : 'orange')
    : (isUser ? 'green' : 'blue');
  const avatarEmoji = message.isError
    ? (message.errorType === 'blocked' ? '🚫' : '⚠️')
    : (isUser ? '👤' : '🤖');

  return (
    <Group
      align="flex-start"
      style={{ flexDirection: isUser ? 'row-reverse' : 'row' }}
    >
      <Avatar radius="xl" color={avatarColor}>{avatarEmoji}</Avatar>
      <Paper
        shadow="xs"
        p="md"
        radius="lg"
        maw="70%"
        style={{
          background: message.isError
            ? (message.errorType === 'blocked'
                ? 'linear-gradient(135deg, #2d1f1f 0%, #3d2222 100%)'
                : 'linear-gradient(135deg, #3d2f1f 0%, #4d3f22 100%)')
            : (isUser ? 'var(--mantine-color-blue-6)' : 'white'),
          color: message.isError || isUser ? 'white' : 'inherit',
          border: message.isError
            ? (message.errorType === 'blocked' ? '2px solid #ff4444' : '2px solid #ff8800')
            : undefined,
        }}
      >
        <Text>{message.content}</Text>
        {!isUser && onSpeak && (
          <ActionIcon
            variant="subtle"
            size="sm"
            mt="xs"
            onClick={() => onSpeak(message.content)}
          >
            <IconVolume size={16} />
          </ActionIcon>
        )}
      </Paper>
    </Group>
  );
}

// ═══════════════════════════════════════════════════════════════
// Chat Input
// ═══════════════════════════════════════════════════════════════
interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  onVoiceInput: () => void;
  isListening: boolean;
  isLoading: boolean;
  isBlocked: boolean;
}

export function ChatInput({
  value,
  onChange,
  onSend,
  onVoiceInput,
  isListening,
  isLoading,
  isBlocked,
}: ChatInputProps) {
  return (
    <Paper shadow="md" p="md" style={{ flexShrink: 0 }}>
      <Container size="md">
        <Group>
          <ActionIcon
            size="xl"
            radius="xl"
            variant={isListening ? 'filled' : 'light'}
            color={isListening ? 'red' : 'gray'}
            onClick={onVoiceInput}
            disabled={isBlocked}
          >
            {isListening ? <IconMicrophoneOff size={24} /> : <IconMicrophone size={24} />}
          </ActionIcon>
          <TextInput
            placeholder={isBlocked ? "🔒 Input blocked - please wait..." : "Type your message or use voice..."}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !isLoading && !isBlocked && value.trim()) {
                e.preventDefault();
                onSend();
              }
            }}
            style={{ flex: 1 }}
            size="md"
            radius="xl"
            disabled={isBlocked}
            error={isBlocked}
          />
          <ActionIcon
            size="xl"
            radius="xl"
            variant="filled"
            onClick={onSend}
            disabled={!value.trim() || isLoading || isBlocked}
          >
            <IconSend size={20} />
          </ActionIcon>
        </Group>
      </Container>
    </Paper>
  );
}

// ═══════════════════════════════════════════════════════════════
// Loading Indicator for Chat
// ═══════════════════════════════════════════════════════════════
export function ChatLoadingIndicator() {
  return (
    <Group>
      <Avatar radius="xl" color="blue">🤖</Avatar>
      <Paper shadow="xs" p="md" radius="lg">
        <Loader size="sm" />
      </Paper>
    </Group>
  );
}
