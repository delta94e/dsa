# Messenger Call - Deep Dive Concepts

## 1. WebRTC Connection Lifecycle

### 1.1 Complete Connection Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                     WebRTC Connection Phases                     │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Phase 1: SIGNALING                                              │
│  ─────────────────                                               │
│  ┌──────────┐                               ┌──────────┐         │
│  │  Caller  │                               │  Callee  │         │
│  └────┬─────┘                               └────┬─────┘         │
│       │                                          │               │
│       │  1. getUserMedia() → localStream         │               │
│       │  2. new RTCPeerConnection()              │               │
│       │  3. pc.addTrack(localStream)             │               │
│       │  4. pc.createOffer()                     │               │
│       │  5. pc.setLocalDescription(offer)        │               │
│       │                                          │               │
│       │──────────── SDP Offer ──────────────────►│               │
│       │                                          │               │
│       │                     1. getUserMedia()    │               │
│       │                     2. new RTCPeerConnection()           │
│       │                     3. pc.setRemoteDescription(offer)    │
│       │                     4. pc.addTrack(localStream)          │
│       │                     5. pc.createAnswer()                 │
│       │                     6. pc.setLocalDescription(answer)    │
│       │                                          │               │
│       │◄─────────── SDP Answer ──────────────────│               │
│       │                                          │               │
│       │  7. pc.setRemoteDescription(answer)      │               │
│                                                                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Phase 2: ICE GATHERING                                          │
│  ───────────────────────                                         │
│       │                                          │               │
│       │──────── ICE Candidate (host) ───────────►│               │
│       │──────── ICE Candidate (srflx) ──────────►│               │
│       │──────── ICE Candidate (relay) ──────────►│               │
│       │◄─────── ICE Candidate (host) ────────────│               │
│       │◄─────── ICE Candidate (srflx) ───────────│               │
│       │◄─────── ICE Candidate (relay) ───────────│               │
│                                                                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Phase 3: CONNECTIVITY CHECK                                     │
│  ───────────────────────────                                     │
│       │                                          │               │
│       │◄═══════ STUN Binding Request ════════════│               │
│       │════════ STUN Binding Response ══════════►│               │
│       │                                          │               │
│       │  ICE State: checking → connected         │               │
│                                                                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Phase 4: DTLS HANDSHAKE (Encryption)                            │
│  ────────────────────────────────────                            │
│       │                                          │               │
│       │◄═══════ DTLS ClientHello ════════════════│               │
│       │════════ DTLS ServerHello, Certificate ══►│               │
│       │◄═══════ DTLS Finished ═══════════════════│               │
│       │                                          │               │
│       │  Shared secret established               │               │
│                                                                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Phase 5: MEDIA FLOW (SRTP)                                      │
│  ──────────────────────────                                      │
│       │                                          │               │
│       │◄═══════════ Encrypted RTP ═══════════════│               │
│       │════════════ Encrypted RTP ══════════════►│               │
│       │                                          │               │
│       │  🎥 Video + 🎤 Audio streaming           │               │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 2. NAT Traversal Deep Dive

### 2.1 NAT Types

```
┌────────────────────────────────────────────────────────────────┐
│                        NAT TYPES                                │
├────────────────────────────────────────────────────────────────┤
│                                                                 │
│  1. FULL CONE NAT (Easy)                                        │
│     ┌─────────┐         ┌─────────┐                             │
│     │ Client  │─────────│   NAT   │◄────── Any external host    │
│     │ :5000   │         │  :8000  │                             │
│     └─────────┘         └─────────┘                             │
│     Once mapped, anyone can send to NAT:8000                    │
│                                                                 │
├────────────────────────────────────────────────────────────────┤
│                                                                 │
│  2. ADDRESS-RESTRICTED CONE                                     │
│     ┌─────────┐         ┌─────────┐                             │
│     │ Client  │─────────│   NAT   │◄─── Only IPs client sent to │
│     │ :5000   │         │  :8000  │                             │
│     └─────────┘         └─────────┘                             │
│     NAT only accepts from IPs the client has contacted          │
│                                                                 │
├────────────────────────────────────────────────────────────────┤
│                                                                 │
│  3. PORT-RESTRICTED CONE                                        │
│     ┌─────────┐         ┌─────────┐                             │
│     │ Client  │─────────│   NAT   │◄─ Only IP:Port client sent  │
│     │ :5000   │         │  :8000  │                             │
│     └─────────┘         └─────────┘                             │
│     NAT only accepts from exact IP:Port pairs                   │
│                                                                 │
├────────────────────────────────────────────────────────────────┤
│                                                                 │
│  4. SYMMETRIC NAT (Hardest - Requires TURN)                     │
│     ┌─────────┐         ┌─────────┐                             │
│     │ Client  │────┬────│ NAT:8000│──► Server A                 │
│     │ :5000   │    │    │ NAT:8001│──► Server B (different port)│
│     └─────────┘    │    └─────────┘                             │
│                    │                                            │
│     Different external port for each destination!               │
│     STUN can't predict the port → TURN relay required           │
│                                                                 │
└────────────────────────────────────────────────────────────────┘
```

