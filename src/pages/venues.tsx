import { useState, useEffect } from "react";
import { SEO } from "@/components/SEO";
import { ControlRoomLayout } from "@/components/ControlRoomLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2, Edit2, Check, X } from "lucide-react";
import { getVenues, addVenue, removeVenue, updateVenue, type Venue } from "@/lib/venues";

export default function VenuesPage() {
  const [venues, setVenues] = useState<Venue[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: "", shortName: "" });

  useEffect(() => {
    setVenues(getVenues());
  }, []);

  const handleAdd = () => {
    if (!formData.name.trim() || !formData.shortName.trim()) return;
    addVenue(formData.name, formData.shortName);
    setVenues(getVenues());
    setFormData({ name: "", shortName: "" });
    setIsAdding(false);
  };

  const handleRemove = (id: string) => {
    if (confirm("Naozaj chcete odstrániť túto halu?")) {
      removeVenue(id);
      setVenues(getVenues());
    }
  };

  const handleEdit = (venue: Venue) => {
    setEditingId(venue.id);
    setFormData({ name: venue.name, shortName: venue.shortName });
  };

  const handleSaveEdit = (id: string) => {
    if (!formData.name.trim() || !formData.shortName.trim()) return;
    updateVenue(id, { name: formData.name, shortName: formData.shortName });
    setVenues(getVenues());
    setEditingId(null);
    setFormData({ name: "", shortName: "" });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setFormData({ name: "", shortName: "" });
  };

  return (
    <>
      <SEO 
        title="Správa hál - Tournament Video Hub"
        description="Spravujte turnajové haly a stanovištia"
      />
      <ControlRoomLayout>
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold font-heading text-foreground">Správa hál</h1>
              <p className="text-sm text-muted-foreground mt-1">Pridávajte a spravujte turnajové stanovištia</p>
            </div>
            <Button onClick={() => setIsAdding(true)} disabled={isAdding}>
              <Plus className="w-4 h-4 mr-2" />
              Pridať halu
            </Button>
          </div>

          {isAdding && (
            <Card className="p-6 bg-card border-border">
              <div className="space-y-4">
                <h3 className="font-semibold text-foreground">Nová hala</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Názov haly</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="napr. Hlavný kurt"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="shortName">Skrátený názov</Label>
                    <Input
                      id="shortName"
                      value={formData.shortName}
                      onChange={(e) => setFormData({ ...formData, shortName: e.target.value })}
                      placeholder="napr. HK"
                      maxLength={3}
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleAdd} variant="default">
                    <Check className="w-4 h-4 mr-2" />
                    Uložiť
                  </Button>
                  <Button onClick={() => { setIsAdding(false); setFormData({ name: "", shortName: "" }); }} variant="outline">
                    <X className="w-4 h-4 mr-2" />
                    Zrušiť
                  </Button>
                </div>
              </div>
            </Card>
          )}

          <div className="grid gap-4">
            {venues.map((venue) => (
              <Card key={venue.id} className="p-6 bg-card border-border">
                {editingId === venue.id ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Názov haly</Label>
                        <Input
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Skrátený názov</Label>
                        <Input
                          value={formData.shortName}
                          onChange={(e) => setFormData({ ...formData, shortName: e.target.value })}
                          maxLength={3}
                        />
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={() => handleSaveEdit(venue.id)} size="sm">
                        <Check className="w-4 h-4 mr-2" />
                        Uložiť
                      </Button>
                      <Button onClick={handleCancelEdit} size="sm" variant="outline">
                        <X className="w-4 h-4 mr-2" />
                        Zrušiť
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded bg-primary/20 flex items-center justify-center">
                        <span className="text-xl font-bold font-mono text-primary">{venue.shortName}</span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">{venue.name}</h3>
                        <p className="text-sm text-muted-foreground">ID: {venue.id}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={() => handleEdit(venue)} size="sm" variant="outline">
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button onClick={() => handleRemove(venue.id)} size="sm" variant="outline">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </Card>
            ))}
          </div>

          {venues.length === 0 && !isAdding && (
            <Card className="p-12 text-center bg-card border-border border-dashed">
              <p className="text-muted-foreground">Zatiaľ neboli pridané žiadne haly</p>
              <Button onClick={() => setIsAdding(true)} className="mt-4">
                <Plus className="w-4 h-4 mr-2" />
                Pridať prvú halu
              </Button>
            </Card>
          )}
        </div>
      </ControlRoomLayout>
    </>
  );
}