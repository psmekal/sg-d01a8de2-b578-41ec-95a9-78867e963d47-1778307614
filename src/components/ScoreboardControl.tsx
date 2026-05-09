import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Plus, Minus } from "lucide-react";

interface ScoreboardState {
  teamA: string;
  teamB: string;
  scoreA: number;
  scoreB: number;
  period: number;
}

interface ScoreboardControlProps {
  onScoreChange?: (score: ScoreboardState) => void;
}

export function ScoreboardControl({ onScoreChange }: ScoreboardControlProps) {
  const [score, setScore] = useState<ScoreboardState>({
    teamA: "Tím A",
    teamB: "Tím B",
    scoreA: 0,
    scoreB: 0,
    period: 1,
  });

  const updateScore = (updates: Partial<ScoreboardState>) => {
    const newScore = { ...score, ...updates };
    setScore(newScore);
    onScoreChange?.(newScore);
  };

  return (
    <Card className="p-4 space-y-4 bg-muted/50">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-mono uppercase tracking-wider text-muted-foreground">
          Scoreboard Control
        </h3>
        <Badge variant="outline" className="font-mono text-xs">
          Period {score.period}
        </Badge>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="teamA" className="text-xs text-muted-foreground">Team A</Label>
          <Input
            id="teamA"
            value={score.teamA}
            onChange={(e) => updateScore({ teamA: e.target.value })}
            className="bg-background font-semibold"
          />
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => updateScore({ scoreA: Math.max(0, score.scoreA - 1) })}
              className="flex-1"
            >
              <Minus className="w-4 h-4" />
            </Button>
            <div className="flex-1 text-center">
              <span className="text-3xl font-bold font-mono tabular-nums">{score.scoreA}</span>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={() => updateScore({ scoreA: score.scoreA + 1 })}
              className="flex-1"
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="teamB" className="text-xs text-muted-foreground">Team B</Label>
          <Input
            id="teamB"
            value={score.teamB}
            onChange={(e) => updateScore({ teamB: e.target.value })}
            className="bg-background font-semibold"
          />
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => updateScore({ scoreB: Math.max(0, score.scoreB - 1) })}
              className="flex-1"
            >
              <Minus className="w-4 h-4" />
            </Button>
            <div className="flex-1 text-center">
              <span className="text-3xl font-bold font-mono tabular-nums">{score.scoreB}</span>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={() => updateScore({ scoreB: score.scoreB + 1 })}
              className="flex-1"
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 pt-2">
        <Button
          size="sm"
          variant="outline"
          onClick={() => updateScore({ period: Math.max(1, score.period - 1) })}
          className="flex-1"
        >
          ← Period
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => updateScore({ period: score.period + 1 })}
          className="flex-1"
        >
          Period →
        </Button>
      </div>
    </Card>
  );
}