// tRPC barrel exports

// Export types for frontend consumption
export { createAppRouter, type AppRouter } from './root';
export { createContext, type TRPCContext } from './trpc';

// Export module for NestJS
export { TrpcModule } from './trpc.module';
