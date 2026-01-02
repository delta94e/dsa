"use client";

/**
 * CreateTeamModal
 *
 * Modal for creating a new team with multi-step wizard.
 * Matches production bundle module 453518.
 */

import { useApolloClient } from "@apollo/client/react";
import { useLDClient } from "launchdarkly-react-client-sdk";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, type FC } from "react";

import { SelectAPlan } from "@/components/auth/SelectAPlan";
import { AngleDownIcon } from "@/components/icons/AngleDownIcon";
import { InfoCircleOutlineIcon } from "@/components/icons/InfoCircleOutlineIcon";
import { UsersOutlineIcon } from "@/components/icons/UsersOutlineIcon";
import { AvatarWithName } from "@/components/ui/AvatarWithName";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { NumberStepper } from "@/components/ui/NumberStepper";
import {
  SplitDialog,
  SplitDialogBody,
  SplitDialogCloseButton,
  SplitDialogContent,
  SplitDialogFooter,
  SplitDialogHeader,
  SplitDialogIconBadge,
  SplitDialogMain,
  SplitDialogMedia,
  SplitDialogMediaOverlay,
  SplitDialogTitle,
} from "@/components/ui/SplitDialog";

import {
  DEFAULT_CURRENCY,
  ECOMMERCE_PURCHASE_CATEGORY,
  MAXIMUM_NUMBER_OF_SEATS,
  MINIMUM_NUMBER_OF_SEATS,
  PLAN_FREQUENCY,
  SELF_SERVE_NUMBER_OF_STEPS,
  SUBSCRIPTION_DURATION,
  TEAM_CHECKOUT_STEPS,
  TEAM_DEAL_NUMBER_OF_STEPS,
  TEAM_DEAL_TARGET,
  TEAM_PLANS_COST_PER_SEAT,
  type TeamPlan,
} from "@/constants/plans";
import {
  GetTeamPlanOffersDocument,
  GetTeamPlanOffersData,
  type TeamDeal,
} from "@/lib/graphql/queries/team";
import { useSelectedTeam } from "@/hooks/useSelectedTeam";
import { useTeamPlanDetails } from "@/hooks/useTeamPlanDetails";
import { useAvailableTeamPlanOffer } from "@/hooks/useTeamPlanOffers";
import { useToast, TOAST_TYPES } from "@/hooks/useToast";
import { teamAcceptDeal } from "@/lib/api/teamAcceptDeal";
import { teamBuyPlanSubscription } from "@/lib/api/teamBuyPlanSubscription";
import { PremiumPlansEvents, IntentToPayEvents } from "@/lib/analytics/events";
import { track } from "@/lib/analytics";
import {
  clearEcommerceObject,
  createEcommerceTrackingItem,
  formatSubscriptionBillingCost,
  getUtmParamsFromSession,
} from "@/lib/analytics/utils";
import {
  MODAL_TEAM_CREATION_CLOSE_BUTTON,
  MODAL_TEAM_CREATION_SELECT_A_PLAN_BACK_BUTTON,
  MODAL_TEAM_CREATION_SELECT_A_PLAN_BUTTON,
  MODAL_TEAM_CREATION_SELECT_A_PLAN_CHECKOUT_BUTTON,
} from "@/lib/analytics/trackingIds";
import { useAppSelector } from "@/store/hooks";

// ============================================================================
// Types
// ============================================================================

interface CreateTeamModalProps {
  isOpen: boolean;
  onClose: () => void;
  teamDealUUID?: string;
  initialTeamName?: string;
  teamDealTargetType?: string;
}

interface TeamProfileStepProps {
  teamName: string;
  onChangeTeamName: (name: string) => void;
  teamAvatar?: string;
  onChangeTeamAvatar: (url: string) => void;
  numberOfSeats?: number;
  onChangeNumberOfSeats?: (seats: number) => void;
  onClose: () => void;
  onNext: () => void;
  nextButtonLabel: string;
  isNextButtonLoading?: boolean;
  onBack?: () => void;
  nextButtonTrackingId?: string;
  backButtonTrackingId?: string;
}

interface CreateTeamState {
  teamName: string;
  numberOfSeats: number;
  avatarImageSource?: string;
  selectedPlan: string;
}

// ============================================================================
// useBuyClickHandler Hook
// ============================================================================

