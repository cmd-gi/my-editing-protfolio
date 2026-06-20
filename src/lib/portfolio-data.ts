export type PortfolioCategory = "edited-videos" | "posters" | "ai";

export interface PortfolioItem {
  id: string;
  title: string;
  category: PortfolioCategory;
  thumbnail: string;
  mediaUrl?: string;
  description: string;
  tools: string[];
  client?: string;
  year: string;
  duration?: string;
  prompt?: string;
}

export const categories: { id: PortfolioCategory | "all"; label: string }[] = [
  { id: "all", label: "All Work" },
  { id: "edited-videos", label: "Edited Videos" },
  { id: "posters", label: "Posters & Designs" },
  { id: "ai", label: "AI Creations" },
];

// Placeholder gradient thumbnails — replace thumbnail/mediaUrl with hosted media later.
const grad = (a: string, b: string) =>
  `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1600 1000'><defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'><stop offset='0' stop-color='${a}'/><stop offset='1' stop-color='${b}'/></linearGradient></defs><rect width='1600' height='1000' fill='url(%23g)'/></svg>`;

export const portfolio: PortfolioItem[] = [
  {
    id: "v-01",
    title: "Sanchi Atelier — Campaign Film",
    category: "edited-videos",
    thumbnail: grad("%231a1a1a", "%23D86B1D"),
    mediaUrl: "",
    description: "Cinematic brand film blending product storytelling with editorial color grading.",
    tools: ["DaVinci Resolve", "After Effects"],
    client: "Sanchi Atelier",
    year: "2025",
    duration: "1:42",
  },
  {
    id: "v-02",
    title: "Reel — Festival Recap",
    category: "edited-videos",
    thumbnail: grad("%23161616", "%23444"),
    mediaUrl: "",
    description: "High-energy short-form recap with speed ramping and motion transitions.",
    tools: ["DaVinci Resolve", "CapCut"],
    year: "2025",
    duration: "0:38",
  },
  {
    id: "v-03",
    title: "Brand Promo — Atelier SS26",
    category: "edited-videos",
    thumbnail: grad("%230E0E0E", "%23D86B1D"),
    mediaUrl: "",
    description: "Promotional film with curated color palette and rhythmic cuts.",
    tools: ["After Effects", "DaVinci Resolve"],
    client: "Sanchi Atelier",
    year: "2026",
    duration: "0:54",
  },
  {
    id: "p-01",
    title: "Editorial Poster — Issue 01",
    category: "posters",
    thumbnail: grad("%23222", "%23F5F2EA"),
    description: "Typographic poster series exploring negative space and contrast.",
    tools: ["Photoshop", "Lightroom"],
    year: "2025",
  },
  {
    id: "p-02",
    title: "Campaign Key Art",
    category: "posters",
    thumbnail: grad("%23D86B1D", "%231E1E1E"),
    description: "Print-ready key art for seasonal launch with cinematic retouching.",
    tools: ["Photoshop", "Lightroom"],
    client: "Sanchi Atelier",
    year: "2025",
  },
  {
    id: "p-03",
    title: "Social Tiles — Reel Pack",
    category: "posters",
    thumbnail: grad("%23161616", "%23B3B3B3"),
    description: "Cohesive Instagram tile system designed for narrative flow.",
    tools: ["Canva", "Photoshop"],
    year: "2026",
  },
  {
    id: "ai-01",
    title: "Neon Atelier — Motion Study",
    category: "ai",
    thumbnail: grad("%23000", "%23D86B1D"),
    mediaUrl: "",
    description: "Generative motion experiment blending AI footage with hand-crafted grade.",
    tools: ["Runway", "Kling", "DaVinci Resolve"],
    year: "2026",
    duration: "0:22",
    prompt: "Slow cinematic dolly through a neon-lit atelier, 35mm grain, amber key light",
  },
  {
    id: "ai-02",
    title: "Concept Frames — Flow",
    category: "ai",
    thumbnail: grad("%231E1E1E", "%23F5F2EA"),
    description: "AI-generated concept frames used as moodboard for an editorial campaign.",
    tools: ["Google Flow", "Higgsfield"],
    year: "2026",
    prompt: "Editorial fashion still, soft window light, muted earth tones, medium format film",
  },
  {
    id: "ai-03",
    title: "Veo Loop — Texture Study",
    category: "ai",
    thumbnail: grad("%23D86B1D", "%23000"),
    mediaUrl: "",
    description: "Looping abstract textures generated for a brand intro sequence.",
    tools: ["Veo", "After Effects"],
    year: "2026",
    duration: "0:08",
    prompt: "Macro shot of molten copper folding into silk, slow motion, cinematic lighting",
  },
];