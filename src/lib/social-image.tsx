import { ImageResponse } from "next/og";
import { siteConfig, socialImageConfig } from "@/lib/site";

export const socialImageAlt = socialImageConfig.alt;
export const socialImageSize = socialImageConfig;
export const socialImageContentType = "image/png";

export function createSocialImage() {
  return new ImageResponse(
    <div
      style={{
        alignItems: "flex-start",
        background: "#0a0a0a",
        color: "#fafafa",
        display: "flex",
        flexDirection: "column",
        height: "100%",
        justifyContent: "space-between",
        padding: "80px",
        width: "100%",
      }}
    >
      <div
        style={{
          border: "2px solid #404040",
          borderRadius: "999px",
          display: "flex",
          fontSize: 28,
          padding: "14px 26px",
        }}
      >
        ukesjtu.github.io
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        <div
          style={{ fontSize: 96, fontWeight: 700, letterSpacing: "-0.06em" }}
        >
          {siteConfig.name}
        </div>
        <div style={{ color: "#a3a3a3", fontSize: 38, lineHeight: 1.35 }}>
          技术、学习与创作
        </div>
      </div>
    </div>,
    socialImageSize,
  );
}
