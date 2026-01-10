import { ObjectType, Field, ID, Int, Float } from '@nestjs/graphql';

@ObjectType()
export class TeamMember {
  @Field(() => ID)
  teamId: string;

  @Field(() => ID)
  userId: string;

  @Field()
  role: string;

  @Field()
  createdAt: string;
}

@ObjectType()
export class Team {
  @Field(() => ID)
  id: string;

  @Field(() => ID)
  akUUID: string;

  @Field({ nullable: true })
  teamName?: string;

  @Field({ nullable: true })
  teamLogoUrl?: string;

  @Field({ nullable: true })
  plan?: string;

  @Field({ nullable: true })
  planSubscribeFrequency?: string;

  @Field({ nullable: true })
  planTokenRenewalDate?: string;

  @Field(() => Int, { nullable: true })
  planCustomTokenRenewalAmount?: number;

  @Field(() => Int, { nullable: true })
  planSeats?: number;

  @Field({ nullable: true })
  creatorUserId?: string;

  @Field(() => Int, { nullable: true })
  subscriptionTokens?: number;

  @Field(() => Int, { nullable: true })
  paidTokens?: number;

  @Field({ nullable: true })
  createdAt?: string;

  @Field({ nullable: true })
  planSubscribeDate?: string;

  @Field(() => Int, { nullable: true })
  rolloverTokens?: number;

  @Field({ nullable: true })
  modifiedAt?: string;

  @Field({ nullable: true })
  paymentPlatformId?: string;

  @Field({ nullable: true })
  planSubscriptionSource?: string;

  @Field(() => [TeamMember])
  members: TeamMember[];
}

@ObjectType()
export class TeamMembership {
  @Field(() => ID)
  userId: string;

  @Field(() => ID)
  teamId: string;

  @Field()
  role: string;

  @Field(() => Team)
  team: Team;
}

@ObjectType()
export class TeamMembershipWithId extends TeamMembership {
  @Field(() => ID)
  id: string;
}
