import portraitHero from "@/assets/heo-portait.png";
const portraitAbout = "/__l5e/assets-v1/3546a4a6-3deb-4789-a567-2c8e56d27007/portrait-about.png";

import { motion, useScroll, useTransform, AnimatePresence } from "motion/react";
import { lazy, Suspense, useRef, useState } from "react";
import { HairlineGrid } from "./HairlineGrid";
import { VideoProvider } from "./VideoManager";
import { Marquee, BlurFade, WordRotate } from "./magic";
import { portfolio } from "@/lib/portfolio-data";
import { VideosSection } from "./VideosSection";
import { useIsMobile } from "@/hooks/use-mobile";

const ROBOT_SCENE_URL = "https://prod.spline.design/PyzDhpQ9E5f1E3MT/scene.splinecode";
const InteractiveRobotSpline = lazy(() =>
  import("./ui/interactive-3d-robot").then((mod) => ({ default: mod.InteractiveRobotSpline })),
);

/* ────── shared bits ────── */
const display = "font-display tracking-[-0.025em]";
const label = "font-mono text-[10px] tracking-[0.18em] uppercase";

function PhaseMark({ n, label: l }: { n: string; label: string }) {
  return (
    <div className="font-mono text-[11px] tracking-[0.18em] uppercase text-ash flex items-center gap-2">
      <span className="inline-block w-1.5 h-1.5 rounded-full bg-lime animate-pulse" />
      <span className="text-lime">{n}</span>
      <span className="text-paper/30">/</span>
      <span>{l}</span>
    </div>
  );
}

/* ─────────────── HERO ─────────────── */
function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const textY = useTransform(scrollYProgress, [0, 1], [0, -120]);
  const imgY = useTransform(scrollYProgress, [0, 1], [0, 80]);
  const imgScale = useTransform(scrollYProgress, [0, 1], [1, 1.05]);

  return (
    <section id="top" ref={ref} className="relative min-h-screen w-full bg-void overflow-hidden pt-20 md:pt-24">
      <HairlineGrid />
      <div className="relative z-20 flex flex-col md:grid md:grid-cols-12 gap-3 md:gap-6 px-[5vw] md:px-[3vw] pb-12 md:pb-16 md:min-h-[calc(100vh-6rem)]">
        <div className="md:hidden pt-1">
          <PhaseMark n="001" label="Reel / 2026" />
        </div>

        {/* Portrait */}
        <motion.div
          style={{ y: imgY, scale: imgScale }}
          className="order-1 md:order-2 md:col-span-5 relative h-[48vh] sm:h-[54vh] md:h-auto md:min-h-[80vh] -mx-[5vw] md:mx-0"
        >
          <div className="absolute inset-0 overflow-hidden">
            <img
              src={portraitHero}
              alt="Charan — Video Editor & Colorist"
              className="w-full h-full object-cover object-top grayscale contrast-125"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-void via-void/40 to-transparent md:hidden" />
          </div>
          {/* Play badge */}
          <a
            href="#portfolio"
            className="hidden md:flex absolute bottom-6 right-6 items-center gap-3 group"
            aria-label="View showreel"
          >
            <span className="w-14 h-14 rounded-full border border-paper/60 flex items-center justify-center bg-void/40 backdrop-blur-sm transition-transform group-hover:scale-105">
              <span className="block w-0 h-0 border-y-[7px] border-y-transparent border-l-[11px] border-l-paper ml-1" />
            </span>
            <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-paper">
              View<br />Showreel
            </span>
          </a>
        </motion.div>

        {/* Text */}
        <motion.div style={{ y: textY }} className="order-2 md:order-1 md:col-span-7 flex flex-col justify-between gap-5 md:gap-0 -mt-3 md:mt-0">
          <div className="hidden md:flex flex-col gap-2 pt-2">
            <PhaseMark n="001" label="Reel / 2026" />
          </div>

          <div className="leading-none md:-ml-1 md:mt-0">
            <h1 className={`${display} font-black leading-[0.82] text-[clamp(4rem,16vw,15rem)] lowercase`}>
              <span className="block text-paper">cut.</span>
              <span className="block text-paper md:pl-[6vw]">color.</span>
              <span className="block text-lime italic">create<span className="text-signal">.</span></span>
            </h1>
            <div className="mt-4 flex items-center gap-3 flex-wrap">
              <span className="-rotate-2 bg-signal text-paper px-3 py-1 font-mono text-[10px] tracking-[0.15em] uppercase shadow-[3px_3px_0_0_rgba(0,0,0,0.35)]">
                ★ open for fun briefs
              </span>
              <span className="font-mono text-[11px] tracking-[0.18em] uppercase text-ash inline-flex items-center gap-2">
                making&nbsp;
                <span className="relative inline-block min-w-[9ch] h-[1.1em] text-lime font-semibold">
                  <WordRotate words={["brand films.", "scroll-stopping reels.", "AI experiments.", "color magic.", "motion that slaps."]} />
                </span>
              </span>
            </div>
          </div>

          <div className="md:mt-12 flex flex-col gap-5 max-w-[52ch]">
            <p className="text-[13px] md:text-[15px] leading-[1.65] text-ash">
              Hi, I'm Charan — I make videos look <span className="text-lime font-semibold">tasty</span>, color them
              like it's a Sunday afternoon, and sneak in a little motion magic. Brand films, reels, AI experiments —
              if it moves on a screen, I probably want to play with it.
            </p>
            <div className="h-px w-full bg-paper/15" />
            <ul className="font-mono text-[10px] tracking-[0.18em] uppercase text-paper/70 space-y-1.5 mt-2">
              <li>→ Video Editor (the obsessive kind)</li>
              <li>→ Colorist · teal &amp; orange enthusiast</li>
              <li>→ Motion Graphics · keyframe whisperer</li>
              <li>→ AI Creative · prompt &amp; pray believer</li>
            </ul>
          </div>
        </motion.div>
      </div>

      <div className="absolute bottom-6 right-[3vw] z-20 font-mono text-[10px] tracking-[0.2em] uppercase text-ash">
        Scroll ↓
      </div>
    </section>
  );
}

