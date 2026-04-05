import { useState, useEffect, useCallback } from 'react';
import { GameState } from '../types/game';
import { Clock, Users, AlertCircle, ChevronRight, X } from 'lucide-react';

interface Props {
  state: GameState;
  onVote: () => void;
  onCancel: () => void;
}

const TIMER_SECONDS = 3 * 60;

export default function GamePlay({ state, onVote }: Props) {
  const [timeLeft, setTimeLeft] = useState(TIMER_SECONDS);
  const [timerActive, setTimerActive] = useState(state.timerEnabled);
  const [showTip, setShowTip] = useState(0);

  const tips = [
    'תנו רמזים על המילה בלי לאמר אותה ישירות',
    'שימו לב למי שנותן רמזים מעורפלים מדי',
    'המרגל מנסה לנחש את המילה מהרמזים שלכם',
    'אל תחשפו את המילה — המרגל יכול לנחש ולנצח',
    'שאלו שאלות שיקשו על המרגל להסתתר',
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setShowTip((prev) => (prev + 1) % tips.length);
    }, 8000);
    return () => clearInterval(interval);
  }, [tips.length]);

  useEffect(() => {
    if (!timerActive) return;
    if (timeLeft <= 0) {
      setTimerActive(false);
      return;
    }
    const interval = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timerActive, timeLeft]);

  const formatTime = useCallback((seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  }, []);

  const timerPercent = (timeLeft / TIMER_SECONDS) * 100;
  const timerColor =
    timeLeft > 60 ? 'text-white' : timeLeft > 30 ? 'text-amber-400' : 'text-red-400';
  const ringColor =
    timeLeft > 60 ? '#ef4444' : timeLeft > 30 ? '#f59e0b' : '#ef4444';
  const isTimerUrgent = timeLeft <= 30 && timerActive;

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col p-5" dir="rtl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-white font-black text-xl">סיבוב {state.roundNumber}</h1>
        <div className="flex items-center gap-1.5 text-slate-400 text-sm">
          <Users size={15} />
          <span>{state.players.length} שחקנים</span>
        </div>
      </div>

      {state.timerEnabled && (
        <div className="flex flex-col items-center mb-8">
          <div className="relative w-40 h-40">
            <svg className="w-40 h-40 -rotate-90" viewBox="0 0 140 140">
              <circle
                cx="70" cy="70" r="60"
                fill="none"
                stroke="#1e293b"
                strokeWidth="8"
              />
              <circle
                cx="70" cy="70" r="60"
                fill="none"
                stroke={ringColor}
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 60}`}
                strokeDashoffset={`${2 * Math.PI * 60 * (1 - timerPercent / 100)}`}
                style={{ transition: 'stroke-dashoffset 1s linear, stroke 0.5s' }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className={`font-black text-4xl tabular-nums leading-none ${timerColor} ${isTimerUrgent ? 'animate-pulse' : ''}`}>
                {formatTime(timeLeft)}
              </span>
              <span className="text-slate-500 text-xs mt-1">נשאר</span>
            </div>
          </div>

          <button
            onClick={() => setTimerActive((prev) => !prev)}
            className="mt-3 flex items-center gap-1.5 text-slate-500 hover:text-slate-300 text-sm transition-colors"
          >
            <Clock size={14} />
            <span>{timerActive ? 'עצור טיימר' : 'המשך טיימר'}</span>
          </button>
        </div>
      )}

      {timeLeft === 0 && (
        <div className="bg-amber-900/30 border border-amber-700/40 rounded-xl px-4 py-3 mb-5 flex items-center gap-2" dir="rtl">
          <AlertCircle size={18} className="text-amber-400 flex-shrink-0" />
          <p className="text-amber-300 text-sm font-medium">הזמן נגמר! הגיע הזמן להצביע</p>
        </div>
      )}

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 mb-5">
        <h2 className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-3">שחקנים</h2>
        <div className="grid grid-cols-2 gap-2">
          {state.players.map((player, index) => (
            <div
              key={player.id}
              className="flex items-center gap-2 bg-slate-800/60 rounded-lg px-3 py-2"
            >
              <span className="w-5 h-5 rounded-full bg-slate-700 flex items-center justify-center text-slate-400 text-xs font-bold flex-shrink-0">
                {index + 1}
              </span>
              <span className="text-white text-sm font-medium truncate">{player.name}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 mb-6 min-h-[64px] flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center flex-shrink-0">
          <span className="text-base">💡</span>
        </div>
        <p className="text-slate-400 text-sm leading-relaxed" key={showTip}>
          {tips[showTip]}
        </p>
      </div>

      <div className="mt-auto space-y-3">
        <button
          onClick={onVote}
          className="w-full bg-red-600 hover:bg-red-500 text-white font-black text-lg py-4 rounded-2xl shadow-lg shadow-red-900/30 transition-all active:scale-95 flex items-center justify-center gap-2"
        >
          <ChevronRight size={20} />
          <span>עבור להצבעה</span>
        </button>
        <button
          onClick={onCancel}
          className="w-full bg-slate-800 hover:bg-slate-700 border border-slate-800 text-slate-300 font-bold text-sm py-2 rounded-xl transition-all active:scale-95 flex items-center justify-center gap-2"
        >
          <X size={16} />
          <span>בטל סיבוב</span>
        </button>
        <p className="text-slate-600 text-xs text-center">
          לחצו כשכולם מוכנים להצביע
        </p>
      </div>
    </div>
  );
}
