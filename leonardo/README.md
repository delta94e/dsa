# Leonardo Project

## Project Overview

Leonardo is a modern web application built with Next.js (App Router) and React, designed to provide advanced AI generation capabilities, robust team management, and a seamless user experience. It leverages a comprehensive technology stack including TypeScript, GraphQL (Apollo Client), Redux Toolkit, and a modern UI with Chakra UI, Tailwind CSS, and Radix UI.

### Key Features
-   **AI Generation**: Support for multiple AI models and LORA models with token cost tracking.
-   **Team Management**: Create and manage teams, invite members, assign roles (Owner, Admin, Member) with role-based access control.
-   **User Authentication**: Secure authentication via NextAuth.js.
-   **Subscription & Plans**: Tiered plans, billing, and AWS Marketplace integration.
-   **Responsive UI**: Intuitive and adaptive user interface across devices.
-   **Analytics & Feature Flags**: Integrated Heap Analytics, Google Tag Manager, and LaunchDarkly.

## Getting Started

### Prerequisites
-   Node.js (>=18.x)
-   yarn package manager

### Installation

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/your-repo/leonardo.git
    cd leonardo
    ```
2.  **Install dependencies**:
    ```bash
    yarn install
    ```
3.  **Environment Variables**:
    Create a `.env.local` file in the root directory and add necessary environment variables (e.g., for NextAuth.js, GraphQL API endpoint, LaunchDarkly keys). Refer to `.env.example` for required variables.

### Running the Development Server

```bash
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser. The application will hot-reload as you make changes.

## Available Scripts

-   `yarn dev`: Runs the application in development mode.
-   `yarn build`: Builds the application for production.
-   `yarn start`: Starts the production server (after building).
-   `yarn lint`: Runs ESLint for code quality checks.
-   `yarn typecheck`: Runs TypeScript compiler for type validation.
-   `yarn test`: Runs unit and integration tests (if configured).

## Documentation

Comprehensive documentation for the Leonardo project can be found in the `docs/` directory:

-   **[Project Overview & PDR](docs/project-overview-pdr.md)**: Product development requirements, goals, and features.
-   **[Codebase Summary](docs/codebase-summary.md)**: Detailed overview of the codebase organization and modules.
-   **[Code Standards](docs/code-standards.md)**: Coding guidelines, naming conventions, and best practices.
-   **[System Architecture](docs/system-architecture.md)**: High-level design, data flow, and component interactions.

## Technology Stack

-   **Frontend**: Next.js 16.1.1, React 19.2.3, TypeScript
-   **Styling**: Chakra UI, Tailwind CSS, Emotion, Framer Motion, Radix UI
-   **State Management**: Redux Toolkit (with `redux-persist`), React Context API
-   **Data Layer**: Apollo Client (GraphQL)
-   **Authentication**: NextAuth.js
-   **Analytics**: Heap Analytics, Google Tag Manager
-   **Feature Flags**: LaunchDarkly

## Contributing

Please refer to the [Code Standards](docs/code-standards.md) document for guidelines on contributing to the project.

## License

[Specify your project's license here, e.g., MIT, Apache 2.0]

## Deployment

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme). Refer to the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.