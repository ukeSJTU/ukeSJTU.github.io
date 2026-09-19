import { createSocialImage } from "@/lib/site/social-image";

export const dynamic = "force-static";

export function GET() {
  return createSocialImage();
}
