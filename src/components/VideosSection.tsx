import { useEffect, useRef, useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useVideoManager } from "./VideoManager";
import {
  INITIAL_VIDEOS,
  ENABLE_ARRANGE_MODE,
  VIDEO_CATEGORIES,
  type VideoItem,
  type VideoCategory,
  type VideoRatio,
} from "@/data/videos";
import { saveVideosToCodebase } from "@/lib/api/videos.functions";
import { toast } from "sonner";
import { DecorationStar } from "./daren-curtis/DecorationStar";
import { ArrowIcon } from "./daren-curtis/ArrowIcon";

const INITIAL_COUNT = 9;

const ASPECT_CLASS: Record<VideoRatio, string> = {
  "9:16": "aspect-[9/16]",
  "16:9": "aspect-video",
  "1:1": "aspect-square",
};

const POSTER_DIMENSIONS: Record<VideoRatio, string> = {
  "9:16": "w_500,h_889",
  "16:9": "w_500,h_281",
  "1:1": "w_500,h_500",
};

const LOCAL_STORAGE_KEY = "charan_portfolio_video_order_v2";

function pickQualityHeight(): number {
  if (typeof window === "undefined" || typeof navigator === "undefined") return 1080;
  const conn = (navigator as unknown as { connection?: { effectiveType?: string; saveData?: boolean; downlink?: number } }).connection;
  const viewportIsDesktop = window.innerWidth >= 1024;
  if (!conn) return viewportIsDesktop ? 1080 : 720;
  if (conn.saveData) return 480;
  if (!viewportIsDesktop) return 720;
  switch (conn.effectiveType) {
    case "slow-2g":
    case "2g":
      return 480;
    case "3g":
      return 720;
    case "4g":
    default:
      return (conn.downlink ?? 10) >= 5 ? 1080 : 720;
  }
}

function optimizedSrc(url: string, height: number): string {
  const h = Math.max(480, height);
  return url.replace(
    /\/video\/upload\/(?:[^/]+\/)*?(v\d+\/)/,
    `/video/upload/q_auto:good,f_auto,h_${h},c_limit/$1`,
  );
}

function posterFor(url: string, ratio: VideoRatio) {
  return url
    .replace(
      /\/video\/upload\/(?:[^/]+\/)*?(v\d+\/)/,
      `/video/upload/so_1,${POSTER_DIMENSIONS[ratio]},c_fit,q_auto,f_auto/$1`,
    )
    .replace(/\.mp4$/, ".jpg");
}

