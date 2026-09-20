import Link from "next/link";
import {
  getPostModifiedAt,
  getPostModifiedDate,
  getPostPath,
  type Post,
} from "@/lib/content/posts";
import { siteConfig } from "@/lib/site/config";

const dateFormatter = new Intl.DateTimeFormat(siteConfig.language, {
  dateStyle: "medium",
  timeZone: "Asia/Shanghai",
});

export function PostList({ posts }: { posts: Post[] }) {
  return (
    <ul className="post-list">
      {posts.map((post) => (
        <li key={post._meta.path}>
          <Link
            className="post-list-link group"
            href={getPostPath(post._meta.path)}
          >
            <div className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6">
              <h3 className="text-xl font-semibold underline-offset-4 group-hover:underline">
                {post.title}
              </h3>
              <time
                className="text-muted-foreground shrink-0 text-sm tabular-nums"
                dateTime={getPostModifiedDate(post)}
              >
                {dateFormatter.format(getPostModifiedAt(post))}
              </time>
            </div>
            <p className="text-muted-foreground mt-2 leading-relaxed">
              {post.summary}
            </p>
          </Link>
        </li>
      ))}
    </ul>
  );
}
