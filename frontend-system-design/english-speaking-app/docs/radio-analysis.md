# English Speaking Practice App - Frontend System Design

## Overview

Ứng dụng học giao tiếp tiếng Anh real-time với các phòng voice chat theo cấp độ, hỗ trợ nói chuyện với người dùng toàn cầu và AI tutor.

**Tech Stack:**
- **Framework:** Next.js 14 (App Router)
- **UI Library:** Mantine UI v7
- **State/Data:** TanStack Query + Zustand
- **Real-time:** WebRTC + Socket.IO
- **AI:** @tanstack/ai + @tanstack/ai-client + @tanstack/ai-react

---

## 1. Requirements

### Functional Requirements

| Feature | Description |
|---------|-------------|
| **Room Discovery** | Browse danh sách phòng với filter theo level |
| **Voice Room** | Join phòng để nói chuyện real-time với users khác |
| **Level System** | Phòng được gắn cấp độ (A1-C2) |
| **Room Creation** | Tạo phòng mới với topic và level |
| **AI Room** | Phòng 1:1 với AI để practice speaking |
| **User Presence** | Hiển thị ai đang ở trong phòng |
| **Speaking Indicator** | Hiện ai đang nói |
| **Mute/Unmute** | Toggle mic trong phòng |
| **Profile** | Avatar, tên, native language, learning level |

### Non-Functional Requirements

| Requirement | Target |
|-------------|--------|
| **Latency** | < 200ms audio delay |
| **Concurrent Users** | 12 users per room |
| **Mobile Support** | Responsive + PWA |
| **Accessibility** | WCAG 2.1 AA |

---

## 2. Level System (CEFR)

```
┌─────────────────────────────────────────────────────────────────┐
│                    CEFR Level System                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  A1  BEGINNER        │  Basic phrases, introductions            │
│  ───────────────────────────────────────────────────────────    │
│  A2  ELEMENTARY      │  Routine tasks, simple conversations     │
│  ───────────────────────────────────────────────────────────    │
│  B1  INTERMEDIATE    │  Travel, work, opinions                  │
│  ───────────────────────────────────────────────────────────    │
│  B2  UPPER-INTER     │  Abstract topics, technical discussions  │
│  ───────────────────────────────────────────────────────────    │
│  C1  ADVANCED        │  Complex ideas, implicit meanings        │
│  ───────────────────────────────────────────────────────────    │
│  C2  PROFICIENT      │  Near-native fluency                     │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Level Badge Colors (Mantine)

```typescript
const LEVEL_COLORS: Record<Level, MantineColor> = {
  A1: 'green',    // 🟢 Beginner friendly
  A2: 'lime',     // 🟡
  B1: 'yellow',   // 🟡speakEnglish
  B2: 'orange',   // 🟠
  C1: 'red',      // 🔴
  C2: 'grape',    // 🟣 Expert
};
```

---

## 3. Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         NEXT.JS APP                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐  │
│  │   Pages     │  │  Components │  │      Providers          │  │
│  │  /rooms     │  │  RoomCard   │  │  • QueryClientProvider  │  │
│  │  /rooms/[id]│  │  VoiceRoom  │  │  • MantineProvider      │  │
│  │  /ai-chat   │  │  AIChat     │  │  • SocketProvider       │  │
│  │  /profile   │  │  UserAvatar │  │  • AuthProvider         │  │
│  └─────────────┘  └─────────────┘  └─────────────────────────┘  │
│                                                                  │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │                        HOOKS                                 ││
│  │  useRooms() │ useVoiceRoom() │ useAIChat() │ usePresence() ││
│  └─────────────────────────────────────────────────────────────┘│
│                                                                  │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │                        STORES                                ││
│  │  useUserStore │ useRoomStore │ useMediaStore                ││
│  └─────────────────────────────────────────────────────────────┘│
│                                                                  │
└────────────────────────┬────────────────────────────────────────┘
                         │
         ┌───────────────┼───────────────┐
         ▼               ▼               ▼
┌─────────────┐  ┌─────────────┐  ┌─────────────┐
│  REST API   │  │  WebSocket  │  │   AI API    │
│  (Rooms,    │  │  (Signaling │  │  (TanStack  │
│   Users)    │  │   Presence) │  │   AI)       │
└─────────────┘  └─────────────┘  └─────────────┘
```

