# Make the robot the About section's left column

## Goal
The interactive 3D robot ("say hi to whobee · drag · click · poke") currently sits *below* the About text on the right column. Move it into the **left half** of the About section, replacing all the existing decorative elements there. Remove the Spline watermark and make the robot stage feel on‑brand (warm bg, lime accents).

## Changes (all in `src/components/Portfolio.tsx`, `About` component)

### 1. Replace the entire LEFT column (lines ~161–261)
Remove:
- `DotPattern` background
- floating lime + pink blur blobs
- rotating pink ✺ star
- main polaroid (`portraitAbout` image + "Now Playing" tag + "charan · 2026 / ● rec" footer)
- "grade it like it owes you money" lime sticky note
- `00:00:24:18` timecode chip
- `120+ edits delivered` stats card
- `frame 001…` Marquee film strip

Replace with a single full‑height robot stage:
- Wrapper: `bg-warm` (matches right column) with subtle inner `bg-editorial` panel, lime offset shadow (`shadow-[8px_8px_0_0_var(--lime)]`), thin `border border-paper/15`, generous padding, `min-h-[70vh] md:min-h-0`, fills the column.
- Inside: `<InteractiveRobotSpline scene={ROBOT_SCENE_URL} className="!w-full !h-full" />` absolutely positioned to fill.
- Keep the two small chips already used with the robot, repositioned for the bigger stage:
  - top-left: `// say hi to whobee` (mono label, ash)
  - top-right: `drag · click · poke` (mono label, lime)
  - bottom-left: `★ studio mascot` (signal chip)
  - bottom-right: `live · 3d` (paper chip)

### 2. Remove the robot block from the RIGHT column (lines ~334–351)
Delete the whole `{/* Interactive 3D robot — fills the empty space, playful touch */}` block so the robot only lives on the left.

### 3. Hide the Spline watermark
Spline renders a "Built with Spline" badge at the bottom-right of the canvas. Cover it with a small absolutely-positioned overlay matching `bg-warm`/`bg-editorial` inside the stage wrapper (e.g. `absolute bottom-0 right-0 w-[180px] h-[48px] bg-editorial z-20 pointer-events-none`). The `live · 3d` chip sits above it so the corner still looks intentional.

### 4. Theme-match the robot
The Spline scene's geometry colors are baked in, but we can make the *stage* feel on-theme:
- Backdrop: `bg-editorial` (white) wrapped in `bg-warm` outer, with a soft radial lime glow behind the robot (`absolute inset-0 bg-[radial-gradient(circle_at_50%_60%,var(--lime)/25,transparent_60%)]`).
- Optional subtle `mix-blend-multiply` tint layer in lime at very low opacity to nudge the robot's color toward our palette without washing it out. Keep opacity ≤ 15% so the model stays readable.
- Loading fallback already uses `bg-warm` + lime spinner — keep as-is.

### 5. Clean up unused imports
After removing the collage:
- `portraitAbout` import (line 2) — remove if unused elsewhere.
- `DotPattern`, `Marquee` — remove from the imports only if no other section uses them (verify with a quick grep before deleting).

## Out of scope
- No changes to the right column (heading, stats, expertise, tools).
- No new routes, data, or dependencies.
- Spline scene URL stays the same; we're not swapping models.

## Verification
- Load `/`, scroll to About: robot fills the left half, right column unchanged.
- No "Built with Spline" badge visible.
- Resize to mobile: robot stage stacks above the text, still interactive, no horizontal scroll.
