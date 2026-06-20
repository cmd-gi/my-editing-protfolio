import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";

type VideoCtx = {
  register: (el: HTMLVideoElement) => () => void;
  play: (el: HTMLVideoElement) => void;
  pauseAll: () => void;
};

const Ctx = createContext<VideoCtx | null>(null);

export function VideoProvider({ children }: { children: ReactNode }) {
  const videos = useRef<Set<HTMLVideoElement>>(new Set());
  const current = useRef<HTMLVideoElement | null>(null);

  const pauseAll = useCallback(() => {
    videos.current.forEach((v) => {
      if (!v.paused) v.pause();
    });
    current.current = null;
  }, []);

  const play = useCallback((el: HTMLVideoElement) => {
    videos.current.forEach((v) => {
      if (v !== el && !v.paused) v.pause();
    });
    current.current = el;
    el.play().catch(() => {});
  }, []);

  const register = useCallback((el: HTMLVideoElement) => {
    videos.current.add(el);
    return () => {
      videos.current.delete(el);
      if (current.current === el) current.current = null;
    };
  }, []);

  useEffect(() => {
    const onVis = () => {
      if (document.hidden) pauseAll();
    };
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, [pauseAll]);

  return <Ctx.Provider value={{ register, play, pauseAll }}>{children}</Ctx.Provider>;
}

export function useVideoManager() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useVideoManager must be inside VideoProvider");
  return c;
}

/* ── Smart player: hover preview (desktop), click-to-play, viewport pause ── */
export function SmartVideo({
  src,
  poster,
  className = "",
}: {
  src?: string;
  poster: string;
  className?: string;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const { register, play } = useVideoManager();
  const [playing, setPlaying] = useState(false);
  const hoverTimer = useRef<number | null>(null);

  useEffect(() => {
    if (!ref.current) return;
    return register(ref.current);
  }, [register]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting && !el.paused) el.pause();
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const isDesktop = typeof window !== "undefined" && window.matchMedia("(hover: hover)").matches;

  const onEnter = () => {
    if (!isDesktop || !ref.current || !src) return;
    ref.current.muted = true;
    play(ref.current);
    // Cap hover preview at 5s
    hoverTimer.current = window.setTimeout(() => ref.current?.pause(), 5000);
  };
  const onLeave = () => {
    if (hoverTimer.current) window.clearTimeout(hoverTimer.current);
    if (ref.current && !playing) ref.current.pause();
  };
  const onClick = () => {
    if (!ref.current || !src) return;
    if (ref.current.paused) {
      ref.current.muted = false;
      play(ref.current);
      setPlaying(true);
    } else {
      ref.current.pause();
      setPlaying(false);
    }
  };

  return (
    <div
      className={`relative group/video overflow-hidden bg-charcoal ${className}`}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
    >
      {src ? (
        <video
          ref={ref}
          src={src}
          poster={poster}
          playsInline
          preload="metadata"
          onClick={onClick}
          onPause={() => setPlaying(false)}
          onPlay={() => setPlaying(true)}
          className="w-full h-full object-cover cursor-pointer"
        />
      ) : (
        <img src={poster} alt="" className="w-full h-full object-cover" loading="lazy" />
      )}
      {!playing && (
        <button
          type="button"
          onClick={onClick}
          aria-label="Play"
          className="absolute inset-0 flex items-center justify-center bg-void/30 opacity-0 group-hover/video:opacity-100 transition-opacity"
        >
          <span className="w-14 h-14 rounded-full border border-paper/70 flex items-center justify-center backdrop-blur-sm bg-void/40">
            <span className="block w-0 h-0 border-y-[8px] border-y-transparent border-l-[12px] border-l-paper ml-1" />
          </span>
        </button>
      )}
    </div>
  );
}