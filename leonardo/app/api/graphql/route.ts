import { NextRequest, NextResponse } from 'next/server';

// ============================================================================
// Mock Data
// ============================================================================

const MOCK_USER = {
  id: 'mock-user-123',
  username: 'DemoUser',
  blocked: false,
  suspensionStatus: null,
  createdAt: new Date().toISOString(),
  tos_acceptances: [
    {
      tosHash: 'mock-tos-hash',
      acceptedAt: new Date().toISOString(),
    },
  ],
  user_details: [
    {
      id: 'mock-user-details-123',
      apiConcurrencySlots: 5,
      apiCredit: 0,
      apiPaidTokens: 0,
      apiPlan: 'basic',
      apiPlanAutoTopUpTriggerBalance: null,
      apiPlanSubscribeDate: new Date().toISOString(),
      apiPlanSubscribeFrequency: 'monthly',
      apiPlanSubscriptionSource: null,
      apiPlanTokenRenewalDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      apiPlanTopUpAmount: null,
      apiSubscriptionTokens: 8500,
      auth0Email: 'demo@leonardo.ai',
      interests: ['art', 'design', 'games'],
      interestsRoles: ['designer'],
      interestsRolesOther: null,
      isChangelogVisible: true,
      lastSeenChangelogId: 'changelog-1',
      paddleId: null,
      plan: 'FREE',
      planSubscribeFrequency: 'monthly',
      showNsfw: false,
      streamTokens: 100,
      subscriptionGptTokens: 500,
      subscriptionModelTokens: 150,
      subscriptionSource: null,
      tokenRenewalDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      customApiTokenRenewalAmount: null,
      paidTokens: 0,
      subscriptionTokens: 150,
      rolloverTokens: 0,
    },
  ],
  team_memberships: [
    {
      userId: 'mock-user-123',
      teamId: 'mock-team-1',
      role: 'OWNER',
      team: {
        akUUID: 'ak-uuid-mock-1',
        id: 'mock-team-1',
        modifiedAt: new Date().toISOString(),
        paidTokens: 0,
        paymentPlatformId: null,
        plan: 'FREE',
        planCustomTokenRenewalAmount: null,
        planSeats: 5,
        planSubscribeDate: new Date().toISOString(),
        planSubscribeFrequency: 'monthly',
        planSubscriptionSource: null,
        planTokenRenewalDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        subscriptionTokens: 150,
        teamLogoUrl: null,
        teamName: 'My Team',
        createdAt: new Date().toISOString(),
        creatorUserId: 'mock-user-123',
        rolloverTokens: 0,
        members: [
          {
            teamId: 'mock-team-1',
            userId: 'mock-user-123',
            role: 'OWNER',
            createdAt: new Date().toISOString(),
          },
        ],
      },
    },
  ],
};

const MOCK_TEAMS = [
  {
    akUUID: 'ak-uuid-mock-1',
    paidTokens: 0,
    subscriptionTokens: 150,
    rolloverTokens: 0,
  },
];

// ============================================================================
// Query Handlers
// ============================================================================

type QueryHandler = (variables: Record<string, unknown>) => unknown;

const queryHandlers: Record<string, QueryHandler> = {
  GetUserDetails: () => ({
    users: [MOCK_USER],
  }),

  GetUserTokensFromSub: () => ({
    user_details: MOCK_USER.user_details,
    teams: MOCK_TEAMS,
  }),

  GetUserAWSMarketplaceSubscriptions: () => ({
    users: [{ aws_marketplace_subscriptions: [] }],
  }),

  GetUserTeams: () => ({
    team_membership: MOCK_USER.team_memberships,
  }),

  GetUserState: () => ({
    getUserState: { state: {} },
  }),

  GetUserRetentions: () => ({
    queryUserRetentions: {
      lastShowingDate: null,
      offers: [],
      offersEnabled: false,
      showingsCurrentCount: 0,
      showingsMaxCount: 3,
      showingsMinInterval: 24,
      offerAccepted: false,
      offerActivated: false,
      activationGracePeriod: 7,
    },
  }),

  GetTeamPlanOfferAnnualDetails: () => ({
    getTeamPlanOfferDetails: {
      annualUnitPrice: 0,
      currency: 'USD',
      discountPercentage: 20,
      monthlyUnitPrice: 0,
      priceId: 'mock-price-id',
      productType: 'TEAM',
      tokensPerMonth: 8500,
    },
  }),

  GetPricing: () => ({
    pricingCalculator_productPrices: [],
  }),

  // Add more query handlers as needed
};

// ============================================================================
// Mutation Handlers
// ============================================================================

const mutationHandlers: Record<string, QueryHandler> = {
  UpdateUserDetails: (variables) => ({
    update_user_details: {
      affected_rows: 1,
      returning: [{ id: MOCK_USER.user_details[0].id, ...variables }],
    },
  }),

  CreateTeam: (variables) => ({
    insert_teams_one: {
      id: `team-${Date.now()}`,
      akUUID: `ak-uuid-${Date.now()}`,
      ...(variables as Record<string, unknown>),
    },
  }),

  // Add more mutation handlers as needed
};

// ============================================================================
// GraphQL API Handler
// ============================================================================

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { query, variables = {}, operationName } = body;

    // Parse operation name from query if not provided
    let opName = operationName;
    if (!opName && query) {
      const match = query.match(/(?:query|mutation)\s+(\w+)/);
      if (match) {
        opName = match[1];
      }
    }

    console.log('[Mock GraphQL] Operation:', opName);

    // Check if it's a mutation
    const isMutation = query?.trim().startsWith('mutation');

    // Find handler
    const handlers = isMutation ? mutationHandlers : queryHandlers;
    const handler = opName ? handlers[opName] : null;

    if (handler) {
      const data = handler(variables as Record<string, unknown>);
      return NextResponse.json({ data });
    }

    // Default empty response for unknown queries
    console.warn('[Mock GraphQL] No handler for operation:', opName);
    return NextResponse.json({
      data: null,
      errors: [
        {
          message: `No mock handler for operation: ${opName}`,
          extensions: { code: 'MOCK_NOT_IMPLEMENTED' },
        },
      ],
    });
  } catch (error) {
    console.error('[Mock GraphQL] Error:', error);
    return NextResponse.json(
      {
        data: null,
        errors: [
          {
            message: error instanceof Error ? error.message : 'Internal server error',
            extensions: { code: 'INTERNAL_ERROR' },
          },
        ],
      },
      { status: 500 }
    );
  }
}

// Handle GET for GraphQL Playground/introspection
export async function GET() {
  return NextResponse.json({
    message: 'Mock GraphQL API is running. Use POST to execute queries.',
    availableQueries: Object.keys(queryHandlers),
    availableMutations: Object.keys(mutationHandlers),
  });
}
