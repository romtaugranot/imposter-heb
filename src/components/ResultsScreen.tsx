import { useEffect, useState } from 'react';
import { GameState } from '../types/game';
import { Home, RefreshCw, Trophy } from 'lucide-react';

interface Props {
  state: GameState;
  onNextRound: () => void;
  onHome: () => void;
  onUpdateScores: (winnerIds: string[], points: number) => void;
}

export default function ResultsScreen({ state, onNextRound, onHome, onUpdateScores }: Props) {
  const [revealed, setRevealed] = useState(false);
  const [scored, setScored] = useState(false);

  const tallyMap: Record<string, number> = {};
  for (const accusedId of Object.values(state.votes)) {
    tallyMap[accusedId] = (tallyMap[accusedId] || 0) + 1;
  }

  const sorted = Object.entries(tallyMap).sort((a, b) => b[1] - a[1]);
  const topCount = sorted[0]?.[1] ?? 0;
  const tiedTop = sorted.filter(([, c]) => c === topCount);
  const isTie = tiedTop.length > 1;
  const mostVotedId = isTie ? null : sorted[0]?.[0] ?? null;
  const isImposterCaught = mostVotedId !== null && state.imposterIds.includes(mostVotedId);

  const imposters = state.players.filter((p) => state.imposterIds.includes(p.id));
  const civilians = state.players.filter((p) => !state.imposterIds.includes(p.id));
  const mostVotedPlayer = state.players.find((p) => p.id === mostVotedId);

  useEffect(() => {
    if (revealed && !scored) {
      setScored(true);
      if (isTie) return;
      if (isImposterCaught) {
        const civilianIds = civilians.map((p) => p.id);
        onUpdateScores(civilianIds, 1);
      } else {
        const imposterIds = imposters.map((p) => p.id);
        onUpdateScores(imposterIds, 2);
      }
    }
  }, [revealed, scored, isImposterCaught, isTie, civilians, imposters, onUpdateScores]);

  const sortedPlayers = [...state.players].sort((a, b) => b.score - a.score);

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col p-5" dir="rtl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-white font-black text-2xl">תוצאות</h1>
        <span className="text-slate-500 text-sm">סיבוב {state.roundNumber}</span>
      </div>

      {!revealed ? (
        <div className="flex-1 flex flex-col items-center justify-center gap-6 text-center">
          <div className="w-20 h-20 rounded-full bg-slate-800 border-2 border-slate-700 flex items-center justify-center">
            <span className="text-4xl">🥁</span>
          </div>
          <div>
            <p className="text-slate-400 text-base mb-1">
              {isTie
                ? 'תיקו! לא נבחר שחקן'
                : `המועמד עם הכי הרבה קולות:`}
            </p>
            {!isTie && mostVotedPlayer && (
              <h2 className="text-white font-black text-4xl">{mostVotedPlayer.name}</h2>
            )}
            {isTie && (
              <h2 className="text-amber-400 font-black text-3xl">תיקו!</h2>
            )}
          </div>

          <div className="w-full bg-slate-900 border border-slate-800 rounded-2xl p-4">
            <h3 className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-3">
              תוצאות ההצבעה
            </h3>
            {state.players.map((player) => {
              const voteCount = tallyMap[player.id] ?? 0;
              const pct = state.players.length > 0 ? (voteCount / state.players.length) * 100 : 0;
              return (
                <div key={player.id} className="mb-2 last:mb-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="text-white text-sm font-medium">{player.name}</span>
                    <span className="text-slate-400 text-sm">{voteCount} קולות</span>
                  </div>
                  <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-red-600 rounded-full transition-all duration-700"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <button
            onClick={() => setRevealed(true)}
            className="w-full bg-red-600 hover:bg-red-500 text-white font-black text-xl py-4 rounded-2xl shadow-lg shadow-red-900/30 transition-all active:scale-95"
          >
            חשוף את המרגל!
          </button>
        </div>
      ) : (
        <div className="flex-1 flex flex-col gap-5">
          <div className={`rounded-2xl p-6 border-2 text-center ${
            isImposterCaught
              ? 'bg-green-900/20 border-green-600/40'
              : isTie
              ? 'bg-amber-900/20 border-amber-600/40'
              : 'bg-red-900/20 border-red-600/40'
          }`}>
            <div className="text-5xl mb-3">
              {isImposterCaught ? '🎉' : isTie ? '🤝' : '😈'}
            </div>
            <h2 className={`font-black text-2xl mb-1 ${
              isImposterCaught ? 'text-green-400' : isTie ? 'text-amber-400' : 'text-red-400'
            }`}>
              {isImposterCaught
                ? 'האזרחים ניצחו!'
                : isTie
                ? 'תיקו — אין מנצח'
                : 'המרגל ניצח!'}
            </h2>
            <p className="text-slate-300 text-sm">
              {isImposterCaught
                ? `${mostVotedPlayer?.name} זוהה כמרגל`
                : isTie
                ? 'ההצבעה הסתיימה בתיקו'
                : mostVotedPlayer
                ? `${mostVotedPlayer.name} גורש בטעות`
                : 'המרגל שרד!'}
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
            <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">
              המילה הסודית הייתה
            </p>
            <div className="flex items-center gap-3">
              <span className="text-amber-400 font-black text-3xl">{state.word}</span>
              <span className="text-slate-600 text-sm">({state.category})</span>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
            <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-3">
              {imposters.length === 1 ? 'המרגל היה' : 'המרגלים היו'}
            </p>
            <div className="flex flex-wrap gap-2">
              {imposters.map((p) => (
                <span key={p.id} className="bg-red-900/30 border border-red-700/40 text-red-300 font-bold px-3 py-1.5 rounded-lg text-base">
                  🕵️ {p.name}
                </span>
              ))}
            </div>
          </div>

          {state.roundNumber > 1 && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <Trophy size={15} className="text-amber-400" />
                <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">
                  לוח ניקוד
                </p>
              </div>
              {sortedPlayers.map((player, i) => (
                <div key={player.id} className="flex items-center gap-3 mb-2 last:mb-0">
                  <span className="text-slate-500 text-sm w-4">{i + 1}</span>
                  <span className="flex-1 text-white text-sm font-medium">{player.name}</span>
                  <span className="text-amber-400 font-bold text-sm">{player.score} נק׳</span>
                </div>
              ))}
            </div>
          )}

          <div className="flex gap-3 mt-auto">
            <button
              onClick={onHome}
              className="flex-1 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-bold py-4 rounded-2xl transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              <Home size={18} />
              <span>בית</span>
            </button>
            <button
              onClick={onNextRound}
              className="flex-2 flex-grow-[2] bg-red-600 hover:bg-red-500 text-white font-bold py-4 rounded-2xl shadow-lg shadow-red-900/30 transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              <RefreshCw size={18} />
              <span>סיבוב נוסף</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
