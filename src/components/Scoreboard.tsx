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
        {/* Top Border - Golden Gradient */}
        <div className="absolute -top-[2px] left-0 right-0 h-[2px]" style={{ background: "linear-gradient(90deg, rgba(255,215,0,0) 0%, rgba(255,215,0,0.95) 20%, rgba(255,215,0,0.95) 80%, rgba(255,215,0,0) 100%)" }} />
        
        <div className="flex items-stretch gap-0 shadow-2xl font-heading">
          {/* Home Team Panel - Vertical Gradient, Much Smaller Height */}
          <div
            className="relative flex items-center justify-between px-3 py-1 w-80 overflow-hidden"
            style={{ 
              background: `linear-gradient(to bottom, ${s.home_color} 0%, ${s.home_color}dd 50%, ${s.home_color}aa 100%)`,
              color: s.home_text_color,
            }}
          >
            <div className="flex items-center gap-2.5 min-w-0 flex-1">
              {s.home_logo && (
                <div className="w-8 h-8 flex-shrink-0 bg-white/20 rounded p-0.5 backdrop-blur-sm">
                  <img 
                    src={s.home_logo} 
                    alt={s.home_name}
                    className="w-full h-full object-contain"
                  />
                </div>
              )}
              <div className="min-w-0 flex-1">
                <p className="text-base font-bold tracking-tight truncate leading-none">
                  {s.home_name}
                </p>
              </div>
            </div>
            <motion.div
              key={s.home_score}
              initial={{ y: -40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ type: "spring", stiffness: 350, damping: 20 }}
              className="text-3xl font-bold tabular-nums ml-2 flex-shrink-0 leading-none"
            >
              {s.home_score}
            </motion.div>
          </div>

          {/* Clock Panel - Vertical Gradient, Smaller */}
          <div className="flex flex-col items-center justify-center px-4 py-1 min-w-[140px]" style={{ background: "linear-gradient(to bottom, #000000 0%, #0a0a0a 50%, #000000 100%)" }}>
            <p className="text-[9px] font-mono text-white/60 uppercase tracking-widest leading-none mb-0.5">
              Perioda {s.period}
            </p>
            <div className="flex text-2xl font-bold font-mono text-white tabular-nums leading-none">
              {clockChars.map((char, idx) => (
                <motion.span
                  key={`${idx}-${char}`}
                  initial={{ y: -25, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 500, damping: 25 }}
                  className="inline-block"
                >
                  {char}
                </motion.span>
              ))}
            </div>
          </div>

          {/* Away Team Panel - Vertical Gradient, Much Smaller Height */}
          <div
            className="relative flex items-center justify-between px-3 py-1 w-80 overflow-hidden"
            style={{
              background: `linear-gradient(to bottom, ${s.away_color} 0%, ${s.away_color}dd 50%, ${s.away_color}aa 100%)`,
              color: s.away_text_color,
            }}
          >
            <motion.div
              key={s.away_score}
              initial={{ y: -40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ type: "spring", stiffness: 350, damping: 20 }}
              className="text-3xl font-bold tabular-nums mr-2 flex-shrink-0 leading-none"
            >
              {s.away_score}
            </motion.div>
            <div className="flex items-center gap-2.5 min-w-0 flex-1 justify-end">
              <div className="min-w-0 flex-1 text-right">
                <p className="text-base font-bold tracking-tight truncate leading-none">
                  {s.away_name}
                </p>
              </div>
              {s.away_logo && (
                <div className="w-8 h-8 flex-shrink-0 bg-white/20 rounded p-0.5 backdrop-blur-sm">
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

        {/* Bottom Border - Golden Gradient */}
        <div className="absolute -bottom-[2px] left-0 right-0 h-[2px]" style={{ background: "linear-gradient(90deg, rgba(255,215,0,0) 0%, rgba(255,215,0,0.95) 20%, rgba(255,215,0,0.95) 80%, rgba(255,215,0,0) 100%)" }} />

        {/* Penalties Display - More space below for visibility */}
        {(s.home_penalties.length > 0 || s.away_penalties.length > 0) && (
          <div className="absolute top-full mt-4 left-0 right-0 flex justify-between px-4">
            {/* Home Penalties */}
            <div className="flex gap-2">
              <AnimatePresence>
                {s.home_penalties.map((p) => (
                  <motion.div
                    key={p.id}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    className="w-11 h-11 rounded-lg flex items-center justify-center font-bold text-white text-lg bg-red-600/95 backdrop-blur-sm shadow-xl border border-white/20"
                  >
                    {Math.ceil(penaltyRemaining(p, s.clock_running) / 60)}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Away Penalties */}
            <div className="flex gap-2">
              <AnimatePresence>
                {s.away_penalties.map((p) => (
                  <motion.div
                    key={p.id}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    className="w-11 h-11 rounded-lg flex items-center justify-center font-bold text-white text-lg bg-red-600/95 backdrop-blur-sm shadow-xl border border-white/20"
                  >
                    {Math.ceil(penaltyRemaining(p, s.clock_running) / 60)}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}