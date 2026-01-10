import { Injectable } from '@nestjs/common';
import { User, UserDetails, UserWithAwsSubscriptions, GetUserStateResponse } from './user.model';
import { Team, TeamMember, TeamMembership } from '../team/team.model';

@Injectable()
export class UserService {
  // Mock data
  private readonly mockTeamMember: TeamMember = {
    teamId: 'mock-team-1',
    userId: 'mock-user-123',
    role: 'OWNER',
    createdAt: new Date().toISOString(),
  };

  private readonly mockTeam: Team = {
    akUUID: 'ak-uuid-mock-1',
    id: 'mock-team-1',
    modifiedAt: new Date().toISOString(),
    paidTokens: 0,
    paymentPlatformId: undefined,
    plan: 'FREE',
    planCustomTokenRenewalAmount: undefined,
    planSeats: 5,
    planSubscribeDate: new Date().toISOString(),
    planSubscribeFrequency: 'monthly',
    planSubscriptionSource: undefined,
    planTokenRenewalDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    subscriptionTokens: 150,
    teamLogoUrl: undefined,
    teamName: 'My Team',
    createdAt: new Date().toISOString(),
    creatorUserId: 'mock-user-123',
    rolloverTokens: 0,
    members: [],
  };

  private readonly mockUserDetails: UserDetails = {
    id: 'mock-user-details-123',
    apiConcurrencySlots: 5,
    apiCredit: 0,
    apiPaidTokens: 0,
    apiPlan: 'basic',
    apiPlanAutoTopUpTriggerBalance: undefined,
    apiPlanSubscribeDate: new Date().toISOString(),
    apiPlanSubscribeFrequency: 'monthly',
    apiPlanSubscriptionSource: undefined,
    apiPlanTokenRenewalDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    apiPlanTopUpAmount: undefined,
    apiSubscriptionTokens: 8500,
    auth0Email: 'demo@leonardo.ai',
    interests: ['art', 'design', 'games'],
    interestsRoles: ['designer'],
    interestsRolesOther: undefined,
    isChangelogVisible: true,
    lastSeenChangelogId: 'changelog-1',
    paddleId: undefined,
    plan: 'FREE',
    planSubscribeFrequency: 'monthly',
    showNsfw: false,
    streamTokens: 100,
    subscriptionGptTokens: 500,
    subscriptionModelTokens: 150,
    subscriptionSource: undefined,
    tokenRenewalDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    customApiTokenRenewalAmount: undefined,
    paidTokens: 0,
    subscriptionTokens: 150,
    rolloverTokens: 0,
    cognitoId: 'mock-cognito-id',
  };

  constructor() {
    // Initialize mock team with members
    this.mockTeam.members = [this.mockTeamMember];
  }

  async getUserDetails(userSub?: string): Promise<User[]> {
    const mockUser: User = {
      id: 'mock-user-123',
      username: 'DemoUser',
      blocked: false,
      suspensionStatus: undefined,
      createdAt: new Date().toISOString(),
      tos_acceptances: [
        {
          tosHash: 'mock-tos-hash',
          acceptedAt: new Date().toISOString(),
        },
      ],
      user_details: [this.mockUserDetails],
      team_memberships: [
        {
          userId: 'mock-user-123',
          teamId: 'mock-team-1',
          role: 'OWNER',
          team: this.mockTeam,
        },
      ],
    };

    return [mockUser];
  }

  async getUserTokensFromSub(sub?: string): Promise<{ user_details: UserDetails[]; teams: Partial<Team>[] }> {
    return {
      user_details: [this.mockUserDetails],
      teams: [
        {
          akUUID: 'ak-uuid-mock-1',
          paidTokens: 0,
          subscriptionTokens: 150,
          rolloverTokens: 0,
        },
      ],
    };
  }

  async getUserAWSMarketplaceSubscriptions(userSub?: string): Promise<UserWithAwsSubscriptions[]> {
    return [{ aws_marketplace_subscriptions: [] }];
  }

  async getUserState(type: string): Promise<GetUserStateResponse> {
    return { state: JSON.stringify({}) };
  }

  async getUserRetentions() {
    return {
      lastShowingDate: undefined,
      offers: [] as string[],
      offersEnabled: false,
      showingsCurrentCount: 0,
      showingsMaxCount: 3,
      showingsMinInterval: 24,
      offerAccepted: false,
      offerActivated: false,
      activationGracePeriod: 7,
    };
  }

  async updateUserDetails(id: string, data: Partial<UserDetails>): Promise<UserDetails> {
    return { ...this.mockUserDetails, ...data };
  }
}
