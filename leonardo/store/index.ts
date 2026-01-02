import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slices/userSlice';
import teamInvitesReducer from './slices/teamsInvitesSlice';

export const store = configureStore({
    reducer: {
        user: userReducer,
        teamInvites: teamInvitesReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
