// ═══════════════════════════════════════════════════════════════
// LEVELS
// ═══════════════════════════════════════════════════════════════

export type Level = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';

export interface LevelInfo {
    code: Level;
    name: string;
    description: string;
    color: string;
}

export const LEVELS: LevelInfo[] = [
    { code: 'A1', name: 'Beginner', description: 'Basic phrases, introductions', color: 'green' },
    { code: 'A2', name: 'Elementary', description: 'Routine tasks, simple conversations', color: 'lime' },
    { code: 'B1', name: 'Intermediate', description: 'Travel, work, opinions', color: 'yellow' },
    { code: 'B2', name: 'Upper-Intermediate', description: 'Abstract topics, technical discussions', color: 'orange' },
    { code: 'C1', name: 'Advanced', description: 'Complex ideas, implicit meanings', color: 'red' },
    { code: 'C2', name: 'Proficient', description: 'Near-native fluency', color: 'grape' },
];

export const LEVEL_COLORS: Record<Level, string> = {
    A1: 'green',
    A2: 'lime',
    B1: 'yellow',
    B2: 'orange',
    C1: 'red',
    C2: 'grape',
};

// ═══════════════════════════════════════════════════════════════
// USER
// ═══════════════════════════════════════════════════════════════

export interface User {
    id: string;
    name: string;
    avatarUrl: string;
    nativeLanguage: string;
    learningLevel: Level;
    country: string;
    countryFlag: string;
}

export interface RoomParticipant extends User {
    isMuted: boolean;
    isSpeaking: boolean;
    isHandRaised: boolean;
    joinedAt: Date;
}

// ═══════════════════════════════════════════════════════════════
// ROOM
// ═══════════════════════════════════════════════════════════════

export type RoomType = 'public' | 'private' | 'ai';

export interface Room {
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
    hasPassword?: boolean; // True if room requires password
}

export interface CreateRoomInput {
    name: string;
    topic: string;
    level: Level;
    type: RoomType;
    maxParticipants?: number;
    tags?: string[];
    password?: string; // Optional room password
}

export interface RoomFilters {
    level?: Level | 'all';
    search?: string;
    type?: RoomType | 'all';
}

// ═══════════════════════════════════════════════════════════════
// AI CHAT
// ═══════════════════════════════════════════════════════════════

export interface AIMessage {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
    isError?: boolean;
    errorType?: 'rate_limited' | 'blocked';
}

export interface AITopic {
    id: string;
    name: string;
    description: string;
    icon: string;
    suggestedLevel: Level;
}

export const AI_TOPICS: AITopic[] = [
    { id: 'daily', name: 'Daily Conversation', description: 'Everyday topics', icon: '💬', suggestedLevel: 'A1' },
    { id: 'travel', name: 'Travel & Tourism', description: 'Trips, directions, hotels', icon: '✈️', suggestedLevel: 'A2' },
    { id: 'work', name: 'Work & Career', description: 'Office, meetings, projects', icon: '💼', suggestedLevel: 'B1' },
    { id: 'interview', name: 'Job Interview', description: 'Practice interview skills', icon: '🎯', suggestedLevel: 'B2' },
    { id: 'debate', name: 'Debate & Opinion', description: 'Discuss controversial topics', icon: '⚖️', suggestedLevel: 'C1' },
    { id: 'academic', name: 'Academic Discussion', description: 'Research, presentations', icon: '🎓', suggestedLevel: 'C2' },
];
