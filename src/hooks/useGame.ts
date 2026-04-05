import { useState, useCallback } from 'react';
import { GameState, Player, GamePhase } from '../types/game';
import { getRandomWordWithCategory } from '../data/hebrewWords';

const createInitialState = (): GameState => ({
  phase: 'home',
  players: [],
  word: '',
  category: '',
  imposterIds: [],
  currentRevealIndex: 0,
  clueOrder: [],
  currentClueIndex: 0,
  votes: {},
  roundNumber: 0,
  timerEnabled: true,
});

const assignImposters = (players: Player[]): string[] => {
  const count = players.length >= 8 ? 2 : 1;
  const shuffled = [...players].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count).map((p) => p.id);
};

const getRandomClueOrder = (playerIds: string[]): string[] => {
  return [...playerIds].sort(() => Math.random() - 0.5);
};

export const useGame = () => {
  const [state, setState] = useState<GameState>(createInitialState);

  const goHome = useCallback(() => {
    setState(createInitialState());
  }, []);

  const startSetup = useCallback(() => {
    setState((prev) => ({ ...prev, phase: 'setup' }));
  }, []);

  const setPlayers = useCallback((players: Player[]) => {
    setState((prev) => ({ ...prev, players }));
  }, []);

  const startGame = useCallback((players: Player[], timerEnabled: boolean) => {
    const { word, category } = getRandomWordWithCategory();
    const imposterIds = assignImposters(players);
    const clueOrder = getRandomClueOrder(players.map((p) => p.id));
    setState((prev) => ({
      ...prev,
      phase: 'reveal',
      players,
      word,
      category,
      imposterIds,
      currentRevealIndex: 0,
      clueOrder,
      currentClueIndex: 0,
      votes: {},
      roundNumber: prev.roundNumber + 1,
      timerEnabled,
    }));
  }, []);

  const advanceReveal = useCallback(() => {
    setState((prev) => {
      const next = prev.currentRevealIndex + 1;
      if (next >= prev.players.length) {
        return { ...prev, phase: 'clues', currentClueIndex: 0 };
      }
      return { ...prev, currentRevealIndex: next };
    });
  }, []);

  const advanceClue = useCallback(() => {
    setState((prev) => {
      const next = prev.currentClueIndex + 1;
      if (next >= prev.players.length) {
        return { ...prev, phase: 'vote' };
      }
      return { ...prev, currentClueIndex: next };
    });
  }, []);

  const cancelRound = useCallback(() => {
    setState((prev) => {
      const { word, category } = getRandomWordWithCategory();
      const imposterIds = assignImposters(prev.players);
      const clueOrder = getRandomClueOrder(prev.players.map((p) => p.id));
      return {
        ...prev,
        phase: 'reveal',
        word,
        category,
        imposterIds,
        currentRevealIndex: 0,
        clueOrder,
        currentClueIndex: 0,
        votes: {},
      };
    });
  }, []);

  const startVoting = useCallback(() => {
    setState((prev) => ({ ...prev, phase: 'vote' }));
  }, []);

  const castVote = useCallback((voterId: string, accusedId: string) => {
    setState((prev) => ({
      ...prev,
      votes: { ...prev.votes, [voterId]: accusedId },
    }));
  }, []);

  const finalizeVotes = useCallback(() => {
    setState((prev) => ({ ...prev, phase: 'results' }));
  }, []);

  const playNextRound = useCallback(() => {
    setState((prev) => {
      const { word, category } = getRandomWordWithCategory();
      const imposterIds = assignImposters(prev.players);
      const clueOrder = getRandomClueOrder(prev.players.map((p) => p.id));
      return {
        ...prev,
        phase: 'reveal',
        word,
        category,
        imposterIds,
        currentRevealIndex: 0,
        clueOrder,
        currentClueIndex: 0,
        votes: {},
        roundNumber: prev.roundNumber + 1,
      };
    });
  }, []);

  const updateScores = useCallback((winnerIds: string[], points: number) => {
    setState((prev) => ({
      ...prev,
      players: prev.players.map((p) =>
        winnerIds.includes(p.id) ? { ...p, score: p.score + points } : p
      ),
    }));
  }, []);

  const getVoteResults = useCallback(() => {
    const tallyMap: Record<string, number> = {};
    for (const accusedId of Object.values(state.votes)) {
      tallyMap[accusedId] = (tallyMap[accusedId] || 0) + 1;
    }
    const sorted = Object.entries(tallyMap).sort((a, b) => b[1] - a[1]);
    const topId = sorted[0]?.[0] ?? null;
    const topCount = sorted[0]?.[1] ?? 0;
    const isTie = sorted.length > 1 && sorted[1][1] === topCount;
    const mostVotedId = isTie ? null : topId;
    const isImposterCaught =
      mostVotedId !== null && state.imposterIds.includes(mostVotedId);
    return { tallyMap, mostVotedId, isImposterCaught, isTie };
  }, [state.votes, state.imposterIds]);

  const getCurrentPhase = (): GamePhase => state.phase;

  return {
    state,
    goHome,
    startSetup,
    setPlayers,
    startGame,
    advanceReveal,
    advanceClue,
    cancelRound,
    startVoting,
    castVote,
    finalizeVotes,
    playNextRound,
    updateScores,
    getVoteResults,
    getCurrentPhase,
  };
};
