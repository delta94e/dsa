// ═══════════════════════════════════════════════════════════════
// LEVELS
// ═══════════════════════════════════════════════════════════════

export type Level = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';

export interface LevelInfo {
    code: Level;
    name: string;
    description: string;
}

export const LEVELS: LevelInfo[] = [
    { code: 'A1', name: 'Beginner', description: 'Basic phrases' },
    { code: 'A2', name: 'Elementary', description: 'Simple conversations' },
    { code: 'B1', name: 'Intermediate', description: 'Travel, work, opinions' },
    { code: 'B2', name: 'Upper-Intermediate', description: 'Technical discussions' },
    { code: 'C1', name: 'Advanced', description: 'Complex ideas' },
    { code: 'C2', name: 'Proficient', description: 'Near-native fluency' },
];

// ═══════════════════════════════════════════════════════════════
// USER ROLES
// ═══════════════════════════════════════════════════════════════

export type UserRole = 'user' | 'teacher' | 'student' | 'admin';

export interface User {
    id: string;
    name: string;
    email?: string;
    avatarUrl: string;
    nativeLanguage: string;
    learningLevel: Level;
    country: string;
    countryFlag: string;
    socketId?: string;
    role: UserRole; // User role for classroom system
}

export interface RoomParticipant extends User {
    isMuted: boolean;
    isSpeaking: boolean;
    isVideoEnabled: boolean;
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
    participants: Map<string, RoomParticipant>;
    tags: string[];
    createdAt: Date;
    password?: string; // Optional room password
}

// Room level requirements: Room difficulty → Required XP Level to join
export const ROOM_LEVEL_REQUIREMENTS: Record<Level, number> = {
    A1: 1,   // Anyone can join
    A2: 3,   // Level 3+ (Learner)
    B1: 8,   // Level 8+ (Pioneer)
    B2: 15,  // Level 15+ (Speaker)
    C1: 20,  // Level 20+ (Master)
    C2: 25,  // Level 25+ (Titan)
};

export interface CreateRoomDto {
    name: string;
    topic: string;
    level: Level;
    type: RoomType;
    maxParticipants?: number;
    tags?: string[];
    password?: string; // Optional room password
}

export interface RoomResponse {
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
    hasPassword: boolean; // True if room requires password
}

// ═══════════════════════════════════════════════════════════════
// SIGNALING
// ═══════════════════════════════════════════════════════════════

export interface JoinRoomPayload {
    roomId: string;
    user: User;
    password?: string; // Password for protected rooms
}

export interface LeaveRoomPayload {
    roomId: string;
}

export interface SignalingPayload {
    roomId: string;
    targetUserId: string;
    type: 'offer' | 'answer' | 'ice-candidate';
    data: any;
}

export interface MuteTogglePayload {
    roomId: string;
    isMuted: boolean;
}

export interface SpeakingPayload {
    roomId: string;
    isSpeaking: boolean;
}

export interface VideoTogglePayload {
    roomId: string;
    isVideoEnabled: boolean;
}

// ═══════════════════════════════════════════════════════════════
// AI CHAT
// ═══════════════════════════════════════════════════════════════

export interface AIMessageDto {
    role: 'user' | 'assistant';
    content: string;
}

export interface AIChatRequest {
    topic: string;
    level: Level;
    messages: AIMessageDto[];
}

// ═══════════════════════════════════════════════════════════════
// REACTIONS
// ═══════════════════════════════════════════════════════════════

export type ReactionType = 'raise_hand' | 'clap' | 'thumbs_up' | 'heart';

export interface ReactionPayload {
    roomId: string;
    type: ReactionType;
}

export interface RaiseHandPayload {
    roomId: string;
    isRaised: boolean;
}

// ═══════════════════════════════════════════════════════════════
// SCREEN SHARE
// ═══════════════════════════════════════════════════════════════

export interface ScreenSharePayload {
    roomId: string;
    isSharing: boolean;
}

// ═══════════════════════════════════════════════════════════════
// WHITEBOARD
// ═══════════════════════════════════════════════════════════════

export type DrawingToolType = 'select' | 'pen' | 'eraser' | 'rectangle' | 'circle' | 'line' | 'arrow' | 'text';

export interface DrawingElement {
    id: string;
    type: DrawingToolType;
    points?: { x: number; y: number }[];
    startX?: number;
    startY?: number;
    endX?: number;
    endY?: number;
    color: string;
    strokeWidth: number;
    text?: string;
    userId: string;
    timestamp: number;
}

export interface WhiteboardJoinPayload {
    roomId: string;
    userId: string;
}

export interface WhiteboardDrawPayload {
    roomId: string;
    element: DrawingElement;
}

