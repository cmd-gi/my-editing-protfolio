import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useVideoManager } from "./VideoManager";
import { HairlineGrid } from "./HairlineGrid";

const display = "font-display tracking-[-0.025em]";
const label = "font-mono text-[10px] tracking-[0.18em] uppercase";

// Exact order as provided by the user.
const VIDEO_URLS: string[] = [
  "https://res.cloudinary.com/drjczsj9l/video/upload/v1781955971/Final_Draft_3_xtgsqt.mp4",
  "https://res.cloudinary.com/drjczsj9l/video/upload/v1781955912/Sanchi_c1_ge74wi.mp4",
  "https://res.cloudinary.com/drjczsj9l/video/upload/v1779079702/e_tpkvuf.mp4",
  "https://res.cloudinary.com/drjczsj9l/video/upload/q_auto/f_auto/v1779079702/e_tpkvuf.mp4",
  "https://res.cloudinary.com/drjczsj9l/video/upload/v1781955733/Manvith_1_f7amco.mp4",
  "https://res.cloudinary.com/drjczsj9l/video/upload/v1781955666/d1_mullug.mp4",
  "https://res.cloudinary.com/drjczsj9l/video/upload/q_auto/f_auto/v1781956579/NEWEST_viral_editing_style_Linked_Comp_01_rmsbrz.mp4",
  "https://res.cloudinary.com/drjczsj9l/video/upload/q_auto/f_auto/v1779079788/Sanchi_2_nc_jqberd.mp4",
  "https://res.cloudinary.com/drjczsj9l/video/upload/q_auto/f_auto/v1781956482/class2_pxvdph.mp4",
  "https://res.cloudinary.com/drjczsj9l/video/upload/q_auto/f_auto/v1781956260/Shot_2_pvun8l.mp4",
  "https://res.cloudinary.com/drjczsj9l/video/upload/q_auto/f_auto/v1781955841/Classic_350_dt91un.mp4",
  "https://res.cloudinary.com/drjczsj9l/video/upload/q_auto/f_auto/v1781955724/Sanchi_3_r2675i.mp4",
  "https://res.cloudinary.com/drjczsj9l/video/upload/q_auto/f_auto/v1781955760/w_Walk_ow6x6a.mp4",
];

const INITIAL_COUNT = 6;

