import { ImageResponse } from "next/og";
import { siteConfig, socialImageConfig } from "@/lib/site/config";

const palettes = [
  {
    background: "#1428a0",
    colors: ["#7f8cff", "#55d8ff", "#cb8cff", "#1847d7"],
  },
  {
    background: "#a73500",
    colors: ["#ff8a00", "#ffca76", "#ff3d00", "#ff7a45"],
  },
  {
    background: "#006f67",
    colors: ["#16c784", "#68ead2", "#23b7ef", "#b4ef5a"],
  },
  {
    background: "#7136a8",
    colors: ["#f173d2", "#8db6ff", "#536dfe", "#d6a4ff"],
  },
  {
    background: "#8a1f54",
    colors: ["#ff5f9e", "#ff9b71", "#725cff", "#55d8ff"],
  },
] as const;

function hashSeed(value: string) {
  let hash = 0x811c9dc5;

  for (const character of value) {
    hash ^= character.codePointAt(0) ?? 0;
    hash = Math.imul(hash, 0x01000193);
  }

  return hash >>> 0;
}

function createRandom(seed: number) {
  let state = seed;

  return () => {
    state += 0x6d2b79f5;
    let value = state;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4_294_967_296;
  };
}

function getTitleFontSize(title: string) {
  const length = Array.from(title).length;

  if (length <= 18) {
    return 86;
  }

  if (length <= 32) {
    return 74;
  }

  if (length <= 52) {
    return 62;
  }

  return 52;
}

type SocialImageOptions = {
  eyebrow: string;
  seed: string;
  title: string;
};

function renderSocialImage({ eyebrow, seed, title }: SocialImageOptions) {
  const random = createRandom(hashSeed(seed));
  const palette = palettes[Math.floor(random() * palettes.length)];
  const blobs = palette.colors.map((color, index) => {
    const size = Math.round(720 + random() * 620);

    return {
      color,
      filter: `blur(${Math.round(35 + random() * 65)}px)`,
      height: size,
      left: Math.round(-360 + random() * 1_250),
      opacity: 0.78 + random() * 0.2,
      rotate: Math.round(-35 + random() * 70),
      top: Math.round(-390 + random() * 860),
      width: Math.round(size * (0.72 + random() * 0.7)),
      index,
    };
  });

  return new ImageResponse(
    <div
      lang="zh-CN"
      style={{
        alignItems: "stretch",
        backgroundColor: palette.background,
        color: "#ffffff",
        display: "flex",
        height: "100%",
        overflow: "hidden",
        position: "relative",
        width: "100%",
      }}
    >
      {blobs.map((blob) => (
        <div
          key={`${blob.color}-${blob.index}`}
          style={{
            backgroundImage: `radial-gradient(circle at center, ${blob.color} 0%, ${blob.color} 22%, transparent 72%)`,
            filter: blob.filter,
            height: blob.height,
            left: blob.left,
            opacity: blob.opacity,
            position: "absolute",
            top: blob.top,
            transform: `rotate(${blob.rotate}deg)`,
            width: blob.width,
          }}
        />
      ))}

      <div
        style={{
          backgroundImage:
            "linear-gradient(90deg, rgba(4, 8, 20, 0.6) 0%, rgba(4, 8, 20, 0.28) 58%, rgba(4, 8, 20, 0.08) 100%)",
          bottom: 0,
          left: 0,
          position: "absolute",
          right: 0,
          top: 0,
        }}
      />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
          justifyContent: "space-between",
          padding: "68px 76px 70px",
          position: "relative",
          width: "100%",
        }}
      >
        <div
          style={{
            alignItems: "center",
            alignSelf: "flex-start",
            backgroundColor: "rgba(4, 8, 20, 0.2)",
            border: "2px solid rgba(255, 255, 255, 0.48)",
            borderRadius: 999,
            display: "flex",
            fontSize: 25,
            fontWeight: 600,
            letterSpacing: "0.01em",
            padding: "11px 22px",
          }}
        >
          {eyebrow}
        </div>

        <div
          style={{
            display: "flex",
            fontSize: getTitleFontSize(title),
            fontWeight: 700,
            letterSpacing: "-0.045em",
            lineHeight: 1.08,
            maxWidth: 1_030,
            textShadow: "0 4px 28px rgba(0, 0, 0, 0.3)",
          }}
        >
          {title}
        </div>
      </div>
    </div>,
    socialImageConfig,
  );
}

export function createSocialImage() {
  return renderSocialImage({
    eyebrow: "ukesjtu.github.io",
    seed: siteConfig.url,
    title: siteConfig.name,
  });
}

export function createPostSocialImage({
  path,
  title,
}: {
  path: string;
  title: string;
}) {
  return renderSocialImage({
    eyebrow: siteConfig.name,
    seed: path,
    title,
  });
}
