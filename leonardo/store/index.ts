import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slices/userSlice';
import teamInvitesReducer from './slices/teamsInvitesSlice';
import generationReducer from './slices/generationSlice';

export const store = configureStore({
    reducer: {
        user: userReducer,
        teamInvites: teamInvitesReducer,
        generation: generationReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

