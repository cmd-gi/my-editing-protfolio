export type PortfolioCategory = "edited-videos" | "posters";

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
}

export const categories: { id: PortfolioCategory | "all"; label: string }[] = [
  { id: "all", label: "All Work" },
  { id: "edited-videos", label: "Edited Videos" },
  { id: "posters", label: "Posters & Designs" },
];

// Posters served directly from Cloudinary in the exact order provided.
const POSTER_URLS: string[] = [
  "https://res.cloudinary.com/drjczsj9l/image/upload/q_auto/f_auto/v1781954289/Poster2_mfcxop.png",
  "https://res.cloudinary.com/drjczsj9l/image/upload/q_auto/f_auto/v1781954279/10_l1uzli.png",
  "https://res.cloudinary.com/drjczsj9l/image/upload/q_auto/f_auto/v1781954279/1_m5dnxw.png",
  "https://res.cloudinary.com/drjczsj9l/image/upload/q_auto/f_auto/v1781954272/Wedding_Invitation_qbzbz7.png",
  "https://res.cloudinary.com/drjczsj9l/image/upload/q_auto/f_auto/v1781954268/0_rosowq.png",
  "https://res.cloudinary.com/drjczsj9l/image/upload/q_auto/f_auto/v1781954267/h2_w88jwz.jpg",
  "https://res.cloudinary.com/drjczsj9l/image/upload/q_auto/f_auto/v1781954264/Owners_ptvvfb.png",
  "https://res.cloudinary.com/drjczsj9l/image/upload/q_auto/f_auto/v1781954242/Invitation_poster__F1_gzcudl.png",
  "https://res.cloudinary.com/drjczsj9l/image/upload/q_auto/f_auto/v1781954240/4_tnq0i6.png",
  "https://res.cloudinary.com/drjczsj9l/image/upload/q_auto/f_auto/v1781954236/2_wor022.png",
  "https://res.cloudinary.com/drjczsj9l/image/upload/q_auto/f_auto/v1781954233/01_wdkscx.png",
];

export const portfolio: PortfolioItem[] = POSTER_URLS.map((url, i) => ({
  id: `p-${String(i + 1).padStart(2, "0")}`,
  title: `Poster ${String(i + 1).padStart(2, "0")}`,
  category: "posters",
  thumbnail: url,
  description: "",
  tools: [],
  year: "2025",
}));
