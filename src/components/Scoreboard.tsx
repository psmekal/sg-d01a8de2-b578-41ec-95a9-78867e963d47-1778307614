import { CANVAS_MARGIN, computeClockSeconds, fmtClock, patchScoreboard, pausePenalties, penaltyRemaining, useScoreboard, useTick, type Penalty, type Scoreboard, type ScoreboardPosition } from "@/lib/scoreboard";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef } from "react";

function positionStyles(pos: ScoreboardPosition): React.CSSProperties {
  const [v, h] = pos.split("-") as ["top" | "middle" | "bottom", "left" | "center" | "right"];
  const s: React.CSSProperties = { position: "absolute" };
  if (v === "top") s.top = CANVAS_MARGIN;
  else if (v === "bottom") s.bottom = CANVAS_MARGIN;
  else { s.top = "50%"; s.transform = "translateY(-50%)"; }
  if (h === "left") s.left = CANVAS_MARGIN;
  else if (h === "right") s.right = CANVAS_MARGIN;
  else { s.left = "50%"; s.transform = (s.transform ? s.transform + " " : "") + "translateX(-50%)"; }
  return s;
}

function FlipChar({ char }: { char: string }) {
  return (
    <motion.span
      key={char}
      initial={{ rotateX: 90, opacity: 0 }}
      animate={{ rotateX: 0, opacity: 1 }}
      exit={{ rotateX: -90, opacity: 0 }}
      transition={{ duration: 0.3 }}
      style={{ display: "inline-block" }}
    >
      {char}
    </motion.span>
  );
}

function FlipText({ value, className, style }: { value: string | number; className?: string; style?: React.CSSProperties }) {
  const str = String(value);
  return (
    <span className={className} style={style}>
      {str.split("").map((c, i) => (
        <AnimatePresence key={i} mode="wait">
          <FlipChar char={c} />
        </AnimatePresence>
      ))}
    </span>
  );
}

function PulseChar({ char }: { char: string }) {
  return (
    <motion.span
      key={char}
      initial={{ scale: 1.3, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.2 }}
      style={{ display: "inline-block" }}
    >
      {char}
    </motion.span>
  );
}

function PulseText({ value, className, style }: { value: string | number; className?: string; style?: React.CSSProperties }) {
  const str = String(value);
  return (
    <span className={className} style={style}>
      {str.split("").map((c, i) => (
        <AnimatePresence key={i} mode="wait">
          <PulseChar char={c} />
        </AnimatePresence>
      ))}
    </span>
  );
}

