// Hooks barrel export

export { useClickOutside } from "./useClickOutside";
export { useBreakpoint } from "./useBreakpoint";
export { useIsMobile } from "./useIsMobile";
export { useTeamNotifications } from "./useTeamNotifications";
// useSelectedTeam exports match module 276908
export {
  useSelectedTeam,
  SelectedTeamProvider,
  useSelectedTeamLaunchDarklyUpdate,
  useUserActivityActions,
  type Team,
  type TeamMember,
} from "./useSelectedTeam";
export {
  useUser,
  useIsUserRestricted,
  type UserInfo,
  type PlanType,
} from "./useUser";
// useFlags exports match module 814021 and 613581
export {
  useFlags,
  useFlagsContext,
  FlagsProvider,
  type FeatureFlags,
} from "./useFlags";
// usePlan exports match module 215665
export { usePlan, type PlanInfo } from "./usePlan";

// Utility hooks
export { useDisclosure } from "./useDisclosure";
export {
  useCurrentUser,
  CurrentUserProvider,
  type User,
  type UserTeam,
  type CurrentUserContextValue,
  type PersistedUser,
} from "./useCurrentUser";
export { useLogout } from "./useLogout";
export { useHandleCsamError } from "./useHandleCsamError";
export { useUserId } from "./useUserId";
