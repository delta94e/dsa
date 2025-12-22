'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Container, Title, Text, Paper, Stack, Group, Button, Box, Badge, ScrollArea } from '@mantine/core';
import { IconArrowLeft, IconMicrophone } from '@tabler/icons-react';
import Link from 'next/link';

import { Level, AI_TOPICS, LEVEL_COLORS } from '@/types';
import { useFlags } from '@/shared/components/ui/FeatureFlagMenu';
import { useAIPracticeSession } from '@/features/ai-practice/hooks/useAIPracticeSession';
import {
  FeatureDisabledModal,
  LevelSelector,
  TopicSelector,
  ChatMessage,
  ChatInput,
  ChatLoadingIndicator,
} from '@/features/ai-practice/components/AIPracticeComponents';

// ═══════════════════════════════════════════════════════════════
// Props
// ═══════════════════════════════════════════════════════════════
interface AIPracticeContentProps {
  initialEnabled: boolean;
}

// ═══════════════════════════════════════════════════════════════
// Topic Selection View
// ═══════════════════════════════════════════════════════════════
interface TopicSelectionViewProps {
  selectedTopic: string | null;
  selectedLevel: Level;
  onTopicChange: (topic: string) => void;
  onLevelChange: (level: Level) => void;
  onStart: () => void;
}

function TopicSelectionView({
  selectedTopic,
  selectedLevel,
  onTopicChange,
  onLevelChange,
  onStart,
}: TopicSelectionViewProps) {
  return (
    <Box style={{ minHeight: '100vh', background: '#f8f9fa' }}>
      <Container size="lg" py="xl">
        <Group mb="xl">
          <Link href="/rooms">
            <Button variant="subtle" leftSection={<IconArrowLeft size={16} />}>
              Back
            </Button>
          </Link>
        </Group>

        <Title order={1} mb="xs">Practice with AI Tutor</Title>
        <Text c="dimmed" mb="xl">
          Choose a topic and level to start your practice session
        </Text>

        <LevelSelector selectedLevel={selectedLevel} onSelect={onLevelChange} />
        <TopicSelector selectedTopic={selectedTopic} onSelect={onTopicChange} />

        <Group justify="center">
          <Button
            size="lg"
            disabled={!selectedTopic}
            onClick={onStart}
            leftSection={<IconMicrophone size={20} />}
          >
            Start Practice Session
          </Button>
        </Group>
      </Container>
    </Box>
  );
}

// ═══════════════════════════════════════════════════════════════
// Chat View
// ═══════════════════════════════════════════════════════════════
interface ChatViewProps {
  topic: typeof AI_TOPICS[number] | undefined;
  level: Level;
  messages: ReturnType<typeof useAIPracticeSession>['messages'];
  isLoading: boolean;
  inputBlocked: boolean;
  onEndSession: () => void;
  onSendMessage: (content: string) => void;
}

function ChatView({
  topic,
  level,
  messages,
  isLoading,
  inputBlocked,
  onEndSession,
  onSendMessage,
}: ChatViewProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [messages]);

  const handleVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      alert('Speech recognition is not supported in your browser.');
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';
    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onresult = (event: any) => setInput(event.results[0][0].transcript);
    recognition.start();
  };

  const speakText = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = 0.9;
    speechSynthesis.speak(utterance);
  };

  const handleSend = () => {
    if (input.trim() && !isLoading && !inputBlocked) {
      onSendMessage(input.trim());
      setInput('');
    }
  };

  return (
    <Box style={{ height: '100vh', background: '#f8f9fa', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {/* Header */}
      <Paper shadow="sm" p="md" style={{ flexShrink: 0 }}>
        <Container size="lg">
          <Group justify="space-between">
            <Group>
              <Button variant="subtle" leftSection={<IconArrowLeft size={16} />} onClick={onEndSession}>
                End Session
              </Button>
              <div>
                <Text fw={500}>{topic?.icon} {topic?.name}</Text>
                <Badge color={LEVEL_COLORS[level]} size="sm">Level: {level}</Badge>
              </div>
            </Group>
          </Group>
        </Container>
      </Paper>

      {/* Messages */}
      <ScrollArea style={{ flex: 1 }} viewportRef={scrollRef} p="md">
        <Container size="md">
          <Stack gap="md" py="md">
            {messages.map((message) => (
              <ChatMessage key={message.id} message={message} onSpeak={speakText} />
            ))}
            {isLoading && <ChatLoadingIndicator />}
          </Stack>
        </Container>
      </ScrollArea>

      {/* Input */}
      <ChatInput
        value={input}
        onChange={setInput}
        onSend={handleSend}
        onVoiceInput={handleVoiceInput}
        isListening={isListening}
        isLoading={isLoading}
        isBlocked={inputBlocked}
      />
    </Box>
  );
}

// ═══════════════════════════════════════════════════════════════
// Main Component
// ═══════════════════════════════════════════════════════════════
export function AIPracticeContent({ initialEnabled }: AIPracticeContentProps) {
  const router = useRouter();
  const flags = useFlags();
  
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<Level>('B1');
  
  const wasEnabledRef = useRef<boolean | null>(initialEnabled);
  const [featureDisabledWhileActive, setFeatureDisabledWhileActive] = useState(false);

  const topicInfo = AI_TOPICS.find((t) => t.id === selectedTopic);

  const {
    messages,
    isLoading,
    inputBlocked,
    startSession,
    sendMessage,
    resetSession,
  } = useAIPracticeSession({
    topic: selectedTopic,
    level: selectedLevel,
    topicName: topicInfo?.name,
  });

  // Detect feature disabled while active
  useEffect(() => {
    const currentEnabled = flags.ai_practice.enabled;
    if (wasEnabledRef.current === true && currentEnabled === false) {
      setFeatureDisabledWhileActive(true);
    }
    wasEnabledRef.current = currentEnabled;
  }, [flags.ai_practice.enabled]);

  const handleGoHome = () => router.push('/');
  
  const handleEndSession = () => {
    setSelectedTopic(null);
    resetSession();
  };

  // Feature disabled modal
  if (featureDisabledWhileActive) {
    return <FeatureDisabledModal onGoHome={handleGoHome} />;
  }

  // Topic selection view
  if (!selectedTopic || messages.length === 0) {
    return (
      <TopicSelectionView
        selectedTopic={selectedTopic}
        selectedLevel={selectedLevel}
        onTopicChange={setSelectedTopic}
        onLevelChange={setSelectedLevel}
        onStart={startSession}
      />
    );
  }

  // Chat view
  return (
    <ChatView
      topic={topicInfo}
      level={selectedLevel}
      messages={messages}
      isLoading={isLoading}
      inputBlocked={inputBlocked}
      onEndSession={handleEndSession}
      onSendMessage={sendMessage}
    />
  );
}
