import {
  Geist,
  Geist_Mono,
  Noto_Serif_SC,
  Source_Serif_4,
} from "next/font/google";

const geistSans = Geist({
  display: "swap",
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

const geistMono = Geist_Mono({
  display: "swap",
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

const sourceSerif = Source_Serif_4({
  axes: ["opsz"],
  display: "swap",
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-source-serif",
});

const notoSerifSc = Noto_Serif_SC({
  display: "swap",
  preload: false,
  variable: "--font-noto-serif-sc",
  weight: ["400", "600"],
});

export const fontVariables = [
  geistSans.variable,
  geistMono.variable,
  sourceSerif.variable,
  notoSerifSc.variable,
].join(" ");
