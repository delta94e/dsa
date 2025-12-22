'use client';

import { useEffect, useRef, useCallback, useState } from 'react';
import { RoomParticipant } from '@/types';

const ICE_SERVERS = [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
];

interface UseWebRTCProps {
    localStream: MediaStream | null;
    trackVersion: number;
    participants: RoomParticipant[];
    currentUserId: string;
    onSignal: (targetUserId: string, type: 'offer' | 'answer' | 'ice-candidate', data: unknown) => void;
}

export function useWebRTC({
    localStream,
    trackVersion,
    participants,
    currentUserId,
    onSignal,
}: UseWebRTCProps) {
    const peersRef = useRef<Map<string, RTCPeerConnection>>(new Map());
    const [remoteStreams, setRemoteStreams] = useState<Map<string, MediaStream>>(new Map());
    const localStreamRef = useRef<MediaStream | null>(null);
    const prevTrackVersionRef = useRef<number>(0);

    // Update stream ref and handle track changes
    useEffect(() => {
        localStreamRef.current = localStream;

        // If trackVersion changed, renegotiate with all peers
        if (localStream && trackVersion > prevTrackVersionRef.current) {
            console.log(`Track version changed: ${prevTrackVersionRef.current} -> ${trackVersion}`);
            prevTrackVersionRef.current = trackVersion;

            // Update all peer connections with new tracks
            peersRef.current.forEach((pc, participantId) => {
                // Get current senders
                const senders = pc.getSenders();
                const senderTrackIds = new Set(senders.map(s => s.track?.id).filter(Boolean));

                // Add any new tracks
                localStream.getTracks().forEach(track => {
                    if (!senderTrackIds.has(track.id)) {
                        console.log(`Adding ${track.kind} track to peer ${participantId}`);
                        pc.addTrack(track, localStream);
                    }
                });

                // Renegotiate - always renegotiate when tracks change
                console.log(`Renegotiating with ${participantId}`);
                pc.createOffer()
                    .then(offer => pc.setLocalDescription(offer))
                    .then(() => {
                        if (pc.localDescription) {
                            onSignal(participantId, 'offer', pc.localDescription.toJSON());
                        }
                    })
                    .catch(console.error);
            });
        }
    }, [localStream, trackVersion, currentUserId, onSignal]);

    // Create peer connection for a participant
    const createPeerConnection = useCallback(
        (participantId: string, isInitiator: boolean) => {
            if (peersRef.current.has(participantId)) {
                return peersRef.current.get(participantId)!;
            }

            console.log(`Creating peer connection for ${participantId}, initiator: ${isInitiator}`);

            const pc = new RTCPeerConnection({ iceServers: ICE_SERVERS });
            peersRef.current.set(participantId, pc);

            // Add local stream tracks
            if (localStreamRef.current) {
                localStreamRef.current.getTracks().forEach((track) => {
                    pc.addTrack(track, localStreamRef.current!);
                });
            }

            // Handle ICE candidates
            pc.onicecandidate = (event) => {
                if (event.candidate) {
                    onSignal(participantId, 'ice-candidate', event.candidate.toJSON());
                }
            };

            // Handle remote stream
            pc.ontrack = (event) => {
                console.log(`Received remote track from ${participantId}: ${event.track.kind}`);
                const [remoteStream] = event.streams;
                setRemoteStreams((prev) => new Map(prev).set(participantId, remoteStream));
            };

            // Handle connection state
            pc.onconnectionstatechange = () => {
                console.log(`Connection state with ${participantId}: ${pc.connectionState}`);
                if (pc.connectionState === 'disconnected' || pc.connectionState === 'failed') {
                    removePeer(participantId);
                }
            };

            // Handle negotiation needed (for dynamic track changes)
            pc.onnegotiationneeded = () => {
                console.log(`Negotiation needed for ${participantId}`);
                if (isInitiator || currentUserId > participantId) {
                    pc.createOffer()
                        .then((offer) => pc.setLocalDescription(offer))
                        .then(() => {
                            if (pc.localDescription) {
                                onSignal(participantId, 'offer', pc.localDescription.toJSON());
                            }
                        })
                        .catch(console.error);
                }
            };

            // If initiator, create and send offer
            if (isInitiator) {
                pc.createOffer()
                    .then((offer) => pc.setLocalDescription(offer))
                    .then(() => {
                        if (pc.localDescription) {
                            onSignal(participantId, 'offer', pc.localDescription.toJSON());
                        }
                    })
                    .catch(console.error);
            }

            return pc;
        },
        [onSignal, currentUserId]
    );

    // Remove peer connection
    const removePeer = useCallback((participantId: string) => {
        const pc = peersRef.current.get(participantId);
        if (pc) {
            pc.close();
            peersRef.current.delete(participantId);
            setRemoteStreams((prev) => {
                const next = new Map(prev);
                next.delete(participantId);
                return next;
            });
        }
    }, []);

    // Handle incoming signal from socket
    const handleSignal = useCallback(
        async (from: string, type: string, data: unknown) => {
            console.log(`Received signal: ${type} from ${from}`);

            let pc = peersRef.current.get(from);

            if (type === 'offer') {
                // Create peer connection if not exists (we're the answerer)
                if (!pc) {
                    pc = createPeerConnection(from, false);
                }

                const offer = data as RTCSessionDescriptionInit;
                await pc.setRemoteDescription(new RTCSessionDescription(offer));

                const answer = await pc.createAnswer();
                await pc.setLocalDescription(answer);

                onSignal(from, 'answer', answer);
            } else if (type === 'answer') {
                if (pc && pc.signalingState === 'have-local-offer') {
                    const answer = data as RTCSessionDescriptionInit;
                    await pc.setRemoteDescription(new RTCSessionDescription(answer));
                }
            } else if (type === 'ice-candidate') {
                if (pc) {
                    const candidate = data as RTCIceCandidateInit;
                    await pc.addIceCandidate(new RTCIceCandidate(candidate));
                }
            }
        },
        [createPeerConnection, onSignal]
    );

    // Connect to new participants
    useEffect(() => {
        if (!localStreamRef.current) return;

        const otherParticipants = participants.filter((p) => p.id !== currentUserId);

        // Create connections to new participants (as initiator if our ID is greater)
        otherParticipants.forEach((participant) => {
            if (!peersRef.current.has(participant.id)) {
                // Use ID comparison to determine initiator (avoids both sides initiating)
                const isInitiator = currentUserId > participant.id;
                createPeerConnection(participant.id, isInitiator);
            }
        });

        // Remove connections for participants who left
        const participantIds = new Set(otherParticipants.map((p) => p.id));
        peersRef.current.forEach((_, id) => {
            if (!participantIds.has(id)) {
                removePeer(id);
            }
        });
    }, [participants, currentUserId, createPeerConnection, removePeer]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            peersRef.current.forEach((pc) => pc.close());
            peersRef.current.clear();
        };
    }, []);

    return {
        remoteStreams,
        handleSignal,
    };
}
