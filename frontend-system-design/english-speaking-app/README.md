# 🎤 SpeakUp - English Speaking Practice App

A real-time voice chat application for practicing English with people around the world and AI tutors.

![Next.js](https://img.shields.io/badge/Next.js-14-black)
![NestJS](https://img.shields.io/badge/NestJS-10-red)
![Socket.IO](https://img.shields.io/badge/Socket.IO-4-white)
![WebRTC](https://img.shields.io/badge/WebRTC-enabled-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)

## ✨ Features

### 🎙️ Voice Chat
- Real-time voice communication with WebRTC
- Voice Activity Detection (VAD) for speaking indicators
- Mute/unmute with sound effects
- Audio player for remote streams

### 👥 Room System
- Create public/private rooms by topic
- CEFR level-based rooms (A1-C2)
- Real-time participant list
- Join/leave notifications with sounds

### 🙋 Interactions
- Raise hand feature with visual indicator
- Emoji reactions (👏 ❤️ 👍)
- Floating reaction animations
- Real-time status sync

### 🔐 Authentication
- Google SSO login
- JWT-based sessions
- Protected routes
- User profile from Google

### 🤖 AI Practice (Coming Soon)
- AI conversation partner
- Pronunciation feedback
- Grammar corrections

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Frontend (Next.js)                     │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
│  │   Pages     │  │ Components  │  │     Stores          │  │
│  │  - Home     │  │  - RoomCard │  │  - authStore        │  │
│  │  - Rooms    │  │  - Controls │  │  - mediaStore       │  │
│  │  - Login    │  │  - Reactions│  │                     │  │
│  └─────────────┘  └─────────────┘  └─────────────────────┘  │
│                           │                                   │
│           ┌───────────────┴───────────────┐                  │
│           │         Hooks                  │                  │
│           │  - useRoomSocket (Socket.IO)   │                  │
│           │  - useWebRTC (Peer connections)│                  │
│           └───────────────┬───────────────┘                  │
└───────────────────────────┼─────────────────────────────────┘
                            │
              ┌─────────────┴─────────────┐
              │      WebSocket + HTTP      │
              └─────────────┬─────────────┘
                            │
┌───────────────────────────┼─────────────────────────────────┐
│                        Backend (NestJS)                       │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
│  │   Gateway   │  │ Controllers │  │     Services        │  │
│  │  - Socket   │  │  - Rooms    │  │  - RoomsService     │  │
│  │  - WebRTC   │  │  - Auth     │  │  - AuthService      │  │
│  │  - Reactions│  │  - AI       │  │  - UsersService     │  │
│  └─────────────┘  └─────────────┘  └─────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

## 🚀 Quick Start

### Prerequisites
- Node.js 20+
- Yarn
- Google OAuth credentials

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/english-speaking-app.git
cd english-speaking-app

# Install frontend dependencies
yarn install

# Install backend dependencies
cd backend && yarn install
```

### Configuration

**Backend `.env`:**
```env
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
JWT_SECRET=your_jwt_secret
OPENAI_API_KEY=your_openai_api_key
```

**Frontend `.env.local`:**
```env
NEXT_PUBLIC_API_URL=http://localhost:3002
```

### Development

```bash
# Start backend (terminal 1)
cd backend && yarn start:dev

# Start frontend (terminal 2)  
yarn dev
```

Open [http://localhost:3001](http://localhost:3001)

## 🐳 Docker

```bash
# Build and run with docker-compose
yarn docker:build
yarn docker:up

# View logs
yarn docker:logs

# Stop
yarn docker:down
```

## ☸️ Kubernetes Deployment

See [k8s/README.md](./k8s/README.md) for detailed Kubernetes deployment instructions.

```bash
# Deploy to staging
kubectl apply -k k8s/overlays/staging

# Deploy to production
kubectl apply -k k8s/overlays/production
```

## 🏭 Infrastructure (Terraform)

```bash
cd terraform

# Initialize
terraform init

# Plan
terraform plan -var-file=environments/production.tfvars

# Apply
terraform apply -var-file=environments/production.tfvars
```

## 📁 Project Structure

```
english-speaking-app/
├── src/                      # Frontend source
│   ├── app/                  # Next.js pages
│   ├── components/           # React components
│   ├── hooks/                # Custom hooks
│   ├── stores/               # Zustand stores
│   ├── lib/                  # Utilities
│   └── types/                # TypeScript types
├── backend/                  # NestJS backend
│   └── src/
│       ├── auth/             # Authentication
│       ├── gateway/          # WebSocket gateway
│       ├── rooms/            # Room management
│       └── users/            # User management
├── k8s/                      # Kubernetes manifests
│   ├── base/                 # Base resources
│   └── overlays/             # Environment configs
├── terraform/                # Infrastructure as Code
└── .github/workflows/        # CI/CD pipelines
```

## 🔧 Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 14, React, TypeScript, Mantine UI |
| Backend | NestJS, Socket.IO, Passport.js |
| Real-time | WebRTC, Socket.IO |
| Auth | Google OAuth 2.0, JWT |
| State | Zustand |
| Styling | Mantine, CSS Modules |
| DevOps | Docker, Kubernetes, Terraform |
| CI/CD | GitHub Actions |
| Monitoring | Prometheus, Grafana, Loki |

## 📊 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/rooms` | List all rooms |
| GET | `/rooms/:id` | Get room details |
| POST | `/rooms` | Create a room |
| GET | `/auth/google` | Initiate Google OAuth |
| GET | `/auth/google/callback` | OAuth callback |
| GET | `/auth/status` | Check auth status |
| GET | `/auth/logout` | Logout |

## 🔌 Socket Events

| Event | Direction | Description |
|-------|-----------|-------------|
| `join_room` | Client → Server | Join a room |
| `leave_room` | Client → Server | Leave a room |
| `mute_toggle` | Client → Server | Toggle mute |
| `speaking` | Client → Server | Speaking status |
| `raise_hand` | Client → Server | Raise/lower hand |
| `reaction` | Client → Server | Send reaction |
| `signal` | Bidirectional | WebRTC signaling |

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

MIT License - see [LICENSE](LICENSE) for details.

## 🙏 Acknowledgments

- [Mantine](https://mantine.dev/) for the beautiful UI components
- [Socket.IO](https://socket.io/) for real-time communication
- [WebRTC](https://webrtc.org/) for peer-to-peer audio
