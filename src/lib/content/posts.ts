import { allPosts } from "content-collections";
import { absoluteUrl } from "@/lib/site/config";

export type Post = (typeof allPosts)[number];

export function parsePostDate(date: string) {
  return new Date(`${date}T00:00:00.000Z`);
}

export function getPostPath(path: string) {
  return `/posts/${path}`;
}

export function getPostUrl(path: string) {
  return absoluteUrl(getPostPath(path));
}

export function getPostModifiedAt(post: Post) {
  return parsePostDate(getPostModifiedDate(post));
}

export function getPostModifiedDate(post: Post) {
  return post.updatedAt ?? post.publishedAt;
}

export const sortedPosts = [...allPosts].sort(
  (left, right) =>
    getPostModifiedAt(right).getTime() - getPostModifiedAt(left).getTime(),
);
