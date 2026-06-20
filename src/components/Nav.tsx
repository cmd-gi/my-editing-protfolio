import { useEffect, useState } from "react";

const links = [
  { label: "ABOUT", href: "#about" },
  { label: "EXPERIENCE", href: "#experience" },
  { label: "PORTFOLIO", href: "#videos" },
  { label: "CONTACT", href: "#contact" },
];

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 h-16 md:h-20 flex items-center justify-between px-[5vw] md:px-[3vw] transition-colors duration-300 ${
          open
            ? "bg-void"
            : scrolled
              ? "bg-void/85 backdrop-blur-md"
              : "bg-transparent"
        }`}
      >
        <a
          href="#top"
          onClick={() => setOpen(false)}
          className="font-display font-bold text-[14px] md:text-[15px] tracking-tight text-paper hover:text-lime transition-colors"
        >
          CHARAN
        </a>

        <ul className="hidden md:flex items-center gap-0">
          {links.map((l, i) => (
            <li key={l.label} className="flex items-center">
              <a
                href={l.href}
                className="relative font-mono text-[12px] tracking-[0.05em] font-medium text-paper hover:text-lime transition-colors duration-200 px-3 py-2 group"
              >
                {l.label}
                <span className="absolute left-1/2 bottom-1 h-px w-[60%] -translate-x-1/2 bg-lime scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-center" />
              </a>
              {i < links.length - 1 && <span className="text-ash">·</span>}
            </li>
          ))}
        </ul>

        <button
          onClick={() => setOpen((o) => !o)}
          className="md:hidden font-mono text-[12px] tracking-[0.1em] font-medium text-paper border border-paper/30 px-3 py-1.5 hover:text-lime hover:border-lime transition-colors"
          aria-label="Toggle menu"
          aria-expanded={open}
        >
          {open ? "CLOSE" : "MENU"}
        </button>
      </nav>

      {/* Mobile menu overlay — outside nav for clean stacking */}
      <div
        className={`md:hidden fixed inset-x-0 top-16 bottom-0 z-40 bg-void transition-opacity duration-300 ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        aria-hidden={!open}
      >
        <div className="relative h-full flex flex-col px-[5vw] pt-6 pb-8 overflow-y-auto">
          <div className="font-mono text-[10px] tracking-[0.15em] uppercase text-ash pb-4 border-b border-paper/10">
            // Navigate
          </div>
          <ul className="flex flex-col">
            {links.map((l, i) => (
              <li key={l.label} className="w-full border-b border-paper/10">
                <a
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="flex items-baseline gap-4 font-display font-extrabold uppercase tracking-[-0.02em] text-[clamp(1.75rem,9vw,2.5rem)] text-paper hover:text-lime transition-colors py-5"
                >
                  <span className="font-mono text-[10px] tracking-[0.15em] text-lime font-medium">
                    0{i + 1}
                  </span>
                  <span>{l.label}</span>
                </a>
              </li>
            ))}
          </ul>

          <div className="mt-auto pt-8 flex flex-col gap-2 font-mono text-[11px] tracking-[0.05em] uppercase text-ash">
            <a
              href="mailto:32charan@gmail.com"
              onClick={() => setOpen(false)}
              className="text-paper hover:text-lime transition-colors break-all"
            >
              32charan@gmail.com
            </a>
            <span>// 2026 — CHARAN</span>
          </div>
        </div>
      </div>
    </>
  );
}
