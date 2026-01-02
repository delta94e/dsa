/**
 * Team Utilities
 *
 * Helper functions for team-related operations including permissions.
 */

// ============================================================================
// Types
// ============================================================================

export type TeamRole = 'owner' | 'admin' | 'member';

export type TeamPermission =
    | 'accept_team_deal'
    | 'manage_team'
    | 'manage_members'
    | 'invite_members'
    | 'view_team'
    | 'leave_team';

// ============================================================================
// Permission Definitions
// ============================================================================

const TEAM_PERMISSIONS: Record<TeamRole, TeamPermission[]> = {
    owner: [
        'accept_team_deal',
        'manage_team',
        'manage_members',
        'invite_members',
        'view_team',
        'leave_team',
    ],
    admin: [
        'accept_team_deal',
        'manage_members',
        'invite_members',
        'view_team',
        'leave_team',
    ],
    member: [
        'invite_members',
        'view_team',
        'leave_team',
    ],
};

// ============================================================================
// Permission Functions
// ============================================================================

/**
 * Check if a role has a specific permission
 *
 * @param role - The user's role in the team
 * @param permission - The permission to check
 * @returns Whether the role has the permission
 *
 * @example
 * if (hasTeamPermission(userRole, 'accept_team_deal')) {
 *   // Show accept deal button
 * }
 */
export function hasTeamPermission(
    role: TeamRole | string | undefined | null,
    permission: TeamPermission | string
): boolean {
    if (!role) return false;

    const rolePermissions = TEAM_PERMISSIONS[role as TeamRole];
    if (!rolePermissions) return false;

    return rolePermissions.includes(permission as TeamPermission);
}

/**
 * Get all permissions for a role
 *
 * @param role - The user's role in the team
 * @returns Array of permissions for the role
 */
export function getTeamPermissions(role: TeamRole | string | undefined | null): TeamPermission[] {
    if (!role) return [];
    return TEAM_PERMISSIONS[role as TeamRole] ?? [];
}

/**
 * Check if a role can perform management actions
 *
 * @param role - The user's role in the team
 * @returns Whether the role can manage the team
 */
export function canManageTeam(role: TeamRole | string | undefined | null): boolean {
    return hasTeamPermission(role, 'manage_team');
}

/**
 * Check if a role can manage members
 *
 * @param role - The user's role in the team
 * @returns Whether the role can manage members
 */
export function canManageMembers(role: TeamRole | string | undefined | null): boolean {
    return hasTeamPermission(role, 'manage_members');
}

/**
 * Check if a role is an owner
 *
 * @param role - The user's role in the team
 * @returns Whether the role is owner
 */
export function isTeamOwner(role: TeamRole | string | undefined | null): boolean {
    return role === 'owner';
}

/**
 * Check if a role is an admin or owner
 *
 * @param role - The user's role in the team
 * @returns Whether the role is admin or higher
 */
export function isTeamAdmin(role: TeamRole | string | undefined | null): boolean {
    return role === 'owner' || role === 'admin';
}
