import { useEffect, useRef, useState } from "react";
import Hls from "hls.js";
import { Play, Wifi, WifiOff } from "lucide-react";

interface HLSPlayerProps {
  src: string;
  className?: string;
  showControls?: boolean;
  muted?: boolean;
  autoPlay?: boolean;
}

export function HLSPlayer({ 
  src, 
  className = "", 
  showControls = false, 
  muted = true,
  autoPlay = true 
}: HLSPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<Hls | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !src) return;

    setIsLoading(true);
    setError(null);

    if (Hls.isSupported()) {
      const hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true,
        backBufferLength: 90,
      });

      hlsRef.current = hls;

      hls.loadSource(src);
      hls.attachMedia(video);

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        setIsLoading(false);
        if (autoPlay) {
          video.play().catch((err) => {
            console.error("Autoplay failed:", err);
            setError("Klikni pre prehratie");
          });
        }
      });

      hls.on(Hls.Events.ERROR, (event, data) => {
        if (data.fatal) {
          switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              setError("Chyba sieťe");
              hls.startLoad();
              break;
            case Hls.ErrorTypes.MEDIA_ERROR:
              setError("Chyba média");
              hls.recoverMediaError();
              break;
            default:
              setError("Kritická chyba");
              break;
          }
        }
      });

      return () => {
        hls.destroy();
      };
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      // Native HLS support (Safari)
      video.src = src;
      video.addEventListener("loadedmetadata", () => {
        setIsLoading(false);
        if (autoPlay) {
          video.play().catch((err) => {
            console.error("Autoplay failed:", err);
            setError("Klikni pre prehratie");
          });
        }
      });
    } else {
      setError("HLS nie je podporované");
    }
  }, [src, autoPlay]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    video.addEventListener("play", handlePlay);
    video.addEventListener("pause", handlePause);

    return () => {
      video.removeEventListener("play", handlePlay);
      video.removeEventListener("pause", handlePause);
    };
  }, []);

  const handleClick = () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      video.play().catch(console.error);
    } else {
      video.pause();
    }
  };

  return (
    <div className={`relative w-full h-full bg-black ${className}`}>
      <video
        ref={videoRef}
        className="w-full h-full object-cover"
        controls={showControls}
        muted={muted}
        playsInline
        onClick={handleClick}
      />
      
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/80">
          <div className="flex flex-col items-center gap-2">
            <Wifi className="w-8 h-8 text-primary animate-pulse" />
            <p className="text-sm text-white">Načítava sa stream...</p>
          </div>
        </div>
      )}

      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/80">
          <div className="flex flex-col items-center gap-2">
            <WifiOff className="w-8 h-8 text-accent" />
            <p className="text-sm text-white">{error}</p>
          </div>
        </div>
      )}

      {!isPlaying && !isLoading && !error && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/30 cursor-pointer" onClick={handleClick}>
          <Play className="w-16 h-16 text-white/80" />
        </div>
      )}
    </div>
  );
}