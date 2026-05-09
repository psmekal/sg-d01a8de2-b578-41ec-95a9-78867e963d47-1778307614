import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Image } from "lucide-react";

interface GraphicsControlProps {
  graphics: {
    mainSponsor: boolean;
    localSponsors: boolean;
  };
  onToggleGraphic: (key: "mainSponsor" | "localSponsors") => void;
}

export function GraphicsControl({ graphics, onToggleGraphic }: GraphicsControlProps) {
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
          <Label htmlFor="main-sponsor" className="text-sm cursor-pointer flex-1">
            Generálny partner
          </Label>
          <Switch
            id="main-sponsor"
            checked={graphics.mainSponsor}
            onCheckedChange={() => onToggleGraphic("mainSponsor")}
          />
        </div>

        <div className="flex items-center justify-between p-2 rounded-md bg-background/50">
          <Label htmlFor="local-sponsors" className="text-sm cursor-pointer flex-1">
            Lokálni partneri
          </Label>
          <Switch
            id="local-sponsors"
            checked={graphics.localSponsors}
            onCheckedChange={() => onToggleGraphic("localSponsors")}
          />
        </div>
      </div>
    </Card>
  );
}