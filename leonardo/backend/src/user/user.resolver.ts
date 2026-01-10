import { Resolver, Query, Args, ObjectType, Field, Int, registerEnumType } from '@nestjs/graphql';
import { UserService } from './user.service';
import { User, UserDetails, UserWithAwsSubscriptions, GetUserStateResponse } from './user.model';

// Enum for UserStateType
export enum UserStateType {
  Activity = 'Activity',
  ImageGeneration = 'ImageGeneration',
  VideoGeneration = 'VideoGeneration',
  Preferences = 'Preferences',
  Onboarding = 'Onboarding',
}

registerEnumType(UserStateType, {
  name: 'UserStateType',
  description: 'Type of user state to retrieve',
});

// Response types
@ObjectType()
export class UserRetentions {
  @Field({ nullable: true })
  lastShowingDate?: string;

  @Field(() => [String])
  offers: string[];

  @Field()
  offersEnabled: boolean;

  @Field(() => Int)
  showingsCurrentCount: number;

  @Field(() => Int)
  showingsMaxCount: number;

  @Field(() => Int)
  showingsMinInterval: number;

  @Field()
  offerAccepted: boolean;

  @Field()
  offerActivated: boolean;

  @Field(() => Int)
  activationGracePeriod: number;
}

@ObjectType()
export class UpdateUserDetailsResult {
  @Field(() => Int)
  affected_rows: number;

  @Field(() => [UserDetails])
  returning: UserDetails[];
}

@Resolver()
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query(() => [User], { name: 'users' })
  async getUsers(
    @Args('userSub', { nullable: true }) userSub?: string,
  ): Promise<User[]> {
    return this.userService.getUserDetails(userSub);
  }

  @Query(() => [UserWithAwsSubscriptions], { name: 'usersWithAwsSubscriptions' })
  async getUserAWSMarketplaceSubscriptions(
    @Args('userSub', { nullable: true }) userSub?: string,
  ): Promise<UserWithAwsSubscriptions[]> {
    return this.userService.getUserAWSMarketplaceSubscriptions(userSub);
  }

  @Query(() => GetUserStateResponse, { name: 'getUserState' })
  async getUserState(
    @Args('type', { type: () => UserStateType, defaultValue: UserStateType.Activity }) type: UserStateType,
  ): Promise<GetUserStateResponse> {
    return this.userService.getUserState(type);
  }

  @Query(() => UserRetentions, { name: 'queryUserRetentions' })
  async getUserRetentions(): Promise<UserRetentions> {
    return this.userService.getUserRetentions();
  }
}
