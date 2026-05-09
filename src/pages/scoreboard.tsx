import { useState, useEffect } from "react";
import { SEO } from "@/components/SEO";
import { ControlRoomLayout } from "@/components/ControlRoomLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Minus, Play, Pause, RotateCcw, Users, Clock, Eye, EyeOff, UserX, MapPin, Upload } from "lucide-react";
import { getVenues, type Venue } from "@/lib/venues";
import { getScoreboardByVenue, updateScoreboard, computeClockSeconds, fmtClock, pausePenalties, resumePenalties, type Scoreboard, type Penalty, type ScoreboardPosition } from "@/lib/scoreboard";
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

  const handleLogoUpload = (team: "home" | "away", file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const url = e.target?.result as string;
      handleUpdate({ [team === "home" ? "home_logo" : "away_logo"]: url });
    };
    reader.readAsDataURL(file);
  };

  if (venues.length === 0) {
    return (
      <>
        <SEO title="Ovládání skóre - Tournament Video Hub" />
        <ControlRoomLayout>
          <Card className="p-12 text-center bg-card border-border">
            <p className="text-muted-foreground">Nejprve přidejte haly v sekci "Správa hal"</p>
          </Card>
        </ControlRoomLayout>
      </>
    );
  }

  if (!scoreboard) return null;

  const positionOptions: { value: ScoreboardPosition; label: string }[] = [
    { value: "top-left", label: "Nahoře vlevo" },
    { value: "top-center", label: "Nahoře uprostřed" },
    { value: "top-right", label: "Nahoře vpravo" },
    { value: "middle-left", label: "Uprostřed vlevo" },
    { value: "middle-center", label: "Uprostřed" },
    { value: "middle-right", label: "Uprostřed vpravo" },
    { value: "bottom-left", label: "Dole vlevo" },
    { value: "bottom-center", label: "Dole uprostřed" },
    { value: "bottom-right", label: "Dole vpravo" },
  ];

  return (
    <>
      <SEO title="Ovládání skóre - Tournament Video Hub" />
      <ControlRoomLayout>
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold font-heading text-foreground">Ovládání skóre</h1>
              <p className="text-sm text-muted-foreground mt-1">Spravujte skóre pro zvolenou halu</p>
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

          {/* Full HD Preview - 1920x1080 */}
          <Card className="relative bg-black overflow-hidden" style={{ aspectRatio: "16/9" }}>
            <ScoreboardOverlay />
            <div className="absolute bottom-2 right-2 text-xs font-mono text-white/50">
              1920×1080 Full HD
            </div>
          </Card>

          {/* Position Selector */}
          <Card className="p-4 bg-card border-border">
            <div className="flex items-center gap-4">
              <MapPin className="w-5 h-5 text-muted-foreground" />
              <Label className="text-sm font-semibold">Pozice skóre:</Label>
              <Select value={scoreboard.position} onValueChange={(value: ScoreboardPosition) => handleUpdate({ position: value })}>
                <SelectTrigger className="w-64">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {positionOptions.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </Card>

          <div className="grid lg:grid-cols-2 gap-6">
            <Card className="p-6 bg-card border-border">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-foreground flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    Domácí tým
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
                  <Label>Název týmu</Label>
                  <Input
                    value={scoreboard.home_name}
                    onChange={(e) => handleUpdate({ home_name: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Barva</Label>
                    <Input
                      type="color"
                      value={scoreboard.home_color}
                      onChange={(e) => handleUpdate({ home_color: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Logo týmu</Label>
                    <label className="flex items-center justify-center gap-2 px-4 py-2 bg-muted hover:bg-muted/80 rounded-md cursor-pointer transition-colors border border-border">
                      <Upload className="w-4 h-4" />
                      <span className="text-sm">Nahrát</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleLogoUpload("home", file);
                        }}
                      />
                    </label>
                  </div>
                </div>
                {scoreboard.home_logo && (
                  <div className="p-2 bg-muted rounded-md flex items-center gap-2">
                    <img src={scoreboard.home_logo} alt="Home logo" className="w-10 h-10 object-contain" />
                    <span className="text-xs text-muted-foreground">Logo nahráno</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="ml-auto"
                      onClick={() => handleUpdate({ home_logo: null })}
                    >
                      Odstranit
                    </Button>
                  </div>
                )}
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
                    Přidat trest (2 min)
                  </Button>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-card border-border">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-foreground flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    Hostující tým
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
                  <Label>Název týmu</Label>
                  <Input
                    value={scoreboard.away_name}
                    onChange={(e) => handleUpdate({ away_name: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Barva</Label>
                    <Input
                      type="color"
                      value={scoreboard.away_color}
                      onChange={(e) => handleUpdate({ away_color: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Logo týmu</Label>
                    <label className="flex items-center justify-center gap-2 px-4 py-2 bg-muted hover:bg-muted/80 rounded-md cursor-pointer transition-colors border border-border">
                      <Upload className="w-4 h-4" />
                      <span className="text-sm">Nahrát</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleLogoUpload("away", file);
                        }}
                      />
                    </label>
                  </div>
                </div>
                {scoreboard.away_logo && (
                  <div className="p-2 bg-muted rounded-md flex items-center gap-2">
                    <img src={scoreboard.away_logo} alt="Away logo" className="w-10 h-10 object-contain" />
                    <span className="text-xs text-muted-foreground">Logo nahráno</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="ml-auto"
                      onClick={() => handleUpdate({ away_logo: null })}
                    >
                      Odstranit
                    </Button>
                  </div>
                )}
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
                    Přidat trest (2 min)
                  </Button>
                </div>
              </div>
            </Card>
          </div>

          <Card className="p-6 bg-card border-border">
            <div className="space-y-6">
              <h3 className="font-semibold text-foreground flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Časomíra
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
                      Zastavit
                    </>
                  ) : (
                    <>
                      <Play className="w-5 h-5 mr-2" />
                      Spustit
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
                  ← Předchozí perioda
                </Button>
                <span className="text-lg font-mono">
                  Perioda: <span className="font-bold">{scoreboard.period}</span>
                </span>
                <Button onClick={() => handlePeriodChange(1)} variant="outline">
                  Následující perioda →
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </ControlRoomLayout>
    </>
  );
}