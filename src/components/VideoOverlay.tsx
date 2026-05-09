import { Badge } from "@/components/ui/badge";

interface ScoreboardState {
  teamA: string;
  teamB: string;
  scoreA: number;
  scoreB: number;
  period: number;
}

interface GraphicsState {
  mainSponsor: boolean;
  localSponsors: boolean;
  tournamentLogo: boolean;
}

interface VideoOverlayProps {
  scoreboard: ScoreboardState;
  graphics: GraphicsState;
  playingMedia?: string | null;
}

export function VideoOverlay({ scoreboard, graphics, playingMedia }: VideoOverlayProps) {
  return (
    <div className="absolute inset-0 pointer-events-none">
      {/* Scoreboard Overlay */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2">
        <div className="bg-black/80 backdrop-blur-sm rounded-lg px-6 py-2 flex items-center gap-4 shadow-xl">
          <div className="text-center">
            <p className="text-xs text-white/60 mb-1">{scoreboard.teamA}</p>
            <p className="text-3xl font-bold font-mono tabular-nums text-white">{scoreboard.scoreA}</p>
          </div>
          <div className="w-px h-12 bg-white/20" />
          <div className="text-center">
            <p className="text-xs text-white/60 mb-1">{scoreboard.teamB}</p>
            <p className="text-3xl font-bold font-mono tabular-nums text-white">{scoreboard.scoreB}</p>
          </div>
          <div className="ml-2">
            <Badge variant="outline" className="bg-white/10 text-white border-white/20 font-mono text-xs">
              P{scoreboard.period}
            </Badge>
          </div>
        </div>
      </div>

      {/* Tournament Logo */}
      {graphics.tournamentLogo && (
        <div className="absolute top-4 left-4">
          <div className="bg-black/60 backdrop-blur-sm rounded-lg px-4 py-2">
            <p className="text-sm font-bold text-white">TOURNAMENT 2026</p>
          </div>
        </div>
      )}

      {/* Main Sponsor Logo */}
      {graphics.mainSponsor && (
        <div className="absolute top-4 right-4">
          <div className="bg-white/90 backdrop-blur-sm rounded-lg px-4 py-2">
            <p className="text-sm font-bold text-gray-900">MAIN SPONSOR</p>
          </div>
        </div>
      )}

      {/* Local Sponsors Bar */}
      {graphics.localSponsors && (
        <div className="absolute bottom-4 left-4 right-4">
          <div className="bg-black/70 backdrop-blur-sm rounded-lg px-6 py-2 flex items-center justify-center gap-4">
            <p className="text-xs text-white/60">Powered by:</p>
            <p className="text-sm font-semibold text-white">Partner A</p>
            <span className="text-white/40">•</span>
            <p className="text-sm font-semibold text-white">Partner B</p>
            <span className="text-white/40">•</span>
            <p className="text-sm font-semibold text-white">Partner C</p>
          </div>
        </div>
      )}

      {/* Media Playback Overlay */}
      {playingMedia && (
        <div className="absolute inset-0 bg-black/95 flex items-center justify-center">
          <div className="text-center space-y-4">
            <p className="text-lg text-white/60">Now Playing</p>
            <p className="text-2xl font-bold text-white">{playingMedia}</p>
          </div>
        </div>
      )}
    </div>
  );
}