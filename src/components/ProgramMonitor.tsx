import { Play } from "lucide-react";
import { Card } from "@/components/ui/card";

interface ProgramMonitorProps {
  venueName?: string;
  stationName?: string;
  isLive?: boolean;
  graphics?: { mainSponsor: boolean; localSponsors: boolean; };
  playingMedia?: string | null;
}

export function ProgramMonitor({ venueName, stationName, isLive = true, graphics, playingMedia }: ProgramMonitorProps) {
  const displayName = venueName || stationName || "Unknown Venue";

  return (
    <Card className="relative w-full aspect-video bg-black overflow-hidden border-2 border-primary/30">
      <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-muted/40 to-muted/20">
        <div className="text-center space-y-4">
          {playingMedia ? (
            <div className="px-6 py-4 bg-accent/20 backdrop-blur-md rounded-xl border border-accent/50 animate-pulse">
              <p className="text-2xl font-bold text-white">Prehráva sa: {playingMedia}</p>
            </div>
          ) : (
            <>
              <Play className="w-20 h-20 text-muted-foreground/30 mx-auto" />
              <div className="space-y-1">
                <p className="text-sm font-mono text-muted-foreground uppercase tracking-wider">
                  Program Output
                </p>
                <p className="text-lg font-semibold text-foreground">{displayName}</p>
              </div>
            </>
          )}
        </div>
      </div>
      
      {isLive && (
        <div className="absolute top-4 right-4 flex items-center gap-2 px-3 py-1.5 bg-accent/90 backdrop-blur-sm rounded z-10">
          <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
          <span className="text-xs font-mono font-semibold text-white uppercase tracking-wider">
            Live
          </span>
        </div>
      )}

      {graphics?.mainSponsor && !playingMedia && (
        <div className="absolute top-4 left-4 px-4 py-2 bg-white/10 backdrop-blur-md rounded border border-white/20">
          <span className="font-bold text-white">GEN. PARTNER</span>
        </div>
      )}
      
      {graphics?.localSponsors && !playingMedia && (
        <div className="absolute bottom-12 right-4 px-4 py-2 bg-white/10 backdrop-blur-md rounded border border-white/20">
          <span className="font-semibold text-white/80">Lokálny partner</span>
        </div>
      )}
      
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
        <p className="text-xs font-mono text-white/80">16:9 • 1920×1080</p>
      </div>
    </Card>
  );
}