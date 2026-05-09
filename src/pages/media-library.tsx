import { useState } from "react";
import { SEO } from "@/components/SEO";
import { ControlRoomLayout } from "@/components/ControlRoomLayout";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { MediaLibraryGrid } from "@/components/MediaLibraryGrid";
import { MediaUploader } from "@/components/MediaUploader";

const mockMediaItems = [
  { id: "1", name: "Reklama A", type: "video" as const, duration: "0:30", tags: ["reklama"], url: "", thumbnail: "" },
  { id: "2", name: "Turnajové intro", type: "video" as const, duration: "0:15", tags: ["turnaj", "intro"], url: "", thumbnail: "" },
  { id: "3", name: "Hlavní sponzor logo", type: "image" as const, tags: ["logo", "sponzor"], url: "", thumbnail: "" },
  { id: "4", name: "Reklama B", type: "video" as const, duration: "0:45", tags: ["reklama"], url: "", thumbnail: "" },
];

export default function MediaLibraryPage() {
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [mediaItems, setMediaItems] = useState(mockMediaItems);
  const [filterTag, setFilterTag] = useState<string | null>(null);

  const allTags = Array.from(new Set(mediaItems.flatMap(item => item.tags)));
  const filteredItems = filterTag 
    ? mediaItems.filter(item => item.tags.includes(filterTag))
    : mediaItems;

  const handleDelete = (id: string) => {
    if (confirm("Opravdu chcete odstranit tuto položku?")) {
      setMediaItems(prev => prev.filter(item => item.id !== id));
    }
  };

  return (
    <>
      <SEO title="Mediální knihovna - Tournament Video Hub" />
      <ControlRoomLayout>
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold font-heading text-foreground">Mediální knihovna</h1>
              <p className="text-sm text-muted-foreground mt-1">
                Spravujte VOD obsah a statickou grafiku
              </p>
            </div>
            <Button onClick={() => setIsUploadOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Nahrát média
            </Button>
          </div>

          <div className="flex gap-2 flex-wrap">
            <Button
              variant={filterTag === null ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterTag(null)}
            >
              Vše ({mediaItems.length})
            </Button>
            {allTags.map(tag => (
              <Button
                key={tag}
                variant={filterTag === tag ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterTag(tag)}
              >
                {tag} ({mediaItems.filter(i => i.tags.includes(tag)).length})
              </Button>
            ))}
          </div>

          <MediaLibraryGrid 
            items={filteredItems}
            onDelete={handleDelete}
          />

          {filteredItems.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                {filterTag ? `Žádná média s tagem "${filterTag}"` : "Žádná média"}
              </p>
            </div>
          )}

          {isUploadOpen && (
            <MediaUploader 
              onClose={() => setIsUploadOpen(false)}
            />
          )}
        </div>
      </ControlRoomLayout>
    </>
  );
}