export interface WhiteboardClearPayload {
    roomId: string;
    userId: string;
}

// ═══════════════════════════════════════════════════════════════
// TEACHER-STUDENT CLASSROOM SYSTEM
// ═══════════════════════════════════════════════════════════════

export type TeacherStatus = 'pending' | 'approved' | 'rejected';
export type EnrollmentStatus = 'pending' | 'approved' | 'rejected';

export interface TeacherProfile {
    userId: string;
    school: string;
    subjects: string[];      // ['English', 'Math']
    grades: string[];        // ['6', '7', '8']
    phoneNumber: string;
    status: TeacherStatus;
    approvedBy?: string;     // Admin who approved
    approvedAt?: Date;
    createdAt: Date;
}

export interface CreateTeacherDto {
    email: string;
    name: string;
    school: string;
    subjects: string[];
    grades: string[];
    phoneNumber: string;
    password: string;
}

export interface StudentProfile {
    userId: string;
    school: string;
    grade: string;           // '6', '7'
    className: string;       // '6A1'
    parentName: string;
    parentPhone: string;
    parentEmail: string;
    createdAt: Date;
}

export interface CreateStudentDto {
    email: string;
    name: string;
    school: string;
    grade: string;
    className: string;
    parentName: string;
    parentPhone: string;
    parentEmail: string;
    password: string;
    inviteCode: string;      // Required to register
}

export interface Classroom {
    id: string;
    name: string;
    teacherId: string;
    subject: string;
    grade: string;
    school: string;
    inviteCode: string;
    inviteExpiry: Date;      // 7 days from creation
    maxStudents: number;
    isActive: boolean;
    createdAt: Date;
}

export interface CreateClassroomDto {
    name: string;
    subject: string;
    grade: string;
    school: string;
    maxStudents?: number;
}

export interface ClassroomResponse {
    id: string;
    name: string;
    teacherId: string;
    teacherName?: string;
    subject: string;
    grade: string;
    school: string;
    inviteCode: string;
    inviteExpiry: Date;
    maxStudents: number;
    studentCount: number;
    isActive: boolean;
    createdAt: Date;
}

export interface ClassroomEnrollment {
    id: string;
    classroomId: string;
    studentId: string;
    status: EnrollmentStatus;
    appliedAt: Date;
    approvedAt?: Date;
}

// ═══════════════════════════════════════════════════════════════
// XP & LEVEL SYSTEM
// ═══════════════════════════════════════════════════════════════

export interface UserXpLevel {
    level: number;
    name: string;
    xpRequired: number;
    totalXp: number;
    badge: string;
}

export const XP_LEVELS: UserXpLevel[] = [
    { level: 1, name: 'Beginner', xpRequired: 0, totalXp: 0, badge: '🌱' },
    { level: 2, name: 'Newbie', xpRequired: 100, totalXp: 100, badge: '🌿' },
    { level: 3, name: 'Learner', xpRequired: 150, totalXp: 250, badge: '🍀' },
    { level: 4, name: 'Explorer', xpRequired: 200, totalXp: 450, badge: '🔍' },
    { level: 5, name: 'Seeker', xpRequired: 300, totalXp: 750, badge: '🧭' },
    { level: 6, name: 'Adventurer', xpRequired: 400, totalXp: 1150, badge: '🎒' },
    { level: 7, name: 'Traveler', xpRequired: 500, totalXp: 1650, badge: '✈️' },
    { level: 8, name: 'Pioneer', xpRequired: 600, totalXp: 2250, badge: '🚀' },
    { level: 9, name: 'Challenger', xpRequired: 750, totalXp: 3000, badge: '💪' },
    { level: 10, name: 'Achiever', xpRequired: 1000, totalXp: 4000, badge: '⭐' },
    { level: 11, name: 'Rising Star', xpRequired: 1200, totalXp: 5200, badge: '🌟' },
    { level: 12, name: 'Bright Mind', xpRequired: 1500, totalXp: 6700, badge: '💡' },
    { level: 13, name: 'Knowledge Seeker', xpRequired: 1800, totalXp: 8500, badge: '📚' },
    { level: 14, name: 'Word Wizard', xpRequired: 2000, totalXp: 10500, badge: '🪄' },
    { level: 15, name: 'Speaker', xpRequired: 2500, totalXp: 13000, badge: '🎤' },
    { level: 16, name: 'Communicator', xpRequired: 3000, totalXp: 16000, badge: '💬' },
    { level: 17, name: 'Confident', xpRequired: 3500, totalXp: 19500, badge: '😎' },
    { level: 18, name: 'Fluent', xpRequired: 4000, totalXp: 23500, badge: '🌊' },
    { level: 19, name: 'Expert', xpRequired: 5000, totalXp: 28500, badge: '🎯' },
    { level: 20, name: 'Master', xpRequired: 6000, totalXp: 34500, badge: '🏆' },
    { level: 21, name: 'Grand Master', xpRequired: 7000, totalXp: 41500, badge: '👑' },
    { level: 22, name: 'Champion', xpRequired: 8000, totalXp: 49500, badge: '🥇' },
    { level: 23, name: 'Legend', xpRequired: 10000, totalXp: 59500, badge: '🔥' },
    { level: 24, name: 'Hero', xpRequired: 12000, totalXp: 71500, badge: '🦸' },
    { level: 25, name: 'Titan', xpRequired: 15000, totalXp: 86500, badge: '⚡' },
    { level: 26, name: 'Immortal', xpRequired: 18000, totalXp: 104500, badge: '💎' },
    { level: 27, name: 'Divine', xpRequired: 22000, totalXp: 126500, badge: '✨' },
    { level: 28, name: 'Cosmic', xpRequired: 28000, totalXp: 154500, badge: '🌌' },
    { level: 29, name: 'Legendary', xpRequired: 35000, totalXp: 189500, badge: '🐉' },
    { level: 30, name: 'Ultimate Master', xpRequired: 50000, totalXp: 239500, badge: '👼' },
];

