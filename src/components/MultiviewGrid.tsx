import { Play, Radio } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Station {
  id: string;
  name: string;
  location: string;
  status: "live" | "idle" | "offline";
}

interface MultiviewGridProps {
  stations: Station[];
  activeStationId: string;
  onSelectStation: (stationId: string) => void;
}

export function MultiviewGrid({ stations, activeStationId, onSelectStation }: MultiviewGridProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
      {stations.map((station) => {
        const isActive = station.id === activeStationId;
        const isLive = station.status === "live";
        
        return (
          <Card
            key={station.id}
            onClick={() => onSelectStation(station.id)}
            className={`
              relative aspect-video cursor-pointer transition-all
              ${isActive ? "ring-2 ring-primary border-primary" : "border-muted hover:border-primary/50"}
              ${isLive ? "bg-muted/30" : "bg-muted/10"}
            `}
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <Play className={`w-12 h-12 ${isActive ? "text-primary" : "text-muted-foreground/30"}`} />
            </div>
            
            <div className="absolute top-2 left-2 right-2 flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-foreground truncate">{station.name}</p>
                <p className="text-[10px] text-muted-foreground truncate">{station.location}</p>
              </div>
              
              {isLive && (
                <Badge variant="destructive" className="flex items-center gap-1 px-1.5 py-0.5 text-[10px] font-mono">
                  <Radio className="w-2.5 h-2.5" />
                  <span>LIVE</span>
                </Badge>
              )}
            </div>
            
            {isActive && (
              <div className="absolute bottom-2 left-2 right-2">
                <Badge className="w-full justify-center text-[10px] font-mono bg-primary/90 hover:bg-primary/90">
                  PROGRAM
                </Badge>
              </div>
            )}
          </Card>
        );
      })}
    </div>
  );
}