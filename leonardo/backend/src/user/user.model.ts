import { ObjectType, Field, ID, Int, Float } from '@nestjs/graphql';
import { TeamMembership } from '../team/team.model';

@ObjectType()
export class TosAcceptance {
  @Field()
  tosHash: string;

  @Field()
  acceptedAt: string;
}

@ObjectType()
export class UserDetails {
  @Field(() => ID)
  id: string;

  @Field(() => Int, { nullable: true })
  apiConcurrencySlots?: number;

  @Field(() => Float, { nullable: true })
  apiCredit?: number;

  @Field(() => Int, { nullable: true })
  apiPaidTokens?: number;

  @Field({ nullable: true })
  apiPlan?: string;

  @Field(() => Int, { nullable: true })
  apiPlanAutoTopUpTriggerBalance?: number;

  @Field({ nullable: true })
  apiPlanSubscribeDate?: string;

  @Field({ nullable: true })
  apiPlanSubscribeFrequency?: string;

  @Field({ nullable: true })
  apiPlanSubscriptionSource?: string;

  @Field({ nullable: true })
  apiPlanTokenRenewalDate?: string;

  @Field(() => Int, { nullable: true })
  apiPlanTopUpAmount?: number;

  @Field(() => Int, { nullable: true })
  apiSubscriptionTokens?: number;

  @Field({ nullable: true })
  auth0Email?: string;

  @Field(() => [String], { nullable: true })
  interests?: string[];

  @Field(() => [String], { nullable: true })
  interestsRoles?: string[];

  @Field({ nullable: true })
  interestsRolesOther?: string;

  @Field({ nullable: true })
  isChangelogVisible?: boolean;

  @Field({ nullable: true })
  lastSeenChangelogId?: string;

  @Field({ nullable: true })
  paddleId?: string;

  @Field({ nullable: true })
  plan?: string;

  @Field({ nullable: true })
  planSubscribeFrequency?: string;

  @Field({ nullable: true })
  showNsfw?: boolean;

  @Field(() => Int, { nullable: true })
  streamTokens?: number;

  @Field(() => Int, { nullable: true })
  subscriptionGptTokens?: number;

  @Field(() => Int, { nullable: true })
  subscriptionModelTokens?: number;

  @Field({ nullable: true })
  subscriptionSource?: string;

  @Field({ nullable: true })
  tokenRenewalDate?: string;

  @Field(() => Int, { nullable: true })
  customApiTokenRenewalAmount?: number;

  @Field(() => Int, { nullable: true })
  paidTokens?: number;

  @Field(() => Int, { nullable: true })
  subscriptionTokens?: number;

  @Field(() => Int, { nullable: true })
  rolloverTokens?: number;

  @Field({ nullable: true })
  cognitoId?: string;
}

@ObjectType()
export class User {
  @Field(() => ID)
  id: string;

  @Field({ nullable: true })
  username?: string;

  @Field({ nullable: true })
  blocked?: boolean;

  @Field({ nullable: true })
  suspensionStatus?: string;

  @Field()
  createdAt: string;

  @Field(() => [UserDetails])
  user_details: UserDetails[];

  @Field(() => [TeamMembership])
  team_memberships: TeamMembership[];

  @Field(() => [TosAcceptance])
  tos_acceptances: TosAcceptance[];
}

@ObjectType()
export class AwsMarketplaceSubscription {
  @Field(() => ID)
  id: string;

  @Field({ nullable: true })
  awsMpSubscriptionStatus?: string;

  @Field({ nullable: true })
  awsMpSubscriptionType?: string;
}

@ObjectType()
export class UserWithAwsSubscriptions {
  @Field(() => [AwsMarketplaceSubscription])
  aws_marketplace_subscriptions: AwsMarketplaceSubscription[];
}

@ObjectType()
export class UserState {
  @Field(() => String, { nullable: true })
  state?: string;
}

@ObjectType()
export class GetUserStateResponse {
  @Field(() => String, { nullable: true })
  state?: string;
}
