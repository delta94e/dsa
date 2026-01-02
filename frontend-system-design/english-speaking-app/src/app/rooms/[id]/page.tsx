'use client';

import { useParams } from 'next/navigation';
import { Box, Container, Group, Text, Title, Badge, Button, Avatar, Stack } from '@mantine/core';
import { IconArrowLeft, IconUsers, IconWifi, IconWifiOff } from '@tabler/icons-react';
import { AnimatePresence, motion } from 'framer-motion';
import Link from 'next/link';

import { PrivateRoute } from '@/features/auth';
import {
    VoiceControls,
    PasswordModal,
    AudioPlayer,
    FloatingReactions,
    ParticipantsGrid,
    VideoGrid,
    Whiteboard,
    useRoomSession,
} from '@/features/rooms';
import { LoadingState, ErrorState } from '@/shared/components/ui/DataStates';
import { LEVEL_COLORS, Level } from '@/types';

// ═══════════════════════════════════════════════════════════════
// Dark Theme Room Header
// ═══════════════════════════════════════════════════════════════
interface RoomHeaderProps {
    name: string;
    topic: string;
    level: Level;
    participantCount: number;
    maxParticipants: number;
    isConnected: boolean;
}

function RoomHeader({ name, topic, level, participantCount, maxParticipants, isConnected }: RoomHeaderProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
        >
            <Box
                p="lg"
                mb="lg"
                style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    backdropFilter: 'blur(20px)',
                    borderRadius: 20,
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                }}
            >
                <Group justify="space-between" wrap="nowrap">
                    <Box style={{ flex: 1, minWidth: 0 }}>
                        <Group gap="sm" mb="sm">
                            <Link href="/rooms" style={{ textDecoration: 'none' }}>
                                <motion.div whileHover={{ x: -4 }} whileTap={{ scale: 0.95 }}>
                                    <Button
                                        variant="subtle"
                                        size="sm"
                                        leftSection={<IconArrowLeft size={16} />}
                                        style={{ color: 'rgba(255,255,255,0.7)' }}
                                    >
                                        Quay lại
                                    </Button>
                                </motion.div>
                            </Link>
                            
                            {/* Connection Status */}
                            <motion.div
                                animate={isConnected ? {} : { opacity: [0.5, 1, 0.5] }}
                                transition={{ duration: 1.5, repeat: Infinity }}
                            >
                                <Badge
                                    color={isConnected ? 'green' : 'yellow'}
                                    variant="light"
                                    leftSection={
                                        isConnected ? <IconWifi size={12} /> : <IconWifiOff size={12} />
                                    }
                                    style={{
                                        background: isConnected 
                                            ? 'rgba(52, 199, 89, 0.2)' 
                                            : 'rgba(255, 204, 0, 0.2)',
                                    }}
                                >
                                    {isConnected ? 'Đã kết nối' : 'Đang kết nối...'}
                                </Badge>
                            </motion.div>
                        </Group>
                        
                        <Title order={2} mb={4} style={{ color: 'white' }}>
                            {name}
                        </Title>
                        <Text style={{ color: 'rgba(255,255,255,0.6)' }}>{topic}</Text>
                    </Box>
                    
                    <Stack align="flex-end" gap="xs">
                        <Badge
                            size="xl"
                            color={LEVEL_COLORS[level]}
                            variant="filled"
                            style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.3)' }}
                        >
                            {level}
                        </Badge>
                        <Group gap={4}>
                            <IconUsers size={16} style={{ color: 'rgba(255,255,255,0.5)' }} />
                            <Text size="sm" style={{ color: 'rgba(255,255,255,0.6)' }}>
                                {participantCount}/{maxParticipants} người
                            </Text>
                        </Group>
                    </Stack>
                </Group>
            </Box>
        </motion.div>
    );
}

// ═══════════════════════════════════════════════════════════════
// Current User Info (Dark Theme)
// ═══════════════════════════════════════════════════════════════
interface CurrentUserInfoProps {
    name: string;
    countryFlag: string;
    isMuted: boolean;
    isSpeaking: boolean;
    streamCount: number;
}

function CurrentUserInfo({ name, countryFlag, isMuted, isSpeaking, streamCount }: CurrentUserInfoProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
        >
            <Box
                p="md"
                mb="lg"
                style={{
                    background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.2), rgba(118, 75, 162, 0.2))',
                    backdropFilter: 'blur(20px)',
                    borderRadius: 16,
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                }}
            >
                <Group gap="md" wrap="wrap">
                    <Group gap="sm">
                        <Text size="sm" style={{ color: 'rgba(255,255,255,0.7)' }}>
                            Bạn:
                        </Text>
                        <Text fw={600} style={{ color: 'white' }}>
                            {countryFlag} {name}
                        </Text>
                    </Group>
                    
                    <Badge
                        color={isMuted ? 'red' : 'green'}
                        variant="light"
                        style={{
                            background: isMuted 
                                ? 'rgba(255, 59, 48, 0.2)' 
                                : 'rgba(52, 199, 89, 0.2)',
                        }}
                    >
                        {isMuted ? '🔇 Đang tắt mic' : '🔊 Đang bật mic'}
                    </Badge>
                    
                    {isSpeaking && (
                        <motion.div
                            animate={{ scale: [1, 1.05, 1] }}
                            transition={{ duration: 0.5, repeat: Infinity }}
                        >
                            <Badge
                                color="green"
                                variant="filled"
                                style={{
                                    background: '#34C759',
                                    boxShadow: '0 0 12px rgba(52, 199, 89, 0.5)',
                                }}
                            >
                                🎤 Đang nói
                            </Badge>
                        </motion.div>
                    )}
                    
                    <Badge
                        variant="outline"
                        style={{
                            borderColor: 'rgba(255,255,255,0.2)',
                            color: 'rgba(255,255,255,0.7)',
                        }}
                    >
                        {streamCount} audio streams
                    </Badge>
                </Group>
            </Box>
        </motion.div>
    );
}

