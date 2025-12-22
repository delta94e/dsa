import { ObjectType, Field, ID, registerEnumType } from '@nestjs/graphql';
import { Node } from '../graphql/node.interface';
import { createConnectionType, createEdgeType } from '../graphql/connection.types';

// Register Level enum
export enum LevelEnum {
    A1 = 'A1',
    A2 = 'A2',
    B1 = 'B1',
    B2 = 'B2',
    C1 = 'C1',
    C2 = 'C2',
}

registerEnumType(LevelEnum, {
    name: 'Level',
    description: 'English proficiency level',
});

// Room Type enum
export enum RoomTypeEnum {
    public = 'public',
    private = 'private',
}

registerEnumType(RoomTypeEnum, {
    name: 'RoomType',
    description: 'Room visibility type',
});

/**
 * GraphQL Room Type implementing Relay Node interface
 */
@ObjectType('Room', { implements: () => [Node], description: 'A practice room' })
export class RoomType implements Node {
    @Field(() => ID)
    id: string;

    @Field()
    name: string;

    @Field()
    topic: string;

    @Field(() => LevelEnum)
    level: LevelEnum;

    @Field(() => RoomTypeEnum)
    type: RoomTypeEnum;

    @Field()
    hostId: string;

    @Field()
    maxParticipants: number;

    @Field()
    participantCount: number;

    @Field(() => [String])
    tags: string[];

    @Field()
    hasPassword: boolean;

    @Field()
    createdAt: Date;
}

/**
 * Room Edge type for Relay connections
 */
@ObjectType()
export class RoomEdge extends createEdgeType(RoomType) {
    @Field(() => RoomType)
    node: RoomType;

    @Field()
    cursor: string;
}

/**
 * Room Connection type for Relay pagination
 */
@ObjectType()
export class RoomConnection extends createConnectionType(RoomType) { }

/**
 * Participant Type
 */
@ObjectType({ description: 'A room participant' })
export class ParticipantType {
    @Field(() => ID)
    id: string;

    @Field()
    name: string;

    @Field({ nullable: true })
    avatarUrl?: string;

    @Field()
    isMuted: boolean;

    @Field()
    isSpeaking: boolean;

    @Field()
    isHandRaised: boolean;

    @Field()
    joinedAt: Date;
}
