import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "flujoo — Centro de chats",
    short_name: "flujoo",
    description: "Centro de atención por WhatsApp para el agente de flujoo",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#1a1a1a",
    lang: "es",
    icons: [
      {
        src: "/icon.png",
        sizes: "608x608",
        type: "image/png",
        purpose: "any",
      },
    ],
  };
}
