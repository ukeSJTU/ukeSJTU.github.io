import { allBlogs } from "content-collections";
import { absoluteUrl } from "@/lib/site/config";

export type Post = Omit<(typeof allBlogs)[number], "_meta" | "content">;

// The content build validates identity; callers only receive published fields.
const posts: Post[] = allBlogs.map(({ _meta, content, ...post }) => post);
const postsBySlug = new Map(posts.map((post) => [post.slug, post]));

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

export const sortedBlogPosts = [...posts].sort(
  (left, right) =>
    getPostModifiedAt(right).getTime() - getPostModifiedAt(left).getTime(),
);