---

## 4. Data Model

### 4.1 TypeScript Interfaces

```typescript
// ═══════════════════════════════════════════════════════════════
// LEVELS
// ═══════════════════════════════════════════════════════════════

type Level = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';

interface LevelInfo {
  code: Level;
  name: string;
  description: string;
  color: string;
}

// ═══════════════════════════════════════════════════════════════
// USER
// ═══════════════════════════════════════════════════════════════

interface User {
  id: string;
  name: string;
  avatarUrl: string;
  nativeLanguage: string;
  learningLevel: Level;
  country: string;
  createdAt: Date;
}

interface RoomParticipant extends User {
  isMuted: boolean;
  isSpeaking: boolean;
  joinedAt: Date;
}

// ═══════════════════════════════════════════════════════════════
// ROOM
// ═══════════════════════════════════════════════════════════════

type RoomType = 'public' | 'private' | 'ai';

interface Room {
  id: string;
  name: string;
  topic: string;
  level: Level;
  type: RoomType;
  hostId: string;
  maxParticipants: number;
  participantCount: number;
  participants: RoomParticipant[];
  tags: string[];
  createdAt: Date;
}

interface CreateRoomInput {
  name: string;
  topic: string;
  level: Level;
  type: RoomType;
  maxParticipants?: number;
  tags?: string[];
}

// ═══════════════════════════════════════════════════════════════
// AI CHAT
// ═══════════════════════════════════════════════════════════════

interface AIConversation {
  id: string;
  userId: string;
  topic: string;
  level: Level;
  messages: AIMessage[];
  createdAt: Date;
}

interface AIMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  audioUrl?: string; // TTS audio
  timestamp: Date;
}

// ═══════════════════════════════════════════════════════════════
// PRESENCE & SIGNALING
// ═══════════════════════════════════════════════════════════════

interface PresenceEvent {
  type: 'join' | 'leave' | 'mute' | 'speaking';
  userId: string;
  roomId: string;
  payload?: any;
}

interface SignalingMessage {
  type: 'offer' | 'answer' | 'ice_candidate';
  from: string;
  to: string;
  roomId: string;
  payload: any;
}
```

---

## 5. Component Architecture

### 5.1 Page Structure

```
app/
├── layout.tsx              # Root layout with providers
├── page.tsx                # Landing/Home
├── rooms/
│   ├── page.tsx            # Room list
│   └── [id]/
│       └── page.tsx        # Voice room
├── ai-practice/
│   └── page.tsx            # AI conversation
├── create-room/
│   └── page.tsx            # Create new room
└── profile/
    └── page.tsx            # User profile
```

### 5.2 Component Hierarchy

