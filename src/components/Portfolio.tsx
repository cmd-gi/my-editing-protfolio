import portraitHero from "@/assets/heo-portait.png";
import { motion, useScroll, useTransform, AnimatePresence } from "motion/react";
import { lazy, Suspense, useRef, useState } from "react";
import { VideoProvider } from "./VideoManager";
import { Marquee, BlurFade } from "./magic";
import { portfolio } from "@/lib/portfolio-data";
import { VideosSection } from "./VideosSection";
import { useIsMobile } from "@/hooks/use-mobile";
import { DecorationStar } from "./daren-curtis/DecorationStar";
import { ArrowIcon } from "./daren-curtis/ArrowIcon";

const ROBOT_SCENE_URL = "https://prod.spline.design/PyzDhpQ9E5f1E3MT/scene.splinecode";
const InteractiveRobotSpline = lazy(() =>
  import("./ui/interactive-3d-robot").then((mod) => ({ default: mod.InteractiveRobotSpline })),
);

function PhaseBadge({ n, label }: { n: string; label: string }) {
  return (
    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#151010]/20 bg-white text-[12px] font-mono uppercase tracking-wider text-[#0039FF] font-bold shadow-xs">
      <span className="w-2 h-2 rounded-full bg-[#0039FF] animate-pulse" />
      <span>{n}</span>
      <span className="text-[#151010]/30">/</span>
      <span>{label}</span>
    </div>
  );
}

