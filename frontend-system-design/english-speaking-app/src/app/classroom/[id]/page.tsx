'use client';

import { useParams } from 'next/navigation';
import { Container, Box, SimpleGrid, Button, Alert } from '@mantine/core';
import { IconArrowLeft, IconAlertCircle } from '@tabler/icons-react';
import Link from 'next/link';

import { PrivateRoute } from '@/features/auth';
import { ParticipantCard, VoiceControls, AudioPlayer, FloatingReactions } from '@/features/rooms';
import { LoadingState } from '@/shared/components/ui/DataStates';
import { useClassroomSession } from '@/features/classroom/hooks/useClassroomSession';
import { 
  ClassroomHeader, 
  TeacherControls, 
  FloatingControlsWrapper 
} from '@/features/classroom/components/ClassroomComponents';

// ═══════════════════════════════════════════════════════════════
// Classroom Content Component
// ═══════════════════════════════════════════════════════════════
function ClassroomContent({ classroomId }: { classroomId: string }) {
  const {
    classroom,
    isLoading,
    error,
    isConnected,
    participants,
    remoteStreams,
    isTeacher,
    isMuted,
    isHandRaised,
    handleMuteToggle,
    handleLeave,
    handleRaiseHand,
    handleReaction,
    reactions,
  } = useClassroomSession({ classroomId });

  // Loading state
  if (isLoading) {
    return <LoadingState message="Đang tải lớp học..." />;
  }

  // Error state
  if (error || !classroom) {
    return (
      <Container size="md" py="xl">
        <Alert icon={<IconAlertCircle size={16} />} title="Lỗi" color="red">
          {error || 'Không tìm thấy lớp học'}
        </Alert>
        <Link href={isTeacher ? '/teacher' : '/student'}>
          <Button mt="md" variant="light" leftSection={<IconArrowLeft size={16} />}>
            Quay lại
          </Button>
        </Link>
      </Container>
    );
  }

  return (
    <Box style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
      {/* Hidden audio elements */}
      {Array.from(remoteStreams.entries()).map(([participantId, stream]) => (
        <AudioPlayer key={participantId} stream={stream} participantId={participantId} />
      ))}

      <Container size="xl" py="xl">
        {/* Header */}
        <ClassroomHeader
          classroom={classroom}
          isTeacher={isTeacher}
          isConnected={isConnected}
          participantCount={participants.length}
        />

        {/* Floating Reactions */}
        <FloatingReactions reactions={reactions} />

        {/* Participants Grid */}
        <SimpleGrid cols={{ base: 2, sm: 3, md: 4, lg: 5 }} spacing="md" mb="xl">
          {participants.map((participant) => (
            <ParticipantCard
              key={participant.id}
              participant={participant}
              isHost={classroom.teacherId === participant.id}
            />
          ))}
        </SimpleGrid>

        {/* Voice Controls */}
        <FloatingControlsWrapper>
          <VoiceControls
            isMuted={isMuted}
            isHandRaised={isHandRaised}
            onToggleMute={handleMuteToggle}
            onLeave={handleLeave}
            onToggleHand={handleRaiseHand}
            onReaction={handleReaction}
          />
        </FloatingControlsWrapper>

        {/* Teacher Controls */}
        {isTeacher && <TeacherControls />}
      </Container>
    </Box>
  );
}

// ═══════════════════════════════════════════════════════════════
// Main Page Component
// ═══════════════════════════════════════════════════════════════
export default function ClassroomSessionPage() {
  const params = useParams();
  const classroomId = params.id as string;

  return (
    <PrivateRoute>
      <ClassroomContent classroomId={classroomId} />
    </PrivateRoute>
  );
}