### 2.2 STUN Flow

```typescript
// STUN: Discover our public IP and port
// Client behind NAT sends binding request to STUN server

const stunCheck = async (): Promise<{ ip: string; port: number }> => {
  const pc = new RTCPeerConnection({
    iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
  });
  
  pc.createDataChannel('');
  const offer = await pc.createOffer();
  await pc.setLocalDescription(offer);
  
  return new Promise((resolve) => {
    pc.onicecandidate = (event) => {
      if (event.candidate?.candidate.includes('srflx')) {
        // srflx = Server Reflexive = our public IP:port
        const parts = event.candidate.candidate.split(' ');
        resolve({
          ip: parts[4],    // Public IP
          port: parseInt(parts[5])  // Public Port
        });
        pc.close();
      }
    };
  });
};
```

### 2.3 TURN Relay

```
When P2P fails (Symmetric NAT), use TURN relay:

┌────────────┐                    ┌────────────┐
│   Caller   │                    │   Callee   │
│ (Sym NAT)  │                    │ (Sym NAT)  │
└─────┬──────┘                    └──────┬─────┘
      │                                  │
      │  ┌──────────────────────────┐    │
      │  │       TURN SERVER        │    │
      └──►│                         │◄───┘
         │   Relay ALL media        │
         │   Add ~50ms latency      │
         │   Costs bandwidth $$     │
         └──────────────────────────┘
```

---

## 3. Perfect Negotiation Pattern

### 3.1 Glare Resolution

When both peers try to negotiate simultaneously (offer collision):

```typescript
// Perfect negotiation - handles simultaneous offers
const setupPerfectNegotiation = (pc: RTCPeerConnection, polite: boolean) => {
  let makingOffer = false;
  let ignoreOffer = false;
  
  pc.onnegotiationneeded = async () => {
    try {
      makingOffer = true;
      await pc.setLocalDescription();
      signaling.send({ type: 'offer', sdp: pc.localDescription });
    } finally {
      makingOffer = false;
    }
  };

  signaling.onmessage = async ({ type, sdp, candidate }) => {
    try {
      if (type === 'offer') {
        // GLARE: both sides sent offers
        const offerCollision = 
          type === 'offer' && 
          (makingOffer || pc.signalingState !== 'stable');
        
        ignoreOffer = !polite && offerCollision;
        if (ignoreOffer) return; // Impolite peer wins, ignore incoming offer
        
        await pc.setRemoteDescription({ type: 'offer', sdp });
        await pc.setLocalDescription();
        signaling.send({ type: 'answer', sdp: pc.localDescription });
      } 
      else if (type === 'answer') {
        await pc.setRemoteDescription({ type: 'answer', sdp });
      }
      else if (candidate) {
        await pc.addIceCandidate(candidate);
      }
    } catch (err) {
      console.error('Negotiation error:', err);
    }
  };
};
```

---

## 4. Media Constraints & Tracks

### 4.1 Advanced Audio Constraints

```typescript
const getOptimizedAudioStream = async (): Promise<MediaStream> => {
  return navigator.mediaDevices.getUserMedia({
    audio: {
      // Echo cancellation
      echoCancellation: { ideal: true },
      
      // Background noise suppression
      noiseSuppression: { ideal: true },
      
      // Auto-adjust mic volume
      autoGainControl: { ideal: true },
      
      // Sample rate (higher = better quality)
      sampleRate: { ideal: 48000 },
      
      // Mono (voice) or stereo (music)
      channelCount: { ideal: 1 },
      
      // Latency target
      latency: { ideal: 0.01 }, // 10ms
    }
  });
};
```

### 4.2 Video Resolution Ladder

```typescript
type VideoQuality = 'low' | 'medium' | 'high' | 'hd';

const VIDEO_CONSTRAINTS: Record<VideoQuality, MediaTrackConstraints> = {
  low: {
    width: { ideal: 320 },
    height: { ideal: 240 },
    frameRate: { ideal: 15 },
  },
  medium: {
    width: { ideal: 640 },
    height: { ideal: 480 },
    frameRate: { ideal: 24 },
  },
  high: {
    width: { ideal: 1280 },
    height: { ideal: 720 },
    frameRate: { ideal: 30 },
  },
  hd: {
    width: { ideal: 1920 },
    height: { ideal: 1080 },
    frameRate: { ideal: 30 },
  },
};

const switchVideoQuality = async (track: MediaStreamTrack, quality: VideoQuality) => {
  const constraints = VIDEO_CONSTRAINTS[quality];
  await track.applyConstraints(constraints);
};
```

