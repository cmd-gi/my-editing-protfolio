import { createFileRoute } from "@tanstack/react-router";
import { Nav } from "@/components/Nav";
import { Portfolio } from "@/components/Portfolio";
import { SmoothScroll } from "@/components/SmoothScroll";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Charan — Video Editor · Colorist · Motion Designer" },
      { name: "description", content: "Cinematic portfolio of Charan: video editing, color grading, motion graphics and AI-assisted creative work for brands and storytellers." },
      { property: "og:title", content: "Charan — Cut. Color. Create." },
      { property: "og:description", content: "Cinematic video editing, color grading, motion graphics and AI-assisted creative work." },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <>
      <SmoothScroll />
      <Nav />
      <Portfolio />
    </>
  );
}
