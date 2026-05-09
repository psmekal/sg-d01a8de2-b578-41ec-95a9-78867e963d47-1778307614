import { HLSPlayer } from "@/components/HLSPlayer";
import { Card } from "@/components/ui/card";
import { VideoOverlay } from "@/components/VideoOverlay";

interface ProgramMonitorProps {
  streamUrl: string;
  venueName?: string;
  isLive?: boolean;
  scoreboard?: {
    teamA: string;
    teamB: string;
    scoreA: number;
    scoreB: number;
    period: number;
  };
  graphics?: { 
    mainSponsor: boolean; 
    localSponsors: boolean;
    tournamentLogo?: boolean;
  };
  playingMedia?: string | null;
}

export function ProgramMonitor({ 
  streamUrl,
  venueName, 
  isLive = true, 
  scoreboard,
  graphics, 
  playingMedia 
}: ProgramMonitorProps) {
  const displayName = venueName || "Neznámá hala";

  return (
    <Card className="relative w-full aspect-video bg-black overflow-hidden border-2 border-primary/30">
      <HLSPlayer 
        src={streamUrl}
        muted={false}
        autoPlay={true}
      />
      
      {scoreboard && graphics && (
        <VideoOverlay 
          scoreboard={scoreboard}
          graphics={{
            ...graphics,
            tournamentLogo: graphics.tournamentLogo || false,
          }}
          playingMedia={playingMedia}
        />
      )}
      
      {isLive && (
        <div className="absolute top-4 right-4 flex items-center gap-2 px-3 py-1.5 bg-accent/90 backdrop-blur-sm rounded z-10">
          <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
          <span className="text-xs font-mono font-semibold text-white uppercase tracking-wider">
            Live
          </span>
        </div>
      )}
      
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4 z-10">
        <p className="text-xs font-mono text-white/80">{displayName} • 16:9 • 1920×1080</p>
      </div>
    </Card>
  );
}