### 4.3 Track Enable/Disable

```typescript
// Mute audio (stop sending, but keep track)
const toggleMute = (stream: MediaStream, muted: boolean) => {
  stream.getAudioTracks().forEach(track => {
    track.enabled = !muted; // false = muted (no audio sent)
  });
};

// Toggle video (more efficient than stopping track)
const toggleVideo = (stream: MediaStream, off: boolean) => {
  stream.getVideoTracks().forEach(track => {
    track.enabled = !off; // false = black frames (saves CPU, not bandwidth)
  });
};

// Completely stop track (more aggressive)
const stopVideoTrack = (stream: MediaStream) => {
  stream.getVideoTracks().forEach(track => {
    track.stop(); // Camera LED turns off
  });
};
```

---

## 5. Statistics & Quality Monitoring

### 5.1 RTCStatsReport Analysis

```typescript
interface CallStats {
  // Video
  videoBytesSent: number;
  videoBytesReceived: number;
  videoPacketsLost: number;
  videoFrameRate: number;
  videoResolution: { width: number; height: number };
  
  // Audio
  audioBytesSent: number;
  audioLevel: number;
  jitter: number;
  
  // Connection
  rtt: number; // Round-trip time
  availableBandwidth: number;
  candidatePairType: 'host' | 'srflx' | 'relay';
}

const getCallStats = async (pc: RTCPeerConnection): Promise<CallStats> => {
  const stats = await pc.getStats();
  const result: Partial<CallStats> = {};
  
  stats.forEach(report => {
    switch (report.type) {
      case 'outbound-rtp':
        if (report.kind === 'video') {
          result.videoBytesSent = report.bytesSent;
          result.videoFrameRate = report.framesPerSecond;
        } else {
          result.audioBytesSent = report.bytesSent;
        }
        break;
        
      case 'inbound-rtp':
        if (report.kind === 'video') {
          result.videoBytesReceived = report.bytesReceived;
          result.videoPacketsLost = report.packetsLost;
        }
        result.jitter = report.jitter;
        break;
        
      case 'candidate-pair':
        if (report.state === 'succeeded') {
          result.rtt = report.currentRoundTripTime * 1000; // ms
          result.availableBandwidth = report.availableOutgoingBitrate;
        }
        break;
        
      case 'local-candidate':
        result.candidatePairType = report.candidateType;
        break;
    }
  });
  
  return result as CallStats;
};
```

### 5.2 Network Quality Indicator

```typescript
type NetworkQuality = 'excellent' | 'good' | 'fair' | 'poor';

const calculateNetworkQuality = (stats: CallStats): NetworkQuality => {
  const { rtt, videoPacketsLost, jitter } = stats;
  
  // Score from 0-100
  let score = 100;
  
  // RTT penalty
  if (rtt > 300) score -= 30;
  else if (rtt > 150) score -= 15;
  else if (rtt > 100) score -= 5;
  
  // Packet loss penalty
  const lossRate = videoPacketsLost / 100; // Simplified
  if (lossRate > 0.1) score -= 40;
  else if (lossRate > 0.05) score -= 20;
  else if (lossRate > 0.02) score -= 10;
  
  // Jitter penalty
  if (jitter > 0.05) score -= 20;
  else if (jitter > 0.03) score -= 10;
  
  // Map to quality
  if (score >= 80) return 'excellent';
  if (score >= 60) return 'good';
  if (score >= 40) return 'fair';
  return 'poor';
};
```

---

## 6. Reconnection Strategy

### 6.1 ICE Restart

```typescript
const handleIceConnectionFailure = async (pc: RTCPeerConnection) => {
  if (pc.iceConnectionState === 'failed') {
    console.log('ICE failed, attempting restart...');
    
    // ICE Restart - triggers new ICE gathering
    const offer = await pc.createOffer({ iceRestart: true });
    await pc.setLocalDescription(offer);
    
    // Send new offer to peer
    signaling.send({ 
      type: 'offer', 
      sdp: pc.localDescription,
      iceRestart: true 
    });
  }
};

pc.oniceconnectionstatechange = () => {
  const state = pc.iceConnectionState;
  console.log('ICE state:', state);
  
  switch (state) {
    case 'disconnected':
      // Temporary - might recover
      showToast('Connection unstable...');
      setTimeout(() => {
        if (pc.iceConnectionState === 'disconnected') {
          handleIceConnectionFailure(pc);
        }
      }, 3000);
      break;
      
    case 'failed':
      // Permanent failure
      handleIceConnectionFailure(pc);
      break;
      
    case 'connected':
      hideToast();
      break;
  }
};
```

### 6.2 Exponential Backoff

