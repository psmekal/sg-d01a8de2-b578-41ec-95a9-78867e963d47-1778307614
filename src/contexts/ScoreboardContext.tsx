import { createContext, useContext, useState, ReactNode } from "react";

export interface ScoreboardState {
  teamA: string;
  teamB: string;
  scoreA: number;
  scoreB: number;
  period: number;
  timeRemaining: string;
}

interface ScoreboardContextType {
  scoreboard: ScoreboardState;
  updateScoreboard: (updates: Partial<ScoreboardState>) => void;
  incrementScore: (team: "A" | "B", amount: number) => void;
  resetScoreboard: () => void;
}

const ScoreboardContext = createContext<ScoreboardContextType | undefined>(undefined);

const DEFAULT_SCOREBOARD: ScoreboardState = {
  teamA: "Domáci",
  teamB: "Hostia",
  scoreA: 0,
  scoreB: 0,
  period: 1,
  timeRemaining: "30:00",
};

export function ScoreboardProvider({ children }: { children: ReactNode }) {
  const [scoreboard, setScoreboard] = useState<ScoreboardState>(DEFAULT_SCOREBOARD);

  const updateScoreboard = (updates: Partial<ScoreboardState>) => {
    setScoreboard((prev) => ({ ...prev, ...updates }));
  };

  const incrementScore = (team: "A" | "B", amount: number) => {
    setScoreboard((prev) => ({
      ...prev,
      [`score${team}`]: Math.max(0, prev[`score${team}`] + amount),
    }));
  };

  const resetScoreboard = () => {
    setScoreboard(DEFAULT_SCOREBOARD);
  };

  return (
    <ScoreboardContext.Provider value={{ scoreboard, updateScoreboard, incrementScore, resetScoreboard }}>
      {children}
    </ScoreboardContext.Provider>
  );
}

export function useScoreboard() {
  const context = useContext(ScoreboardContext);
  if (!context) {
    throw new Error("useScoreboard must be used within ScoreboardProvider");
  }
  return context;
}