import { allPosts } from "content-collections";
import { absoluteUrl } from "@/lib/site";

export function parsePostDate(date: string) {
  return new Date(`${date}T00:00:00.000Z`);
}

export function getPostPath(path: string) {
  return `/posts/${path}`;
}

export function getPostUrl(path: string) {
  return absoluteUrl(getPostPath(path));
}

export function getPostModifiedAt(post: (typeof allPosts)[number]) {
  return parsePostDate(getPostModifiedDate(post));
}

export function getPostModifiedDate(post: (typeof allPosts)[number]) {
  return post.updatedAt ?? post.publishedAt;
}

export const sortedPosts = [...allPosts].sort(
  (left, right) =>
    getPostModifiedAt(right).getTime() - getPostModifiedAt(left).getTime(),
);