function useBuyClickHandler(
  teamName: string,
  numberOfSeats: number,
  teamDealUUID: string | undefined,
  teamDealTargetType: string | undefined,
  selectedPlan: string,
  avatarImageSource: string | undefined
) {
  const { selectedTeamUUID } = useSelectedTeam();
  const toast = useToast();
  const apolloClient = useApolloClient();
  const router = useRouter();
  const [buyButtonIsLoading, setBuyButtonIsLoading] = useState(false);
  const { refetch } = useAvailableTeamPlanOffer(selectedTeamUUID);
  const getTeamPlanDetails = useTeamPlanDetails();

  const showError = (message: string) => {
    toast({
      type: TOAST_TYPES.error,
      description: `Error: ${message}`,
      duration: 10000,
      position: "top",
    });
  };

  const onBuyClickHandler = async () => {
    if (!teamName) {
      toast({
        type: TOAST_TYPES.error,
        description: "Error: Please enter initial team name.",
        duration: 10000,
        position: "top",
      });
      return;
    }

    if (!selectedPlan) {
      toast({
        type: TOAST_TYPES.error,
        description: "Error: Please select a plan.",
        duration: 10000,
        position: "top",
      });
      return;
    }

    setBuyButtonIsLoading(true);

    // If team deal exists, check if it needs to be accepted
    if (teamDealUUID) {
      let teamDealData: TeamDeal | undefined;

      try {
        const { data } = await apolloClient.query<GetTeamPlanOffersData>({
          query: GetTeamPlanOffersDocument,
          variables: { where: { akUUID: { _eq: teamDealUUID } } },
        });
        teamDealData = data?.team_deals[0];
      } catch (error) {
        console.error(error);
        showError("Error retrieving team deal data");
        setBuyButtonIsLoading(false);
        return;
      }

      if (!teamDealData) {
        showError("Team deal not found");
        setBuyButtonIsLoading(false);
        return;
      }

      // Accept deal if not yet accepted
      if (!teamDealData.dealAcceptedAt) {
        const { errorMessage } = await teamAcceptDeal({
          teamDealUUID,
          teamUUID:
            teamDealTargetType !== TEAM_DEAL_TARGET.NEW_TEAM
              ? selectedTeamUUID
              : undefined,
        });

        if (errorMessage) {
          showError(errorMessage);
          setBuyButtonIsLoading(false);
          return;
        }
      }
    }

    // Handle checkout based on target type
    if (teamDealTargetType !== TEAM_DEAL_TARGET.EXISTING_STRIPE_TEAM) {
      // Get plan details for checkout
      const { error, teamPlanDetails } = await getTeamPlanDetails(selectedPlan);

      if (error) {
        showError(
          "We were unable to take you to the checkout page. Please try again in a few minutes."
        );
        setBuyButtonIsLoading(false);
        return;
      }

      // Initiate subscription purchase
      const { errorMessage } = await teamBuyPlanSubscription({
        plan: selectedPlan,
        duration: PLAN_FREQUENCY.MONTHLY,
        seatQuantity: teamDealUUID ? undefined : numberOfSeats,
        initialTeamName: teamName,
        teamDealUUID: teamDealUUID || undefined,
        teamUUID:
          teamDealUUID && teamDealTargetType !== TEAM_DEAL_TARGET.NEW_TEAM
            ? selectedTeamUUID
            : undefined,
        priceId: teamPlanDetails.priceId,
        teamLogoUrl: avatarImageSource,
      });

      if (errorMessage) {
        showError(errorMessage);
        setBuyButtonIsLoading(false);
        return;
      }
    } else {
      // For existing Stripe teams, just refetch and redirect
      refetch();
      router.push("/settings/teams");
    }

    setBuyButtonIsLoading(false);
  };

  return {
    buyButtonIsLoading,
    setBuyButtonIsLoading,
    onBuyClickHandler,
  };
}

// ============================================================================
// TeamProfileStep Component
// ============================================================================

