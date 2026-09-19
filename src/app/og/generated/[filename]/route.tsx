import { allPosts } from "content-collections";
import {
  getGeneratedPostOgImageFilename,
  type Post,
} from "@/lib/content/posts";
import { createPostSocialImage } from "@/lib/site/social-image";

export const dynamic = "force-static";

function isGeneratedOgImage(post: Post) {
  return !post.ogImage;
}

export function generateStaticParams() {
  return allPosts.filter(isGeneratedOgImage).map((post) => ({
    filename: getGeneratedPostOgImageFilename(post),
  }));
}

export async function GET(
  _request: Request,
  { params }: RouteContext<"/og/generated/[filename]">,
) {
  const { filename } = await params;
  const post = allPosts
    .filter(isGeneratedOgImage)
    .find(
      (candidate) => getGeneratedPostOgImageFilename(candidate) === filename,
    );

  if (!post) {
    return new Response(null, { status: 404 });
  }

  return createPostSocialImage({
    path: post._meta.path,
    title: post.title,
  });
}
