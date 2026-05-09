"use client";
import { motion, AnimatePresence } from "framer-motion";
import { CANVAS_MARGIN, computeClockSeconds, fmtClock, pausePenalties, penaltyRemaining, useScoreboard, useTick } from "@/lib/scoreboard";
import type { Penalty } from "@/lib/scoreboard";

interface ScoreboardOverlayProps {
  venueId?: string;
}

export default function ScoreboardOverlay({ venueId }: ScoreboardOverlayProps) {
  const s = useScoreboard(venueId);
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

  // Split clock into individual characters for granular animation
  const clockChars = clockStr.split("");

  return (
    <div 
      className={`absolute ${positionStyles[s.position]}`}
      style={{ margin: CANVAS_MARGIN }}
    >
      <div className="relative">
        {/* Top Border */}
        <div className="absolute -top-1 left-0 right-0 h-1 bg-white/90" />
        
        <div className="flex items-stretch gap-0 shadow-2xl font-heading">
          {/* Home Team Panel - Fixed Width, Reduced Height */}
          <div
            className="relative flex items-center justify-between px-5 py-1.5 w-80 overflow-hidden"
            style={{ 
              background: `linear-gradient(135deg, ${s.home_color} 0%, ${s.home_color}dd 100%)`,
              color: s.home_text_color,
            }}
          >
            <div className="flex items-center gap-3 min-w-0 flex-1">
              {s.home_logo && (
                <div className="w-10 h-10 flex-shrink-0 bg-white/20 rounded-lg p-1 backdrop-blur-sm">
                  <img 
                    src={s.home_logo} 
                    alt={s.home_name}
                    className="w-full h-full object-contain"
                  />
                </div>
              )}
              <div className="min-w-0 flex-1">
                <p className="text-xl font-bold tracking-tight truncate">
                  {s.home_name}
                </p>
              </div>
            </div>
            <motion.div
              key={s.home_score}
              initial={{ y: -30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="text-5xl font-bold tabular-nums ml-3 flex-shrink-0"
            >
              {s.home_score}
            </motion.div>
          </div>

          {/* Clock Panel - Reduced Height */}
          <div className="flex flex-col items-center justify-center bg-black/90 px-6 py-1.5 min-w-[180px]">
            <p className="text-xs font-mono text-white/70 uppercase tracking-widest mb-0.5">
              Perioda {s.period}
            </p>
            <div className="flex text-4xl font-bold font-mono text-white tabular-nums">
              {clockChars.map((char, idx) => (
                <motion.span
                  key={`${idx}-${char}`}
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  className="inline-block"
                >
                  {char}
                </motion.span>
              ))}
            </div>
          </div>

          {/* Away Team Panel - Fixed Width, Reduced Height */}
          <div
            className="relative flex items-center justify-between px-5 py-1.5 w-80 overflow-hidden"
            style={{
              background: `linear-gradient(135deg, ${s.away_color} 0%, ${s.away_color}dd 100%)`,
              color: s.away_text_color,
            }}
          >
            <motion.div
              key={s.away_score}
              initial={{ y: -30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="text-5xl font-bold tabular-nums mr-3 flex-shrink-0"
            >
              {s.away_score}
            </motion.div>
            <div className="flex items-center gap-3 min-w-0 flex-1 justify-end">
              <div className="min-w-0 flex-1 text-right">
                <p className="text-xl font-bold tracking-tight truncate">
                  {s.away_name}
                </p>
              </div>
              {s.away_logo && (
                <div className="w-10 h-10 flex-shrink-0 bg-white/20 rounded-lg p-1 backdrop-blur-sm">
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

        {/* Penalties Display - More space with reduced panel height */}
        {(s.home_penalties.length > 0 || s.away_penalties.length > 0) && (
          <div className="absolute top-[calc(100%+0.5rem)] left-0 right-0 flex justify-between px-4">
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