const TeamProfileStep: FC<TeamProfileStepProps> = ({
  teamName,
  onChangeTeamName,
  teamAvatar,
  onChangeTeamAvatar,
  numberOfSeats,
  onChangeNumberOfSeats,
  onClose,
  onNext,
  nextButtonLabel,
  isNextButtonLoading = false,
  nextButtonTrackingId,
  backButtonTrackingId,
}) => {
  const [showMinSeatsWarning, setShowMinSeatsWarning] = useState(false);
  const isNextEnabled = numberOfSeats
    ? numberOfSeats > 0 && teamName.length > 0
    : teamName.length > 0;

  return (
    <>
      <SplitDialogHeader>
        <SplitDialogTitle>Team Profile and Size</SplitDialogTitle>
      </SplitDialogHeader>

      <SplitDialogBody className="flex flex-col items-center justify-center px-5 py-6">
        <AvatarWithName
          accountName={teamName}
          avatarFontSize="2.78rem"
          avatarFontWeight="500"
          avatarInitialsColor="content.primary"
          onAvatarImageSelect={(url: string | undefined) =>
            url && onChangeTeamAvatar(url)
          }
          backgroundImageSource={teamAvatar}
          showAccountName={false}
          avatarBackground="#A90066"
          isPersonalAccount={false}
          isEditEnabled={true}
          width={100}
          height={100}
          marginBottom={24}
        />

        <Input
          className="h-9 w-72 px-3 text-center text-sm font-medium md:w-[20.4rem]"
          type="text"
          value={teamName}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            onChangeTeamName(e.target.value)
          }
          aria-label="Team name"
        />

        <p className="text-secondary-foreground mt-2 mb-12 text-sm">
          Team details can be changed later in settings
        </p>

        {numberOfSeats && onChangeNumberOfSeats && (
          <div className="flex flex-col items-center">
            <p className="mb-3 text-sm">Number of Team Members</p>
            <NumberStepper
              min={MINIMUM_NUMBER_OF_SEATS}
              max={MAXIMUM_NUMBER_OF_SEATS}
              value={numberOfSeats}
              onChange={(newValue: number, rawValue: number) => {
                if (rawValue < MINIMUM_NUMBER_OF_SEATS) {
                  setShowMinSeatsWarning(true);
                } else {
                  setShowMinSeatsWarning(false);
                }
                onChangeNumberOfSeats(newValue);
              }}
            />
            <div
              className={`text-notification-foreground mt-3 flex items-center gap-2 ${
                showMinSeatsWarning ? "visible" : "invisible"
              }`}
            >
              <InfoCircleOutlineIcon className="size-5" />
              <span className="text-xs">
                Minimum team size is {MINIMUM_NUMBER_OF_SEATS} seats
              </span>
            </div>
          </div>
        )}
      </SplitDialogBody>

      <SplitDialogFooter>
        <div className="flex w-full justify-center gap-6">
          <Button
            variant="outline"
            className="h-11 flex-shrink-0 flex-grow basis-26 px-2 py-4 text-sm font-medium"
            onClick={onClose}
            data-tracking-id={backButtonTrackingId}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            className="h-11 flex-shrink-0 flex-grow basis-26 px-2 py-4 text-sm"
            onClick={onNext}
            disabled={!isNextEnabled}
            isLoading={isNextButtonLoading}
            data-tracking-id={nextButtonTrackingId}
          >
            {nextButtonLabel}
            <AngleDownIcon className="rotate-270" />
          </Button>
        </div>
      </SplitDialogFooter>
    </>
  );
};

// ============================================================================
// CreateTeamModal Component
// ============================================================================

