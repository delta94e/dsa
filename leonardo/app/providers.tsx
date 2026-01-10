"use client";

import { SessionProvider } from "next-auth/react";
import type { ReactNode } from "react";
import { CurrentUserProvider } from "@/hooks/useCurrentUser";
import { SelectedTeamProvider } from "@/hooks/useSelectedTeam";
import { StoreProvider } from "@/store/StoreProvider";
import { ApolloWrapper } from "@/lib/apollo-client";

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <SessionProvider>
      <StoreProvider>
        <ApolloWrapper>
          <SelectedTeamProvider>
            <CurrentUserProvider>{children}</CurrentUserProvider>
          </SelectedTeamProvider>
        </ApolloWrapper>
      </StoreProvider>
    </SessionProvider>
  );
}