function PenaltyChip({ p, clockRunning }: { p: Penalty; clockRunning: boolean }) {
  return (
    <div className="flex items-center gap-2 rounded bg-black/60 px-2 py-1 text-sm font-mono text-white backdrop-blur-sm">
      {p.player ? <span>#{p.player}</span> : null}
      <span className="font-semibold tabular-nums">{fmtClock(penaltyRemaining(p, clockRunning))}</span>
    </div>
  );
}

/** A team panel: solid team colour with a vertical highlight gradient (top→middle→bottom). */
function TeamPanel({
  name,
  color,
  textColor,
  logo,
  align,
  timeouts,
}: {
  name: string;
  color: string;
  textColor: string;
  logo: string | null;
  align: "left" | "right";
  timeouts: number;
}) {
  const isRight = align === "right";
  const bg = `linear-gradient(180deg, color-mix(in oklab, ${color} 70%, #000) 0%, ${color} 25%, ${color} 75%, color-mix(in oklab, ${color} 70%, #000) 100%)`;
  return (
    <div
      className="flex items-center gap-3 px-6 py-4"
      style={{
        background: bg,
        color: textColor,
        flexDirection: isRight ? "row-reverse" : "row",
      }}
    >
      {logo ? (
        <img src={logo} alt={name} className="h-16 w-16 object-contain" />
      ) : null}
      <div className={`flex flex-1 flex-col ${isRight ? "items-end" : "items-start"}`}>
        <div className="text-3xl font-bold uppercase tracking-wide">{name}</div>
        <div className="mt-1 flex gap-1">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="h-3 w-3 rounded-full"
              style={{
                background: i < timeouts ? textColor : "rgba(0,0,0,0.3)",
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

/** Penalty row rendered below the strip. */
function PenaltyRow({ penalties, align, clockRunning }: { penalties: Penalty[]; align: "left" | "right"; clockRunning: boolean }) {
  return (
    <div className={`flex gap-2 ${align === "right" ? "justify-end" : "justify-start"}`}>
      {penalties.map((p) => (
        <PenaltyChip key={p.id} p={p} clockRunning={clockRunning} />
      ))}
    </div>
  );
}

/** Score box (separate, on dark center). */
function ScoreBox({ score }: { score: number }) {
  return <FlipText value={score} className="text-6xl font-bold tabular-nums text-white" />;
}

/** Auto-clear penalties that have reached 0 (only when clock is running, otherwise they stay paused at 0). */
function useAutoClearPenalties(data: Scoreboard | null) {
  const lockRef = useRef(false);
  useEffect(() => {
    if (!data || lockRef.current) return;
    const home = data.home_penalties.filter((p) => penaltyRemaining(p, data.clock_running) > 0);
    const away = data.away_penalties.filter((p) => penaltyRemaining(p, data.clock_running) > 0);
    if (home.length !== data.home_penalties.length || away.length !== data.away_penalties.length) {
      lockRef.current = true;
      patchScoreboard({ home_penalties: home, away_penalties: away })
        .catch(console.error)
        .finally(() => {
          setTimeout(() => (lockRef.current = false), 400);
        });
    }
  });
}

function useAutoCapClock(data: Scoreboard | null) {
  const lockRef = useRef(false);
  useEffect(() => {
    if (!data || lockRef.current) return;
    if (!data.clock_running || data.clock_mode !== "up") return;
    const sec = computeClockSeconds(data);
    if (sec >= data.period_length_sec) {
      lockRef.current = true;
      patchScoreboard({
        clock_running: false,
        clock_anchor: null,
        clock_base_sec: data.period_length_sec,
        home_penalties: pausePenalties(data.home_penalties),
        away_penalties: pausePenalties(data.away_penalties),
      })
        .catch(console.error)
        .finally(() => setTimeout(() => (lockRef.current = false), 400));
    }
  });
}

export default function ScoreboardOverlay() {
  const data = useScoreboard();
  useTick(250);
  useAutoClearPenalties(data);
  useAutoCapClock(data);
  
  if (!data) return null;
  const seconds = computeClockSeconds(data);
  const periodLabel = `P${data.period}`;

  return (
    <div className="relative h-screen w-screen overflow-hidden" style={positionStyles(data.position)}>
      {data.visible && (
        <div className="relative inline-block">
          {(() => {
            const penaltyRow = (
              <div className="mt-2 flex justify-between gap-4">
                <PenaltyRow penalties={data.home_penalties} align="left" clockRunning={data.clock_running} />
                <PenaltyRow penalties={data.away_penalties} align="right" clockRunning={data.clock_running} />
              </div>
            );

            const strip = (
              <div className="flex overflow-hidden rounded-lg shadow-2xl">
                <TeamPanel
                  name={data.home_name}
                  color={data.home_color}
                  textColor={data.home_text_color}
                  logo={data.home_logo}
                  align="left"
                  timeouts={data.home_timeouts.length}
                />
                <div className="flex items-center gap-6 bg-zinc-900 px-8">
                  <ScoreBox score={data.home_score} />
                  <div className="flex flex-col items-center gap-1">
                    <PulseText value={fmtClock(seconds)} className="text-4xl font-mono font-bold tabular-nums text-white" />
                    <div className="text-sm font-mono uppercase tracking-widest text-zinc-400">{periodLabel}</div>
                  </div>
                  <ScoreBox score={data.away_score} />
                </div>
                <TeamPanel
                  name={data.away_name}
                  color={data.away_color}
                  textColor={data.away_text_color}
                  logo={data.away_logo}
                  align="right"
                  timeouts={data.away_timeouts.length}
                />
              </div>
            );

            return (<>{strip}{penaltyRow}</>);
          })()}
        </div>
      )}
    </div>
  );
}