import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Image } from "lucide-react";

interface GraphicsState {
  mainSponsor: boolean;
  localSponsors: boolean;
  tournamentLogo: boolean;
}

interface GraphicsControlProps {
  onGraphicsChange?: (graphics: GraphicsState) => void;
}

export function GraphicsControl({ onGraphicsChange }: GraphicsControlProps) {
  const [graphics, setGraphics] = useState<GraphicsState>({
    mainSponsor: false,
    localSponsors: false,
    tournamentLogo: true,
  });

  const toggleGraphic = (key: keyof GraphicsState) => {
    const newGraphics = { ...graphics, [key]: !graphics[key] };
    setGraphics(newGraphics);
    onGraphicsChange?.(newGraphics);
  };

  return (
    <Card className="p-4 space-y-4 bg-muted/50">
      <div className="flex items-center gap-2">
        <Image className="w-4 h-4 text-muted-foreground" />
        <h3 className="text-sm font-mono uppercase tracking-wider text-muted-foreground">
          Graphics & Logos
        </h3>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between p-2 rounded-md bg-background/50">
          <Label htmlFor="tournament-logo" className="text-sm cursor-pointer flex-1">
            Tournament Logo
          </Label>
          <Switch
            id="tournament-logo"
            checked={graphics.tournamentLogo}
            onCheckedChange={() => toggleGraphic("tournamentLogo")}
          />
        </div>

        <div className="flex items-center justify-between p-2 rounded-md bg-background/50">
          <Label htmlFor="main-sponsor" className="text-sm cursor-pointer flex-1">
            Main Sponsor
          </Label>
          <Switch
            id="main-sponsor"
            checked={graphics.mainSponsor}
            onCheckedChange={() => toggleGraphic("mainSponsor")}
          />
        </div>

        <div className="flex items-center justify-between p-2 rounded-md bg-background/50">
          <Label htmlFor="local-sponsors" className="text-sm cursor-pointer flex-1">
            Local Sponsors
          </Label>
          <Switch
            id="local-sponsors"
            checked={graphics.localSponsors}
            onCheckedChange={() => toggleGraphic("localSponsors")}
          />
        </div>
      </div>
    </Card>
  );
}