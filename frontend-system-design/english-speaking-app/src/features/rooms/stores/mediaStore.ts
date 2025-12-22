'use client';

import { create } from 'zustand';

interface MediaStore {
    localStream: MediaStream | null;
    isMuted: boolean;
    isVideoEnabled: boolean;
    isSpeaking: boolean;
    audioLevel: number;
    trackVersion: number; // Used to trigger WebRTC renegotiation

    initMedia: (withVideo?: boolean) => Promise<void>;
    toggleMute: () => void;
    toggleVideo: () => Promise<void>;
    setAudioLevel: (level: number) => void;
    setSpeaking: (speaking: boolean) => void;
    cleanup: () => void;
}

export const useMediaStore = create<MediaStore>((set, get) => ({
    localStream: null,
    isMuted: true, // Start muted
    isVideoEnabled: false, // Start with video off
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

    setAudioLevel: (level: number) => set({ audioLevel: level }),

    setSpeaking: (speaking: boolean) => set({ isSpeaking: speaking }),

    cleanup: () => {
        const { localStream } = get();
        localStream?.getTracks().forEach(t => t.stop());
        set({
            localStream: null,
            isMuted: true,
            isVideoEnabled: false,
            isSpeaking: false,
            trackVersion: 0,
        });
    },
}));