/* ─────────────── HERO (DAREN & CURTIS BANNER BIG STYLE) ─────────────── */
function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const textY = useTransform(scrollYProgress, [0, 1], [0, -80]);
  const imgY = useTransform(scrollYProgress, [0, 1], [0, 60]);

  return (
    <section id="top" ref={ref} className="relative min-h-screen w-full bg-[#FFF7EC] text-[#151010] overflow-hidden pt-24 md:pt-32 pb-16 px-4 sm:px-6 lg:px-12 flex flex-col justify-between">
      {/* Decorative Star */}
      <div className="absolute top-28 right-8 md:right-24 hidden sm:block pointer-events-none z-10">
        <DecorationStar className="w-16 h-14 md:w-20 md:h-16 animate-dc-float" fill="#CEFF00" stroke="#151010" />
      </div>

      <div className="max-w-[1600px] mx-auto w-full relative z-20 my-auto">
        <div className="grid grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Text */}
          <motion.div style={{ y: textY }} className="col-span-12 lg:col-span-7 flex flex-col justify-center">
            <div className="mb-6">
              <PhaseBadge n="001" label="Reel / 2026" />
            </div>

            <h1 className="text-[clamp(3.2rem,8.5vw,7.5rem)] font-black leading-[0.92] tracking-[-0.03em] text-[#0039FF] uppercase">
              Video <span className="text-[#151010]">Editing</span><br />
              <span className="text-[#151010] inline-flex items-center gap-3">
                &amp; Motion
                <span className="text-3xl sm:text-4xl">✺</span>
              </span>
            </h1>

            <div className="mt-4 flex items-center gap-3 flex-wrap">
              <span className="inline-block bg-[#CEFF00] border-2 border-[#151010] text-[#151010] px-3.5 py-1 rounded-[10px] text-[12px] font-extrabold uppercase tracking-wide shadow-[3px_3px_0px_#151010]">
                ★ Open for New Briefs
              </span>
              <span className="text-[15px] font-semibold text-[#151010]/80">
                with Real Storytelling &amp; Cinematic Results
              </span>
            </div>

            <p className="mt-6 text-[16px] md:text-[18px] leading-[1.65] text-[#151010]/80 max-w-[54ch] font-medium">
              Hi, I'm Charan — Video Editor, Colorist, and Motion Designer based in Bengaluru. Crafting commercial brand films, viral reels, and high-retention social content that converts.
            </p>

            {/* Daren & Curtis style CTA buttons */}
            <div className="mt-8 flex items-center gap-4 flex-wrap">
              <a
                href="#videos"
                className="group inline-flex items-center gap-3 bg-[#CEFF00] hover:bg-[#d8ff26] text-[#151010] border-2 border-[#151010] px-7 py-4 rounded-[14px] text-[15px] font-extrabold tracking-wide uppercase transition-all shadow-[4px_4px_0px_#151010] hover:-translate-y-0.5 cursor-pointer"
              >
                <span>Explore Works</span>
                <ArrowIcon className="w-4 h-4" />
              </a>

              <a
                href="#contact"
                className="inline-flex items-center gap-2 bg-white hover:bg-[#BEEBFD] text-[#151010] border-2 border-[#151010] px-6 py-4 rounded-[14px] text-[15px] font-extrabold tracking-wide uppercase transition-all shadow-[3px_3px_0px_#151010] hover:-translate-y-0.5 cursor-pointer"
              >
                <span>Get in Touch</span>
              </a>
            </div>

            {/* Quick highlight pills */}
            <div className="mt-10 pt-6 border-t border-[#151010]/15 flex items-center gap-6 flex-wrap text-xs font-mono font-bold text-[#151010]/70">
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#0039FF]" />
                Commercial &amp; Brand Ads
              </span>
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#CEFF00]" />
                Short-Form Reels
              </span>
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#0039FF]" />
                Color Grading &amp; VFX
              </span>
            </div>
          </motion.div>

          {/* Right Portrait (Daren & Curtis Framed Card) */}
          <motion.div
            style={{ y: imgY }}
            className="col-span-12 lg:col-span-5 relative flex justify-center"
          >
            <div className="relative w-full max-w-[460px] aspect-[4/5] rounded-[28px] border-3 border-[#151010] overflow-hidden bg-white shadow-[8px_8px_0px_#151010]">
              <img
                src={portraitHero}
                alt="Charan — Video Editor & Colorist"
                className="w-full h-full object-cover object-top grayscale contrast-125"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#151010]/40 via-transparent to-transparent pointer-events-none" />

              {/* Floating Badge */}
              <div className="absolute bottom-5 left-5 right-5 bg-white/95 backdrop-blur-sm border-2 border-[#151010] rounded-[16px] p-3.5 flex items-center justify-between shadow-[3px_3px_0px_#151010]">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#0039FF] font-bold block">
                    Lead Editor
                  </span>
                  <span className="text-[14px] font-black text-[#151010]">
                    Charan · Bengaluru
                  </span>
                </div>
                <a
                  href="#videos"
                  className="w-9 h-9 rounded-full bg-[#CEFF00] border border-[#151010] flex items-center justify-center hover:scale-110 transition-transform"
                  aria-label="View Reel"
                >
                  <ArrowIcon className="w-3.5 h-3.5 text-[#151010]" />
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────── MARQUEE TICKER (D&C LIGHT-BLUE / BLUE STRIPE) ─────────────── */
function CreditsTicker() {
  const credits = [
    "DaVinci Resolve",
    "Adobe After Effects",
    "Premiere Pro",
    "Color Grading",
    "High-Retention Reels",
    "Motion Graphics",
    "Brand Storytelling",
    "Sound Design",
    "Photoshop & Lightroom",
    "AI Creative Tools",
  ];
  return (
    <div className="relative bg-[#BEEBFD] text-[#151010] border-y-2 border-[#151010] overflow-hidden py-3">
      <Marquee speed={36} className="py-2">
        {credits.map((c) => (
          <span
            key={c}
            className="inline-flex items-center gap-5 font-black uppercase text-[clamp(1.25rem,2.5vw,2rem)] tracking-tight mx-4 select-none"
          >
            {c}
            <span className="text-[#0039FF] text-2xl font-normal">✺</span>
          </span>
        ))}
      </Marquee>
    </div>
  );
}

/* ─────────────── ABOUT ─────────────── */
const expertise = [
  "Cinematic Video Editing",
  "Promotional Commercial Ads",
  "Professional Color Grading",
  "Motion Graphics & Titles",
  "High-Converting Short Form",
  "Speed Ramping & Sound Design",
  "Photo Retouching & Posters",
  "Visual Campaign Direction",
];

const tools = {
  "Edit & Post": ["DaVinci Resolve", "Adobe After Effects", "Photoshop", "Lightroom", "CapCut"],
  "AI & Generative": ["Google Flow", "Higgsfield", "Runway", "Kling", "Veo"],
};

function About() {
  const isMobile = useIsMobile();
  const showRobotStage = !isMobile;

  return (
    <section id="about" className="relative bg-[#FFF7EC] text-[#151010] py-24 md:py-32 px-4 sm:px-6 lg:px-12">
      <div className="max-w-[1600px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
          {/* Left Robot Stage */}
          {showRobotStage ? (
            <div className="lg:col-span-5 relative">
              <div className="relative w-full h-full min-h-[500px] bg-white border-2 border-[#151010] rounded-[24px] overflow-hidden shadow-[6px_6px_0px_#151010] p-6 flex flex-col justify-between">
                <div className="flex items-center justify-between z-20">
                  <span className="text-[11px] font-mono font-bold uppercase text-[#0039FF] bg-[#BEEBFD] px-2.5 py-1 rounded-full border border-[#151010]/20">
                    Interactive 3D
                  </span>
                  <span className="text-[11px] font-mono text-[#151010]/60">Drag · Poke · Play</span>
                </div>

                <Suspense
                  fallback={
                    <div className="flex-1 flex items-center justify-center text-center">
                      <div className="font-mono text-xs text-[#151010]/60">Loading Whobee 3D...</div>
                    </div>
                  }
                >
                  <div className="absolute inset-0 pt-10">
                    <InteractiveRobotSpline scene={ROBOT_SCENE_URL} className="!w-full !h-full" />
                  </div>
                </Suspense>

                <div className="z-20 flex items-center justify-between pt-4">
                  <span className="bg-[#CEFF00] border border-[#151010] text-[#151010] font-extrabold text-[10px] px-2 py-0.5 rounded-md uppercase tracking-wider">
                    ★ Studio Mascot
                  </span>
                </div>

                {/* Cover spline badge */}
                <div aria-hidden className="absolute bottom-0 right-0 z-20 w-[180px] h-[50px] bg-white pointer-events-none" />
              </div>
            </div>
          ) : null}

          {/* Right Text */}
          <div className={`${showRobotStage ? "lg:col-span-7" : "lg:col-span-12"} flex flex-col justify-between`}>
            <div>
              <PhaseBadge n="002" label="About Me" />

              <BlurFade className="mt-8">
                <h2 className="text-[clamp(2.5rem,6vw,5rem)] font-black leading-[1.0] text-[#0039FF] tracking-tight">
                  Hey, I'm <span className="text-[#151010] underline decoration-[#CEFF00] decoration-wavy decoration-4">Charan</span> 👋
                </h2>
                <p className="mt-6 text-[16px] md:text-[18px] leading-[1.7] text-[#151010]/85 font-medium max-w-[56ch]">
                  Video editor, colorist, and motion designer based in Bengaluru. Equal parts visual storyteller, pacing fanatic, and keyframe nerd. I help creators, brands, and agencies craft edits that hook audiences in the first 2 seconds and keep them glued to the finish.
                </p>
              </BlurFade>

              {/* Expertise Pills */}
              <div className="mt-10">
                <h3 className="text-xs font-mono uppercase tracking-widest text-[#0039FF] font-bold mb-4">
                  // Core Expertise
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {expertise.map((e) => (
                    <div
                      key={e}
                      className="bg-white border-2 border-[#151010] rounded-[14px] p-3.5 flex items-center justify-between hover:bg-[#BEEBFD]/50 transition-colors shadow-xs"
                    >
                      <span className="font-bold text-[14px] text-[#151010]">{e}</span>
                      <span className="w-6 h-6 rounded-full bg-[#CEFF00] border border-[#151010] flex items-center justify-center text-[10px] font-bold">
                        ✓
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tools Pills */}
              <div className="mt-10">
                <h3 className="text-xs font-mono uppercase tracking-widest text-[#0039FF] font-bold mb-4">
                  // Tools &amp; Software
                </h3>
                <div className="flex flex-wrap gap-2.5">
                  {Object.values(tools).flat().map((t) => (
                    <span
                      key={t}
                      className="bg-white border-2 border-[#151010] px-4 py-2 rounded-full text-[13px] font-bold text-[#151010] hover:bg-[#CEFF00] transition-colors shadow-xs"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────── EXPERIENCE (DAREN & CURTIS CONTRASTING BLUE SECTION WITH WAVES) ─────────────── */
const experience = [
  {
    company: "Sociofy Agency",
    role: "Video Editor · Full-Time (5 Months)",
    location: "Bengaluru",
    bullets: [
      "Worked full-time as video editor at Sociofy digital marketing agency in Bengaluru.",
      "Cut high-converting social media ads, commercial brand films, and viral Instagram reels.",
      "Handled end-to-end post-production: pacing, sound design, motion graphics, kinetic typography, and color grading.",
      "Collaborated with marketing strategists and creative directors to craft high-retention video content for diverse clients.",
    ],
  },
  {
    company: "Sanchi Atelier",
    role: "Video Editor & Creative Designer",
    location: "Bengaluru",
    bullets: [
      "Edited promotional videos and brand content for digital platforms.",
      "Created cinematic edits with professional color grading.",
      "Produced short-form content for Instagram Reels and social media.",
      "Applied speed ramping, transitions, and motion graphics.",
      "Retouched photos and marketing assets using Photoshop and Lightroom.",
      "Collaborated with the creative team to deliver engaging visual content.",
    ],
  },
  {
    company: "Freelance & College Projects",
    role: "Video Editor",
    location: "Bengaluru",
    bullets: [
      "Edited promos, event highlights, reels, and short videos.",
      "Managed post-production from edit to delivery.",
      "Created recap videos for fests, workshops, and events.",
      "Added motion graphics, effects, and transitions.",
      "Used Flow and Higgsfield to streamline workflows.",
      "Adapted content for different brands and audiences.",
    ],
  },
];

function Experience() {
  return (
    <section id="experience" className="relative bg-[#0039FF] text-white py-28 md:py-36 px-4 sm:px-6 lg:px-12 overflow-hidden">
      {/* Animated Wave Top Divider */}
      <div className="wave-top-blue" />

      <div className="max-w-[1600px] mx-auto relative z-20">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/30 bg-white/10 text-[12px] font-mono uppercase tracking-wider text-[#CEFF00] font-bold mb-4">
              <span className="w-2 h-2 rounded-full bg-[#CEFF00] animate-pulse" />
              <span>004 / Track Record</span>
            </div>
            <h2 className="text-[clamp(2.75rem,7vw,6.5rem)] font-black leading-[0.95] text-white tracking-tight">
              Places That <span className="text-[#CEFF00]">Trusted</span><br />
              Me With The <span className="underline decoration-[#CEFF00] decoration-wavy decoration-4">Scissors</span>.
            </h2>
          </div>
          <p className="text-white/80 font-medium text-[16px] max-w-[42ch]">
            From agency fast-turnaround performance reels to brand films and creative direction.
          </p>
        </div>

        {/* Experience Cards (Daren & Curtis Service List style) */}
        <div className="space-y-6">
          {experience.map((job, i) => (
            <motion.div
              key={job.company}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="bg-white text-[#151010] border-2 border-[#151010] rounded-[22px] p-6 sm:p-8 lg:p-10 shadow-[6px_6px_0px_#151010] hover:shadow-[8px_8px_0px_#151010] hover:-translate-y-1 transition-all"
            >
              <div className="grid grid-cols-12 gap-6 items-start">
                <div className="col-span-12 md:col-span-4">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="w-8 h-8 rounded-full bg-[#CEFF00] border-2 border-[#151010] font-mono text-[13px] font-black flex items-center justify-center">
                      0{i + 1}
                    </span>
                    <span className="text-[11px] font-mono uppercase tracking-wider text-[#0039FF] font-extrabold">
                      {job.location}
                    </span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-black text-[#151010] mt-1">
                    {job.company}
                  </h3>
                  <div className="mt-1 text-sm font-bold text-[#0039FF]">
                    {job.role}
                  </div>
                </div>

                <div className="col-span-12 md:col-span-8 md:pl-6 md:border-l border-[#151010]/15">
                  <ul className="space-y-2.5">
                    {job.bullets.map((b) => (
                      <li key={b} className="flex items-start gap-3 text-[14px] sm:text-[15px] font-medium text-[#151010]/85 leading-relaxed">
                        <span className="text-[#0039FF] text-base leading-none mt-1">▶</span>
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Animated Wave Bottom Divider */}
      <div className="wave-bottom-blue" />
    </section>
  );
}

/* ─────────────── POSTERS & DESIGN GALLERY ─────────────── */
const INITIAL_POSTERS = 8;

function PortfolioGrid() {
  const [lightbox, setLightbox] = useState<string | null>(null);
  const [expanded, setExpanded] = useState(false);

  const visible = expanded ? portfolio : portfolio.slice(0, INITIAL_POSTERS);
  const hasMore = portfolio.length > INITIAL_POSTERS;

  return (
    <section id="portfolio" className="relative bg-[#FFF7EC] text-[#151010] py-24 md:py-32 px-4 sm:px-6 lg:px-12">
      <div className="max-w-[1600px] mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <PhaseBadge n="005" label="Print & Social" />
            <h2 className="text-[clamp(2.75rem,7vw,6.5rem)] font-black leading-[0.95] text-[#0039FF] tracking-tight mt-4">
              Posters &amp; <span className="text-[#151010] underline decoration-[#CEFF00] decoration-wavy decoration-4">Artwork</span>.
            </h2>
            <p className="mt-4 text-[16px] md:text-[18px] text-[#151010]/80 font-medium max-w-[50ch]">
              Print, event branding, social campaign banners, and design collateral. Tap any poster to view full size.
            </p>
          </div>
        </div>

        <motion.div layout className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
          <AnimatePresence mode="popLayout" initial={false}>
            {visible.map((p, i) => (
              <motion.button
                key={p.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.35, delay: (i % 6) * 0.04 }}
                type="button"
                onClick={() => setLightbox(p.thumbnail)}
                className="group relative bg-white border-2 border-[#151010] rounded-[20px] overflow-hidden aspect-[3/4] shadow-[4px_4px_0px_#151010] hover:shadow-[6px_6px_0px_#151010] hover:-translate-y-1 transition-all cursor-pointer"
                aria-label={`Open ${p.title}`}
              >
                <img
                  src={p.thumbnail}
                  alt={p.title}
                  loading="lazy"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />

                <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-xs text-[#151010] font-mono text-[10px] font-bold px-2.5 py-1 rounded-full border border-[#151010]/20 shadow-xs">
                  {String(i + 1).padStart(2, "0")}
                </span>

                <div className="absolute inset-0 bg-[#0039FF]/0 group-hover:bg-[#0039FF]/20 transition-colors flex items-center justify-center">
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity w-12 h-12 rounded-full bg-[#CEFF00] border-2 border-[#151010] flex items-center justify-center shadow-[2px_2px_0px_#151010]">
                    <ArrowIcon className="w-4 h-4 text-[#151010]" />
                  </span>
                </div>
              </motion.button>
            ))}
          </AnimatePresence>
        </motion.div>

        {hasMore && (
          <div className="mt-12 flex justify-center">
            <button
              type="button"
              onClick={() => setExpanded((v) => !v)}
              className="group inline-flex items-center gap-3 bg-[#CEFF00] hover:bg-[#d8ff26] text-[#151010] border-2 border-[#151010] px-8 py-4 rounded-[14px] text-[15px] font-extrabold tracking-wide uppercase transition-all shadow-[4px_4px_0px_#151010] hover:-translate-y-0.5 cursor-pointer"
            >
              <span>{expanded ? "See less ↑" : `See more (${portfolio.length - INITIAL_POSTERS})`}</span>
              <ArrowIcon className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightbox(null)}
            className="fixed inset-0 z-[100] bg-[#151010]/95 backdrop-blur-md flex items-center justify-center p-6 cursor-zoom-out"
          >
            <motion.img
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              src={lightbox}
              alt=""
              className="max-w-full max-h-[90vh] object-contain rounded-xl border-2 border-white/20"
            />
            <button
              onClick={() => setLightbox(null)}
              className="absolute top-6 right-6 font-mono text-xs font-bold uppercase text-white bg-white/10 border border-white/30 px-4 py-2 rounded-full hover:bg-white hover:text-[#151010] transition-colors"
            >
              Close ✕
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

/* ─────────────── FOOTER (DAREN & CURTIS CONTRASTING BLUE FOOTER) ─────────────── */
function Contact() {
  return (
    <footer id="contact" className="relative bg-[#0039FF] text-white pt-24 pb-12 px-4 sm:px-6 lg:px-12 overflow-hidden">
      {/* Animated Wave Top Divider */}
      <div className="wave-top-blue" />

      <div className="max-w-[1600px] mx-auto relative z-20">
        <div className="grid grid-cols-12 gap-10 pb-16 border-b border-white/20">
          <div className="col-span-12 lg:col-span-7">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/30 bg-white/10 text-[12px] font-mono uppercase tracking-wider text-[#CEFF00] font-bold mb-4">
              <span className="w-2 h-2 rounded-full bg-[#CEFF00] animate-pulse" />
              <span>Get In Touch</span>
            </div>
            <h2 className="text-[clamp(2.75rem,7.5vw,7rem)] font-black leading-[0.92] text-white tracking-tight uppercase">
              Ready To Go<br />
              <span className="text-[#CEFF00]">Social-First?</span>
            </h2>
            <p className="mt-4 text-2xl font-bold text-white/90">
              We Got You!
            </p>
            <p className="mt-4 text-[16px] text-white/80 max-w-[48ch] font-medium leading-relaxed">
              Available for commercial contracts, high-converting social campaigns, reel retainers, and fast-turnaround video edits.
            </p>

            <div className="mt-8">
              <a
                href="mailto:32charan@gmail.com?subject=Project%20Inquiry%20via%20Portfolio"
                className="group inline-flex items-center gap-3 bg-[#CEFF00] hover:bg-[#d8ff26] text-[#151010] border-2 border-[#151010] px-8 py-4 rounded-[14px] text-[16px] font-black tracking-wide uppercase transition-all shadow-[4px_4px_0px_#151010] hover:-translate-y-0.5 cursor-pointer"
              >
                <span>Get in Touch</span>
                <ArrowIcon className="w-4 h-4" />
              </a>
            </div>
          </div>

          <div className="col-span-12 lg:col-span-5 flex flex-col justify-end gap-5">
            <div className="bg-white text-[#151010] border-2 border-[#151010] rounded-[22px] p-6 sm:p-8 shadow-[6px_6px_0px_#151010]">
              <h3 className="font-mono text-xs uppercase tracking-widest text-[#0039FF] font-bold mb-4">
                // Direct Contact
              </h3>
              <div className="space-y-3 font-semibold text-[15px]">
                <a
                  href="mailto:32charan@gmail.com"
                  className="flex items-center justify-between p-2.5 rounded-lg hover:bg-[#BEEBFD] transition-colors"
                >
                  <span className="text-[#151010]/60 font-mono text-xs">Email</span>
                  <span className="text-[#0039FF] font-bold">32charan@gmail.com</span>
                </a>
                <a
                  href="tel:+918951448408"
                  className="flex items-center justify-between p-2.5 rounded-lg hover:bg-[#BEEBFD] transition-colors"
                >
                  <span className="text-[#151010]/60 font-mono text-xs">Phone / WhatsApp</span>
                  <span className="text-[#151010] font-bold">+91 89514 48408</span>
                </a>
                <div className="flex items-center justify-between p-2.5 rounded-lg">
                  <span className="text-[#151010]/60 font-mono text-xs">Location</span>
                  <span className="text-[#151010] font-bold">Bengaluru, India</span>
                </div>
                <a
                  href="https://www.linkedin.com/in/32charan/"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between p-2.5 rounded-lg hover:bg-[#BEEBFD] transition-colors"
                >
                  <span className="text-[#151010]/60 font-mono text-xs">LinkedIn</span>
                  <span className="text-[#0039FF] font-bold">/in/32charan</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-xs font-mono text-white/70">
          <span>© 2026 Charan — Video Editor · Colorist · Motion Designer</span>
          <a href="#top" className="hover:text-[#CEFF00] font-bold transition-colors">
            Back to Top ↑
          </a>
        </div>
      </div>
    </footer>
  );
}

/* ─────────────── PORTFOLIO WRAPPER ─────────────── */
export function Portfolio() {
  return (
    <VideoProvider>
      <div className="min-h-screen bg-[#FFF7EC] text-[#151010] selection:bg-[#CEFF00] selection:text-[#151010]">
        <Hero />
        <CreditsTicker />
        <About />
        <Experience />
        <VideosSection />
        <PortfolioGrid />
        <Contact />
      </div>
    </VideoProvider>
  );
}