```
┌─────────────────────────────────────────────────────────────────┐
│                         RoomsPage                                │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────────────────────┐│
│  │  RoomFilters                                                 ││
│  │  • Level selector (chips)                                    ││
│  │  • Search input                                              ││
│  │  • Sort by (participants, newest)                            ││
│  └─────────────────────────────────────────────────────────────┘│
│                                                                  │
│  ┌────────────┐ ┌────────────┐ ┌────────────┐ ┌────────────┐   │
│  │  RoomCard  │ │  RoomCard  │ │  RoomCard  │ │  RoomCard  │   │
│  │  • Title   │ │  🟢 A1     │ │  🟠 B2     │ │  🟣 C2     │   │
│  │  • Topic   │ │  5/12 👥   │ │  8/12 👥   │ │  3/6 👥    │   │
│  │  • Level   │ │  [Join]    │ │  [Join]    │ │  [Join]    │   │
│  │  • Count   │ └────────────┘ └────────────┘ └────────────┘   │
│  └────────────┘                                                  │
│                                                                  │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │  [+ Create Room]    [🤖 Practice with AI]                    ││
│  └─────────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                       VoiceRoomPage                              │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────────────────────┐│
│  │  RoomHeader                                                  ││
│  │  "Travel Conversations" • B1 • 6/12 participants            ││
│  └─────────────────────────────────────────────────────────────┘│
│                                                                  │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │  ParticipantGrid                                             ││
│  │  ┌───────────┐ ┌───────────┐ ┌───────────┐                  ││
│  │  │  Avatar   │ │  Avatar   │ │  Avatar   │                  ││
│  │  │  🟢 John  │ │  🔴 Maria │ │  👑 Host  │                  ││
│  │  │  🇺🇸      │ │  🇪🇸      │ │  🇯🇵      │                  ││
│  │  │ *speaking*│ │  muted    │ │           │                  ││
│  │  └───────────┘ └───────────┘ └───────────┘                  ││
│  └─────────────────────────────────────────────────────────────┘│
│                                                                  │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │  RoomControls                                                ││
│  │  [🎤 Mute]  [📞 Leave]  [⚙️ Settings]                       ││
│  └─────────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                       AIPracticePage                             │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────────────────────┐│
│  │  TopicSelector                                               ││
│  │  "Job Interview" • Level: B2                                 ││
│  └─────────────────────────────────────────────────────────────┘│
│                                                                  │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │  ChatMessages                                                ││
│  │  ┌─────────────────────────────────────────────────────────┐││
│  │  │ 🤖 AI: Tell me about your work experience.              │││
│  │  │       [🔊 Play]                                         │││
│  │  └─────────────────────────────────────────────────────────┘││
│  │  ┌─────────────────────────────────────────────────────────┐││
│  │  │ 👤 You: I have 5 years of experience in...              │││
│  │  │       [🔊 Play]                                         │││
│  │  └─────────────────────────────────────────────────────────┘││
│  └─────────────────────────────────────────────────────────────┘│
│                                                                  │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │  VoiceInput                                                  ││
│  │  [🎤 Hold to speak]  ────────────────  [📝 Type instead]    ││
│  └─────────────────────────────────────────────────────────────┘│
│                                                                  │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │  FeedbackPanel (AI Grammar/Pronunciation feedback)          ││
│  └─────────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────┘
```

---

## 6. State Management

### 6.1 TanStack Query - Server State

```typescript
// Rooms query
const useRooms = (filters: RoomFilters) => {
  return useQuery({
    queryKey: ['rooms', filters],
    queryFn: () => api.getRooms(filters),
    staleTime: 10_000, // 10s
    refetchInterval: 30_000, // 30s for live count
  });
};

// Single room
const useRoom = (roomId: string) => {
  return useQuery({
    queryKey: ['room', roomId],
    queryFn: () => api.getRoom(roomId),
  });
};

// Create room mutation
const useCreateRoom = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: api.createRoom,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rooms'] });
    },
  });
};
```

### 6.2 Zustand - Client State

```typescript
interface MediaStore {
  localStream: MediaStream | null;
  isMuted: boolean;
  isSpeaking: boolean;
  audioLevel: number;
  
  initMedia: () => Promise<void>;
  toggleMute: () => void;
  setAudioLevel: (level: number) => void;
  cleanup: () => void;
}

const useMediaStore = create<MediaStore>((set, get) => ({
  localStream: null,
  isMuted: true, // Start muted
  isSpeaking: false,
  audioLevel: 0,
  
  initMedia: async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    stream.getAudioTracks()[0].enabled = false; // Start muted
    set({ localStream: stream });
  },
  
  toggleMute: () => {
    const { localStream, isMuted } = get();
    if (localStream) {
      localStream.getAudioTracks()[0].enabled = isMuted; // Toggle
      set({ isMuted: !isMuted });
    }
  },
  
  cleanup: () => {
    const { localStream } = get();
    localStream?.getTracks().forEach(t => t.stop());
    set({ localStream: null });
  },
}));
```

---

## 7. AI Integration (@tanstack/ai)

### 7.1 Package Setup

```bash
npm install @tanstack/ai @tanstack/ai-client @tanstack/ai-react
```

**Package Overview:**

| Package | Purpose |
|---------|--------|
| `@tanstack/ai` | Core AI utilities, adapters (OpenAI, Anthropic, Ollama) |
| `@tanstack/ai-client` | Headless client for chat state, streaming, tools |
| `@tanstack/ai-react` | React hooks (`useChat`, `useAIClient`) |

