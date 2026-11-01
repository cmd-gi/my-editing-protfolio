import { useEffect, useRef, useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useVideoManager } from "./VideoManager";
import { HairlineGrid } from "./HairlineGrid";
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

const display = "font-display tracking-[-0.025em]";
const label = "font-mono text-[10px] tracking-[0.18em] uppercase";

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
    ? "fixed inset-0 z-50 flex items-center justify-center bg-void"
    : `relative w-full ${aspect} bg-void`;

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
      className={`group relative bg-charcoal border transition-all overflow-hidden ${
        isArrangeMode
          ? "border-lime/60 ring-2 ring-lime/20"
          : "border-paper/[0.06] hover:border-lime/40"
      } ${declaredRatio === "9:16" ? "md:row-span-2" : ""}`}
    >
      {/* ── ARRANGE MODE TOOLBAR (TOP OVERLAY) ── */}
      {isArrangeMode && (
        <div className="z-30 bg-charcoal/95 border-b border-paper/10 p-2 text-xs flex flex-col gap-1.5 backdrop-blur-md">
          <div className="flex items-center justify-between gap-1 text-[11px] font-mono">
            <span className="bg-lime text-void px-1.5 py-0.5 font-bold rounded-xs tracking-wider">
              #{String(globalIndex + 1).padStart(2, "0")}
            </span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={onMoveTop}
                title="Move straight to top of portfolio (#1)"
                className="bg-signal text-paper px-2 py-0.5 font-semibold text-[10px] uppercase tracking-wider hover:brightness-110 flex items-center gap-1 shadow-xs cursor-pointer"
              >
                ★ Top
              </button>
              <button
                type="button"
                disabled={!canMoveUp}
                onClick={onMoveUp}
                title="Move up one position"
                className="bg-paper/10 hover:bg-paper/20 disabled:opacity-30 disabled:pointer-events-none text-paper px-1.5 py-0.5 text-[10px] cursor-pointer"
              >
                ▲
              </button>
              <button
                type="button"
                disabled={!canMoveDown}
                onClick={onMoveDown}
                title="Move down one position"
                className="bg-paper/10 hover:bg-paper/20 disabled:opacity-30 disabled:pointer-events-none text-paper px-1.5 py-0.5 text-[10px] cursor-pointer"
              >
                ▼
              </button>
              <button
                type="button"
                onClick={onDelete}
                title="Remove video from portfolio"
                className="bg-red-500/20 text-red-400 hover:bg-red-500/40 px-1.5 py-0.5 text-[10px] cursor-pointer"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Category & Ratio controls */}
          <div className="grid grid-cols-2 gap-1.5 pt-0.5">
            <select
              value={category}
              onChange={(e) => onUpdateCategory(e.target.value as VideoCategory)}
              className="bg-void border border-paper/20 text-[10px] font-mono text-paper px-1 py-1 rounded-xs focus:outline-none focus:border-lime cursor-pointer"
            >
              {VIDEO_CATEGORIES.filter((c) => c.id !== "all").map((c) => (
                <option key={c.id} value={c.id} className="bg-void text-paper">
                  {c.label}
                </option>
              ))}
            </select>

            <button
              type="button"
              onClick={() => onUpdateRatio(declaredRatio === "9:16" ? "16:9" : "9:16")}
              className="bg-void border border-paper/20 text-[10px] font-mono text-lime hover:border-lime px-1 py-1 text-center cursor-pointer"
            >
              Ratio: {declaredRatio}
            </button>
          </div>

          {/* Title Editor */}
          {isEditingTitle ? (
            <form onSubmit={handleTitleSubmit} className="flex gap-1 pt-1">
              <input
                type="text"
                value={titleDraft}
                onChange={(e) => setTitleDraft(e.target.value)}
                autoFocus
                className="flex-1 bg-void border border-lime text-[11px] text-paper px-1.5 py-0.5 font-mono focus:outline-none"
              />
              <button type="submit" className="bg-lime text-void px-2 py-0.5 text-[10px] font-bold cursor-pointer">
                ✓
              </button>
            </form>
          ) : (
            <div
              onClick={() => setIsEditingTitle(true)}
              className="flex items-center justify-between text-[11px] text-paper/80 font-mono hover:text-lime cursor-pointer truncate pt-0.5"
              title="Click to edit title"
            >
              <span className="truncate">{title}</span>
              <span className="text-[9px] text-ash underline ml-1">edit</span>
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
        {!playing && (
          <button
            type="button"
            onClick={toggle}
            aria-label={`Play ${title}`}
            className="absolute inset-0 flex items-center justify-center bg-void/25 hover:bg-void/40 transition-colors"
          >
            <span className="w-16 h-16 rounded-full border border-paper/70 flex items-center justify-center bg-void/60 group-hover:scale-105 transition-transform">
              <span className="block w-0 h-0 border-y-[9px] border-y-transparent border-l-[14px] border-l-paper ml-1" />
            </span>
          </button>
        )}

        {/* Normal Badges (Hidden in arrange mode to reduce clutter) */}
        {!isArrangeMode && (
          <>
            <span className={`absolute top-3 left-3 ${label} bg-void/70 text-paper px-2 py-1`}>
              {String(globalIndex + 1).padStart(2, "0")}
            </span>
            <span className={`absolute top-3 right-3 ${label} bg-void/70 text-lime px-2 py-1`}>
              {declaredRatio}
            </span>
            {title && (
              <div className="absolute bottom-3 left-3 right-14 z-10 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="bg-void/80 backdrop-blur-xs text-paper/90 px-2.5 py-1 text-[11px] font-mono truncate inline-block max-w-full">
                  {title}
                </span>
              </div>
            )}
          </>
        )}

        {/* Fullscreen Button */}
        <button
          type="button"
          onClick={goFullscreen}
          aria-label="Play fullscreen"
          className="absolute bottom-3 right-3 z-10 inline-flex items-center justify-center w-9 h-9 bg-void/70 hover:bg-lime hover:text-paper text-paper border border-paper/30 transition-colors cursor-pointer"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square">
            <path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" />
          </svg>
        </button>
      </div>
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

  // Initialize from LocalStorage if present
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

  // Save to LocalStorage whenever videos order/attributes change
  const updateVideos = (newVideos: VideoItem[]) => {
    setVideos(newVideos);
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newVideos));
    } catch {
      /* ignore */
    }
  };

  // Reordering handlers
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

  // Filtered items based on active category
  const filteredVideos = useMemo(() => {
    if (selectedCategory === "all") return videos;
    return videos.filter((v) => v.category === selectedCategory);
  }, [videos, selectedCategory]);

  // In arrange mode, show all filtered items so user can reorder easily; otherwise paginate
  const visible = isArrangeMode
    ? filteredVideos
    : expanded
    ? filteredVideos
    : filteredVideos.slice(0, INITIAL_COUNT);

  const hasMore = !isArrangeMode && filteredVideos.length > INITIAL_COUNT;

  // Category counts map
  const categoryCounts = useMemo(() => {
    const map: Record<string, number> = { all: videos.length };
    for (const v of videos) {
      map[v.category] = (map[v.category] || 0) + 1;
    }
    return map;
  }, [videos]);

  return (
    <section id="videos" className="relative bg-void text-paper py-[14vh] px-[5vw] md:px-[3vw]">
      <HairlineGrid />
      <div className="relative z-20">
        {/* Header */}
        <div className="grid grid-cols-12 gap-6 mb-8">
          <div className="col-span-12 md:col-span-2">
            <div className="font-mono text-[11px] tracking-[0.18em] uppercase text-ash flex items-center gap-2">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-lime animate-pulse" />
              <span className="text-lime">003</span>
              <span className="text-paper/30">/</span>
              <span>Videos</span>
            </div>
          </div>
          <div className="col-span-12 md:col-span-7">
            <h2 className={`${display} font-black leading-[0.9] text-[clamp(2.5rem,8vw,8rem)] text-paper lowercase`}>
              the <span className="text-lime italic">edits</span>.
            </h2>
            <p className="mt-6 text-[14px] leading-[1.65] text-ash max-w-[52ch]">
              Commercial edits, real estate showcases, food & hospitality, healthcare campaigns, and motion design.
              Tap any tile to play — one video at a time, adaptive quality.
            </p>
          </div>

          {/* Arrange Mode Toggle Button (Can be permanently hidden via ENABLE_ARRANGE_MODE) */}
          {ENABLE_ARRANGE_MODE && (
            <div className="col-span-12 md:col-span-3 flex md:justify-end items-start pt-2">
              <button
                type="button"
                onClick={() => setIsArrangeMode((v) => !v)}
                className={`inline-flex items-center gap-2 px-4 py-2.5 font-mono text-[11px] tracking-[0.18em] uppercase transition-all border cursor-pointer ${
                  isArrangeMode
                    ? "bg-lime text-void border-lime font-bold shadow-[0_0_20px_rgba(204,255,0,0.4)]"
                    : "border-paper/20 text-paper/80 hover:border-lime hover:text-lime"
                }`}
              >
                <span>{isArrangeMode ? "✕ Exit Arrange" : "⇄ Arrange Videos"}</span>
                {isArrangeMode && <span className="w-2 h-2 rounded-full bg-signal animate-ping" />}
              </button>
            </div>
          )}
        </div>

        {/* ── ARRANGE MODE DOCK / BANNER ── */}
        {ENABLE_ARRANGE_MODE && isArrangeMode && (
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            className="mb-8 p-4 bg-charcoal border-2 border-lime/80 shadow-[0_4px_30px_rgba(0,0,0,0.6)]"
          >
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-lime animate-pulse" />
                  <span className="font-mono text-[12px] font-bold text-lime uppercase tracking-widest">
                    Arrange & Edit Mode Active
                  </span>
                  <span className="text-[11px] font-mono text-ash">
                    ({videos.length} videos total)
                  </span>
                </div>
                <p className="text-[12px] text-paper/70 font-mono mt-1">
                  Click <strong className="text-signal">★ Top</strong> to place any video at #1, use ▲/▼ to reorder, or change categories. Then click <strong className="text-lime">Save to Codebase</strong>.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  disabled={isSaving}
                  onClick={handleSaveToCodebase}
                  className="bg-lime text-void px-4 py-2 font-mono text-[11px] tracking-[0.15em] font-black uppercase hover:brightness-110 transition-all shadow-[2px_2px_0_0_#fff] flex items-center gap-2 cursor-pointer"
                >
                  {isSaving ? "Saving..." : "💾 Save to Codebase"}
                </button>
                <button
                  type="button"
                  onClick={handleCopyCode}
                  className="border border-paper/20 hover:border-paper text-paper px-3 py-2 font-mono text-[11px] tracking-[0.15em] uppercase transition-colors cursor-pointer"
                >
                  📋 Copy Code
                </button>
                <button
                  type="button"
                  onClick={handleResetToCodebase}
                  className="border border-paper/20 hover:border-red-400 text-ash hover:text-red-400 px-3 py-2 font-mono text-[11px] tracking-[0.15em] uppercase transition-colors cursor-pointer"
                >
                  ↺ Reset
                </button>
                <button
                  type="button"
                  onClick={() => setIsArrangeMode(false)}
                  className="bg-paper/10 hover:bg-paper/20 text-paper px-3 py-2 font-mono text-[11px] tracking-[0.15em] uppercase transition-colors cursor-pointer"
                >
                  Done
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* ── CATEGORY FILTER PILLS ── */}
        <div className="mb-10 flex items-center gap-2 flex-wrap pb-2 border-b border-paper/[0.08]">
          {VIDEO_CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            const count = categoryCounts[cat.id] ?? 0;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`font-mono text-[11px] tracking-[0.15em] uppercase px-3.5 py-2 transition-all flex items-center gap-2 border cursor-pointer ${
                  isSelected
                    ? "bg-lime text-void border-lime font-bold shadow-[2px_2px_0_0_rgba(255,255,255,0.2)]"
                    : "border-paper/15 text-ash hover:border-lime/50 hover:text-paper bg-void/50"
                }`}
              >
                <span>{cat.label}</span>
                <span
                  className={`text-[9px] px-1.5 py-0.2 rounded-full ${
                    isSelected ? "bg-void text-lime font-semibold" : "bg-paper/10 text-ash"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* ── VIDEO TILES GRID ── */}
        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 auto-rows-auto"
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

        {/* ── SEE MORE / SEE LESS ── */}
        {hasMore && (
          <div className="mt-12 flex justify-center">
            <button
              type="button"
              onClick={() => setExpanded((v) => !v)}
              className="inline-flex items-center gap-2 border border-lime text-lime px-8 py-3.5 font-mono text-[11px] tracking-[0.2em] uppercase hover:bg-lime hover:text-paper transition-colors font-semibold cursor-pointer"
            >
              {expanded
                ? "See less ↑"
                : `See more (${filteredVideos.length - INITIAL_COUNT} remaining) ↓`}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
