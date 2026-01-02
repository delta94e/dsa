"use client";

import { type FC, useEffect } from "react";
import { useApolloClient } from "@apollo/client/react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { ROUTE } from "@/constants/routes";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useSelectedTeam } from "@/hooks/useSelectedTeam";
import { useTeamInviteNotifications } from "@/hooks/useTeamInviteNotifications";
import { GetTeamsInvitesDocument } from "@/lib/graphql";
import {
  setShowInviteNotificationPopover,
  removeDismissedInvite,
} from "@/store/slices/teamsInvitesSlice";
import {
  MODAL_TEAM_CREATION_CLOSE_BUTTON,
  MODAL_TEAM_CREATION_RETURN_HOME_BUTTON,
} from "@/lib/analytics";

// ============================================================================
// Types
// ============================================================================

export interface TeamInvite {
  id: string;
  teamId: string;
  teamName: string | null;
}

export interface AcceptedTeamModalProps {
  isOpen: boolean;
  onClose: () => void;
  teamsInvite: TeamInvite;
}

// ============================================================================
// Icons
// ============================================================================

const GradientCoinsIcon: FC<{ className?: string }> = ({ className }) => (
  <svg className={cn("size-5", className)} viewBox="0 0 20 20" fill="none">
    <defs>
      <linearGradient
        id="coins-gradient-modal"
        x1="2.49"
        y1="5.8"
        x2="15.59"
        y2="3.78"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#DB519E" />
        <stop offset="0.5" stopColor="#B14BF4" />
        <stop offset="1" stopColor="#6E7BFC" />
      </linearGradient>
    </defs>
    <path
      d="M18.125 12.39c-.001-1.658-2.11-2.935-5-3.097V5.492c-.001-2.153-2.825-3.117-5.625-3.117s-5.624.963-5.625 3.117v9.183c0 2.153 2.825 3.117 5.625 3.117.289 0 .586-.027.881-.056a5.63 5.63 0 004.119.889c2.799 0 5.625-.964 5.625-3.117v-3.118zm-1.25.002c0 .882-1.871 1.867-4.375 1.867s-4.375-.986-4.375-1.867c0-.324.256-.66.698-.958l.041-.03c.77-.5 2.08-.88 3.636-.88 2.504 0 4.375.985 4.375 1.868zM11.875 8.442c0 .375-.33.69-.644.909-1.16.137-2.16.462-2.91.918-.268.023-.535.04-.82.04-2.357 0-4.376-1.027-4.376-1.867v-.877c1.084.71 2.732 1.045 4.375 1.045s3.291-.335 4.375-1.045v.877zM3.125 10.374c1.003.679 2.479 1.103 3.95 1.173-.128.268-.2.549-.2.846v1.006c-2.078-.159-3.75-1.075-3.75-1.84v-1.185zM7.5 3.625c2.151 0 4.375.698 4.375 1.867 0 1.214-2.254 1.868-4.375 1.868s-4.375-.654-4.375-1.868c0-1.169 2.224-1.867 4.375-1.867zm-4.375 11.05v-1.184c.958.647 2.345 1.063 3.75 1.16v.857c0 .38.092.72.252 1.026-2.028-.076-4.002-.758-4.002-1.859zm9.375 2.7c-1.349 0-2.726-.275-3.566-.768-.499-.294-.808-.664-.808-1.099v-1.112c1.015.689 2.57 1.114 4.375 1.114s3.36-.425 4.375-1.114v1.112c-.001 1.168-2.225 1.867-4.376 1.867z"
      fill="url(#coins-gradient-modal)"
    />
  </svg>
);