### 7.2 AI Chat Hook

```typescript
import { useChat, InferChatMessages } from '@tanstack/ai-react';
import { openaiAdapter } from '@tanstack/ai';

// Define system prompt based on level
const getSystemPrompt = (topic: string, level: Level) => `
You are an English teacher helping a ${level} level student practice ${topic}.
- Speak naturally with vocabulary appropriate for ${level} level
- Ask follow-up questions to keep the conversation going  
- Gently correct grammar mistakes
- Encourage the student when they do well
`;

const useAIPractice = (topic: string, level: Level) => {
  const { messages, sendMessage, isLoading, error } = useChat({
    adapter: openaiAdapter({
      model: 'gpt-4-turbo',
      apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
    }),
    system: getSystemPrompt(topic, level),
  });

  const sendVoiceMessage = async (audioBlob: Blob) => {
    // 1. Transcribe audio to text using Web Speech API
    const transcript = await transcribeAudio(audioBlob);
    
    // 2. Send to AI
    await sendMessage({
      role: 'user',
      content: transcript,
    });
  };

  return {
    messages,
    sendMessage,
    sendVoiceMessage,
    isLoading,
    error,
  };
};

// Type-safe messages
type ChatMessages = InferChatMessages<typeof useAIPractice>;
```

### 7.2 Speech-to-Text & Text-to-Speech

```typescript
// Web Speech API for STT
const useSpeechRecognition = () => {
  const [transcript, setTranscript] = useState('');
  const [isListening, setIsListening] = useState(false);
  
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  
  const startListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = 'en-US';
    
    recognition.onresult = (event) => {
      const current = event.resultIndex;
      const result = event.results[current][0].transcript;
      setTranscript(result);
    };
    
    recognition.onend = () => setIsListening(false);
    recognition.start();
    setIsListening(true);
    recognitionRef.current = recognition;
  };
  
  const stopListening = () => {
    recognitionRef.current?.stop();
  };
  
  return { transcript, isListening, startListening, stopListening };
};

// TTS for AI responses
const speakText = (text: string) => {
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'en-US';
  utterance.rate = 0.9; // Slightly slower for learners
  speechSynthesis.speak(utterance);
};
```

---

## 8. WebRTC for Voice Rooms

### 8.1 Room Connection Flow

```
User joins room:
1. Connect WebSocket → receive participant list
2. Get audio stream → getUserMedia()
3. For each existing participant:
   - Create RTCPeerConnection
   - Add local track
   - Exchange SDP via signaling

New user joins:
1. Receive 'user_joined' event
2. Create peer connection
3. Wait for their offer
4. Send answer
5. Exchange ICE candidates
```

### 8.2 Multi-peer Management

```typescript
interface PeerConnection {
  peerId: string;
  pc: RTCPeerConnection;
  stream: MediaStream | null;
}

const useVoiceRoom = (roomId: string) => {
  const [peers, setPeers] = useState<Map<string, PeerConnection>>(new Map());
  const localStream = useMediaStore(s => s.localStream);
  const socket = useSocket();
  
  // Handle new peer joining
  useEffect(() => {
    socket.on('user_joined', async ({ userId }) => {
      const pc = createPeerConnection(userId);
      localStream?.getTracks().forEach(track => pc.addTrack(track, localStream));
      
      // If we're the "polite" peer, wait for offer
      // Otherwise, create and send offer
    });
    
    socket.on('offer', async ({ from, sdp }) => {
      const pc = peers.get(from)?.pc;
      if (pc) {
        await pc.setRemoteDescription(new RTCSessionDescription(sdp));
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);
        socket.emit('answer', { to: from, sdp: answer });
      }
    });
    
    // ... handle answer, ice candidates
  }, [roomId]);
};
```

---

## 9. Mantine UI Components

### 9.1 Theme Configuration

