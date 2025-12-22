# Messenger Video/Audio Call - Frontend System Design

## Overview

Thiết kế hệ thống frontend cho tính năng gọi audio/video như Facebook Messenger, sử dụng WebRTC cho peer-to-peer communication.

---

## 1. Requirements

### Functional Requirements

| Feature | Description |
|---------|-------------|
| **1:1 Audio Call** | Gọi thoại giữa 2 người |
| **1:1 Video Call** | Gọi video giữa 2 người |
| **Group Call** | Gọi nhóm (tối đa 8 người) |
| **Screen Sharing** | Chia sẻ màn hình |
| **Call Controls** | Mute/Unmute, Camera On/Off, End Call |
| **Picture-in-Picture** | Minimize call window |
| **Call History** | Lịch sử cuộc gọi (missed, completed) |
| **Incoming Call UI** | Notification khi có cuộc gọi đến |

### Non-Functional Requirements

| Requirement | Target |
|-------------|--------|
| **Latency** | < 200ms end-to-end |
| **Video Quality** | Adaptive (360p → 1080p) |
| **Audio Quality** | Opus codec, noise cancellation |
| **Connection Time** | < 3s to establish call |
| **Reconnection** | Auto-reconnect on network change |

---

## 2. Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT                                   │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐              │
│  │   Call UI   │  │ Media Engine│  │  Network    │              │
│  │  Components │  │   (WebRTC)  │  │  Manager    │              │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘              │
│         │                │                │                      │
│         └────────────────┼────────────────┘                      │
│                          ▼                                       │
│              ┌─────────────────────┐                             │
│              │   Call State Manager│                             │
│              │      (Redux/Zustand)│                             │
│              └─────────────────────┘                             │
└─────────────────────────────────────────────────────────────────┘
                           │
                           ▼ WebSocket (Signaling)
┌─────────────────────────────────────────────────────────────────┐
│                      SIGNALING SERVER                            │
├─────────────────────────────────────────────────────────────────┤
│  • Exchange SDP offers/answers                                   │
│  • Exchange ICE candidates                                       │
│  • Handle call events (ring, accept, reject, end)                │
│  • Manage room membership for group calls                        │
└─────────────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│                      TURN/STUN SERVERS                           │
├─────────────────────────────────────────────────────────────────┤
│  STUN: NAT traversal, discover public IP                         │
│  TURN: Relay media when P2P fails (symmetric NAT)                │
└─────────────────────────────────────────────────────────────────┘
```

---

## 3. WebRTC Fundamentals

### 3.1 Signaling Flow (SDP Exchange)

```
   Caller                    Signaling Server                    Callee
     │                              │                              │
     │──── call_request ───────────►│                              │
     │                              │◄─────── call_request ────────│
     │                              │         (notification)       │
     │                              │                              │
     │                              │◄─────── call_accept ─────────│
     │◄─── call_accept ─────────────│                              │
     │                              │                              │
     │     Create Offer             │                              │
     │──── SDP Offer ──────────────►│──────► SDP Offer ───────────►│
     │                              │                              │
     │                              │        Create Answer         │
     │◄─── SDP Answer ──────────────│◄────── SDP Answer ───────────│
     │                              │                              │
     │◄────── ICE Candidates ───────┼─────── ICE Candidates ──────►│
     │                              │                              │
     │◄═════════════════ P2P Media Stream ═════════════════════════►│
```

### 3.2 ICE Candidate Types

| Type | Description | Priority |
|------|-------------|----------|
| **host** | Local IP (fastest, P2P) | Highest |
| **srflx** | Server Reflexive (via STUN) | Medium |
| **relay** | TURN relay (fallback) | Lowest |

### 3.3 SDP Structure

```
v=0
o=- 123456789 2 IN IP4 127.0.0.1
s=-
t=0 0
a=group:BUNDLE audio video
m=audio 9 UDP/TLS/RTP/SAVPF 111
a=rtpmap:111 opus/48000/2           ← Opus codec for audio
a=fmtp:111 minptime=10;useinbandfec=1
m=video 9 UDP/TLS/RTP/SAVPF 96
a=rtpmap:96 VP8/90000               ← VP8 codec for video
```

---

## 4. Data Model

### 4.1 TypeScript Interfaces

```typescript
// Call Types
type CallType = 'audio' | 'video';
type CallStatus = 'idle' | 'calling' | 'ringing' | 'connecting' | 'connected' | 'ended';
type EndReason = 'completed' | 'declined' | 'missed' | 'failed' | 'busy';

