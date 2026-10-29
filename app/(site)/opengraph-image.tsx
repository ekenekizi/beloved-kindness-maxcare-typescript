import { ImageResponse } from "next/og";
import { siteConfig } from "@/config/site";

export const alt =
  "Beloved Kindness Maxcare — Restoring hope. Transforming lives.";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: 64,
        background: "#fffefa",
        color: "#132c40",
        fontFamily: "sans-serif",
      }}
    >
      <div
        style={{
          display: "flex",
          fontSize: 30,
          fontWeight: 700,
        }}
      >
        {siteConfig.name}
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          fontSize: 78,
          fontWeight: 700,
          lineHeight: 1.08,
        }}
      >
        <div style={{ display: "flex", color: "#1f5fff" }}>Restoring hope.</div>

        <div style={{ display: "flex" }}>Transforming lives.</div>
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 16,
        }}
      >
        <div
          style={{
            display: "flex",
            maxWidth: 1000,
            fontSize: 26,
            color: "#52606b",
          }}
        >
          {siteConfig.description}
        </div>

        <div
          style={{
            display: "flex",
            fontSize: 22,
            color: "#1f5fff",
          }}
        >
          {new URL(siteConfig.url).hostname}
        </div>
      </div>
    </div>,
    size,
  );
}
