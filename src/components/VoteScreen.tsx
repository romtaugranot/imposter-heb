import { useState } from 'react';
import { GameState } from '../types/game';
import { Check, ChevronLeft, X } from 'lucide-react';

interface Props {
  state: GameState;
  onCastVote: (voterId: string, accusedId: string) => void;
  onFinalize: () => void;
  onCancel: () => void;
}

export default function VoteScreen({ state, onCastVote, onFinalize, onCancel }: Props) {
  const [currentVoterIndex, setCurrentVoterIndex] = useState(0);
  const [hasVoted, setHasVoted] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isReady, setIsReady] = useState(false);

  const currentVoter = state.players[currentVoterIndex];
  const isLastVoter = currentVoterIndex === state.players.length - 1;
  const candidates = state.players.filter((p) => p.id !== currentVoter.id);
  const imposterCount = state.imposterIds.length;
  const needsMultiVote = imposterCount > 1;

  const handleSelect = (id: string) => {
    if (!hasVoted) {
      const newSelected = new Set(selectedIds);
      if (newSelected.has(id)) {
        newSelected.delete(id);
      } else {
        if (needsMultiVote && newSelected.size >= imposterCount) {
          newSelected.delete([...newSelected][0]);
        }
        newSelected.add(id);
      }
      setSelectedIds(newSelected);
    }
  };

  const handleConfirmVote = () => {
    if (selectedIds.size === 0) return;
    if (needsMultiVote && selectedIds.size !== imposterCount) return;
    selectedIds.forEach((id) => onCastVote(currentVoter.id, id));
    setHasVoted(true);
  };

  const handleNext = () => {
    if (isLastVoter) {
      onFinalize();
    } else {
      setCurrentVoterIndex((prev) => prev + 1);
      setHasVoted(false);
      setSelectedIds(new Set());
      setIsReady(false);
    }
  };

  if (!isReady) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6" dir="rtl">
        <div className="max-w-sm w-full flex flex-col items-center gap-6 text-center">
          <div className="w-16 h-16 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center">
            <span className="text-3xl">🗳️</span>
          </div>
          <div>
            <p className="text-slate-400 text-sm mb-1">
              תורך להצביע — {currentVoterIndex + 1} מתוך {state.players.length}
            </p>
            <h2 className="text-white font-black text-3xl">{currentVoter.name}</h2>
            <p className="text-slate-400 text-base mt-2">לחץ כשאתה מוכן להצביע בסתר</p>
          </div>
          <button
            onClick={() => setIsReady(true)}
            className="w-full bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-bold text-lg py-4 rounded-2xl transition-all active:scale-95"
          >
            הצביע בסתר
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col p-5" dir="rtl">
      <div className="mb-6">
        <p className="text-slate-400 text-sm mb-1">
          {currentVoterIndex + 1} מתוך {state.players.length} מצביעים
        </p>
        <h1 className="text-white font-black text-2xl">{currentVoter.name}, מי המתחזה?</h1>
      </div>

      <div className="mb-4">
        {needsMultiVote && (
          <p className="text-amber-400 text-sm font-bold mb-3 text-center">
            בחר {imposterCount} מתחזים
          </p>
        )}
      </div>

      <div className="flex-1 space-y-2 mb-6">
        {candidates.map((player) => {
          const isSelected = selectedIds.has(player.id);
          const isConfirmed = hasVoted && isSelected;
          return (
            <button
              key={player.id}
              onClick={() => handleSelect(player.id)}
              disabled={hasVoted}
              className={`w-full flex items-center gap-3 rounded-xl px-4 py-4 border transition-all ${
                isConfirmed
                  ? 'bg-red-900/30 border-red-600/60 cursor-default'
                  : isSelected
                  ? 'bg-red-950/40 border-red-700/50'
                  : 'bg-slate-900 border-slate-800 hover:border-slate-600 active:scale-98'
              }`}
            >
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                isConfirmed
                  ? 'bg-red-600 border-red-600'
                  : isSelected
                  ? 'border-red-500 bg-red-900/20'
                  : 'border-slate-600 bg-transparent'
              }`}>
                {(isSelected || isConfirmed) && (
                  <Check size={12} className="text-white" strokeWidth={3} />
                )}
              </div>
              <span className={`text-lg font-semibold flex-1 text-right ${
                isConfirmed ? 'text-red-300' : isSelected ? 'text-white' : 'text-slate-300'
              }`}>
                {player.name}
              </span>
            </button>
          );
        })}
      </div>

      {!hasVoted ? (
        <div className="space-y-3">
          <button
            onClick={handleConfirmVote}
            disabled={selectedIds.size === 0 || (needsMultiVote && selectedIds.size !== imposterCount)}
            className="w-full bg-red-600 hover:bg-red-500 disabled:bg-slate-800 disabled:text-slate-600 text-white font-black text-lg py-4 rounded-2xl shadow-lg shadow-red-900/30 transition-all active:scale-95"
          >
            אשר הצבעה
          </button>
          <button
            onClick={onCancel}
            className="w-full bg-slate-800 hover:bg-slate-700 border border-slate-800 text-slate-300 font-bold text-sm py-2 rounded-xl transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            <X size={16} />
            <span>בטל סיבוב</span>
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="bg-green-900/20 border border-green-800/40 rounded-xl px-4 py-3 text-center">
            <p className="text-green-400 text-sm font-medium">
              הצבעת על {Array.from(selectedIds).map((id) => state.players.find((p) => p.id === id)?.name).join(', ')}
            </p>
          </div>
          <button
            onClick={handleNext}
            className="w-full bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-bold text-lg py-4 rounded-2xl transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            <ChevronLeft size={20} />
            <span>{isLastVoter ? 'ראה תוצאות' : 'הבא'}</span>
          </button>
        </div>
      )}

      <div className="flex gap-1.5 justify-center mt-4">
        {state.players.map((_, i) => (
          <div
            key={i}
            className={`h-1.5 rounded-full transition-all ${
              i < currentVoterIndex
                ? 'bg-green-600 w-4'
                : i === currentVoterIndex
                ? 'bg-red-500 w-6'
                : 'bg-slate-700 w-2'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
