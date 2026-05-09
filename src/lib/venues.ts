export interface Venue {
  id: string;
  name: string;
  shortName: string;
  streamUrl: string;
  location?: string;
}

const TEST_STREAMS = [
  "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8",
  "https://cph-p2p-msl.akamaized.net/hls/live/2000341/test/master.m3u8",
  "https://demo.unified-streaming.com/k8s/features/stable/video/tears-of-steel/tears-of-steel.ism/.m3u8",
  "https://bitdash-a.akamaihd.net/content/sintel/hls/playlist.m3u8",
];

const venues: Venue[] = [
  {
    id: "1",
    name: "Hlavná hala",
    shortName: "A1",
    streamUrl: TEST_STREAMS[0],
    location: "Bratislava",
  },
  {
    id: "2",
    name: "Hala B",
    shortName: "B1",
    streamUrl: TEST_STREAMS[1],
    location: "Košice",
  },
  {
    id: "3",
    name: "Hala C",
    shortName: "C1",
    streamUrl: TEST_STREAMS[2],
    location: "Žilina",
  },
  {
    id: "4",
    name: "Hala D",
    shortName: "D1",
    streamUrl: TEST_STREAMS[3],
    location: "Prešov",
  },
  {
    id: "5",
    name: "Tréningová hala",
    shortName: "T1",
    streamUrl: TEST_STREAMS[0],
    location: "Nitra",
  },
  {
    id: "6",
    name: "Exteriérový kurt",
    shortName: "E1",
    streamUrl: TEST_STREAMS[1],
    location: "Trnava",
  },
];

export function getVenues(): Venue[] {
  return venues;
}

export function getVenueById(id: string): Venue | undefined {
  return venues.find((v) => v.id === id);
}