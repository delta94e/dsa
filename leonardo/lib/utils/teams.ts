import Cookies from "js-cookie";
import { SELECTED_TEAM_COOKIE_NAME } from "@/constants/app";
import { USER_PLAN } from "@/lib/constants/enums";

export const buildTeamFilter = (teamId?: string) =>
  teamId
    ? { team: { akUUID: { _eq: teamId } } }
    : { teamId: { _is_null: true } };

export const buildTeamIdFilter = (teamId?: string) =>
  teamId ? { teamId: { _eq: teamId } } : { teamId: { _is_null: true } };

export const getCurrentUserOrTeamPlan = (user: any) => {
  const teamId = Cookies.get(SELECTED_TEAM_COOKIE_NAME);
  const team = user.teams?.find((t: any) => t.akUUID === teamId);
  return team?.plan || user.plan;
};

export const isPlanFree = (plan: string) => plan === USER_PLAN.FREE;
