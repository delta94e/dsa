import { Resolver, Query, Args, Mutation, ObjectType, Field, Int, Float } from '@nestjs/graphql';
import { TeamService } from './team.service';
import { Team, TeamMembershipWithId } from './team.model';

@ObjectType()
export class TeamPlanOfferDetails {
  @Field(() => Float)
  annualUnitPrice: number;

  @Field()
  currency: string;

  @Field(() => Float)
  discountPercentage: number;

  @Field(() => Float)
  monthlyUnitPrice: number;

  @Field()
  priceId: string;

  @Field()
  productType: string;

  @Field(() => Int)
  tokensPerMonth: number;
}

@Resolver()
export class TeamResolver {
  constructor(private readonly teamService: TeamService) {}

  @Query(() => [TeamMembershipWithId], { name: 'team_membership' })
  async getTeamMemberships(
    @Args('userId', { nullable: true }) userId?: string,
  ): Promise<TeamMembershipWithId[]> {
    return this.teamService.getTeamMemberships(userId || 'mock-user-123');
  }

  @Query(() => [Team], { name: 'teams' })
  async getTeams(): Promise<Team[]> {
    return this.teamService.getTeams();
  }

  @Query(() => TeamPlanOfferDetails, { name: 'getTeamPlanOfferDetails' })
  async getTeamPlanOfferDetails(): Promise<TeamPlanOfferDetails> {
    return this.teamService.getTeamPlanOfferDetails();
  }

  @Mutation(() => Team, { name: 'insert_teams_one' })
  async createTeam(
    @Args('teamName', { nullable: true }) teamName?: string,
    @Args('plan', { nullable: true }) plan?: string,
  ): Promise<Team> {
    return this.teamService.createTeam({ teamName, plan });
  }
}