```typescript
// theme.ts
import { createTheme, MantineColorsTuple } from '@mantine/core';

const brandColors: MantineColorsTuple = [
  '#e8f5ff', '#d0e8ff', '#a1cfff', '#6fb3ff',
  '#4599ff', '#2d87ff', '#1a75ff', '#0062e6',
  '#0056cc', '#004ab3'
];

export const theme = createTheme({
  primaryColor: 'brand',
  colors: {
    brand: brandColors,
  },
  fontFamily: 'Inter, system-ui, sans-serif',
  headings: {
    fontFamily: 'Inter, system-ui, sans-serif',
    fontWeight: '600',
  },
  radius: {
    default: 'md',
  },
  components: {
    Button: {
      defaultProps: {
        radius: 'xl',
      },
    },
    Card: {
      defaultProps: {
        radius: 'lg',
        withBorder: true,
      },
    },
  },
});
```

### 9.2 Key Components

```tsx
// RoomCard.tsx
import { Card, Badge, Group, Text, Avatar, Button } from '@mantine/core';

const RoomCard = ({ room }: { room: Room }) => (
  <Card shadow="sm" padding="lg">
    <Group justify="space-between" mb="xs">
      <Text fw={500}>{room.name}</Text>
      <Badge color={LEVEL_COLORS[room.level]}>{room.level}</Badge>
    </Group>
    
    <Text size="sm" c="dimmed" mb="md">
      {room.topic}
    </Text>
    
    <Group gap="xs" mb="md">
      <Avatar.Group>
        {room.participants.slice(0, 3).map(p => (
          <Avatar key={p.id} src={p.avatarUrl} radius="xl" size="sm" />
        ))}
        {room.participantCount > 3 && (
          <Avatar radius="xl" size="sm">+{room.participantCount - 3}</Avatar>
        )}
      </Avatar.Group>
      <Text size="sm" c="dimmed">
        {room.participantCount}/{room.maxParticipants}
      </Text>
    </Group>
    
    <Button fullWidth>Join Room</Button>
  </Card>
);
```

---

## 10. API Routes (Next.js)

```
app/api/
├── rooms/
│   ├── route.ts          # GET (list), POST (create)
│   └── [id]/route.ts     # GET room details
├── ai/
│   └── chat/route.ts     # AI conversation stream
├── auth/
│   └── [...nextauth]/route.ts
└── socket/
    └── route.ts          # Socket.IO handler
```

### 10.1 AI Chat API Route (with @tanstack/ai)

```typescript
// app/api/ai/chat/route.ts
import { createAIHandler, openaiAdapter, toolDefinition } from '@tanstack/ai';
import { z } from 'zod';

// Define tools for AI assistant
const grammarFeedbackTool = toolDefinition({
  name: 'give_feedback',
  description: 'Provide grammar feedback to the student',
  input: z.object({
    originalSentence: z.string(),
    correctedSentence: z.string(),
    explanation: z.string(),
  }),
  handler: async ({ input }) => {
    return {
      type: 'grammar_feedback',
      ...input,
    };
  },
});

export const POST = createAIHandler({
  adapter: openaiAdapter({
    model: 'gpt-4-turbo',
    apiKey: process.env.OPENAI_API_KEY!,
  }),
  tools: [grammarFeedbackTool],
});
```

### 10.2 Client-side AI Provider

```tsx
// app/providers.tsx
import { AIClientProvider, createAIClient } from '@tanstack/ai-client';

const aiClient = createAIClient({
  baseUrl: '/api/ai/chat',
});

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AIClientProvider client={aiClient}>
      {children}
    </AIClientProvider>
  );
}
```
```

---

## 11. Feature Roadmap

### Phase 1: MVP
- [ ] Room list with level filter
- [ ] Join/Leave room
- [ ] Voice chat (WebRTC)
- [ ] Mute/Unmute
- [ ] User presence

### Phase 2: AI Integration
- [ ] AI practice room
- [ ] Speech-to-Text
- [ ] Text-to-Speech for AI
- [ ] Grammar feedback

### Phase 3: Social
- [ ] User profiles
- [ ] Friend system
- [ ] Practice history
- [ ] Achievement badges

### Phase 4: Advanced
- [ ] Scheduled rooms
- [ ] Recording & playback
- [ ] Pronunciation scoring
- [ ] Video rooms
