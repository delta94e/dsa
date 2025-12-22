import { Type } from '@nestjs/common';
import { Field, ObjectType, Int, ArgsType, registerEnumType } from '@nestjs/graphql';

/**
 * Relay PageInfo type
 */
@ObjectType({ description: 'Information about pagination' })
export class PageInfo {
    @Field(() => Boolean)
    hasNextPage: boolean;

    @Field(() => Boolean)
    hasPreviousPage: boolean;

    @Field(() => String, { nullable: true })
    startCursor: string | null;

    @Field(() => String, { nullable: true })
    endCursor: string | null;
}

/**
 * Create a Relay Edge type for a given node type
 */
export function createEdgeType<T>(NodeType: Type<T>) {
    @ObjectType(`${NodeType.name}Edge`, { isAbstract: true })
    abstract class Edge {
        @Field(() => NodeType)
        node: T;

        @Field(() => String)
        cursor: string;
    }
    return Edge;
}

/**
 * Create a Relay Connection type for a given node type
 */
export function createConnectionType<T>(NodeType: Type<T>) {
    const EdgeType = createEdgeType(NodeType);

    @ObjectType(`${NodeType.name}Connection`, { isAbstract: true })
    abstract class Connection {
        @Field(() => [EdgeType])
        edges: Array<typeof EdgeType>;

        @Field(() => PageInfo)
        pageInfo: PageInfo;

        @Field(() => Int)
        totalCount: number;
    }
    return Connection;
}

/**
 * Connection Args for pagination
 */
@ArgsType()
export class ConnectionArgs {
    @Field(() => String, { nullable: true })
    after?: string;

    @Field(() => String, { nullable: true })
    before?: string;

    @Field(() => Int, { nullable: true, defaultValue: 10 })
    first?: number;

    @Field(() => Int, { nullable: true })
    last?: number;
}

/**
 * Helper to create cursor from offset
 */
export function encodeCursor(offset: number): string {
    return Buffer.from(`cursor:${offset}`).toString('base64');
}

/**
 * Helper to decode cursor to offset
 */
export function decodeCursor(cursor: string): number {
    const decoded = Buffer.from(cursor, 'base64').toString('utf8');
    const match = decoded.match(/^cursor:(\d+)$/);
    return match ? parseInt(match[1], 10) : 0;
}

/**
 * Helper to convert array to connection
 */
export function arrayToConnection<T>(
    items: T[],
    totalCount: number,
    args: ConnectionArgs,
): {
    edges: Array<{ node: T; cursor: string }>;
    pageInfo: PageInfo;
    totalCount: number;
} {
    const startOffset = args.after ? decodeCursor(args.after) + 1 : 0;

    const edges = items.map((node, index) => ({
        node,
        cursor: encodeCursor(startOffset + index),
    }));

    return {
        edges,
        pageInfo: {
            hasNextPage: startOffset + items.length < totalCount,
            hasPreviousPage: startOffset > 0,
            startCursor: edges.length > 0 ? edges[0].cursor : null,
            endCursor: edges.length > 0 ? edges[edges.length - 1].cursor : null,
        },
        totalCount,
    };
}