/** Pick a target height based on the visitor's network. Never drops below 480p. */
function pickQualityHeight(): number {
  if (typeof navigator === "undefined") return 1080;
  const conn = (navigator as unknown as { connection?: { effectiveType?: string; saveData?: boolean; downlink?: number } }).connection;
  if (!conn) return 1080;
  if (conn.saveData) return 480;
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

/** Rewrite a Cloudinary URL to apply auto quality/format + a height cap (min 480p). */
function optimizedSrc(url: string, height: number): string {
  const h = Math.max(480, height);
  return url.replace(
    /\/video\/upload\/(?:[^/]+\/)*?(v\d+\/)/,
    `/video/upload/q_auto:good,f_auto,h_${h},c_limit/$1`,
  );
}

/** Build a Cloudinary still-frame poster from the source MP4 URL. */
function posterFor(url: string) {
  return url
    .replace(/\/video\/upload\/(?:[^/]+\/)*?(v\d+\/)/, "/video/upload/so_1,w_900,c_fill,q_auto,f_jpg/$1")
    .replace(/\.mp4$/, ".jpg");
}

function VideoTile({ src, index }: { src: string; index: number }) {
  const ref = useRef<HTMLVideoElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const { register, play } = useVideoManager();
  const [playing, setPlaying] = useState(false);
  const [orientation, setOrientation] = useState<"landscape" | "portrait" | "square">("landscape");
  const [optimized] = useState(() => optimizedSrc(src, pickQualityHeight()));

  useEffect(() => {
    if (!ref.current) return;
    return register(ref.current);
  }, [register]);

  // Pause when scrolled out of view (in addition to global tab-hidden handling).
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting && !el.paused) el.pause();
      },
      { threshold: 0.35 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const onMeta = () => {
    const el = ref.current;
    if (!el) return;
    const w = el.videoWidth;
    const h = el.videoHeight;
    if (!w || !h) return;
    if (h > w * 1.05) setOrientation("portrait");
    else if (w > h * 1.05) setOrientation("landscape");
    else setOrientation("square");
  };

  const toggle = () => {
    const el = ref.current;
    if (!el) return;
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
    const wrap = wrapRef.current;
    if (!el) return;
    try {
      // iOS Safari: only the video element supports fullscreen via webkit API.
      const anyEl = el as HTMLVideoElement & { webkitEnterFullscreen?: () => void };
      if (anyEl.webkitEnterFullscreen) {
        anyEl.webkitEnterFullscreen();
        return;
      }
      const target = wrap ?? el;
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      } else {
        await target.requestFullscreen();
      }
    } catch {
      /* ignore — fullscreen denied */
    }
  };

  const aspect =
    orientation === "portrait"
      ? "aspect-[9/16]"
      : orientation === "square"
        ? "aspect-square"
        : "aspect-video";

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.45, delay: (index % 6) * 0.04 }}
      className={`group relative bg-charcoal border border-paper/[0.06] hover:border-lime/40 transition-colors overflow-hidden ${
        orientation === "portrait" ? "md:row-span-2" : ""
      }`}
    >
      <div ref={wrapRef} className={`relative w-full ${aspect} bg-void`}>
        <video
          ref={ref}
          src={optimized}
          poster={posterFor(src)}
          playsInline
          preload="metadata"
          onLoadedMetadata={onMeta}
          onClick={toggle}
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          className="absolute inset-0 w-full h-full object-cover cursor-pointer"
        />
        {!playing && (
          <button
            type="button"
            onClick={toggle}
            aria-label="Play video"
            className="absolute inset-0 flex items-center justify-center bg-void/25 hover:bg-void/40 transition-colors"
          >
            <span className="w-16 h-16 rounded-full border border-paper/70 flex items-center justify-center backdrop-blur-sm bg-void/40 group-hover:scale-105 transition-transform">
              <span className="block w-0 h-0 border-y-[9px] border-y-transparent border-l-[14px] border-l-paper ml-1" />
            </span>
          </button>
        )}
        <span className={`absolute top-3 left-3 ${label} bg-void/70 text-paper px-2 py-1`}>
          {String(index + 1).padStart(2, "0")}
        </span>
        <span className={`absolute top-3 right-3 ${label} bg-void/70 text-lime px-2 py-1`}>
          {orientation === "portrait" ? "9:16" : orientation === "square" ? "1:1" : "16:9"}
        </span>
        <button
          type="button"
          onClick={goFullscreen}
          aria-label="Play fullscreen"
          className="absolute bottom-3 right-3 z-10 inline-flex items-center justify-center w-9 h-9 bg-void/70 hover:bg-lime hover:text-paper text-paper border border-paper/30 transition-colors"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square">
            <path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" />
          </svg>
        </button>
      </div>
    </motion.article>
  );
}

export function VideosSection() {
  const [expanded, setExpanded] = useState(false);
  const visible = expanded ? VIDEO_URLS : VIDEO_URLS.slice(0, INITIAL_COUNT);
  const hasMore = VIDEO_URLS.length > INITIAL_COUNT;

  return (
    <section id="videos" className="relative bg-void text-paper py-[14vh] px-[5vw] md:px-[3vw]">
      <HairlineGrid />
      <div className="relative z-20">
        <div className="grid grid-cols-12 gap-6 mb-12">
          <div className="col-span-12 md:col-span-2">
            <div className="font-mono text-[11px] tracking-[0.18em] uppercase text-ash flex items-center gap-2">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-lime animate-pulse" />
              <span className="text-lime">003</span>
              <span className="text-paper/30">/</span>
              <span>Videos</span>
            </div>
          </div>
          <div className="col-span-12 md:col-span-10">
            <h2 className={`${display} font-black leading-[0.9] text-[clamp(2.5rem,8vw,8rem)] text-paper lowercase`}>
              the <span className="text-lime italic">edits</span>.
            </h2>
            <p className="mt-6 text-[14px] leading-[1.65] text-ash max-w-[52ch]">
              A reel of recent cuts — brand films, short-form and a few experiments. Tap any tile to play;
              only one runs at a time, and they pause when they leave your screen.
            </p>
          </div>
        </div>

        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 auto-rows-auto"
        >
          <AnimatePresence mode="popLayout" initial={false}>
            {visible.map((src, i) => (
              <VideoTile key={src + i} src={src} index={i} />
            ))}
          </AnimatePresence>
        </motion.div>

        {hasMore && (
          <div className="mt-10 flex justify-center">
            <button
              type="button"
              onClick={() => setExpanded((v) => !v)}
              className="inline-flex items-center gap-2 border border-lime text-lime px-6 py-3 font-mono text-[11px] tracking-[0.2em] uppercase hover:bg-lime hover:text-paper transition-colors"
            >
              {expanded ? "See less ↑" : `See more (${VIDEO_URLS.length - INITIAL_COUNT}) ↓`}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
