/**
 * Team GraphQL Mutations
 *
 * Mutations for team management, invites, and member operations.
 */

import { gql, TypedDocumentNode } from '@apollo/client';
import type { InviteAction, TeamMemberRole } from '../enums';

// ============================================================================
// Types
// ============================================================================

export interface AddTeamMemberInput {
    email: string;
    role: TeamMemberRole;
}

export interface TeamMembership {
    createdAt: string;
    role: string;
    userId: string;
    userEmail?: string;
    user?: {
        id: string;
        username?: string;
    };
    teamId: number;
}

export interface TeamInviteResult {
    dateAccepted?: string | null;
    dateDeclined?: string | null;
    dateInvited: string;
    expiryDate?: string | null;
    inviteEmail: string;
    inviteRole: string;
    teamId: number;
}

export interface AddTeamMembersData {
    addTeamMembers: {
        teamMemberships: TeamMembership[];
        teamInvites: TeamInviteResult[];
    };
}

export interface AddTeamMembersVariables {
    teamId: number;
    members: AddTeamMemberInput[];
}

export interface RespondTeamInviteVariables {
    inviteId: string;
    action: InviteAction;
}

// ============================================================================
// Mutations
// ============================================================================

/**
 * Add members to a team
 */
export const AddTeamMembersDocument: TypedDocumentNode<
    AddTeamMembersData,
    AddTeamMembersVariables
> = gql`
    mutation AddTeamMembers($teamId: Int!, $members: [AddTeamMemberInput!]!) {
        addTeamMembers(teamId: $teamId, members: $members) {
            teamMemberships {
                createdAt
                role
                userId
                userEmail
                user {
                    id
                    username
                }
                teamId
            }
            teamInvites {
                dateAccepted
                dateDeclined
                dateInvited
                expiryDate
                inviteEmail
                inviteRole
                teamId
            }
        }
    }
`;

/**
 * Respond to a team invite (accept/decline)
 */
export const RespondTeamInviteDocument = gql`
    mutation RespondTeamInvite($inviteId: String!, $action: InviteAction!) {
        respondTeamInvite(inviteId: $inviteId, action: $action) {
            success
        }
    }
`;

/**
 * Remove a member from team
 */
export const RemoveTeamMemberDocument = gql`
    mutation RemoveTeamMember($teamId: Int!, $userId: String!) {
        removeTeamMember(teamId: $teamId, userId: $userId) {
            success
        }
    }
`;

/**
 * Update team member role
 */
export const UpdateTeamMemberRoleDocument = gql`
    mutation UpdateTeamMemberRole($teamId: Int!, $userId: String!, $role: TeamMemberRole!) {
        updateTeamMemberRole(teamId: $teamId, userId: $userId, role: $role) {
            success
        }
    }
`;

/**
 * Accept a team deal
 */
export const AcceptTeamDealDocument = gql`
    mutation AcceptTeamDeal($dealId: String!) {
        acceptTeamDeal(dealId: $dealId) {
            success
            checkoutUrl
        }
    }
`;

/**
 * Leave a team
 */
export const LeaveTeamDocument = gql`
    mutation LeaveTeam($teamId: Int!) {
        leaveTeam(teamId: $teamId) {
            success
        }
    }
`;

// ============================================================================
// Team Updates
// ============================================================================

export const UpdateTeamInviteStatusDocument = gql`
    mutation UpdateTeamInviteStatus($status: UpdateTeamInviteStatus!, $teamId: Int!) {
        updateTeamInviteStatus(status: $status, teamId: $teamId) {
            teamId
        }
    }
`;

export const UpdateTeamMembershipDocument = gql`
    mutation UpdateTeamMembership($teamId: Int!, $details: UpdateTeamMembershipInput!) {
        updateTeamMembership(teamId: $teamId, details: $details) {
            teamMemberships {
                teamId
                role
                userEmail
                userId
            }
            teamInvites {
                teamId
                inviteRole
                inviteEmail
            }
        }
    }
`;

export const UpdateTeamDocument = gql`
    mutation UpdateTeam($where: teams_bool_exp!, $_set: teams_set_input!) {
        update_teams(where: $where, _set: $_set) {
            affected_rows
            returning {
                id
                akUUID
                teamName
                teamLogoUrl
            }
        }
    }
`;