export interface UserProgress {
    userId: string;
    level: number;
    currentXp: number;
    totalXp: number;
    streak: number;
    lastCheckIn?: Date;
    completedQuests: string[];
    achievements: string[];
    createdAt: Date;
    updatedAt: Date;
}

export type QuestType = 'daily' | 'weekly' | 'achievement';
export type QuestConditionType = 'message_count' | 'room_join' | 'room_create' | 'speaking_time' | 'streak' | 'check_in';

export interface QuestCondition {
    type: QuestConditionType;
    target: number;
}

export interface Quest {
    id: string;
    name: string;
    description: string;
    type: QuestType;
    xpReward: number;
    condition: QuestCondition;
    icon: string;
}

export interface UserQuestProgress {
    questId: string;
    userId: string;
    progress: number;
    completed: boolean;
    completedAt?: Date;
}

// Daily check-in XP rewards based on streak
export const STREAK_XP_REWARDS = [10, 15, 20, 25, 30, 40, 50];

// Default quests
export const DEFAULT_QUESTS: Quest[] = [
    // Daily Quests
    { id: 'daily_first_chat', name: 'First Chat', description: 'Send 1 message in AI Practice', type: 'daily', xpReward: 10, condition: { type: 'message_count', target: 1 }, icon: '💬' },
    { id: 'daily_talkative', name: 'Talkative', description: 'Send 10 messages in AI Practice', type: 'daily', xpReward: 25, condition: { type: 'message_count', target: 10 }, icon: '🗣️' },
    { id: 'daily_room_joiner', name: 'Room Joiner', description: 'Join 1 voice room', type: 'daily', xpReward: 15, condition: { type: 'room_join', target: 1 }, icon: '🚪' },
    { id: 'daily_active_speaker', name: 'Active Speaker', description: 'Speak 5 minutes in room', type: 'daily', xpReward: 30, condition: { type: 'speaking_time', target: 5 }, icon: '🎤' },
    { id: 'daily_social', name: 'Social Butterfly', description: 'Join 3 different rooms', type: 'daily', xpReward: 40, condition: { type: 'room_join', target: 3 }, icon: '🦋' },

    // Weekly Quests
    { id: 'weekly_dedicated', name: 'Dedicated Learner', description: 'Check-in 7 days in a row', type: 'weekly', xpReward: 100, condition: { type: 'streak', target: 7 }, icon: '📅' },
    { id: 'weekly_chat_master', name: 'Chat Master', description: 'Send 100 AI messages', type: 'weekly', xpReward: 150, condition: { type: 'message_count', target: 100 }, icon: '💬' },
    { id: 'weekly_room_host', name: 'Room Host', description: 'Create 3 rooms', type: 'weekly', xpReward: 80, condition: { type: 'room_create', target: 3 }, icon: '🏠' },

    // Achievements (One-time)
    { id: 'ach_first_room', name: 'First Steps', description: 'Join your first room', type: 'achievement', xpReward: 30, condition: { type: 'room_join', target: 1 }, icon: '👣' },
    { id: 'ach_first_host', name: 'Host', description: 'Create your first room', type: 'achievement', xpReward: 40, condition: { type: 'room_create', target: 1 }, icon: '🎉' },
    { id: 'ach_ai_friend', name: 'AI Friend', description: 'Chat with AI 10 times', type: 'achievement', xpReward: 50, condition: { type: 'message_count', target: 10 }, icon: '🤖' },
];
