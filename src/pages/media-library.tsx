import { useState } from "react";
import { SEO } from "@/components/SEO";
import { ControlRoomLayout } from "@/components/ControlRoomLayout";
import { MediaLibraryGrid } from "@/components/MediaLibraryGrid";
import { MediaUploader } from "@/components/MediaUploader";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export interface MediaAsset {
  id: string;
  name: string;
  type: "video" | "image";
  duration?: string;
  tags: string[];
  thumbnail: string;
  uploadedAt: string;
}

const mockAssets: MediaAsset[] = [
  {
    id: "vid-1",
    name: "Hlavný sponzor 30s",
    type: "video",
    duration: "00:30",
    tags: ["reklama", "sponzor"],
    thumbnail: "/placeholder-video.jpg",
    uploadedAt: "2026-05-08T10:30:00Z",
  },
  {
    id: "vid-2",
    name: "Lokálna reklama",
    type: "video",
    duration: "00:15",
    tags: ["reklama"],
    thumbnail: "/placeholder-video.jpg",
    uploadedAt: "2026-05-08T09:15:00Z",
  },
  {
    id: "vid-3",
    name: "Turnajové intro",
    type: "video",
    duration: "00:45",
    tags: ["intro", "turnaj"],
    thumbnail: "/placeholder-video.jpg",
    uploadedAt: "2026-05-07T14:20:00Z",
  },
  {
    id: "vid-4",
    name: "Prestávková slučka",
    type: "video",
    duration: "02:00",
    tags: ["loop", "prestávka"],
    thumbnail: "/placeholder-video.jpg",
    uploadedAt: "2026-05-06T16:45:00Z",
  },
  {
    id: "img-1",
    name: "Logo hlavného sponzora",
    type: "image",
    tags: ["logo", "sponzor"],
    thumbnail: "/placeholder-logo.png",
    uploadedAt: "2026-05-05T11:00:00Z",
  },
  {
    id: "img-2",
    name: "Turnajové logo",
    type: "image",
    tags: ["logo", "turnaj"],
    thumbnail: "/placeholder-logo.png",
    uploadedAt: "2026-05-05T11:05:00Z",
  },
];

export default function MediaLibrary() {
  const [assets, setAssets] = useState<MediaAsset[]>(mockAssets);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [filterType, setFilterType] = useState<"all" | "video" | "image">("all");

  const handleUpload = (file: File, tags: string[]) => {
    const newAsset: MediaAsset = {
      id: `asset-${Date.now()}`,
      name: file.name,
      type: file.type.startsWith("video/") ? "video" : "image",
      tags,
      thumbnail: URL.createObjectURL(file),
      uploadedAt: new Date().toISOString(),
    };
    setAssets([newAsset, ...assets]);
    setIsUploadOpen(false);
  };

  const handleDelete = (assetId: string) => {
    setAssets(assets.filter((a) => a.id !== assetId));
  };

  const filteredAssets = filterType === "all" 
    ? assets 
    : assets.filter((a) => a.type === filterType);

  return (
    <>
      <SEO
        title="Media Library - Tournament Video Hub"
        description="Správa VOD obsahu a grafiky pre turnajové prenosy"
      />
      
      <ControlRoomLayout>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground mb-1">Media Library</h1>
              <p className="text-sm text-muted-foreground">
                Správa videí a grafiky pre live produkciu
              </p>
            </div>
            <Button onClick={() => setIsUploadOpen(true)} className="gap-2">
              <Plus className="w-4 h-4" />
              Upload Media
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant={filterType === "all" ? "default" : "outline"}
              onClick={() => setFilterType("all")}
            >
              Všetky ({assets.length})
            </Button>
            <Button
              size="sm"
              variant={filterType === "video" ? "default" : "outline"}
              onClick={() => setFilterType("video")}
            >
              Videá ({assets.filter((a) => a.type === "video").length})
            </Button>
            <Button
              size="sm"
              variant={filterType === "image" ? "default" : "outline"}
              onClick={() => setFilterType("image")}
            >
              Grafika ({assets.filter((a) => a.type === "image").length})
            </Button>
          </div>

          <MediaLibraryGrid
            assets={filteredAssets}
            onDelete={handleDelete}
          />
        </div>

        {isUploadOpen && (
          <MediaUploader
            onUpload={handleUpload}
            onClose={() => setIsUploadOpen(false)}
          />
        )}
      </ControlRoomLayout>
    </>
  );
}