import { useState } from 'react';
import { Eye, EyeOff, ChevronLeft } from 'lucide-react';
import { GameState } from '../types/game';

interface Props {
  state: GameState;
  onContinue: () => void;
}

type RevealState = 'waiting' | 'showing' | 'done';

export default function RoleReveal({ state, onContinue }: Props) {
  const [revealState, setRevealState] = useState<RevealState>('waiting');
  const currentPlayer = state.players[state.currentRevealIndex];
  const isImposter = state.imposterIds.includes(currentPlayer.id);
  const isLastPlayer = state.currentRevealIndex === state.players.length - 1;
  const totalPlayers = state.players.length;

  const handleReveal = () => setRevealState('showing');
  const handleConfirm = () => {
    setRevealState('done');
  };
  const handleNext = () => {
    setRevealState('waiting');
    onContinue();
  };

  if (revealState === 'waiting') {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6" dir="rtl">
        <div className="max-w-sm w-full flex flex-col items-center gap-6 text-center">
          <div className="w-16 h-16 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center">
            <span className="text-3xl">🔒</span>
          </div>

          <div>
            <p className="text-slate-400 text-sm mb-1">
              שחקן {state.currentRevealIndex + 1} מתוך {totalPlayers}
            </p>
            <h2 className="text-white font-black text-3xl">{currentPlayer.name}</h2>
            <p className="text-slate-400 text-base mt-2">
              הכן את הטלפון ולחץ כשאתה לבד
            </p>
          </div>

          <button
            onClick={handleReveal}
            className="w-full bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-slate-600 text-white font-bold text-lg py-4 px-6 rounded-2xl transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            <Eye size={20} />
            <span>הצג את תפקידי</span>
          </button>
        </div>
      </div>
    );
  }

  if (revealState === 'showing') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6" dir="rtl"
        style={{ background: isImposter ? '#0c0a0a' : '#020617' }}
      >
        <div className="max-w-sm w-full flex flex-col items-center gap-6 text-center">
          {isImposter ? (
            <>
              <div className="w-24 h-24 rounded-full bg-red-900/30 border-2 border-red-600/60 flex items-center justify-center shadow-lg shadow-red-900/40">
                <span className="text-5xl">🕵️</span>
              </div>
              <div>
                <p className="text-red-400 text-sm font-bold uppercase tracking-widest mb-1">
                  התפקיד שלך
                </p>
                <h2 className="text-red-500 font-black text-5xl leading-none">מתחזה</h2>
                <p className="text-slate-400 text-sm mt-3 leading-relaxed max-w-xs mx-auto">
                  אינך יודע את המילה הסודית. הקשב לרמזים של האחרים ונסה להבין את המילה — או שתישאר בהסוואה!
                </p>
              </div>
              <div className="bg-red-950/40 border border-red-800/40 rounded-xl px-5 py-3 w-full">
                <p className="text-red-300 text-sm font-medium">
                  אתה יכול לנחש את המילה בכל שלב ולנצח!
                </p>
              </div>
            </>
          ) : (
            <>
              <div className="w-24 h-24 rounded-full bg-slate-800/50 border-2 border-slate-600/50 flex items-center justify-center shadow-lg shadow-slate-900/40">
                <span className="text-5xl">🧑‍🤝‍🧑</span>
              </div>
              <div>
                <p className="text-slate-400 text-sm font-bold uppercase tracking-widest mb-1">
                  המילה הסודית
                </p>
                <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl px-8 py-4 mt-2">
                  <h2 className="text-amber-400 font-black text-5xl leading-none">{state.word}</h2>
                </div>
                <p className="text-slate-500 text-xs mt-2">קטגוריה: {state.category}</p>
              </div>
              <div className="bg-slate-900/60 border border-slate-800 rounded-xl px-5 py-3 w-full">
                <p className="text-slate-400 text-sm leading-relaxed">
                  תן רמזים על המילה אך אל תחשוף אותה. אתר את המרגל!
                </p>
              </div>
            </>
          )}

          <button
            onClick={handleConfirm}
            className="w-full bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-bold text-base py-4 px-6 rounded-2xl transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            <EyeOff size={18} />
            <span>הבנתי — הסתר</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6" dir="rtl">
      <div className="max-w-sm w-full flex flex-col items-center gap-6 text-center">
        <div className="w-16 h-16 rounded-full bg-green-900/30 border border-green-700/40 flex items-center justify-center">
          <span className="text-3xl">✓</span>
        </div>

        <div>
          <h2 className="text-white font-black text-2xl">{currentPlayer.name}</h2>
          <p className="text-green-400 text-sm mt-1">ראית את התפקיד שלך</p>
          <p className="text-slate-400 text-base mt-3">
            {isLastPlayer
              ? 'כולם ראו את תפקידיהם — אפשר להתחיל!'
              : `העבר את הטלפון ל${state.players[state.currentRevealIndex + 1]?.name}`}
          </p>
        </div>

        <button
          onClick={handleNext}
          className="w-full bg-red-600 hover:bg-red-500 text-white font-black text-lg py-4 px-6 rounded-2xl shadow-lg shadow-red-900/30 transition-all active:scale-95 flex items-center justify-center gap-2"
        >
          {isLastPlayer ? (
            <span>מתחילים לשחק!</span>
          ) : (
            <>
              <ChevronLeft size={20} />
              <span>הבא</span>
            </>
          )}
        </button>

        <div className="flex gap-1.5 justify-center">
          {state.players.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all ${
                i <= state.currentRevealIndex
                  ? 'bg-red-500 w-6'
                  : 'bg-slate-700 w-2'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