/* ─────────────── VIDEO TILE ─────────────── */
function VideoTile({
  item,
  globalIndex,
  isArrangeMode,
  onMoveTop,
  onMoveUp,
  onMoveDown,
  onUpdateCategory,
  onUpdateRatio,
  onUpdateTitle,
  onDelete,
  canMoveUp,
  canMoveDown,
}: {
  item: VideoItem;
  globalIndex: number;
  isArrangeMode: boolean;
  onMoveTop: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onUpdateCategory: (cat: VideoCategory) => void;
  onUpdateRatio: (ratio: VideoRatio) => void;
  onUpdateTitle: (title: string) => void;
  onDelete: () => void;
  canMoveUp: boolean;
  canMoveDown: boolean;
}) {
  const { src, ratio, title, category } = item;
  const ref = useRef<HTMLVideoElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const { register, play } = useVideoManager();
  const [playing, setPlaying] = useState(false);
  const [declaredRatio, setDeclaredRatio] = useState<VideoRatio>(ratio);
  const [mounted, setMounted] = useState(false);
  const [shouldPlayOnMount, setShouldPlayOnMount] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleDraft, setTitleDraft] = useState(title);
  const [optimized] = useState(() => optimizedSrc(src, pickQualityHeight()));

  useEffect(() => {
    setDeclaredRatio(ratio);
  }, [ratio]);

  useEffect(() => {
    const frame = frameRef.current;
    if (!frame) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setMounted(true);
          return;
        }
        const el = ref.current;
        if (el && !el.paused) el.pause();
        if (!playing) setMounted(false);
      },
      { rootMargin: "200px 0px", threshold: 0.01 },
    );
    io.observe(frame);
    return () => io.disconnect();
  }, [playing]);

  useEffect(() => {
    if (!mounted) return;
    const el = ref.current;
    if (!el) return;
    const unregister = register(el);
    if (shouldPlayOnMount) {
      setShouldPlayOnMount(false);
      play(el);
    }
    return () => {
      unregister();
      if (!el.paused) el.pause();
      el.removeAttribute("src");
      el.load();
    };
  }, [mounted, play, register, shouldPlayOnMount]);

  useEffect(() => {
    const onChange = () => {
      setIsFullscreen(document.fullscreenElement === frameRef.current);
    };
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el || !mounted) return;
    const onLoaded = () => {
      const w = el.videoWidth;
      const h = el.videoHeight;
      if (!w || !h) return;
      const nextRatio: VideoRatio = h > w * 1.05 ? "9:16" : w > h * 1.05 ? "16:9" : "1:1";
      if (nextRatio !== declaredRatio) {
        setDeclaredRatio(nextRatio);
      }
    };
    onLoaded();
    el.addEventListener("loadedmetadata", onLoaded);
    return () => el.removeEventListener("loadedmetadata", onLoaded);
  }, [declaredRatio, mounted]);

  const toggle = () => {
    const el = ref.current;
    if (!el) {
      setMounted(true);
      setShouldPlayOnMount(true);
      return;
    }
    if (el.paused) {
      el.muted = false;
      play(el);
    } else {
      el.pause();
    }
  };

  const goFullscreen = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const el = ref.current;
    const wrap = frameRef.current;
    if (!el) return;
    try {
      if (el.paused) {
        el.muted = false;
        play(el);
      }
      const anyEl = el as HTMLVideoElement & { webkitEnterFullscreen?: () => void };
      if (anyEl.webkitEnterFullscreen) {
        anyEl.webkitEnterFullscreen();
        return;
      }
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      } else {
        await (wrap ?? el).requestFullscreen();
      }
    } catch {
      /* ignore */
    }
  };

  const aspect = ASPECT_CLASS[declaredRatio];

  const wrapClass = isFullscreen
    ? "fixed inset-0 z-50 flex items-center justify-center bg-[#151010]"
    : `relative w-full ${aspect} bg-[#151010]`;

  const videoClass = isFullscreen && declaredRatio === "9:16"
    ? "max-w-full max-h-full w-auto h-auto object-contain cursor-pointer"
    : "absolute inset-0 w-full h-full object-cover cursor-pointer";

  const handleTitleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (titleDraft.trim()) {
      onUpdateTitle(titleDraft.trim());
    }
    setIsEditingTitle(false);
  };

  return (
    <motion.article
      layout="position"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.4 }}
      className={`group relative bg-white border-2 border-[#151010] rounded-[22px] overflow-hidden shadow-[4px_4px_0px_#151010] hover:shadow-[6px_6px_0px_#151010] transition-all ${
        isArrangeMode ? "ring-4 ring-[#0039FF]/50" : ""
      } ${declaredRatio === "9:16" ? "md:row-span-2" : ""}`}
    >
      {/* ── ARRANGE MODE TOOLBAR (TOP OVERLAY) ── */}
      {isArrangeMode && (
        <div className="z-30 bg-[#FFF7EC] border-b-2 border-[#151010] p-3 text-xs flex flex-col gap-2">
          <div className="flex items-center justify-between gap-1 text-[11px] font-mono">
            <span className="bg-[#0039FF] text-white px-2 py-0.5 font-bold rounded-md">
              #{String(globalIndex + 1).padStart(2, "0")}
            </span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={onMoveTop}
                title="Move straight to top of portfolio (#1)"
                className="bg-[#CEFF00] text-[#151010] border border-[#151010] px-2 py-0.5 font-extrabold text-[10px] uppercase rounded-md hover:brightness-105 shadow-xs cursor-pointer"
              >
                ★ Top
              </button>
              <button
                type="button"
                disabled={!canMoveUp}
                onClick={onMoveUp}
                title="Move up one position"
                className="bg-white border border-[#151010] hover:bg-[#BEEBFD] disabled:opacity-30 disabled:pointer-events-none text-[#151010] px-2 py-0.5 text-[10px] rounded-md cursor-pointer font-bold"
              >
                ▲
              </button>
              <button
                type="button"
                disabled={!canMoveDown}
                onClick={onMoveDown}
                title="Move down one position"
                className="bg-white border border-[#151010] hover:bg-[#BEEBFD] disabled:opacity-30 disabled:pointer-events-none text-[#151010] px-2 py-0.5 text-[10px] rounded-md cursor-pointer font-bold"
              >
                ▼
              </button>
              <button
                type="button"
                onClick={onDelete}
                title="Remove video from portfolio"
                className="bg-red-100 border border-red-500 text-red-600 hover:bg-red-200 px-2 py-0.5 text-[10px] rounded-md cursor-pointer font-bold"
              >
                ✕
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-1.5">
            <select
              value={category}
              onChange={(e) => onUpdateCategory(e.target.value as VideoCategory)}
              className="bg-white border border-[#151010] text-[11px] font-medium text-[#151010] px-1.5 py-1 rounded-md focus:outline-none focus:ring-1 focus:ring-[#0039FF] cursor-pointer"
            >
              {VIDEO_CATEGORIES.filter((c) => c.id !== "all").map((c) => (
                <option key={c.id} value={c.id}>
                  {c.label}
                </option>
              ))}
            </select>

            <button
              type="button"
              onClick={() => onUpdateRatio(declaredRatio === "9:16" ? "16:9" : "9:16")}
              className="bg-white border border-[#151010] text-[11px] font-bold text-[#0039FF] hover:bg-[#BEEBFD] px-1.5 py-1 text-center rounded-md cursor-pointer"
            >
              Ratio: {declaredRatio}
            </button>
          </div>

          {isEditingTitle ? (
            <form onSubmit={handleTitleSubmit} className="flex gap-1 pt-1">
              <input
                type="text"
                value={titleDraft}
                onChange={(e) => setTitleDraft(e.target.value)}
                autoFocus
                className="flex-1 bg-white border-2 border-[#0039FF] text-[11px] text-[#151010] px-2 py-1 font-medium rounded-md focus:outline-none"
              />
              <button type="submit" className="bg-[#0039FF] text-white px-2.5 py-1 text-[11px] font-bold rounded-md cursor-pointer">
                ✓
              </button>
            </form>
          ) : (
            <div
              onClick={() => setIsEditingTitle(true)}
              className="flex items-center justify-between text-[11px] text-[#151010] font-semibold hover:text-[#0039FF] cursor-pointer truncate pt-0.5"
              title="Click to edit title"
            >
              <span className="truncate">{title}</span>
              <span className="text-[10px] text-[#0039FF] underline ml-1 font-mono">edit</span>
            </div>
          )}
        </div>
      )}

      {/* ── VIDEO PLAYER / POSTER ── */}
      <div ref={frameRef} className={wrapClass}>
        {!mounted ? (
          <img
            src={posterFor(src, declaredRatio)}
            alt={title}
            loading="lazy"
            decoding="async"
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <video
            ref={ref}
            src={optimized}
            poster={posterFor(src, declaredRatio)}
            playsInline
            preload="metadata"
            onClick={toggle}
            onPlay={() => setPlaying(true)}
            onPause={() => setPlaying(false)}
            className={videoClass}
          />
        )}

        {/* Daren & Curtis Signature Circular Play Button */}
        {!playing && (
          <button
            type="button"
            onClick={toggle}
            aria-label={`Play ${title}`}
            className="absolute inset-0 flex items-center justify-center bg-black/20 hover:bg-black/35 transition-colors cursor-pointer"
          >
            <span className="w-16 h-16 rounded-full border-2 border-[#151010] bg-[#CEFF00] text-[#151010] flex items-center justify-center shadow-[3px_3px_0px_#151010] transition-transform group-hover:scale-110">
              <span className="block w-0 h-0 border-y-[8px] border-y-transparent border-l-[13px] border-l-[#151010] ml-1" />
            </span>
          </button>
        )}

        {/* Top Badges (D&C style pills) */}
        {!isArrangeMode && (
          <>
            <span className="absolute top-3.5 left-3.5 bg-white/90 backdrop-blur-xs text-[#151010] font-mono text-[11px] font-bold px-2.5 py-1 rounded-full border border-[#151010]/20 shadow-xs">
              0{globalIndex + 1}
            </span>
            <span className="absolute top-3.5 right-3.5 bg-[#CEFF00] text-[#151010] font-mono text-[10px] font-extrabold px-2.5 py-1 rounded-full border border-[#151010] shadow-xs">
              {declaredRatio}
            </span>
          </>
        )}

        {/* Fullscreen Button */}
        <button
          type="button"
          onClick={goFullscreen}
          aria-label="Play fullscreen"
          className="absolute bottom-3.5 right-3.5 z-10 inline-flex items-center justify-center w-9 h-9 bg-white/90 hover:bg-[#CEFF00] text-[#151010] border border-[#151010] rounded-xl transition-all shadow-xs cursor-pointer"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" />
          </svg>
        </button>
      </div>

      {/* D&C Style Bottom Title Bar */}
      {!isArrangeMode && title && (
        <div className="p-4 bg-white border-t border-[#151010]/10 flex items-center justify-between gap-3">
          <div className="min-w-0">
            <span className="block text-[10px] font-mono tracking-wider uppercase text-[#0039FF] font-bold">
              {category.replace("-", " ")}
            </span>
            <h4 className="text-[14px] font-bold text-[#151010] truncate mt-0.5">
              {title}
            </h4>
          </div>
          <div className="w-8 h-8 rounded-full border border-[#151010] flex items-center justify-center bg-[#FFF7EC] group-hover:bg-[#CEFF00] transition-colors shrink-0">
            <ArrowIcon className="w-3 h-3 text-[#151010]" />
          </div>
        </div>
      )}
    </motion.article>
  );
}

