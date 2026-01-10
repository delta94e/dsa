import { Injectable } from '@nestjs/common';
import { Team, TeamMember, TeamMembershipWithId } from './team.model';

@Injectable()
export class TeamService {
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

  constructor() {
    this.mockTeam.members = [this.mockTeamMember];
  }

  async getTeamMemberships(userId: string): Promise<TeamMembershipWithId[]> {
    return [
      {
        id: 'mock-membership-1',
        userId: 'mock-user-123',
        teamId: 'mock-team-1',
        role: 'OWNER',
        team: this.mockTeam,
      },
    ];
  }

  async getTeams(): Promise<Team[]> {
    return [this.mockTeam];
  }

  async createTeam(data: Partial<Team>): Promise<Team> {
    return {
      ...this.mockTeam,
      ...data,
      id: `team-${Date.now()}`,
      akUUID: `ak-uuid-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
  }

  async getTeamPlanOfferDetails() {
    return {
      annualUnitPrice: 0,
      currency: 'USD',
      discountPercentage: 20,
      monthlyUnitPrice: 0,
      priceId: 'mock-price-id',
      productType: 'TEAM',
      tokensPerMonth: 8500,
    };
  }
}
