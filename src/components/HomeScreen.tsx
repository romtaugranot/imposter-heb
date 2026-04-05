interface Props {
  onStart: () => void;
}

export default function HomeScreen({ onStart }: Props) {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-red-950/30 via-slate-950 to-slate-950" />
      <div className="absolute top-0 left-0 w-full h-full opacity-5">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-px bg-slate-400"
            style={{
              left: `${(i / 20) * 100}%`,
              height: '100%',
            }}
          />
        ))}
      </div>

      <div className="relative z-10 flex flex-col items-center gap-8 max-w-sm w-full text-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-20 h-20 rounded-full bg-red-600/20 border-2 border-red-500/40 flex items-center justify-center shadow-lg shadow-red-900/30">
            <span className="text-4xl select-none">🕵️</span>
          </div>
          <div>
            <h1 className="text-5xl font-black text-white tracking-tight leading-none">
              מתחזה
            </h1>
            <p className="text-red-400 text-lg font-semibold mt-1 tracking-widest uppercase text-sm">
              Imposter Game
            </p>
          </div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 text-right w-full" dir="rtl">
          <h2 className="text-white font-bold text-base mb-3">איך משחקים?</h2>
          <ul className="text-slate-400 text-sm space-y-2 list-none">
            <li className="flex items-start gap-2">
              <span className="text-red-400 font-bold mt-0.5">•</span>
              <span>כל שחקן רואה מילה סודית בסבב פרטי</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-400 font-bold mt-0.5">•</span>
              <span>אחד מהשחקנים הוא המרגל — הוא לא יודע את המילה</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-400 font-bold mt-0.5">•</span>
              <span>תנו רמזים על המילה מבלי לחשוף אותה</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-400 font-bold mt-0.5">•</span>
              <span>הצביעו נגד מי שנראה כמרגל</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-400 font-bold mt-0.5">•</span>
              <span>המרגל יכול לנחש את המילה ולנצח!</span>
            </li>
          </ul>
        </div>

        <button
          onClick={onStart}
          className="w-full bg-red-600 hover:bg-red-500 active:bg-red-700 text-white font-black text-xl py-4 px-8 rounded-2xl shadow-lg shadow-red-900/40 transition-all duration-150 active:scale-95"
        >
          התחל משחק
        </button>

        <p className="text-slate-600 text-xs" dir="rtl">
          3–10 שחקנים • מילים בעברית בלבד
        </p>
      </div>
    </div>
  );
}