// Participant
interface Participant {
  id: string;
  name: string;
  avatarUrl: string;
  isMuted: boolean;
  isVideoOff: boolean;
  isSpeaking: boolean;
  stream?: MediaStream;
  connection?: RTCPeerConnection;
}

// Call State
interface CallState {
  callId: string | null;
  callType: CallType;
  status: CallStatus;
  isOutgoing: boolean;
  startTime: number | null;
  participants: Participant[];
  localStream: MediaStream | null;
  screenStream: MediaStream | null;
  
  // Local controls
  isMuted: boolean;
  isVideoOff: boolean;
  isSpeakerOn: boolean;
  isScreenSharing: boolean;
  
  // UI state
  isPipMode: boolean;
  isFullscreen: boolean;
}

// Signaling Messages
interface SignalMessage {
  type: 'call_request' | 'call_accept' | 'call_reject' | 'call_end'
      | 'offer' | 'answer' | 'ice_candidate' | 'mute_toggle';
  callId: string;
  from: string;
  to: string;
  payload?: any;
}

// Call History
interface CallHistoryEntry {
  id: string;
  participantIds: string[];
  callType: CallType;
  startTime: number;
  endTime: number;
  duration: number;
  endReason: EndReason;
}
```

---

## 5. Component Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        App                                       │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────────────┐  ┌─────────────────────────────────┐   │
│  │   IncomingCallModal │  │         CallScreen              │   │
│  │   • Caller info     │  │  ┌─────────────────────────┐    │   │
│  │   • Accept/Decline  │  │  │     VideoGrid           │    │   │
│  └─────────────────────┘  │  │  • LocalVideo           │    │   │
│                           │  │  • RemoteVideo(s)       │    │   │
│  ┌─────────────────────┐  │  │  • ParticipantOverlay   │    │   │
│  │   CallHistory       │  │  └─────────────────────────┘    │   │
│  │   • Recent calls    │  │  ┌─────────────────────────┐    │   │
│  │   • Missed calls    │  │  │     CallControls        │    │   │
│  └─────────────────────┘  │  │  • Mute   • Video       │    │   │
│                           │  │  • Speaker • End Call   │    │   │
│                           │  │  • Screen Share         │    │   │
│                           │  └─────────────────────────┘    │   │
│                           │  ┌─────────────────────────┐    │   │
│                           │  │     CallTimer           │    │   │
│                           │  └─────────────────────────┘    │   │
│                           └─────────────────────────────────┘   │
│                                                                  │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │                     PictureInPicture                      │  │
│  │   Floating mini window when minimized                     │  │
│  └───────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 6. WebRTC Implementation

### 6.1 RTCPeerConnection Setup

```typescript
const createPeerConnection = (config: RTCConfiguration): RTCPeerConnection => {
  const pc = new RTCPeerConnection({
    iceServers: [
      { urls: 'stun:stun.l.google.com:19302' },
      { urls: 'turn:turn.example.com', username: 'user', credential: 'pass' }
    ],
    iceCandidatePoolSize: 10,
  });

  pc.onicecandidate = (event) => {
    if (event.candidate) {
      signaling.send({ type: 'ice_candidate', payload: event.candidate });
    }
  };

  pc.ontrack = (event) => {
    // Remote stream received
    remoteVideo.srcObject = event.streams[0];
  };

  pc.oniceconnectionstatechange = () => {
    console.log('ICE state:', pc.iceConnectionState);
    // Handle: checking → connected → disconnected → failed
  };

  return pc;
};
```

### 6.2 Media Acquisition

```typescript
const getMediaStream = async (callType: CallType): Promise<MediaStream> => {
  const constraints: MediaStreamConstraints = {
    audio: {
      echoCancellation: true,
      noiseSuppression: true,
      autoGainControl: true,
    },
    video: callType === 'video' ? {
      width: { ideal: 1280 },
      height: { ideal: 720 },
      frameRate: { ideal: 30 },
      facingMode: 'user',
    } : false,
  };

  return navigator.mediaDevices.getUserMedia(constraints);
};

