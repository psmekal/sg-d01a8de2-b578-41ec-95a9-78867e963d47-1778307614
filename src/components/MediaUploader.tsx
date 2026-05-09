import { useState } from "react";
import { Upload, X } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

interface MediaUploaderProps {
  onUpload: (file: File, tags: string[]) => void;
  onClose: () => void;
}

export function MediaUploader({ onUpload, onClose }: MediaUploaderProps) {
  const [file, setFile] = useState<File | null>(null);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const handleSubmit = () => {
    if (file) {
      onUpload(file, tags);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-lg p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">Upload Media</h2>
          <Button size="icon" variant="ghost" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="file-upload">Súbor</Label>
            <div className="border-2 border-dashed border-muted rounded-lg p-8 text-center hover:border-primary/50 transition-colors">
              <input
                id="file-upload"
                type="file"
                accept="video/*,image/*"
                onChange={handleFileChange}
                className="hidden"
              />
              <label htmlFor="file-upload" className="cursor-pointer space-y-3 block">
                <Upload className="w-12 h-12 text-muted-foreground mx-auto" />
                {file ? (
                  <div>
                    <p className="font-semibold">{file.name}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                ) : (
                  <div>
                    <p className="font-semibold">Kliknite pre výber súboru</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      MP4, PNG, SVG (max 500MB)
                    </p>
                  </div>
                )}
              </label>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="tags">Tagy</Label>
            <div className="flex gap-2">
              <Input
                id="tags"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addTag();
                  }
                }}
                placeholder="Pridať tag (Enter pre potvrdenie)"
              />
              <Button onClick={addTag} variant="outline">
                Pridať
              </Button>
            </div>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="gap-1 pr-1">
                    {tag}
                    <button
                      onClick={() => removeTag(tag)}
                      className="hover:bg-destructive/20 rounded-full p-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex gap-3 pt-4">
          <Button onClick={onClose} variant="outline" className="flex-1">
            Zrušiť
          </Button>
          <Button onClick={handleSubmit} disabled={!file} className="flex-1">
            Upload
          </Button>
        </div>
      </Card>
    </div>
  );
}