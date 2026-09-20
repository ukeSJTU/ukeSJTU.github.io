import { allBlogs } from "content-collections";
import { absoluteUrl } from "@/lib/site/config";

export type Post = (typeof allBlogs)[number];

const postsBySlug = new Map<string, Post>();

for (const post of allBlogs) {
  const existingPost = postsBySlug.get(post.slug);

  if (existingPost) {
    throw new Error(
      `Duplicate blog slug "${post.slug}" in "${existingPost._meta.path}" and "${post._meta.path}"`,
    );
  }

  postsBySlug.set(post.slug, post);
}

export function parsePostDate(date: string) {
  return new Date(`${date}T00:00:00.000Z`);
}

export function getPostBySlug(slug: string) {
  return postsBySlug.get(slug);
}

export function getPostPath(post: Pick<Post, "slug">) {
  return `/blog/${post.slug}`;
}

export function getPostUrl(post: Pick<Post, "slug">) {
  return absoluteUrl(getPostPath(post));
}

export function getPostModifiedAt(post: Post) {
  return parsePostDate(getPostModifiedDate(post));
}

export function getPostModifiedDate(post: Post) {
  return post.updatedAt ?? post.publishedAt;
}

export const sortedBlogPosts = [...allBlogs].sort(
  (left, right) =>
    getPostModifiedAt(right).getTime() - getPostModifiedAt(left).getTime(),
);
