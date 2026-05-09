import { useState, useEffect } from "react";
import { SEO } from "@/components/SEO";
import { ControlRoomLayout } from "@/components/ControlRoomLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Minus, Play, Pause, RotateCcw, Users, Clock, Eye, EyeOff, UserX } from "lucide-react";
import { getVenues, type Venue } from "@/lib/venues";
import { getScoreboardByVenue, updateScoreboard, computeClockSeconds, fmtClock, pausePenalties, resumePenalties, type Scoreboard, type Penalty } from "@/lib/scoreboard";
import ScoreboardOverlay from "@/components/Scoreboard";

export default function ScoreboardPage() {
  const [venues, setVenues] = useState<Venue[]>([]);
  const [selectedVenueId, setSelectedVenueId] = useState<string>("");
  const [scoreboard, setScoreboard] = useState<Scoreboard | null>(null);
  const [clockDisplay, setClockDisplay] = useState("00:00");

  useEffect(() => {
    const venueList = getVenues();
    setVenues(venueList);
    if (venueList.length > 0 && !selectedVenueId) {
      setSelectedVenueId(venueList[0].id);
    }
  }, []);

  useEffect(() => {
    if (!selectedVenueId) return;
    const board = getScoreboardByVenue(selectedVenueId);
    setScoreboard(board);

    const handleUpdate = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail.venueId === selectedVenueId) {
        setScoreboard(customEvent.detail.data);
      }
    };

    window.addEventListener("scoreboard-update", handleUpdate);
    return () => window.removeEventListener("scoreboard-update", handleUpdate);
  }, [selectedVenueId]);

  useEffect(() => {
    if (!scoreboard) return;
    const interval = setInterval(() => {
      const seconds = computeClockSeconds(scoreboard);
      setClockDisplay(fmtClock(seconds));
    }, 100);
    return () => clearInterval(interval);
  }, [scoreboard]);

  const handleUpdate = (updates: Partial<Scoreboard>) => {
    if (!selectedVenueId) return;
    updateScoreboard(selectedVenueId, updates);
  };

  const handleScoreChange = (team: "home" | "away", delta: number) => {
    if (!scoreboard) return;
    const key = team === "home" ? "home_score" : "away_score";
    const newScore = Math.max(0, scoreboard[key] + delta);
    handleUpdate({ [key]: newScore });
  };

  const handleClockToggle = () => {
    if (!scoreboard) return;
    const now = Date.now();
    if (scoreboard.clock_running) {
      const seconds = computeClockSeconds(scoreboard, now);
      handleUpdate({ 
        clock_running: false, 
        clock_base_sec: seconds, 
        clock_anchor: null,
        home_penalties: pausePenalties(scoreboard.home_penalties, now),
        away_penalties: pausePenalties(scoreboard.away_penalties, now),
      });
    } else {
      handleUpdate({ 
        clock_running: true, 
        clock_anchor: new Date(now).toISOString(),
        home_penalties: resumePenalties(scoreboard.home_penalties, now),
        away_penalties: resumePenalties(scoreboard.away_penalties, now),
      });
    }
  };

  const handleClockReset = () => {
    if (!scoreboard) return;
    handleUpdate({ 
      clock_running: false, 
      clock_base_sec: scoreboard.period_length_sec, 
      clock_anchor: null 
    });
  };

  const handlePeriodChange = (delta: number) => {
    if (!scoreboard) return;
    handleUpdate({ period: Math.max(1, scoreboard.period + delta) });
  };

  const handleAddPenalty = (team: "home" | "away") => {
    if (!scoreboard) return;
    const key = team === "home" ? "home_penalties" : "away_penalties";
    const now = new Date().toISOString();
    const newPenalty: Penalty = {
      id: `${Date.now()}`,
      player: "",
      duration: 120,
      startedAt: now,
      base_sec: 0,
      anchor: scoreboard.clock_running ? now : null,
    };
    handleUpdate({ [key]: [...scoreboard[key], newPenalty] });
  };

  if (venues.length === 0) {
    return (
      <>
        <SEO title="Scoreboard Control - Tournament Video Hub" />
        <ControlRoomLayout>
          <Card className="p-12 text-center bg-card border-border">
            <p className="text-muted-foreground">Najprv pridajte haly v sekcii "Správa hál"</p>
          </Card>
        </ControlRoomLayout>
      </>
    );
  }

  if (!scoreboard) return null;

  return (
    <>
      <SEO title="Scoreboard Control - Tournament Video Hub" />
      <ControlRoomLayout>
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold font-heading text-foreground">Ovládanie skóre</h1>
              <p className="text-sm text-muted-foreground mt-1">Spravujte skóre pre zvolenú halu</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-64">
                <Select value={selectedVenueId} onValueChange={setSelectedVenueId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Vyberte halu" />
                  </SelectTrigger>
                  <SelectContent>
                    {venues.map((venue) => (
                      <SelectItem key={venue.id} value={venue.id}>
                        {venue.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button
                variant={scoreboard.visible ? "default" : "outline"}
                size="icon"
                onClick={() => handleUpdate({ visible: !scoreboard.visible })}
              >
                {scoreboard.visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              </Button>
            </div>
          </div>

          <Card className="relative aspect-video bg-black overflow-hidden">
            <ScoreboardOverlay />
          </Card>

          <div className="grid lg:grid-cols-2 gap-6">
            <Card className="p-6 bg-card border-border">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-foreground flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    Domáci tím
                  </h3>
                  <div className="flex gap-2">
                    <Input
                      value={scoreboard.home_short}
                      onChange={(e) => handleUpdate({ home_short: e.target.value })}
                      className="w-20 text-center font-mono"
                      maxLength={4}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Názov tímu</Label>
                  <Input
                    value={scoreboard.home_name}
                    onChange={(e) => handleUpdate({ home_name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Farba</Label>
                  <Input
                    type="color"
                    value={scoreboard.home_color}
                    onChange={(e) => handleUpdate({ home_color: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Skóre</Label>
                  <div className="flex items-center gap-2">
                    <Button onClick={() => handleScoreChange("home", -1)} variant="outline" size="icon">
                      <Minus className="w-4 h-4" />
                    </Button>
                    <div className="flex-1 text-center">
                      <span className="text-5xl font-bold font-mono text-primary tabular-nums">
                        {scoreboard.home_score}
                      </span>
                    </div>
                    <Button onClick={() => handleScoreChange("home", 1)} variant="outline" size="icon">
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Tresty ({scoreboard.home_penalties.length})</Label>
                  <Button onClick={() => handleAddPenalty("home")} variant="outline" className="w-full">
                    <UserX className="w-4 h-4 mr-2" />
                    Pridať trest (2 min)
                  </Button>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-card border-border">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-foreground flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    Hosťujúci tím
                  </h3>
                  <div className="flex gap-2">
                    <Input
                      value={scoreboard.away_short}
                      onChange={(e) => handleUpdate({ away_short: e.target.value })}
                      className="w-20 text-center font-mono"
                      maxLength={4}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Názov tímu</Label>
                  <Input
                    value={scoreboard.away_name}
                    onChange={(e) => handleUpdate({ away_name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Farba</Label>
                  <Input
                    type="color"
                    value={scoreboard.away_color}
                    onChange={(e) => handleUpdate({ away_color: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Skóre</Label>
                  <div className="flex items-center gap-2">
                    <Button onClick={() => handleScoreChange("away", -1)} variant="outline" size="icon">
                      <Minus className="w-4 h-4" />
                    </Button>
                    <div className="flex-1 text-center">
                      <span className="text-5xl font-bold font-mono text-accent tabular-nums">
                        {scoreboard.away_score}
                      </span>
                    </div>
                    <Button onClick={() => handleScoreChange("away", 1)} variant="outline" size="icon">
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Tresty ({scoreboard.away_penalties.length})</Label>
                  <Button onClick={() => handleAddPenalty("away")} variant="outline" className="w-full">
                    <UserX className="w-4 h-4 mr-2" />
                    Pridať trest (2 min)
                  </Button>
                </div>
              </div>
            </Card>
          </div>

          <Card className="p-6 bg-card border-border">
            <div className="space-y-6">
              <h3 className="font-semibold text-foreground flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Časomiera
              </h3>
              <div className="flex items-center justify-center">
                <div className="text-7xl font-bold font-mono text-foreground tabular-nums">
                  {clockDisplay}
                </div>
              </div>
              <div className="flex items-center justify-center gap-4">
                <Button onClick={handleClockToggle} size="lg" variant={scoreboard.clock_running ? "destructive" : "default"}>
                  {scoreboard.clock_running ? (
                    <>
                      <Pause className="w-5 h-5 mr-2" />
                      Zastaviť
                    </>
                  ) : (
                    <>
                      <Play className="w-5 h-5 mr-2" />
                      Spustiť
                    </>
                  )}
                </Button>
                <Button onClick={handleClockReset} size="lg" variant="outline">
                  <RotateCcw className="w-5 h-5 mr-2" />
                  Reset
                </Button>
              </div>
              <div className="flex items-center justify-center gap-4">
                <Button onClick={() => handlePeriodChange(-1)} variant="outline" disabled={scoreboard.period <= 1}>
                  ← Predošlá perioda
                </Button>
                <span className="text-lg font-mono">
                  Perioda: <span className="font-bold">{scoreboard.period}</span>
                </span>
                <Button onClick={() => handlePeriodChange(1)} variant="outline">
                  Nasledujúca perioda →
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </ControlRoomLayout>
    </>
  );
}