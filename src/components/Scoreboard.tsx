"use client";
import { motion, AnimatePresence } from "framer-motion";
import { CANVAS_MARGIN, computeClockSeconds, fmtClock, patchScoreboard, pausePenalties, penaltyRemaining, useScoreboard, useTick } from "@/lib/scoreboard";
import type { Penalty } from "@/lib/scoreboard";

export default function ScoreboardOverlay() {
  const s = useScoreboard();
  useTick(100);

  if (!s) return null;
  if (!s.visible) return null;

  const clockSec = computeClockSeconds(s);
  const clockStr = fmtClock(clockSec);

  const positionStyles: Record<typeof s.position, string> = {
    "top-left": "top-0 left-0",
    "top-center": "top-0 left-1/2 -translate-x-1/2",
    "top-right": "top-0 right-0",
    "middle-left": "top-1/2 -translate-y-1/2 left-0",
    "middle-center": "top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2",
    "middle-right": "top-1/2 -translate-y-1/2 right-0",
    "bottom-left": "bottom-0 left-0",
    "bottom-center": "bottom-0 left-1/2 -translate-x-1/2",
    "bottom-right": "bottom-0 right-0",
  };

  return (
    <div 
      className={`absolute ${positionStyles[s.position]}`}
      style={{ margin: CANVAS_MARGIN }}
    >
      <div className="relative">
        {/* Top Border */}
        <div className="absolute -top-1 left-0 right-0 h-1 bg-white/90" />
        
        <div className="flex items-stretch gap-0 shadow-2xl font-heading">
          {/* Home Team Panel - Fixed Width */}
          <div
            className="relative flex items-center justify-between px-6 py-3 w-80"
            style={{ 
              backgroundColor: s.home_color,
              color: s.home_text_color,
            }}
          >
            <div className="flex items-center gap-4 min-w-0 flex-1">
              {s.home_logo && (
                <div className="w-12 h-12 flex-shrink-0 bg-white/20 rounded-lg p-1 backdrop-blur-sm">
                  <img 
                    src={s.home_logo} 
                    alt={s.home_name}
                    className="w-full h-full object-contain"
                  />
                </div>
              )}
              <div className="min-w-0 flex-1">
                <p className="text-2xl font-bold tracking-tight truncate">
                  {s.home_short}
                </p>
              </div>
            </div>
            <motion.div
              key={s.home_score}
              initial={{ scale: 1.3, opacity: 0.5 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-6xl font-bold tabular-nums ml-4 flex-shrink-0"
            >
              {s.home_score}
            </motion.div>
          </div>

          {/* Clock Panel */}
          <div className="flex flex-col items-center justify-center bg-black/90 px-8 py-3 min-w-[200px]">
            <p className="text-sm font-mono text-white/70 uppercase tracking-widest mb-1">
              Perioda {s.period}
            </p>
            <motion.p
              key={clockStr}
              initial={{ scale: 1.1 }}
              animate={{ scale: 1 }}
              className="text-5xl font-bold font-mono text-white tabular-nums"
            >
              {clockStr}
            </motion.p>
          </div>

          {/* Away Team Panel - Fixed Width */}
          <div
            className="relative flex items-center justify-between px-6 py-3 w-80"
            style={{
              backgroundColor: s.away_color,
              color: s.away_text_color,
            }}
          >
            <motion.div
              key={s.away_score}
              initial={{ scale: 1.3, opacity: 0.5 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-6xl font-bold tabular-nums mr-4 flex-shrink-0"
            >
              {s.away_score}
            </motion.div>
            <div className="flex items-center gap-4 min-w-0 flex-1 justify-end">
              <div className="min-w-0 flex-1 text-right">
                <p className="text-2xl font-bold tracking-tight truncate">
                  {s.away_short}
                </p>
              </div>
              {s.away_logo && (
                <div className="w-12 h-12 flex-shrink-0 bg-white/20 rounded-lg p-1 backdrop-blur-sm">
                  <img 
                    src={s.away_logo} 
                    alt={s.away_name}
                    className="w-full h-full object-contain"
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Border */}
        <div className="absolute -bottom-1 left-0 right-0 h-1 bg-white/90" />

        {/* Penalties Display */}
        {(s.home_penalties.length > 0 || s.away_penalties.length > 0) && (
          <div className="absolute -bottom-16 left-0 right-0 flex justify-between px-4">
            {/* Home Penalties */}
            {(() => {
              const strip = s.home_penalties.length > 0 ? (
                <div className="flex gap-2">
                  <AnimatePresence>
                    {s.home_penalties.map((p) => (
                      <motion.div
                        key={p.id}
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        className="w-12 h-12 rounded-lg flex items-center justify-center font-bold text-white bg-red-600/90 backdrop-blur-sm shadow-lg"
                      >
                        {Math.ceil(penaltyRemaining(p, s.clock_running) / 60)}
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              ) : null;
              const penaltyRow = null;
              return (<>{strip}{penaltyRow}</>);
            })()}

            {/* Away Penalties */}
            {(() => {
              const strip = s.away_penalties.length > 0 ? (
                <div className="flex gap-2">
                  <AnimatePresence>
                    {s.away_penalties.map((p) => (
                      <motion.div
                        key={p.id}
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        className="w-12 h-12 rounded-lg flex items-center justify-center font-bold text-white bg-red-600/90 backdrop-blur-sm shadow-lg"
                      >
                        {Math.ceil(penaltyRemaining(p, s.clock_running) / 60)}
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              ) : null;
              const penaltyRow = null;
              return (<>{strip}{penaltyRow}</>);
            })()}
          </div>
        )}
      </div>
    </div>
  );
}