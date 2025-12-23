'use client';

import { create } from 'zustand';

interface MediaStore {
    localStream: MediaStream | null;
    screenStream: MediaStream | null;
    isMuted: boolean;
    isVideoEnabled: boolean;
    isScreenSharing: boolean;
    isSpeaking: boolean;
    audioLevel: number;
    trackVersion: number; // Used to trigger WebRTC renegotiation

    initMedia: (withVideo?: boolean) => Promise<void>;
    toggleMute: () => void;
    toggleVideo: () => Promise<void>;
    startScreenShare: () => Promise<boolean>;
    stopScreenShare: () => void;
    setAudioLevel: (level: number) => void;
    setSpeaking: (speaking: boolean) => void;
    cleanup: () => void;
}

export const useMediaStore = create<MediaStore>((set, get) => ({
    localStream: null,
    screenStream: null,
    isMuted: true, // Start muted
    isVideoEnabled: false, // Start with video off
    isScreenSharing: false,
    isSpeaking: false,
    audioLevel: 0,
    trackVersion: 0,

    initMedia: async (withVideo = false) => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                audio: {
                    echoCancellation: true,
                    noiseSuppression: false,
                    autoGainControl: true,
                    sampleRate: 48000,
                    channelCount: 1,
                },
                video: withVideo ? {
                    width: { ideal: 640 },
                    height: { ideal: 480 },
                    frameRate: { ideal: 30 },
                    facingMode: 'user',
                } : false,
            });

            // Start with audio muted
            stream.getAudioTracks().forEach(track => {
                track.enabled = false;
            });

            // Video starts disabled unless explicitly requested
            stream.getVideoTracks().forEach(track => {
                track.enabled = withVideo;
            });

            set({
                localStream: stream,
                isVideoEnabled: withVideo,
                trackVersion: 0,
            });

            console.log('Media initialized:', {
                audio: stream.getAudioTracks()[0]?.getSettings(),
                video: stream.getVideoTracks()[0]?.getSettings(),
            });
        } catch (error) {
            console.error('Failed to get media:', error);
        }
    },

    toggleMute: () => {
        const { localStream, isMuted } = get();
        if (localStream) {
            localStream.getAudioTracks().forEach(track => {
                track.enabled = isMuted; // Toggle
            });
            set({ isMuted: !isMuted });
        }
    },

    toggleVideo: async () => {
        const { localStream, isVideoEnabled, trackVersion } = get();

        if (!localStream) return;

        // If no video track exists, we need to get one
        if (localStream.getVideoTracks().length === 0) {
            try {
                const videoStream = await navigator.mediaDevices.getUserMedia({
                    video: {
                        width: { ideal: 640 },
                        height: { ideal: 480 },
                        frameRate: { ideal: 30 },
                        facingMode: 'user',
                    },
                });
                const videoTrack = videoStream.getVideoTracks()[0];
                localStream.addTrack(videoTrack);

                // Increment version to trigger WebRTC renegotiation
                set({
                    isVideoEnabled: true,
                    trackVersion: trackVersion + 1,
                });
                console.log('Video track added, version:', trackVersion + 1);
            } catch (error) {
                console.error('Failed to get video:', error);
            }
        } else {
            // Toggle existing video track
            localStream.getVideoTracks().forEach(track => {
                track.enabled = !isVideoEnabled;
            });
            set({
                isVideoEnabled: !isVideoEnabled,
                trackVersion: trackVersion + 1,
            });
            console.log('Video toggled:', !isVideoEnabled, 'version:', trackVersion + 1);
        }
    },

    startScreenShare: async () => {
        const { trackVersion, isScreenSharing } = get();

        if (isScreenSharing) {
            console.log('Screen sharing already active');
            return false;
        }

        try {
            const screenStream = await navigator.mediaDevices.getDisplayMedia({
                video: true,
                audio: true,
            });

            // Handle user stopping share via browser UI
            screenStream.getVideoTracks()[0].onended = () => {
                get().stopScreenShare();
            };

            set({
                screenStream,
                isScreenSharing: true,
                trackVersion: trackVersion + 1,
            });

            console.log('Screen sharing started:', {
                video: screenStream.getVideoTracks()[0]?.getSettings(),
            });

            return true;
        } catch (error) {
            console.error('Failed to start screen share:', error);
            return false;
        }
    },

    stopScreenShare: () => {
        const { screenStream, trackVersion } = get();

        if (screenStream) {
            screenStream.getTracks().forEach(track => track.stop());
        }

        set({
            screenStream: null,
            isScreenSharing: false,
            trackVersion: trackVersion + 1,
        });

        console.log('Screen sharing stopped');
    },

    setAudioLevel: (level: number) => set({ audioLevel: level }),

    setSpeaking: (speaking: boolean) => set({ isSpeaking: speaking }),

    cleanup: () => {
        const { localStream, screenStream } = get();
        localStream?.getTracks().forEach(t => t.stop());
        screenStream?.getTracks().forEach(t => t.stop());
        set({
            localStream: null,
            screenStream: null,
            isMuted: true,
            isVideoEnabled: false,
            isScreenSharing: false,
            isSpeaking: false,
            trackVersion: 0,
        });
    },
}));