export const CreateTeamModal: FC<CreateTeamModalProps> = ({
  isOpen,
  onClose,
  teamDealUUID,
  initialTeamName,
  teamDealTargetType,
}) => {
  const { username, loaded } = useAppSelector((state) => state.user);
  const hasInitializedName = useRef(false);
  const ldClient = useLDClient();

  const [state, setState] = useState<CreateTeamState>(() => ({
    teamName: initialTeamName?.trim() ?? "",
    numberOfSeats: MINIMUM_NUMBER_OF_SEATS,
    avatarImageSource: undefined,
    selectedPlan: teamDealUUID ? "PRO" : "GROWTH",
  }));

  // Initialize team name with username if not provided
  useEffect(() => {
    if (loaded && username && !state.teamName && !hasInitializedName.current) {
      hasInitializedName.current = true;
      setState((prev) => ({ ...prev, teamName: `${username}'s Team` }));
    }
  }, [loaded, username, state.teamName]);

  const [currentStep, setCurrentStep] = useState(1);
  const numberOfSteps = teamDealUUID
    ? TEAM_DEAL_NUMBER_OF_STEPS
    : SELF_SERVE_NUMBER_OF_STEPS;

  const updateState = (updates: Partial<CreateTeamState>) => {
    setState((prev) => ({ ...prev, ...updates }));
  };

  // Get buy handler from custom hook
  const { buyButtonIsLoading, onBuyClickHandler } = useBuyClickHandler(
    state.teamName,
    state.numberOfSeats,
    teamDealUUID,
    teamDealTargetType,
    state.selectedPlan,
    state.avatarImageSource
  );

  const handleNext = () => {
    if (currentStep < numberOfSteps) {
      // Track step progression
      track(PremiumPlansEvents.TEAMS_CHECKOUT_INITIATED, {
        step: TEAM_CHECKOUT_STEPS.SELECT_PLAN,
      });
      setCurrentStep(currentStep + 1);
    } else {
      // Final step - track and proceed to checkout
      track(PremiumPlansEvents.TEAMS_CHECKOUT_INITIATED, {
        step: TEAM_CHECKOUT_STEPS.CHECKOUT,
        plan: state.selectedPlan,
      });

      // Calculate pricing for analytics
      const costPerSeat =
        TEAM_PLANS_COST_PER_SEAT[state.selectedPlan as TeamPlan];
      const totalCost = costPerSeat ? state.numberOfSeats * costPerSeat : 0;

      const ecommerceData = {
        currency: DEFAULT_CURRENCY,
        value: formatSubscriptionBillingCost(totalCost * 100), // Convert to cents
        ecommerce: {
          items: [
            createEcommerceTrackingItem(
              state.selectedPlan ?? "Teams Plan",
              ECOMMERCE_PURCHASE_CATEGORY.TEAMS_PLAN,
              totalCost * 100,
              SUBSCRIPTION_DURATION.MONTHLY,
              state.numberOfSeats
            ),
          ],
        },
      };

      clearEcommerceObject();
      const utmParams = getUtmParamsFromSession();

      track(PremiumPlansEvents.BEGIN_CHECKOUT, ecommerceData);
      track(IntentToPayEvents.CONSUMER_AND_TEAMS, utmParams);
      ldClient?.track(IntentToPayEvents.CONSUMER_AND_TEAMS, utmParams);

      onBuyClickHandler();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Build steps based on whether it's a team deal or self-serve
  const selfServeSteps = [
    <TeamProfileStep
      key="profile"
      teamName={state.teamName}
      onChangeTeamName={(name) => updateState({ teamName: name })}
      numberOfSeats={state.numberOfSeats}
      onChangeNumberOfSeats={(seats) => updateState({ numberOfSeats: seats })}
      teamAvatar={state.avatarImageSource}
      onChangeTeamAvatar={(url) => updateState({ avatarImageSource: url })}
      nextButtonLabel="Select a Plan"
      backButtonTrackingId={MODAL_TEAM_CREATION_SELECT_A_PLAN_BACK_BUTTON}
      nextButtonTrackingId={MODAL_TEAM_CREATION_SELECT_A_PLAN_BUTTON}
      onNext={handleNext}
      onBack={handleBack}
      onClose={onClose}
    />,
    <SelectAPlan
      key="plan"
      isNextButtonLoading={buyButtonIsLoading}
      onPlanSelect={(plan: string) => updateState({ selectedPlan: plan })}
      selectedPlan={state.selectedPlan}
      numberOfSeats={state.numberOfSeats}
      onChangeNumberOfSeats={(seats: number) =>
        updateState({ numberOfSeats: seats })
      }
      onNext={handleNext}
      onBack={handleBack}
    />,
  ];

  const teamDealSteps = [
    <TeamProfileStep
      key="profile-deal"
      teamName={state.teamName}
      onChangeTeamName={(name) => updateState({ teamName: name })}
      teamAvatar={state.avatarImageSource}
      onChangeTeamAvatar={(url) => updateState({ avatarImageSource: url })}
      nextButtonLabel="Checkout"
      backButtonTrackingId={MODAL_TEAM_CREATION_SELECT_A_PLAN_BACK_BUTTON}
      nextButtonTrackingId={MODAL_TEAM_CREATION_SELECT_A_PLAN_CHECKOUT_BUTTON}
      isNextButtonLoading={buyButtonIsLoading}
      onNext={handleNext}
      onBack={handleBack}
      onClose={onClose}
    />,
  ];

  const steps = teamDealUUID ? teamDealSteps : selfServeSteps;
  const currentStepContent = steps[currentStep - 1];

  return (
    <SplitDialog
      open={isOpen}
      onOpenChange={(open: boolean) => {
        if (!open) {
          setCurrentStep(1);
          onClose();
        }
      }}
    >
      <SplitDialogContent
        onInteractOutside={(e: React.PointerEvent) => {
          // Prevent closing when clicking on toast
          const target = e.target as HTMLElement;
          if (target.closest("[data-sonner-toast]")) {
            e.preventDefault();
          }
        }}
      >
        <SplitDialogMedia>
          <Image
            src="/img/teams/welcome-to-teams-sidebar-desktop.webp"
            alt="Welcome to Teams"
            className="h-full w-full object-cover"
            width={320}
            height={200}
          />
          <SplitDialogMediaOverlay>
            <SplitDialogIconBadge>
              <UsersOutlineIcon />
            </SplitDialogIconBadge>
            <h3 className="max-w-44 md:max-w-none">
              Collaborate with <br />
              <span className="text-gradient-primary">Leonardo Teams</span>
            </h3>
          </SplitDialogMediaOverlay>
        </SplitDialogMedia>

        <SplitDialogMain>
          <SplitDialogCloseButton
            data-tracking-id={MODAL_TEAM_CREATION_CLOSE_BUTTON}
          />
          {currentStepContent}
        </SplitDialogMain>
      </SplitDialogContent>
    </SplitDialog>
  );
};

CreateTeamModal.displayName = "CreateTeamModal";

export default CreateTeamModal;
