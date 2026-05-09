import { Clock, Film, Image as ImageIcon, Trash2, Tag } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { MediaAsset } from "@/pages/media-library";

interface MediaLibraryGridProps {
  assets: MediaAsset[];
  onDelete: (assetId: string) => void;
}

export function MediaLibraryGrid({ assets, onDelete }: MediaLibraryGridProps) {
  if (assets.length === 0) {
    return (
      <Card className="p-12 text-center">
        <div className="space-y-3">
          <div className="flex justify-center">
            <Film className="w-16 h-16 text-muted-foreground/30" />
          </div>
          <p className="text-lg font-semibold text-muted-foreground">Žiadny obsah</p>
          <p className="text-sm text-muted-foreground/70">
            Začnite nahratím vášho prvého videa alebo grafiky
          </p>
        </div>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {assets.map((asset) => (
        <Card key={asset.id} className="overflow-hidden group hover:border-primary/50 transition-colors">
          <div className="relative aspect-video bg-muted flex items-center justify-center">
            {asset.type === "video" ? (
              <Film className="w-12 h-12 text-muted-foreground/30" />
            ) : (
              <ImageIcon className="w-12 h-12 text-muted-foreground/30" />
            )}
            
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                size="icon"
                variant="destructive"
                className="h-7 w-7"
                onClick={() => onDelete(asset.id)}
              >
                <Trash2 className="w-3.5 h-3.5" />
              </Button>
            </div>

            {asset.duration && (
              <div className="absolute bottom-2 right-2 bg-black/70 backdrop-blur-sm px-2 py-0.5 rounded text-xs font-mono text-white">
                {asset.duration}
              </div>
            )}
          </div>

          <div className="p-3 space-y-2">
            <div>
              <h3 className="font-semibold text-sm truncate">{asset.name}</h3>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-0.5">
                <Clock className="w-3 h-3" />
                <span>{new Date(asset.uploadedAt).toLocaleDateString("sk-SK")}</span>
              </div>
            </div>

            {asset.tags.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {asset.tags.slice(0, 3).map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs px-1.5 py-0">
                    {tag}
                  </Badge>
                ))}
                {asset.tags.length > 3 && (
                  <Badge variant="secondary" className="text-xs px-1.5 py-0">
                    +{asset.tags.length - 3}
                  </Badge>
                )}
              </div>
            )}
          </div>
        </Card>
      ))}
    </div>
  );
}