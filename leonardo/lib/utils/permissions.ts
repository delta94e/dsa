/**
 * Permissions Utilities
 *
 * Utility functions for checking user permissions.
 */

// ============================================================================
// Types
// ============================================================================

type TeamRole = 'owner' | 'admin' | 'member' | string;

type TeamPermission =
  | 'accept_team_deal'
  | 'manage_team'
  | 'manage_members'
  | 'manage_billing'
  | 'view_analytics'
  | string;

// ============================================================================
// Permission Maps
// ============================================================================

/**
 * Map of team roles to their allowed permissions
 */
const TEAM_ROLE_PERMISSIONS: Record<TeamRole, TeamPermission[]> = {
  owner: [
    'accept_team_deal',
    'manage_team',
    'manage_members',
    'manage_billing',
    'view_analytics',
  ],
  admin: [
    'accept_team_deal',
    'manage_team',
    'manage_members',
    'view_analytics',
  ],
  member: [
    'view_analytics',
  ],
};

// ============================================================================
// Functions
// ============================================================================

/**
 * Check if a team role has a specific permission
 *
 * @param role - The user's role in the team
 * @param permission - The permission to check
 * @returns Whether the role has the permission
 */
export function hasTeamPermission(
  role: TeamRole | undefined | null,
  permission: TeamPermission
): boolean {
  if (!role) {
    return false;
  }

  const normalizedRole = role.toLowerCase();
  const permissions = TEAM_ROLE_PERMISSIONS[normalizedRole];

  if (!permissions) {
    return false;
  }

  return permissions.includes(permission);
}

/**
 * Check if a user is a team owner
 */
export function isTeamOwner(role: TeamRole | undefined | null): boolean {
  return role?.toLowerCase() === 'owner';
}

/**
 * Check if a user is a team admin or owner
 */
export function isTeamAdminOrAbove(role: TeamRole | undefined | null): boolean {
  const normalizedRole = role?.toLowerCase();
  return normalizedRole === 'owner' || normalizedRole === 'admin';
}

/**
 * Get all permissions for a role
 */
export function getTeamPermissions(
  role: TeamRole | undefined | null
): TeamPermission[] {
  if (!role) {
    return [];
  }

  const normalizedRole = role.toLowerCase();
  return TEAM_ROLE_PERMISSIONS[normalizedRole] || [];
}