const getScreenStream = async (): Promise<MediaStream> => {
  return navigator.mediaDevices.getDisplayMedia({
    video: { cursor: 'always' },
    audio: true, // System audio
  });
};
```

### 6.3 Offer/Answer Exchange

```typescript
// Caller creates offer
const createOffer = async (pc: RTCPeerConnection): Promise<RTCSessionDescriptionInit> => {
  const offer = await pc.createOffer({
    offerToReceiveAudio: true,
    offerToReceiveVideo: true,
  });
  await pc.setLocalDescription(offer);
  return offer;
};

// Callee creates answer
const createAnswer = async (
  pc: RTCPeerConnection, 
  offer: RTCSessionDescriptionInit
): Promise<RTCSessionDescriptionInit> => {
  await pc.setRemoteDescription(new RTCSessionDescription(offer));
  const answer = await pc.createAnswer();
  await pc.setLocalDescription(answer);
  return answer;
};

// Handle incoming answer (caller side)
const handleAnswer = async (
  pc: RTCPeerConnection, 
  answer: RTCSessionDescriptionInit
): Promise<void> => {
  await pc.setRemoteDescription(new RTCSessionDescription(answer));
};
```

---

## 7. State Management

### 7.1 Call State Machine

```
                    ┌─────────────────────────────────────────┐
                    ▼                                         │
┌───────┐  initiate  ┌─────────┐  accept   ┌────────────┐    │
│ IDLE  │───────────►│ CALLING │─────────►│ CONNECTING │    │
└───────┘            └─────────┘           └─────┬──────┘    │
    ▲                     │                      │            │
    │                     │ reject/timeout       │ connected  │
    │                     ▼                      ▼            │
    │               ┌─────────┐            ┌───────────┐      │
    │               │  ENDED  │◄───────────│ CONNECTED │      │
    │               └────┬────┘   hangup   └───────────┘      │
    │                    │                                    │
    └────────────────────┴────────────────────────────────────┘
                         (reset)
```

### 7.2 Redux/Zustand Store

```typescript
interface CallStore {
  // State
  call: CallState;
  
  // Actions
  initiateCall: (userId: string, callType: CallType) => void;
  acceptCall: () => void;
  rejectCall: () => void;
  endCall: () => void;
  
  toggleMute: () => void;
  toggleVideo: () => void;
  toggleScreenShare: () => void;
  
  // WebRTC
  setLocalStream: (stream: MediaStream) => void;
  addRemoteStream: (participantId: string, stream: MediaStream) => void;
  addIceCandidate: (participantId: string, candidate: RTCIceCandidate) => void;
}
```

---

## 8. Adaptive Quality

### 8.1 Bandwidth Estimation

```typescript
const monitorBandwidth = (pc: RTCPeerConnection) => {
  setInterval(async () => {
    const stats = await pc.getStats();
    
    stats.forEach(report => {
      if (report.type === 'outbound-rtp' && report.kind === 'video') {
        const bitrate = report.bytesSent * 8 / 1000; // kbps
        adjustQuality(bitrate);
      }
    });
  }, 2000);
};

const adjustQuality = (bitrate: number) => {
  const sender = pc.getSenders().find(s => s.track?.kind === 'video');
  if (!sender) return;

  const params = sender.getParameters();
  if (!params.encodings) params.encodings = [{}];

  if (bitrate < 500) {
    params.encodings[0].maxBitrate = 300000;  // 300kbps → 360p
  } else if (bitrate < 1500) {
    params.encodings[0].maxBitrate = 1000000; // 1Mbps → 720p
  } else {
    params.encodings[0].maxBitrate = 2500000; // 2.5Mbps → 1080p
  }

  sender.setParameters(params);
};
```

---

## 9. Group Call (SFU Architecture)

### 9.1 Mesh vs SFU

```
MESH (P2P - bad for groups)          SFU (Selective Forwarding Unit)
┌─────┐     ┌─────┐                  ┌─────┐
│  A  │◄───►│  B  │                  │  A  │──┐
└──┬──┘     └──┬──┘                  └─────┘  │
   │           │                              │
   │     ┌─────┘                     ┌────────┴────────┐
   │     │                           │       SFU      │
   ▼     ▼                           │  (Media Server)│
