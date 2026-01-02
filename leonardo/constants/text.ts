/**
 * Text Constants
 * 
 * Centralized constants for text processing and localization.
 */

// ============================================================================
// Slug Excluded Words (Stop Words)
// ============================================================================

export const SLUG_EXCLUDED_WORDS = new Set([
    "a", "an", "the", "and", "or", "but", "in", "on", "at", "to", "for", "of", "with", "by", "from",
    "through", "during", "before", "after", "above", "below", "under", "over", "between", "within",
    "is", "am", "are", "was", "were", "be", "being", "been", "have", "has", "had", "do", "does", "did",
    "will", "would", "could", "should", "can", "must", "this", "that", "these", "those", "here", "there",
    "where", "when", "why", "how", "what", "which", "who", "i", "you", "we", "they", "me", "us", "them",
    "my", "your", "our", "their", "very", "quite", "rather", "really", "actually", "completely", "totally",
    "mostly", "mainly", "generally", "usually", "often", "sometimes", "never", "always", "also", "too",
    "as", "well", "even", "only", "just", "still", "yet", "already", "now", "then", "soon", "later",
    "again", "once", "more", "most", "less", "least", "look", "try", "work", "please", "thank", "thanks",
    "sorry", "hello", "hi", "goodbye", "yes", "no", "okay", "ok",
    // Portuguese
    "o", "os", "as", "um", "uma", "de", "do", "da", "dos", "das", "em", "no", "na", "nos", "nas",
    "por", "pelo", "pela", "para", "com", "sem", "sobre", "entre", "desde", "até", "durante", "como",
    "quando", "onde", "que", "quem", "qual", "é", "são", "está", "estão", "foi", "foram", "ser", "estar",
    "ter", "tem", "têm", "haver", "há", "fazer", "faz", "ir", "vai", "vir", "vem", "dar", "dá", "ver",
    "vê", "dizer", "diz", "poder", "pode", "saber", "sabe", "querer", "quer", "dever", "deve", "eu",
    "tu", "você", "nós", "vocês", "me", "te", "se", "nos", "lhe", "meu", "minha", "seu", "sua", "nosso",
    "nossa", "este", "esta", "esse", "essa", "aquele", "aquela", "isto", "isso", "aquilo", "aqui", "ali",
    "lá", "muito", "muita", "pouco", "pouca", "tanto", "todo", "toda", "alguns", "algumas", "outro",
    "outra", "mesmo", "mesma", "tal", "mais", "menos", "bem", "mal", "assim", "só", "apenas", "ainda",
    "já", "sempre", "nunca", "talvez", "certamente", "principalmente", "geralmente", "somente", "criar",
    "gerar", "produzir", "desenhar", "mostrar", "incluir", "precisar", "escolher", "colocar", "obter",
    "encontrar", "tentar", "por", "favor", "obrigado", "obrigada", "olá", "oi", "sim", "não", "bom", "boa",
    // German
    "der", "die", "das", "den", "dem", "des", "ein", "eine", "einen", "einem", "und", "oder", "aber",
    "jedoch", "als", "wie", "so", "an", "auf", "über", "unter", "vor", "hinter", "durch", "für", "gegen",
    "ohne", "mit", "bei", "zu", "nach", "von", "aus", "um", "während", "wegen", "ist", "sind", "war",
    "waren", "sein", "werden", "wird", "haben", "hat", "können", "kann", "müssen", "muss", "sollen",
    "soll", "wollen", "will", "lassen", "gehen", "geht", "kommen", "kommt", "sehen", "sieht", "geben",
    "gibt", "nehmen", "nimmt", "machen", "macht", "sagen", "sagt", "wissen", "weiß", "finden", "findet",
    "ich", "du", "er", "sie", "es", "wir", "ihr", "mich", "dich", "sich", "uns", "mir", "dir", "ihm",
    "mein", "meine", "sein", "seine", "unser", "unsere", "dieser", "diese", "dieses", "hier", "dort",
    "da", "wo", "wann", "wie", "warum", "was", "wer", "welcher", "welche", "viel", "viele", "wenig",
    "mehr", "alle", "andere", "sehr", "ganz", "wirklich", "etwa", "schon", "noch", "immer", "nie",
    "manchmal", "oft", "auch", "nur", "erst", "wieder", "erstellen", "erzeugen", "zeichnen", "zeigen",
    "enthalten", "brauchen", "setzen", "erhalten", "versuchen", "bitte", "danke", "hallo", "ja", "nein", "gut"
]);
