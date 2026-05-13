import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Simmer",
    short_name: "Simmer",
    description: "A social cookbook for honest home-cooked recipe posts.",
    start_url: "/feed",
    display: "standalone",
    background_color: "#FDF8EE",
    theme_color: "#53131E",
    icons: [
      {
        src: "/simmer-mark.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any"
      },
      {
        src: "/simmer-mark.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "maskable"
      }
    ]
  };
}
