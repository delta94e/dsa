import { useCurrentUser } from '@/hooks/useCurrentUser';

/**
 * Retrieves the current user's ID.
 * Returns the ID from the active session or persisted state, otherwise returns an empty string.
 */
export const useUserId = (): string => {
  const { user, persistedUser } = useCurrentUser();
  return user?.id || persistedUser?.id || "";
};