import Link from "next/link";
import { getTagPath, type TagGroup } from "@/lib/content/tags";

export function TagIndex({ groups }: { groups: TagGroup[] }) {
  return (
    <nav aria-label="Tags by initial">
      {groups.map((group) => (
        <section
          aria-labelledby={`tags-${group.initial}`}
          className="border-border grid gap-3 border-b py-6 sm:grid-cols-[3rem_minmax(0,1fr)] sm:gap-6"
          key={group.initial}
        >
          <h2
            className="text-muted-foreground text-lg font-medium"
            id={`tags-${group.initial}`}
          >
            {group.initial}
          </h2>
          <ul className="grid gap-x-8 sm:grid-cols-2 min-[1400px]:grid-cols-3">
            {group.tags.map((tag) => (
              <li key={tag.slug}>
                <Link
                  className="hover:bg-muted hover:text-primary -mx-2 flex items-baseline justify-between gap-4 rounded-sm px-2 py-2"
                  href={getTagPath(tag)}
                  transitionTypes={["nav-forward"]}
                >
                  <span>{tag.name}</span>
                  <span className="text-muted-foreground text-sm tabular-nums">
                    {tag.posts.length}
                    <span className="sr-only"> articles</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </nav>
  );
}
