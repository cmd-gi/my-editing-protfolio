import { useEffect, useRef, useState, useCallback } from "react";
import portraitHero from "@/assets/heo-portait.png";

// Reference art character set: heavy on +, -, =, :, *, #
const DENSITY_CHARS = "   ..··::--==++**##%%@@";
const SPECIAL_CHARS = ["+", "-", "=", "+", "|", "+", "*", "+", "+"];

interface Gaze {
  x: number; // -1 (look left) to +1 (look right)
  y: number; // -1 (look up) to +1 (look down)
  blink: number; // 0 = fully open, 1 = fully closed
}

export function AsciiPortrait({ className = "" }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [mode, setMode] = useState<"ascii" | "photo">("ascii");
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  // Gaze state
  const gazeRef = useRef<Gaze>({ x: 0, y: 0, blink: 0 });
  const targetGazeRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const lastMouseMoveRef = useRef<number>(Date.now());
  const animFrameRef = useRef<number | null>(null);

  // Cached image pixel luminance grid
  const imgDataRef = useRef<{
    width: number;
    height: number;
    luminance: Float32Array;
    colors: Uint8Array;
  } | null>(null);

  // Eye normalized positions on the portrait
  // Left eye (viewer's left): x ~ 0.40, y ~ 0.30
  // Right eye (viewer's right): x ~ 0.59, y ~ 0.32
  const eyeCoords = useRef({
    left: { x: 0.40, y: 0.30, radiusX: 0.045, radiusY: 0.03 },
    right: { x: 0.59, y: 0.32, radiusX: 0.045, radiusY: 0.03 },
  });

  // Load and pre-process portrait into luminance map
  useEffect(() => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = portraitHero;
    img.onload = () => {
      const COLS = 72; // grid resolution matching high-res reference ASCII
      const ROWS = 92;

      const offCanvas = document.createElement("canvas");
      offCanvas.width = COLS;
      offCanvas.height = ROWS;
      const offCtx = offCanvas.getContext("2d", { willReadFrequently: true });
      if (!offCtx) return;

      offCtx.drawImage(img, 0, 0, COLS, ROWS);
      const raw = offCtx.getImageData(0, 0, COLS, ROWS);
      const pixels = raw.data;

      const luminance = new Float32Array(COLS * ROWS);
      const colors = new Uint8Array(COLS * ROWS * 3);

      for (let i = 0; i < COLS * ROWS; i++) {
        const r = pixels[i * 4];
        const g = pixels[i * 4 + 1];
        const b = pixels[i * 4 + 2];
        const a = pixels[i * 4 + 3] / 255;

        // Perceptual brightness
        const lum = (0.299 * r + 0.587 * g + 0.114 * b) * a;
        luminance[i] = lum;
        colors[i * 3] = r;
        colors[i * 3 + 1] = g;
        colors[i * 3 + 2] = b;
      }

      imgDataRef.current = {
        width: COLS,
        height: ROWS,
        luminance,
        colors,
      };
      setImageLoaded(true);
    };
  }, []);

  // Mouse / Pointer move for interactive eye tracking
  const handlePointerMove = useCallback((e: MouseEvent | PointerEvent) => {
    lastMouseMoveRef.current = Date.now();
    const container = containerRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    // Cursor position relative to center of eye region
    const eyeCenterX = rect.left + rect.width * 0.5;
    const eyeCenterY = rect.top + rect.height * 0.31;

    const dx = (e.clientX - eyeCenterX) / (window.innerWidth * 0.4);
    const dy = (e.clientY - eyeCenterY) / (window.innerHeight * 0.4);

    // Clamp gaze to natural bounds
    targetGazeRef.current = {
      x: Math.max(-1, Math.min(1, dx)),
      y: Math.max(-1, Math.min(1, dy)),
    };
  }, []);

  useEffect(() => {
    window.addEventListener("pointermove", handlePointerMove);
    return () => window.removeEventListener("pointermove", handlePointerMove);
  }, [handlePointerMove]);

  // Main Render & Animation Loop
  useEffect(() => {
    if (!imageLoaded) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let startTime = performance.now();
    let nextBlinkTime = startTime + 2500;
    let isBlinking = false;
    let blinkStartTime = 0;

    const render = (now: number) => {
      const data = imgDataRef.current;
      if (!data) return;

      // Handle idle loop when mouse hasn't moved for 2 seconds
      const isIdle = Date.now() - lastMouseMoveRef.current > 2000;
      if (isIdle) {
        const timeSec = now * 0.001;
        // Organic eye action: looking at user, subtle glances
        const glancePhase = Math.sin(timeSec * 0.8);
        const glanceLook = Math.sin(timeSec * 0.3);

        if (glancePhase > 0.85) {
          // Glance slightly left
          targetGazeRef.current = { x: -0.6, y: -0.1 };
        } else if (glancePhase < -0.85) {
          // Glance slightly right
          targetGazeRef.current = { x: 0.6, y: -0.1 };
        } else {
          // Direct eye contact with user
          targetGazeRef.current = {
            x: Math.sin(timeSec * 0.5) * 0.15,
            y: Math.cos(timeSec * 0.4) * 0.1,
          };
        }
      }

      // Smooth interpolation toward target gaze
      const currentGaze = gazeRef.current;
      currentGaze.x += (targetGazeRef.current.x - currentGaze.x) * 0.1;
      currentGaze.y += (targetGazeRef.current.y - currentGaze.y) * 0.1;

      // Natural blink cycle
      if (!isBlinking && now > nextBlinkTime) {
        isBlinking = true;
        blinkStartTime = now;
      }
      if (isBlinking) {
        const blinkProgress = (now - blinkStartTime) / 160; // 160ms blink
        if (blinkProgress >= 1) {
          isBlinking = false;
          currentGaze.blink = 0;
          nextBlinkTime = now + 2800 + Math.random() * 3200; // Next blink in 2.8 - 6s
        } else {
          // Smooth blink curve
          currentGaze.blink = Math.sin(blinkProgress * Math.PI);
        }
      }

      // Resize canvas to match display size (high DPI)
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const displayWidth = canvas.clientWidth;
      const displayHeight = canvas.clientHeight;

      if (canvas.width !== displayWidth * dpr || canvas.height !== displayHeight * dpr) {
        canvas.width = displayWidth * dpr;
        canvas.height = displayHeight * dpr;
      }

      ctx.save();
      ctx.scale(dpr, dpr);

      // Deep rich background
      ctx.fillStyle = "#120F10";
      ctx.fillRect(0, 0, displayWidth, displayHeight);

      // Radiant Aura (matching reference poster's glowing halo)
      const auraGradient = ctx.createRadialGradient(
        displayWidth * 0.52,
        displayHeight * 0.36,
        20,
        displayWidth * 0.52,
        displayHeight * 0.38,
        displayWidth * 0.5
      );
      auraGradient.addColorStop(0, "rgba(206, 255, 0, 0.28)");
      auraGradient.addColorStop(0.35, "rgba(206, 255, 0, 0.12)");
      auraGradient.addColorStop(0.65, "rgba(0, 57, 255, 0.08)");
      auraGradient.addColorStop(1, "rgba(18, 15, 16, 0)");

      ctx.fillStyle = auraGradient;
      ctx.fillRect(0, 0, displayWidth, displayHeight);

      // Calculate cell dimensions
      const cellW = displayWidth / data.width;
      const cellH = displayHeight / data.height;
      const fontSize = Math.max(8, Math.floor(cellH * 1.05));
      ctx.font = `bold ${fontSize}px "IBM Plex Mono", monospace`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      const time = now * 0.001;

      // Draw ASCII grid
      for (let r = 0; r < data.height; r++) {
        const ny = r / data.height;

        for (let c = 0; c < data.width; c++) {
          const nx = c / data.width;
          const idx = r * data.width + c;
          let lum = data.luminance[idx];

          if (lum < 10) continue; // Skip near black

          // Check if inside Left Eye
          const dLeftX = (nx - eyeCoords.current.left.x) / eyeCoords.current.left.radiusX;
          const dLeftY = (ny - eyeCoords.current.left.y) / eyeCoords.current.left.radiusY;
          const distLeft = dLeftX * dLeftX + dLeftY * dLeftY;

          // Check if inside Right Eye
          const dRightX = (nx - eyeCoords.current.right.x) / eyeCoords.current.right.radiusX;
          const dRightY = (ny - eyeCoords.current.right.y) / eyeCoords.current.right.radiusY;
          const distRight = dRightX * dRightX + dRightY * dRightY;

          let isEyeRegion = false;
          let isPupil = false;

          // Process Left Eye
          if (distLeft < 1.1) {
            isEyeRegion = true;
            // Eyelid blink clipping
            if (Math.abs(dLeftY) > 1 - currentGaze.blink * 1.1) {
              lum = 40; // closed eyelid shadow
            } else {
              // Pupil offset with gaze
              const pupilDx = dLeftX - currentGaze.x * 0.45;
              const pupilDy = dLeftY - currentGaze.y * 0.4;
              if (pupilDx * pupilDx + pupilDy * pupilDy < 0.28) {
                isPupil = true;
              }
            }
          }

          // Process Right Eye
          if (distRight < 1.1) {
            isEyeRegion = true;
            if (Math.abs(dRightY) > 1 - currentGaze.blink * 1.1) {
              lum = 40;
            } else {
              const pupilDx = dRightX - currentGaze.x * 0.45;
              const pupilDy = dRightY - currentGaze.y * 0.4;
              if (pupilDx * pupilDx + pupilDy * pupilDy < 0.28) {
                isPupil = true;
              }
            }
          }

          // Character selection
          let ch = " ";
          let color = "#FFF7EC";

          if (isPupil) {
            // Intense glowing pupil looking straight at user
            ch = "+";
            color = "#CEFF00";
          } else if (isEyeRegion && lum > 40) {
            // Sclera / eye whites
            ch = ":";
            color = "#FFFFFF";
          } else {
            // Reference style ASCII rendering
            const normalizedLum = Math.min(1, Math.max(0, lum / 255));
            const charIdx = Math.floor(normalizedLum * (DENSITY_CHARS.length - 1));
            ch = DENSITY_CHARS[charIdx];

            // Use iconic special chars (+, -, =) on strong edges and highlights
            if (normalizedLum > 0.65) {
              ch = SPECIAL_CHARS[(c + r) % SPECIAL_CHARS.length];
              color = normalizedLum > 0.85 ? "#CEFF00" : "#FFF7EC";
            } else if (normalizedLum > 0.4) {
              color = "#F0E8D8";
            } else {
              color = "rgba(255, 247, 236, 0.45)";
            }
          }

          if (ch === " ") continue;

          const x = c * cellW + cellW * 0.5;
          const y = r * cellH + cellH * 0.5;

          ctx.fillStyle = color;
          ctx.fillText(ch, x, y);
        }
      }

      // Technical Overlays matching the reference poster
      // 1. Crosshair at eye focus
      const eyeLookPxX =
        displayWidth * (0.5 + currentGaze.x * 0.06);
      const eyeLookPxY =
        displayHeight * (0.31 + currentGaze.y * 0.05);

      ctx.strokeStyle = "rgba(206, 255, 0, 0.35)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(eyeLookPxX - 10, eyeLookPxY);
      ctx.lineTo(eyeLookPxX + 10, eyeLookPxY);
      ctx.moveTo(eyeLookPxX, eyeLookPxY - 10);
      ctx.lineTo(eyeLookPxX, eyeLookPxY + 10);
      ctx.stroke();

      // 2. Technical radar arcs & coordinates
      ctx.strokeStyle = "rgba(255, 255, 255, 0.12)";
      ctx.beginPath();
      ctx.arc(displayWidth * 0.52, displayHeight * 0.34, 110, 0, Math.PI * 2);
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(displayWidth * 0.52, displayHeight * 0.34, 180, 0, Math.PI * 0.7);
      ctx.stroke();

      // Coordinate nodes like in reference poster (+ 1001 - 647)
      ctx.font = `600 9px "IBM Plex Mono", monospace`;
      ctx.fillStyle = "rgba(206, 255, 0, 0.75)";
      ctx.fillText(
        `+ 1001 - 647`,
        displayWidth * 0.82,
        displayHeight * 0.38
      );

      ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
      ctx.fillText(
        `12.9716° N / 77.5946° E`,
        displayWidth * 0.28,
        displayHeight * 0.18
      );

      ctx.restore();

      animFrameRef.current = requestAnimationFrame(render);
    };

    animFrameRef.current = requestAnimationFrame(render);
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [imageLoaded]);

  return (
    <div
      ref={containerRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative w-full max-w-[460px] aspect-[4/5] rounded-[28px] border-3 border-[#151010] overflow-hidden bg-[#120F10] shadow-[8px_8px_0px_#151010] select-none ${className}`}
    >
      {/* ASCII Canvas */}
      <canvas
        ref={canvasRef}
        className={`w-full h-full object-cover transition-opacity duration-500 ${
          mode === "ascii" ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      />

      {/* Original Photo Mode fallback */}
      <img
        src={portraitHero}
        alt="Charan — Video Editor"
        className={`absolute inset-0 w-full h-full object-cover object-top grayscale contrast-125 transition-opacity duration-500 ${
          mode === "photo" ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      />

      {/* Top Graphic Header (Technical Labeling like Reference Poster) */}
      <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-20 pointer-events-none">
        <div className="bg-[#120F10]/80 backdrop-blur-md border border-white/20 px-2.5 py-1 rounded-full flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#CEFF00] animate-pulse" />
          <span className="font-mono text-[9px] uppercase tracking-widest text-[#CEFF00] font-bold">
            ASCII MATRIX · EYE-ACTIVE
          </span>
        </div>

        <span className="font-mono text-[9px] text-white/50 tracking-wider">
          LIVE · 60FPS
        </span>
      </div>

      {/* Eye Action Indicator Pill */}
      <div className="absolute top-14 left-4 z-20 pointer-events-none">
        <div className="font-mono text-[9px] text-white/70 bg-[#120F10]/70 backdrop-blur-xs px-2 py-0.5 rounded border border-white/10">
          {isHovered ? "GAZE: TRACKING CURSOR" : "GAZE: EYE CONTACT LOOP"}
        </div>
      </div>

      {/* Bottom Floating Control Badge */}
      <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md border-2 border-[#151010] rounded-[18px] p-3 flex items-center justify-between shadow-[3px_3px_0px_#151010] z-20">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-wider text-[#0039FF] font-bold block">
            Lead Editor
          </span>
          <span className="text-[13px] font-black text-[#151010]">
            Charan · Bengaluru
          </span>
        </div>

        {/* Mode Toggle Button: ASCII vs PHOTO */}
        <button
          type="button"
          onClick={() => setMode((m) => (m === "ascii" ? "photo" : "ascii"))}
          title="Toggle between ASCII Glyph Art & Photo"
          className="px-3 py-1.5 rounded-full border border-[#151010] bg-[#CEFF00] hover:bg-[#d8ff26] font-mono text-[10px] font-extrabold uppercase tracking-wider text-[#151010] transition-transform hover:scale-105 cursor-pointer shadow-xs"
        >
          {mode === "ascii" ? "View Photo" : "View ASCII"}
        </button>
      </div>
    </div>
  );
}
