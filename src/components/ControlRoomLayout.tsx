import { ReactNode } from "react";
import Link from "next/link";
import { Film, MapPin, Activity } from "lucide-react";

interface ControlRoomLayoutProps {
  children: ReactNode;
}

export function ControlRoomLayout({ children }: ControlRoomLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-muted bg-muted/30 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <div className="w-2 h-2 bg-accent rounded-full animate-pulse" />
              <h1 className="text-xl font-bold text-foreground">Tournament Video Hub</h1>
            </Link>
            <nav className="hidden md:flex items-center gap-4">
              <Link 
                href="/venues" 
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <MapPin className="w-4 h-4" />
                <span>Haly</span>
              </Link>
              <Link 
                href="/scoreboard" 
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <Activity className="w-4 h-4" />
                <span>Skóre</span>
              </Link>
              <Link 
                href="/media-library" 
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <Film className="w-4 h-4" />
                <span>Médiá</span>
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 text-sm font-mono text-muted-foreground tabular-nums">
              <span className="text-foreground font-semibold">00:00:00</span>
              <span>•</span>
              <span>REC</span>
            </div>
          </div>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-6">
        {children}
      </main>
    </div>
  );
}