// ═══════════════════════════════════════════════════════════════
// Room Content Component
// ═══════════════════════════════════════════════════════════════
function RoomContent({ roomId }: { roomId: string }) {
    const {
        room,
        isRoomLoading,
        roomError,
        isConnected,
        displayParticipants,
        remoteStreams,
        currentUser,
        isMuted,
        isVideoEnabled,
        isScreenSharing,
        isWhiteboardOpen,
        vadActive,
        isHandRaised,
        localStream,
        handleToggleMute,
        handleToggleVideo,
        handleToggleScreenShare,
        handleToggleWhiteboard,
        handleLeave,
        handleToggleHand,
        sendReaction,
        reactions,
        showPasswordModal,
        passwordErrorMsg,
        joinWithPassword,
        closePasswordModal,
    } = useRoomSession({ roomId });

    if (isRoomLoading) {
        return <LoadingState message="Đang tải phòng..." variant="dark" />;
    }

    if (roomError || !room) {
        return (
            <Container size="md" py="xl">
                <ErrorState
                    title="Không tìm thấy phòng"
                    message="Phòng này không tồn tại hoặc đã bị đóng."
                    variant="dark"
                />
            </Container>
        );
    }

    return (
        <>
            <PasswordModal
                opened={showPasswordModal}
                roomName={room.name}
                error={passwordErrorMsg}
                onSubmit={joinWithPassword}
                onClose={closePasswordModal}
            />

            <Box
                style={{
                    minHeight: '100vh',
                    background: 'linear-gradient(180deg, #0F0F1A 0%, #1A1A2E 50%, #16213E 100%)',
                }}
            >
                {/* Hidden audio elements */}
                {Array.from(remoteStreams.entries()).map(([participantId, stream]) => (
                    <AudioPlayer key={participantId} stream={stream} participantId={participantId} />
                ))}

                <Container size="xl" py="lg">
                    {/* Room Header */}
                    <RoomHeader
                        name={room.name}
                        topic={room.topic}
                        level={room.level}
                        participantCount={displayParticipants.length}
                        maxParticipants={room.maxParticipants}
                        isConnected={isConnected}
                    />

                    {/* Main Content */}
                    <AnimatePresence mode="wait">
                        {isVideoEnabled ? (
                            <motion.div
                                key="video"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.3 }}
                            >
                                <Box
                                    p="md"
                                    mb="md"
                                    style={{
                                        background: 'rgba(255, 255, 255, 0.05)',
                                        backdropFilter: 'blur(20px)',
                                        borderRadius: 20,
                                        border: '1px solid rgba(255, 255, 255, 0.1)',
                                        minHeight: 400,
                                    }}
                                >
                                    <VideoGrid
                                        localStream={localStream}
                                        remoteStreams={remoteStreams}
                                        participants={displayParticipants}
                                        currentUserId={currentUser.id}
                                        isLocalVideoEnabled={isVideoEnabled}
                                        isLocalMuted={isMuted}
                                    />
                                </Box>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="audio"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.3 }}
                            >
                                <CurrentUserInfo
                                    name={currentUser.name}
                                    countryFlag={currentUser.countryFlag}
                                    isMuted={isMuted}
                                    isSpeaking={vadActive}
                                    streamCount={remoteStreams.size}
                                />
                                <ParticipantsGrid
                                    participants={displayParticipants}
                                    hostId={room.hostId}
                                />
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Voice Controls */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.2 }}
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
                            <VoiceControls
                                isMuted={isMuted}
                                isVideoEnabled={isVideoEnabled}
                                isScreenSharing={isScreenSharing}
                                isWhiteboardOpen={isWhiteboardOpen}
                                isHandRaised={isHandRaised}
                                onToggleMute={handleToggleMute}
                                onToggleVideo={handleToggleVideo}
                                onToggleScreenShare={handleToggleScreenShare}
                                onToggleWhiteboard={handleToggleWhiteboard}
                                onToggleHand={handleToggleHand}
                                onReaction={sendReaction}
                                onLeave={handleLeave}
                            />
                        </Box>
                    </motion.div>

                    {/* Whiteboard Panel */}
                    <AnimatePresence>
                        {isWhiteboardOpen && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 20 }}
                                transition={{ duration: 0.3 }}
                            >
                                <Box
                                    mt="md"
                                    style={{
                                        background: 'rgba(255, 255, 255, 0.05)',
                                        backdropFilter: 'blur(20px)',
                                        borderRadius: 20,
                                        border: '1px solid rgba(255, 255, 255, 0.1)',
                                        height: 500,
                                        overflow: 'hidden',
                                    }}
                                >
                                    <Whiteboard
                                        roomId={roomId}
                                        userId={currentUser.id}
                                    />
                                </Box>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Floating Reactions */}
                    <FloatingReactions reactions={reactions} />
                </Container>
            </Box>
        </>
    );
}

// ═══════════════════════════════════════════════════════════════
// Main Page Component
// ═══════════════════════════════════════════════════════════════
export default function RoomPage() {
    const params = useParams();
    const roomId = params.id as string;

    return (
        <PrivateRoute>
            <RoomContent roomId={roomId} />
        </PrivateRoute>
    );
}
