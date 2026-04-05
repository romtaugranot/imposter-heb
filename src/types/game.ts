export type GamePhase = 'home' | 'setup' | 'reveal' | 'clues' | 'vote' | 'results';

export interface Player {
  id: string;
  name: string;
  score: number;
}

export interface GameState {
  phase: GamePhase;
  players: Player[];
  word: string;
  category: string;
  imposterIds: string[];
  currentRevealIndex: number;
  clueOrder: string[];
  currentClueIndex: number;
  votes: Record<string, string>;
  roundNumber: number;
  timerEnabled: boolean;
}
