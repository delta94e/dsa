'use client';

import { useParams } from 'next/navigation';
import { Box, Container, Paper } from '@mantine/core';
import { AnimatePresence, motion } from 'framer-motion';

import { PrivateRoute } from '@/features/auth';
import {
    VoiceControls,
    PasswordModal,
    AudioPlayer,
    FloatingReactions,
    RoomHeader,
    CurrentUserInfo,
    ParticipantsGrid,
    VideoGrid,
    Whiteboard,
    useRoomSession,
} from '@/features/rooms';
import { LoadingState, ErrorState } from '@/shared/components/ui/DataStates';

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

    // Loading state
    if (isRoomLoading) {
        return <LoadingState message="Loading room..." />;
    }

    // Error state
    if (roomError || !room) {
        return (
            <Container size="md" py="xl">
                <ErrorState
                    title="Room not found"
                    message="This room doesn't exist or has been closed."
                />
            </Container>
        );
    }

    return (
        <>
            {/* Password Modal */}
            <PasswordModal
                opened={showPasswordModal}
                roomName={room.name}
                error={passwordErrorMsg}
                onSubmit={joinWithPassword}
                onClose={closePasswordModal}
            />

            <Box style={{ minHeight: '100vh', background: '#f8f9fa' }}>
                {/* Hidden audio elements for remote streams */}
                {Array.from(remoteStreams.entries()).map(([participantId, stream]) => (
                    <AudioPlayer key={participantId} stream={stream} participantId={participantId} />
                ))}

                <Container size="xl" py="md">
                    {/* Room Header */}
                    <RoomHeader
                        name={room.name}
                        topic={room.topic}
                        level={room.level}
                        participantCount={displayParticipants.length}
                        maxParticipants={room.maxParticipants}
                        isConnected={isConnected}
                    />

                    {/* Main Content Area - Video or Audio based on isVideoEnabled */}
                    <AnimatePresence mode="wait">
                        {isVideoEnabled ? (
                            /* Video Grid View - Show when video is enabled */
                            <motion.div
                                key="video"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.2 }}
                            >
                                <Paper shadow="sm" radius="lg" p="md" mb="md" style={{ minHeight: 400 }}>
                                    <VideoGrid
                                        localStream={localStream}
                                        remoteStreams={remoteStreams}
                                        participants={displayParticipants}
                                        currentUserId={currentUser.id}
                                        isLocalVideoEnabled={isVideoEnabled}
                                        isLocalMuted={isMuted}
                                    />
                                </Paper>
                            </motion.div>
                        ) : (
                            /* Audio Only View - Default when video is off */
                            <motion.div
                                key="audio"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.2 }}
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
                    <Paper shadow="sm" radius="lg" style={{ overflow: 'hidden' }}>
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
                    </Paper>

                    {/* Whiteboard Panel */}
                    <AnimatePresence>
                        {isWhiteboardOpen && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 20 }}
                                transition={{ duration: 0.2 }}
                            >
                                <Paper shadow="sm" radius="lg" mt="md" style={{ height: 500 }}>
                                    <Whiteboard
                                        roomId={roomId}
                                        userId={currentUser.id}
                                    />
                                </Paper>
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
