import { useState } from "react";
import { SEO } from "@/components/SEO";
import { ControlRoomLayout } from "@/components/ControlRoomLayout";
import { ProgramMonitor } from "@/components/ProgramMonitor";
import { MultiviewGrid } from "@/components/MultiviewGrid";
import { GraphicsControl } from "@/components/GraphicsControl";
import { MediaPlayback } from "@/components/MediaPlayback";
import { getVenueById } from "@/lib/venues";
import { useScoreboard } from "@/contexts/ScoreboardContext";

export default function HomePage() {
  const [activeVenueId, setActiveVenueId] = useState("1");
  const [graphics, setGraphics] = useState({
    mainSponsor: false,
    localSponsors: false,
    tournamentLogo: false,
  });
  const [playingMedia, setPlayingMedia] = useState<string | null>(null);
  const { scoreboard } = useScoreboard();

  const handleToggleGraphic = (key: "mainSponsor" | "localSponsors") => {
    setGraphics((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handlePlayMedia = (mediaName: string) => {
    setPlayingMedia(mediaName);
    setTimeout(() => setPlayingMedia(null), 3000);
  };

  const activeVenue = getVenueById(activeVenueId);

  return (
    <>
      <SEO 
        title="Režie - Tournament Video Hub"
        description="Centrální režie pro správu video streamů z turnaje"
      />
      <ControlRoomLayout>
        <div className="space-y-6">
          <section>
            <h2 className="text-xl font-bold text-foreground mb-4">Program Out</h2>
            <ProgramMonitor 
              streamUrl={activeVenue?.streamUrl || ""}
              venueName={activeVenue?.name}
              scoreboard={scoreboard}
              graphics={graphics}
              playingMedia={playingMedia}
            />
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mb-4">Multiview</h2>
            <MultiviewGrid 
              onSelectVenue={setActiveVenueId}
              activeVenueId={activeVenueId}
            />
          </section>

          <div className="grid lg:grid-cols-2 gap-6">
            <GraphicsControl 
              graphics={graphics}
              onToggleGraphic={handleToggleGraphic}
            />
            <MediaPlayback 
              onPlayMedia={handlePlayMedia}
            />
          </div>
        </div>
      </ControlRoomLayout>
    </>
  );
}