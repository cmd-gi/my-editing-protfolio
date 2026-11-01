import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const VideoItemSchema = z.object({
  id: z.string(),
  src: z.string(),
  title: z.string(),
  category: z.enum([
    "real-estate",
    "restaurant",
    "promo",
    "clinic",
    "catering",
    "school",
    "motion-graphics",
  ]),
  ratio: z.enum(["9:16", "16:9", "1:1"]),
});

export const saveVideosToCodebase = createServerFn({ method: "POST" })
  .inputValidator(z.object({
    videos: z.array(VideoItemSchema),
    enableArrangeMode: z.boolean().optional().default(true),
  }))
  .handler(async ({ data }) => {
    // Only runs on the server (Node.js runtime in Vite/Nitro dev/build)
    try {
      const fs = await import("node:fs/promises");
      const path = await import("node:path");
      
      const filePath = path.resolve(process.cwd(), "src/data/videos.ts");

      const fileContent = `export type VideoRatio = "9:16" | "16:9" | "1:1";

export type VideoCategory =
  | "real-estate"
  | "restaurant"
  | "promo"
  | "clinic"
  | "catering"
  | "school"
  | "motion-graphics";

export interface VideoItem {
  id: string;
  src: string;
  title: string;
  category: VideoCategory;
  ratio: VideoRatio;
}

export const VIDEO_CATEGORIES: { id: "all" | VideoCategory; label: string }[] = [
  { id: "all", label: "All Videos" },
  { id: "real-estate", label: "Real Estate" },
  { id: "restaurant", label: "Restaurant & Food" },
  { id: "promo", label: "Brand & Promos" },
  { id: "clinic", label: "Healthcare & Clinic" },
  { id: "catering", label: "Catering & Hospitality" },
  { id: "school", label: "School & Events" },
  { id: "motion-graphics", label: "Motion Graphics" },
];

/**
 * TOGGLE ARRANGE / EDIT MODE FEATURE
 * Set this to \`false\` whenever you want to disable and hide the web reorder/editing mode.
 */
export const ENABLE_ARRANGE_MODE = ${data.enableArrangeMode ? "true" : "false"};

export const INITIAL_VIDEOS: VideoItem[] = ${JSON.stringify(data.videos, null, 2)};
`;

      await fs.writeFile(filePath, fileContent, "utf-8");
      return { success: true, count: data.videos.length };
    } catch (err) {
      console.error("Failed to write videos to codebase:", err);
      return { success: false, error: String(err) };
    }
  });
