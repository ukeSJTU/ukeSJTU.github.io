import { ImageResponse } from "next/og";
import { siteConfig, socialImageConfig } from "@/lib/site/config";

const palettes = [
  {
    background: "#2d2a2e",
    colors: ["#ff6188", "#fc9867", "#ffd866", "#ab9df2"],
  },
  {
    background: "#221f22",
    colors: ["#a9dc76", "#78dce8", "#ab9df2", "#ffd866"],
  },
  {
    background: "#19181a",
    colors: ["#ff6188", "#78dce8", "#a9dc76", "#ab9df2"],
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
        color: "#fcfcfa",
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
            "linear-gradient(90deg, #19181abf 0%, #19181abf 42%, transparent 100%)",
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
            backgroundColor: "#19181abf",
            border: "2px solid #fcfcfa59",
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
            textShadow: "0 4px 28px #19181abf",
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
