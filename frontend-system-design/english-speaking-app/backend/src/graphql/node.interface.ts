import { Field, InterfaceType, ID } from '@nestjs/graphql';

/**
 * Relay Node Interface
 * All types that implement this interface can be refetched using the node query
 */
@InterfaceType({
    description: 'An object with a Globally Unique ID',
    resolveType: (value) => {
        // Resolve type based on __typename or type field
        if (value.__typename) return value.__typename;
        return null;
    },
})
export abstract class Node {
    @Field(() => ID, { description: 'Globally unique identifier' })
    id: string;
}
