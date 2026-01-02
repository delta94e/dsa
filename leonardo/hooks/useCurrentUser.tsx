"use client";

import { createContext, use, useState, useEffect, type ReactNode } from "react";
import { useSession } from "next-auth/react";
import { useQuery } from "@apollo/client/react";
import { GetUserDetailsDocument } from "@/lib/graphql";
import { SUSPENSION_STATUS_TYPE } from "@/constants/app";

// Extend session user type to include sub from Auth0/NextAuth
interface SessionUser {
  name?: string | null;
  email?: string | null;
  image?: string | null;
  sub?: string;
}

// ============================================================================
// Types
// ============================================================================

export interface TeamMember {
  userId: string;
  role: string;
  createdAt: Date;
}

export interface UserTeam {
  id: string;
  akUUID: string;
  plan: string | null;
  subscriptionTokens: number | null;
  userRole: string;
  createdAt: string;
  rolloverTokens: number | null;
  members: TeamMember[];
  teamLogoUrl?: string;
  teamName: string;
}

export interface User {
  id: string;
  createdAt: Date;
  userDetailsId: string;
  email: string;
  username: string;
  blocked: boolean;
  apiPlan: { type: string | null };
  teams: UserTeam[];
  interests: string[];
  showNsfw: boolean;
}

export interface PersistedUser {
  id: string;
  teams: UserTeam[];
}

export interface CurrentUserContextValue {
  fetching: boolean;
  user: User | null;
  persistedUser: PersistedUser | null;
}

// ============================================================================
// Constants
// ============================================================================

const PERSIST_KEY = "persist:currentUser";

// ============================================================================
// Helper Functions
// ============================================================================

function getPersistedUser(): PersistedUser | null {
  if (typeof window === "undefined") return null;

  const stored = localStorage.getItem(PERSIST_KEY);
  if (!stored) return null;

  try {
    return JSON.parse(stored);
  } catch {
    return null;
  }
}

function persistUser(user: { id: string; teams: UserTeam[] }) {
  if (typeof window === "undefined") return;
  localStorage.setItem(PERSIST_KEY, JSON.stringify(user));
}

function isUserBlocked(
  blocked: boolean,
  suspensionStatus?: string | null
): boolean {
  return (
    !!blocked &&
    suspensionStatus !== SUSPENSION_STATUS_TYPE.TEMPORARILY_SUSPENDED &&
    suspensionStatus !== SUSPENSION_STATUS_TYPE.WARNING
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function transformUserData(data: any): User {
  const userData = data.users[0];
  if (!userData) throw new Error("No user found.");

  const userDetails = userData.user_details[0];
  if (!userDetails) throw new Error("No user details found.");

  return {
    id: userData.id,
    createdAt: new Date(userData.createdAt),
    userDetailsId: userDetails.id,
    email: userDetails.auth0Email || "email unknown",
    username: userData.username || "username unknown",
    blocked: isUserBlocked(userData.blocked, userData.suspensionStatus),
    apiPlan: { type: userDetails.apiPlan },
    teams: userData.team_memberships.map(
      (membership: {
        team: {
          id: string;
          akUUID: string;
          plan: string | null;
          subscriptionTokens: number | null;
          createdAt: string;
          rolloverTokens: number | null;
          teamLogoUrl: string | null;
          teamName: string | null;
          members: Array<{
            userId: string;
            role: string;
            createdAt: string;
          }>;
        };
        role: string;
      }) => ({
        id: membership.team.id,
        akUUID: membership.team.akUUID,
        plan: membership.team.plan,
        subscriptionTokens: membership.team.subscriptionTokens,
        userRole: membership.role,
        createdAt: membership.team.createdAt,
        rolloverTokens: membership.team.rolloverTokens,
        members: membership.team.members.map((member) => ({
          userId: member.userId,
          role: member.role,
          createdAt: new Date(member.createdAt),
        })),
        teamLogoUrl: membership.team.teamLogoUrl || undefined,
        teamName: membership.team.teamName || "team name unknown",
      })
    ),
    interests: userDetails.interests || [],
    showNsfw: userDetails.showNsfw,
  };
}

// ============================================================================
// Context
// ============================================================================

const CurrentUserContext = createContext<CurrentUserContextValue | null>(null);

// ============================================================================
// Provider
// ============================================================================

interface CurrentUserProviderProps {
  children: ReactNode;
}

export function CurrentUserProvider({ children }: CurrentUserProviderProps) {
  const { data: session } = useSession();
  const [persistedUser, setPersistedUser] = useState<PersistedUser | null>(
    null
  );

  // Cast session user to include sub property
  const sessionUser = session?.user as SessionUser | undefined;
  const userSub = sessionUser?.sub;

  // Query user details
  const { loading, data } = useQuery(GetUserDetailsDocument, {
    variables: { userSub },
    skip: !userSub,
  });

  // Transform data if available
  const user = data ? transformUserData(data) : null;

  // Load persisted user on session change
  useEffect(() => {
    if (userSub) {
      setPersistedUser(getPersistedUser());
    } else {
      setPersistedUser(null);
    }
  }, [userSub]);

  // Persist user data when available
  useEffect(() => {
    if (user) {
      persistUser({ id: user.id, teams: user.teams });
    }
  }, [user]);

  const value: CurrentUserContextValue = {
    fetching: loading,
    user,
    persistedUser,
  };

  return (
    <CurrentUserContext.Provider value={value}>
      {children}
    </CurrentUserContext.Provider>
  );
}

// ============================================================================
// Hook
// ============================================================================

/**
 * useCurrentUser
 *
 * Hook to get the current authenticated user with their team memberships.
 * Must be used within CurrentUserProvider.
 *
 * @example
 * const { user, fetching, persistedUser } = useCurrentUser();
 */
export function useCurrentUser(): CurrentUserContextValue {
  const context = use(CurrentUserContext);

  if (!context) {
    throw new Error("useCurrentUser must be used within CurrentUserProvider");
  }

  return context;
}

export default useCurrentUser;
