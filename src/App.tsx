import { useGame } from './hooks/useGame';
import HomeScreen from './components/HomeScreen';
import PlayerSetup from './components/PlayerSetup';
import RoleReveal from './components/RoleReveal';
import ClueScreen from './components/ClueScreen';
import VoteScreen from './components/VoteScreen';
import ResultsScreen from './components/ResultsScreen';
import { Player } from './types/game';

export default function App() {
  const {
    state,
    goHome,
    startSetup,
    startGame,
    advanceReveal,
    startVoting,
    cancelRound,
    castVote,
    finalizeVotes,
    playNextRound,
    updateScores,
  } = useGame();

  const handleStartGame = (players: Player[], timerEnabled: boolean) => {
    startGame(players, timerEnabled);
  };

  return (
    <div className="max-w-md mx-auto">
      {state.phase === 'home' && (
        <HomeScreen onStart={startSetup} />
      )}
      {state.phase === 'setup' && (
        <PlayerSetup onStart={handleStartGame} onBack={goHome} />
      )}
      {state.phase === 'reveal' && (
        <RoleReveal state={state} onContinue={advanceReveal} />
      )}
      {state.phase === 'clues' && (
        <ClueScreen
          state={state}
          onContinue={startVoting}
          onCancel={cancelRound}
        />
      )}
      {state.phase === 'vote' && (
        <VoteScreen
          state={state}
          onCastVote={castVote}
          onFinalize={finalizeVotes}
          onCancel={cancelRound}
        />
      )}
      {state.phase === 'results' && (
        <ResultsScreen
          state={state}
          onNextRound={playNextRound}
          onHome={goHome}
          onUpdateScores={updateScores}
        />
      )}
    </div>
  );
}
