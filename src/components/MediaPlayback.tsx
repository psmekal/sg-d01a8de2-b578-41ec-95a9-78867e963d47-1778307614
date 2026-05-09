import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, RotateCcw } from "lucide-react";

interface MediaItem {
  id: string;
  name: string;
  duration: string;
  type: "ad" | "intro" | "loop";
}

const mockMediaItems: MediaItem[] = [
  { id: "ad-1", name: "Hlavní sponzor 30s", duration: "00:30", type: "ad" },
  { id: "ad-2", name: "Lokální reklama", duration: "00:15", type: "ad" },
  { id: "intro-1", name: "Turnajové intro", duration: "00:45", type: "intro" },
  { id: "loop-1", name: "Přestávková smyčka", duration: "02:00", type: "loop" },
];

interface MediaPlaybackProps {
  onPlayMedia?: (mediaId: string) => void;
}

export function MediaPlayback({ onPlayMedia }: MediaPlaybackProps) {
  return (
    <Card className="p-4 space-y-4 bg-muted/50">
      <div className="flex items-center gap-2">
        <RotateCcw className="w-4 h-4 text-muted-foreground" />
        <h3 className="text-sm font-mono uppercase tracking-wider text-muted-foreground">
          Přehrávání médií
        </h3>
      </div>

      <div className="space-y-2">
        {mockMediaItems.map((item) => (
          <div
            key={item.id}
            className="flex items-center gap-3 p-2 rounded-md bg-background/50 hover:bg-background transition-colors"
          >
            <Button
              size="sm"
              variant="outline"
              onClick={() => onPlayMedia?.(item.id)}
              className="shrink-0"
            >
              <Play className="w-4 h-4" />
            </Button>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{item.name}</p>
              <p className="text-xs text-muted-foreground font-mono">{item.duration}</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}