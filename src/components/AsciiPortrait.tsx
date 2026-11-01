import { useEffect, useRef, useCallback } from "react";
import portraitHero from "@/assets/heo-portait.png";

// Characters matching reference artwork
const DENSITY_CHARS = "   ..··::--==++**##%%@@";
const OUTLINE_CHARS = ["+", "-", "|", "=", "*", "+", "·", "+"];

export function AsciiPortrait({ className = "" }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Cached image data & edge maps
  const imgDataRef = useRef<{
    width: number;
    height: number;
    luminance: Float32Array;
    isEdge: Uint8Array;
    isSilhouette: Uint8Array;
  } | null>(null);

  const animFrameRef = useRef<number | null>(null);
  const mousePosRef = useRef<{ x: number; y: number }>({ x: 0.5, y: 0.5 });

  // Load and pre-process portrait into luminance & edge contour maps
  useEffect(() => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = portraitHero;
    img.onload = () => {
      const COLS = 76; // Crisp high-res ASCII grid
      const ROWS = 96;

      const offCanvas = document.createElement("canvas");
      offCanvas.width = COLS;
      offCanvas.height = ROWS;
      const offCtx = offCanvas.getContext("2d", { willReadFrequently: true });
      if (!offCtx) return;

      offCtx.drawImage(img, 0, 0, COLS, ROWS);
      const raw = offCtx.getImageData(0, 0, COLS, ROWS);
      const pixels = raw.data;

      const luminance = new Float32Array(COLS * ROWS);
      const isEdge = new Uint8Array(COLS * ROWS);
      const isSilhouette = new Uint8Array(COLS * ROWS);

      for (let i = 0; i < COLS * ROWS; i++) {
        const r = pixels[i * 4];
        const g = pixels[i * 4 + 1];
        const b = pixels[i * 4 + 2];
        const a = pixels[i * 4 + 3] / 255;
        luminance[i] = (0.299 * r + 0.587 * g + 0.114 * b) * a;
      }

      const getLum = (row: number, col: number) => {
        if (row < 0 || row >= ROWS || col < 0 || col >= COLS) return 0;
        return luminance[row * COLS + col];
      };

      // Detect outline & silhouette perimeter
      for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
          const idx = r * COLS + c;
          const lum = luminance[idx];

          if (lum > 22) {
            // Check if boundary neighbor is dark
            const isBoundary =
              getLum(r - 1, c) < 22 ||
              getLum(r + 1, c) < 22 ||
              getLum(r, c - 1) < 22 ||
              getLum(r, c + 1) < 22;

            if (isBoundary) {
              isSilhouette[idx] = 1;
            }

            // Sobel edge gradient for internal structural contours
            const gx =
              getLum(r - 1, c + 1) + 2 * getLum(r, c + 1) + getLum(r + 1, c + 1) -
              (getLum(r - 1, c - 1) + 2 * getLum(r, c - 1) + getLum(r + 1, c - 1));
            const gy =
              getLum(r + 1, c - 1) + 2 * getLum(r + 1, c) + getLum(r + 1, c + 1) -
              (getLum(r - 1, c - 1) + 2 * getLum(r - 1, c) + getLum(r - 1, c + 1));
            const grad = Math.sqrt(gx * gx + gy * gy);

            if (grad > 90) {
              isEdge[idx] = 1;
            }
          }
        }
      }

      imgDataRef.current = {
        width: COLS,
        height: ROWS,
        luminance,
        isEdge,
        isSilhouette,
      };
    };
  }, []);

  // Track cursor position for subtle aura light direction
  const handlePointerMove = useCallback((e: MouseEvent | PointerEvent) => {
    const container = containerRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    mousePosRef.current = {
      x: (e.clientX - rect.left) / rect.width,
      y: (e.clientY - rect.top) / rect.height,
    };
  }, []);

  useEffect(() => {
    window.addEventListener("pointermove", handlePointerMove);
    return () => window.removeEventListener("pointermove", handlePointerMove);
  }, [handlePointerMove]);

  // Main Render & Animation Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const render = (now: number) => {
      const data = imgDataRef.current;
      if (!data) {
        animFrameRef.current = requestAnimationFrame(render);
        return;
      }

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const displayWidth = canvas.clientWidth;
      const displayHeight = canvas.clientHeight;

      if (canvas.width !== displayWidth * dpr || canvas.height !== displayHeight * dpr) {
        canvas.width = displayWidth * dpr;
        canvas.height = displayHeight * dpr;
      }

      ctx.save();
      ctx.scale(dpr, dpr);

      // Deep dark background
      ctx.fillStyle = "#120F10";
      ctx.fillRect(0, 0, displayWidth, displayHeight);

      const time = now * 0.001;

      // Radiant Aura (pulsing behind the body silhouette)
      const auraBreath = Math.sin(time * 1.5) * 0.04;
      const auraCenterX = displayWidth * (0.52 + (mousePosRef.current.x - 0.5) * 0.06);
      const auraCenterY = displayHeight * (0.36 + (mousePosRef.current.y - 0.5) * 0.06);

      const auraGradient = ctx.createRadialGradient(
        auraCenterX,
        auraCenterY,
        25,
        auraCenterX,
        auraCenterY,
        displayWidth * (0.5 + auraBreath)
      );
      auraGradient.addColorStop(0, "rgba(206, 255, 0, 0.32)");
      auraGradient.addColorStop(0.35, "rgba(206, 255, 0, 0.14)");
      auraGradient.addColorStop(0.65, "rgba(0, 57, 255, 0.08)");
      auraGradient.addColorStop(1, "rgba(18, 15, 16, 0)");

      ctx.fillStyle = auraGradient;
      ctx.fillRect(0, 0, displayWidth, displayHeight);

      // Cell dimensions
      const cellW = displayWidth / data.width;
      const cellH = displayHeight / data.height;
      const fontSize = Math.max(8, Math.floor(cellH * 1.05));
      ctx.font = `bold ${fontSize}px "IBM Plex Mono", monospace`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      // Render ASCII glyphs
      for (let r = 0; r < data.height; r++) {
        for (let c = 0; c < data.width; c++) {
          const idx = r * data.width + c;
          const lum = data.luminance[idx];

          if (lum < 10) continue;

          const isSil = data.isSilhouette[idx] === 1;
          const isEdg = data.isEdge[idx] === 1;

          let ch = " ";
          let color = "#FFF7EC";

          // ANIMATE THE BODY OUTLINE & SILHOUETTE PERIMETER
          if (isSil) {
            // Flowing beam animation traveling continuously along the silhouette
            const wave = Math.sin(time * 3.5 + (r + c) * 0.22);
            const outlineCharIdx = Math.floor(
              (time * 5 + r * 0.4 + c * 0.3) % OUTLINE_CHARS.length
            );
            ch = OUTLINE_CHARS[Math.abs(outlineCharIdx)];

            // Electric lime glow and pulse along the perimeter
            if (wave > 0.4) {
              color = "#CEFF00"; // Glowing Lime pulse
            } else if (wave > -0.2) {
              color = "#BEEBFD"; // Sky Blue shimmer
            } else {
              color = "#FFFFFF"; // Crisp white
            }
          } else if (isEdg && lum > 60) {
            // Subtle edge shimmer along structural contours (collar, shoulders)
            const edgeWave = Math.sin(time * 2.2 + r * 0.18 - c * 0.12);
            ch = edgeWave > 0.2 ? "+" : "-";
            color = edgeWave > 0.5 ? "#CEFF00" : "rgba(255, 247, 236, 0.85)";
          } else {
            // NATURAL, FAITHFUL FACE & BODY INTERIOR (no artificial eye distortion)
            const normalizedLum = Math.min(1, Math.max(0, lum / 255));
            const charIdx = Math.floor(normalizedLum * (DENSITY_CHARS.length - 1));
            ch = DENSITY_CHARS[charIdx];

            if (normalizedLum > 0.72) {
              color = "#FFF7EC"; // Bright highlights
            } else if (normalizedLum > 0.4) {
              color = "#F0E8D8"; // Midtones
            } else {
              color = "rgba(255, 247, 236, 0.45)"; // Shadows & contours
            }
          }

          if (ch === " ") continue;

          const x = c * cellW + cellW * 0.5;
          const y = r * cellH + cellH * 0.5;

          ctx.fillStyle = color;
          ctx.fillText(ch, x, y);
        }
      }

      ctx.restore();
      animFrameRef.current = requestAnimationFrame(render);
    };

    animFrameRef.current = requestAnimationFrame(render);
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`relative w-full max-w-[460px] aspect-[4/5] rounded-[28px] border-3 border-[#151010] overflow-hidden bg-[#120F10] shadow-[8px_8px_0px_#151010] select-none ${className}`}
    >
      <canvas ref={canvasRef} className="w-full h-full object-cover block" />
    </div>
  );
}
