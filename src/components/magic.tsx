import { motion, useInView } from "motion/react";
import { useRef, type ReactNode } from "react";

/* ── Marquee ── infinite horizontal scroll */
export function Marquee({
  children,
  speed = 30,
  reverse = false,
  className = "",
}: {
  children: ReactNode;
  speed?: number;
  reverse?: boolean;
  className?: string;
}) {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      <motion.div
        className="flex gap-10 whitespace-nowrap will-change-transform"
        animate={{ x: reverse ? ["-50%", "0%"] : ["0%", "-50%"] }}
        transition={{ duration: speed, ease: "linear", repeat: Infinity }}
      >
        <div className="flex gap-10 shrink-0">{children}</div>
        <div className="flex gap-10 shrink-0" aria-hidden>
          {children}
        </div>
      </motion.div>
    </div>
  );
}

/* ── BlurFade ── scroll-triggered blur + fade reveal */
export function BlurFade({
  children,
  delay = 0,
  y = 16,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y, filter: "blur(10px)" }}
      animate={inView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ── WordRotate ── vertical rotating word */
export function WordRotate({
  words,
  duration = 2200,
  className = "",
}: {
  words: string[];
  duration?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  return (
    <span ref={ref} className={`inline-block relative align-baseline ${className}`}>
      {words.map((w, i) => (
        <motion.span
          key={w}
          className="inline-block"
          style={{ position: i === 0 ? "relative" : "absolute", left: 0, top: 0 }}
          initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
          animate={{
            opacity: [0, 1, 1, 0],
            y: [20, 0, 0, -20],
            filter: ["blur(8px)", "blur(0px)", "blur(0px)", "blur(8px)"],
          }}
          transition={{
            duration: (duration * words.length) / 1000,
            times: [
              (i / words.length),
              (i / words.length) + 0.04,
              ((i + 1) / words.length) - 0.04,
              ((i + 1) / words.length),
            ],
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          {w}
        </motion.span>
      ))}
    </span>
  );
}

/* ── DotPattern ── decorative dotted bg */
export function DotPattern({ className = "", color = "rgba(20,24,27,0.18)" }: { className?: string; color?: string }) {
  return (
    <div
      className={`pointer-events-none absolute inset-0 ${className}`}
      style={{
        backgroundImage: `radial-gradient(${color} 1.2px, transparent 1.2px)`,
        backgroundSize: "22px 22px",
      }}
      aria-hidden
    />
  );
}

/* ── ShimmerButton ── shimmer light around perimeter */
export function ShimmerButton({
  children,
  className = "",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { children: ReactNode }) {
  return (
    <button
      {...props}
      className={`relative overflow-hidden group ${className}`}
    >
      <span className="relative z-10">{children}</span>
      <span className="pointer-events-none absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/40 to-transparent" />
    </button>
  );
}