export interface Venue {
  id: string;
  name: string;
  shortName: string;
  streamUrl?: string;
  isActive: boolean;
  createdAt: string;
}

const STORAGE_KEY = "tournament_venues";

export function getVenues(): Venue[] {
  if (typeof window === "undefined") return [];
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    const defaults: Venue[] = [
      { id: "1", name: "Main Court", shortName: "MC", isActive: true, createdAt: new Date().toISOString() },
      { id: "2", name: "Court A", shortName: "A", isActive: true, createdAt: new Date().toISOString() },
      { id: "3", name: "Court B", shortName: "B", isActive: true, createdAt: new Date().toISOString() },
    ];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaults));
    return defaults;
  }
  return JSON.parse(stored);
}

export function saveVenues(venues: Venue[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(venues));
}

export function addVenue(name: string, shortName: string): Venue {
  const venues = getVenues();
  const newVenue: Venue = {
    id: Date.now().toString(),
    name,
    shortName,
    isActive: true,
    createdAt: new Date().toISOString(),
  };
  venues.push(newVenue);
  saveVenues(venues);
  return newVenue;
}

export function removeVenue(id: string) {
  const venues = getVenues().filter(v => v.id !== id);
  saveVenues(venues);
}

export function updateVenue(id: string, updates: Partial<Venue>) {
  const venues = getVenues().map(v => v.id === id ? { ...v, ...updates } : v);
  saveVenues(venues);
}