```typescript
class ReconnectionManager {
  private attempts = 0;
  private maxAttempts = 5;
  private baseDelay = 1000;
  
  async reconnect(pc: RTCPeerConnection): Promise<boolean> {
    while (this.attempts < this.maxAttempts) {
      this.attempts++;
      
      const delay = this.baseDelay * Math.pow(2, this.attempts - 1);
      console.log(`Reconnect attempt ${this.attempts}, waiting ${delay}ms`);
      
      await this.sleep(delay);
      
      try {
        await this.attemptIceRestart(pc);
        
        // Wait for connection
        const connected = await this.waitForConnection(pc, 10000);
        if (connected) {
          this.reset();
          return true;
        }
      } catch (err) {
        console.error('Reconnect failed:', err);
      }
    }
    
    return false; // All attempts failed
  }
  
  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  
  private reset() {
    this.attempts = 0;
  }
}
```

---

## 7. Screen Sharing

### 7.1 Replace Video Track

```typescript
const startScreenShare = async (pc: RTCPeerConnection) => {
  // Get screen stream
  const screenStream = await navigator.mediaDevices.getDisplayMedia({
    video: {
      cursor: 'always',
      displaySurface: 'monitor', // 'window' | 'browser' | 'monitor'
    },
    audio: {
      suppressLocalAudioPlayback: true, // Don't echo system audio
    },
  });
  
  const screenTrack = screenStream.getVideoTracks()[0];
  
  // Find existing video sender
  const sender = pc.getSenders().find(s => s.track?.kind === 'video');
  
  if (sender) {
    // Replace camera track with screen track
    await sender.replaceTrack(screenTrack);
  }
  
  // Handle user stopping screen share via browser UI
  screenTrack.onended = () => {
    stopScreenShare(pc);
  };
  
  return screenStream;
};

const stopScreenShare = async (pc: RTCPeerConnection, cameraStream: MediaStream) => {
  const cameraTrack = cameraStream.getVideoTracks()[0];
  const sender = pc.getSenders().find(s => s.track?.kind === 'video');
  
  if (sender && cameraTrack) {
    await sender.replaceTrack(cameraTrack);
  }
};
```

---

## 8. Picture-in-Picture API

```typescript
const enterPiP = async (videoElement: HTMLVideoElement) => {
  try {
    if (document.pictureInPictureEnabled) {
      await videoElement.requestPictureInPicture();
    }
  } catch (err) {
    console.error('PiP failed:', err);
  }
};

const exitPiP = async () => {
  if (document.pictureInPictureElement) {
    await document.exitPictureInPicture();
  }
};

// Listen for PiP events
videoElement.addEventListener('enterpictureinpicture', () => {
  console.log('Entered PiP mode');
});

videoElement.addEventListener('leavepictureinpicture', () => {
  console.log('Left PiP mode');
});
```

---

## 9. Voice Activity Detection (VAD)

```typescript
const createVoiceActivityDetector = (stream: MediaStream) => {
  const audioContext = new AudioContext();
  const source = audioContext.createMediaStreamSource(stream);
  const analyser = audioContext.createAnalyser();
  
  analyser.fftSize = 512;
  analyser.smoothingTimeConstant = 0.4;
  source.connect(analyser);
  
  const dataArray = new Uint8Array(analyser.frequencyBinCount);
  
  const checkAudioLevel = (): boolean => {
    analyser.getByteFrequencyData(dataArray);
    
    // Calculate average volume
    const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
    
    // Threshold for "speaking"
    return average > 30;
  };
  
  return {
    isSpeaking: checkAudioLevel,
    cleanup: () => {
      source.disconnect();
      audioContext.close();
    },
  };
};

// Usage: Show speaking indicator
setInterval(() => {
  participants.forEach(p => {
    if (p.vadDetector) {
      p.isSpeaking = p.vadDetector.isSpeaking();
    }
  });
}, 100);
```

---

## 10. Call Duration Timer

```typescript
class CallTimer {
  private startTime: number | null = null;
  private intervalId: ReturnType<typeof setInterval> | null = null;
  private onUpdate: (duration: string) => void;
  
  constructor(onUpdate: (duration: string) => void) {
    this.onUpdate = onUpdate;
  }
  
  start() {
    this.startTime = Date.now();
    this.intervalId = setInterval(() => {
      this.onUpdate(this.formatDuration());
    }, 1000);
  }
  
  stop(): number {
    if (this.intervalId) clearInterval(this.intervalId);
    return this.startTime ? Date.now() - this.startTime : 0;
  }
  
  private formatDuration(): string {
    if (!this.startTime) return '00:00';
    
    const elapsed = Math.floor((Date.now() - this.startTime) / 1000);
    const hours = Math.floor(elapsed / 3600);
    const minutes = Math.floor((elapsed % 3600) / 60);
    const seconds = elapsed % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }
}
```
