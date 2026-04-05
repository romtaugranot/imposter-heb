import { useState, useRef, KeyboardEvent } from 'react';
import { Player } from '../types/game';
import { X, Plus, Play, ArrowRight } from 'lucide-react';

interface Props {
  onStart: (players: Player[], timerEnabled: boolean) => void;
  onBack: () => void;
}

const createPlayer = (name: string): Player => ({
  id: crypto.randomUUID(),
  name: name.trim(),
  score: 0,
});

export default function PlayerSetup({ onStart, onBack }: Props) {
  const [players, setPlayers] = useState<Player[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [timerEnabled, setTimerEnabled] = useState(false);
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const addPlayer = () => {
    const name = inputValue.trim();
    if (!name) return;
    if (players.length >= 10) {
      setError('מקסימום 10 שחקנים');
      return;
    }
    if (players.some((p) => p.name.toLowerCase() === name.toLowerCase())) {
      setError('שם זה כבר קיים');
      return;
    }
    setPlayers((prev) => [...prev, createPlayer(name)]);
    setInputValue('');
    setError('');
    inputRef.current?.focus();
  };

  const removePlayer = (id: string) => {
    setPlayers((prev) => prev.filter((p) => p.id !== id));
    setError('');
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') addPlayer();
  };

  const handleStart = () => {
    if (players.length < 3) {
      setError('נדרשים לפחות 3 שחקנים');
      return;
    }
    onStart(players, timerEnabled);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col p-5" dir="rtl">
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={onBack}
          className="w-9 h-9 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center transition-colors"
        >
          <ArrowRight size={18} className="text-slate-300" />
        </button>
        <h1 className="text-white font-black text-2xl">שחקנים</h1>
      </div>

      <div className="flex gap-2 mb-4">
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value);
            setError('');
          }}
          onKeyDown={handleKeyDown}
          placeholder="שם שחקן..."
          maxLength={20}
          className="flex-1 bg-slate-900 border border-slate-700 focus:border-red-500 text-white placeholder-slate-500 rounded-xl px-4 py-3 text-base outline-none transition-colors text-right"
          dir="rtl"
        />
        <button
          onClick={addPlayer}
          disabled={!inputValue.trim() || players.length >= 10}
          className="bg-red-600 hover:bg-red-500 disabled:bg-slate-800 disabled:text-slate-600 text-white rounded-xl px-4 py-3 flex items-center gap-1.5 font-bold transition-colors active:scale-95"
        >
          <Plus size={20} />
        </button>
      </div>

      {error && (
        <p className="text-red-400 text-sm mb-3 text-right">{error}</p>
      )}

      <div className="flex-1 space-y-2 mb-6">
        {players.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-16 h-16 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center mb-3">
              <span className="text-3xl">👥</span>
            </div>
            <p className="text-slate-500 text-sm">הוסף לפחות 3 שחקנים להתחלה</p>
          </div>
        )}
        {players.map((player, index) => (
          <div
            key={player.id}
            className="flex items-center gap-3 bg-slate-900 border border-slate-800 rounded-xl px-4 py-3"
          >
            <span className="w-7 h-7 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 text-xs font-bold flex-shrink-0">
              {index + 1}
            </span>
            <span className="flex-1 text-white font-medium text-base text-right">
              {player.name}
            </span>
            <button
              onClick={() => removePlayer(player.id)}
              className="w-7 h-7 rounded-full bg-slate-800 hover:bg-red-900/40 hover:border-red-800 border border-transparent flex items-center justify-center transition-colors flex-shrink-0"
            >
              <X size={14} className="text-slate-400 hover:text-red-400" />
            </button>
          </div>
        ))}
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between bg-slate-900 border border-slate-800 rounded-xl px-4 py-3">
          <label className="text-slate-300 text-sm font-medium">טיימר (3 דקות)</label>
          <button
            onClick={() => setTimerEnabled((prev) => !prev)}
            className={`w-12 h-6 rounded-full transition-colors relative ${timerEnabled ? 'bg-red-600' : 'bg-slate-700'}`}
          >
            <span
              className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform ${timerEnabled ? 'translate-x-0.5' : 'translate-x-6'}`}
              style={{ transform: timerEnabled ? 'translateX(1px)' : 'translateX(25px)' }}
            />
          </button>
        </div>

        <div className="flex items-center justify-between px-3">
          <span className="text-slate-500 text-xs">
            {players.length}/10 שחקנים
            {players.length >= 8 && (
              <span className="text-amber-500 mr-1">• 2 מרגלים</span>
            )}
          </span>
          {players.length >= 3 && (
            <span className="text-green-500 text-xs">מוכן להתחיל</span>
          )}
        </div>

        <button
          onClick={handleStart}
          disabled={players.length < 3}
          className="w-full bg-red-600 hover:bg-red-500 disabled:bg-slate-800 disabled:text-slate-600 text-white font-black text-lg py-4 rounded-2xl shadow-lg shadow-red-900/30 transition-all active:scale-95 flex items-center justify-center gap-2"
        >
          <Play size={20} />
          <span>התחל משחק</span>
        </button>
      </div>
    </div>
  );
}
