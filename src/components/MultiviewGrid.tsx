import { useEffect, useState } from "react";
import { Play, Radio } from "lucide-react";
import { Card } from "@/components/ui/card";
import { getVenues, type Venue } from "@/lib/venues";

interface MultiviewGridProps {
  onSelectVenue: (venueId: string) => void;
  activeVenueId: string;
}

export function MultiviewGrid({ onSelectVenue, activeVenueId }: MultiviewGridProps) {
  const [venues, setVenues] = useState<Venue[]>([]);

  useEffect(() => {
    setVenues(getVenues());
  }, []);

  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
      {venues.map((venue) => {
        const isActive = activeVenueId === venue.id;
        return (
          <Card
            key={venue.id}
            className={`cursor-pointer transition-all hover:border-primary ${
              isActive ? "border-accent border-2" : "border-border"
            }`}
            onClick={() => onSelectVenue(venue.id)}
          >
            <div className="aspect-video bg-muted/50 relative overflow-hidden group">
              <div className="absolute inset-0 flex items-center justify-center">
                <Play className="w-16 h-16 text-muted-foreground/30" />
              </div>
              {isActive && (
                <div className="absolute top-2 right-2 flex items-center gap-1 px-2 py-1 rounded bg-accent text-white text-xs font-mono">
                  <Radio className="w-3 h-3 animate-pulse" />
                  LIVE
                </div>
              )}
            </div>
            <div className="p-3 border-t border-border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-sm text-foreground">{venue.name}</p>
                  <p className="text-xs text-muted-foreground font-mono">{venue.shortName}</p>
                </div>
                <div className={`w-2 h-2 rounded-full ${isActive ? "bg-accent animate-pulse" : "bg-muted-foreground/30"}`} />
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}