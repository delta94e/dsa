# Contributing to SpeakUp

Thank you for your interest in contributing to SpeakUp! 🎉

## Development Setup

### Prerequisites
- Node.js 20+
- Yarn package manager
- Docker (optional, for containerized development)

### Local Development

1. **Fork and clone the repository**
   ```bash
   git clone https://github.com/your-username/english-speaking-app.git
   cd english-speaking-app
   ```

2. **Install dependencies**
   ```bash
   yarn install
   cd backend && yarn install
   ```

3. **Set up environment variables**
   ```bash
   # Backend
   cp backend/.env.example backend/.env
   # Edit with your credentials
   
   # Frontend
   cp .env.example .env.local
   ```

4. **Start development servers**
   ```bash
   # Terminal 1 - Backend
   cd backend && yarn start:dev
   
   # Terminal 2 - Frontend
   yarn dev
   ```

## Code Style

### TypeScript
- Use strict TypeScript
- Prefer `interface` over `type` for object shapes
- Use explicit return types on functions

### React/Next.js
- Use functional components with hooks
- Keep components small and focused
- Use `'use client'` directive for client components

### NestJS
- Follow NestJS conventions
- Use dependency injection
- Add JSDoc comments for public APIs

## Pull Request Process

1. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**
   - Write clean, documented code
   - Add tests if applicable
   - Update documentation

3. **Run checks**
   ```bash
   # Frontend
   yarn lint
   yarn type-check
   yarn build
   
   # Backend
   cd backend
   yarn lint
   yarn build
   ```

4. **Commit your changes**
   ```bash
   git commit -m "feat: add amazing feature"
   ```
   
   Use conventional commits:
   - `feat:` - New feature
   - `fix:` - Bug fix
   - `docs:` - Documentation
   - `style:` - Formatting
   - `refactor:` - Code refactoring
   - `test:` - Adding tests
   - `chore:` - Maintenance

5. **Push and create PR**
   ```bash
   git push origin feature/your-feature-name
   ```

## Issue Guidelines

### Bug Reports
Include:
- Steps to reproduce
- Expected behavior
- Actual behavior
- Browser/OS version
- Screenshots if applicable

### Feature Requests
Include:
- Use case description
- Proposed solution
- Alternative solutions considered

## Code of Conduct

- Be respectful and inclusive
- Focus on constructive feedback
- Help others learn and grow

## Questions?

Open an issue or reach out to the maintainers.

Thank you for contributing! 🚀
