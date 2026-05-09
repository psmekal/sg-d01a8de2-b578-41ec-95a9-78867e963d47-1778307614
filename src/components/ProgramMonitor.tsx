import { Play } from "lucide-react";
import { Card } from "@/components/ui/card";

interface ProgramMonitorProps {
  stationName: string;
  isLive: boolean;
}

export function ProgramMonitor({ stationName, isLive }: ProgramMonitorProps) {
  return (
    <Card className="relative w-full aspect-video bg-black overflow-hidden border-2 border-primary/30">
      <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-muted/40 to-muted/20">
        <div className="text-center space-y-4">
          <Play className="w-20 h-20 text-muted-foreground/30 mx-auto" />
          <div className="space-y-1">
            <p className="text-sm font-mono text-muted-foreground uppercase tracking-wider">
              Program Output
            </p>
            <p className="text-lg font-semibold text-foreground">{stationName}</p>
          </div>
        </div>
      </div>
      
      {isLive && (
        <div className="absolute top-4 right-4 flex items-center gap-2 px-3 py-1.5 bg-accent/90 backdrop-blur-sm rounded">
          <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
          <span className="text-xs font-mono font-semibold text-white uppercase tracking-wider">
            Live
          </span>
        </div>
      )}
      
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
        <p className="text-xs font-mono text-white/80">16:9 • 1920×1080</p>
      </div>
    </Card>
  );
}