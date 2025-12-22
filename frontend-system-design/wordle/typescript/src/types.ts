// ═══════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════

export type TileState = 'empty' | 'tbd' | 'correct' | 'present' | 'absent';
export type GameStatus = 'playing' | 'won' | 'lost';
export type KeyState = 'unused' | 'absent' | 'present' | 'correct';

export interface GameState {
    targetWord: string;
    guesses: string[];
    currentGuess: string;
    evaluations: TileState[][];
    gameStatus: GameStatus;
    currentRow: number;
}

export interface Statistics {
    gamesPlayed: number;
    gamesWon: number;
    currentStreak: number;
    maxStreak: number;
    guessDistribution: number[];
    lastPlayed: string | null;
}

// ═══════════════════════════════════════════════════════════════
// CONSTANTS
// ═══════════════════════════════════════════════════════════════

export const WORD_LENGTH = 5;
export const MAX_ATTEMPTS = 6;

export const KEYBOARD_ROWS = [
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
    ['ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'BACKSPACE'],
];

export const STATE_PRIORITY: Record<KeyState, number> = {
    unused: 0,
    absent: 1,
    present: 2,
    correct: 3,
};

// ═══════════════════════════════════════════════════════════════
// WORD LISTS (Simplified - Real game has ~2300+ words)
// ═══════════════════════════════════════════════════════════════

export const ANSWER_WORDS: string[] = [
    'CRANE', 'SLATE', 'CRATE', 'TRACE', 'STARE',
    'AUDIO', 'ADIEU', 'RAISE', 'ARISE', 'IRATE',
    'LEARN', 'RENAL', 'ALONE', 'ATONE', 'OATER',
    'SALET', 'RALES', 'LASER', 'EARLS', 'ARLES',
    'TARES', 'STALE', 'STEAL', 'TALES', 'TEALS',
    'STORE', 'ROTES', 'TORES', 'ROSET', 'TORSE',
    'PAINT', 'PIANO', 'PATIO', 'POINT', 'JOINT',
    'ABOUT', 'DOUBT', 'SHOUT', 'SCOUT', 'STOUT',
    'WORLD', 'WORDS', 'WORKS', 'WORMS', 'WORRY',
    'HAPPY', 'PARTY', 'CANDY', 'SANDY', 'HANDY',
];

export const VALID_WORDS: Set<string> = new Set([
    ...ANSWER_WORDS,
    'ABBEY', 'ABBOT', 'ABIDE', 'ABLE', 'ABOUT',
    'ABOVE', 'ABUSE', 'ACTOR', 'ACUTE', 'ADMIT',
    'ADOPT', 'ADULT', 'AFTER', 'AGAIN', 'AGENT',
    'AGREE', 'AHEAD', 'ALARM', 'ALBUM', 'ALERT',
    'ALIEN', 'ALIGN', 'ALIKE', 'ALIVE', 'ALLEY',
    'ALLOW', 'ALLOY', 'ALONE', 'ALONG', 'ALPHA',
    'ALTER', 'AMONG', 'ANGEL', 'ANGER', 'ANGLE',
    'ANGRY', 'ANNOY', 'APART', 'APPLE', 'APPLY',
    'ARENA', 'ARGUE', 'ARISE', 'ARMOR', 'AROMA',
    'ARRAY', 'ARROW', 'ASSET', 'AUDIO', 'AUDIT',
    'AVOID', 'AWARD', 'AWARE', 'AWFUL',
    'BACON', 'BADGE', 'BADLY', 'BAKER', 'BALLS',
    'BASIC', 'BASIN', 'BASIS', 'BATCH', 'BEACH',
    'BEARD', 'BEAST', 'BEGIN', 'BEING', 'BELLY',
    'BELOW', 'BENCH', 'BERRY', 'BLACK', 'BLADE',
    'BLAME', 'BLANK', 'BLAST', 'BLEND', 'BLESS',
    'BLIND', 'BLOCK', 'BLOOD', 'BLOOM', 'BLOWN',
    'BLUES', 'BLUNT', 'BOARD', 'BOAST', 'BONUS',
    'BOOTH', 'BOUND', 'BRAIN', 'BRAND', 'BRASS',
    'BRAVE', 'BREAD', 'BREAK', 'BREED', 'BRICK',
    'BRIDE', 'BRIEF', 'BRING', 'BROAD', 'BROKE',
    'BROWN', 'BRUSH', 'BUILD', 'BUNCH', 'BURST',
    'BUYER',
    'CABIN', 'CABLE', 'CAMEL', 'CANDY', 'CARGO',
    'CARRY', 'CATCH', 'CAUSE', 'CHAIN', 'CHAIR',
    'CHAOS', 'CHARM', 'CHART', 'CHASE', 'CHEAP',
    'CHECK', 'CHEEK', 'CHESS', 'CHEST', 'CHIEF',
    'CHILD', 'CHINA', 'CHORD', 'CHOSE', 'CLAIM',
    'CLASS', 'CLEAN', 'CLEAR', 'CLERK', 'CLICK',
    'CLIFF', 'CLIMB', 'CLOCK', 'CLOSE', 'CLOTH',
    'CLOUD', 'COACH', 'COAST', 'COUCH', 'COULD',
    'COUNT', 'COURT', 'COVER', 'CRAFT', 'CRASH',
    'CRAZY', 'CREAM', 'CRIME', 'CRISP', 'CROSS',
    'CROWD', 'CROWN', 'CRUDE', 'CRUSH', 'CURVE',
    'CYCLE',
    'DAILY', 'DANCE', 'DEALT', 'DEATH', 'DEBUT',
    'DECAY', 'DELAY', 'DELTA', 'DEMON', 'DEPTH',
    'DIRTY', 'DISCO', 'DOUBT', 'DOUGH', 'DOZEN',
    'DRAFT', 'DRAIN', 'DRAMA', 'DRANK', 'DRAWN',
    'DREAM', 'DRESS', 'DRIED', 'DRIFT', 'DRILL',
    'DRINK', 'DRIVE', 'DROWN', 'DRUNK', 'DYING',
]);