const DrawIcon: FC<{ className?: string }> = ({ className }) => (
  <svg className={cn("size-5", className)} viewBox="0 0 24 24" fill="none">
    <defs>
      <linearGradient id="draw-gradient" x1="4" y1="4" x2="20" y2="20">
        <stop stopColor="#DB519E" />
        <stop offset="0.5" stopColor="#B14BF4" />
        <stop offset="1" stopColor="#6E7BFC" />
      </linearGradient>
    </defs>
    <path
      d="M19.4 7.34L16.66 4.6a2 2 0 00-2.83 0l-9 9a2 2 0 00-.59 1.42v3.41a1 1 0 001 1h3.41a2 2 0 001.42-.59l9-9a2 2 0 000-2.83zM9.83 17.83H6.17v-3.66l6-6L15.83 12z"
      stroke="url(#draw-gradient)"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const CollectionIcon: FC<{ className?: string }> = ({ className }) => (
  <svg className={cn("size-5", className)} viewBox="0 0 24 24" fill="none">
    <defs>
      <linearGradient
        id="collection-gradient-modal"
        x1="2"
        y1="4"
        x2="22"
        y2="20"
      >
        <stop stopColor="#DB519E" />
        <stop offset="0.5" stopColor="#B14BF4" />
        <stop offset="1" stopColor="#6E7BFC" />
      </linearGradient>
    </defs>
    <path
      d="M19 3H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V5a2 2 0 00-2-2zM5 19V5h14v14H5z"
      fill="url(#collection-gradient-modal)"
    />
    <path
      d="M9 7h6v2H9V7zm0 4h6v2H9v-2zm0 4h4v2H9v-2z"
      fill="url(#collection-gradient-modal)"
    />
  </svg>
);

const SupportIcon: FC<{ className?: string }> = ({ className }) => (
  <svg className={cn("size-5", className)} viewBox="0 0 24 24" fill="none">
    <defs>
      <linearGradient id="support-gradient-modal" x1="2" y1="4" x2="22" y2="20">
        <stop stopColor="#DB519E" />
        <stop offset="0.5" stopColor="#B14BF4" />
        <stop offset="1" stopColor="#6E7BFC" />
      </linearGradient>
    </defs>
    <path
      d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z"
      fill="url(#support-gradient-modal)"
    />
  </svg>
);

// ============================================================================
// Feature Item Component
// ============================================================================

interface FeatureItemProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FeatureItem: FC<FeatureItemProps> = ({ icon, title, description }) => (
  <div className="flex flex-col px-4">
    <div className="flex items-center gap-1.5">
      {icon}
      <span className="font-semibold text-white">{title}</span>
    </div>
    <span className="text-sm leading-5 text-white/70">{description}</span>
  </div>
);

// ============================================================================
// Hero Section
// ============================================================================

const TeamHeroSection: FC = () => (
  <div className="relative h-32 w-full overflow-hidden bg-gradient-to-br from-purple-600/20 to-pink-600/20">
    <div className="absolute inset-0 bg-[url('/images/team-hero-pattern.svg')] opacity-10" />
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="size-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 shadow-lg" />
    </div>
  </div>
);

// ============================================================================
// AcceptedTeamModal Component
// ============================================================================

/**
 * AcceptedTeamModal (module 602831)
 *
 * Modal displayed when a user successfully accepts a team invite.
 * Shows congratulations message and team features.
 */
export const AcceptedTeamModal: FC<AcceptedTeamModalProps> = ({
  isOpen,
  onClose,
  teamsInvite,
}) => {
  const dispatch = useAppDispatch();
  const apolloClient = useApolloClient();
  const teams = useAppSelector((state) => state.user?.teams);
  const auth0Email = useAppSelector((state) => state.user?.auth0Email);
  const { handleAcceptInvitePopup } = useTeamInviteNotifications();
  const { setSelectedTeam } = useSelectedTeam();

  // Hide notification popover when modal opens
  useEffect(() => {
    if (isOpen) {
      dispatch(setShowInviteNotificationPopover(false));
    }
  }, [isOpen, dispatch]);

  // Handle modal close and team selection
  const handleClose = (invite: TeamInvite) => {
    // Refetch invites query
    if (auth0Email) {
      apolloClient.refetchQueries({ include: [GetTeamsInvitesDocument] });
    }

    // Find and select the team
    if (teams) {
      const matchingTeams = teams.filter((t) => t.id === invite.teamId);
      if (matchingTeams[0]?.akUUID) {
        handleAcceptInvitePopup();
        dispatch(removeDismissedInvite([teamsInvite.id]));
        setSelectedTeam(matchingTeams[0].akUUID);
        // TODO: Reset generation settings when slice is available
        // dispatch(setInputImage(null));
        // dispatch(setModelId(DEFAULT_GENERATION_SETTINGS.modelId));
        // dispatch(setSettings({ newSettings: { imageInputs: [] } }));
      }
    }

    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={() => handleClose(teamsInvite)}
      />

      {/* Modal */}
      <div
        className="relative z-10 w-full max-w-md overflow-hidden rounded-lg border border-white/10 bg-[#0d0f14] shadow-2xl"
        data-tracking-id={MODAL_TEAM_CREATION_CLOSE_BUTTON}
      >
        {/* Hero Section */}
        <TeamHeroSection />

        {/* Body */}
        <div className="p-6">
          <div className="flex flex-col gap-7 bg-gradient-to-br from-[#020305] to-[#070A0F] md:rounded-lg">
            {/* Header */}
            <div className="flex flex-col gap-5 p-4">
              <div className="flex flex-col justify-center">
                <span className="bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-2xl font-semibold leading-[2.125rem] text-transparent">
                  Congratulations!
                </span>
                <span className="bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-2xl font-semibold leading-[2.125rem] text-transparent">
                  You have joined {teamsInvite.teamName || "a team"}
                </span>
              </div>
            </div>

            {/* Features */}
            <div className="flex flex-col gap-5 px-4 pb-4 pt-4">
              <FeatureItem
                icon={<DrawIcon />}
                title="Explore Creative Tools"
                description="Dive into our powerful tools and start generating high-quality content right away."
              />
              <FeatureItem
                icon={<CollectionIcon />}
                title="Create Team Collections"
                description="Organize your projects efficiently by setting up collections within the library."
              />
              <FeatureItem
                icon={<GradientCoinsIcon />}
                title="Utilise Shared Tokens"
                description="Access the shared pool of tokens to collaborate and create without limits."
              />
              <FeatureItem
                icon={<SupportIcon />}
                title="Get Support"
                description="Need help? Our support team is ready to assist you with any questions or issues."
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end border-t border-white/10 px-6 py-3">
          <Button
            variant="primary"
            size="sm"
            className="h-11 px-3 text-base font-medium"
            asChild
            onClick={() => handleClose(teamsInvite)}
            data-tracking-id={MODAL_TEAM_CREATION_RETURN_HOME_BUTTON}
          >
            <Link href={ROUTE.HOME}>Return Home</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AcceptedTeamModal;
