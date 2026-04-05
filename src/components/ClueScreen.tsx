import { GameState } from '../types/game';
import { ChevronLeft, X } from 'lucide-react';

interface Props {
  state: GameState;
  onContinue: () => void;
  onCancel: () => void;
}

export default function ClueScreen({ state, onContinue, onCancel }: Props) {
  const orderedPlayers = state.clueOrder.map((id) => state.players.find((p) => p.id === id)!);

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col p-5" dir="rtl">
      <div className="flex-1 flex flex-col items-center justify-center gap-6">
        <div className="w-16 h-16 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center">
          <span className="text-3xl">💡</span>
        </div>

        <div className="text-center">
          <h1 className="text-white font-black text-2xl mb-1">סדר הרמזים</h1>
          <p className="text-slate-400 text-sm">כל שחקן נותן רמז אחד על המילה לפי הסדר</p>
        </div>

        <div className="w-full max-w-sm space-y-2">
          {orderedPlayers.map((player, index) => (
            <div
              key={player.id}
              className="flex items-center gap-3 bg-slate-900 border border-slate-800 rounded-xl px-4 py-3"
            >
              <span className="w-7 h-7 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400 text-sm font-bold flex-shrink-0">
                {index + 1}
              </span>
              <span className="text-white text-lg font-semibold">{player.name}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 space-y-3">
        <button
          onClick={onContinue}
          className="w-full bg-red-600 hover:bg-red-500 text-white font-black text-lg py-4 rounded-2xl shadow-lg shadow-red-900/30 transition-all active:scale-95 flex items-center justify-center gap-2"
        >
          <ChevronLeft size={20} />
          <span>עבור להצבעה</span>
        </button>
        <button
          onClick={onCancel}
          className="w-full bg-slate-800 hover:bg-slate-700 border border-slate-800 text-slate-300 font-bold text-sm py-2 rounded-xl transition-all active:scale-95 flex items-center justify-center gap-2"
        >
          <X size={16} />
          <span>בטל סיבוב</span>
        </button>
      </div>
    </div>
  );
}
