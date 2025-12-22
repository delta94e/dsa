// ═══════════════════════════════════════════════════════════════
// CLIENT → SERVER EVENTS
// ═══════════════════════════════════════════════════════════════

export class JoinGameDto {
    name: string;
}

export class PlayerInputDto {
    angle: number;
    boost: boolean;
}

// ═══════════════════════════════════════════════════════════════
// SERVER → CLIENT EVENTS
// ═══════════════════════════════════════════════════════════════

export interface SnakeDto {
    id: string;
    name: string;
    segments: Array<{ x: number; y: number; radius: number }>;
    angle: number;
    color: string;
    score: number;
    isBoosting: boolean;
}

export interface OrbDto {
    id: string;
    x: number;
    y: number;
    value: number;
    color: string;
    radius: number;
}

export interface WorldUpdateDto {
    snakes: SnakeDto[];
    orbs: OrbDto[];
    tick: number;
}

export interface LeaderboardEntryDto {
    id: string;
    name: string;
    score: number;
}

export interface PlayerDiedDto {
    killerId?: string;
    killerName?: string;
    score: number;
}

export interface PlayerJoinedDto {
    id: string;
    name: string;
}
