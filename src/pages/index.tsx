import { useState } from "react";
import { SEO } from "@/components/SEO";
import { ControlRoomLayout } from "@/components/ControlRoomLayout";
import { ProgramMonitor } from "@/components/ProgramMonitor";
import { MultiviewGrid } from "@/components/MultiviewGrid";
import { ScoreboardControl } from "@/components/ScoreboardControl";
import { GraphicsControl } from "@/components/GraphicsControl";
import { MediaPlayback } from "@/components/MediaPlayback";
import { VideoOverlay } from "@/components/VideoOverlay";

const mockStations = [
  { id: "court-1", name: "Hlavný kurt", location: "Hala A", status: "live" as const },
  { id: "court-2", name: "Kurt 2", location: "Hala A", status: "live" as const },
  { id: "court-3", name: "Kurt 3", location: "Hala B", status: "idle" as const },
  { id: "court-4", name: "Kurt 4", location: "Hala B", status: "live" as const },
  { id: "court-5", name: "Tréningový kurt", location: "Vonkajšia zóna", status: "offline" as const },
  { id: "court-6", name: "VIP Kurt", location: "Hala C", status: "idle" as const },
];

export default function Home() {
  const [activeStationId, setActiveStationId] = useState("court-1");
  const [scoreboard, setScoreboard] = useState({
    teamA: "Tím A",
    teamB: "Tím B",
    scoreA: 0,
    scoreB: 0,
    period: 1,
  });
  const [graphics, setGraphics] = useState({
    mainSponsor: false,
    localSponsors: false,
    tournamentLogo: true,
  });
  const [playingMedia, setPlayingMedia] = useState<string | null>(null);
  
  const activeStation = mockStations.find(s => s.id === activeStationId);

  const handlePlayMedia = (mediaId: string) => {
    const mediaNames: Record<string, string> = {
      "ad-1": "Hlavný sponzor 30s",
      "ad-2": "Lokálna reklama",
      "intro-1": "Turnajové intro",
      "loop-1": "Prestávková slučka",
    };
    
    setPlayingMedia(mediaNames[mediaId] || mediaId);
    setTimeout(() => setPlayingMedia(null), 3000);
  };

  return (
    <>
      <SEO
        title="Tournament Video Hub - Live Production Dashboard"
        description="Centrálna aplikácia pre správu a spracovanie videa z turnajov"
      />
      
      <ControlRoomLayout>
        <div className="grid lg:grid-cols-[1fr_400px] gap-6">
          <div className="space-y-6">
            <section>
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-sm font-mono uppercase tracking-wider text-muted-foreground">
                  Program Output
                </h2>
                <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground">
                  <span>Active Source:</span>
                  <span className="text-primary font-semibold">{activeStation?.name}</span>
                </div>
              </div>
              <div className="relative">
                <ProgramMonitor
                  stationName={activeStation?.name || ""}
                  isLive={activeStation?.status === "live"}
                />
                <VideoOverlay
                  scoreboard={scoreboard}
                  graphics={graphics}
                  playingMedia={playingMedia}
                />
              </div>
            </section>

            <section>
              <div className="mb-3">
                <h2 className="text-sm font-mono uppercase tracking-wider text-muted-foreground">
                  Multiview Sources
                </h2>
              </div>
              <MultiviewGrid
                stations={mockStations}
                activeStationId={activeStationId}
                onSelectStation={setActiveStationId}
              />
            </section>
          </div>

          <div className="space-y-4">
            <ScoreboardControl onScoreChange={setScoreboard} />
            <GraphicsControl onGraphicsChange={setGraphics} />
            <MediaPlayback onPlayMedia={handlePlayMedia} />
          </div>
        </div>
      </ControlRoomLayout>
    </>
  );
}