import { useState, useEffect } from "react";
import { SEO } from "@/components/SEO";
import { ControlRoomLayout } from "@/components/ControlRoomLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2, Edit2, MapPin, Save, X } from "lucide-react";
import { getVenues, addVenue, deleteVenue, updateVenue, type Venue } from "@/lib/venues";

export default function VenuesPage() {
  const [venues, setVenues] = useState<Venue[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: "", shortName: "", streamUrl: "" });

  useEffect(() => {
    setVenues(getVenues());
  }, []);

  const handleAdd = () => {
    if (!formData.name || !formData.shortName) return;
    addVenue(formData.name, formData.shortName, formData.streamUrl || undefined);
    setVenues(getVenues());
    setFormData({ name: "", shortName: "", streamUrl: "" });
    setIsAdding(false);
  };

  const handleDelete = (id: string) => {
    if (confirm("Opravdu chcete odstranit tuto halu?")) {
      deleteVenue(id);
      setVenues(getVenues());
    }
  };

  const handleEdit = (venue: Venue) => {
    setEditingId(venue.id);
    setFormData({ name: venue.name, shortName: venue.shortName, streamUrl: venue.streamUrl || "" });
  };

  const handleUpdate = () => {
    if (!editingId || !formData.name || !formData.shortName) return;
    updateVenue(editingId, {
      name: formData.name,
      shortName: formData.shortName,
      streamUrl: formData.streamUrl || undefined,
    });
    setVenues(getVenues());
    setEditingId(null);
    setFormData({ name: "", shortName: "", streamUrl: "" });
  };

  const handleCancel = () => {
    setIsAdding(false);
    setEditingId(null);
    setFormData({ name: "", shortName: "", streamUrl: "" });
  };

  return (
    <>
      <SEO title="Správa hal - Tournament Video Hub" />
      <ControlRoomLayout>
        <div className="max-w-5xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold font-heading text-foreground">Správa hal</h1>
              <p className="text-sm text-muted-foreground mt-1">
                Spravujte turnajové haly a jejich streamy
              </p>
            </div>
            <Button onClick={() => setIsAdding(true)} disabled={isAdding}>
              <Plus className="w-4 h-4 mr-2" />
              Přidat halu
            </Button>
          </div>

          <div className="grid gap-4">
            {isAdding && (
              <Card className="p-6 bg-card border-2 border-primary">
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-4">
                    <MapPin className="w-5 h-5 text-primary" />
                    <h3 className="text-lg font-semibold text-foreground">Nová hala</h3>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Název haly</Label>
                      <Input
                        id="name"
                        placeholder="Sportovní hala Brno"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="shortName">Zkratka (max. 8 znaků)</Label>
                      <Input
                        id="shortName"
                        placeholder="BRNO-01"
                        maxLength={8}
                        value={formData.shortName}
                        onChange={(e) => setFormData({ ...formData, shortName: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="streamUrl">Stream URL (volitelné)</Label>
                    <Input
                      id="streamUrl"
                      placeholder="rtmp://stream.example.com/live/hall1"
                      value={formData.streamUrl}
                      onChange={(e) => setFormData({ ...formData, streamUrl: e.target.value })}
                    />
                  </div>

                  <div className="flex gap-2 justify-end">
                    <Button variant="outline" onClick={handleCancel}>
                      <X className="w-4 h-4 mr-2" />
                      Zrušit
                    </Button>
                    <Button onClick={handleAdd} disabled={!formData.name || !formData.shortName}>
                      <Save className="w-4 h-4 mr-2" />
                      Uložit halu
                    </Button>
                  </div>
                </div>
              </Card>
            )}

            {venues.map((venue) => (
              <Card
                key={venue.id}
                className={`p-6 transition-all ${
                  editingId === venue.id ? "border-2 border-primary bg-card" : "bg-card/50 border-border"
                }`}
              >
                {editingId === venue.id ? (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 mb-4">
                      <Edit2 className="w-5 h-5 text-primary" />
                      <h3 className="text-lg font-semibold text-foreground">Upravit halu</h3>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor={`edit-name-${venue.id}`}>Název haly</Label>
                        <Input
                          id={`edit-name-${venue.id}`}
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`edit-short-${venue.id}`}>Zkratka</Label>
                        <Input
                          id={`edit-short-${venue.id}`}
                          maxLength={8}
                          value={formData.shortName}
                          onChange={(e) => setFormData({ ...formData, shortName: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`edit-url-${venue.id}`}>Stream URL</Label>
                      <Input
                        id={`edit-url-${venue.id}`}
                        value={formData.streamUrl}
                        onChange={(e) => setFormData({ ...formData, streamUrl: e.target.value })}
                      />
                    </div>

                    <div className="flex gap-2 justify-end">
                      <Button variant="outline" onClick={handleCancel}>
                        <X className="w-4 h-4 mr-2" />
                        Zrušit
                      </Button>
                      <Button onClick={handleUpdate} disabled={!formData.name || !formData.shortName}>
                        <Save className="w-4 h-4 mr-2" />
                        Uložit změny
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                        <MapPin className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-foreground">{venue.name}</h3>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="text-sm font-mono text-muted-foreground">
                            {venue.shortName}
                          </span>
                          {venue.streamUrl && (
                            <>
                              <span className="text-muted-foreground">•</span>
                              <span className="text-xs text-muted-foreground truncate max-w-xs">
                                {venue.streamUrl}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="icon" onClick={() => handleEdit(venue)}>
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleDelete(venue.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </Card>
            ))}

            {venues.length === 0 && !isAdding && (
              <Card className="p-12 text-center bg-card border-border">
                <MapPin className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
                <p className="text-muted-foreground mb-4">Zatím nebyly přidány žádné haly</p>
                <Button onClick={() => setIsAdding(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Přidat první halu
                </Button>
              </Card>
            )}
          </div>
        </div>
      </ControlRoomLayout>
    </>
  );
}