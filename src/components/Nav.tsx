import { useEffect, useState } from "react";
import { ArrowIcon } from "./daren-curtis/ArrowIcon";

const links = [
  { label: "About", href: "#about" },
  { label: "Videos", href: "#videos" },
  { label: "Experience", href: "#experience" },
  { label: "Posters", href: "#portfolio" },
  { label: "Contact", href: "#contact" },
];

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
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
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 py-3 md:py-4 px-4 sm:px-6 lg:px-12 ${
          scrolled ? "backdrop-blur-md bg-[#FFF7EC]/90 shadow-[0_4px_20px_rgba(21,16,16,0.06)]" : "bg-transparent"
        }`}
      >
        <div className="max-w-[1600px] mx-auto flex items-center justify-between">
          {/* Logo Badge (Daren & Curtis style pill) */}
          <a
            href="#top"
            onClick={() => setOpen(false)}
            className="group flex items-center gap-2.5 px-3 py-1.5 rounded-lg border-2 border-[#151010] bg-white transition-all hover:bg-[#CEFF00] hover:shadow-[2px_2px_0px_#151010]"
          >
            <span className="font-extrabold text-[15px] tracking-tight text-[#151010] uppercase">
              Charan
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#0039FF] animate-pulse" />
            <span className="text-[10px] font-mono tracking-wider font-semibold text-[#151010]/70 uppercase">
              Editor
            </span>
          </a>

          {/* Nav Links */}
          <nav className="hidden md:flex items-center gap-1 bg-white/80 border border-[#151010]/10 rounded-full px-5 py-2 shadow-xs backdrop-blur-sm">
            {links.map((l) => (
              <a
                key={l.label}
                href={l.href}
                className="px-4 py-1.5 rounded-full text-[14px] font-semibold text-[#151010] hover:text-[#0039FF] hover:bg-[#BEEBFD]/50 transition-all"
              >
                {l.label}
              </a>
            ))}
          </nav>

          {/* Right CTA Button & Mobile Trigger */}
          <div className="flex items-center gap-3">
            <a
              href="#contact"
              className="group hidden sm:inline-flex items-center gap-2.5 bg-[#CEFF00] hover:bg-[#d8ff26] text-[#151010] border-2 border-[#151010] px-5 py-2.5 rounded-[12px] text-[14px] font-extrabold transition-all hover:-translate-y-0.5 hover:shadow-[3px_3px_0px_#151010]"
            >
              <span>Let's Talk</span>
              <ArrowIcon className="w-3.5 h-3.5" />
            </a>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setOpen((o) => !o)}
              className="md:hidden flex items-center justify-center w-11 h-11 rounded-[10px] border-2 border-[#151010] bg-[#CEFF00] text-[#151010] transition-colors"
              aria-label="Toggle menu"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                {open ? (
                  <>
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </>
                ) : (
                  <>
                    <line x1="4" y1="8" x2="20" y2="8" />
                    <line x1="4" y1="16" x2="20" y2="16" />
                  </>
                )}
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      <div
        className={`md:hidden fixed inset-0 z-40 bg-[#FFF7EC] transition-all duration-300 pt-24 px-6 flex flex-col justify-between pb-10 ${
          open ? "opacity-100 pointer-events-auto translate-y-0" : "opacity-0 pointer-events-none -translate-y-4"
        }`}
      >
        <div className="flex flex-col gap-2">
          {links.map((l, i) => (
            <a
              key={l.label}
              href={l.href}
              onClick={() => setOpen(false)}
              className="flex items-center justify-between py-4 border-b border-[#151010]/10 text-2xl font-black text-[#0039FF] hover:text-[#151010]"
            >
              <span>{l.label}</span>
              <span className="text-xs font-mono text-[#151010]/40">0{i + 1}</span>
            </a>
          ))}
        </div>

        <a
          href="#contact"
          onClick={() => setOpen(false)}
          className="w-full flex items-center justify-center gap-2 bg-[#CEFF00] border-2 border-[#151010] text-[#151010] py-4 rounded-[14px] text-lg font-black shadow-[4px_4px_0px_#151010]"
        >
          <span>Get in Touch</span>
          <ArrowIcon className="w-4 h-4" />
        </a>
      </div>
    </>
  );
}