/* ─────────────── MAIN SECTION ─────────────── */
export function VideosSection() {
  const [videos, setVideos] = useState<VideoItem[]>(INITIAL_VIDEOS);
  const [selectedCategory, setSelectedCategory] = useState<"all" | VideoCategory>("all");
  const [expanded, setExpanded] = useState(false);
  const [isArrangeMode, setIsArrangeMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setVideos(parsed);
        }
      }
    } catch {
      /* ignore */
    }
  }, []);

  const updateVideos = (newVideos: VideoItem[]) => {
    setVideos(newVideos);
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newVideos));
    } catch {
      /* ignore */
    }
  };

  const handleMoveTop = (globalIndex: number) => {
    if (globalIndex === 0) return;
    const item = videos[globalIndex];
    const next = [item, ...videos.slice(0, globalIndex), ...videos.slice(globalIndex + 1)];
    updateVideos(next);
    toast.success(`Moved "${item.title}" to Top (#1)`);
  };

  const handleMoveUp = (globalIndex: number) => {
    if (globalIndex <= 0) return;
    const next = [...videos];
    const temp = next[globalIndex - 1];
    next[globalIndex - 1] = next[globalIndex];
    next[globalIndex] = temp;
    updateVideos(next);
  };

  const handleMoveDown = (globalIndex: number) => {
    if (globalIndex >= videos.length - 1) return;
    const next = [...videos];
    const temp = next[globalIndex + 1];
    next[globalIndex + 1] = next[globalIndex];
    next[globalIndex] = temp;
    updateVideos(next);
  };

  const handleUpdateCategory = (id: string, category: VideoCategory) => {
    const next = videos.map((v) => (v.id === id ? { ...v, category } : v));
    updateVideos(next);
    toast.info(`Updated category to ${category}`);
  };

  const handleUpdateRatio = (id: string, ratio: VideoRatio) => {
    const next = videos.map((v) => (v.id === id ? { ...v, ratio } : v));
    updateVideos(next);
    toast.info(`Updated ratio to ${ratio}`);
  };

  const handleUpdateTitle = (id: string, title: string) => {
    const next = videos.map((v) => (v.id === id ? { ...v, title } : v));
    updateVideos(next);
    toast.success(`Updated title to "${title}"`);
  };

  const handleDelete = (id: string) => {
    const target = videos.find((v) => v.id === id);
    if (!window.confirm(`Remove "${target?.title || "this video"}" from portfolio?`)) return;
    const next = videos.filter((v) => v.id !== id);
    updateVideos(next);
    toast.error("Video removed");
  };

  const handleResetToCodebase = () => {
    if (!window.confirm("Reset video order and settings back to original codebase values?")) return;
    try {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
    } catch {
      /* ignore */
    }
    setVideos(INITIAL_VIDEOS);
    toast.info("Reset to codebase default");
  };

  const handleSaveToCodebase = async () => {
    setIsSaving(true);
    try {
      const res = await saveVideosToCodebase({
        data: {
          videos,
          enableArrangeMode: ENABLE_ARRANGE_MODE,
        },
      });
      if (res && res.success) {
        toast.success(`Saved! Codebase file src/data/videos.ts updated with ${res.count} videos.`);
      } else {
        toast.error("Could not write directly to codebase. You can copy the code snippet below.");
      }
    } catch {
      toast.error("Save server error. You can copy code directly.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCopyCode = () => {
    const code = `export const INITIAL_VIDEOS: VideoItem[] = ${JSON.stringify(videos, null, 2)};`;
    navigator.clipboard.writeText(code);
    toast.success("TypeScript array copied to clipboard!");
  };

  const filteredVideos = useMemo(() => {
    if (selectedCategory === "all") return videos;
    return videos.filter((v) => v.category === selectedCategory);
  }, [videos, selectedCategory]);

  const visible = isArrangeMode
    ? filteredVideos
    : expanded
    ? filteredVideos
    : filteredVideos.slice(0, INITIAL_COUNT);

  const hasMore = !isArrangeMode && filteredVideos.length > INITIAL_COUNT;

  const categoryCounts = useMemo(() => {
    const map: Record<string, number> = { all: videos.length };
    for (const v of videos) {
      map[v.category] = (map[v.category] || 0) + 1;
    }
    return map;
  }, [videos]);

  return (
    <section id="videos" className="relative bg-[#FFF7EC] text-[#151010] py-24 md:py-32 px-4 sm:px-6 lg:px-12 overflow-hidden">
      {/* Decorative D&C Star */}
      <div className="absolute top-12 right-6 md:right-16 hidden sm:block pointer-events-none">
        <DecorationStar className="w-16 h-14 md:w-20 md:h-16 animate-dc-float" fill="#CEFF00" stroke="#151010" />
      </div>

      <div className="max-w-[1600px] mx-auto relative z-20">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#151010]/20 bg-white text-[12px] font-mono uppercase tracking-wider text-[#0039FF] font-bold mb-4 shadow-xs">
              <span className="w-2 h-2 rounded-full bg-[#0039FF] animate-pulse" />
              <span>003 / Selected Works</span>
            </div>
            <h2 className="text-[clamp(2.75rem,7vw,6.5rem)] font-black leading-[0.95] text-[#0039FF] tracking-tight">
              Featured <span className="text-[#151010] underline decoration-[#CEFF00] decoration-wavy decoration-4">Edits</span>.
            </h2>
            <p className="mt-4 text-[16px] md:text-[18px] text-[#151010]/80 max-w-[55ch] font-medium leading-relaxed">
              Commercial storytelling, high-performing brand ads, real estate reels, and cinematic edits. Tap any card to play with sound.
            </p>
          </div>

          {ENABLE_ARRANGE_MODE && (
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setIsArrangeMode((v) => !v)}
                className={`inline-flex items-center gap-2 px-5 py-3 rounded-[12px] font-bold text-[13px] border-2 border-[#151010] transition-all cursor-pointer ${
                  isArrangeMode
                    ? "bg-[#CEFF00] text-[#151010] shadow-[3px_3px_0px_#151010]"
                    : "bg-white text-[#151010] hover:bg-[#BEEBFD]"
                }`}
              >
                <span>{isArrangeMode ? "✕ Exit Arrange" : "⇄ Arrange Videos"}</span>
              </button>
            </div>
          )}
        </div>

        {/* Arrange Mode Dock */}
        {ENABLE_ARRANGE_MODE && isArrangeMode && (
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            className="mb-10 p-5 bg-white border-2 border-[#151010] rounded-[20px] shadow-[6px_6px_0px_#151010]"
          >
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#0039FF] animate-pulse" />
                  <span className="font-extrabold text-[14px] text-[#0039FF] uppercase tracking-wider">
                    Arrange & Edit Mode Active
                  </span>
                  <span className="text-xs font-mono text-[#151010]/60 font-semibold">
                    ({videos.length} videos)
                  </span>
                </div>
                <p className="text-[13px] text-[#151010]/80 mt-1 font-medium">
                  Click <strong className="text-[#0039FF]">★ Top</strong> on any card to move it to #1. When finished, click <strong className="text-[#0039FF]">Save to Codebase</strong>.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2.5">
                <button
                  type="button"
                  disabled={isSaving}
                  onClick={handleSaveToCodebase}
                  className="bg-[#CEFF00] text-[#151010] border-2 border-[#151010] px-5 py-2.5 rounded-[12px] text-[12px] font-extrabold uppercase hover:brightness-105 shadow-[2px_2px_0px_#151010] cursor-pointer"
                >
                  {isSaving ? "Saving..." : "💾 Save to Codebase"}
                </button>
                <button
                  type="button"
                  onClick={handleCopyCode}
                  className="bg-white hover:bg-[#FFF7EC] text-[#151010] border-2 border-[#151010] px-4 py-2.5 rounded-[12px] text-[12px] font-bold uppercase transition-colors cursor-pointer"
                >
                  📋 Copy Code
                </button>
                <button
                  type="button"
                  onClick={handleResetToCodebase}
                  className="bg-white hover:bg-red-50 text-red-600 border border-red-300 px-4 py-2.5 rounded-[12px] text-[12px] font-bold uppercase transition-colors cursor-pointer"
                >
                  ↺ Reset
                </button>
                <button
                  type="button"
                  onClick={() => setIsArrangeMode(false)}
                  className="bg-[#151010] text-white px-4 py-2.5 rounded-[12px] text-[12px] font-bold uppercase hover:bg-black transition-colors cursor-pointer"
                >
                  Done
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Category Pills (Daren & Curtis rounded pill styling) */}
        <div className="mb-10 flex items-center gap-2.5 flex-wrap pb-2">
          {VIDEO_CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            const count = categoryCounts[cat.id] ?? 0;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`text-[13px] font-bold px-4 py-2 rounded-full border-2 border-[#151010] transition-all flex items-center gap-2 cursor-pointer ${
                  isSelected
                    ? "bg-[#0039FF] text-white border-[#0039FF] shadow-[3px_3px_0px_#151010]"
                    : "bg-white text-[#151010] hover:bg-[#BEEBFD]"
                }`}
              >
                <span>{cat.label}</span>
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-bold ${
                    isSelected ? "bg-[#CEFF00] text-[#151010]" : "bg-[#151010]/10 text-[#151010]"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Video Grid */}
        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-auto"
        >
          <AnimatePresence mode="popLayout" initial={false}>
            {visible.map((item) => {
              const globalIndex = videos.findIndex((v) => v.id === item.id);
              return (
                <VideoTile
                  key={item.id}
                  item={item}
                  globalIndex={globalIndex}
                  isArrangeMode={isArrangeMode}
                  onMoveTop={() => handleMoveTop(globalIndex)}
                  onMoveUp={() => handleMoveUp(globalIndex)}
                  onMoveDown={() => handleMoveDown(globalIndex)}
                  onUpdateCategory={(c) => handleUpdateCategory(item.id, c)}
                  onUpdateRatio={(r) => handleUpdateRatio(item.id, r)}
                  onUpdateTitle={(t) => handleUpdateTitle(item.id, t)}
                  onDelete={() => handleDelete(item.id)}
                  canMoveUp={globalIndex > 0}
                  canMoveDown={globalIndex < videos.length - 1}
                />
              );
            })}
          </AnimatePresence>
        </motion.div>

        {/* See More Button (D&C Style) */}
        {hasMore && (
          <div className="mt-14 flex justify-center">
            <button
              type="button"
              onClick={() => setExpanded((v) => !v)}
              className="group inline-flex items-center gap-3 bg-[#CEFF00] hover:bg-[#d8ff26] text-[#151010] border-2 border-[#151010] px-8 py-4 rounded-[14px] text-[15px] font-extrabold tracking-wide uppercase transition-all shadow-[4px_4px_0px_#151010] hover:-translate-y-0.5 cursor-pointer"
            >
              <span>{expanded ? "See less ↑" : `See more (${filteredVideos.length - INITIAL_COUNT})`}</span>
              <ArrowIcon className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
