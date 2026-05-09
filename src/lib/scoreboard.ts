// Adapted from handball-scoreboard-live with venue support
export type Penalty = {
  id: string;
  player: string;
  duration: number;
  base_sec?: number;
  anchor?: string | null;
  startedAt: string;
};

export type Timeout = { id: string; takenAt: string };

export type ScoreboardPosition =
  | "top-left" | "top-center" | "top-right"
  | "middle-left" | "middle-center" | "middle-right"
  | "bottom-left" | "bottom-center" | "bottom-right";

export type Scoreboard = {
  id: string;
  venue_id: string;
  home_name: string;
  home_short: string;
  home_color: string;
  home_score: number;
  away_name: string;
  away_short: string;
  away_color: string;
  away_score: number;
  home_text_color: string;
  away_text_color: string;
  period: number;
  period_length_sec: number;
  clock_mode: "up" | "down";
  clock_running: boolean;
  clock_base_sec: number;
  clock_anchor: string | null;
  visible: boolean;
  position: ScoreboardPosition;
  home_timeouts: Timeout[];
  away_timeouts: Timeout[];
  home_penalties: Penalty[];
  away_penalties: Penalty[];
  updated_at: string;
};

const STORAGE_KEY = "tournament_scoreboards";

function getScoreboards(): Record<string, Scoreboard> {
  if (typeof window === "undefined") return {};
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : {};
}

function saveScoreboards(boards: Record<string, Scoreboard>) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(boards));
}

export function getScoreboardByVenue(venueId: string): Scoreboard {
  const boards = getScoreboards();
  if (!boards[venueId]) {
    boards[venueId] = createDefaultScoreboard(venueId);
    saveScoreboards(boards);
  }
  return boards[venueId];
}

export function updateScoreboard(venueId: string, updates: Partial<Scoreboard>) {
  const boards = getScoreboards();
  boards[venueId] = {
    ...boards[venueId],
    ...updates,
    updated_at: new Date().toISOString(),
  };
  saveScoreboards(boards);
  window.dispatchEvent(new CustomEvent("scoreboard-update", { detail: { venueId, data: boards[venueId] } }));
}

function createDefaultScoreboard(venueId: string): Scoreboard {
  return {
    id: venueId,
    venue_id: venueId,
    home_name: "Home Team",
    home_short: "HOME",
    home_color: "#1e40af",
    home_score: 0,
    away_name: "Away Team",
    away_short: "AWAY",
    away_color: "#dc2626",
    away_score: 0,
    home_text_color: "#ffffff",
    away_text_color: "#ffffff",
    period: 1,
    period_length_sec: 1800,
    clock_mode: "down",
    clock_running: false,
    clock_base_sec: 1800,
    clock_anchor: null,
    visible: true,
    position: "top-center",
    home_timeouts: [],
    away_timeouts: [],
    home_penalties: [],
    away_penalties: [],
    updated_at: new Date().toISOString(),
  };
}

export function computeClockSeconds(s: Scoreboard, now = Date.now()): number {
  if (!s.clock_running || !s.clock_anchor) {
    if (s.clock_mode === "up") return Math.min(s.period_length_sec, Math.max(0, s.clock_base_sec));
    return Math.max(0, s.clock_base_sec);
  }
  const elapsed = (now - new Date(s.clock_anchor).getTime()) / 1000;
  if (s.clock_mode === "up") {
    return Math.min(s.period_length_sec, s.clock_base_sec + elapsed);
  }
  return Math.max(0, s.clock_base_sec - elapsed);
}

export function pausePenalties(list: Penalty[], now = Date.now()): Penalty[] {
  return list.map((p) => {
    if (typeof p.base_sec !== "number") {
      const elapsed = (now - new Date(p.startedAt).getTime()) / 1000;
      return { ...p, base_sec: Math.min(p.duration, elapsed), anchor: null };
    }
    if (!p.anchor) return p;
    const add = (now - new Date(p.anchor).getTime()) / 1000;
    return { ...p, base_sec: Math.min(p.duration, p.base_sec + add), anchor: null };
  });
}

export function resumePenalties(list: Penalty[], now = Date.now()): Penalty[] {
  return list.map((p) => {
    if (typeof p.base_sec !== "number") {
      const elapsed = (now - new Date(p.startedAt).getTime()) / 1000;
      return { ...p, base_sec: Math.min(p.duration, elapsed), anchor: new Date(now).toISOString() };
    }
    return { ...p, anchor: new Date(now).toISOString() };
  });
}

export function fmtClock(totalSec: number): string {
  const t = Math.max(0, Math.floor(totalSec));
  const m = Math.floor(t / 60);
  const s = t % 60;
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}