/* ─────────────── ABOUT ─────────────── */
const expertise = [
  "Cinematic Video Editing",
  "Promotional Video Production",
  "Color Grading & Correction",
  "Motion Graphics",
  "Speed Ramping",
  "Short-Form Content Editing",
  "Photo Editing & Retouching",
  "Visual Storytelling",
  "Social Media Content Creation",
  "AI-Assisted Content Creation",
];

const tools = {
  "Edit & Post": ["DaVinci Resolve", "Adobe After Effects", "Adobe Photoshop", "Adobe Lightroom", "CapCut", "Canva"],
  "AI Generative": ["Google Flow", "Higgsfield", "Runway", "Kling", "Veo"],
};

function About() {
  const isMobile = useIsMobile();
  const showRobotStage = !isMobile;

  return (
    <section id="about" className="relative grid grid-cols-1 md:grid-cols-2 min-h-[90vh] bg-warm">
      {/* LEFT — interactive 3D robot stage */}
      {showRobotStage ? (
        <div className="relative bg-warm overflow-hidden min-h-[70vh] md:min-h-0 flex items-center justify-center p-6 md:p-10">
          <div className="relative w-full h-full min-h-[60vh] md:min-h-[80vh] bg-editorial border border-paper/15 shadow-[8px_8px_0_0_var(--lime)] overflow-hidden">
            {/* soft lime glow behind the robot */}
            <div
              aria-hidden
              className="absolute inset-0 pointer-events-none"
              style={{ background: "radial-gradient(circle at 50% 60%, color-mix(in oklab, var(--lime) 22%, transparent), transparent 65%)" }}
            />
            <Suspense
              fallback={
                <div className="absolute inset-0 flex items-center justify-center px-6 text-center text-charcoal">
                  <div className="space-y-4">
                    <svg className="mx-auto h-20 w-20 text-lime animate-pulse" viewBox="0 0 96 96" fill="none" aria-hidden>
                      <rect x="18" y="24" width="60" height="48" rx="12" stroke="currentColor" strokeWidth="3" />
                      <circle cx="38" cy="44" r="4" fill="currentColor" />
                      <circle cx="58" cy="44" r="4" fill="currentColor" />
                      <path d="M34 58c4 4 8 6 14 6s10-2 14-6" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                      <path d="M48 16v8" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                      <circle cx="48" cy="14" r="3" fill="currentColor" />
                    </svg>
                    <div className="font-mono text-[10px] tracking-[0.2em] uppercase text-ash">loading whobee…</div>
                  </div>
                </div>
              }
            >
              <div className="absolute inset-0">
                <InteractiveRobotSpline scene={ROBOT_SCENE_URL} className="!w-full !h-full" />
              </div>
            </Suspense>
            {/* subtle lime tint to nudge robot toward theme */}
            <div
              aria-hidden
              className="absolute inset-0 pointer-events-none mix-blend-multiply"
              style={{ background: "color-mix(in oklab, var(--lime) 10%, transparent)" }}
            />
            {/* chips */}
            <div className={`${label} text-charcoal/70 absolute top-3 left-3 z-20`}>// say hi to whobee</div>
            <div className={`${label} text-lime absolute top-3 right-3 z-20`}>drag · click · poke</div>
            <div className="absolute bottom-3 left-3 z-20 -rotate-2 bg-signal text-paper px-2 py-1 font-mono text-[9px] tracking-[0.18em] uppercase shadow-[3px_3px_0_0_rgba(20,24,27,0.85)]">
              ★ studio mascot
            </div>
            <div className="absolute bottom-3 right-3 z-30 bg-paper text-editorial font-mono text-[10px] tracking-[0.2em] uppercase px-2 py-1">
              live · 3d
            </div>
            {/* watermark cover — hides "Built with Spline" badge */}
            <div aria-hidden className="absolute bottom-0 right-0 z-20 w-[190px] h-[52px] bg-editorial pointer-events-none" />
          </div>
        </div>
      ) : null}

      {/* RIGHT text */}
      <div className="relative bg-warm text-paper px-[5vw] md:px-[3vw] py-[10vh] flex flex-col justify-between">
        <div className="relative z-20 flex items-start justify-between">
          <PhaseMark n="002" label="About" />
          <span className={`${label} text-ash`}>02.1</span>
        </div>

        <BlurFade className="relative z-20 mt-12">
          <h2 className={`${display} font-black leading-[0.9] text-paper text-[clamp(2.5rem,7vw,6rem)] lowercase`}>
            hey,<br />i'm <span className="text-lime italic">charan</span> <span className="text-signal">👋</span>
          </h2>
          <div className="mt-4 h-[3px] w-24 bg-lime rounded-full" />
          <p className="mt-8 text-[15px] leading-[1.7] text-ash max-w-[52ch]">
            Video editor, colorist and motion designer based in Bengaluru. I make brand films, scroll-stopping reels and
            slightly unhinged AI experiments. Equal parts storyteller, color nerd and keyframe goblin —
            here to make your footage <span className="text-lime font-semibold">actually slap</span>.
          </p>
        </BlurFade>


        {/* Expertise grid */}
        <div className="relative z-20 mt-14">
          <div className={`${label} text-ash mb-5`}>Expertise</div>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2.5 text-[13px] text-paper">
            {expertise.map((e) => (
              <li key={e} className="flex items-baseline gap-3">
                <span className="text-lime text-[11px]">▶</span>
                <span>{e}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Tools */}
        <div className="relative z-20 mt-14 grid grid-cols-1 sm:grid-cols-2 gap-10">
          {Object.entries(tools).map(([group, list]) => (
            <div key={group}>
              <div className={`${label} text-ash mb-4`}>{group}</div>
              <div className="flex flex-wrap gap-2">
                {list.map((t) => (
                  <span
                    key={t}
                    className="border border-paper/15 hover:border-lime hover:text-lime transition-colors px-3 py-2 text-[11px] tracking-wide text-paper/90"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

/* ─────────────── EXPERIENCE ─────────────── */
const experience = [
  {
    company: "Sanchi Atelier",
    role: "Video Editor & Creative Designer",
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
    <section id="experience" className="relative bg-void py-[14vh] px-[5vw] md:px-[3vw]">
      <HairlineGrid />
      <div className="relative z-20">
        <div className="grid grid-cols-12 gap-6 mb-16">
          <div className="col-span-12 md:col-span-2">
            <PhaseMark n="004" label="Experience" />
          </div>
          <div className="col-span-12 md:col-span-10">
            <h2 className={`${display} font-black leading-[0.9] text-[clamp(2.5rem,8vw,8rem)] text-paper lowercase`}>
              places that <span className="text-lime italic">trusted</span><br />
              me with the <span className="text-signal">scissors</span>.
            </h2>
          </div>
        </div>

        <div className="space-y-px bg-paper/10">
          {experience.map((job, i) => (
            <motion.article
              key={job.company}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ duration: 0.6, delay: i * 0.05 }}
              className="bg-void grid grid-cols-12 gap-6 py-10 md:py-14 group"
            >
              <div className="col-span-12 md:col-span-3">
                <div className={`${label} text-lime mb-3`}>0{i + 1}</div>
                <h3 className={`${display} font-normal leading-[0.95] text-[clamp(1.75rem,3vw,2.75rem)] text-paper`}>
                  {job.company}
                </h3>
                <div className={`mt-2 ${label} text-ash`}>{job.role}</div>
              </div>
              <ul className="col-span-12 md:col-span-9 md:pl-10 space-y-3 text-[14px] leading-[1.65] text-paper/85">
                {job.bullets.map((b) => (
                  <li key={b} className="flex items-baseline gap-3">
                    <span className="text-lime text-[10px]">▶</span>
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────── PORTFOLIO ─────────────── */
function CreditsTicker() {
  const credits = [
    "DaVinci Resolve",
    "After Effects",
    "Photoshop",
    "Lightroom",
    "CapCut",
    "Runway",
    "Kling",
    "Veo",
    "Higgsfield",
    "Google Flow",
  ];
  return (
    <div className="relative bg-lime text-paper border-y-2 border-paper overflow-hidden">
      <Marquee speed={32} className="py-4">
        {credits.map((c) => (
          <span key={c} className="inline-flex items-center gap-4 font-display font-black lowercase text-[clamp(1.5rem,3vw,2.5rem)] tracking-[-0.02em]">
            {c}
            <span className="text-signal">✺</span>
          </span>
        ))}
      </Marquee>
    </div>
  );
}

const INITIAL_POSTERS = 6;

function PortfolioGrid() {
  const [lightbox, setLightbox] = useState<string | null>(null);
  const [expanded, setExpanded] = useState(false);

  const visible = expanded ? portfolio : portfolio.slice(0, INITIAL_POSTERS);
  const hasMore = portfolio.length > INITIAL_POSTERS;

  return (
    <section id="portfolio" className="relative bg-void text-paper py-[14vh] px-[5vw] md:px-[3vw]">
      <div className="relative z-20">
        <div className="grid grid-cols-12 gap-6 mb-12">
          <div className="col-span-12 md:col-span-2">
            <PhaseMark n="004" label="Posters" />
          </div>
          <div className="col-span-12 md:col-span-10">
            <h2 className={`${display} font-black leading-[0.9] text-[clamp(2.5rem,8vw,8rem)] text-paper lowercase`}>
              the <span className="text-lime italic">posters</span>.
            </h2>
            <p className="mt-6 text-[14px] leading-[1.65] text-ash max-w-[52ch]">
              Print, social and campaign artwork — tap any tile to open it full size.
            </p>
          </div>
        </div>

        <motion.div layout className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <AnimatePresence mode="popLayout" initial={false}>
            {visible.map((p, i) => (
              <motion.button
                key={p.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4, delay: (i % 6) * 0.04 }}
                type="button"
                onClick={() => setLightbox(p.thumbnail)}
                className="group relative bg-warm border border-paper/[0.06] hover:border-lime/40 transition-colors overflow-hidden aspect-[3/4]"
                aria-label={`Open ${p.title}`}
              >
                <img
                  src={p.thumbnail}
                  alt={p.title}
                  loading="lazy"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                />
                <span className={`absolute top-3 left-3 ${label} bg-void/70 text-paper px-2 py-1`}>
                  {String(i + 1).padStart(2, "0")}
                </span>
              </motion.button>
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
              {expanded ? "See less ↑" : `See more (${portfolio.length - INITIAL_POSTERS}) ↓`}
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
            className="fixed inset-0 z-[80] bg-void/95 flex items-center justify-center p-6 cursor-zoom-out"
          >
            <motion.img
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              src={lightbox}
              alt=""
              className="max-w-full max-h-full object-contain"
            />
            <button
              onClick={() => setLightbox(null)}
              className="absolute top-6 right-6 font-mono text-[11px] tracking-[0.2em] uppercase text-paper border border-paper/40 px-3 py-1.5 hover:text-lime hover:border-lime"
            >
              Close ✕
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

/* ─────────────── CONTACT ─────────────── */
function Contact() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end end"] });
  const scale = useTransform(scrollYProgress, [0, 1], [0.94, 1]);

  return (
    <section id="contact" ref={ref} className="relative bg-void text-paper min-h-[80vh] flex flex-col justify-between px-[5vw] md:px-[3vw] py-[8vh] md:py-[12vh] overflow-hidden gap-12">
      <HairlineGrid />
      <div className="relative z-20 flex items-start justify-between">
        <PhaseMark n="006" label="Contact / End" />
        <span className={`${label} text-ash`}>// 2026</span>
      </div>

      <motion.div style={{ scale }} className="relative z-20 grid grid-cols-12 gap-8 md:gap-6 my-8">
        <div className="col-span-12 md:col-span-8">
          <h2 className={`${display} font-black leading-[0.85] text-[clamp(2.75rem,11vw,11rem)] text-paper lowercase`}>
            let's make<br />
            <span className="text-lime italic">something</span><br />
            <span className="text-signal">silly-good</span>.
          </h2>
          <p className="mt-8 text-[14px] leading-[1.65] text-ash max-w-[48ch]">
            Available for full-time, freelance, late-night reel emergencies and "can you do this by tomorrow"
            briefs. Bring snacks.
          </p>
        </div>

        <div className="col-span-12 md:col-span-4 flex flex-col md:justify-end gap-4 font-mono text-[11px] tracking-[0.1em] uppercase">
          <a href="mailto:32charan@gmail.com" className="text-paper hover:text-lime transition-colors block break-all">
            <span className="text-ash">EMAIL — </span>32charan@gmail.com
          </a>
          <a href="tel:+918951448408" className="text-paper hover:text-lime transition-colors block">
            <span className="text-ash">PHONE — </span>+91 89514 48408
          </a>
          <span className="text-paper block">
            <span className="text-ash">LOCATION — </span>Bengaluru, Karnataka, India
          </span>
          <a href="https://www.linkedin.com/in/32charan/" target="_blank" rel="noreferrer" className="text-paper hover:text-lime transition-colors block">
            <span className="text-ash">LINKEDIN — </span>/in/32charan
          </a>
          <a href="https://www.instagram.com/" target="_blank" rel="noreferrer" className="text-paper hover:text-lime transition-colors block">
            <span className="text-ash">INSTAGRAM — </span>@charan
          </a>
          <a
            href="mailto:32charan@gmail.com?subject=Project%20Inquiry"
            className="mt-4 inline-block border border-lime px-5 py-3 text-lime hover:bg-lime hover:text-paper transition-colors w-fit"
          >
            Start a project →
          </a>
        </div>
      </motion.div>

      <div className="relative z-20 pt-6 border-t border-paper/15 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 font-mono text-[10px] tracking-[0.2em] uppercase text-ash">
        <span>// 2026 — Charan · Video Editor · Colorist</span>
        <a href="#top" className="hover:text-lime transition-colors">Back to top ↑</a>
      </div>
    </section>
  );
}

export function Portfolio() {
  return (
    <VideoProvider>
      <main className="bg-void relative">
        <Hero />
        <About />
        <CreditsTicker />
        <VideosSection />
        <PortfolioGrid />
        <Experience />
        <Contact />
        <div className="grain-overlay" aria-hidden />
      </main>
    </VideoProvider>
  );
}