┌─────────────┐                      └─┬─────────┬────┘
│      C      │                        │         │
└─────────────┘                   ┌────┴──┐ ┌────┴──┐
                                  │   B   │ │   C   │
Connections: n(n-1)/2             └───────┘ └───────┘
3 users = 3 connections           Connections: n
8 users = 28 connections!         8 users = 8 connections
```

### 9.2 Simulcast for SFU

```typescript
// Send multiple quality layers
const addTracksWithSimulcast = (pc: RTCPeerConnection, stream: MediaStream) => {
  const videoTrack = stream.getVideoTracks()[0];
  
  pc.addTransceiver(videoTrack, {
    direction: 'sendonly',
    sendEncodings: [
      { rid: 'high', maxBitrate: 2500000 },  // 1080p
      { rid: 'mid', maxBitrate: 500000, scaleResolutionDownBy: 2 },  // 540p
      { rid: 'low', maxBitrate: 150000, scaleResolutionDownBy: 4 },  // 270p
    ],
  });
};
```

---

## 10. UI/UX Considerations

### 10.1 Call States UI

| State | UI Element |
|-------|------------|
| **Calling** | Outgoing ring animation, cancel button |
| **Ringing** | Incoming call modal, accept/decline buttons |
| **Connecting** | Loading spinner, "Connecting..." text |
| **Connected** | Video grid, call timer, controls |
| **Reconnecting** | "Reconnecting..." toast, continue audio |
| **Ended** | Call summary (duration), close button |

### 10.2 Video Layout

```
1 Participant:          2 Participants:       3-4 Participants:
┌─────────────────┐    ┌────────┬────────┐   ┌────────┬────────┐
│                 │    │        │        │   │        │        │
│     Remote      │    │ Remote │  Local │   │        │        │
│                 │    │        │        │   ├────────┼────────┤
├─────────────────┤    └────────┴────────┘   │        │        │
│  Local (small)  │                          │        │        │
└─────────────────┘                          └────────┴────────┘
```

---

## 11. Error Handling

| Error | Cause | Recovery |
|-------|-------|----------|
| **NotAllowedError** | User denied permission | Show permission request dialog |
| **NotFoundError** | No camera/mic | Show device selection, fallback to audio |
| **ICE Failed** | NAT traversal failed | Fallback to TURN relay |
| **Connection Lost** | Network issue | Auto-reconnect with backoff |
| **Peer Unreachable** | Callee offline | Show "User unavailable" |

---

## 12. Security

| Aspect | Implementation |
|--------|----------------|
| **E2E Encryption** | SRTP with DTLS key exchange (WebRTC default) |
| **Signaling Auth** | JWT tokens for WebSocket |
| **TURN Auth** | Time-limited credentials |
| **Permission Scope** | Request camera/mic only when needed |

---

## 13. Performance Optimization

| Technique | Benefit |
|-----------|---------|
| **Hardware Encoding** | Use GPU for VP8/H.264 encoding |
| **Adaptive Bitrate** | Adjust quality based on bandwidth |
| **Bandwidth Estimation** | Pre-allocate resources |
| **Lazy Media Load** | Don't request camera until call starts |
| **Track Management** | Disable video track when camera off (save bandwidth) |

---

## 14. Browser Compatibility

| Feature | Chrome | Firefox | Safari | Edge |
|---------|--------|---------|--------|------|
| WebRTC | ✅ | ✅ | ✅ (11+) | ✅ |
| Screen Share | ✅ | ✅ | ✅ (13+) | ✅ |
| Simulcast | ✅ | ✅ | ⚠️ Limited | ✅ |
| H.264 | ✅ | ⚠️ Partial | ✅ | ✅ |
| Opus | ✅ | ✅ | ✅ | ✅ |
