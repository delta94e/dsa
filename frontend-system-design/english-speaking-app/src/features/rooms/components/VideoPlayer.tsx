'use client';

import { useEffect, useRef } from 'react';
import { Box, Text, Avatar, Badge } from '@mantine/core';
import { IconMicrophoneOff, IconVideoOff } from '@tabler/icons-react';
import { motion } from 'framer-motion';

interface VideoPlayerProps {
    stream: MediaStream | null;
    name: string;
    avatarUrl?: string;
    isMuted?: boolean;
    isVideoEnabled?: boolean;
    isSpeaking?: boolean;
    isLocal?: boolean;
}

export function VideoPlayer({
    stream,
    name,
    avatarUrl,
    isMuted = false,
    isVideoEnabled = true,
    isSpeaking = false,
    isLocal = false,
}: VideoPlayerProps) {
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        if (videoRef.current && stream) {
            videoRef.current.srcObject = stream;
        }
    }, [stream]);

    const hasVideoTrack = stream?.getVideoTracks().some(t => t.enabled) ?? false;
    const showVideo = isVideoEnabled && hasVideoTrack;

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            style={{ height: '100%', width: '100%' }}
        >
            <Box
                style={{
                    position: 'relative',
                    width: '100%',
                    height: '100%',
                    borderRadius: 12,
                    overflow: 'hidden',
                    background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
                    border: isSpeaking ? '3px solid #22c55e' : '3px solid transparent',
                    boxShadow: isSpeaking
                        ? '0 0 20px rgba(34, 197, 94, 0.4)'
                        : '0 4px 20px rgba(0,0,0,0.3)',
                    transition: 'all 0.2s ease',
                }}
            >
                {/* Video Element */}
                {showVideo ? (
                    <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        muted={isLocal}
                        style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            transform: isLocal ? 'scaleX(-1)' : 'none', // Mirror local video
                        }}
                    />
                ) : (
                    // Avatar placeholder when video is off
                    <Box
                        style={{
                            width: '100%',
                            height: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexDirection: 'column',
                            gap: 12,
                        }}
                    >
                        <Avatar
                            src={avatarUrl}
                            alt={name}
                            size={80}
                            radius="xl"
                            style={{
                                border: isSpeaking ? '4px solid #22c55e' : '4px solid #4a4a6a',
                            }}
                        />
                        {!isVideoEnabled && (
                            <Badge
                                color="gray"
                                variant="filled"
                                leftSection={<IconVideoOff size={12} />}
                            >
                                Camera Off
                            </Badge>
                        )}
                    </Box>
                )}

                {/* Name overlay */}
                <Box
                    style={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        padding: '8px 12px',
                        background: 'linear-gradient(transparent, rgba(0,0,0,0.8))',
                    }}
                >
                    <Box style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <Text c="white" size="sm" fw={600}>
                            {name} {isLocal && '(You)'}
                        </Text>
                        {isMuted && (
                            <IconMicrophoneOff size={14} color="#ef4444" />
                        )}
                    </Box>
                </Box>
            </Box>
        </motion.div>
    );
}
